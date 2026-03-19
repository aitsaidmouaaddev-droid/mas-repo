/**
 * Question practice page — `/qcm/:moduleId/:questionId`.
 *
 * Single-question practice view: user selects an answer, submits, and sees
 * whether they were correct along with the explanation and docs link.
 * No session scoring — purely a study / browse mode.
 */
import { useState } from 'react';
import { useParams, useNavigate } from '@mas/react-router';
import { useQuery } from '@apollo/client/react';
import {
  Typography,
  Container,
  Stack,
  Card,
  Badge,
  Tag,
  Button,
  Alert,
  Spinner,
  RadioGroup,
  CheckboxGroup,
  Icon,
} from '@mas/react-ui';
import { FiArrowLeft, FiCheck, FiExternalLink } from 'react-icons/fi';
import { FIND_ONE_QCM_QUESTION } from '../../graphql/documents';
import styles from './QcmQuestionPage.module.scss';

// ─── GQL shape ────────────────────────────────────────────────────────────────

interface GqlQuestion {
  id: string;
  moduleId: string;
  type: string;
  difficulty: string;
  data: { question: string; choices: string[]; answer: string; tags: string[]; explanation?: string | null; docs?: string | null };
}

const difficultyVariant = { easy: 'success', medium: 'warning', hard: 'error' } as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function QcmQuestionPage() {
  const { moduleId, questionId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<{ findOneQcmQuestion: GqlQuestion | null }>(
    FIND_ONE_QCM_QUESTION,
    { variables: { id: questionId }, skip: !questionId },
  );

  const [singleVal, setSingleVal] = useState('');
  const [multiValues, setMultiValues] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (loading) {
    return <div className={styles.centered}><Spinner size="lg" /></div>;
  }

  if (error || !data?.findOneQcmQuestion) {
    return (
      <Container maxWidth="sm">
        <Alert variant="error">Question not found.</Alert>
        <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={() => navigate(`/qcm/${moduleId}`)} />
      </Container>
    );
  }

  const q = data.findOneQcmQuestion;
  const isSingle = q.type === 'single';
  const answer: number | number[] = JSON.parse(q.data.answer);
  const correctIndices: number[] = Array.isArray(answer) ? answer : [answer];

  const selectedIndices = isSingle
    ? (singleVal !== '' ? [Number(singleVal)] : [])
    : multiValues.map(Number);

  const isCorrect = submitted && (
    selectedIndices.length === correctIndices.length &&
    selectedIndices.every((i) => correctIndices.includes(i))
  );

  const options = q.data.choices.map((c, i) => ({
    value: String(i),
    label: c,
    disabled: submitted,
  }));

  const canSubmit = isSingle ? singleVal !== '' : multiValues.length > 0;

  return (
    <div className={styles.page}>
      <Container maxWidth="md">
        <Button
          variant="ghost"
          label="Back to module"
          startIcon={FiArrowLeft}
          onClick={() => navigate(`/qcm/${moduleId}`)}
          className={styles.backBtn}
        />

        <Card className={styles.questionCard}>
          <Stack direction="vertical" gap={16}>
            {/* Header */}
            <Stack direction="horizontal" gap={8} align="center" wrap>
              <Badge
                label={q.difficulty}
                variant={difficultyVariant[q.difficulty as keyof typeof difficultyVariant] ?? 'secondary'}
              />
              <Badge label={isSingle ? 'Single choice' : 'Multiple choice'} variant="secondary" />
              {q.data.tags.map((tag) => <Tag key={tag} label={tag} variant="info" />)}
            </Stack>

            <Typography variant="subtitle">{q.data.question}</Typography>

            {/* Choices */}
            <div className={styles.choices}>
              {isSingle ? (
                <RadioGroup
                  name="practice-choice"
                  options={options}
                  value={singleVal}
                  onChange={(v) => !submitted && setSingleVal(v)}
                />
              ) : (
                <CheckboxGroup
                  options={options}
                  value={multiValues}
                  onChange={(v) => !submitted && setMultiValues(v)}
                />
              )}
            </div>

            {/* Feedback */}
            {submitted && (
              <Alert variant={isCorrect ? 'success' : 'error'}>
                <Stack direction="vertical" gap={6}>
                  <strong>{isCorrect ? 'Correct!' : 'Wrong'}</strong>
                  {!isCorrect && (
                    <Typography variant="body">
                      Correct answer: {correctIndices.map((i) => q.data.choices[i]).join(', ')}
                    </Typography>
                  )}
                  {q.data.explanation && (
                    <Typography variant="body">{q.data.explanation}</Typography>
                  )}
                  {q.data.docs && (
                    <a
                      href={q.data.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.docsLink}
                    >
                      <Icon type="vector" icon={FiExternalLink} size={12} />
                      Read the docs
                    </a>
                  )}
                </Stack>
              </Alert>
            )}

            {/* Action */}
            <div className={styles.actions}>
              {!submitted ? (
                <Button
                  variant="primary"
                  label="Submit"
                  endIcon={FiCheck}
                  disabled={!canSubmit}
                  onClick={() => setSubmitted(true)}
                />
              ) : (
                <Button
                  variant="outline"
                  label="Try again"
                  onClick={() => {
                    setSubmitted(false);
                    setSingleVal('');
                    setMultiValues([]);
                  }}
                />
              )}
            </div>
          </Stack>
        </Card>
      </Container>
    </div>
  );
}
