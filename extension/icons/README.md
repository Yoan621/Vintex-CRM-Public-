# Icônes pour l'extension Vintex CRM

Ce dossier doit contenir les icônes de l'extension aux formats suivants :

- `icon16.png` - 16x16 pixels
- `icon32.png` - 32x32 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

## ⚡ Génération des icônes (choisissez UNE option)

### 🌐 Option 1: Dans le navigateur (LE PLUS SIMPLE ✨)

**✅ Aucune installation requise !**

1. Ouvrez le fichier **`generate-icons-browser.html`** dans Chrome (double-clic)
2. Les icônes s'affichent automatiquement
3. Cliquez sur **"Télécharger toutes les icônes"**
4. Déplacez les 4 fichiers PNG téléchargés dans le dossier `icons/`

Fonctionne sur Mac, Windows, Linux - Pas besoin de Python ou autres outils !

---

### 🐍 Option 2: Script Python avec Pillow

1. Installez Pillow :
```bash
pip install pillow
```

2. Exécutez le script :
```bash
python3 generate_simple_icons.py
```

---

### 🎨 Option 3: Script Python avec CairoSVG (meilleure qualité)

1. Installez les dépendances :
```bash
pip install cairosvg pillow
```

2. Exécutez le script :
```bash
python3 generate_icons.py
```

---

### 🛠️ Option 4: ImageMagick (si déjà installé)

Si vous avez ImageMagick (`brew install imagemagick`) :

```bash
chmod +x create-simple-icons.sh
./create-simple-icons.sh
```

Ou manuellement depuis le SVG :
```bash
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 32x32 icon32.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

---

### 🎯 Option 5: Vos propres icônes

Créez vos icônes avec Figma, Photoshop, Canva, etc. et exportez-les en PNG.

L'icône doit représenter votre marque Vintex CRM.

## Format requis

- Format : PNG
- Fond : Transparent (RGBA) ou couleur unie
- Couleurs : Idéalement cohérentes avec votre charte graphique (violet/bleu suggéré)

## Note

L'extension ne fonctionnera pas sans ces icônes. Chrome affichera une erreur lors du chargement si les fichiers PNG sont manquants.
