// The words of the app around the sessions: menu, Today's special, gratitude, notebook code…
// You can change any text between the quotes "..." without touching the rest of the app.

window.APP_TEXT = {
  menu: {
    // Comes after the greeting of content/session-01.js ("Nice to meet you, {name}.")
    text: "What would you like to do today? There are no right or wrong answers here, only yours.",
    choices: {
      cup: { title: "5 curious minutes", line: "A few light questions about you." },
      special: { title: "Today's special", line: "Make a little postcard for today." },
      gratitude: { title: "A time for gratitude", line: "Three small questions about the good things." },
      notebook: { title: "My notebook", line: "Everything you've made so far." }
    }
  },

  gratitude: {
    intro: "Three small questions, a few words each. Small things count too.",
    questions: [
      "Name three nice things that happened to you recently.",
      "Name three things you feel grateful for.",
      "Name three things you'd like to live, say or feel more often."
    ],
    // Hidden names of the three boxes, read by screen readers
    boxes: ["First thing", "Second thing", "Third thing"],
    end: "Thank you for taking a moment for the good things.",
    // Added after `end` only if saving worked
    endSafe: "They're safe in your notebook.",
    // Small headings in the notebook, one per question
    notebook: ["Nice things that happened", "What you feel grateful for", "What you'd like more of"]
  },

  special: {
    intro: "Make a little postcard for today. Tap, pick, and see what happens.",
    background: "Background",
    // Hidden names of the colours, read by screen readers
    backgrounds: { cream: "Cream", brown: "Brown", pink: "Pink", lilac: "Lilac", blue: "Blue", green: "Green", yellow: "Yellow", orange: "Orange", red: "Red" },
    pattern: "Pattern",
    patterns: { none: "None", dots: "Dots", stripes: "Stripes", checks: "Checks", confetti: "Confetti" },
    stickers: "Stickers (up to 3)",
    // Hidden names of the stickers, read by screen readers
    // The pictures are in images/stickers/
    stickerNames: {
      stars: "Stars", "two-leaves": "Two leaves", cloud: "Cloud", "black-sun": "Black sun", rain: "Rain",
      "little-plants": "Little plants", scribbles: "Scribbles", loops: "Loops",
      branch: "Branch", "striped-circles": "Striped circles"
    },
    // Small help under the postcard
    moveHint: "Drag a sticker to move it. To change its size or turn it, pinch and twist it, or double-click it on a computer.",
    words: "Your words",
    wordsHint: "(a word, a wish, a title for your day…)",
    shuffle: "Shuffle the stickers",
    save: "Save my postcard",
    saved: "Your postcard is safe in your notebook."
  },

  // 4-digit code that protects the notebook (optional)
  code: {
    protect: "Protect my notebook with a code",
    remove: "Remove the code",
    choose: "Choose a 4-digit code. You'll need it each time you open your notebook.",
    warning: "This code keeps curious eyes away on a shared device, but it is not a strong lock. If you forget it, it cannot be found again: the only way out will be to delete everything.",
    again: "Type it once more.",
    noMatch: "The two codes don't match. Let's try again.",
    done: "Your notebook is now protected with your code.",
    // Hidden name of the box, read by screen readers
    box: "4-digit code",
    ask: "Your notebook is protected. Type your code.",
    wrong: "That's not the right code. Try again.",
    forgot: "I forgot my code",
    forgotText: "Without the code, the notebook cannot be opened. You can delete everything and start fresh. This cannot be undone.",
    removed: "Your notebook is no longer protected."
  },

  buttons: {
    back: "Back",
    backToMenu: "Back to the menu"
  }
};
