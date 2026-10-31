# Diwali Invitation

## 1. Create the project
In VS Code: File → Open Folder → make a new folder called `diwali-invitation`. Inside it create `index.html`, `style.css`, `script.js`, `README.md`, and a folder `assets` containing two folders: `images` and `audio`. Paste each file's code into the matching file.

## 2. Run it
Install the **Live Server** extension (Ritwick Dey), right-click `index.html` → **Open with Live Server**. You need internet once for GSAP and Google Fonts (CDN links in `index.html`).

## 3. Change details
Edit the `CONFIG` block at the top of `script.js` (date, time, venue, address, RSVP line). The card and the "Copy invitation" text both update automatically.

## 4. Music
Put an MP3 you have rights to use at `assets/audio/diwali-music.mp3` (or change `CONFIG.music`). It starts only after the guest taps Open; the speaker button toggles it. Without the file, nothing breaks.

## 5. Images
No images are required (everything is CSS/SVG/canvas). To add your own, put them in `assets/images/` and reference them as `assets/images/name.jpg`.

## 6. RSVP storage
Clicking an RSVP option only shows a thank-you on screen; **nothing is saved yet**. To collect answers, put your Google Apps Script / Firebase endpoint URL in `CONFIG.rsvpEndpoint`. The `submitRsvp()` function in `script.js` will then POST `{choice, at}` to it.

## 7. Sharing
Live Server only works on your computer. To share on WhatsApp, host the folder free on Netlify Drop, GitHub Pages or Vercel.
