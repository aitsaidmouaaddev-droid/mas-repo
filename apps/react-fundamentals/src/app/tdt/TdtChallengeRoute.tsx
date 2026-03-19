/**
 * Route wrapper for `/tdt/:id`.
 *
 * Resolves the challenge ID from the URL via GraphQL and passes it to
 * {@link TdtChallengeView}. Redirects to `/tdt` if the ID is not found.
 */
import { useEffect } from 'react';
import { useParams, useNavigate } from '@mas/react-router';
import { Spinner } from '@mas/react-ui';
import { useQuery } from '@apollo/client/react';
import { FIND_ONE_TDT_CHALLENGE } from '../../graphql/documents';
import type { GqlTdtChallenge } from './tdt-catalog-view';
import { TdtChallengeView } from './tdt-challenge-view';

export function TdtChallengeRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<{ findOneTdtChallenge: GqlTdtChallenge | null }>(
    FIND_ONE_TDT_CHALLENGE,
    { variables: { id }, skip: !id },
  );

  useEffect(() => {
    if (!loading && (error || data?.findOneTdtChallenge === null)) {
      navigate('/tdt', { replace: true });
    }
  }, [loading, error, data, navigate]);

  if (loading) {
    return (
      <div style={{ paddingTop: 40, textAlign: 'center' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data?.findOneTdtChallenge) return null;

  return (
    <TdtChallengeView
      challenge={data.findOneTdtChallenge}
      onBack={() => navigate('/tdt')}
    />
  );
}
