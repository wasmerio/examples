#!/bin/bash

# Image Optimization Script for Healthcare Astro Theme
# =====================================================
# This script:
# 1. Backs up original images to an 'originals' subdirectory
# 2. Compresses images (max 1200px landscape / 800px portrait, 85% quality)
# 3. Creates blur placeholders (~20px, base64 encoded)
# 4. Reports compression results

set -e

# Configuration
ASSETS_DIR="${1:-src/assets}"
MAX_WIDTH_LANDSCAPE=1200
MAX_WIDTH_PORTRAIT=800
QUALITY=85
BLUR_SIZE=20

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure we're in the project root
if [ ! -d "$ASSETS_DIR" ]; then
    echo -e "${RED}Error: Assets directory '$ASSETS_DIR' not found${NC}"
    echo "Usage: $0 [assets_directory]"
    exit 1
fi

# Create directories
ORIGINALS_DIR="$ASSETS_DIR/originals"
PLACEHOLDERS_DIR="$ASSETS_DIR/placeholders"
mkdir -p "$ORIGINALS_DIR"
mkdir -p "$PLACEHOLDERS_DIR"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}       Image Optimization Script${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check for ImageMagick (prefer magick over deprecated convert)
MAGICK_CMD=""
if command -v magick &> /dev/null; then
    MAGICK_CMD="magick"
elif command -v convert &> /dev/null; then
    MAGICK_CMD="convert"
else
    echo -e "${RED}Error: ImageMagick is required but not installed.${NC}"
    echo "Install with: brew install imagemagick"
    exit 1
fi

# Arrays to track results
declare -a processed_files
declare -a original_sizes
declare -a compressed_sizes
declare -a placeholder_sizes

total_original=0
total_compressed=0

# Function to get file size in bytes
get_size() {
    stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null
}

# Function to get human readable size
human_size() {
    local bytes=$1
    if [ $bytes -ge 1048576 ]; then
        echo "$(echo "scale=2; $bytes/1048576" | bc)MB"
    elif [ $bytes -ge 1024 ]; then
        echo "$(echo "scale=2; $bytes/1024" | bc)KB"
    else
        echo "${bytes}B"
    fi
}

# Function to determine if image is portrait or landscape
get_max_width() {
    local file=$1
    local dimensions=$(identify -format "%wx%h" "$file" 2>/dev/null)
    local width=$(echo $dimensions | cut -d'x' -f1)
    local height=$(echo $dimensions | cut -d'x' -f2)

    if [ "$height" -gt "$width" ]; then
        echo $MAX_WIDTH_PORTRAIT
    else
        echo $MAX_WIDTH_LANDSCAPE
    fi
}

# Find all image files
find_images() {
    find "$ASSETS_DIR" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | sort
}

# Process each image
echo -e "${YELLOW}Step 1: Backing up original images...${NC}"
echo ""

while IFS= read -r img; do
    [ -f "$img" ] || continue

    filename=$(basename "$img")

    # Backup original if not already backed up
    if [ ! -f "$ORIGINALS_DIR/$filename" ]; then
        cp "$img" "$ORIGINALS_DIR/$filename"
        echo -e "  ${GREEN}✓${NC} Backed up: $filename"
    else
        echo -e "  ${YELLOW}→${NC} Already backed up: $filename"
    fi
done < <(find_images)

echo ""
echo -e "${YELLOW}Step 2: Compressing images...${NC}"
echo ""

while IFS= read -r img; do
    [ -f "$img" ] || continue

    filename=$(basename "$img")
    extension="${filename##*.}"
    name="${filename%.*}"

    # Get original size
    original_size=$(get_size "$img")
    total_original=$((total_original + original_size))

    # Determine max width based on orientation
    max_width=$(get_max_width "$img")

    # Get current dimensions
    current_width=$(identify -format "%w" "$img" 2>/dev/null)

    # Compress image to temp file first (smart compression)
    extension_lower=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
    temp_file="${img}.tmp"

    if [[ "$extension_lower" == "jpg" ]] || [[ "$extension_lower" == "jpeg" ]]; then
        # JPEG optimization
        $MAGICK_CMD "$img" \
            -resize "${max_width}x${max_width}>" \
            -quality $QUALITY \
            -interlace Plane \
            -strip \
            -sampling-factor 4:2:0 \
            -define jpeg:dct-method=float \
            "$temp_file"
    elif [[ "$extension_lower" == "png" ]]; then
        # PNG optimization
        $MAGICK_CMD "$img" \
            -resize "${max_width}x${max_width}>" \
            -strip \
            -define png:compression-level=9 \
            "$temp_file"
    fi

    # Smart compression: only use compressed version if smaller
    temp_size=$(get_size "$temp_file")
    if [ $temp_size -lt $original_size ]; then
        mv "$temp_file" "$img"
        compressed_size=$temp_size
    else
        rm "$temp_file"
        compressed_size=$original_size
    fi
    total_compressed=$((total_compressed + compressed_size))

    # Calculate savings
    if [ $original_size -gt 0 ]; then
        savings=$(echo "scale=1; (1 - $compressed_size / $original_size) * 100" | bc)
    else
        savings=0
    fi

    # Store results
    processed_files+=("$filename")
    original_sizes+=($original_size)
    compressed_sizes+=($compressed_size)

    echo -e "  ${GREEN}✓${NC} $filename: $(human_size $original_size) → $(human_size $compressed_size) (${savings}% saved)"
done < <(find_images)

echo ""
echo -e "${YELLOW}Step 3: Creating blur placeholders...${NC}"
echo ""

# Create JSON file for placeholder data
PLACEHOLDER_JSON="$PLACEHOLDERS_DIR/placeholders.json"
echo "{" > "$PLACEHOLDER_JSON"
first=true

while IFS= read -r img; do
    [ -f "$img" ] || continue

    filename=$(basename "$img")
    extension="${filename##*.}"
    name="${filename%.*}"

    # Create tiny blur placeholder
    placeholder_file="$PLACEHOLDERS_DIR/${name}-placeholder.jpg"

    $MAGICK_CMD "$img" \
        -resize "${BLUR_SIZE}x${BLUR_SIZE}>" \
        -quality 30 \
        -blur 0x2 \
        -strip \
        "$placeholder_file"

    placeholder_size=$(get_size "$placeholder_file")
    placeholder_sizes+=($placeholder_size)

    # Create base64 encoded version for inline use
    base64_data=$(base64 -i "$placeholder_file" | tr -d '\n')

    # Get dimensions of compressed image
    dimensions=$(identify -format "%wx%h" "$img" 2>/dev/null)

    # Add to JSON
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> "$PLACEHOLDER_JSON"
    fi

    cat >> "$PLACEHOLDER_JSON" << EOF
  "$filename": {
    "placeholder": "data:image/jpeg;base64,$base64_data",
    "dimensions": "$dimensions",
    "placeholderSize": $placeholder_size
  }
EOF

    echo -e "  ${GREEN}✓${NC} $filename → ${name}-placeholder.jpg ($(human_size $placeholder_size))"
done < <(find_images)

echo "" >> "$PLACEHOLDER_JSON"
echo "}" >> "$PLACEHOLDER_JSON"

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}               Optimization Report${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Print detailed results
printf "%-35s %12s %12s %10s\n" "File" "Original" "Compressed" "Savings"
printf "%-35s %12s %12s %10s\n" "----" "--------" "----------" "-------"

for i in "${!processed_files[@]}"; do
    orig=${original_sizes[$i]}
    comp=${compressed_sizes[$i]}
    if [ $orig -gt 0 ]; then
        savings=$(echo "scale=1; (1 - $comp / $orig) * 100" | bc)
    else
        savings=0
    fi
    printf "%-35s %12s %12s %9s%%\n" "${processed_files[$i]}" "$(human_size $orig)" "$(human_size $comp)" "$savings"
done

echo ""
printf "%-35s %12s %12s %10s\n" "----" "--------" "----------" "-------"

if [ $total_original -gt 0 ]; then
    total_savings=$(echo "scale=1; (1 - $total_compressed / $total_original) * 100" | bc)
else
    total_savings=0
fi

printf "%-35s %12s %12s %9s%%\n" "TOTAL" "$(human_size $total_original)" "$(human_size $total_compressed)" "$total_savings"

echo ""
echo -e "${GREEN}Optimization complete!${NC}"
echo ""
echo "Files created:"
echo "  • Original images backed up to: $ORIGINALS_DIR/"
echo "  • Blur placeholders saved to: $PLACEHOLDERS_DIR/"
echo "  • Placeholder data JSON: $PLACEHOLDER_JSON"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Import the ProgressiveImage component in your Astro pages"
echo "  2. Use the placeholders.json for blur-up loading"
echo ""
