/**
 * Guard component for `/qcm/:sessionId`.
 *
 * Always redirects:
 * - Session not found or not in_progress → /qcm + toast error
 * - Session in_progress → /qcm + toast asking to choose a module
 */
import { useEffect } from 'react';
import { useParams, useNavigate } from '@mas/react-router';
import { useQuery } from '@apollo/client/react';
import { Spinner } from '@mas/react-ui';
import { QcmSessionStatus } from '@mas/react-fundamentals-sot';
import type { FindOneQcmSessionQuery, FindOneQcmSessionQueryVariables } from '@mas/react-fundamentals-sot';
import { useAppToast } from '../ToastContext';
import { FIND_ONE_QCM_SESSION } from '../../graphql/documents';

export function QcmSessionRoute() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const addToast = useAppToast();

  const { data, loading } = useQuery<FindOneQcmSessionQuery, FindOneQcmSessionQueryVariables>(
    FIND_ONE_QCM_SESSION,
    { variables: { id: sessionId! }, skip: !sessionId, fetchPolicy: 'network-only' },
  );

  useEffect(() => {
    if (loading) return;
    const session = data?.findOneQcmSession;
    if (!session || session.status !== QcmSessionStatus.InProgress) {
      addToast({ variant: 'error', message: 'Session inactive or doesn\'t exist' });
    } else {
      addToast({ variant: 'warning', message: 'Choose a module to continue your session' });
    }
    navigate('/qcm', { replace: true });
  }, [loading, data, addToast, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
      <Spinner size="lg" />
    </div>
  );
}
