/**
 * Route wrapper for `/tdt/:id`.
 *
 * Resolves the challenge ID from the URL, fetches all challenges, finds the
 * matching one, and passes it to {@link TdtChallengeView}.
 *
 * Redirects to `/tdt` if the ID is not found.
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@mas/react-router';
import { Spinner } from '@mas/react-ui';
import { tdtRepository } from '../../api';
import type { TdtChallenge } from '../../api';
import { TdtChallengeView } from './tdt-challenge-view';

export function TdtChallengeRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<TdtChallenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tdtRepository
      .getAll()
      .then((cs) => {
        const found = cs.find((c) => c.id === id);
        if (found) setChallenge(found);
        else navigate('/tdt', { replace: true });
      })
      .catch(() => navigate('/tdt', { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{ paddingTop: 40, textAlign: 'center' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!challenge) return null;

  return <TdtChallengeView challenge={challenge} onBack={() => navigate('/tdt')} />;
}
