# Grafika pro sociální sítě

Zdroje jsou HTML ve stylu webu (barvy, aura, mřížka, fonty z `node_modules/@fontsource`).
PNG se vyfotí headless Chromem a ukládá do `public/assets/social/`.

## Facebook – úvodní fotka (1640 × 624 px)

- Zdroj: `resources/brand/facebook-cover.html`
- Výstup: `public/assets/social/facebook-cover.png` (1640 × 624) a `facebook-cover@2x.png` (3280 × 1248)
- Důležitý obsah drž ve středu (cca 1100 px) – Facebook na mobilu ořezává boky.
  Levý dolní roh nech volný kvůli profilové fotce.

Vygenerování (spouštěj z kořene projektu, po `npm install`):

```bash
for s in 1 2; do "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --force-device-scale-factor=$s --window-size=1640,624 --screenshot="$PWD/public/assets/social/facebook-cover$([ $s = 2 ] && echo @2x).png" "file://$PWD/resources/brand/facebook-cover.html"; done
```

## Facebook – příspěvek do skupin (1080 × 1350 px)

- Zdroj obrázku: `resources/brand/facebook-post.html`
- Výstup: `public/assets/social/facebook-post.png`
- Texty příspěvku (2 varianty + tipy): `resources/brand/facebook-post.md`

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=1080,1350 --screenshot="$PWD/public/assets/social/facebook-post.png" "file://$PWD/resources/brand/facebook-post.html"
```
