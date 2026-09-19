# -*- coding: utf-8 -*-
"""Quet tat ca file .js cung folder, tim word co >= 2 records -> ghi file.txt.
Record = 1 dong en (tach theo <br>); headword = port cua Helper_GetVocaFromWordFull.
Chay: python dup_words.py
"""
import glob
import io
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
KVERB_3_COL = '(verb)'


def headword(rec):
    s = re.sub(r'<[^>]*>?', '', rec)
    if KVERB_3_COL in s:
        return s.split(KVERB_3_COL)[0].strip()
    if ' ' not in s:
        return s.strip()
    return re.sub(r'[\(\/].+', '', s).strip()


def main():
    counts = {}
    for path in sorted(glob.glob(os.path.join(HERE, '*.js'))):
        with io.open(path, encoding='utf-8', errors='replace') as f:
            src = f.read()
        # en: "..." hoac en: '...' (chiu escape + xuong dong; can re.S cho \ + newline)
        for m in re.finditer(r'\ben\s*:\s*(?:"((?:[^"\\]|\\.)*)"|\'([^\']*)\')', src, re.S):
            val = m.group(1) if m.group(1) is not None else m.group(2)
            val = val.replace('\\\n', ' ')
            for rec in val.split('<br>'):
                h = headword(rec)
                if not h:
                    continue
                k = h.lower()
                if k not in counts:
                    counts[k] = [h, 0]
                counts[k][1] += 1
    dups = sorted(((h, c) for h, c in counts.values() if c >= 2),
                  key=lambda x: (-x[1], x[0].lower()))
    out = os.path.join(HERE, 'file.txt')
    with io.open(out, 'w', encoding='utf-8', newline='') as f:
        for h, c in dups:
            f.write('%s (%d)\n' % (h, c))
    print('words: %d, dups(>=2): %d -> %s' % (len(counts), len(dups), out))


if __name__ == '__main__':
    main()
