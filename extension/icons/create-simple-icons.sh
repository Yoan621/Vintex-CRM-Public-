#!/bin/bash
# Script pour créer des icônes PNG basiques avec ImageMagick
# Si ImageMagick n'est pas installé : brew install imagemagick

if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick n'est pas installé."
    echo "Installez-le avec: brew install imagemagick"
    exit 1
fi

cd "$(dirname "$0")"

# Créer des icônes simples avec ImageMagick
for size in 16 32 48 128; do
    convert -size ${size}x${size} xc:none \
        -fill "#667eea" \
        -draw "circle $((size/2)),$((size/2)) $((size/2)),$((size/10))" \
        -fill white \
        -draw "rectangle $((size/3)),$((size/3)) $((2*size/3)),$((2*size/3))" \
        icon${size}.png
    echo "✅ icon${size}.png créé"
done

echo "✨ Icônes générées avec succès !"
