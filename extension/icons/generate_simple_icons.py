#!/usr/bin/env python3
"""
Script pour générer des icônes PNG simples (sans SVG)
Nécessite seulement: pip install pillow
"""

import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("❌ Erreur: Pillow n'est pas installé.")
    print("\nInstallez-le avec:")
    print("  pip install pillow")
    sys.exit(1)

# Tailles d'icônes requises pour Chrome
SIZES = [16, 32, 48, 128]

def create_gradient_icon(size):
    """Crée une icône simple avec un dégradé et un symbole"""
    # Créer une image RGBA
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Dessiner un cercle avec dégradé (simulé)
    # Couleur principale: violet/bleu (#667eea à #764ba2)
    for i in range(size):
        # Interpoler entre les deux couleurs
        ratio = i / size
        r = int(102 + (118 - 102) * ratio)
        g = int(126 + (75 - 126) * ratio)
        b = int(234 + (162 - 234) * ratio)

        # Dessiner un cercle graduel
        margin = 2
        draw.ellipse(
            [(margin + i/4, margin + i/4), (size - margin - i/4, size - margin - i/4)],
            fill=(r, g, b, 255)
        )

    # Dessiner un symbole simple (une boîte/paquet)
    if size >= 48:
        # Pour les grandes icônes, dessiner un paquet
        center_x, center_y = size // 2, size // 2
        box_size = size // 3

        # Dessiner les lignes du paquet
        draw.line(
            [(center_x - box_size, center_y), (center_x, center_y - box_size//2)],
            fill='white',
            width=max(2, size // 32)
        )
        draw.line(
            [(center_x, center_y - box_size//2), (center_x + box_size, center_y)],
            fill='white',
            width=max(2, size // 32)
        )
        draw.line(
            [(center_x, center_y - box_size//2), (center_x, center_y + box_size)],
            fill='white',
            width=max(2, size // 32)
        )
        draw.line(
            [(center_x - box_size, center_y), (center_x - box_size, center_y + box_size//2)],
            fill='white',
            width=max(2, size // 32)
        )
        draw.line(
            [(center_x + box_size, center_y), (center_x + box_size, center_y + box_size//2)],
            fill='white',
            width=max(2, size // 32)
        )
    else:
        # Pour les petites icônes, juste un point blanc au centre
        point_size = max(2, size // 4)
        draw.ellipse(
            [(size//2 - point_size, size//2 - point_size),
             (size//2 + point_size, size//2 + point_size)],
            fill='white'
        )

    return img

def generate_icons():
    """Génère les icônes PNG"""
    script_dir = os.path.dirname(os.path.abspath(__file__))

    print("📦 Génération des icônes PNG simples...")

    for size in SIZES:
        output_path = os.path.join(script_dir, f'icon{size}.png')

        try:
            img = create_gradient_icon(size)
            img.save(output_path, 'PNG')
            print(f"  ✅ {output_path} créé ({size}x{size})")

        except Exception as e:
            print(f"  ❌ Erreur lors de la création de icon{size}.png: {e}")

    print("\n✨ Génération terminée!")
    print("\nVous pouvez maintenant charger l'extension dans Chrome.")

if __name__ == '__main__':
    generate_icons()
