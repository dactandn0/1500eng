#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
serve.py - static server thay `python -m http.server`, CO ho tro Range requests.
Can de seek video/audio local (http.server chuan khong ho tro Range -> seek liet).

Dung: python watch/serve.py [port]   (phuc vu thu muc goc repo)
"""
import os
import re
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8888

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass


class RangeHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        if self.command != 'GET':
            return super().send_head()
        path = self.translate_path(self.path.split('?', 1)[0].split('#', 1)[0])
        if not os.path.isfile(path):
            return super().send_head()
        rng = self.headers.get('Range')
        if not rng:
            return super().send_head()
        m = re.match(r'bytes=(\d*)-(\d*)$', rng.strip())
        if not m:
            return super().send_head()
        size = os.path.getsize(path)
        start = int(m.group(1)) if m.group(1) else 0
        end = int(m.group(2)) if m.group(2) else size - 1
        if m.group(1) == '':
            # bytes=-N : N bytes cuoi
            n = int(m.group(2) or 0)
            start, end = max(0, size - n), size - 1
        start = max(0, min(start, size - 1))
        end = max(start, min(end, size - 1))
        length = end - start + 1
        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
            f.seek(start)
        except OSError:
            self.send_error(404)
            return None
        self.send_response(206)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(length))
        self.send_header('Content-Range', 'bytes %d-%d/%d' % (start, end, size))
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()
        self.wfile.write(f.read(length))
        f.close()
        return None

    def end_headers(self):
        try:
            self.send_header('Accept-Ranges', 'bytes')
        except Exception:
            pass
        super().end_headers()

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    srv = ThreadingHTTPServer(('0.0.0.0', PORT),
                              partial(RangeHandler, directory=ROOT))
    print('Serving %s at http://localhost:%d/ (Range OK -> seek video duoc)' % (ROOT, PORT))
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
