/**
 * Route wrapper for `/tdt/:id`.
 *
 * Resolves the challenge ID from the URL via GraphQL and passes it to
 * {@link TdtChallengePage}. Redirects to `/tdt` if the ID is not found.
 */
import { useEffect } from 'react';
import { useParams, useNavigate } from '@mas/react-router';
import { Spinner } from '@mas/react-ui';
import { useQuery } from '@apollo/client/react';
import { FIND_ONE_TDT_CHALLENGE } from '../../graphql/documents';
import type { GqlTdtChallenge } from '../pages/TdtListPage';
import { TdtChallengePage } from '../pages/TdtChallengePage';
import { useDynamicBreadcrumb } from '../DynamicBreadcrumbContext';

export function TdtChallengeRoute() {
  const { challengeId: id } = useParams();
  const navigate = useNavigate();
  const setBreadcrumbs = useDynamicBreadcrumb();

  const { data, loading, error } = useQuery<{ findOneTdtChallenge: GqlTdtChallenge | null }>(
    FIND_ONE_TDT_CHALLENGE,
    { variables: { id }, skip: !id },
  );

  useEffect(() => {
    if (!loading && (error || data?.findOneTdtChallenge === null)) {
      navigate('/tdt', { replace: true });
    }
  }, [loading, error, data, navigate]);

  useEffect(() => {
    if (!data?.findOneTdtChallenge) return;
    setBreadcrumbs([
      { label: 'TDT', path: '/tdt' },
      { label: data.findOneTdtChallenge.title },
    ]);
    return () => setBreadcrumbs(null);
  }, [data, setBreadcrumbs]);

  if (loading) {
    return (
      <div style={{ paddingTop: 40, textAlign: 'center' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data?.findOneTdtChallenge) return null;

  return (
    <TdtChallengePage
      challenge={data.findOneTdtChallenge}
      onBack={() => navigate('/tdt')}
    />
  );
}
