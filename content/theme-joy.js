// All the words of the theme "What brings you joy?" live here.
// You can change any text between the quotes "..." without touching the rest of the app.
//
// In texts, {sound} and {spark} are replaced by your earlier answers (their "inSentence" form),
// {guardian} by your guardian's name and {care} by what your guardian says in the joy box.
// The first letter of a text is always a capital.

window.THEME_JOY = {
  id: "joy",
  theme: "What brings you joy?",

  questions: [
    {
      key: "sound",
      text: "If your joy today were a sound, what would it be?",
      choices: [
        { label: "A quiet hum", inSentence: "a quiet hum", reply: "A gentle sound. Let's listen to what keeps it going." },
        { label: "Birdsong", inSentence: "birdsong", reply: "Light and bright. Let's see where it comes from." },
        { label: "A favourite song on repeat", inSentence: "a favourite song on repeat", reply: "Something you love, again and again. Let's find out what it is." },
        { label: "Distant music", inSentence: "distant music", reply: "Joy is there, a little far away. Let's walk towards it together." },
        { label: "Silence, for now", inSentence: "silence", reply: "Silence is allowed too. Let's listen closely, something small may be there." }
      ],
      deeper: "What made your joy sound like this today?"
    },
    {
      key: "spark",
      text: "When your joy sounds like {sound}, which small thing could make it a little brighter?",
      choices: [
        { label: "Something I love to eat or drink", inSentence: "something you love to eat or drink", reply: "Simple pleasures count. Let's keep that one." },
        { label: "Time outside", inSentence: "time outside", reply: "Fresh air has its own kind of magic. Let's remember that." },
        { label: "Making something with my hands", inSentence: "making something with your hands", reply: "Making things is joy you can hold. Let's keep it close." },
        { label: "A song I love", inSentence: "a song you love", reply: "Music finds a way in. Let's carry it with us." },
        { label: "A moment of doing nothing", inSentence: "a moment of doing nothing", reply: "Doing nothing is doing something too. Let's honour that." }
      ],
      deeper: "When did this small thing last make your day brighter?"
    },
    {
      key: "smile",
      text: "Joy can be small, like {spark}. Now think of a moment with other people that made you smile without even trying. What was it about?",
      choices: [
        { label: "A silly joke", reply: "Silliness is underrated. Good to know." },
        { label: "A shared memory", reply: "Some memories keep shining. Worth noticing." },
        { label: "A funny face or voice", reply: "Sometimes joy is just a face away." },
        { label: "Something unexpected", reply: "Surprises can open a door to joy." },
        { label: "Their good mood was catching", reply: "Joy travels from one person to another. Lovely to notice." }
      ],
      deeper: "Who was there, and what made it easy to smile?"
    }
  ],

  // Used only if you meet your guardian for the first time in this theme
  // (session 1's intro mentions your place, which only exists in "What fills your cup?")
  guardianIntro: "Close your eyes for a moment, if you like. Somewhere quiet, someone has been waiting for you: a guardian whose only purpose is to watch over your inner balance.",

  // Imaginary part: the joy box. Its first words depend on how you got here.
  exercise: {
    // Right after meeting your guardian ("Close your eyes…" was already said)
    afterMeeting: "{guardian} has a small box for you. Inside is a joy you haven't met yet.",
    // After "{guardian} is already here, quietly waiting for you."
    // The box sentence fits every form of guardian: an animal, a tree, a cloud…
    afterAgain: "Close your eyes for a moment, if you like. {guardian} has a small box for you. Inside is a joy you haven't met yet.",
    steps: [
      {
        key: "inside",
        type: "text",
        question: "What's inside when you open it?",
        hint: "(a colour, a smell, a sound, an object, a tiny scene… let the first image that comes guide you)"
      },
      {
        key: "size",
        type: "choice",
        question: "How big is this joy?",
        choices: ["Tiny, like a seed", "Pocket-sized", "As big as a room", "Too big to hold", "It keeps changing"]
      },
      {
        key: "care",
        type: "text",
        quote: true, // what the guardian says: shown between quotes
        question: "{guardian} tells you how to take care of it. What does it say?",
        hint: "(for example: \"Give it a little time every day.\" or \"It's yours, even on grey days.\")"
      }
    ]
  },

  experiments: {
    intro: "{guardian} has a small suggestion for the days ahead. Choose the one that feels right:",
    choices: [
      { title: "Notice", text: "Once this week, catch a small moment of joy as it happens, even a tiny one. Just notice it. Nothing to keep or prove." },
      { title: "Make room for it", text: "Give yourself ten minutes for {spark}, just because it feels good." },
      { title: "Open your box", text: "On a grey day, think of what was in your box and hear {guardian} say: \"{care}\"" }
    ],
    optional: {
      title: "Optional, only if you wish:",
      text: "share something that made you smile with someone you trust."
    },
    none: "None for now"
  },

  closing: "{guardian}: \"Thank you for this time together. Everything you explored today is safe in your notebook. Joy doesn't have to be big to count. I'll be here whenever you'd like to return.\"",

  // Small headings in the notebook
  notebook: {
    sound: "Your joy sound",
    spark: "Your little spark",
    smile: "A smile with others",
    exercise: "Your joy box"
  }
};
