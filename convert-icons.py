#!/usr/bin/env python3
"""
SVG to PNG Icon Converter
Converts SVG icons to PNG format without requiring ImageMagick
Requirements: cairosvg or Pillow library
"""

import os
import sys
from pathlib import Path

def convert_with_cairosvg(svg_path, png_path, width=None):
    """Convert SVG to PNG using cairosvg"""
    try:
        import cairosvg
        print(f"Converting: {svg_path} → {png_path}")
        cairosvg.svg2png(url=str(svg_path), write_to=str(png_path))
        print("  ✓ Success")
        return True
    except ImportError:
        return False
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def convert_with_pillow_wand(svg_path, png_path, width=None):
    """Convert SVG to PNG using Wand (ImageMagick wrapper)"""
    try:
        from wand.image import Image
        print(f"Converting: {svg_path} → {png_path}")
        with Image(filename=str(svg_path), format='svg') as img:
            img.format = 'png'
            if width:
                img.width = width
            img.save(filename=str(png_path))
        print("  ✓ Success")
        return True
    except ImportError:
        return False
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def install_dependencies():
    """Provide installation instructions"""
    print("\n" + "="*60)
    print("Icon Generator - Installation Instructions")
    print("="*60 + "\n")
    
    print("Option 1: Install cairosvg (Recommended)\n")
    print("  pip install cairosvg\n")
    
    print("Option 2: Install Pillow + Wand\n")
    print("  pip install Pillow Wand\n")
    
    print("Option 3: Online Converter")
    print("  Go to: https://cloudconvert.com/svg-to-png\n")
    
    print("="*60 + "\n")

def main():
    """Main conversion function"""
    
    script_dir = Path(__file__).parent
    icons_dir = script_dir / "assets" / "icons"
    
    if not icons_dir.exists():
        print(f"Error: Icon directory not found: {icons_dir}")
        sys.exit(1)
    
    # Find all SVG files
    svg_files = list(icons_dir.glob("*.svg"))
    
    if not svg_files:
        print(f"No SVG files found in {icons_dir}")
        sys.exit(1)
    
    print("Workout Timer PWA - Icon Converter")
    print("="*50)
    print(f"Found {len(svg_files)} SVG icon(s)\n")
    
    # Try conversion methods
    success_count = 0
    failed_files = []
    
    for svg_file in sorted(svg_files):
        png_file = svg_file.with_suffix('.png')
        
        # Extract size from filename if present (e.g., icon-192.svg)
        width = None
        if any(char.isdigit() for char in svg_file.stem):
            import re
            match = re.search(r'(\d+)', svg_file.stem)
            if match:
                width = int(match.group(1))
        
        # Try conversion methods in order
        if convert_with_cairosvg(svg_file, png_file, width):
            success_count += 1
        elif convert_with_pillow_wand(svg_file, png_file, width):
            success_count += 1
        else:
            failed_files.append(svg_file.name)
    
    print("\n" + "="*50)
    print(f"\nConversion Complete: {success_count}/{len(svg_files)} successful")
    
    if failed_files:
        print(f"\nFailed conversions:")
        for file in failed_files:
            print(f"  - {file}")
        print("\nPlease install required library:")
        install_dependencies()
        sys.exit(1)
    else:
        print("\n✓ All icons converted successfully!")
        print("\nNext steps:")
        print("  1. Update manifest.json to use .png icons")
        print("  2. Deploy to your server")
        print("  3. Test installation on device\n")
        sys.exit(0)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nInterrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        install_dependencies()
        sys.exit(1)
