# سير عمل PhotoCraft لتجهيز صور الموقع

يعتمد على [PhotoCraft](https://github.com/storytold/photocraft) (أداة سطر الأوامر `photocraft-cli`).

> ⚠️ لم يُختبر بعد على صور حقيقية.

## الخطوات (`web-images.json`)
1. `image.imageSize`: تصغير إلى عرض 1600px مع الحفاظ على النسبة
2. `image.autoTone`: تحسين تلقائي للإضاءة والتباين
3. `filter.sharpen.smartSharpen`: زيادة الوضوح بعد التصغير

ثم الحفظ بصيغة WebP بجودة 82.

## التشغيل
```sh
cargo install --path apps/photocraft-cli --locked   # من داخل مستودع PhotoCraft
./process.sh ./raw ./web
```

## الربط مع Claude عبر MCP
```sh
claude mcp add photocraft -- photocraft-cli mcp \
  --automation-read-root /path/to/images --automation-write-root /path/to/images
```
