#!/bin/bash

# Icon Generation Script for Workout Timer PWA
# This script converts SVG icons to PNG format using ImageMagick
# 
# Requirements: ImageMagick (convert command)
# Installation:
#   - macOS: brew install imagemagick
#   - Ubuntu/Debian: sudo apt-get install imagemagick
#   - Windows: Download from https://imagemagick.org/script/download.php#windows

ICONS_DIR="assets/icons"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed"
    echo ""
    echo "Installation instructions:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  Windows: Download from https://imagemagick.org/script/download.php#windows"
    echo ""
    echo "Alternatively, you can convert SVGs online at:"
    echo "  - https://cloudconvert.com/svg-to-png"
    echo "  - https://convertio.co/svg-png/"
    exit 1
fi

echo "Converting SVG icons to PNG format..."
echo ""

# Convert each SVG icon
convert_icon() {
    local svg_file="$1"
    local png_file="${svg_file%.svg}.png"
    
    echo "Converting: $svg_file → $png_file"
    convert -background none -density 150 "$svg_file" "$png_file"
    
    if [ $? -eq 0 ]; then
        echo "  ✓ Success"
    else
        echo "  ✗ Failed"
        return 1
    fi
}

# Convert all SVG files in the icons directory
cd "$ICONS_DIR" 2>/dev/null || {
    echo "Error: Cannot find $ICONS_DIR directory"
    exit 1
}

for svg in *.svg; do
    if [ -f "$svg" ]; then
        convert_icon "$svg"
    fi
done

echo ""
echo "Conversion complete!"
echo ""
echo "PNG icons are now ready for use."
echo "Note: Make sure to update manifest.json if icon filenames have changed."
