# Gardien

A small, calm web app for young teens (roughly 11 to 15) who want to spend a few minutes questioning themselves: what brings them joy and energy, here and now. Adults are welcome too.

**Try it:** https://manongaillard-mg.github.io/gardien/

## What's inside

- **5 curious minutes**: three themes, *What fills your cup?*, *What brings you joy?* and *What's here, right now?*. Each one starts with light questions about the present moment, goes through a short imaginary exercise with your own guardian, and comes back to real life with a small, safe experiment to try.
- **Today's special**: make a little postcard for today, with paper backgrounds, patterns, stickers you can move, resize and turn, and a few words of your own.
- **A time for gratitude**: three small questions, a few words each.
- **My notebook**: everything you made, newest first, which can be protected with a 4-digit code.

## Privacy

- No account, no server, no tracking, no data leaving the device.
- Everything is saved only in the browser (`localStorage`), so each person's notebook stays on their own device. *Delete everything* removes it all.
- Gardien is a space for curiosity. It is not a substitute for professional support, and says so on every screen.

## Built with

Plain HTML, CSS and JavaScript: no framework, no build step, no dependencies. Mobile first, and it works on a computer too.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

then go to http://localhost:8000.

## Project structure

```
index.html            the page
style.css             the look
app.js                screens, saving, notebook
art.js                the postcard and the menu icons
content/              all the texts, one file per theme, easy to edit
images/               backgrounds, postcard papers, stickers, logo
fonts/                Space Mono and its licence
```

## Credits

Concept, design, illustrations and texts: Manon Gaillard. Built with the help of Claude Code.

## Licence

© 2026 Manon Gaillard. All rights reserved: texts, illustrations and code.
The Space Mono font is used under the SIL Open Font License 1.1 (`fonts/OFL-SpaceMono.txt`).
