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

except Exception as e:
    print(f"Error: {e}")
    input("Press Enter to exit...")
    sys.exit(1)


result = "\n".join(matched_lines)

pyperclip.copy(result)

print(f"\nFound {len(matched_lines)} matching lines.")
print("Copied to clipboard.")
input("\nPress Enter to exit...")