import os
import re
import sys

try:
    import pyperclip
except ImportError:
    print("Missing pyperclip. Install with: pip install pyperclip")
    input("Press Enter to exit...")
    sys.exit(1)


file_path = input("Enter file path: ").strip().strip('"')

pattern = re.compile(
    r'^(?=.*[A-Za-z0-9À-ỹ])'
    r'(?!.*\/.*\/)'
    r'(?!.*\([^)]*\))'
    r'(?!.*\btitle\s*:)'
    r'(?!^\s*const\s+\w+\s*=)'
    r'.*$'
)

matched_lines = []

try:
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\r\n")

            if pattern.match(line):
                matched_lines.append(line)

    # Xác định đường dẫn thư mục chứa file input để tạo file output cùng cấp
    input_dir = os.path.dirname(os.path.abspath(file_path))
    output_file_path = os.path.join(input_dir, "file_output.txt")

    # Ghi nội dung kết quả vào file_output.txt
    result = "\n".join(matched_lines)
    with open(output_file_path, "w", encoding="utf-8") as out_f:
        out_f.write(result)

    pyperclip.copy(result)

    print(f"\nFound {len(matched_lines)} matching lines.")
    print(f"Saved to: {output_file_path}")
    print("Copied to clipboard.")

except Exception as e:
    print(f"Error: {e}")
    input("\nPress Enter to exit...")
    sys.exit(1)

input("\nPress Enter to exit...")