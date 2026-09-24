#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
srt2js.py - chuyen .srt (+ .srt tieng Viet, optional) thanh entry cho
watch/watchData.js (module Watch).

Dung:
    python srt2js.py lesson1.en.srt lesson1.vi.srt --id lesson1 --title "Bai 1" --src watch/media/lesson1.mp4
    python srt2js.py lesson1.en.srt --id lesson1 --title "Bai 1" --youtube aqz-KE-bpKQ

    -> in ra khoi JS, copy paste vao mang WATCH_DATA trong watch/watchData.js
       (video mp4 thi copy file vao watch/media/).
"""
import argparse
import re
import sys


def parse_time(s):
    m = re.match(r'(\d+):(\d+):(\d+)[,.](\d+)', s.strip())
    if not m:
        raise ValueError('bad timestamp: %r' % s)
    h, mi, se, ms = map(int, m.groups())
    return h * 3600 + mi * 60 + se + ms / 1000.0


def parse_srt(path):
    with open(path, encoding='utf-8-sig') as f:
        content = f.read().replace('\r\n', '\n').replace('\r', '\n')
    blocks = re.split(r'\n\s*\n', content.strip())
    out = []
    for b in blocks:
        lines = [ln.strip() for ln in b.strip().split('\n') if ln.strip() != '']
        if len(lines) < 2:
            continue
        # bo dong index neu co
        if re.match(r'^\d+$', lines[0]):
            lines = lines[1:]
        if len(lines) < 2 or '-->' not in lines[0]:
            continue
        start_s, _, end_s = lines[0].partition('-->')
        text = ' '.join(lines[1:])
        text = re.sub(r'<[^>]*>', '', text).strip()  # bo tag <i>...
        text = re.sub(r'\s+', ' ', text)
        if not text:
            continue
        out.append((parse_time(start_s), parse_time(end_s), text))
    return out


def js_str(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('en_srt', help='.srt tieng Anh')
    ap.add_argument('vi_srt', nargs='?', default=None, help='.srt tieng Viet (optional)')
    ap.add_argument('--id', required=True)
    ap.add_argument('--title', default='')
    ap.add_argument('--src', default='', help='VD: watch/media/lesson1.mp4')
    ap.add_argument('--youtube', default='', help='videoId YouTube (thay cho --src)')
    a = ap.parse_args()

    en = parse_srt(a.en_srt)
    vi_map = {}
    if a.vi_srt:
        for s, e, t in parse_srt(a.vi_srt):
            vi_map.setdefault(round(s, 1), t)

    if a.youtube:
        typ, src = 'youtube', a.youtube
    else:
        typ, src = 'file', (a.src or ('watch/media/%s.mp4' % a.id))

    print('\t{')
    print('\t\tid: %s,' % js_str(a.id))
    print('\t\ttitle: %s,' % js_str(a.title or a.id))
    print('\t\ttype: %s,' % js_str(typ))
    print('\t\tsrc: %s,' % js_str(src))
    print('\t\tsubs: [')
    for s, e, t in en:
        v = vi_map.get(round(s, 1), '')
        print('\t\t\t{ t: %.2f, e: %.2f, en: %s, vi: %s },'
              % (s, e, js_str(t), js_str(v)))
    print('\t\t]')
    print('\t},')
    print('// %d dong phu de -> paste vao WATCH_DATA' % len(en), file=sys.stderr)


if __name__ == '__main__':
    main()
