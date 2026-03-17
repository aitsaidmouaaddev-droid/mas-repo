import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CodeEditor from './CodeEditor';

const meta: Meta<typeof CodeEditor> = {
  title: 'Components/CodeEditor',
  component: CodeEditor,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof CodeEditor>;

const tsxSnippet = `import { useState } from 'react';

interface CounterProps {
  initial?: number;
}

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>−</button>
    </div>
  );
}`;

const jsonSnippet = `{
  "name": "@mas/react-ui",
  "version": "0.0.1",
  "type": "module"
}`;

const bashSnippet = `# Install dependencies
npm install --legacy-peer-deps

# Run Storybook
npx nx storybook react-ui`;

export const ViewTSX: Story = {
  args: {
    code: tsxSnippet,
    language: 'tsx',
    mode: 'view',
    filename: 'Counter.tsx',
  },
};

export const ViewJSON: Story = {
  args: {
    code: jsonSnippet,
    language: 'json',
    mode: 'view',
    filename: 'package.json',
  },
};

export const ViewBash: Story = {
  args: {
    code: bashSnippet,
    language: 'bash',
    mode: 'view',
  },
};

function WriteModeDemo() {
  const [code, setCode] = useState(
    `// Exercise: create a Greeting component\n// It should render <h1>Hello, {name}!</h1>\n\nexport function Greeting({ name }: { name: string }) {\n  return null; // TODO\n}`,
  );
  return (
    <CodeEditor
      code={code}
      language="tsx"
      mode="write"
      filename="Greeting.tsx"
      onChange={setCode}
    />
  );
}

export const WriteMode: Story = {
  render: () => <WriteModeDemo />,
};

function SwitchModesDemo() {
  const [mode, setMode] = useState<'view' | 'write'>('write');
  const [code, setCode] = useState(tsxSnippet);

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: 8,
    border: '1px solid var(--color-border)',
    background: active ? 'var(--color-primary)' : 'var(--color-surface)',
    color: active ? '#fff' : 'var(--color-text)',
    cursor: 'pointer',
    fontSize: 13,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setMode('write')} style={btnStyle(mode === 'write')}>
          Write
        </button>
        <button onClick={() => setMode('view')} style={btnStyle(mode === 'view')}>
          Preview
        </button>
      </div>
      <CodeEditor
        code={code}
        language="tsx"
        mode={mode}
        filename="Counter.tsx"
        onChange={setCode}
      />
    </div>
  );
}

export const SwitchModes: Story = {
  render: () => <SwitchModesDemo />,
};
