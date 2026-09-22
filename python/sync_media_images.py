# -*- coding: utf-8 -*-
"""Quet media/images/ (*.png, *.jpg, *.jpeg, *.gif, *.webp, *.bmp)
-> tu dong dong bo vao IMG_DATA trong media/media_data.js.
- File moi -> them { title (tu ten file), src (ten file) }.
- File da xoa -> go entry local tuong ung (ghi chu Dang giu remote http...).
- Entry remote (http/data:) luon giu. Title tu sua tay duoc giu nguyen.
Chay: python sync_media_images.py (dat file anh vao media/images truoc)
"""
import io
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(REPO, 'media', 'images')
DATA_JS = os.path.join(REPO, 'media', 'media_data.js')
EXTS = ('.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp')


def prompt(msg, default=''):
    try:
        s = input(msg).strip().strip('"')
    except EOFError:
        s = ''
    return s if s else default


def auto_title(stem):
    return re.sub(r'[_-]+', ' ', stem).strip()


def main():
    files = sorted(f for f in os.listdir(IMG_DIR)
                   if os.path.isfile(os.path.join(IMG_DIR, f))
                   and f.lower().endswith(EXTS))
    print('Anh trong media/images: %d' % len(files))
    with io.open(DATA_JS, encoding='utf-8', newline='') as f:
        src = f.read()
    m = re.search(r'const IMG_DATA = \[(.*?)\];', src, re.S)
    if not m:
        print('Khong tim thay IMG_DATA trong media_data.js.')
        return 1
    entries = []
    for em in re.finditer(r"""\{\s*title\s*:\s*'((?:[^'\\]|\\.)*)'\s*,\s*src\s*:\s*'((?:[^'\\]|\\.)*)'\s*\}""", m.group(1)):
        entries.append([em.group(1), em.group(2)])
    keep, seen_files = [], set()
    for title, sref in entries:
        if sref.startswith(('http', 'data:')):
            keep.append((title, sref))
            continue
        name = sref.split('/')[-1]
        if name in files:
            keep.append((title, name if '/' not in sref else sref))
            seen_files.add(name)
        else:
            print('  - go (mat file): %s' % sref)
    added = 0
    for f in files:
        if f not in seen_files:
            stem = os.path.splitext(f)[0]
            keep.append((auto_title(stem), f))
            seen_files.add(f)
            added += 1
            print('  + them: %s' % f)
    body = '\n'.join("\t{ title: '%s', src: '%s' }," % (t.replace("'", "\\'"), s) for t, s in keep)
    new_src = src[:m.start(1)] + ('\n' + body + '\n' if body else '\n') + src[m.end(1):]
    with io.open(DATA_JS, 'w', encoding='utf-8', newline='') as f:
        f.write(new_src)
    print('OK: IMG_DATA hien co %d entries (them moi %d).' % (len(keep), added))
    return 0


if __name__ == '__main__':
    sys.exit(main())
