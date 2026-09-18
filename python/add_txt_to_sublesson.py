# -*- coding: utf-8 -*-
"""Them 1 story tu file .txt vao group { category, content } trong data subLesson.
Dinh dang .txt (don gian):
    title: Gel Manicure            (thieu -> lay ten file)
    voca: gel, base coat, cure     (thieu -> bo qua)
    images: gel-1, gel-2           (thieu -> bo qua)
    en:
    - dong 1...
    - dong 2...
Neu khong co dong 'en:' thi toan bo file la noi dung en.
Chay: python add_txt_to_sublesson.py (lam theo prompt)
"""
import io
import os
import sys

NL = '\r\n'
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def prompt(msg, default=''):
    try:
        s = input(msg).strip().strip('"')
    except EOFError:
        s = ''
    return s if s else default


def js_escape(s):
    return s.replace('\\', '\\\\').replace('"', '\\"')


def read_txt(path):
    with io.open(path, encoding='utf-8-sig', newline='') as f:
        text = f.read()
    title, voca, images, en_lines, in_en = '', '', '', [], False
    for raw in text.splitlines():
        line = raw.strip()
        if not in_en and line.lower() == 'en:':
            in_en = True
            continue
        if not in_en and ':' in line:
            k, _, v = line.partition(':')
            k = k.strip().lower()
            if k == 'title':
                title = v.strip()
                continue
            if k == 'voca':
                voca = v.strip()
                continue
            if k == 'images':
                images = v.strip()
                continue
        if not in_en and not title and not voca and not images and line:
            # file khong co header -> tat ca la en
            pass
        if line == '' and not in_en and (title or voca or images):
            continue
        in_en = True
        en_lines.append(raw.strip())
    en_lines = [l for l in en_lines if l]
    # neu khong co header nao ma van parse ra meta -> coi nhu en het
    return title, voca, images, en_lines


def build_story(title, voca, images, en_lines):
    parts = ['\t{', '\t\ttitle: "%s",' % js_escape(title), '\t\ten: "\\']
    for ln in en_lines:
        parts.append('\t' + js_escape(ln) + '<br>\\')
    parts.append('\t",')
    if voca:
        parts.append('\t\tvoca: "%s",' % js_escape(voca))
    if images:
        names = ', '.join('"%s"' % js_escape(x.strip()) for x in images.split(',') if x.strip())
        if names:
            parts.append('\t\timages: [%s],' % names)
    # bo dau phay thua dong cuoi
    if parts[-1].endswith(','):
        parts[-1] = parts[-1][:-1]
    parts.append('\t}')
    return NL.join(parts)


def find_content_range(src, category):
    """Tra ve (start, end) cua [...] content thuoc category (string-aware)."""
    key = "category: '%s'" % category
    i = src.find(key)
    if i < 0:
        key = 'category: "%s"' % category
        i = src.find(key)
    if i < 0:
        return None
    j = src.find('content:', i)
    if j < 0:
        return None
    k = src.find('[', j)
    if k < 0:
        return None
    depth, p, n, q, esc = 1, k + 1, len(src), None, False
    while p < n and depth > 0:
        c = src[p]
        if q:
            if esc:
                esc = False
            elif c == '\\':
                esc = True
            elif c == q:
                q = None
        elif c == '/' and p + 1 < n and src[p + 1] == '/':
            while p < n and src[p] != '\n':  # bo qua // comment
                p += 1
            continue
        else:
            if c in '"\'':
                q = c
            elif c == '[':
                depth += 1
            elif c == ']':
                depth -= 1
        p += 1
    if depth != 0:
        return None
    return (k, p - 1)  # vi tri '[' ... ']' dong content


def main():
    print('=== Them story .txt vao subLesson (group 2D) ===')
    txt_path = prompt('Duong dan file .txt: ')
    if not txt_path or not os.path.isfile(txt_path):
        print('Khong thay file.')
        return 1
    data_path = prompt('File data js [%s]: ' % os.path.join('subLesson', 'subLesson_nail_data.js'),
                       os.path.join(REPO, 'subLesson', 'subLesson_nail_data.js'))
    category = prompt('Category [Nail]: ', 'Nail')
    title, voca, images, en_lines = read_txt(txt_path)
    if not title:
        base = os.path.splitext(os.path.basename(txt_path))[0]
        title = base.replace('_', ' ').replace('-', ' ').strip().title()
    if not en_lines:
        print('File txt khong co noi dung.')
        return 1
    with io.open(data_path, encoding='utf-8', newline='') as f:
        src = f.read()
    rng = find_content_range(src, category)
    if rng is None:
        print("Khong tim thay category '%s' trong %s." % (category, data_path))
        return 1
    ks, ke = rng
    inner = src[ks + 1:ke]
    story = build_story(title, voca, images, en_lines)
    if inner.strip() == '':
        new_inner = NL + story + NL
    else:
        new_inner = inner.rstrip() + ',' + NL + story + NL
    new_src = src[:ks + 1] + new_inner + src[ke:]
    with io.open(data_path, 'w', encoding='utf-8', newline='') as f:
        f.write(new_src)
    print('OK: da them "%s" (%d dong en) vao [%s] trong %s.' % (title, len(en_lines), category, data_path))
    print('Mo trang subLesson kiem tra, dung git diff de soat.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
