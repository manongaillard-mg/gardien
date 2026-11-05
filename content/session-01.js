// The words shared by every theme, and all the words of the theme "What fills your cup?".
// You can change any text between the quotes "..." without touching the rest of the app.
//
// In texts, {weather} and {place} are replaced by your earlier answers,
// using their "inSentence" form, {guardian} by your guardian's name,
// {sentence} by the sentence your guardian whispers and {name} by your first name.
// The first letter of a text is always a capital.

window.SESSION_01 = {
  appName: "Gardien",
  theme: "What fills your cup?",

  // Very first screen, only until a name has been given (or skipped) once
  nameScreen: {
    question: "Hello and welcome to Gardien. What's your name?"
  },

  // The greetings are used at the top of the menu; the "ready" lines on the start screen of the session
  welcome: {
    // {name} is the first name given on the first screen
    greeting: "Nice to meet you, {name}.",
    greetingNoName: "Nice to meet you.",
    // Used instead once a guardian exists (after a first session)
    greetingAgain: "Nice to see you again, {name}.",
    greetingAgainNoName: "Nice to see you again.",
    readyFirst: "Ready for a few curious minutes?",
    readyAgain: "Ready to spend a little time with {guardian}?",
    // Start page of each theme: theme title, ready line, this text, then "Let's begin".
    text: "This is a space for five curious minutes about you.",
    startButton: "Let's begin",
    // List of themes in "5 curious minutes"
    listText: "Let's take five minutes to talk about you…",
    themeQuestion: "Which theme would you like today?"
  },

  buttons: {
    deeper: "Go deeper",
    continue: "Continue"
  },

  questions: [
    {
      key: "weather",
      text: "If your energy today were a kind of weather, what would it be?",
      choices: [
        { label: "Clear sky", inSentence: "a clear sky", reply: "Lovely. Let's explore what keeps those skies clear." },
        { label: "Light drizzle", inSentence: "a light drizzle", reply: "A soft kind of weather. Let's see what it's asking for." },
        { label: "Gusty wind", inSentence: "a gusty wind", reply: "Lots of movement in there. Let's find a calm spot together." },
        { label: "Thick fog", inSentence: "a thick fog", reply: "Fog has its own kind of quiet. Let's find a little light in it." },
        { label: "A rainbow after the storm", inSentence: "a rainbow after the storm", reply: "Something has shifted. Let's look at what helped." }
      ],
      deeper: "What blew this weather in? Name one thing that shaped it."
    },
    {
      key: "place",
      text: "When your inner weather is {weather}, where would you go to feel like yourself again?",
      choices: [
        { label: "A quiet library corner", inSentence: "in a quiet library corner", reply: "A place to hear your own thoughts. Let's keep that in mind." },
        { label: "A quiet corner of the park", inSentence: "in a quiet corner of the park", reply: "Green around you, and the world at a gentle distance. Let's keep that close." },
        { label: "A forest path", inSentence: "on a forest path", reply: "Room to breathe and wander. Let's carry that with us." },
        { label: "Your favourite spot at home", inSentence: "in your favourite spot at home", reply: "Somewhere familiar, where you can just be. Let's remember that." },
        { label: "Your own room", inSentence: "in your own room", reply: "Your own space, your own rules. Let's honour that." }
      ],
      deeper: "What does this place give you that everyday life sometimes forgets to?"
    },
    {
      key: "moment",
      text: "{place}, you feel at ease. Now think of a moment with other people that leaves you lighter rather than drained. What made it feel that way?",
      choices: [
        { label: "Shared laughter", reply: "Laughter has a way of lightening everything. Good to know." },
        { label: "Being truly listened to", reply: "Being heard is a quiet kind of gift." },
        { label: "Not having to make an effort", reply: "Ease with others is precious. Worth noticing where you find it." },
        { label: "Doing something side by side", reply: "Sometimes closeness needs no words, just a shared task." },
        { label: "A comfortable silence", reply: "Silence that feels safe says a lot about trust." }
      ],
      deeper: "When did you last experience this? What made it possible?"
    }
  ],

  guardian: {
    intro: "Close your eyes for a moment, if you like. Somewhere {place}, someone has been quietly waiting for you: a guardian whose only purpose is to watch over your inner balance.",
    form: {
      question: "What form does it take?",
      hint: "(an animal, an element, an object, a figure… let the first image that comes guide you)"
    },
    name: {
      question: "What is its name?"
    },
    quality: {
      question: "Which quality does it carry for you?",
      choices: ["Calm", "Courage", "Gentleness", "Clarity", "Joy"],
      ownWord: "Your own word"
    },
    sentence: {
      question: "Now picture this: you're about to give more than you actually have. {guardian} leans in and whispers something kind and protective. What does it say?",
      hint: "(for example: \"You've done enough for now.\" or \"Your peace matters too.\")"
    },
    // Shown instead of the four questions when a guardian already exists
    again: "{guardian} is already here, quietly waiting for you."
  },

  experiments: {
    intro: "{guardian} has a small suggestion for the days ahead. Choose the one that feels right:",
    choices: [
      { title: "Notice", text: "Once this week, catch a moment when your energy shifts, up or down. Simply notice what was happening. Nothing to fix." },
      { title: "Visit your place", text: "Give yourself ten minutes {place}, even in a small way: a walk, a window, a sound." },
      { title: "Pause", text: "Before saying yes to something, take one breath and hear {guardian} whisper: \"{sentence}\"" }
    ],
    optional: {
      title: "Optional, only if you wish:",
      text: "tell someone you trust what makes a shared moment feel light for you."
    },
    none: "None for now"
  },

  closing: "{guardian}: \"Thank you for this time together. Everything you explored today is safe in your notebook. Whatever you choose to try, or not, you've already done something valuable: you paid attention to yourself. I'll be here whenever you'd like to return.\"",

  // Removed from the closing above if saving failed. Must match the closing text exactly.
  closingSafeSentence: " Everything you explored today is safe in your notebook.",

  // Shown under the closing only if the browser refused to save
  saveFailed: "This session could not be saved in this browser.",

  notebook: {
    open: "Open my notebook",
    // {name} is the first name; the second line is used when no name was given
    title: "Enjoy your notebook, {name}.",
    titleNoName: "Enjoy your notebook.",
    // Title of each entry, after its date (e.g. "26/10/26 – 5 curious minutes")
    entryTitles: {
      cup: "5 curious minutes",
      gratitude: "A time for gratitude",
      special: "Today's special"
    },
    weather: "Your weather",
    place: "Your place",
    moment: "A light moment with others",
    guardian: "Your guardian",
    experiment: "Your experiment",
    empty: "Your notebook is empty for now. It will fill up as you explore.",
    delete: {
      button: "Delete everything",
      confirm: "Delete everything: your notebook, your guardian, your name and your code? This cannot be undone.",
      yes: "Yes, delete",
      keep: "Keep everything",
      done: "Everything has been deleted."
    }
  },

  careNote: {
    link: "Gardien is not a substitute for professional support",
    text: "Gardien is a space for curiosity, not a substitute for professional support. If things feel heavy, please talk to an adult you trust, or to a professional."
  }
};
