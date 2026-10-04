# People of the Verse: demo site

A static site (plain HTML, CSS and JS, no build step) made directly from the
final desktop and mobile designs. Every page holds both layouts: the desktop
design shows at 900px and wider, the mobile design below that.

## Put it on GitHub Pages

1. Create a repository and upload everything in this folder (keep the structure).
2. Repository **Settings → Pages → Build and deployment**: source **Deploy from a branch**,
   branch **main**, folder **/ (root)**.
3. After a minute the site is at `https://<your-name>.github.io/<repo>/`.

All links are relative, so it works from that sub-path. To preview locally:
`python3 -m http.server` in this folder, then open http://localhost:8000.

## What the team can play with

Press **PLAYGROUND** (bottom left) on any page:

- **Content**: switch between the placeholders (what the design shows today) and clearly fake sample content.
- **Colours**: re-theme the whole site live (teal, yellow, deep, paper, mist).
- **Look**: turn the graph paper off, pause the ticker.
- **Audience box**: slips people put in on the Home, Events and Perform pages; *Draw two slips* picks two.
- **Export JSON / Reset**: download everything entered in the demo, or clear it.

Slips, notes, PoV Mag submissions and wall poems are stored in the visitor's own
browser only. Nothing is sent anywhere. For a real launch, connect the forms to a
service (a form tool, Google Forms or a small backend).

## Filling in the real content

All facts live in `assets/js/content.js` (`live` section). Replace the `[PLACEHOLDERS]`,
add photos in `assets/img/` and point to them (for example `photo: 'assets/img/team-01.jpg'`).
Empty photo fields keep the placeholder tile.

## Before going public

- Set `playground: false` in `assets/js/content.js` to hide the Playground button.
- Replace the placeholder links (YouTube, feedback QR, RSVP, donate links).
- Pick the real contact email.

## How it is built

The pages were generated from the design files, so layout, type and colours match
them exactly. `assets/js/site.js` fills content and runs the forms, lists and
Playground; `assets/js/magnets.js` runs the Word magnets board.
