/**
 * Guard component for `/qcm/:sessionId/:moduleId`.
 *
 * Validates session is active and module exists, then redirects to the
 * first question: `/qcm/:sessionId/:moduleId/:firstQuestionId`.
 */
import { useEffect } from 'react';
import { useParams, useNavigate } from '@mas/react-router';
import { useQuery } from '@apollo/client/react';
import { Spinner } from '@mas/react-ui';
import { useAppToast } from '../../ToastContext';
import {
  FIND_ONE_QCM_SESSION,
  FIND_ONE_QCM_MODULE,
  FIND_ALL_QCM_QUESTIONS,
} from '../../../graphql/documents';

interface GqlSession  { id: string; status: string }
interface GqlModule   { id: string; label: string }
interface GqlQuestion { id: string; moduleId: string; sortOrder: number }

export function QcmModuleRoute() {
  const { sessionId, moduleId } = useParams();
  const navigate = useNavigate();
  const addToast = useAppToast();

  const { data: sessionData, loading: sessionLoading } = useQuery<{
    findOneQcmSession: GqlSession | null;
  }>(FIND_ONE_QCM_SESSION, {
    variables: { id: sessionId },
    skip: !sessionId,
    fetchPolicy: 'network-only',
  });

  const { data: moduleData, loading: moduleLoading } = useQuery<{
    findOneQcmModule: GqlModule | null;
  }>(FIND_ONE_QCM_MODULE, {
    variables: { id: moduleId },
    skip: !moduleId,
  });

  const { data: questionsData, loading: questionsLoading } = useQuery<{
    findAllQcmQuestion: GqlQuestion[];
  }>(FIND_ALL_QCM_QUESTIONS);

  const loading = sessionLoading || moduleLoading || questionsLoading;

  useEffect(() => {
    if (loading) return;

    const session = sessionData?.findOneQcmSession;
    if (!session || session.status !== 'InProgress') {
      addToast({ variant: 'error', message: 'Session inactive or doesn\'t exist' });
      navigate('/qcm', { replace: true });
      return;
    }

    const module = moduleData?.findOneQcmModule;
    if (!module) {
      addToast({ variant: 'error', message: 'Module not found' });
      navigate('/qcm', { replace: true });
      return;
    }

    const questions = (questionsData?.findAllQcmQuestion ?? [])
      .filter((q) => q.moduleId === moduleId)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    if (questions.length === 0) {
      addToast({ variant: 'warning', message: 'No questions in this module' });
      navigate('/qcm', { replace: true });
      return;
    }

    navigate(`/qcm/${sessionId}/${moduleId}/${questions[0].id}`, { replace: true });
  }, [loading, sessionData, moduleData, questionsData, sessionId, moduleId, addToast, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
      <Spinner size="lg" />
    </div>
  );
}
