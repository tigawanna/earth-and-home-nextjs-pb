#!/usr/bin/env bash
set -euo pipefail

WASM_FILES=$(find node_modules -path "*/@vercel/og/resvg.wasm" 2>/dev/null)

if [ -z "$WASM_FILES" ]; then
  echo "No resvg.wasm found, skipping stub."
  exit 0
fi

ACTION="${1:-stub}"

for f in $WASM_FILES; do
  if [ "$ACTION" = "stub" ]; then
    if [ ! -f "$f.bak" ]; then
      cp "$f" "$f.bak"
    fi
    printf '\x00\x61\x73\x6d\x01\x00\x00\x00' > "$f"
    echo "Stubbed: $f ($(stat -c%s "$f") bytes)"
  elif [ "$ACTION" = "restore" ]; then
    if [ -f "$f.bak" ]; then
      mv "$f.bak" "$f"
      echo "Restored: $f"
    fi
  fi
done
