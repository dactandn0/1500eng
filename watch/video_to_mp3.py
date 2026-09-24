#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
video_to_mp3.py - tach audio mp3 nhe tu video (de khoi push mp4 nang len GitHub).
App Watch chay thang file mp3 + sub (sync_watch.py ho tro audio san).

Dung:
    python watch/video_to_mp3.py watch/media/English_1.mp4
    python watch/video_to_mp3.py watch/media/English_1.mp4 --out watch/media/English_1-small.mp3
    python watch/video_to_mp3.py watch/media/English_1.mp4 --bitrate 96k --rate 22050

    # xong chay tiep:
    python watch/sync_watch.py   (tu transcribe mp3 + sync vao watchData.js)

Mac dinh: mono, 16kHz, 64kbit (~0.5MB/phut) - vua nhe vua du cho Whisper + nghe.
"""
import argparse
import os
import shutil
import subprocess
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video', help='file video nguon (.mp4/.mkv/...)')
    ap.add_argument('--out', default='', help='file mp3 dich (default: canh video, cung ten)')
    ap.add_argument('--bitrate', default='64k', help='bitrate mp3 (default 64k)')
    ap.add_argument('--rate', type=int, default=16000, help='sample rate Hz (default 16000)')
    a = ap.parse_args()

    if not os.path.isfile(a.video):
        sys.exit('❌ Khong thay file: %s' % a.video)
    if not shutil.which('ffmpeg'):
        sys.exit('❌ Khong tim thay ffmpeg.')

    out = a.out or (os.path.splitext(a.video)[0] + '.mp3')
    if os.path.abspath(out) == os.path.abspath(a.video):
        sys.exit('❌ File dich trung file nguon.')

    cmd = ['ffmpeg', '-y', '-i', a.video,
           '-vn', '-ar', str(a.rate), '-ac', '1', '-b:a', a.bitrate,
           out]
    print('🎧 %s -> %s (%s, %dHz mono)...' % (a.video, out, a.bitrate, a.rate))
    r = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if r.returncode != 0 or not os.path.exists(out):
        sys.exit('❌ ffmpeg loi.')
    mb = os.path.getsize(out) / 1e6
    src_mb = os.path.getsize(a.video) / 1e6
    print('✅ %.2fMB (goc %.1fMB). Tiep: python watch/sync_watch.py' % (mb, src_mb))


if __name__ == '__main__':
    main()
