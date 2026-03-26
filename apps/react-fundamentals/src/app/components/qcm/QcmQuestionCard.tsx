import { Typography, Badge, Tag, CodeEditor, RadioGroup, CheckboxGroup } from '@mas/react-ui';
import type { FlatQuestion } from '@mas/shared/qcm';
import { difficultyVariant } from '../../utils';
import styles from './QcmQuestionCard.module.scss';

interface QcmQuestionCardProps {
  question: FlatQuestion;
  isShowingFeedback: boolean;
  singleVal: string;
  multiValues: string[];
  onSingleChange: (v: string) => void;
  onMultiChange: (v: string[]) => void;
}

export function QcmQuestionCard({
  question,
  isShowingFeedback,
  singleVal,
  multiValues,
  onSingleChange,
  onMultiChange,
}: QcmQuestionCardProps) {
  const isSingle = question.type === 'single';

  const options = question.choices.map((c: string, i: number) => ({
    value: String(i),
    label: c,
    disabled: isShowingFeedback,
  }));

  return (
    <>
      <div className={styles.questionHeader}>
        <Badge
          label={question.difficulty}
          variant={difficultyVariant[question.difficulty as keyof typeof difficultyVariant]}
        />
        <Badge
          label={isSingle ? 'Single choice' : 'Multiple choice'}
          variant="secondary"
        />
        {question.tags.map((tag: string) => (
          <Tag key={tag} label={tag} variant="info" />
        ))}
      </div>

      <Typography variant="subtitle">{question.question}</Typography>

      {question.code && (
        <div className={styles.codeSnippet}>
          <CodeEditor
            code={question.code}
            language="tsx"
            mode="view"
            filename="snippet.tsx"
          />
        </div>
      )}

      <div className={styles.choices}>
        {isSingle ? (
          <RadioGroup
            name="qcm-choice"
            options={options}
            value={singleVal}
            onChange={(v) => !isShowingFeedback && onSingleChange(v)}
          />
        ) : (
          <CheckboxGroup
            options={options}
            value={multiValues}
            onChange={(v) => !isShowingFeedback && onMultiChange(v)}
          />
        )}
      </div>
    </>
  );
}
