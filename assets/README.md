# Assets Directory

This directory contains application assets like icons and images.

## Required Files

### Application Icon

For macOS builds, you need an icon file. The app is configured to look for:
- `icon.icns` - macOS icon file (512x512, 256x256, 128x128, 64x64, 32x32, 16x16)
- `icon.png` - PNG version of the icon (1024x1024 recommended)

### Creating an Icon

You can create an icon from a PNG file using the following methods:

#### Method 1: Using iconutil (macOS)

1. Create a PNG file at 1024x1024 pixels
2. Create an iconset directory:
```bash
mkdir icon.iconset
```

3. Generate required sizes:
```bash
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
```

4. Convert to icns:
```bash
iconutil -c icns icon.iconset
```

#### Method 2: Using Online Tools

1. Use a service like https://cloudconvert.com/png-to-icns
2. Upload your 1024x1024 PNG
3. Download the generated .icns file
4. Place it in this directory

#### Method 3: Using electron-icon-builder

```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./icon.png --output=./
```

## Icon Design Guidelines

- **Size**: 1024x1024 pixels minimum
- **Format**: PNG with transparency
- **Style**: Simple, recognizable at small sizes
- **Theme**: Smart home / house related
- **Colors**: Vibrant but professional

## Current Icon

If no icon is provided, the app will use Electron's default icon. For a production build, always include a custom icon.

### Suggested Icon Ideas

For a Smart Life app, consider:
- House icon with smart/tech elements
- Light bulb icon
- Home with WiFi/connectivity symbols
- Abstract smart home representation

You can use design tools like:
- Figma
- Sketch
- Adobe Illustrator
- Canva
- Or hire a designer from Fiverr/99designs
