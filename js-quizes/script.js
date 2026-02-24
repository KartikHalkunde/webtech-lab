const quizData = [
  {
    id: 1,
    difficulty: 'Warm-up',
    question: 'Which JavaScript method converts a JSON string into a JavaScript object?',
    meta: 'Core JSON operations',
    options: ['JSON.parse()', 'JSON.stringify()', 'Object.fromJSON()', 'JSON.convert()'],
    answer: 0,
    hint: 'Think of reading a string and turning it into live data.',
    explanation: 'JSON.parse() reads a JSON-formatted string and returns a JavaScript value.'
  },
  {
    id: 2,
    difficulty: 'Warm-up',
    question: 'What does the keyword "const" guarantee?',
    meta: 'Variable declarations',
    options: ['The value is immutable', 'The binding cannot be reassigned', 'The value is private', 'The variable is global'],
    answer: 1,
    hint: 'It is about the binding, not necessarily the object itself.',
    explanation: 'const prevents reassignment of the binding, but objects can still mutate.'
  },
  {
    id: 3,
    difficulty: 'Core',
    question: 'Which array method is best for transforming every element into a new array?',
    meta: 'Functional array methods',
    options: ['forEach()', 'map()', 'reduce()', 'filter()'],
    answer: 1,
    hint: 'The method returns an array of equal length by default.',
    explanation: 'map() creates a new array by applying a function to each element.'
  },
  {
    id: 4,
    difficulty: 'Core',
    question: 'What is the output of: Boolean("") ?',
    meta: 'Truthiness',
    options: ['true', 'false', 'null', 'undefined'],
    answer: 1,
    hint: 'Empty strings are one of the falsy values.',
    explanation: 'An empty string is falsy, so Boolean("") evaluates to false.'
  },
  {
    id: 5,
    difficulty: 'Core',
    question: 'Which statement about event bubbling is correct?',
    meta: 'DOM events',
    options: ['Events move from parent to child', 'Events stay on the target only', 'Events move from child to parent', 'Events are asynchronous by default'],
    answer: 2,
    hint: 'Think of the event climbing back up the tree.',
    explanation: 'In bubbling, the event propagates from the target element up through its ancestors.'
  },
  {
    id: 6,
    difficulty: 'Advanced',
    question: 'What does the `await` keyword do in an async function?',
    meta: 'Async/await semantics',
    options: ['Blocks the entire JS thread', 'Pauses the async function until the promise settles', 'Turns a promise into a callback', 'Cancels the promise'],
    answer: 1,
    hint: 'It pauses only the async function, not the whole runtime.',
    explanation: 'await suspends the async function until the promise resolves or rejects.'
  },
  {
    id: 7,
    difficulty: 'Advanced',
    question: 'Which choice correctly describes a closure?',
    meta: 'Scope & closures',
    options: [
      'A function plus its lexical environment',
      'A block that hides variables from JS',
      'A method that closes over HTML elements',
      'A variable that never changes'
    ],
    answer: 0,
    hint: 'It carries its surrounding scope with it.',
    explanation: 'A closure is a function combined with the lexical environment it was created in.'
  },
  {
    id: 8,
    difficulty: 'Mastery',
    question: 'When is the microtask queue processed in the event loop?',
    meta: 'Event loop timing',
    options: [
      'Before the current call stack finishes',
      'After the current call stack but before the next macrotask',
      'Only when there are no macrotasks left',
      'At the same time as rendering'
    ],
    answer: 1,
    hint: 'Promises resolve between tasks.',
    explanation: 'Microtasks run after the current call stack completes but before the next macrotask.'
  }
];

const startBtn = document.getElementById('start-btn');
const reviewBtn = document.getElementById('review-btn');
const hintBtn = document.getElementById('hint-btn');
const skipBtn = document.getElementById('skip-btn');
const nextBtn = document.getElementById('next-btn');
const optionsEl = document.getElementById('options');
const questionTitle = document.getElementById('question-title');
const questionMeta = document.getElementById('question-meta');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const feedbackEl = document.getElementById('feedback');
const difficultyPill = document.getElementById('difficulty-pill');
const statTotal = document.getElementById('stat-total');
const statTime = document.getElementById('stat-time');
const statStreak = document.getElementById('stat-streak');
const scorePercentage = document.getElementById('score-percentage');
const correctCount = document.getElementById('correct-count');
const incorrectCount = document.getElementById('incorrect-count');
const skippedCount = document.getElementById('skipped-count');
const avgTime = document.getElementById('avg-time');
const ringProgress = document.getElementById('ring-progress');
const timeline = document.getElementById('timeline');
const reviewList = document.getElementById('review-list');

let currentIndex = 0;
let selectedOption = null;
let started = false;
let timerId = null;
let startTime = null;
let bestStreak = 0;
let currentStreak = 0;
const answers = [];

statTotal.textContent = quizData.length;

const ringCircumference = 2 * Math.PI * 52;
ringProgress.style.strokeDasharray = ringCircumference;
ringProgress.style.strokeDashoffset = ringCircumference;

function resetStats() {
  currentIndex = 0;
  selectedOption = null;
  started = true;
  currentStreak = 0;
  bestStreak = 0;
  answers.length = 0;
  timeline.innerHTML = '';
  reviewList.innerHTML = '';
  updateSummary();
  updateProgress();
}

function startTimer() {
  startTime = Date.now();
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    const elapsed = Date.now() - startTime;
    statTime.textContent = formatTime(elapsed);
  }, 1000);
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function loadQuestion() {
  const data = quizData[currentIndex];
  if (!data) {
    finishQuiz();
    return;
  }
  questionTitle.textContent = data.question;
  questionMeta.textContent = data.meta;
  difficultyPill.textContent = data.difficulty;
  feedbackEl.textContent = 'Choose an answer to see instant feedback.';
  selectedOption = null;
  optionsEl.innerHTML = '';
  data.options.forEach((option, index) => {
    const optionEl = document.createElement('div');
    optionEl.className = 'option';
    optionEl.innerHTML = `<span>${option}</span>`;
    optionEl.addEventListener('click', () => selectOption(index, optionEl));
    optionsEl.appendChild(optionEl);
  });
  hintBtn.disabled = false;
  skipBtn.disabled = false;
  nextBtn.disabled = true;
  updateProgress();
}

function selectOption(index, optionEl) {
  if (!started || selectedOption !== null) return;
  selectedOption = index;
  const data = quizData[currentIndex];
  const options = [...optionsEl.children];
  options.forEach((el) => el.classList.remove('selected'));
  optionEl.classList.add('selected');

  const isCorrect = index === data.answer;
  if (isCorrect) {
    optionEl.classList.add('correct');
    feedbackEl.textContent = `Correct. ${data.explanation}`;
    currentStreak += 1;
    bestStreak = Math.max(bestStreak, currentStreak);
  } else {
    optionEl.classList.add('incorrect');
    options[data.answer].classList.add('correct');
    feedbackEl.textContent = `Not quite. ${data.explanation}`;
    currentStreak = 0;
  }

  const responseTime = Date.now() - startTime;
  answers.push({
    id: data.id,
    choice: index,
    correct: isCorrect,
    skipped: false,
    time: responseTime,
    question: data.question,
    answer: data.options[data.answer],
    explanation: data.explanation
  });

  startTime = Date.now();
  nextBtn.disabled = false;
  hintBtn.disabled = true;
  skipBtn.disabled = true;
  statStreak.textContent = bestStreak;
  updateSummary();
}

function skipQuestion() {
  if (!started) return;
  const data = quizData[currentIndex];
  answers.push({
    id: data.id,
    choice: null,
    correct: false,
    skipped: true,
    time: Date.now() - startTime,
    question: data.question,
    answer: data.options[data.answer],
    explanation: data.explanation
  });
  feedbackEl.textContent = `Skipped. ${data.explanation}`;
  currentStreak = 0;
  startTime = Date.now();
  nextBtn.disabled = false;
  hintBtn.disabled = true;
  skipBtn.disabled = true;
  updateSummary();
}

function showHint() {
  const data = quizData[currentIndex];
  feedbackEl.textContent = `Hint: ${data.hint}`;
}

function nextQuestion() {
  if (!started) return;
  currentIndex += 1;
  loadQuestion();
}

function updateProgress() {
  const total = quizData.length;
  const current = Math.min(currentIndex + 1, total);
  const percentage = ((currentIndex) / total) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `${currentIndex} / ${total}`;
}

function updateSummary() {
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const skipped = answers.filter((a) => a.skipped).length;
  const incorrect = total - correct - skipped;
  const avg = total ? Math.round(answers.reduce((acc, a) => acc + a.time, 0) / total / 1000) : 0;
  const percentage = total ? Math.round((correct / total) * 100) : 0;

  correctCount.textContent = correct;
  incorrectCount.textContent = incorrect;
  skippedCount.textContent = skipped;
  avgTime.textContent = `${avg}s`;
  scorePercentage.textContent = `${percentage}%`;

  const offset = ringCircumference - (percentage / 100) * ringCircumference;
  ringProgress.style.strokeDashoffset = offset;

  timeline.innerHTML = '';
  answers.forEach((answer, idx) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    const dot = document.createElement('span');
    dot.style.background = answer.skipped
      ? '#ffb347'
      : answer.correct
      ? '#4fd39f'
      : '#ff6b6b';
    item.appendChild(dot);
    item.appendChild(document.createTextNode(`Q${idx + 1}: ${answer.skipped ? 'Skipped' : answer.correct ? 'Correct' : 'Incorrect'}`));
    timeline.appendChild(item);
  });
}

function finishQuiz() {
  stopTimer();
  feedbackEl.textContent = 'Session complete. Review your answers below.';
  optionsEl.innerHTML = '';
  hintBtn.disabled = true;
  skipBtn.disabled = true;
  nextBtn.disabled = true;
  progressBar.style.width = '100%';
  progressText.textContent = `${quizData.length} / ${quizData.length}`;
  reviewBtn.disabled = false;
  renderReview();
}

function renderReview() {
  reviewList.innerHTML = '';
  answers.forEach((answer, index) => {
    const card = document.createElement('div');
    card.className = 'review-card';
    const status = answer.skipped ? 'Skipped' : answer.correct ? 'Correct' : 'Incorrect';
    card.innerHTML = `
      <h3>Q${index + 1}. ${answer.question}</h3>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Correct Answer:</strong> ${answer.answer}</p>
      <p><strong>Explanation:</strong> ${answer.explanation}</p>
    `;
    reviewList.appendChild(card);
  });
}

startBtn.addEventListener('click', () => {
  resetStats();
  startTimer();
  statTime.textContent = '00:00';
  reviewBtn.disabled = true;
  loadQuestion();
});

reviewBtn.addEventListener('click', () => {
  document.getElementById('review-panel').scrollIntoView({ behavior: 'smooth' });
});

hintBtn.addEventListener('click', showHint);
skipBtn.addEventListener('click', skipQuestion);
nextBtn.addEventListener('click', nextQuestion);

window.addEventListener('beforeunload', () => {
  stopTimer();
});
