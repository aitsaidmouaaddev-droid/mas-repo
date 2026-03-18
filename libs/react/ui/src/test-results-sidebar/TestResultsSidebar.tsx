import { useState } from 'react';
import clsx from 'clsx';
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Icon from '../icon/Icon';
import Typography from '../typography/Typography';
import scss from './testResultsSidebar.module.scss';

/** A single test result entry. */
export interface TestSidebarTestResult {
  title: string;
  status: 'passed' | 'failed';
  failureMessages: string[];
}

/** Aggregated test run result. */
export interface TestSidebarResult {
  passed: number;
  failed: number;
  tests: TestSidebarTestResult[];
}

export interface TestResultsSidebarProps {
  result: TestSidebarResult | null;
  running?: boolean;
}

/**
 * Collapsible right-hand sidebar that shows test results.
 *
 * - Hidden when no result and not running.
 * - Collapsed (thin strip) after tests run: green if all passed, red if any failed.
 * - Expand to see per-test details.
 */
export default function TestResultsSidebar({ result, running }: TestResultsSidebarProps) {
  const [expanded, setExpanded] = useState(false);

  if (!result && !running) return null;

  const allPassed = result ? result.failed === 0 && result.passed > 0 : false;
  const statusClass = allPassed ? scss.pass : scss.fail;

  return (
    <div className={clsx(scss.sidebar, statusClass, expanded && scss.expanded)}>
      {/* Toggle strip */}
      <button
        type="button"
        className={scss.toggle}
        onClick={() => setExpanded((e) => !e)}
        aria-label={expanded ? 'Collapse test results' : 'Expand test results'}
      >
        <Icon
          type="vector"
          icon={expanded ? FiChevronRight : FiChevronLeft}
          size={14}
          color="currentColor"
        />
        {!expanded && result && (
          <span className={scss.collapsedBadge}>
            {result.passed}/{result.passed + result.failed}
          </span>
        )}
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className={scss.panel}>
          {running && (
            <Typography variant="caption" className={scss.runningMsg}>
              Running…
            </Typography>
          )}

          {result && !running && (
            <>
              <div className={scss.summary}>
                <Icon
                  type="vector"
                  icon={allPassed ? FiCheckCircle : FiAlertCircle}
                  size={16}
                  color="currentColor"
                />
                <Typography variant="caption">
                  <strong>{result.passed}</strong> passed &nbsp;·&nbsp;
                  <strong>{result.failed}</strong> failed
                </Typography>
              </div>

              <div className={scss.testList}>
                {result.tests.map((t, i) => (
                  <div
                    key={i}
                    className={clsx(scss.testRow, t.status === 'failed' && scss.testFail)}
                  >
                    <Icon
                      type="vector"
                      icon={t.status === 'passed' ? FiCheckCircle : FiAlertCircle}
                      size={12}
                      color="currentColor"
                      className={scss.testIcon}
                    />
                    <div className={scss.testBody}>
                      <Typography variant="caption" className={scss.testTitle}>
                        {t.title}
                      </Typography>
                      {t.failureMessages.length > 0 && (
                        <pre className={scss.failureMsg}>
                          {t.failureMessages[0].split('\n').slice(0, 6).join('\n')}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
