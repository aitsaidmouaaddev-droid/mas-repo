import React from 'react';
import { Typography, Stack, Badge, Tag, Alert, Button, RadioGroup, CheckboxGroup, Icon } from '@mas/react-ui';
import { FiArrowRight, FiCheck, FiExternalLink } from 'react-icons/fi';
import type { FlatQuestion } from '@mas/shared/qcm';
import { getTechMeta, difficultyVariant } from '../../utils';
import styles from './QcmSessionCard.module.scss';

interface ReviewData {
  isCorrect: boolean;
  correctIndices: number[];
  choices: string[];
  explanation?: string;
  docs?: string;
  selectedIndices: number[];
}

interface QcmSessionCardProps {
  question: FlatQuestion;
  moduleCategory: string | null;
  isSkipped: boolean;
  isLast: boolean;
  phase: 'answering' | 'reviewing';
  reviewData: ReviewData | null;
  singleVal: string;
  multiValues: string[];
  canSubmit: boolean;
  onSingleChange: (v: string) => void;
  onMultiChange: (v: string[]) => void;
  onSubmit: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export function QcmSessionCard({
  question,
  moduleCategory,
  isSkipped,
  isLast,
  phase,
  reviewData,
  singleVal,
  multiValues,
  canSubmit,
  onSingleChange,
  onMultiChange,
  onSubmit,
  onNext,
  onSkip,
}: QcmSessionCardProps) {
  const isSingle = question.type === 'single';

  const options = question.choices.map((c, i) => ({
    value: String(i),
    label: c,
    disabled: phase === 'reviewing',
  }));

  return (
    <Stack direction="vertical" gap={16}>
      {/* Tags row */}
      <Stack direction="horizontal" gap={8} align="center" wrap>
        <Badge
          label={question.difficulty}
          variant={difficultyVariant[question.difficulty as keyof typeof difficultyVariant] ?? 'secondary'}
        />
        <Badge label={isSingle ? 'Single choice' : 'Multiple choice'} variant="secondary" />
        {isSkipped && <Badge label="Previously skipped" variant="warning" />}
        {moduleCategory && (() => {
          const tech = getTechMeta(moduleCategory);
          return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon type="vector" icon={tech.icon} size={12} color={tech.color} />
              <Tag
                label={tech.label}
                style={{
                  '--tech-color': tech.color,
                  background: `color-mix(in srgb, ${tech.color} 15%, transparent)`,
                  color: tech.color,
                } as React.CSSProperties}
              />
            </span>
          );
        })()}
        {question.tags.map((tag) => <Tag key={tag} label={tag} variant="info" />)}
      </Stack>

      <Typography variant="subtitle">{question.question}</Typography>

      {/* Choices */}
      <div className={styles.choices}>
        {isSingle ? (
          <RadioGroup
            name="qcm-choice"
            options={options}
            value={singleVal}
            onChange={(v) => phase === 'answering' && onSingleChange(v)}
          />
        ) : (
          <CheckboxGroup
            options={options}
            value={multiValues}
            onChange={(v) => phase === 'answering' && onMultiChange(v)}
          />
        )}
      </div>

      {/* Feedback */}
      {phase === 'reviewing' && reviewData && (
        <Alert variant={reviewData.isCorrect ? 'success' : 'error'}>
          <Stack direction="vertical" gap={6}>
            <strong>{reviewData.isCorrect ? 'Correct!' : 'Wrong'}</strong>
            {!reviewData.isCorrect && (
              <Typography variant="body">
                Correct answer: {reviewData.correctIndices.map((i) => reviewData.choices[i]).join(', ')}
              </Typography>
            )}
            {reviewData.explanation && (
              <Typography variant="body">{reviewData.explanation}</Typography>
            )}
            {reviewData.docs && (
              <a href={reviewData.docs} target="_blank" rel="noopener noreferrer" className={styles.docsLink}>
                <Icon type="vector" icon={FiExternalLink} size={12} />
                Read the docs
              </a>
            )}
          </Stack>
        </Alert>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        {phase === 'answering' ? (
          <>
            <Button
              variant="ghost"
              label={isSkipped ? 'Skip again' : 'Skip'}
              endIcon={FiArrowRight}
              onClick={onSkip}
            />
            <Button
              variant="primary"
              label="Submit"
              endIcon={FiCheck}
              disabled={!canSubmit}
              onClick={onSubmit}
            />
          </>
        ) : (
          <Button
            variant="primary"
            label={isLast ? 'Finish' : 'Next'}
            endIcon={FiArrowRight}
            onClick={onNext}
          />
        )}
      </div>
    </Stack>
  );
}
