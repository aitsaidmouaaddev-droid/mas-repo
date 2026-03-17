/**
 * Passthrough layout for the `/qcm` section.
 *
 * - At `/qcm` (no child matched): renders {@link QcmModuleSelect}.
 * - At `/qcm/quiz` or `/qcm/summary`: renders `<Outlet />`.
 */
import { Outlet, useMatch } from '@mas/react-router';
import { QcmModuleSelect } from './qcm-module-select';

export function QcmLayout() {
  const quizMatch = useMatch('/qcm/quiz');
  const summaryMatch = useMatch('/qcm/summary');
  if (!quizMatch && !summaryMatch) return <QcmModuleSelect />;
  return <Outlet />;
}
