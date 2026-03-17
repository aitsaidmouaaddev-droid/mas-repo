# @mas/qcm

A **framework-agnostic** QCM (Questionnaire à Choix Multiples) engine library.  
Pure TypeScript — works in Node, browsers, React, React Native, Angular, Vue, or any JS runtime.

---

## Features

| Feature                   | Details                                                                    |
| ------------------------- | -------------------------------------------------------------------------- |
| **Single & multi-choice** | Full support for both question types with partial scoring for multi-choice |
| **Weighted scoring**      | Easy = 1 pt, Medium = 2 pts, Hard = 3 pts                                  |
| **Modules**               | Group questions into thematic modules (e.g. "JSX Basics", "Hooks")         |
| **Filtering**             | Filter by module, difficulty, or tags                                      |
| **Shuffle**               | Randomise question order _and_ choice order (answer indices are remapped)  |
| **Timed mode**            | Optional per-question countdown                                            |
| **Streak tracking**       | Longest consecutive correct-answer run                                     |
| **Retry**                 | Auto-generate a retry session from wrong/skipped questions                 |
| **Validation**            | Runtime validators for raw JSON payloads with friendly error messages      |
| **Zero dependencies**     | Pure TypeScript, no runtime deps                                           |

---

## Architecture

```
src/
├── lib/
│   ├── types.ts        # All interfaces, types, and DEFAULT_CONFIG
│   ├── engine.ts       # Pure functions: scoring, shuffling, filtering
│   ├── validators.ts   # Runtime data validation
│   └── session.ts      # Stateful QcmSession class + createSession factory
├── index.ts            # Barrel exports
└── lib/
    └── qcm.test.ts     # 64 tests covering the full API
```

### Layers

1. **Types** (`types.ts`) — Every interface and type alias. The single source of truth.
2. **Engine** (`engine.ts`) — Stateless, pure functions. No side effects. Easy to test.
3. **Validators** (`validators.ts`) — Accepts `unknown` input, returns human-readable error arrays.
4. **Session** (`session.ts`) — Wraps the engine into a stateful session with navigation, auto-finish, timer, and retry.

---

## Data format

Quiz data is a JSON object with this structure:

```jsonc
{
  "modules": [
    {
      "id": "jsx-basics",
      "label": "JSX Basics",
      "questions": [
        {
          "id": "q1",
          "type": "single", // "single" | "multi"
          "difficulty": "easy", // "easy" | "medium" | "hard"
          "tags": ["jsx"],
          "question": "What does JSX stand for?",
          "code": null, // optional code snippet
          "choices": ["JavaScript XML", "JavaScript Extension", "Java Syntax Extension"],
          "answer": 0, // index (single) or [indices] (multi)
          "explanation": "JSX stands for JavaScript XML.", // optional
        },
      ],
    },
  ],
}
```

---

## Usage

### 1. Validate quiz data

```ts
import { validateQcmData } from '@mas/qcm';

const raw = JSON.parse(jsonString);
const errors = validateQcmData(raw);

if (errors.length > 0) {
  console.error('Invalid quiz data:', errors);
} else {
  console.log('Quiz data is valid!');
}
```

### 2. Create a session and answer questions

```ts
import { createSession } from '@mas/qcm';
import type { QcmData } from '@mas/qcm';

const quizData: QcmData = {
  modules: [
    {
      id: 'hooks',
      label: 'React Hooks',
      questions: [
        {
          id: 'q1',
          type: 'single',
          difficulty: 'easy',
          tags: ['hooks'],
          question: 'Which hook manages local state?',
          choices: ['useEffect', 'useState', 'useContext', 'useRef'],
          answer: 1,
          explanation: 'useState returns a state variable and its setter.',
        },
        {
          id: 'q2',
          type: 'multi',
          difficulty: 'medium',
          tags: ['hooks', 'lifecycle'],
          question: 'Which hooks run after render?',
          choices: ['useState', 'useEffect', 'useLayoutEffect', 'useMemo'],
          answer: [1, 2],
        },
        {
          id: 'q3',
          type: 'single',
          difficulty: 'hard',
          tags: ['hooks', 'advanced'],
          question: 'What does useImperativeHandle do?',
          choices: [
            'Exposes instance methods to parent via ref',
            'Creates a mutable ref',
            'Subscribes to context changes',
          ],
          answer: 0,
        },
      ],
    },
  ],
};

// Create a session — all questions, shuffled, 80% pass threshold
const session = createSession(quizData, {
  shuffle: true,
  passThreshold: 80,
});

// Check progress
console.log(session.getProgress());
// { current: 0, total: 3, answered: 0, skipped: 0 }

// Get the current question (answer is hidden)
const current = session.current();
console.log(current?.question.question);
// "Which hook manages local state?"

// Submit an answer
const feedback = session.answer(1); // pick "useState"
console.log(feedback);
// { correct: true, correctAnswer: 1, score: 1, explanation: "useState returns..." }

// The session auto-advances to the next question
console.log(session.current()?.question.question);
// "Which hooks run after render?"

// Answer a multi-choice question
const fb2 = session.answer([1, 2]); // pick useEffect + useLayoutEffect
console.log(fb2.correct); // true
console.log(fb2.score); // 2 (medium weight)

// Skip a question
session.skip();
// Session auto-finishes on the last question

// Get the final result
const result = session.getResult();
console.log(`Score: ${result.score}/${result.maxScore}`);
console.log(`Percentage: ${result.percentage}%`);
console.log(`Passed: ${result.passed}`);
console.log(`Streak: ${result.streak}`);
console.log(`Duration: ${result.duration}ms`);

// Per-module breakdown
for (const [moduleId, mod] of Object.entries(result.byModule)) {
  console.log(`  ${moduleId}: ${mod.score}/${mod.maxScore} (${mod.percentage}%)`);
}
```

### 3. Retry failed questions

```ts
// After finishing, create a retry session with only wrong/skipped questions
const retrySession = session.retry();

if (retrySession.getProgress().total > 0) {
  console.log(`Retrying ${retrySession.getProgress().total} questions...`);
  // Use retrySession the same way
} else {
  console.log('Perfect score — nothing to retry!');
}
```

### 4. Filter questions

```ts
// Only hard questions
const hardSession = createSession(quizData, { difficulty: 'hard' });

// Only questions tagged "hooks"
const hooksSession = createSession(quizData, { tags: ['hooks'] });

// Only one module
const modSession = createSession(quizData, { mode: 'module', module: 'hooks' });
```

### 5. Use engine functions directly

```ts
import { flattenModules, listModules, checkAnswer, weightedScore, filterByTags } from '@mas/qcm';

// List modules
const modules = listModules(quizData);
// [{ id: 'hooks', label: 'React Hooks', questionCount: 3 }]

// Flatten into a single array
const allQuestions = flattenModules(quizData);
// Each question now has a `moduleId` field

// Filter by tags
const hookQs = filterByTags(allQuestions, ['lifecycle']);

// Check an answer manually
const result = checkAnswer(allQuestions[0], 1);
console.log(result); // { correct: true, score: 1 }
```

### 6. Timed mode

```ts
const timedSession = createSession(quizData, {
  timed: true,
  timePerQuestion: 30, // 30 seconds per question
});

// Check remaining time
const cur = timedSession.current();
console.log(`Time left: ${cur?.timeRemaining}s`);

// Auto-skip if expired
if (timedSession.isExpired()) {
  timedSession.expireIfNeeded(); // skips and advances
}
```

---

## Redux Integration

The library ships a ready-to-use **Redux Toolkit slice** so you can drop QCM state into any Redux store.

### Setup

```ts
import { configureStore } from '@reduxjs/toolkit';
import { qcmReducer } from '@mas/qcm';

const store = configureStore({
  reducer: { qcm: qcmReducer },
});
```

Or with the workspace's `createAppStore` helper:

```ts
import { createAppStore } from '@mas/store';
import { qcmReducer } from '@mas/qcm';

const store = createAppStore({ qcm: qcmReducer });
```

### Actions

| Action             | Payload                                              | Description                                |
| ------------------ | ---------------------------------------------------- | ------------------------------------------ |
| `startSession`     | `{ data: QcmData, config?: Partial<SessionConfig> }` | Load quiz data, apply filters, start       |
| `answerQuestion`   | `number \| number[]`                                 | Submit answer for current question         |
| `skipQuestion`     | —                                                    | Skip current (score = 0)                   |
| `nextQuestion`     | —                                                    | Manual navigation forward                  |
| `previousQuestion` | —                                                    | Manual navigation backward                 |
| `finishSession`    | —                                                    | Manually end the session                   |
| `retrySession`     | —                                                    | Restart with only failed/skipped questions |
| `resetSession`     | —                                                    | Return to idle state                       |

### Selectors

| Selector                | Returns                               | Description                                           |
| ----------------------- | ------------------------------------- | ----------------------------------------------------- |
| `selectQcmStatus`       | `QcmStatus`                           | `'idle' \| 'in-progress' \| 'finished'`               |
| `selectCurrentQuestion` | `{ question, moduleId } \| null`      | Current question (**answer hidden**)                  |
| `selectProgress`        | `SessionProgress`                     | `{ current, total, answered, skipped, remaining }`    |
| `selectResult`          | `QcmResult`                           | Full result with score, percentage, streaks, byModule |
| `selectLastFeedback`    | `AnswerFeedback \| null`              | Feedback from the last answer                         |
| `selectModules`         | `Array<{ id, label, questionCount }>` | Available modules                                     |

### Example — React component

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { startSession, answerQuestion, selectCurrentQuestion, selectProgress } from '@mas/qcm';

function QuizScreen({ data }) {
  const dispatch = useDispatch();
  const question = useSelector(selectCurrentQuestion);
  const progress = useSelector(selectProgress);

  if (!question) {
    return <button onClick={() => dispatch(startSession({ data }))}>Start</button>;
  }

  return (
    <div>
      <p>
        {progress.current + 1} / {progress.total}
      </p>
      <h2>{question.question.question}</h2>
      {question.question.choices.map((c, i) => (
        <button key={i} onClick={() => dispatch(answerQuestion(i))}>
          {c}
        </button>
      ))}
    </div>
  );
}
```

### Use case — Full quiz lifecycle

A complete walkthrough of a quiz app from store setup to results and retry,
using the Redux slice in a React (or React Native) project.

**1. Configure the store**

```ts
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { qcmReducer } from '@mas/qcm';

export const store = configureStore({
  reducer: { qcm: qcmReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**2. Load quiz data and start**

```tsx
// QuizLauncher.tsx
import { useDispatch, useSelector } from 'react-redux';
import { startSession, selectQcmStatus, selectModules } from '@mas/qcm';
import type { QcmData } from '@mas/qcm';

// Data could come from a JSON file, an API, or a local import
import quizData from './data/react-hooks.json';

function QuizLauncher() {
  const dispatch = useDispatch();
  const status = useSelector(selectQcmStatus);
  const modules = useSelector(selectModules);

  if (status !== 'idle') return null;

  return (
    <div>
      <h1>Pick a quiz</h1>

      {/* Start with all modules, default config */}
      <button onClick={() => dispatch(startSession({ data: quizData }))}>All questions</button>

      {/* Start filtered by difficulty */}
      <button
        onClick={() =>
          dispatch(
            startSession({
              data: quizData,
              config: { difficulty: 'hard', shuffle: true },
            }),
          )
        }
      >
        Hard mode 🔥
      </button>

      {/* Start a single module */}
      {modules.map((m) => (
        <button
          key={m.id}
          onClick={() =>
            dispatch(
              startSession({
                data: quizData,
                config: { mode: 'module', module: m.id },
              }),
            )
          }
        >
          {m.label} ({m.questionCount} questions)
        </button>
      ))}
    </div>
  );
}
```

**3. Display the current question**

```tsx
// QuestionCard.tsx
import { useDispatch, useSelector } from 'react-redux';
import {
  answerQuestion,
  skipQuestion,
  selectCurrentQuestion,
  selectProgress,
  selectLastFeedback,
} from '@mas/qcm';

function QuestionCard() {
  const dispatch = useDispatch();
  const current = useSelector(selectCurrentQuestion);
  const progress = useSelector(selectProgress);
  const feedback = useSelector(selectLastFeedback);

  if (!current) return null;
  const { question } = current;

  return (
    <div>
      <header>
        Question {progress.current + 1} / {progress.total}
        <span>
          ({progress.answered} answered, {progress.skipped} skipped)
        </span>
      </header>

      <h2>{question.question}</h2>
      {question.code && (
        <pre>
          <code>{question.code}</code>
        </pre>
      )}

      <ul>
        {question.choices.map((choice, i) => (
          <li key={i}>
            <button onClick={() => dispatch(answerQuestion(i))}>{choice}</button>
          </li>
        ))}
      </ul>

      <button onClick={() => dispatch(skipQuestion())}>Skip →</button>

      {feedback && (
        <div className={feedback.correct ? 'correct' : 'wrong'}>
          {feedback.correct ? '✅ Correct!' : '❌ Wrong!'}
          {feedback.explanation && <p>{feedback.explanation}</p>}
          <p>Score: {feedback.score} pts</p>
        </div>
      )}
    </div>
  );
}
```

**4. Show results and retry**

```tsx
// ResultScreen.tsx
import { useDispatch, useSelector } from 'react-redux';
import { selectQcmStatus, selectResult, retrySession, resetSession } from '@mas/qcm';

function ResultScreen() {
  const dispatch = useDispatch();
  const status = useSelector(selectQcmStatus);
  const result = useSelector(selectResult);

  if (status !== 'finished') return null;

  return (
    <div>
      <h1>{result.passed ? '🎉 Passed!' : '😬 Not quite...'}</h1>

      <table>
        <tbody>
          <tr>
            <td>Score</td>
            <td>
              {result.score} / {result.maxScore}
            </td>
          </tr>
          <tr>
            <td>Percentage</td>
            <td>{result.percentage}%</td>
          </tr>
          <tr>
            <td>Streak</td>
            <td>{result.streak} in a row</td>
          </tr>
          <tr>
            <td>Duration</td>
            <td>{Math.round(result.duration / 1000)}s</td>
          </tr>
        </tbody>
      </table>

      <h2>Per-module breakdown</h2>
      {Object.entries(result.byModule).map(([id, mod]) => (
        <div key={id}>
          <strong>{id}</strong>: {mod.score}/{mod.maxScore} ({mod.percentage}%)
        </div>
      ))}

      {/* Retry only failed/skipped questions */}
      <button onClick={() => dispatch(retrySession())}>
        Retry failed ({result.total - result.answers.filter((a) => a.correct).length} questions)
      </button>

      {/* Back to launcher */}
      <button onClick={() => dispatch(resetSession())}>New quiz</button>
    </div>
  );
}
```

**5. Wire it all together**

```tsx
// App.tsx
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { store } from './store';
import { selectQcmStatus } from '@mas/qcm';

function QuizRouter() {
  const status = useSelector(selectQcmStatus);

  switch (status) {
    case 'idle':
      return <QuizLauncher />;
    case 'in-progress':
      return <QuestionCard />;
    case 'finished':
      return <ResultScreen />;
  }
}

export default function App() {
  return (
    <Provider store={store}>
      <QuizRouter />
    </Provider>
  );
}
```

---

## Scoring

| Difficulty | Weight |
| ---------- | ------ |
| Easy       | 1      |
| Medium     | 2      |
| Hard       | 3      |

**Single-choice**: full weight if correct, 0 otherwise.

**Multi-choice** (partial scoring):

- +1 per correct pick
- −0.5 per wrong pick
- Clamped to `[0, correctCount]`, normalized to `[0, 1]`, then multiplied by the difficulty weight.

**Pass threshold**: configurable (default 80%). `result.passed = percentage >= passThreshold`.

---

## Running tests

```bash
nx test qcm
```

64+ tests covering engine, validators, session logic, and Redux slice.

---

## License

Part of the **mas-repo** monorepo.
