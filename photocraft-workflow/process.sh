#!/usr/bin/env bash
# تجهيز صور الموقع: تصغير إلى عرض 1600px + تحسين تلقائي + توضيح + تحويل إلى WebP
set -euo pipefail
IN="${1:-./raw}"      # مجلد الصور الأصلية
OUT="${2:-./web}"     # مجلد الناتج
mkdir -p "$OUT"
photocraft-cli batch --actions "$(dirname "$0")/web-images.json" \
  --in "$IN" --out "$OUT" --format webp --quality 82
echo "تم. الصور الجاهزة في: $OUT"
