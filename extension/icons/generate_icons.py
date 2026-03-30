#!/usr/bin/env python3
"""
Script pour générer les icônes PNG à partir du SVG
Nécessite: pip install cairosvg pillow
"""

import os
import sys

try:
    import cairosvg
    from PIL import Image
    import io
except ImportError:
    print("❌ Erreur: les bibliothèques requises ne sont pas installées.")
    print("\nInstallez-les avec:")
    print("  pip install cairosvg pillow")
    sys.exit(1)

# Tailles d'icônes requises pour Chrome
SIZES = [16, 32, 48, 128]

def generate_icons():
    """Génère les icônes PNG à partir du SVG"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    svg_path = os.path.join(script_dir, 'icon.svg')

    if not os.path.exists(svg_path):
        print(f"❌ Fichier SVG non trouvé: {svg_path}")
        sys.exit(1)

    print(f"📦 Génération des icônes à partir de {svg_path}...")

    for size in SIZES:
        output_path = os.path.join(script_dir, f'icon{size}.png')

        try:
            # Convertir SVG en PNG avec cairosvg
            png_data = cairosvg.svg2png(
                url=svg_path,
                output_width=size,
                output_height=size
            )

            # Sauvegarder le PNG
            with open(output_path, 'wb') as f:
                f.write(png_data)

            print(f"  ✅ {output_path} créé ({size}x{size})")

        except Exception as e:
            print(f"  ❌ Erreur lors de la création de icon{size}.png: {e}")

    print("\n✨ Génération terminée!")

if __name__ == '__main__':
    generate_icons()
