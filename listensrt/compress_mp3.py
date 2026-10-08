#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
compress_mp3.py - giam dung luong mp3 bai nghe (giong noi): mono + bitrate thap.
  - File nao hieu qua da <= bitrate muc tieu thi BO QUA (khong encode lai).
  - Chi thay file goc khi ban nen NHO HON (an toan).
  - Giu nguyen file neu encode loi.

Dung:
    python listensrt/compress_mp3.py --dry-run        # xem truoc muc tiet kiem
    python listensrt/compress_mp3.py                   # nen that (mac dinh 64k mono)
    python listensrt/compress_mp3.py --bitrate 96k --stereo --only English_1
    python listensrt/compress_mp3.py --bitrate 48k    # nghe nua (tiet kiem hon)

Yeu cau: may co ffmpeg (libmp3lame).
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile

try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_MEDIA = os.path.join(HERE, 'media')
AUDIO_EXTS = ('.mp3',)


def parse_kbps(s):
    s = str(s).strip().lower()
    if s.endswith('k'):
        return float(s[:-1])
    return float(s) / 1000.0


def probe(path):
    """(duration_giay, channels) - loi -> (0, 0)."""
    try:
        r = subprocess.run(
            ['ffprobe', '-v', 'error', '-show_entries',
             'format=duration:stream=channels',
             '-of', 'json', path],
            capture_output=True, text=True, timeout=30)
        d = json.loads(r.stdout or '{}')
        dur = float((d.get('format') or {}).get('duration') or 0)
        ch = 0
        for st in d.get('streams', []):
            if st.get('channels'):
                ch = int(st.get('channels'))
                break
        return dur, ch
    except Exception:
        return 0, 0


def compress_one(src, bitrate, mono, dry_run):
    size0 = os.path.getsize(src)
    dur, ch = probe(src)
    eff = (size0 * 8 / dur / 1000.0) if dur > 0 else 0
    tgt = parse_kbps(bitrate)
    if eff > 0 and eff <= tgt * 1.05 and (not mono or ch == 1):
        return ('skip', size0, size0, 'da ~%dk (mono)' % round(eff) if ch == 1
                else 'da ~%dk' % round(eff))
    # temp CUNG folder voi file goc (os.replace khong chay khac o dia)
    fd, tmp = tempfile.mkstemp(suffix='.mp3', dir=os.path.dirname(src))
    try:
        os.close(fd)
    except Exception:
        pass
    cmd = ['ffmpeg', '-y', '-v', 'error', '-i', src,
           '-codec:a', 'libmp3lame', '-b:a', bitrate,
           '-map_metadata', '0', '-id3v2_version', '3']
    if mono:
        cmd += ['-ac', '1']
    cmd += [tmp]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        if r.returncode != 0 or not os.path.exists(tmp):
            return ('error', size0, size0, 'ffmpeg loi')
        size1 = os.path.getsize(tmp)
        if size1 >= size0:
            try:
                os.remove(tmp)
            except Exception:
                pass
            return ('skip', size0, size0, 'ban nen khong nho hon')
        if dry_run:
            try:
                os.remove(tmp)
            except Exception:
                pass
            return ('would', size0, size1, '')
        os.replace(tmp, src)
        return ('done', size0, size1, '')
    except Exception as e:
        try:
            if os.path.exists(tmp):
                os.remove(tmp)
        except Exception:
            pass
        return ('error', size0, size0, str(e)[:80])


def fmt_mb(n):
    return '%.1fMB' % (n / 1048576.0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--media-dir', default=DEFAULT_MEDIA)
    ap.add_argument('--bitrate', default='64k',
                    help='bitrate muc tieu (VD: 64k, 96k). Mac dinh 64k')
    ap.add_argument('--stereo', action='store_true',
                    help='giu nguyen so kenh (mac dinh gop mono)')
    ap.add_argument('--dry-run', action='store_true',
                    help='chi xem truoc, khong ghi file')
    ap.add_argument('--only', nargs='*', default=[],
                    help='chi nen cac file nay (stem, VD: --only English_1 02VOA)')
    a = ap.parse_args()

    files = []
    for root, _, fns in os.walk(a.media_dir):
        for fn in fns:
            if fn.lower().endswith(AUDIO_EXTS):
                rel = os.path.relpath(os.path.join(root, fn), a.media_dir)
                files.append(rel)
    files = sorted(files)
    if a.only:
        want = {w.lower() for w in a.only}
        files = [f for f in files
                 if os.path.splitext(f)[0].lower() in want
                 or os.path.splitext(os.path.basename(f))[0].lower() in want]
        if not files:
            sys.exit('❌ --only khong khop file nao.')

    mono = not a.stereo
    print('🎧 %d file, muc tieu %s %s%s' % (
        len(files), a.bitrate, 'mono' if mono else 'stereo',
        ' (DRY-RUN)' if a.dry_run else ''))
    t0 = t1 = 0
    n_done = n_skip = 0
    for rel in files:
        p = os.path.join(a.media_dir, rel)
        st, s0, s1, msg = compress_one(p, a.bitrate, mono, a.dry_run)
        t0 += s0
        t1 += s1 if st in ('done', 'would') else s0
        if st in ('done', 'would'):
            n_done += 1
            print('  %s %s: %s -> %s (-%.0f%%) %s' % (
                '✂' if st == 'done' else '🔍', rel, fmt_mb(s0), fmt_mb(s1),
                (1 - s1 / s0) * 100 if s0 else 0, msg))
        elif st == 'skip':
            n_skip += 1
        else:
            print('  ❌ %s: %s' % (rel, msg))
    print('📦 %d nen, %d bo qua. %s -> %s (tiet kiem %s)' % (
        n_done, n_skip, fmt_mb(t0), fmt_mb(t1), fmt_mb(t0 - t1)))


if __name__ == '__main__':
    main()
