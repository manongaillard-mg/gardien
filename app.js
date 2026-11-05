// Gardien — app logic. The words come from content/session-01.js, content/theme-*.js and content/app-text.js.

const content = window.SESSION_01;
const appText = window.APP_TEXT;
const screen = document.getElementById("screen");

// The themes of "5 curious minutes". Each one has its own questions, imaginary part,
// experiments, closing and notebook headings. "What fills your cup?" keeps its words in session-01.js.
const THEMES = {
  cup: {
    id: "cup",
    theme: content.theme,
    questions: content.questions,
    guardianIntro: content.guardian.intro,
    exercise: null, // in this theme, the imaginary part is meeting the guardian
    experiments: content.experiments,
    closing: content.closing,
    notebook: { weather: content.notebook.weather, place: content.notebook.place, moment: content.notebook.moment }
  },
  joy: window.THEME_JOY,
  here: window.THEME_HERE
};
// Order of the themes in the list of "5 curious minutes"
const THEME_ORDER = ["cup", "joy", "here"];

// The theme of the session in progress
let theme = THEMES.cup;

// The theme of a saved session. The first sessions were saved without a theme id: they are
// "What fills your cup?". A theme that is no longer offered gives null (see makeEntry).
function themeOf(session) {
  if (!session.themeId) return THEMES.cup;
  return THEMES[session.themeId] ?? null;
}

// The session has 5 parts: 3 questions, the guardian (and the theme's imaginary part), the experiment
const PARTS = 5;

// Answers of the session in progress; saved when the closing screen appears
const answers = {};

// --- Saving, only in this browser (localStorage). Nothing leaves the device. ---

const SESSIONS_KEY = "gardien.sessions";
const GUARDIAN_KEY = "gardien.guardian";
const NAME_KEY = "gardien.name";
const AVATAR_KEY = "gardien.avatar";
const CODE_KEY = "gardien.code";

function readSaved(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function writeSaved(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// Deletes the notebook, the guardian, the name and the code from this browser
// (and the avatar of older versions, if one is still saved)
function deleteAll() {
  try {
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(GUARDIAN_KEY);
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(AVATAR_KEY);
    localStorage.removeItem(CODE_KEY);
  } catch {
    // Nothing more we can do; the notebook will show what is still there
  }
  // Also forget the last session kept in memory, so its guardian does not come back
  for (const key of Object.keys(answers)) delete answers[key];
}

// Adds this session to the notebook and keeps the guardian for later sessions
function saveSession() {
  const { form, name, quality, sentence } = answers.guardian;
  const guardian = { form, name, quality, sentence };
  const record = {
    date: new Date().toISOString(),
    themeId: theme.id,
    theme: theme.theme,
    answers: {},
    guardian,
    experiment: answers.experiment ?? null
  };
  // The answers of the imaginary part of the theme (e.g. the joy box), if it has one
  if (theme.exercise) record.exercise = { ...answers.exercise };
  for (const question of theme.questions) {
    const answer = answers[question.key];
    record.answers[question.key] = { label: answer.label, deeper: answer.deeper ?? "" };
  }
  const sessions = readSaved(SESSIONS_KEY, []);
  sessions.push(record);
  return writeSaved(SESSIONS_KEY, sessions) && writeSaved(GUARDIAN_KEY, guardian);
}

// Care note, always available at the bottom of the page
document.getElementById("care-link").textContent = content.careNote.link;
document.getElementById("care-text").textContent = content.careNote.text;

// Once open, a tap anywhere on the note (its text too) closes it;
// the title line already opens and closes it by itself
const careNote = document.querySelector(".care details");
document.getElementById("care-text").addEventListener("click", () => { careNote.open = false; });

// Tells the page which part we are in, so it shows the matching background (style.css).
// Every new page goes through here, so the care note closes when the page changes.
function setPart(part) {
  document.body.dataset.part = part;
  careNote.open = false;
}

function makeButton(label, onClick, className = "button") {
  const button = document.createElement("button");
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

// Gentle progress indicator: one dot per part, the current one coloured
function makeProgress(currentPart, parts = PARTS) {
  const dots = document.createElement("div");
  dots.className = "progress";
  dots.setAttribute("aria-label", `Part ${currentPart} of ${parts}`);
  for (let part = 1; part <= parts; part++) {
    const dot = document.createElement("span");
    dot.className = part === currentPart ? "dot current" : "dot";
    dots.append(dot);
  }
  return dots;
}

// Adds a final full stop if the sentence has no ending punctuation
function withEnding(sentence) {
  return sentence && !/[.!?…]$/.test(sentence) ? sentence + "." : sentence;
}

// The guardian of this session, or the one saved from an earlier session
function guardianName() {
  return answers.guardian?.name ?? readSaved(GUARDIAN_KEY, null)?.name;
}

// Replaces {guardian}, {sentence}, {name} and the earlier answers of the theme
// ({weather}, {place}, {sound}, {spark}, {care}…) in a text
function replaceAnswers(text) {
  const values = {
    guardian: guardianName(),
    sentence: withEnding(answers.guardian?.sentence),
    name: readSaved(NAME_KEY, "")
  };
  // Choices of the questions, in their "inSentence" form (e.g. "a clear sky")
  for (const question of theme.questions) {
    const inSentence = answers[question.key]?.inSentence;
    if (inSentence) values[question.key] = inSentence;
  }
  // Words written in the imaginary part (e.g. what the guardian says in the joy box)
  for (const step of theme.exercise?.steps ?? []) {
    const written = answers.exercise?.[step.key];
    if (written) values[step.key] = step.quote ? withEnding(written) : written;
  }
  return text.replace(/\{(\w+)\}/g, (_, key) => values[key]);
}

function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Plain text with answers filled in, starting with a capital
function fillIn(text) {
  return capitalise(replaceAnswers(text));
}

// Same as fillIn, but writes into `element` and shows the guardian's name in its own style.
// Only the {guardian} spots are styled, never other words that look like the name.
function fillInto(element, text) {
  text.split(/(\{guardian\})/).forEach((piece, index) => {
    if (piece === "{guardian}") {
      const span = document.createElement("span");
      span.className = "guardian-name";
      span.textContent = guardianName();
      element.append(span);
    } else if (piece !== "") {
      const filled = replaceAnswers(piece);
      element.append(index === 0 ? capitalise(filled) : filled);
    }
  });
  return element;
}

// A "Continue" button that stays pale until `isReady()` is true
function makeContinue(isReady, onClick) {
  const button = makeButton(content.buttons.continue, onClick);
  button.disabled = !isReady();
  return button;
}

function makeHint(text) {
  const hint = document.createElement("p");
  hint.className = "hint";
  hint.textContent = text;
  return hint;
}

// The first screen asks the name once; after that, straight to the menu.
function showStart() {
  if (readSaved(NAME_KEY, null) === null) showNameScreen();
  else showMenu();
}

// Optional first name: "Continue" works even if nothing is written
function showNameScreen() {
  setPart("start");
  screen.innerHTML = "";

  const prompt = document.createElement("label");
  prompt.className = "deeper question";
  prompt.append(content.nameScreen.question);

  const box = document.createElement("input");
  box.autocomplete = "given-name";
  prompt.append(box);

  const go = makeButton(content.buttons.continue, () => {
    writeSaved(NAME_KEY, capitalise(box.value.trim()));
    showStart();
  });

  screen.append(prompt, go);
  box.focus();
}

// "Nice to meet you, [name]." or, once something is in the notebook, "Nice to see you again, [name]."
function greeting() {
  const welcome = content.welcome;
  const hasName = Boolean(readSaved(NAME_KEY, ""));
  const isBack = readSaved(SESSIONS_KEY, []).length > 0;
  return isBack
    ? (hasName ? welcome.greetingAgain : welcome.greetingAgainNoName)
    : (hasName ? welcome.greeting : welcome.greetingNoName);
}

// A menu choice: a sticker, the title in bold, then a small line
function makeMenuChoice({ title, line }, sticker, onClick) {
  const choice = document.createElement("button");
  choice.className = "choice card menu-choice";
  const icon = document.createElement("span");
  icon.className = "menu-icon";
  icon.innerHTML = window.ART.drawIcon(sticker);
  choice.append(icon);
  const words = document.createElement("span");
  const strong = document.createElement("strong");
  strong.textContent = title;
  const small = document.createElement("span");
  small.className = "menu-line";
  small.textContent = line;
  words.append(strong, small);
  choice.append(words);
  choice.addEventListener("click", onClick);
  return choice;
}

function showMenu() {
  const menu = appText.menu;
  setPart("menu");
  screen.innerHTML = "";

  const hello = document.createElement("p");
  hello.className = "question";
  hello.textContent = fillIn(greeting());

  const text = document.createElement("p");
  text.textContent = menu.text;

  const choices = document.createElement("div");
  choices.className = "choices";
  choices.append(
    makeMenuChoice(menu.choices.cup, "eye", showThemeList),
    makeMenuChoice(menu.choices.special, "star", showSpecial),
    makeMenuChoice(menu.choices.gratitude, "heart", showGratitudeIntro),
    makeMenuChoice(menu.choices.notebook, "leaf", openNotebook)
  );

  screen.append(hello, text, choices);
}

// "5 curious minutes": the list of themes; tapping one opens its start page
function showThemeList() {
  const welcome = content.welcome;
  setPart("cup");
  screen.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "question theme-title";
  title.textContent = appText.menu.choices.cup.title;

  // "Let's take five minutes to talk about you…" and "Which theme would you like today?",
  // both in the normal text size
  const text = document.createElement("p");
  text.textContent = welcome.listText;

  const ask = document.createElement("p");
  ask.textContent = welcome.themeQuestion;

  const choices = document.createElement("div");
  choices.className = "choices";
  for (const id of THEME_ORDER) {
    choices.append(makeButton(THEMES[id].theme, () => showThemeStart(THEMES[id]), "choice"));
  }

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(makeButton(appText.buttons.back, showMenu, "button secondary"));

  screen.append(title, text, ask, choices, actions);
}

// Start page of a theme, the same for every theme: its title, the ready line, "Let's begin" or "Back"
function showThemeStart(chosen) {
  const welcome = content.welcome;
  setPart("cup");
  screen.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "question theme-title";
  title.textContent = chosen.theme;

  // "Ready for a few curious minutes?" or "Ready to spend a little time with Pip?"
  const ready = document.createElement("p");
  ready.className = "question";
  fillInto(ready, guardianName() ? welcome.readyAgain : welcome.readyFirst);

  const text = document.createElement("p");
  text.textContent = welcome.text;

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(
    makeButton(welcome.startButton, () => startTheme(chosen)),
    makeButton(appText.buttons.back, showThemeList, "button secondary")
  );

  screen.append(title, ready, text, actions);
}

// Starts a theme with fresh answers; the guardian (if any) stays
function startTheme(chosen) {
  theme = chosen;
  for (const key of Object.keys(answers)) if (key !== "guardian") delete answers[key];
  showQuestion(0);
}

// Shows question number `index` (0, 1 or 2), then moves to the next one
function showQuestion(index) {
  const question = theme.questions[index];
  const next = () => {
    if (index + 1 < theme.questions.length) showQuestion(index + 1);
    else if (readSaved(GUARDIAN_KEY, null)) showGuardianAgain();
    else showGuardianForm();
  };
  setPart("questions");
  screen.innerHTML = "";

  const text = document.createElement("p");
  text.className = "question";
  fillInto(text, question.text);

  const choices = document.createElement("div");
  choices.className = "choices";
  choices.dataset.key = question.key;
  for (const choice of question.choices) {
    choices.append(makeButton(choice.label, () => pickChoice(choice), "choice"));
  }

  // A choice can be changed as many times as wanted until "Continue":
  // the picked one is coloured and its reply is shown; "Go deeper" stays as it is.
  let reply = null;
  function pickChoice(choice) {
    answers[question.key] = { label: choice.label, inSentence: choice.inSentence };
    for (const button of choices.querySelectorAll("button")) {
      button.classList.toggle("picked", button.textContent === choice.label);
    }

    // Already a reply on screen: only its words change
    if (reply) {
      reply.textContent = choice.reply;
      return;
    }

    reply = document.createElement("p");
    reply.className = "reply";
    reply.textContent = choice.reply;

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.append(
      makeButton(content.buttons.deeper, goDeeper, "button secondary"),
      makeButton(content.buttons.continue, next)
    );

    // "Go deeper": optional free text, then continue
    function goDeeper() {
      const prompt = document.createElement("label");
      prompt.className = "deeper";
      prompt.textContent = question.deeper;

      const box = document.createElement("textarea");
      box.rows = 3;
      prompt.append(box);

      actions.replaceWith(prompt, makeButton(content.buttons.continue, () => {
        answers[question.key].deeper = box.value.trim();
        next();
      }));
      box.focus();
    }

    screen.append(reply, actions);
  }

  screen.append(makeProgress(index + 1), text, choices);
}

// --- Meeting the guardian (part 4) ---

// One screen with a question and a text box; "Continue" waits for some text
function showTextStep({ intro, question, hint, multiline, onDone }) {
  setPart("guardian");
  screen.innerHTML = "";
  screen.append(makeProgress(4));

  if (intro) {
    const text = document.createElement("p");
    fillInto(text, intro);
    screen.append(text);
  }

  // The question sits in one block, so the guardian's name stays on the same line
  const prompt = document.createElement("label");
  prompt.className = "deeper question";
  prompt.append(fillInto(document.createElement("span"), question));

  const box = document.createElement(multiline ? "textarea" : "input");
  if (multiline) box.rows = 3;
  prompt.append(box);
  if (hint) prompt.append(makeHint(hint));

  const go = makeContinue(() => box.value.trim() !== "", () => onDone(box.value.trim()));
  box.addEventListener("input", () => { go.disabled = box.value.trim() === ""; });

  screen.append(prompt, go);
  box.focus();
}

// The guardian from an earlier session comes back: no need to create it again
function showGuardianAgain() {
  answers.guardian = readSaved(GUARDIAN_KEY, null);
  setPart("guardian");
  screen.innerHTML = "";

  const text = document.createElement("p");
  text.className = "question";
  fillInto(text, content.guardian.again);

  screen.append(makeProgress(4), text, makeButton(content.buttons.continue, () => afterGuardian("again")));
}

// After the guardian: the theme's imaginary part if it has one (joy box…), else the experiments.
// `how` is "meeting" (just met) or "again" (already here), to pick the first words of the part.
function afterGuardian(how) {
  if (theme.exercise) showExercise(0, how);
  else showExperiments();
}

function showGuardianForm() {
  const guardian = content.guardian;
  answers.guardian = {};
  showTextStep({
    intro: theme.guardianIntro,
    question: guardian.form.question,
    hint: guardian.form.hint,
    multiline: true,
    onDone: (form) => {
      answers.guardian.form = form;
      showGuardianName();
    }
  });
}

function showGuardianName() {
  showTextStep({
    question: content.guardian.name.question,
    onDone: (name) => {
      answers.guardian.name = capitalise(name);
      showGuardianQuality();
    }
  });
}

// Pick one quality, or type your own word; can change until "Continue"
function showGuardianQuality() {
  const quality = content.guardian.quality;
  let picked = null;
  setPart("guardian");
  screen.innerHTML = "";

  const text = document.createElement("p");
  text.className = "question";
  text.textContent = quality.question;

  const choices = document.createElement("div");
  choices.className = "choices";

  const ownBox = document.createElement("input");
  ownBox.hidden = true;

  const ownChoice = makeButton(quality.ownWord, () => select(ownChoice), "choice");
  for (const word of quality.choices) {
    const button = makeButton(word, () => select(button), "choice");
    choices.append(button);
  }
  choices.append(ownChoice, ownBox);

  const currentWord = () =>
    picked === ownChoice ? ownBox.value.trim() : picked ? picked.textContent : "";

  const go = makeContinue(() => currentWord() !== "", () => {
    answers.guardian.quality = currentWord();
    showGuardianSentence();
  });

  function select(button) {
    picked = button;
    for (const other of choices.querySelectorAll("button")) {
      other.classList.toggle("picked", other === button);
    }
    ownBox.hidden = button !== ownChoice;
    if (button === ownChoice) ownBox.focus();
    go.disabled = currentWord() === "";
  }
  ownBox.addEventListener("input", () => { go.disabled = currentWord() === ""; });

  screen.append(makeProgress(4), text, choices, go);
}

function showGuardianSentence() {
  showTextStep({
    question: content.guardian.sentence.question,
    hint: content.guardian.sentence.hint,
    multiline: true,
    onDone: (sentence) => {
      // Remove quotes typed around the sentence, so they are not doubled later
      answers.guardian.sentence = sentence.replace(/^["“”]+|["“”]+$/g, "").trim();
      afterGuardian("meeting");
    }
  });
}

// --- The theme's imaginary part, e.g. the joy box (still part 4) ---

// Shows step number `index` of the imaginary part: a text to write, or one choice to pick
function showExercise(index, how) {
  const exercise = theme.exercise;
  const step = exercise.steps[index];
  if (index === 0) answers.exercise = {};
  const intro = index === 0 ? (how === "again" ? exercise.afterAgain : exercise.afterMeeting) : null;
  const next = (value) => {
    answers.exercise[step.key] = value;
    if (index + 1 < exercise.steps.length) showExercise(index + 1, how);
    else showExperiments();
  };

  if (step.type === "text") {
    showTextStep({
      intro,
      question: step.question,
      hint: step.hint,
      multiline: true,
      // Quotes typed around the guardian's words are removed, so they are not doubled later
      onDone: (text) => next(step.quote ? text.replace(/^["“”]+|["“”]+$/g, "").trim() : text)
    });
    return;
  }

  // A choice: pick one, can change until "Continue"
  let picked = null;
  setPart("guardian");
  screen.innerHTML = "";
  screen.append(makeProgress(4));
  if (intro) screen.append(fillInto(document.createElement("p"), intro));

  const text = fillInto(document.createElement("p"), step.question);
  text.className = "question";

  const choices = document.createElement("div");
  choices.className = "choices";
  for (const label of step.choices) {
    const button = makeButton(label, () => {
      picked = label;
      for (const other of choices.querySelectorAll("button")) other.classList.toggle("picked", other === button);
      go.disabled = false;
    }, "choice");
    choices.append(button);
  }
  const go = makeContinue(() => picked !== null, () => next(picked));

  screen.append(text, choices, go);
}

// --- Back to real life (part 5) ---

// A card with a bold title and a text (which may hold {placeholders}), used for each experiment
function makeCard(title, text, onClick) {
  const card = document.createElement("button");
  card.className = "choice card";
  const words = document.createElement("span");
  const strong = document.createElement("strong");
  strong.textContent = title;
  words.append(strong, " ");
  fillInto(words, text);
  card.append(words);
  card.addEventListener("click", onClick);
  return card;
}

// Pick one experiment, or none; can change until "Continue"
function showExperiments() {
  const experiments = theme.experiments;
  let picked = null;
  setPart("experiment");
  screen.innerHTML = "";

  const intro = document.createElement("p");
  intro.className = "question";
  fillInto(intro, experiments.intro);

  const choices = document.createElement("div");
  choices.className = "choices";
  for (const choice of experiments.choices) {
    const card = makeCard(choice.title, choice.text,
      () => select(card, { title: choice.title, text: fillIn(choice.text) }));
    choices.append(card);
  }

  const optional = experiments.optional;
  const optionalCard = makeCard(optional.title, optional.text,
    () => select(optionalCard, { title: optional.title, text: optional.text, optional: true }));
  optionalCard.classList.add("optional");

  const noneChoice = makeButton(experiments.none, () => select(noneChoice, null), "choice");

  const others = document.createElement("div");
  others.className = "choices";
  others.append(optionalCard, noneChoice);

  const go = makeContinue(() => picked !== null, () => {
    answers.experiment = picked.experiment;
    showClosing();
  });

  function select(button, experiment) {
    picked = { button, experiment };
    for (const other of screen.querySelectorAll(".choice")) {
      other.classList.toggle("picked", other === button);
    }
    go.disabled = false;
  }

  screen.append(makeProgress(5), intro, choices, others, go);
}

function showClosing() {
  const saved = saveSession();
  setPart("closing");
  screen.innerHTML = "";

  // If saving failed, the guardian does not claim the session is in the notebook
  const closing = saved ? theme.closing : theme.closing.replace(content.closingSafeSentence, "");

  const words = document.createElement("p");
  words.className = "guardian-says";
  fillInto(words, closing);
  screen.append(makeProgress(5), words);

  // Honest note if the browser refused to save (e.g. some private windows)
  if (!saved) {
    const note = document.createElement("p");
    note.className = "note";
    note.textContent = content.saveFailed;
    screen.append(note);
  }

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(
    makeButton(appText.buttons.backToMenu, showMenu),
    makeButton(content.notebook.open, openNotebook, "button secondary")
  );
  screen.append(actions);
}

// --- Gratitude: 3 questions, up to 3 short answers each ---

function showGratitudeIntro() {
  setPart("gratitude");
  screen.innerHTML = "";

  const text = document.createElement("p");
  text.className = "question";
  text.textContent = appText.gratitude.intro;

  screen.append(text, makeButton(content.buttons.continue, () => showGratitudeQuestion(0, [])));
}

// Question number `index`; `found` holds the answers of the questions before
function showGratitudeQuestion(index, found) {
  const gratitude = appText.gratitude;
  setPart("gratitude");
  screen.innerHTML = "";

  const text = document.createElement("p");
  text.className = "question";
  text.textContent = gratitude.questions[index];

  const boxes = document.createElement("div");
  boxes.className = "choices";
  const filled = () => [...boxes.querySelectorAll("input")].map((box) => box.value.trim()).filter(Boolean);
  for (const label of gratitude.boxes) {
    const box = document.createElement("input");
    box.setAttribute("aria-label", label);
    box.addEventListener("input", () => { go.disabled = filled().length === 0; });
    boxes.append(box);
  }

  // "Continue" works once at least one box is filled
  const go = makeContinue(() => false, () => {
    const all = [...found, filled()];
    if (index + 1 < gratitude.questions.length) showGratitudeQuestion(index + 1, all);
    else showGratitudeEnd(all);
  });

  screen.append(makeProgress(index + 1, gratitude.questions.length), text, boxes, go);
  boxes.querySelector("input").focus();
}

function showGratitudeEnd(found) {
  const gratitude = appText.gratitude;
  const sessions = readSaved(SESSIONS_KEY, []);
  sessions.push({ type: "gratitude", date: new Date().toISOString(), answers: found });
  const saved = writeSaved(SESSIONS_KEY, sessions);

  setPart("gratitude");
  screen.innerHTML = "";

  // If saving failed, do not claim the answers are in the notebook
  const text = document.createElement("p");
  text.className = "question";
  text.textContent = saved ? `${gratitude.end} ${gratitude.endSafe}` : gratitude.end;
  screen.append(text);

  if (!saved) {
    const note = document.createElement("p");
    note.className = "note";
    note.textContent = content.saveFailed;
    screen.append(note);
  }

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(
    makeButton(appText.buttons.backToMenu, showMenu),
    makeButton(content.notebook.open, openNotebook, "button secondary")
  );
  screen.append(actions);
}

// --- Today's special: a little postcard, made by tapping ---

const MAX_STICKERS = 3;

// New random places and a new small tilt for the stickers, never two on the same spot;
// each one keeps its size
function placeStickers(stickers) {
  const spots = window.ART.spots.slice().sort(() => Math.random() - 0.5);
  return stickers.map((sticker, index) => ({
    ...sticker,
    x: spots[index][0],
    y: spots[index][1],
    turn: Math.round(Math.random() * 30 - 15)
  }));
}

// Moving, resizing and turning the stickers on the postcard, with a finger or the mouse:
// - press a sticker, keep pressing, move, let go: it moves;
// - phone: touch a sticker to pick it, then pinch the card with two fingers: it grows or shrinks,
//   and turning the two fingers turns it;
// - computer: double-click a sticker, a frame appears: pull a corner to make it grow or shrink,
//   pull the round handle above the frame to turn it.
// `preview` is the box holding the card, `card` the card being made.
function makeStickersMovable(preview, card) {
  const size = window.ART.stickerSize;
  const pointers = new Map(); // fingers (or the mouse) currently pressing the card
  let selected = null;        // number of the picked sticker
  let frame = "none";         // "none", "line" (phone: picked) or "corners" (computer: double-click)
  let gesture = null;         // "move", "pinch", "corner", "turn" or "tap"
  let start = {};

  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  // Direction from a to b, in degrees
  const angle = (a, b) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  // Keeps a turn between -180 and 180 degrees (a full turn brings it back to the same place)
  const wrap = (degrees) => ((((degrees + 180) % 360) + 360) % 360) - 180;

  // Position of the finger or mouse on the card, in the card's own units (300 x 200)
  function cardPoint(event) {
    const box = preview.querySelector("svg").getBoundingClientRect();
    return { x: ((event.clientX - box.left) * 300) / box.width, y: ((event.clientY - box.top) * 200) / box.height };
  }

  function sizeOf(sticker) { return sticker.size ?? size.normal; }

  // Draws (or removes) the frame around the picked sticker
  function drawFrame() {
    const svg = preview.querySelector("svg");
    if (!svg) return;
    svg.querySelector(".sticker-frame")?.remove();
    const sticker = card.stickers[selected];
    if (!sticker || frame === "none") return;
    const ns = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(ns, "g");
    group.setAttribute("class", "sticker-frame");
    group.setAttribute("transform", `rotate(${sticker.turn} ${sticker.x} ${sticker.y})`);
    const half = sizeOf(sticker) / 2 + 3;
    const line = document.createElementNS(ns, "rect");
    for (const [name, value] of Object.entries({ x: sticker.x - half, y: sticker.y - half, width: half * 2, height: half * 2 })) {
      line.setAttribute(name, value);
    }
    line.setAttribute("class", "frame-line");
    group.append(line);
    if (frame === "corners") {
      for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const corner = document.createElementNS(ns, "rect");
        corner.setAttribute("x", sticker.x + dx * half - 5);
        corner.setAttribute("y", sticker.y + dy * half - 5);
        corner.setAttribute("width", 10);
        corner.setAttribute("height", 10);
        corner.setAttribute("class", "frame-corner");
        corner.dataset.corner = "";
        group.append(corner);
      }
      // Round handle to turn the sticker: above the frame, or below it if there is no room on the card
      const side = sticker.y - half - 18 < 0 ? 1 : -1;
      const stem = document.createElementNS(ns, "line");
      stem.setAttribute("x1", sticker.x);
      stem.setAttribute("x2", sticker.x);
      stem.setAttribute("y1", sticker.y + side * half);
      stem.setAttribute("y2", sticker.y + side * (half + 12));
      stem.setAttribute("class", "frame-line");
      const handle = document.createElementNS(ns, "circle");
      handle.setAttribute("cx", sticker.x);
      handle.setAttribute("cy", sticker.y + side * (half + 17));
      handle.setAttribute("r", 5.5);
      handle.setAttribute("class", "frame-turn");
      handle.dataset.turn = "";
      group.append(stem, handle);
    }
    svg.append(group);
  }

  // Moves or resizes the picked sticker on screen
  function refresh() {
    const element = preview.querySelector(`[data-index="${selected}"]`);
    if (element) window.ART.placeSticker(element, card.stickers[selected]);
    drawFrame();
  }

  function unpick() {
    selected = null;
    frame = "none";
    drawFrame();
  }

  function capture(event) {
    try { preview.setPointerCapture(event.pointerId); } catch { /* not needed for every pointer */ }
  }

  preview.addEventListener("pointerdown", (event) => {
    const point = cardPoint(event);
    pointers.set(event.pointerId, point);
    const onCorner = event.target.closest("[data-corner]");
    const onTurn = event.target.closest("[data-turn]");
    const onSticker = event.target.closest("[data-index]");

    // Second finger: pinch (size) and twist (turn) the picked sticker
    if (pointers.size === 2 && selected !== null) {
      const [a, b] = [...pointers.values()];
      const sticker = card.stickers[selected];
      gesture = "pinch";
      start = { distance: Math.max(distance(a, b), 1), size: sizeOf(sticker), angle: angle(a, b), turn: sticker.turn };
      capture(event);
      if (event.pointerType !== "mouse") event.preventDefault();
      return;
    }
    if (pointers.size > 1) return;

    // The round handle of the frame: turn the sticker around its centre
    if (onTurn && selected !== null) {
      const sticker = card.stickers[selected];
      gesture = "turn";
      start = { angle: angle(sticker, point), turn: sticker.turn };
      capture(event);
      if (event.pointerType !== "mouse") event.preventDefault();
      return;
    }

    // A corner of the frame: grow or shrink from the centre of the sticker
    if (onCorner && selected !== null) {
      const sticker = card.stickers[selected];
      gesture = "corner";
      start = { distance: Math.max(distance(point, sticker), 1), size: sizeOf(sticker) };
      capture(event);
      if (event.pointerType !== "mouse") event.preventDefault();
      return;
    }

    // A sticker: pick it and start moving it
    if (onSticker) {
      const index = Number(onSticker.dataset.index);
      if (event.pointerType === "mouse") {
        if (index !== selected) frame = "none"; // the frame stays only on the same sticker
      } else {
        frame = "line"; // on a phone, a thin frame shows which sticker the pinch will change
      }
      selected = index;
      const sticker = card.stickers[index];
      gesture = "move";
      start = { dx: sticker.x - point.x, dy: sticker.y - point.y };
      capture(event);
      drawFrame();
      if (event.pointerType !== "mouse") event.preventDefault();
      return;
    }

    // An empty spot: if it stays a short tap, the sticker is let go
    gesture = "tap";
  });

  preview.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) return;
    const point = cardPoint(event);
    pointers.set(event.pointerId, point);
    const sticker = card.stickers[selected];
    if (gesture === "move" && sticker && pointers.size === 1) {
      sticker.x = clamp(point.x + start.dx, 0, 300);
      sticker.y = clamp(point.y + start.dy, 0, 200);
      refresh();
    } else if (gesture === "pinch" && sticker && pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      sticker.size = clamp((start.size * distance(a, b)) / start.distance, size.min, size.max);
      sticker.turn = Math.round(wrap(start.turn + wrap(angle(a, b) - start.angle)));
      refresh();
    } else if (gesture === "corner" && sticker) {
      sticker.size = clamp((start.size * distance(point, sticker)) / start.distance, size.min, size.max);
      refresh();
    } else if (gesture === "turn" && sticker) {
      sticker.turn = Math.round(wrap(start.turn + wrap(angle(sticker, point) - start.angle)));
      refresh();
    }
  });

  function letGo(event) {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId);
    if (gesture === "tap" && event.type === "pointerup") unpick();
    // After a pinch, the finger still down does not start moving the sticker
    if (pointers.size === 0 || gesture === "pinch") gesture = pointers.size === 0 ? null : "done";
  }
  preview.addEventListener("pointerup", letGo);
  preview.addEventListener("pointercancel", letGo);

  // Computer: double-click a sticker to show the frame with its corners and round handle.
  // The browser gives the double-click to the whole card (the mouse was caught by it to move
  // the sticker), so we look for the sticker that is really under the mouse.
  preview.addEventListener("dblclick", (event) => {
    const onSticker = document.elementsFromPoint(event.clientX, event.clientY)
      .find((element) => preview.contains(element) && element.matches("[data-index]"));
    if (!onSticker) return;
    selected = Number(onSticker.dataset.index);
    frame = "corners";
    drawFrame();
  });

  // Phone: stop the page from scrolling or zooming while a sticker is moved, pinched or turned
  preview.addEventListener("touchstart", (event) => {
    if (event.touches.length > 1 || event.target.closest("[data-index], [data-corner], [data-turn]")) event.preventDefault();
  }, { passive: false });
  preview.addEventListener("touchmove", (event) => {
    if (gesture && gesture !== "tap") event.preventDefault();
  }, { passive: false });

  // A click or tap anywhere else on the page lets the sticker go
  function outside(event) {
    if (!preview.isConnected) { document.removeEventListener("pointerdown", outside); return; }
    if (!preview.contains(event.target)) unpick();
  }
  document.addEventListener("pointerdown", outside);

  // Called after the card is redrawn (new colour, new sticker…)
  return function afterRedraw() {
    if (selected !== null && !card.stickers[selected]) unpick();
    else drawFrame();
  };
}

function showSpecial() {
  const words = appText.special;
  const card = { background: "cream", pattern: "none", stickers: [], words: "" };
  setPart("special");
  screen.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "question theme-title";
  title.textContent = appText.menu.choices.special.title;

  const intro = document.createElement("p");
  intro.textContent = words.intro;

  const preview = document.createElement("div");
  preview.className = "postcard editable";
  const afterRedraw = makeStickersMovable(preview, card);

  const moveHint = makeHint(words.moveHint);

  // Redraws the card and updates the buttons after each choice
  function update() {
    preview.innerHTML = window.ART.drawPostcard(card, true);
    afterRedraw();
    for (const button of screen.querySelectorAll("[data-background]")) {
      button.setAttribute("aria-pressed", String(button.dataset.background === card.background));
    }
    for (const button of screen.querySelectorAll("[data-pattern]")) {
      button.setAttribute("aria-pressed", String(button.dataset.pattern === card.pattern));
    }
    const chosen = card.stickers.map((sticker) => sticker.id);
    for (const button of screen.querySelectorAll("[data-sticker]")) {
      const isChosen = chosen.includes(button.dataset.sticker);
      button.setAttribute("aria-pressed", String(isChosen));
      button.disabled = !isChosen && chosen.length >= MAX_STICKERS;
    }
    shuffle.disabled = card.stickers.length === 0;
    save.disabled = card.background === "cream" && card.pattern === "none" && chosen.length === 0 && card.words.trim() === "";
  }

  // A small heading, then a row of buttons (`extra`: another class for the row, e.g. the sticker tray)
  function makeRow(label, buttons, extra = "") {
    const row = document.createElement("div");
    row.className = "special-row";
    const heading = document.createElement("h3");
    heading.textContent = label;
    const list = document.createElement("div");
    list.className = `special-buttons ${extra}`.trim();
    list.append(...buttons);
    row.append(heading, list);
    return row;
  }

  // The paper backgrounds, shown as small squares
  const backgroundButtons = window.ART.backgrounds.map((id) => {
    const button = document.createElement("button");
    button.className = "swatch";
    button.dataset.background = id;
    button.style.backgroundImage = `url("${window.ART.backgroundImage(id)}")`;
    button.setAttribute("aria-label", words.backgrounds[id]);
    button.addEventListener("click", () => { card.background = id; update(); });
    return button;
  });

  const patternButtons = window.ART.patterns.map((id) => {
    const button = makeButton(words.patterns[id], () => { card.pattern = id; update(); }, "chip");
    button.dataset.pattern = id;
    return button;
  });

  // Tap to add a sticker, tap again to take it off
  const stickerButtons = window.ART.stickers.map((id) => {
    const button = document.createElement("button");
    button.className = "sticker-choice";
    button.dataset.sticker = id;
    button.setAttribute("aria-label", words.stickerNames[id]);
    const picture = document.createElement("img");
    picture.src = window.ART.stickerImage(id);
    picture.alt = "";
    button.append(picture);
    button.addEventListener("click", () => {
      const chosen = card.stickers.map((sticker) => sticker.id);
      if (chosen.includes(id)) {
        card.stickers = card.stickers.filter((sticker) => sticker.id !== id);
      } else {
        // The new sticker takes a free spot; the others stay where they are
        const taken = card.stickers.map((sticker) => `${sticker.x},${sticker.y}`);
        const free = window.ART.spots.filter((spot) => !taken.includes(spot.join(",")));
        const spot = free[Math.floor(Math.random() * free.length)];
        card.stickers.push({ id, x: spot[0], y: spot[1], turn: Math.round(Math.random() * 30 - 15) });
      }
      update();
    });
    return button;
  });

  const wordsBox = document.createElement("label");
  wordsBox.className = "deeper special-row";
  const wordsHeading = document.createElement("h3");
  wordsHeading.textContent = words.words;
  const box = document.createElement("input");
  box.maxLength = 40;
  box.addEventListener("input", () => { card.words = box.value; update(); });
  wordsBox.append(wordsHeading, box, makeHint(words.wordsHint));

  const shuffle = makeButton(words.shuffle, () => {
    card.stickers = placeStickers(card.stickers);
    update();
  }, "button secondary");
  const save = makeButton(words.save, () => {
    card.words = card.words.trim();
    showSpecialSaved(card);
  });
  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(shuffle, save);

  screen.append(
    title, intro, preview, moveHint,
    makeRow(words.background, backgroundButtons),
    makeRow(words.pattern, patternButtons),
    makeRow(words.stickers, stickerButtons, "sticker-tray"),
    wordsBox, actions
  );
  update();
}

function showSpecialSaved(card) {
  const sessions = readSaved(SESSIONS_KEY, []);
  sessions.push({ type: "postcard", date: new Date().toISOString(), card });
  const saved = writeSaved(SESSIONS_KEY, sessions);

  setPart("special");
  screen.innerHTML = "";

  const preview = document.createElement("div");
  preview.className = "postcard";
  preview.innerHTML = window.ART.drawPostcard(card);

  const text = document.createElement("p");
  text.className = saved ? "question" : "note";
  text.textContent = saved ? appText.special.saved : content.saveFailed;

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(
    makeButton(appText.buttons.backToMenu, showMenu),
    makeButton(content.notebook.open, openNotebook, "button secondary")
  );
  screen.append(preview, text, actions);
}

// --- Notebook: past sessions, newest first ---

// e.g. "27 October 2026 · 18:41"
// Short date, day/month/year: 26/10/26
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

// A notebook entry: a cream strip with the date and the title (tap to open or close),
// then a white area with what was made. Returns the entry and its white area.
function makeEntryShell(iso, title, isOpen) {
  const entry = document.createElement("details");
  entry.className = "entry";
  entry.open = isOpen;
  const summary = document.createElement("summary");
  summary.textContent = `${formatDate(iso)} – ${title}`;
  const body = document.createElement("div");
  body.className = "entry-body";
  entry.append(summary, body);
  return { entry, body };
}

// One labelled part of a notebook entry: a small heading, then lines of text
// One part of a notebook entry: a small heading (optional), then its lines
function makeEntryPart(label, lines) {
  const part = document.createElement("div");
  part.className = "entry-part";
  if (label) {
    const heading = document.createElement("h3");
    heading.textContent = label;
    part.append(heading);
  }
  for (const line of lines) {
    if (!line) continue;
    if (typeof line === "string") {
      const p = document.createElement("p");
      p.textContent = line;
      part.append(p);
    } else {
      part.append(line);
    }
  }
  return part;
}

function makeWritten(text) {
  const p = document.createElement("p");
  p.className = "written";
  p.textContent = text;
  return p;
}

// A gratitude entry: one small heading per question, then the answers
function makeGratitudeEntry(record, isOpen) {
  const { entry, body } = makeEntryShell(record.date, content.notebook.entryTitles.gratitude, isOpen);
  appText.gratitude.notebook.forEach((label, index) => {
    const answers = record.answers[index] ?? [];
    if (answers.length > 0) body.append(makeEntryPart(label, answers));
  });
  return entry;
}

// A postcard entry: the card itself, small
function makePostcardEntry(record, isOpen) {
  const { entry, body } = makeEntryShell(record.date, content.notebook.entryTitles.special, isOpen);
  const preview = document.createElement("div");
  preview.className = "postcard small";
  preview.innerHTML = window.ART.drawPostcard(record.card);
  body.append(preview);
  return entry;
}

function makeEntry(session, isOpen) {
  // Entries without a type are "5 curious minutes" sessions
  if (session.type === "gratitude") return makeGratitudeEntry(session, isOpen);
  if (session.type === "postcard") return makePostcardEntry(session, isOpen);

  const notebook = content.notebook;
  const sessionTheme = themeOf(session);
  const { entry, body } = makeEntryShell(session.date, notebook.entryTitles.cup, isOpen);

  // The theme of the session first, e.g. "What fills your cup?"
  const title = document.createElement("p");
  title.className = "entry-theme";
  title.textContent = session.theme;
  body.append(title);

  if (sessionTheme) {
    for (const question of sessionTheme.questions) {
      const answer = session.answers[question.key];
      if (!answer) continue;
      body.append(makeEntryPart(sessionTheme.notebook[question.key], [
        answer.label,
        answer.deeper && makeWritten(answer.deeper)
      ]));
    }
  } else {
    // A theme that is no longer offered: its answers are still shown, without its headings
    const saved = Object.values(session.answers ?? {});
    body.append(makeEntryPart(null, saved.flatMap((answer) => [answer.label, answer.deeper && makeWritten(answer.deeper)])));
  }

  const guardian = session.guardian;
  const name = document.createElement("p");
  name.className = "guardian-name";
  name.textContent = guardian.name;
  body.append(makeEntryPart(notebook.guardian, [
    name,
    guardian.form,
    guardian.quality,
    makeWritten(`"${withEnding(guardian.sentence)}"`)
  ]));

  // The theme's imaginary part, in the order of the session (e.g. the joy box):
  // what was written, the choice, the guardian's words
  if (sessionTheme?.exercise && session.exercise) {
    body.append(makeEntryPart(sessionTheme.notebook.exercise, sessionTheme.exercise.steps.map((step) => {
      const value = session.exercise[step.key];
      if (!value) return null;
      if (step.type === "choice") return value;
      return makeWritten(step.quote ? `"${withEnding(value)}"` : value);
    })));
  } else if (session.exercise) {
    body.append(makeEntryPart(null, Object.values(session.exercise).map((value) => makeWritten(value))));
  }

  const experiment = session.experiment;
  body.append(makeEntryPart(notebook.experiment, experiment
    ? [experiment.title, experiment.text]
    : [(sessionTheme ?? THEMES.cup).experiments.none]));

  return entry;
}

function showNotebook() {
  setPart("notebook");
  screen.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "question";
  const hasName = Boolean(readSaved(NAME_KEY, ""));
  title.textContent = hasName ? fillIn(content.notebook.title) : content.notebook.titleNoName;
  screen.append(title);

  const sessions = readSaved(SESSIONS_KEY, []).slice().reverse();
  if (sessions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "note";
    empty.textContent = content.notebook.empty;
    screen.append(empty);
  }
  sessions.forEach((session, index) => screen.append(makeEntry(session, index === 0)));

  screen.append(makeButton(appText.buttons.backToMenu, showMenu));

  // Discreet links, so they are not tapped by accident
  const links = document.createElement("div");
  // Small sky-blue buttons side by side
  links.className = "links";
  links.append(readSaved(CODE_KEY, null)
    ? makeButton(appText.code.remove, removeCode, "button small sky")
    : makeButton(appText.code.protect, () => showCodeChoose(null), "button small sky"));
  // Only if there is something to delete
  if (sessions.length > 0 || readSaved(GUARDIAN_KEY, null) || readSaved(NAME_KEY, null) !== null || readSaved(AVATAR_KEY, null)) {
    links.append(makeButton(content.notebook.delete.button, () => showDeleteConfirm(content.notebook.delete.confirm, showNotebook), "button small sky"));
  }
  screen.append(links);
}

// --- 4-digit code: keeps curious eyes away, not a strong lock ---

// The notebook asks for the code first, if there is one
function openNotebook() {
  if (readSaved(CODE_KEY, null)) showCodeAsk(null);
  else showNotebook();
}

// One screen with texts, a 4-digit box, "Continue" (once 4 digits are typed) and "Back".
// `problem` is shown above the box, e.g. "That's not the right code."
function showCodeScreen({ texts, problem, onDone, onBack, extra }) {
  setPart("notebook");
  screen.innerHTML = "";

  texts.forEach((words, index) => {
    const text = document.createElement("p");
    text.className = index === 0 ? "question" : "note";
    text.textContent = words;
    screen.append(text);
  });

  if (problem) {
    const note = document.createElement("p");
    note.className = "problem";
    note.setAttribute("role", "alert");
    note.textContent = problem;
    screen.append(note);
  }

  // Digits are hidden as dots; the phone shows its number keyboard
  const box = document.createElement("input");
  box.className = "code-box";
  box.type = "password";
  box.inputMode = "numeric";
  box.maxLength = 4;
  box.autocomplete = "off";
  box.setAttribute("aria-label", appText.code.box);
  box.addEventListener("input", () => {
    box.value = box.value.replace(/\D/g, "").slice(0, 4);
    go.disabled = box.value.length !== 4;
  });
  box.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && box.value.length === 4) go.click();
  });

  const go = makeContinue(() => false, () => onDone(box.value));
  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(go, makeButton(appText.buttons.back, onBack, "button secondary"));

  screen.append(box, actions);
  if (extra) screen.append(extra);
  box.focus();
}

function showCodeChoose(problem) {
  showCodeScreen({
    texts: [appText.code.choose, appText.code.warning],
    problem,
    onDone: (code) => showCodeAgain(code),
    onBack: showNotebook
  });
}

function showCodeAgain(first) {
  showCodeScreen({
    texts: [appText.code.again],
    onDone: (code) => {
      if (code !== first) showCodeChoose(appText.code.noMatch);
      else if (writeSaved(CODE_KEY, code)) showCodeMessage(appText.code.done);
      else showCodeMessage(content.saveFailed);
    },
    onBack: showNotebook
  });
}

function showCodeAsk(problem) {
  showCodeScreen({
    texts: [appText.code.ask],
    problem,
    onDone: (code) => {
      if (code === readSaved(CODE_KEY, null)) showNotebook();
      else showCodeAsk(appText.code.wrong);
    },
    onBack: showMenu,
    extra: makeButton(appText.code.forgot,
      () => showDeleteConfirm(appText.code.forgotText, () => showCodeAsk(null)), "link-button")
  });
}

function removeCode() {
  try {
    localStorage.removeItem(CODE_KEY);
  } catch {
    // Nothing more we can do
  }
  showCodeMessage(readSaved(CODE_KEY, null) ? content.saveFailed : appText.code.removed);
}

// A short message, then "Continue" back to the notebook
function showCodeMessage(words) {
  setPart("notebook");
  screen.innerHTML = "";
  const text = document.createElement("p");
  text.className = "question";
  text.textContent = words;
  screen.append(text, makeButton(content.buttons.continue, showNotebook));
}

// Confirmation on its own screen; "Keep everything" is the main, safe choice
function showDeleteConfirm(question, onKeep) {
  const words = content.notebook.delete;
  setPart("notebook");
  screen.innerHTML = "";

  const text = document.createElement("p");
  text.className = "question";
  text.textContent = question;

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(
    makeButton(words.keep, onKeep),
    makeButton(words.yes, () => {
      deleteAll();
      showDeleted();
    }, "button secondary")
  );

  screen.append(text, actions);
}

function showDeleted() {
  setPart("notebook");
  screen.innerHTML = "";

  const text = document.createElement("p");
  text.textContent = content.notebook.delete.done;

  // The name is gone too, so "Back" starts again from the very first screen
  screen.append(text, makeButton(appText.buttons.back, showStart));
}

showStart();
