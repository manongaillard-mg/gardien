// Gardien — the postcard of Today's special and the small menu icons.
// The postcard uses illustrated papers and stickers (images/cards/ and images/stickers/);
// the 4 menu icons are drawn in code.

(function () {
  // Colours of the menu icons and of the patterns
  const colour = {
    ink: "#1d1a17", card: "#fbf6ea", tomato: "#e23a24", pink: "#f05f9a", orange: "#f47b20",
    mustard: "#f7c51e", blue: "#2448a8", green: "#1f7a45", sky: "#7cc4dc"
  };
  const cream = "#fffbe6"; // the app's cream, for the strip of words on the postcard

  const circle = (cx, cy, r, fill) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;

  // A star with `points` tips, first tip pointing up
  function star(cx, cy, outer, inner, points, fill) {
    const corners = [];
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outer : inner;
      const angle = (Math.PI * i) / points - Math.PI / 2;
      corners.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
    }
    return `<polygon fill="${fill}" points="${corners.join(" ")}"/>`;
  }

  // --- Menu icons: flat colours with a white edge, like real stickers ---
  // Each one is drawn by a function `c`, which gives the colour of each part;
  // the white edge is the same drawing, all in white, with a thick outline.
  const icons = {
    star: (c) => star(50, 50, 46, 20, 5, c("mustard")),
    heart: (c) => `<path fill="${c("tomato")}" d="M50 88C18 64 6 44 18 26 30 10 46 18 50 30 54 18 70 10 82 26 94 44 82 64 50 88z"/>`,
    leaf: (c) => `<path fill="${c("green")}" d="M16 84C16 42 44 14 86 14 86 56 58 84 16 84z"/>` +
      `<path d="M22 78L66 34" fill="none" stroke="${c("card")}" stroke-width="4" stroke-linecap="round"/>`,
    eye: (c) => `<path fill="${c("card")}" stroke="${c("ink")}" stroke-width="4" d="M8 54Q50 16 92 54 50 92 8 54z"/>` +
      circle(50, 54, 15, c("blue")) + circle(50, 54, 6, c("ink")) +
      ["M30 30l-5-9", "M50 24v-11", "M70 30l5-9"].map((d) =>
        `<path d="${d}" stroke="${c("ink")}" stroke-width="4" stroke-linecap="round"/>`).join("")
  };

  function drawIcon(id) {
    const edge = `<g stroke="#fff" stroke-width="10" stroke-linejoin="round">${icons[id](() => "#fff")}</g>`;
    return `<svg viewBox="-8 -8 116 116" aria-hidden="true">${edge}${icons[id]((name) => colour[name])}</svg>`;
  }

  // --- Postcard: paper backgrounds and stickers ---

  // Order here = order on screen. Each id is a file in images/cards/ (.jpg) or images/stickers/ (.png).
  const backgrounds = ["cream", "brown", "pink", "lilac", "blue", "green", "yellow", "orange", "red"];
  const stickers = ["stars", "two-leaves", "cloud", "black-sun", "rain", "little-plants",
    "scribbles", "loops", "branch", "striped-circles"];

  const backgroundImage = (id) => `images/cards/${id}.jpg`;
  const stickerImage = (id) => `images/stickers/${id}.png`;

  // Older postcards used other names: closest match, or not shown
  const oldBackgrounds = { tomato: "red", mustard: "yellow", sky: "blue" };
  const oldStickers = { star: "stars", cloud: "cloud", leaf: "branch" };

  // Where stickers may sit (centre of each sticker), always above the strip of words
  const spots = [[58, 56], [150, 46], [242, 58], [100, 104], [200, 104], [36, 112], [264, 112]];
  // Size of a sticker on the 300 x 200 card; it can be changed between half and 2.5 times
  const STICKER_SIZE = 74;
  const STICKER_MIN = 37;
  const STICKER_MAX = 185;

  // Where a sticker sits: its centre (x, y), its size and its small turn
  function stickerPlace(sticker) {
    const size = sticker.size ?? STICKER_SIZE;
    return {
      x: (sticker.x - size / 2).toFixed(1),
      y: (sticker.y - size / 2).toFixed(1),
      width: size.toFixed(1),
      height: size.toFixed(1),
      transform: `rotate(${sticker.turn} ${sticker.x.toFixed(1)} ${sticker.y.toFixed(1)})`
    };
  }

  // Moves or resizes a sticker already on screen, without redrawing the whole card
  function placeSticker(element, sticker) {
    for (const [name, value] of Object.entries(stickerPlace(sticker))) element.setAttribute(name, value);
  }

  // Each pattern is drawn in a small tile repeated over the card; `ink` is its colour
  const patterns = {
    none: () => "",
    dots: (ink) => `<pattern id="ID" width="20" height="20" patternUnits="userSpaceOnUse">${circle(10, 10, 3.5, ink)}</pattern>`,
    stripes: (ink) => `<pattern id="ID" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="18" fill="${ink}"/></pattern>`,
    checks: (ink) => `<pattern id="ID" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="15" height="15" fill="${ink}"/><rect x="15" y="15" width="15" height="15" fill="${ink}"/></pattern>`,
    confetti: () => `<pattern id="ID" width="60" height="60" patternUnits="userSpaceOnUse">` +
      `<rect x="6" y="8" width="9" height="4" rx="2" fill="${colour.blue}" transform="rotate(30 10 10)"/>` +
      circle(40, 12, 3, colour.tomato) +
      `<rect x="26" y="34" width="9" height="4" rx="2" fill="${colour.mustard}" transform="rotate(-25 30 36)"/>` +
      circle(10, 44, 3, colour.green) +
      `<rect x="44" y="46" width="9" height="4" rx="2" fill="${colour.pink}" transform="rotate(60 48 48)"/>` +
      circle(52, 28, 2.5, colour.orange) + `</pattern>`
  };

  const escape = (text) => text.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

  let drawn = 0; // each postcard gets its own pattern name, so several cards can share a page

  // card = { background, pattern, stickers: [{ id, x, y, turn, size }], words }
  // `editable`: each sticker gets its number, so it can be moved and resized on screen
  function drawPostcard(card, editable = false) {
    const id = `pattern-${++drawn}`;
    let background = oldBackgrounds[card.background] ?? card.background;
    if (!backgrounds.includes(background)) background = "cream";
    const ink = background === "cream" ? "rgba(46,42,38,0.13)" : "rgba(255,250,241,0.4)";
    const pattern = (patterns[card.pattern] ?? patterns.none)(ink).replace('id="ID"', `id="${id}"`);
    let inside = `<image href="${backgroundImage(background)}" width="300" height="200" preserveAspectRatio="xMidYMid slice"/>`;
    if (pattern) inside += `<defs>${pattern}</defs><rect width="300" height="200" fill="url(#${id})"/>`;
    card.stickers.forEach((sticker, index) => {
      const name = oldStickers[sticker.id] ?? sticker.id;
      if (!stickers.includes(name)) return;
      const place = Object.entries(stickerPlace(sticker)).map(([key, value]) => `${key}="${value}"`).join(" ");
      const mark = editable ? ` class="sticker" data-index="${index}"` : "";
      inside += `<image href="${stickerImage(name)}" ${place}${mark}/>`;
    });
    // The words last, so their strip covers the stickers where they overlap.
    // The strip lets touches through, so a sticker under it can still be moved.
    const words = (card.words ?? "").trim();
    if (words) {
      // A straight strip of paper, so the words stay readable on every background.
      // Space Mono letters are about 0.6 of their size wide, so long words get smaller.
      const size = Math.min(17, 390 / words.length);
      inside += `<g pointer-events="none"><rect x="24" y="148" width="252" height="36" fill="${cream}"/>` +
        `<text x="150" y="167" text-anchor="middle" dominant-baseline="middle" font-family="Space Mono, monospace" font-weight="700" font-size="${size.toFixed(1)}" fill="${colour.ink}">${escape(words)}</text></g>`;
    }
    return `<svg viewBox="0 0 300 200" aria-hidden="true">${inside}</svg>`;
  }

  window.ART = {
    // Today's special: lists in the order shown on screen
    backgrounds,
    backgroundImage,
    patterns: Object.keys(patterns),
    stickers,
    stickerImage,
    spots,
    stickerSize: { normal: STICKER_SIZE, min: STICKER_MIN, max: STICKER_MAX },
    placeSticker,
    drawPostcard,
    // Menu icons: eye, star, heart, leaf
    drawIcon
  };
})();
