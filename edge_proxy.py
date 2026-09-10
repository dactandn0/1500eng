#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Edge TTS proxy + static server (stdlib only, no pip install).
Chay thay cho `python -m http.server 8888`:

    python edge_proxy.py [port]

- Phuc vu file tinh nhu cu (http://localhost:8888/).
- Them API same-origin cho browser:
    GET  /api/edge-status
    GET  /api/edge-tts?voice=en-US-GuyNeural&text=hello
    POST /api/edge-tts  {"voice": "...", "text": "...", "rate": "+0%", "pitch": "+0Hz"}

Vi sao can proxy?
- Browser WebSocket LUON gui `Origin: http://localhost:8888` va khong cho set
  `User-Agent: ... Edg/...`. Server speech.platform.bing.com hay 403 truc tiep
  tu browser (loi: `wss://... failed:` trong Console).
- Proxy Python mo WS bang socket thuong -> tu set header Edg chuan -> lay mp3
  ve, browser chi can fetch() cung origin, khong con CORS/WSS/Origin.
"""
import base64
import hashlib
import json
import os
import random
import socket
import ssl
import struct
import time
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HOST = "0.0.0.0"  # mo cho LAN (iPhone/Android) chu khong chi localhost
TRUSTED_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4"
EDGE_HOST = "speech.platform.bing.com"
EDGE_PORT = 443
CHROMIUM_FULL = "143.0.3650.75"
CHROMIUM_MAJOR = "143"
GEC_VERSION = "1-" + CHROMIUM_FULL
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/%s.0.0.0 Safari/537.36 Edg/%s.0.0.0"
      % (CHROMIUM_MAJOR, CHROMIUM_MAJOR))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# ---------- Sec-MS-GEC ----------
def sec_ms_gec():
    win_epoch = 11644473600
    sec = int(time.time())
    ticks = sec + win_epoch
    ticks -= ticks % 300
    raw = str(ticks * 10000000) + TRUSTED_TOKEN
    return hashlib.sha256(raw.encode("ascii")).hexdigest().upper()


def conn_id():
    return "%032x" % random.getrandbits(128)


def ws_key():
    return base64.b64encode(os.urandom(16)).decode("ascii")


# ---------- WS frame helpers (client -> masked, server -> unmasked) ----------
def ws_send_text(sock, text):
    data = text.encode("utf-8")
    mask = os.urandom(4)
    head = bytes([0x81])
    n = len(data)
    if n < 126:
        head += struct.pack("!B", 0x80 | n)
    elif n < 65536:
        head += struct.pack("!BH", 0x80 | 126, n)
    else:
        head += struct.pack("!BQ", 0x80 | 127, n)
    masked = bytes(b ^ mask[i % 4] for i, b in enumerate(data))
    sock.sendall(head + mask + masked)


def ws_send_close(sock):
    mask = os.urandom(4)
    sock.sendall(bytes([0x88, 0x80]) + mask)


def ws_recv_frame(rf):
    """Doc 1 WS frame tu server. Tra (opcode, payload bytes)."""
    hdr = rf.read(2)
    if len(hdr) < 2:
        raise ConnectionError("ws closed")
    b1, b2 = hdr[0], hdr[1]
    opcode = b1 & 0x0F
    masked = (b2 & 0x80) != 0
    ln = b2 & 0x7F
    if ln == 126:
        ln = struct.unpack("!H", rf.read(2))[0]
    elif ln == 127:
        ln = struct.unpack("!Q", rf.read(8))[0]
    key = rf.read(4) if masked else None
    payload = b""
    while len(payload) < ln:
        chunk = rf.read(ln - len(payload))
        if not chunk:
            raise ConnectionError("ws truncated")
        payload += chunk
    if masked and key:
        payload = bytes(b ^ key[i % 4] for i, b in enumerate(payload))
    return opcode, payload


def xml_escape(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;")
             .replace(">", "&gt;"))


def clean_text(s):
    return "".join(" " if (ord(c) < 32 and c not in ("\n", "\t")) else c
                   for c in s)


def build_ssml(voice, text, rate="+0%", pitch="+0Hz"):
    lang = "-".join(voice.split("-")[:2]) or "en-US"
    return ("<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' "
            "xml:lang='%s'><voice name='%s'>"
            "<prosody pitch='%s' rate='%s' volume='+0%%'>%s</prosody>"
            "</voice></speak>"
            % (lang, voice, pitch, rate, xml_escape(clean_text(text))))


def edge_fetch_mp3(voice, text, rate="+0%", pitch="+0Hz", timeout=20):
    text = (text or "").strip()
    if not text:
        raise ValueError("empty text")
    text = text[:6000]
    gec = sec_ms_gec()
    path = ("/consumer/speech/synthesize/readaloud/edge/v1"
            "?TrustedClientToken=" + TRUSTED_TOKEN +
            "&ConnectionId=" + conn_id() +
            "&Sec-MS-GEC=" + gec +
            "&Sec-MS-GEC-Version=" + urllib.parse.quote(GEC_VERSION))
    req = ("\r\n".join([
        "GET %s HTTP/1.1" % path,
        "Host: " + EDGE_HOST,
        "Upgrade: websocket",
        "Connection: Upgrade",
        "Sec-WebSocket-Version: 13",
        "Sec-WebSocket-Key: " + ws_key(),
        "User-Agent: " + UA,
        "Accept-Language: en-US,en;q=0.9",
        "Pragma: no-cache",
        "Cache-Control: no-cache",
        "", ""]))
    sock = socket.create_connection((EDGE_HOST, EDGE_PORT), timeout=timeout)
    try:
        ctx = ssl.create_default_context()
        sock = ctx.wrap_socket(sock, server_hostname=EDGE_HOST)
        sock.settimeout(timeout)
        sock.sendall(req.encode("ascii"))
        rf = sock.makefile("rb")
        # status line
        status = rf.readline().decode("latin1")
        if " 101 " not in status:
            raise ConnectionError("edge handshake: " + status.strip())
        # skip headers
        while True:
            line = rf.readline()
            if line in (b"\r\n", b"\n", b""):
                break
        # speech.config
        ws_send_text(sock,
                     "X-Timestamp:" + time.strftime("%a %b %d %Y %H:%M:%S GMT+0000",
                                                    time.gmtime()) + "\r\n"
                     "Content-Type:application/json; charset=utf-8\r\n"
                     "Path:speech.config\r\n\r\n"
                     '{"context":{"synthesis":{"audio":{"metadataoptions":'
                     '{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},'
                     '"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n')
        ws_send_text(sock,
                     "X-RequestId:" + conn_id() + "\r\n"
                     "Content-Type:application/ssml+xml\r\n"
                     "X-Timestamp:" + time.strftime("%a %b %d %Y %H:%M:%S GMT+0000",
                                                    time.gmtime()) + "Z\r\n"
                     "Path:ssml\r\n\r\n" + build_ssml(voice, text, rate, pitch))
        audio = bytearray()
        end = time.time() + timeout
        while time.time() < end:
            opcode, payload = ws_recv_frame(rf)
            if opcode == 0x8:  # close
                break
            if opcode == 0x9:  # ping -> pong (text empty)
                try:
                    sock.sendall(bytes([0x8A, 0x80]) + os.urandom(4))
                except OSError:
                    pass
                continue
            if opcode == 0x1:  # text
                try:
                    s = payload.decode("utf-8", "ignore")
                except Exception:
                    s = ""
                if "Path:turn.end" in s:
                    break
                continue
            if opcode == 0x2 and len(payload) >= 2:  # binary
                hlen = struct.unpack("!H", payload[:2])[0]
                try:
                    header = payload[2:2 + hlen].decode("utf-8", "ignore")
                except Exception:
                    header = ""
                if "Path:audio" in header:
                    audio += payload[2 + hlen:]
        try:
            ws_send_close(sock)
        except OSError:
            pass
        if not audio:
            raise ConnectionError("edge returned no audio")
        return bytes(audio)
    finally:
        try:
            sock.close()
        except OSError:
            pass


# ---------- HTTP server ----------
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=BASE_DIR, **kw)

    def log_message(self, fmt, *args):
        pass  # bot spam console

    def _send(self, code, body, ctype="application/json; charset=utf-8"):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/edge-status":
            self._send(200, '{"ok": true, "proxy": "edge"}')
            return
        if parsed.path == "/api/edge-tts":
            q = urllib.parse.parse_qs(parsed.query)
            voice = (q.get("voice", ["en-US-AriaNeural"])[0] or
                     "en-US-AriaNeural")
            text = q.get("text", [""])[0]
            rate = q.get("rate", ["+0%"])[0]
            pitch = q.get("pitch", ["+0Hz"])[0]
            try:
                mp3 = edge_fetch_mp3(voice, text, rate, pitch)
            except Exception as e:
                self._send(502, json.dumps({"ok": False,
                                            "error": str(e)[:300]}))
                return
            self._send(200, mp3, "audio/mpeg")
            return
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/edge-tts":
            try:
                n = int(self.headers.get("Content-Length", 0))
            except (TypeError, ValueError):
                n = 0
            try:
                data = json.loads(self.rfile.read(n).decode("utf-8") or "{}")
            except Exception:
                data = {}
            voice = data.get("voice") or "en-US-AriaNeural"
            text = data.get("text") or ""
            rate = data.get("rate") or "+0%"
            pitch = data.get("pitch") or "+0Hz"
            try:
                mp3 = edge_fetch_mp3(voice, text, rate, pitch)
            except Exception as e:
                self._send(502, json.dumps({"ok": False,
                                            "error": str(e)[:300]}))
                return
            self._send(200, mp3, "audio/mpeg")
            return
        self._send(404, '{"ok": false, "error": "not found"}')


if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8888
    srv = ThreadingHTTPServer((HOST, port), Handler)
    lan = None
    try:
        _s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        _s.connect(("8.8.8.8", 80))
        lan = _s.getsockname()[0]
        _s.close()
    except OSError:
        lan = None
    print("Serving %s at http://localhost:%d/ (Edge TTS proxy ON)" %
          (BASE_DIR, port))
    if lan:
        print("iPhone/Android cung wifi mo: http://%s:%d/" % (lan, port))
        print("(Windows Firewall hoi thi chon Allow / Private network.)")
    print("Dung Ctrl+C de dung.")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
