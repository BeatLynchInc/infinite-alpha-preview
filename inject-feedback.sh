#!/bin/zsh

set -euo pipefail

repo_root="${0:A:h}"

inject_file() {
  local file="$1"
  local rel_prefix="."
  local tmp_file

  if grep -q "feedback-drawer.js" "$file"; then
    echo "Skipping $file (already includes feedback assets)"
    return
  fi

  if ! grep -qi "</body>" "$file"; then
    echo "Skipping $file (missing </body>)"
    return
  fi

  case "$file" in
    "$repo_root"/courses/*/*.html)
      rel_prefix="../.."
      ;;
  esac

  tmp_file="$(mktemp)"

  awk -v prefix="$rel_prefix" '
    BEGIN {
      IGNORECASE = 1
      snippet = "\n<link rel=\"stylesheet\" href=\"" prefix "/feedback-drawer.css\">\n<script src=\"" prefix "/feedback-drawer.js\" defer></script>\n"
      inserted = 0
    }
    {
      if (!inserted && tolower($0) ~ /<\/body>/) {
        printf "%s", snippet
        inserted = 1
      }
      print
    }
    END {
      if (!inserted) {
        exit 2
      }
    }
  ' "$file" > "$tmp_file"

  mv "$tmp_file" "$file"
  echo "Injected feedback assets into $file"
}

while IFS= read -r file; do
  inject_file "$file"
done < <(find "$repo_root" -type f -name "*.html" ! -name "academy-feedback.html" | sort)
