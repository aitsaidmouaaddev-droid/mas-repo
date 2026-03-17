import { useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark as prismOneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  drawSelection,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands';
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
 * @property mode - `'view'` for read-only highlighted display, `'write'` for editable CodeMirror editor. @default 'view'
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

/** CodeMirror write-mode editor (syntax-highlighted, editable). */
function CodeMirrorEditor({
  code,
  language,
  onChange,
  className,
}: {
  code: string;
  language: CodeEditorLanguage;
  onChange?: (value: string) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Determine if this is a JS/TS language
  const isJsLike = ['tsx', 'typescript', 'javascript', 'jsx'].includes(language);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChangeRef.current?.(update.state.doc.toString());
      }
    });

    const extensions = [
      history(),
      lineNumbers(),
      drawSelection(),
      highlightActiveLine(),
      oneDark,
      keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
      updateListener,
      EditorView.theme({
        '&': { height: '100%', fontSize: '13.5px' },
        '.cm-scroller': { overflow: 'auto', fontFamily: 'inherit', lineHeight: '1.65' },
        '.cm-content': { caretColor: 'var(--color-primary, #3b82f6)', padding: '16px 0' },
        '.cm-gutters': { paddingLeft: '8px', paddingRight: '4px' },
        '.cm-activeLine': { backgroundColor: 'rgba(255,255,255,0.04)' },
        '.cm-activeLineGutter': { backgroundColor: 'transparent' },
      }),
    ];

    if (isJsLike) {
      const isTsx = language === 'tsx' || language === 'jsx';
      const isTs = language === 'typescript' || language === 'tsx';
      extensions.push(javascript({ typescript: isTs, jsx: isTsx }));
    }

    const state = EditorState.create({ doc: code, extensions });
    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Sync external code changes (e.g. Reset button) without destroying the editor
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== code) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: code },
      });
    }
  }, [code]);

  return <div ref={containerRef} className={className} />;
}

/**
 * Dual-mode code block component.
 *
 * - **`view` mode** — renders syntax-highlighted, read-only code using Prism.
 * - **`write` mode** — renders a full CodeMirror 6 editor with syntax highlighting.
 *
 * @param props - {@link CodeEditorProps}
 */
export default function CodeEditor({
  code,
  language = 'tsx',
  mode = 'view',
  onChange,
  filename,
  classOverride,
  styleOverride,
  testId,
  className,
}: CodeEditorProps) {
  const s = useStyles(scss, classOverride, styleOverride);

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
            style={prismOneDark}
            wrapLongLines={false}
            showLineNumbers
            lineNumberStyle={{ opacity: 0.35, userSelect: 'none', minWidth: '2.5em' }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      ) : (
        <CodeMirrorEditor
          code={code}
          language={language}
          onChange={onChange}
          className={s.className.writeBody}
        />
      )}
    </div>
  );
}
