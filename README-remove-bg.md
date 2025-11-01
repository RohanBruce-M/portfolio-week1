Remove background script (local)

This repository includes a simple Node-based helper to attempt local background removal using Jimp.

Requirements
- Node.js (14+ recommended)
- npm

Install

From the project root folder (where your `protfolio.html` lives):

```powershell
npm init -y; npm i jimp
```

Usage

Replace the filenames below with your actual filenames if different.

```powershell
node tools/remove-bg.js "profile.jpeg" "assets/char1.png"
node tools/remove-bg.js "WhatsApp Image 2025-10-07 at 2.38.56 PM (1).jpeg" "assets/char2.png"
node tools/remove-bg.js "WhatsApp Image 2025-10-07 at 2.38.56 PM (2).jpeg" "assets/char3.png"
```

Options (optional):
- 3rd CLI arg: tolerance (default 60) — smaller = stricter matching of background color
- 4th CLI arg: soften (default 12) — larger = softer feathering of transparency

Notes
- This is a best-effort script and works best with relatively uniform backgrounds.
- If the background is busy or contains similar tones to the subject, manual editing (Photoshop/GIMP/online tools) will give better results.
- After running, the script will write `assets/char1.png` etc. The site HTML already points to `assets/char1.png`.. so the new transparent PNGs will be used automatically once generated.
