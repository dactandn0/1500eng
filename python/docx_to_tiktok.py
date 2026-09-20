# -*- coding: utf-8 -*-
"""Doc .docx (PASSAGE 1..N) -> tu fill cac passage con thieu vao tiktok.js.
- Docx la zip: giai word/document.xml bang zipfile (khong can cai them).
- Moi passage: gop paras, tach cau theo nhan a./b./... (fallback: moi para 1 dong).
- Chi append so con thieu, khong sua entries cu.
Chay: python docx_to_tiktok.py (lam theo prompt)
"""
import io
import os
import re
import sys
import zipfile

NL = '\r\n'
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def prompt(msg, default=''):
    try:
        s = input(msg).strip().strip('"')
    except EOFError:
        s = ''
    return s if s else default


def read_paras(docx_path):
    with zipfile.ZipFile(docx_path) as z:
        xml = z.read('word/document.xml').decode('utf-8')
    paras = []
    for m in re.finditer(r'<w:p[ >].*?</w:p>', xml, re.S):
        txt = ''.join(re.findall(r'<w:t(?=[\s>])[^>]*>(.*?)</w:t>', m.group(0), re.S))
        txt = txt.replace('\u00a0', ' ').strip()
        if txt:
            paras.append(txt)
    return paras


def split_passages(paras):
    """-> [(num, [paras...])]"""
    heads = []
    for k, p in enumerate(paras):
        m = re.match(r'(?i)^passage\s*(\d+)', p.strip())
        if m:
            heads.append((int(m.group(1)), k))
    out = []
    for i, (num, k) in enumerate(heads):
        end = heads[i + 1][1] if i + 1 < len(heads) else len(paras)
        out.append((num, paras[k + 1:end]))
    return out


def split_sentences(text):
    """Tach cau theo nhan a./b./... dung sau dau ket cau hoac dau text."""
    text = re.sub(r'\s+', ' ', text).strip()
    if not text:
        return []
    # danh dau vi tri tach (khong cat chu)
    marks = [0]
    for m in re.finditer(r'(?<=[.?!:])\s+([a-g])\. ', text):
        marks.append(m.start())
    if len(marks) == 1 and not re.match(r'^[a-g]\. ', text):
        return []  # se fallback theo para ben ngoai
    parts = []
    for i, s in enumerate(marks):
        e = marks[i + 1] if i + 1 < len(marks) else len(text)
        chunk = text[s:e].strip()
        if chunk:
            parts.append(chunk)
    # loc chunk rac (khong bat dau bang nhan) neu co marker that
    good = [c for c in parts if re.match(r'^[a-g]\. ', c)]
    return good if good else []


def js_escape(s):
    return s.replace('\\', '\\\\').replace('"', '\\"')


def build_entry(num, sentences):
    body = []
    body.append('{')
    body.append('unit:%d' % num)
    body.append(',title:"PASSAGE %d"' % num)
    en = ''
    for k, s in enumerate(sentences):
        if k < len(sentences) - 1:
            en += js_escape(s) + ' <br>' + '\\' + NL
        else:
            en += js_escape(s)
    body.append(',en:"' + en + '"')
    body.append('},')
    return NL.join(body)


def existing_units(js_src):
    return set(int(x) for x in re.findall(r'\bunit\s*:\s*(\d+)', js_src))


def main():
    print('=== Docx PASSAGE -> tiktok.js ===')
    docx_path = prompt('File .docx: ',
                       os.path.join(REPO, 'ebooks', 'spkBook', 'data', 'tiktok', 'file_tiktok.pdf'))
    js_path = prompt('File tiktok.js: ',
                     os.path.join(REPO, 'ebooks', 'spkBook', 'data', 'tiktok', 'tiktok.js'))
    if not os.path.isfile(docx_path):
        print('Khong thay docx.')
        return 1
    if not os.path.isfile(js_path):
        print('Khong thay tiktok.js.')
        return 1
    paras = read_paras(docx_path)
    passages = split_passages(paras)
    print('Docx co %d passages.' % len(passages))
    with io.open(js_path, encoding='utf-8', newline='') as f:
        js_src = f.read()
    have = existing_units(js_src)
    print('tiktok.js dang co units: %s' % sorted(have))
    new_entries = []
    warnings = []
    for num, ps in passages:
        if num in have:
            continue
        joined = ' '.join(ps)
        sens = split_sentences(joined)
        if not sens:
            # fallback: moi para 1 dong
            sens = [re.sub(r'\s+', ' ', p).strip() for p in ps if p.strip()]
        if len(sens) < 2:
            warnings.append('PASSAGE %d chi co %d cau/dong!' % (num, len(sens)))
        new_entries.append((num, build_entry(num, sens)))
    if not new_entries:
        print('Khong co passage moi.');
        return 0
    new_entries.sort()
    print('Se them %d passages: %s' % (len(new_entries), [n for n, _ in new_entries]))
    for w in warnings:
        print('  CANH BAO: ' + w)
    ok = prompt('Ghi vao tiktok.js? (y/n) [y]: ', 'y')
    if ok.lower() not in ('y', 'yes', ''):
        print('Huy.');
        return 0
    idx = js_src.rfind(']')
    if idx < 0:
        print('Khong tim thay ] ket mang.');
        return 1
    block = NL.join(e for _, e in new_entries)
    # entry cuoi cu khong co dau phay -> chen dau phay truoc block moi
    new_src = js_src[:idx].rstrip()
    if not new_src.endswith(','):
        new_src += ','
    new_src += NL + block + NL + js_src[idx:]
    with io.open(js_path, 'w', encoding='utf-8', newline='') as f:
        f.write(new_src)
    print('OK: da them %d passages vao %s.' % (len(new_entries), js_path))
    return 0


if __name__ == '__main__':
    sys.exit(main())
