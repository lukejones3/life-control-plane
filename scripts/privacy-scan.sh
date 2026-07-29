#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

blocked='(parquet|db|sqlite|sqlite3|lance|mbox|eml|vcf|heic|mov|mp4|zip|csv|jsonl)$'
if find . -type f -not -path './.git/*' -not -path './node_modules/*' | grep -Eiq "\\.${blocked}"; then
  echo "Blocked personal-data file type found."
  exit 1
fi

patterns='(/Users/[^/]+/|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|github_pat_[A-Za-z0-9_]{20,}|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}|-----BEGIN .*PRIVATE KEY-----|\\+1[0-9]{10})'
if rg -n --hidden -g '!.git/**' -g '!node_modules/**' -g '!scripts/privacy-scan.sh' -e "$patterns" .; then
  echo "Potential identifier, machine path, phone number, or credential found."
  exit 1
fi

echo "Privacy scan passed."
