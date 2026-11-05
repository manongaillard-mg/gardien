// All the words of the theme "What's here, right now?" live here.
// You can change any text between the quotes "..." without touching the rest of the app.
// The theme is about accepting the here and now, open-mindedness and letting go,
// rather than picturing a better day later.
//
// In texts, {water} and {notice} are replaced by your earlier answers (their "inSentence" form),
// {guardian} by your guardian's name and {reminder} by what your guardian tells you by the river.
// The first letter of a text is always a capital.

window.THEME_HERE = {
  id: "here",
  theme: "What's here, right now?",

  questions: [
    {
      key: "water",
      text: "If this moment were a kind of water, what would it be?",
      choices: [
        { label: "A still lake", inSentence: "a still lake", reply: "Calm water. Let's stay here for a moment." },
        { label: "A small stream", inSentence: "a small stream", reply: "Gently moving. Let's follow it for a while." },
        { label: "A rushing river", inSentence: "a rushing river", reply: "Lots of movement. You don't have to stop it, just watch it pass." },
        { label: "A wave about to break", inSentence: "a wave about to break", reply: "Something is building up. It's okay to let it be there." },
        { label: "Rain on a window", inSentence: "rain on a window", reply: "A grey kind of moment. It's allowed to be just that." }
      ],
      deeper: "What is making this moment feel the way it does?"
    },
    {
      key: "notice",
      text: "When this moment feels like {water}, what can you notice around you, right here?",
      choices: [
        { label: "A sound I hadn't noticed", inSentence: "a sound you hadn't noticed", reply: "Sounds are always there, waiting to be heard." },
        { label: "The feeling of my feet on the ground", inSentence: "the feeling of your feet on the ground", reply: "The ground holds you, right here." },
        { label: "My breath going in and out", inSentence: "your breath going in and out", reply: "Your breath is always with you, in this very moment." },
        { label: "A colour or a shape nearby", inSentence: "a colour or a shape nearby", reply: "Looking closely is a way of being here." },
        { label: "The air on my skin", inSentence: "the air on your skin", reply: "Your skin knows exactly where you are." }
      ],
      deeper: "Stay with it for a few seconds. What else do you notice?"
    },
    {
      key: "together",
      text: "Right now, there's {notice}. Now think of a moment with other people when you felt fully there, not somewhere else in your head. What made it possible?",
      choices: [
        { label: "We were laughing", reply: "Laughter pulls everyone into the same moment." },
        { label: "We were making something together", reply: "Busy hands keep the mind close." },
        { label: "We were outside, moving", reply: "Moving together keeps you here." },
        { label: "Nobody was rushing", reply: "Without rushing, there's room to be present." },
        { label: "I felt accepted as I was", reply: "Being accepted as you are makes it easier to accept the moment too." }
      ],
      deeper: "When did this last happen? Who was there?"
    }
  ],

  // Used only if you meet your guardian for the first time in this theme
  // (session 1's intro mentions your place, which only exists in "What fills your cup?")
  guardianIntro: "Close your eyes for a moment, if you like. Somewhere quiet, someone has been waiting for you: a guardian whose only purpose is to watch over your inner balance.",

  // Imaginary part: the leaf on the river (letting go, without going to the future).
  // "Next to {guardian}" fits every form of guardian.
  exercise: {
    // Right after meeting your guardian ("Close your eyes…" was already said)
    afterMeeting: "Next to {guardian}, a slow river flows by. Leaves float on it, one after another.",
    // After "{guardian} is already here, quietly waiting for you."
    afterAgain: "Close your eyes for a moment, if you like. Next to {guardian}, a slow river flows by. Leaves float on it, one after another.",
    steps: [
      {
        key: "thought",
        type: "text",
        question: "Is there a thought you'd like to put on a leaf and let float away, just for now?",
        hint: "(a worry, a \"should\", a thought that keeps coming back… a few words are enough, or simply \"nothing for now\")"
      },
      {
        key: "feeling",
        type: "choice",
        question: "The leaf drifts away. How does it feel to watch it go?",
        choices: ["Lighter", "Calm", "A little strange", "It came back, and that's okay", "I'm not sure yet"]
      },
      {
        key: "reminder",
        type: "text",
        quote: true, // what the guardian says: shown between quotes
        question: "{guardian} tells you something to remember when your mind runs ahead. What does it say?",
        hint: "(for example: \"Right here is the right place.\" or \"Let it pass, like a leaf.\")"
      }
    ]
  },

  experiments: {
    intro: "{guardian} has a small suggestion for the days ahead. Choose the one that feels right:",
    choices: [
      { title: "Come back", text: "Once this week, when your mind runs ahead, gently notice it, then come back to {notice}." },
      { title: "One leaf", text: "When a thought keeps coming back, picture it on a leaf and let it float by. No need to push it away." },
      { title: "Here and now", text: "Once a day, stop for one breath and hear {guardian} say: \"{reminder}\"" }
    ],
    optional: {
      title: "Optional, only if you wish:",
      text: "spend a few minutes with someone you trust, with nowhere else to be."
    },
    none: "None for now"
  },

  closing: "{guardian}: \"Thank you for this time together. Everything you explored today is safe in your notebook. Here and now is always a place you can come back to. I'll be here whenever you'd like to return.\"",

  // Small headings in the notebook
  notebook: {
    water: "Your water",
    notice: "What you noticed",
    together: "Being there with others",
    exercise: "The leaf on the river"
  }
};
