/**
 * TDT challenge catalog — list of all TDT challenges.
 */
import { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Button,
  Typography,
  CardWithSkeleton,
  Container,
  Stack,
  Badge,
  Icon,
  Alert,
  SearchBar,
  AccordionWithSkeleton,
} from '@mas/react-ui';
import type { AccordionItem } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from '@mas/react-router';
import {
  FIND_ALL_TDT_CHALLENGES,
  CREATE_TDT_SESSION,
  FIND_ALL_TDT_PROGRESS,
} from '../../graphql/documents';
import { useAppToast } from '../contexts/ToastContext';
import { difficultyVariant, TDT_CATEGORY_META, TDT_CATEGORIES } from '../utils';
import type { TdtDifficulty, TdtCategory } from '../utils';
import type {
  TdtChallenge,
  FindAllTdtChallengesQuery,
  FindAllTdtProgressQuery,
  CreateTdtSessionMutation,
} from '@mas/react-fundamentals-sot';
import { TdtCategoryFilters } from '../components/tdt/TdtCategoryFilters';
import styles from './TdtListPage.module.scss';

export function TdtListPage() {
  const navigate = useNavigate();
  const addToast = useAppToast();
  const { t } = useT();
  const [activeCategories, setActiveCategories] = useState<Set<TdtCategory>>(new Set());
  const [search, setSearch] = useState('');

  const { data, loading, error } = useQuery<FindAllTdtChallengesQuery>(FIND_ALL_TDT_CHALLENGES);

  const { data: progressData } = useQuery<FindAllTdtProgressQuery>(FIND_ALL_TDT_PROGRESS, {
    fetchPolicy: 'cache-and-network',
  });

  const progressMap = useMemo(() => {
    const map = new Map<string, FindAllTdtProgressQuery['findAllTdtProgress'][number]>();
    for (const p of progressData?.findAllTdtProgress ?? []) {
      map.set(p.challengeId, p);
    }
    return map;
  }, [progressData]);

  const [createSession] = useMutation<CreateTdtSessionMutation>(CREATE_TDT_SESSION);

  const onSelect = async (challenge: TdtChallenge) => {
    try {
      const { data: sd } = await createSession({
        variables: { input: { challengeId: challenge.id } },
      });
      const sessionId = sd?.createTdtSession?.id;
      if (!sessionId) return;
      navigate(`/tdt/${sessionId}/${challenge.id}`);
    } catch {
      addToast({ variant: 'error', message: t('tdt.loadError') });
    }
  };

  const challenges = data?.findAllTdtChallenge ?? [];

  const sections = useMemo(() => {
    if (loading) return [];
    return TDT_CATEGORIES.filter((cat) => activeCategories.size === 0 || activeCategories.has(cat))
      .map((cat) => {
        const items = challenges
          .filter((c) => c.category === cat)
          .filter(
            (c) => !search.trim() || c.title.toLowerCase().includes(search.toLowerCase()),
          ) as TdtChallenge[];
        const solvedCount = items.filter((c) => progressMap.get(c.id)?.isSolved).length;
        return { cat, items, solvedCount };
      })
      .filter((g) => g.items.length > 0);
  }, [loading, challenges, activeCategories, search, progressMap]);

  const handleToggleCategory = (cat: TdtCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const accordionItems: AccordionItem[] = sections.map(({ cat, items, solvedCount }) => {
    const meta = TDT_CATEGORY_META[cat];
    return {
      key: cat,
      title: (
        <span className={styles.groupHeader}>
          <Icon type="vector" icon={meta.icon} size={16} style={{ color: meta.color }} />
          <span className={styles.groupLabel}>{meta.label}</span>
          <span className={styles.groupStats}>
            {t('tdt.challengeCount', { count: items.length })}
            {' · '}
            {t('tdt.solvedInGroup', { solved: solvedCount, total: items.length })}
          </span>
        </span>
      ),
      content: (
        <div className={styles.grid}>
          {items.map((challenge) => {
            const progress = progressMap.get(challenge.id);
            const isSolved = progress?.isSolved ?? false;
            return (
              <CardWithSkeleton key={challenge.id} loading={false} className={styles.challengeCard}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <Badge
                      label={challenge.difficulty}
                      variant={
                        difficultyVariant[challenge.difficulty as TdtDifficulty] ?? 'primary'
                      }
                    />
                    {isSolved && <Badge label={t('tdt.solved')} variant="success" />}
                  </div>
                  <Typography variant="subtitle" className={styles.cardTitle}>
                    {challenge.title}
                  </Typography>
                  <Typography variant="caption" className={styles.cardDesc}>
                    {challenge.data.description}
                  </Typography>
                  <Button
                    variant={isSolved ? 'ghost' : 'primary'}
                    size="sm"
                    label={isSolved ? t('tdt.retry') : t('tdt.start')}
                    startIcon={isSolved ? FiRefreshCw : undefined}
                    onClick={() => onSelect(challenge)}
                  />
                </div>
              </CardWithSkeleton>
            );
          })}
        </div>
      ),
    };
  });

  return (
    <div className={styles.page}>
      <Container maxWidth="lg">
        <Button
          variant="ghost"
          label={t('nav.back')}
          startIcon={FiArrowLeft}
          onClick={() => navigate('/learn')}
        />

        <Typography variant="title" className={styles.heading}>
          {t('tdt.title')}
        </Typography>
        <Typography variant="body" className={styles.subtitle}>
          {t('tdt.subtitle')}
        </Typography>

        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder={t('tdt.searchChallenges')}
          className={styles.search}
        />

        <TdtCategoryFilters
          loading={loading}
          activeCategories={activeCategories}
          onToggle={handleToggleCategory}
        />

        {error && <Alert variant="error">{t('tdt.loadError')}</Alert>}

        {!error && (
          <>
            {!loading && sections.length === 0 ? (
              <Stack direction="vertical" gap={12} align="center">
                <Typography variant="body">
                  {search.trim() ? t('tdt.noMatch', { search }) : t('tdt.noChallenges')}
                </Typography>
              </Stack>
            ) : (
              <AccordionWithSkeleton
                loading={loading}
                multiple
                items={accordionItems}
                className={styles.accordion}
              />
            )}
          </>
        )}
      </Container>
    </div>
  );
}
