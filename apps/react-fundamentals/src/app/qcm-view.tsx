import { useState } from 'react';
import type { QcmQuestion } from './api';

interface QcmViewProps {
  questions: QcmQuestion[];
  onBack: () => void;
}

export function QcmView({ questions, onBack }: QcmViewProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  if (questions.length === 0) {
    return (
      <div className="panel">
        <button onClick={onBack}>&larr; Back</button>
        <p>No QCM questions available.</p>
      </div>
    );
  }

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const handleSubmit = () => {
    if (selected === null) return;
    setRevealed(true);
    if (selected === q.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setRevealed(false);
    setCurrent((c) => c + 1);
  };

  const finished = revealed && isLast;

  return (
    <div className="panel">
      <button onClick={onBack}>&larr; Back</button>
      <h2>
        QCM — Question {current + 1}/{questions.length}
      </h2>
      <p className="qcm-question">{q.question}</p>
      <ul className="qcm-choices">
        {q.choices.map((choice, i) => {
          let cls = '';
          if (revealed && i === q.answer) cls = 'correct';
          else if (revealed && i === selected && i !== q.answer) cls = 'wrong';

          return (
            <li key={i}>
              <label className={cls}>
                <input
                  type="radio"
                  name="qcm"
                  disabled={revealed}
                  checked={selected === i}
                  onChange={() => setSelected(i)}
                />
                {choice}
              </label>
            </li>
          );
        })}
      </ul>

      {!revealed && (
        <button disabled={selected === null} onClick={handleSubmit}>
          Submit
        </button>
      )}

      {revealed && !finished && <button onClick={handleNext}>Next &rarr;</button>}

      {finished && (
        <div className="qcm-score">
          Score: {score}/{questions.length}
        </div>
      )}
    </div>
  );
}
