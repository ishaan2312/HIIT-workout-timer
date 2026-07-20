# Workout Timer PWA - Setup Guide

Complete setup instructions for converting SVG icons to PNG and preparing for deployment.

## Quick Start

1. SVG icons are included and will work in modern browsers
2. (Optional) Convert SVGs to PNG for better compatibility
3. Deploy to any web server
4. App is immediately installable

## Icon Setup

### Using SVG Icons (Recommended)

SVG icons are already included and work perfectly in all modern browsers. No conversion needed!

**Pros:**
- Scalable to any resolution
- Smaller file size
- Better for accessibility
- Works on all platforms

**Cons:**
- Very old browsers might not support (unlikely in 2024)

### Converting to PNG (Optional)

If you want PNG icons for broader compatibility:

#### Option 1: Using ImageMagick (Recommended)

**macOS:**
```bash
brew install imagemagick
bash generate-icons.sh
```

**Ubuntu/Debian:**
```bash
sudo apt-get install imagemagick
bash generate-icons.sh
```

**Windows (using WSL):**
```bash
wsl
sudo apt-get install imagemagick
bash generate-icons.sh
```

#### Option 2: Online Converters

Use these free online tools to convert SVGs to PNG:

1. **CloudConvert** (https://cloudconvert.com/svg-to-png)
   - Upload: assets/icons/icon-192.svg
   - Download as PNG
   - Rename to icon-192.png

2. **Convertio** (https://convertio.co/svg-png/)
   - Similar process
   - Good batch conversion

3. **Pixlr** (https://pixlr.com/)
   - Online editor with export

#### Option 3: Manual Conversion (All Platforms)

Using Python with Pillow:

```bash
# Install Pillow
pip install pillow

# Convert SVG using online resource then save as PNG
# Or use cairosvg:
pip install cairosvg
cairosvg assets/icons/icon-192.svg -o assets/icons/icon-192.png
```

#### Option 4: Adobe Illustrator / Figma

1. Open SVG file
2. Export as PNG with desired size
3. Save to assets/icons/

## Icon Files Explained

### Standard Icons

| File | Size | Purpose |
|------|------|---------|
| `icon-192.svg` | 192×192 | Main app icon |
| `icon-512.svg` | 512×512 | Large displays, splash screens |
| `icon-96.svg` | 96×96 | Shortcuts, taskbar |

### Maskable Icons (Android)

| File | Size | Purpose |
|------|------|---------|
| `icon-maskable-192.svg` | 192×192 | Android adaptive icon |
| `icon-maskable-512.svg` | 512×512 | Android adaptive icon (large) |

**Note:** Maskable icons have a solid background that Android will mask to create adaptive icons. The safe zone is within the inner circle.

## Manifest Configuration

The `manifest.json` file references your icons. If you rename icons or change sizes:

```json
{
  "icons": [
    {
      "src": "./assets/icons/icon-192.png",  // or .svg
      "sizes": "192x192",
      "type": "image/png"                     // or image/svg+xml
    }
  ]
}
```

### Using SVG in Manifest

To use SVG icons, update manifest.json:

```json
{
  "icons": [
    {
      "src": "./assets/icons/icon-192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    }
  ]
}
```

## Verification Checklist

- [ ] Icons directory exists: `assets/icons/`
- [ ] Icon files present (SVG or PNG)
- [ ] manifest.json references correct icon paths
- [ ] manifest.json served with correct MIME type
- [ ] Service worker installed
- [ ] HTTPS enabled (except localhost)
- [ ] App installs successfully on test device

## Troubleshooting Icons

### Icons not showing up
1. Check browser console (F12)
2. Verify icon file paths in manifest.json
3. Ensure files are in correct directory
4. Try clearing cache (Ctrl+Shift+Delete)

### PWA not installing
1. Icons must be present and accessible
2. manifest.json must be valid JSON
3. App must be on HTTPS (except localhost)
4. Service worker must load successfully

### Android icon issues
1. Use maskable icons for adaptive icons
2. Ensure maskable icon background is solid color
3. Keep important content in center circle
4. Test on actual Android device

### iOS icon issues
1. Use standard icon-192.svg or icon-192.png
2. Must be square (192×192)
3. If using PNG, ensure it's in PNG format
4. No transparency recommended for solid backgrounds

## Batch Icon Generation Script

If you have many projects, create batch script:

**batch-convert.sh:**
```bash
#!/bin/bash

for dir in */assets/icons; do
    if [ -d "$dir" ]; then
        echo "Converting icons in $dir..."
        cd "$(dirname "$dir")"
        bash generate-icons.sh
        cd -
    fi
done
```

## Advanced: Custom Icons

### Creating Your Own Icons

1. **Design in Figma or Illustrator**
   - 512×512 canvas (minimum)
   - Keep safe zone in center
   - Export as SVG

2. **Optimize SVG**
   ```bash
   # Use SVGO (Node.js required)
   npx svgo assets/icons/icon-512.svg -o assets/icons/icon-512-opt.svg
   ```

3. **Update manifest.json**
   ```json
   {
     "src": "./assets/icons/icon-512-opt.svg"
   }
   ```

### Icon Design Tips

- **Color**: Use brand color or high contrast
- **Simplicity**: Works at small sizes (favicon needs detail)
- **Padding**: Leave 20% padding around content
- **Safe Zone**: Keep important content in center circle
- **Transparency**: Support for transparency where needed
- **Stroke**: Consider outline for visibility

## Deployment with Icons

### GitHub Pages
```bash
# Icons automatically served correctly
git add assets/icons/
git commit -m "Add app icons"
git push
```

### Netlify
```bash
# Upload entire assets directory
# Netlify serves correctly
```

### AWS S3
```bash
aws s3 sync assets s3://your-bucket/assets/
```

### Docker
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html/
# Assets automatically included
```

## Performance Tips

- SVG icons: 5-20KB each (smaller than PNG)
- PNG icons: 30-100KB each (depending on compression)
- Use compression: `gzip` for best results
- CDN caching: Set cache-control headers

Example cache headers:
```
assets/icons/* → Cache-Control: max-age=31536000
```

## Icon Testing

### Test on Real Devices

**Android:**
1. Open in Chrome
2. Install app
3. Verify icon appearance
4. Check home screen
5. Check app drawer

**iOS:**
1. Open in Safari
2. Add to Home Screen
3. Verify icon appearance
4. Check on home screen

**Desktop:**
1. Install as app
2. Check taskbar/dock
3. Check desktop shortcut
4. Verify in browser

## References

- [MDN: Web App Icons](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons)
- [Web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [Android: Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [ImageMagick Documentation](https://imagemagick.org/)

---

**Support**: For issues, check the main README.md or browser console for error messages.
