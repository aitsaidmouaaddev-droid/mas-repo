import { useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './CodeEditor.module.scss';

export type CodeEditorMode = 'view' | 'write';

export type CodeEditorLanguage =
  | 'tsx'
  | 'typescript'
  | 'javascript'
  | 'jsx'
  | 'css'
  | 'scss'
  | 'json'
  | 'bash'
  | 'text';

/**
 * Props for the {@link CodeEditor} component.
 *
 * @property code - Source code string to display or edit.
 * @property language - Syntax language for highlighting. @default 'tsx'
 * @property mode - `'view'` for read-only highlighted display, `'write'` for editable textarea. @default 'view'
 * @property onChange - Called with the new value when the user edits in `write` mode.
 * @property filename - Optional label shown in the toolbar (e.g. `'App.tsx'`).
 * @property placeholder - Placeholder text shown in `write` mode when `code` is empty.
 * @property classOverride - CSS-module class overrides.
 * @property styleOverride - Inline style overrides.
 * @property testId - Value for `data-testid`.
 * @property className - Additional CSS class for the root element.
 */
export interface CodeEditorProps {
  code: string;
  language?: CodeEditorLanguage;
  mode?: CodeEditorMode;
  onChange?: (value: string) => void;
  filename?: string;
  placeholder?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * Dual-mode code block component.
 *
 * - **`view` mode** — renders syntax-highlighted, read-only code using Prism.
 *   Supports TSX, TypeScript, JavaScript, JSX, CSS, SCSS, JSON, Bash.
 * - **`write` mode** — renders an editable `<textarea>` styled to match the
 *   code block, suitable for student exercise input.
 *
 * The toolbar always shows macOS-style window dots and an optional filename.
 *
 * @param props - {@link CodeEditorProps}
 *
 * @example — view mode (QCM code snippet)
 * ```tsx
 * <CodeEditor
 *   code={`const greet = (name: string) => \`Hello, \${name}!\`;`}
 *   language="typescript"
 *   filename="greet.ts"
 * />
 * ```
 *
 * @example — write mode (exercise editor)
 * ```tsx
 * <CodeEditor
 *   code={studentCode}
 *   language="tsx"
 *   mode="write"
 *   filename="Exercise.tsx"
 *   placeholder="// Write your solution here…"
 *   onChange={setStudentCode}
 * />
 * ```
 */
export default function CodeEditor({
  code,
  language = 'tsx',
  mode = 'view',
  onChange,
  filename,
  placeholder = '// Write your solution here…',
  classOverride,
  styleOverride,
  testId,
  className,
}: CodeEditorProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  // Tab key inserts 2 spaces instead of moving focus
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const el = e.currentTarget;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const next = el.value.slice(0, start) + '  ' + el.value.slice(end);
        onChange?.(next);
        // Restore cursor after setState flushes
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start + 2;
        });
      }
    },
    [onChange],
  );

  return (
    <div
      className={clsx(s.className.wrapper, className)}
      style={s.style.wrapper}
      data-testid={testId}
    >
      {/* Toolbar */}
      <div className={s.className.toolbar} style={s.style.toolbar}>
        <div className={s.className.dots}>
          <span className={clsx(s.className.dot, s.className.dotRed)} />
          <span className={clsx(s.className.dot, s.className.dotYellow)} />
          <span className={clsx(s.className.dot, s.className.dotGreen)} />
        </div>

        {filename && (
          <span className={s.className.filename} style={s.style.filename}>
            {filename}
          </span>
        )}

        <span className={s.className.lang} style={s.style.lang}>
          {language}
        </span>
      </div>

      {/* Body */}
      {mode === 'view' ? (
        <div className={s.className.viewBody} style={s.style.viewBody}>
          <SyntaxHighlighter
            language={language === 'text' ? 'plaintext' : language}
            style={oneDark}
            wrapLongLines={false}
            showLineNumbers
            lineNumberStyle={{ opacity: 0.35, userSelect: 'none', minWidth: '2.5em' }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      ) : (
        <div className={s.className.writeBody} style={s.style.writeBody}>
          <textarea
            className={s.className.textarea}
            style={s.style.textarea}
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      )}
    </div>
  );
}
