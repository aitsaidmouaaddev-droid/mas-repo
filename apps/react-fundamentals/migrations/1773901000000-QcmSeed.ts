import type { MigrationInterface, QueryRunner } from 'typeorm';

export class QcmSeed1773901000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = [
  {
    "id": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "label": "Describing the UI",
    "sortOrder": 0
  },
  {
    "id": "7da5ab84-ab82-4522-82e6-17835c297654",
    "label": "Adding Interactivity",
    "sortOrder": 1
  },
  {
    "id": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "label": "Managing State",
    "sortOrder": 2
  },
  {
    "id": "957b062a-1300-462c-a85e-ad70c2591671",
    "label": "Escape Hatches",
    "sortOrder": 3
  },
  {
    "id": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "label": "Advanced React Patterns",
    "sortOrder": 4
  },
  {
    "id": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "label": "Next.js — App Router & Full-Stack",
    "sortOrder": 5
  },
  {
    "id": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "label": "HTML, CSS & SCSS",
    "sortOrder": 6
  },
  {
    "id": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "label": "Code Quality, Git & CI/CD",
    "sortOrder": 7
  },
  {
    "id": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "label": "Software Architecture",
    "sortOrder": 8
  },
  {
    "id": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "label": "Job Interview & Coding Challenges",
    "sortOrder": 9
  },
  {
    "id": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "label": "Human Resources Interview",
    "sortOrder": 10
  }
];

    for (const m of modules) {
      await queryRunner.query(
        `INSERT INTO "qcm_module" ("id", "label", "sortOrder") VALUES ($1, $2, $3)`,
        [m.id, m.label, m.sortOrder],
      );
    }

    const questions = [
  {
    "id": "2a848ec1-8aad-42f8-ae9b-93cad83eccce",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 0,
    "data": {
      "question": "What is a React component?",
      "choices": [
        "A class that extends HTMLElement",
        "A JavaScript function that returns JSX or null",
        "A CSS selector targeting a DOM node",
        "A browser built-in API for creating UI elements"
      ],
      "answer": "1",
      "tags": [
        "jsx",
        "components"
      ],
      "explanation": "A React component is a JavaScript function (or class) that returns JSX describing what should appear on screen. React 19 encourages function components exclusively. Components must start with a capital letter so React can distinguish them from plain HTML tags.",
      "docs": "https://react.dev/learn/writing-markup-with-jsx"
    }
  },
  {
    "id": "4931e5dc-d905-4732-83d5-75e0071f2371",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 1,
    "data": {
      "question": "Which of the following is NOT valid JSX?",
      "choices": [
        "<div className=\"box\">Hello</div>",
        "<img src={url} alt=\"photo\" />",
        "<for x in items>...</for>",
        "<Fragment>...</Fragment>"
      ],
      "answer": "2",
      "tags": [
        "jsx"
      ],
      "explanation": "JSX does not have control-flow tags like <for> or <if>. You must use JavaScript expressions (map, ternary, &&) inside JSX for conditionals and loops. The other options are valid JSX syntax.",
      "docs": "https://react.dev/learn/writing-markup-with-jsx"
    }
  },
  {
    "id": "ce0efa4a-fc7b-40b0-96c3-60b4ab031cd6",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 2,
    "data": {
      "question": "Why must a JSX expression have a single root element?",
      "choices": [
        "Because HTML requires a single root element",
        "Because the browser's DOM API only accepts one root node",
        "Because React's reconciler cannot handle siblings",
        "Because JSX compiles to React.createElement() calls which return a single value"
      ],
      "answer": "3",
      "tags": [
        "jsx"
      ],
      "explanation": "JSX is syntactic sugar for React.createElement() calls. A function can only return one value, so JSX must also resolve to a single root. You can use <></> (Fragment) to wrap siblings without adding an extra DOM node.",
      "docs": "https://react.dev/learn/writing-markup-with-jsx"
    }
  },
  {
    "id": "9608d88a-ca76-42f8-b2a3-e0f5fe24632a",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 3,
    "data": {
      "question": "What does this component render?\n\nfunction Greeting({ name = 'World' }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\n<Greeting />",
      "choices": [
        "<h1>Hello, World!</h1>",
        "<h1>Hello, undefined!</h1>",
        "<h1>Hello, !</h1>",
        "A runtime error because name is required"
      ],
      "answer": "0",
      "tags": [
        "jsx",
        "components"
      ],
      "explanation": "The destructuring default value \`name = 'World'\` kicks in when the prop is not passed (or passed as undefined). So <Greeting /> renders <h1>Hello, World!</h1>. Default props via destructuring are the idiomatic React pattern.",
      "docs": "https://react.dev/learn/writing-markup-with-jsx"
    }
  },
  {
    "id": "1030c054-2feb-4e8a-836a-67141c978a76",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 4,
    "data": {
      "question": "Which statement about props is correct?",
      "choices": [
        "Props can be mutated directly to trigger a re-render",
        "Props and state are the same thing",
        "Props are read-only inside a component and must never be mutated",
        "You must always pass props using the spread operator"
      ],
      "answer": "2",
      "tags": [
        "props"
      ],
      "explanation": "Props are immutable from the child's perspective. React enforces a strict unidirectional data flow: a component receives props from its parent and must not modify them. To change displayed data, use state or lift state up to the parent.",
      "docs": "https://react.dev/learn/passing-props-to-a-component"
    }
  },
  {
    "id": "c53a3193-768b-4bd0-8a62-9688c4f29099",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 5,
    "data": {
      "question": "Given \`const extra = { id: 'box', role: 'main' }\`, what does \`<div {...extra} className=\"container\" />\` render as?",
      "choices": [
        "<div extra={...} className=\"container\" />",
        "<div id=\"box\" role=\"main\" className=\"container\" />",
        "A syntax error because spread is not allowed on JSX",
        "<div className=\"container\" />"
      ],
      "answer": "1",
      "tags": [
        "props"
      ],
      "explanation": "JSX supports the spread operator on props: \`{...extra}\` expands to individual prop assignments. The result is a div with id, role, and className all applied. Props listed after the spread will override same-named spread props.",
      "docs": "https://react.dev/learn/passing-props-to-a-component"
    }
  },
  {
    "id": "2f33d398-5d15-454a-858f-22611ab88910",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 6,
    "data": {
      "question": "What is rendered by this code?\n\nconst count = 0;\nreturn <div>{count && <span>Items</span>}</div>;",
      "choices": [
        "<div></div>",
        "<div><span>Items</span></div>",
        "<div>false</div>",
        "<div>0</div>"
      ],
      "answer": "3",
      "tags": [
        "conditional-rendering"
      ],
      "explanation": "When the left side of \`&&\` is the number 0, JavaScript short-circuits and returns 0 (not false). React renders the number 0 as text. This is a classic React gotcha — use \`count > 0 && ...\` or a ternary to avoid rendering '0'.",
      "docs": "https://react.dev/learn/conditional-rendering"
    }
  },
  {
    "id": "60adc0e1-a82f-467d-bade-20fe272b640c",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 7,
    "data": {
      "question": "Which pattern correctly conditionally renders a component only when \`isLoggedIn\` is true?",
      "choices": [
        "Both A and B are correct",
        "{isLoggedIn && <Dashboard />}",
        "{isLoggedIn ? <Dashboard /> : ''}",
        "Neither — you must use an if statement outside JSX"
      ],
      "answer": "0",
      "tags": [
        "conditional-rendering"
      ],
      "explanation": "Both patterns are valid. \`&&\` short-circuits and renders nothing when false (as long as the left side is boolean). The ternary with empty string also renders nothing. If statements outside the return are also fine — React is flexible about how you express conditional logic.",
      "docs": "https://react.dev/learn/conditional-rendering"
    }
  },
  {
    "id": "c1b6f6d7-c517-46ea-bb39-be4a6cad8b70",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 8,
    "data": {
      "question": "Why does React require a \`key\` prop on elements in a list?",
      "choices": [
        "To style list items individually",
        "To help React identify which items changed, were added, or removed during reconciliation",
        "To give the element a unique CSS id",
        "Keys are optional and only used for accessibility"
      ],
      "answer": "1",
      "tags": [
        "lists",
        "keys"
      ],
      "explanation": "React uses keys to match elements in the current tree against the previous tree during reconciliation. Stable, unique keys let React reuse DOM nodes correctly. Without keys, React falls back to index-based matching, which can cause bugs with reordered or filtered lists.",
      "docs": "https://react.dev/learn/rendering-lists"
    }
  },
  {
    "id": "6f09ecc9-3b78-4807-a5fb-3f50a6b0af71",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 9,
    "data": {
      "question": "Which key strategy is problematic and should be avoided?",
      "choices": [
        "Using a UUID string as a key",
        "Using the item's database id as a key",
        "Using a stable string derived from item content as a key",
        "Using the array index as a key when the list can be reordered or filtered"
      ],
      "answer": "3",
      "tags": [
        "lists",
        "keys"
      ],
      "explanation": "Index-based keys cause problems when items are reordered, filtered, or inserted at positions other than the end. React will incorrectly associate old DOM state (e.g., input values) with new list items. Prefer stable, unique IDs from your data.",
      "docs": "https://react.dev/learn/rendering-lists"
    }
  },
  {
    "id": "7269f906-504f-4568-9235-bd7ca6bccddb",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 10,
    "data": {
      "question": "Which statement best defines a 'pure' React component?",
      "choices": [
        "A component that never uses useState",
        "A component that only renders text, no child components",
        "Given the same props and state, it always renders the same JSX and has no side effects during rendering",
        "A component wrapped in React.memo()"
      ],
      "answer": "2",
      "tags": [
        "purity"
      ],
      "explanation": "Purity means determinism: same inputs → same output, with no side effects during the render phase. Side effects (data fetching, subscriptions, DOM mutations) belong in event handlers or useEffect. React's Strict Mode deliberately double-invokes render functions to surface purity violations.",
      "docs": "https://react.dev/learn/keeping-components-pure"
    }
  },
  {
    "id": "70c3c858-ed2d-4ef6-9fb7-64d1372b6e91",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 11,
    "data": {
      "question": "What is wrong with this component?\n\nlet counter = 0;\nfunction Counter() {\n  counter++;\n  return <p>{counter}</p>;\n}",
      "choices": [
        "It mutates a variable outside its scope during rendering, making it impure",
        "counter should be a string, not a number",
        "The return statement is missing parentheses",
        "Nothing is wrong — this is a valid pattern"
      ],
      "answer": "0",
      "tags": [
        "purity"
      ],
      "explanation": "Modifying \`counter\` (a module-level variable) during the render phase is an impure side effect. In React Strict Mode the component renders twice, causing counter to increment by 2. State or a ref should be used instead. Pure components should only read from their props/state.",
      "docs": "https://react.dev/learn/keeping-components-pure"
    }
  },
  {
    "id": "a7aa4df3-f1b1-405b-9f2a-5d665a21e563",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 12,
    "data": {
      "question": "In React 19, how can you pass a ref to a function component?",
      "choices": [
        "You must still use React.forwardRef() to forward refs",
        "Using a ref callback stored in context",
        "Refs cannot be passed to function components",
        "Directly as a prop named \`ref\` — forwardRef is no longer required"
      ],
      "answer": "3",
      "tags": [
        "jsx",
        "react-19"
      ],
      "explanation": "React 19 treats \`ref\` as a regular prop for function components, eliminating the need for \`React.forwardRef()\`. You simply destructure \`ref\` from props and attach it to the desired DOM element. This simplifies the API and reduces boilerplate.",
      "docs": "https://react.dev/learn/writing-markup-with-jsx"
    }
  },
  {
    "id": "831a321b-ad8b-4d11-9c91-3f0f94e08315",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 13,
    "data": {
      "question": "React 19 allows you to render <title> and <meta> tags directly inside a component. What does React do with them?",
      "choices": [
        "Renders them inline in the component's position in the DOM",
        "Hoists them to the <head> of the document automatically",
        "Throws a warning and ignores them",
        "Requires a special DocumentHead wrapper component"
      ],
      "answer": "1",
      "tags": [
        "react-19"
      ],
      "explanation": "React 19 introduces built-in support for document metadata. When you render <title>, <meta>, or <link> tags inside any component, React automatically hoists them to the document <head>. This eliminates the need for third-party libraries like react-helmet.",
      "docs": "https://react.dev/blog/2024/12/05/react-19"
    }
  },
  {
    "id": "aedcd18b-5233-465d-995f-c059bb8a8444",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 14,
    "data": {
      "question": "What is the rule about component names in JSX?",
      "choices": [
        "Component names must start with an uppercase letter",
        "Component names must be all lowercase",
        "Component names must end with 'Component'",
        "Component names can be any valid JavaScript identifier"
      ],
      "answer": "0",
      "tags": [
        "components",
        "jsx"
      ],
      "explanation": "In JSX, a tag starting with a lowercase letter (e.g., <div>) is treated as a native HTML element. A tag starting with an uppercase letter (e.g., <MyComponent>) is treated as a React component reference. This distinction is baked into the JSX transform.",
      "docs": "https://react.dev/learn/your-first-component"
    }
  },
  {
    "id": "75235c1e-cb62-4447-8531-71526c40ae1d",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "multi",
    "difficulty": "medium",
    "sortOrder": 15,
    "data": {
      "question": "Which of the following are valid ways to export a React component? (Select all that apply)",
      "choices": [
        "module.exports = function MyComponent() { return <div /> }",
        "export default function MyComponent() { return <div /> }",
        "export const MyComponent = () => <div />;",
        "export { MyComponent }; (where MyComponent is defined above)"
      ],
      "answer": "[1,2,3]",
      "tags": [
        "jsx",
        "components"
      ],
      "explanation": "ESM named exports (export const, export { }), default exports (export default), and arrow functions are all valid. CommonJS module.exports works in Node.js but is not idiomatic for React component files which use ES modules. TypeScript and bundlers expect ESM syntax in React projects.",
      "docs": "https://react.dev/learn/writing-markup-with-jsx"
    }
  },
  {
    "id": "751ac247-e1a7-4f90-9b8d-b82062b086bd",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 16,
    "data": {
      "question": "What does \`children\` represent in this component and what does it render?\n\nfunction Card({ children }) {\n  return <div className=\"card\">{children}</div>;\n}\n\n<Card><p>Hello</p></Card>",
      "choices": [
        "<div class=\"card\"></div>",
        "<div class=\"card\">[object Object]</div>",
        "<div class=\"card\"><p>Hello</p></div>",
        "An error — children must be passed as an explicit prop"
      ],
      "answer": "2",
      "tags": [
        "props",
        "jsx"
      ],
      "explanation": "Content placed between JSX opening and closing tags is automatically passed as the \`children\` prop. The Card component renders its container div wrapping whatever was placed inside it — in this case <p>Hello</p>. The children prop is the standard React composition mechanism.",
      "docs": "https://react.dev/learn/passing-props-to-a-component"
    }
  },
  {
    "id": "aa5cec0f-87db-4b30-9940-eff8f03fe692",
    "moduleId": "756c8434-a704-4c6e-88f9-e467dc8c3f91",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 17,
    "data": {
      "question": "You need to render either <AdminPanel /> or <UserPanel /> based on \`role\`. Which approach follows React best practices?",
      "choices": [
        "if (role === 'admin') document.getElementById('root').innerHTML = '<AdminPanel />';",
        "return role === 'admin' ? React.render(<AdminPanel />) : React.render(<UserPanel />);",
        "const Panel = role === 'admin' ? AdminPanel : UserPanel; return <Panel />;",
        "Conditionally import the component file at runtime"
      ],
      "answer": "2",
      "tags": [
        "conditional-rendering",
        "purity"
      ],
      "explanation": "Storing the component type in a variable and rendering it as a JSX element is a clean, idiomatic pattern. It keeps logic declarative and inside the render function. Direct DOM manipulation (option B) bypasses React's reconciler and causes bugs.",
      "docs": "https://react.dev/learn/conditional-rendering"
    }
  },
  {
    "id": "6c36b381-154c-4431-b2de-b20b4a5333d5",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 0,
    "data": {
      "question": "How do you correctly attach a click event handler in JSX?",
      "choices": [
        "<button onclick={handleClick()}>Click</button>",
        "<button onClick=\"handleClick()\">Click</button>",
        "<button on-click={handleClick}>Click</button>",
        "<button onClick={handleClick}>Click</button>"
      ],
      "answer": "3",
      "tags": [
        "events"
      ],
      "explanation": "JSX event names are camelCase (onClick, not onclick). The value must be the function reference itself, not a call (no parentheses). Writing \`{handleClick()}\` would call the function immediately during render instead of on click.",
      "docs": "https://react.dev/learn/responding-to-events"
    }
  },
  {
    "id": "47197547-f29b-42e8-b4b8-ea16ff1451f6",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 1,
    "data": {
      "question": "What does useState return?",
      "choices": [
        "An array with the current state value and a setter function",
        "An object with a \`value\` and \`setValue\` property",
        "The current state value only",
        "A ref object with a \`.current\` property"
      ],
      "answer": "0",
      "tags": [
        "useState"
      ],
      "explanation": "useState returns a two-element array: the current state value and the setter function. Destructuring is idiomatic: \`const [count, setCount] = useState(0)\`. This tuple pattern allows you to name the values anything you want.",
      "docs": "https://react.dev/reference/react/useState"
    }
  },
  {
    "id": "3cc8f7c6-8922-4869-a340-7f2071af3e47",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 2,
    "data": {
      "question": "What does this code alert after clicking the button 3 times fast?\n\nconst [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}\n<button onClick={handleClick}>+</button>",
      "choices": [
        "3 — because setCount is called 3 times",
        "1 — because count is captured as a snapshot",
        "0 — state never updates synchronously",
        "An error is thrown"
      ],
      "answer": "1",
      "tags": [
        "useState",
        "state-snapshot"
      ],
      "explanation": "State is a snapshot: within a single event handler, \`count\` always has the same value (0 on first click). All three setCount calls enqueue \`0 + 1 = 1\`. React batches them and only one update happens. Use the functional form \`setCount(c => c + 1)\` to chain updates correctly.",
      "docs": "https://react.dev/reference/react/useState"
    }
  },
  {
    "id": "9eb59585-35bd-409c-af31-5456f656b108",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 3,
    "data": {
      "question": "How do you correctly increment state 3 times in a single event handler?",
      "choices": [
        "setCount(c => c + 1); setCount(c => c + 1); setCount(c => c + 1);",
        "Both A and B are correct",
        "setCount(count + 3);",
        "setCount(count + 1); setCount(count + 1); setCount(count + 1);"
      ],
      "answer": "1",
      "tags": [
        "useState",
        "state-snapshot"
      ],
      "explanation": "Option A uses updater functions which React queues and applies sequentially, yielding +3. Option B directly adds 3, also yielding +3. Both work. Option C (the wrong pattern) uses the captured snapshot value so all three enqueue the same value and only increment by 1.",
      "docs": "https://react.dev/reference/react/useState"
    }
  },
  {
    "id": "c627705a-9944-4226-8402-037a3e1bd0c1",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 4,
    "data": {
      "question": "In React 18+, when does React batch state updates?",
      "choices": [
        "Only inside React synthetic event handlers",
        "Only when you explicitly call ReactDOM.unstable_batchedUpdates()",
        "All state updates are automatically batched, including inside setTimeout, Promises, and native event handlers",
        "Batching only happens in class components"
      ],
      "answer": "2",
      "tags": [
        "batching"
      ],
      "explanation": "React 18 introduced automatic batching for all state updates regardless of where they originate — event handlers, setTimeout, Promises, native DOM events. Before React 18, only updates inside React synthetic events were batched. This reduces unnecessary re-renders.",
      "docs": "https://react.dev/learn/queueing-a-series-of-state-updates"
    }
  },
  {
    "id": "5158f987-d819-4c10-9c30-75b986afe3cb",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 5,
    "data": {
      "question": "What is wrong with this state update?\n\nconst [user, setUser] = useState({ name: 'Alice', age: 30 });\nfunction birthday() {\n  user.age += 1;\n  setUser(user);\n}",
      "choices": [
        "setUser must receive a primitive, not an object",
        "user.age is a read-only property in React",
        "Nothing is wrong — this is correct",
        "Mutating the state object directly; React may not detect the change and re-render"
      ],
      "answer": "3",
      "tags": [
        "immutability"
      ],
      "explanation": "React uses referential equality to detect state changes. Since \`user\` is mutated in place (same object reference), React sees the old and new state as identical and may skip the re-render. Always create a new object: \`setUser({ ...user, age: user.age + 1 })\`.",
      "docs": "https://react.dev/learn/updating-objects-in-state"
    }
  },
  {
    "id": "14992f80-8c70-4492-a5ee-ff769d8d7c55",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 6,
    "data": {
      "question": "You have an array in state: \`const [items, setItems] = useState([1, 2, 3])\`. How do you correctly add a new item \`4\`?",
      "choices": [
        "setItems([...items, 4])",
        "items.push(4); setItems(items);",
        "setItems(items.push(4));",
        "setItems(items.concat); "
      ],
      "answer": "0",
      "tags": [
        "immutability"
      ],
      "explanation": "Creating a new array with the spread operator gives React a new reference to compare. \`items.push(4)\` mutates the existing array and returns the new length (not the array), causing both bugs. Always use non-mutating array methods or spread to update array state.",
      "docs": "https://react.dev/learn/updating-objects-in-state"
    }
  },
  {
    "id": "396a78cc-d3fc-4ea8-9ed5-29e1bd09b97b",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 7,
    "data": {
      "question": "You have \`const [list, setList] = useState([{id:1,done:false},{id:2,done:false}])\`. How do you toggle \`done\` for id=1 correctly?",
      "choices": [
        "list[0].done = true; setList(list);",
        "setList(list.filter(item => item.id !== 1).push({id:1,done:true}))",
        "setList(list.map(item => item.id === 1 ? { ...item, done: !item.done } : item))",
        "setList([...list, {id:1,done:true}])"
      ],
      "answer": "2",
      "tags": [
        "immutability"
      ],
      "explanation": "Using \`.map()\` to produce a new array where only the matching item is replaced with a spread copy is the idiomatic pattern. It preserves immutability (new array, new object for the changed item) while keeping all other elements untouched.",
      "docs": "https://react.dev/learn/updating-objects-in-state"
    }
  },
  {
    "id": "13cf93f1-16dc-4efd-a7dc-d6b9a89faac3",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 8,
    "data": {
      "question": "How do you prevent the default form submission behaviour in a React event handler?",
      "choices": [
        "Return false from the handler",
        "Call event.preventDefault() inside the handler",
        "Set the form's action attribute to '#'",
        "Use onSubmitCapture instead of onSubmit"
      ],
      "answer": "1",
      "tags": [
        "events"
      ],
      "explanation": "In React, you must call \`event.preventDefault()\` explicitly. Unlike HTML's inline event handlers, returning \`false\` from a React event handler does NOT prevent default behaviour. React's SyntheticEvent wraps the native event and exposes the same preventDefault() method.",
      "docs": "https://react.dev/learn/responding-to-events"
    }
  },
  {
    "id": "83e93ac7-9c5b-4db3-916c-5fbb519175d3",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 9,
    "data": {
      "question": "What is the \`useState\` lazy initialization pattern and when should you use it?",
      "choices": [
        "Pass a function to useState; it runs on every render for fresh data",
        "It is used to initialize state from an API call",
        "It is identical to \`useState(computeExpensiveInitialValue())\`",
        "Pass a function to useState; it runs only once on mount, avoiding expensive recalculation on every render"
      ],
      "answer": "3",
      "tags": [
        "useState"
      ],
      "explanation": "When you pass a function (initializer) to useState, React calls it only during the first render. If you pass the result directly (e.g., \`useState(expensiveCalc())\`), the function is called on every render even though only the first call's result is used. The lazy form avoids this waste.",
      "docs": "https://react.dev/reference/react/useState"
    }
  },
  {
    "id": "69987e18-6bf7-4858-ae26-515b1733f58b",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 10,
    "data": {
      "question": "In React 19, what is an 'Action' in the context of form handling?",
      "choices": [
        "An async function passed to a form's action prop that React automatically wraps with pending/error state management",
        "A Redux action creator used inside a form component",
        "A server-side function that validates form data",
        "A custom event dispatched when a form submits"
      ],
      "answer": "0",
      "tags": [
        "react-19",
        "actions"
      ],
      "explanation": "React 19 introduces support for async functions as form actions. You pass an async function to \`<form action={myAction}>\` and React manages the transition state automatically. This pairs with useFormStatus and useOptimistic to give full pending/optimistic UI without manual state.",
      "docs": "https://react.dev/blog/2024/12/05/react-19"
    }
  },
  {
    "id": "2c26aca1-a1d6-44d5-b51f-4c95bb299c8d",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 11,
    "data": {
      "question": "What does \`useOptimistic\` do in React 19?",
      "choices": [
        "Memoizes the result of an expensive render to avoid re-computation",
        "Shows a temporary optimistic UI state during an async operation, reverting to real state when the operation completes",
        "Defers a state update to after the browser has painted",
        "Prefetches data before a component mounts"
      ],
      "answer": "1",
      "tags": [
        "react-19",
        "useOptimistic"
      ],
      "explanation": "useOptimistic(state, updateFn) returns an optimistic value that immediately reflects the intended future state. While the async operation is in-flight, the optimistic value is shown. If the operation succeeds, React syncs to real state; if it fails, it reverts. This creates snappy perceived performance.",
      "docs": "https://react.dev/blog/2024/12/05/react-19"
    }
  },
  {
    "id": "ffddb8ae-ce2a-4b88-97db-8babc124f3a1",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 12,
    "data": {
      "question": "Which statement about \`useFormStatus\` in React 19 is correct?",
      "choices": [
        "It can be called anywhere in the component tree to get global form status",
        "It replaces useState for all form-related state",
        "It is imported from 'react-dom/server'",
        "It must be called inside a component that is a child of a <form> element to read that form's pending state"
      ],
      "answer": "3",
      "tags": [
        "react-19",
        "useFormStatus"
      ],
      "explanation": "useFormStatus reads the status (pending, data, method, action) of the nearest ancestor <form> element. The component calling it must be rendered inside the form — it cannot read a sibling or parent form's status. Import it from 'react-dom', not 'react'.",
      "docs": "https://react.dev/blog/2024/12/05/react-19"
    }
  },
  {
    "id": "7162c26a-955b-44e3-9fdf-2f398c5ab432",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 13,
    "data": {
      "question": "What will be alerted 3 seconds after clicking the button?\n\nconst [name, setName] = useState('Alice');\nfunction handleClick() {\n  setTimeout(() => alert(name), 3000);\n}\n// User clicks, then immediately types changing name to 'Bob'",
      "choices": [
        "'Bob' — setTimeout reads the latest state",
        "undefined — state is cleared after 3 seconds",
        "'Alice' — the closure captures the snapshot value at click time",
        "An error — state cannot be read inside setTimeout"
      ],
      "answer": "2",
      "tags": [
        "state-snapshot"
      ],
      "explanation": "State in React is a snapshot per render. The setTimeout closure captures \`name\` from the render that created it ('Alice'). Even if state changes later, that closure holds the old value. To always read the latest state in async code, use a ref.",
      "docs": "https://react.dev/learn/state-as-a-snapshot"
    }
  },
  {
    "id": "6455038e-6fff-4fd7-8972-f815e687454d",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 14,
    "data": {
      "question": "What is event propagation (bubbling) and how do you stop it in React?",
      "choices": [
        "Events bubble up from child to parent; call event.stopPropagation() to stop them",
        "Events trickle from parent to child; call event.preventDefault() to stop them",
        "React does not support event propagation",
        "Call event.stopImmediatePropagation() — stopPropagation is not available in React"
      ],
      "answer": "0",
      "tags": [
        "events"
      ],
      "explanation": "Most React events bubble up the component tree (child → parent). \`event.stopPropagation()\` stops the event from reaching ancestor handlers. \`event.preventDefault()\` prevents the browser's default action (e.g., form submit, link navigation) — these are two separate concerns.",
      "docs": "https://react.dev/learn/responding-to-events"
    }
  },
  {
    "id": "c8ce9b03-5593-45b0-a2f6-28e431e8b571",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 15,
    "data": {
      "question": "When does React re-render a component after a state update?",
      "choices": [
        "Every time setState is called, regardless of the new value",
        "Only on the next browser animation frame",
        "Only when the component's parent also re-renders",
        "When the new state value is different from the current state (using Object.is comparison)"
      ],
      "answer": "3",
      "tags": [
        "useState"
      ],
      "explanation": "React uses Object.is() to compare old and new state. If they are the same (e.g., setting a number to the same number), React bails out and skips the re-render. This is an important performance optimization — avoid creating new object references unnecessarily.",
      "docs": "https://react.dev/reference/react/useState"
    }
  },
  {
    "id": "862ef22f-cd48-4925-8297-6a8f11847b49",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "multi",
    "difficulty": "hard",
    "sortOrder": 16,
    "data": {
      "question": "Which of the following are safe (immutable) ways to update an array in state? (Select all that apply)",
      "choices": [
        "items.splice(index, 1)  — splice to remove",
        "[...items, newItem]  — spreading to add",
        "items.filter(i => i.id !== id)  — filtering to remove",
        "items.map(i => i.id === id ? {...i, done:true} : i)  — map to update"
      ],
      "answer": "[1,2,3]",
      "tags": [
        "immutability",
        "useState"
      ],
      "explanation": "Spread, filter, and map all return new arrays without mutating the original — these are safe for React state. Array.splice() mutates the array in place and returns removed elements, so it must be avoided. Use slice + spread as an alternative to splice.",
      "docs": "https://react.dev/learn/updating-objects-in-state"
    }
  },
  {
    "id": "ecb8c21a-56aa-482c-9187-2ad4837b6517",
    "moduleId": "7da5ab84-ab82-4522-82e6-17835c297654",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 17,
    "data": {
      "question": "What is the correct way to initialize state from a prop while avoiding the 'derived state from props' anti-pattern?",
      "choices": [
        "Re-assign the prop inside the component: props.value = newValue",
        "Use the prop only as the initial value in useState and manage state independently: useState(props.value)",
        "Use useEffect to sync state with every prop change",
        "Always derive the value from props instead of using state"
      ],
      "answer": "1",
      "tags": [
        "useState"
      ],
      "explanation": "Passing a prop as the initial value to useState is valid for 'uncontrolled' initialization. The state then lives independently. The anti-pattern is adding a useEffect that copies every prop change into state — that creates two sources of truth. If you need derived values, compute them during render or lift state up.",
      "docs": "https://react.dev/reference/react/useState"
    }
  },
  {
    "id": "81c298b8-edc1-42e1-a843-11f93001b501",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 0,
    "data": {
      "question": "When should you split one piece of state into two separate state variables?",
      "choices": [
        "When the two values change independently from each other",
        "When both values are objects",
        "Always — one state variable per data point is the rule",
        "When a component has more than 3 props"
      ],
      "answer": "0",
      "tags": [
        "state-structure"
      ],
      "explanation": "Group state that changes together and split state that changes independently. If you always update x and y together (like coordinates), a single \`{x, y}\` object makes sense. If they change at different times, separate useState calls are clearer and avoid over-updating.",
      "docs": "https://react.dev/learn/choosing-the-state-structure"
    }
  },
  {
    "id": "d472d477-7893-437f-bb30-1df3c4a17384",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 1,
    "data": {
      "question": "Which of these state structures has redundant state?",
      "choices": [
        "firstName — it's redundant because fullName already stores all the data",
        "lastName — it's redundant if fullName is stored",
        "fullName — it can be computed as \`\${firstName} \${lastName}\` during render",
        "None — all three are needed"
      ],
      "answer": "2",
      "tags": [
        "state-structure"
      ],
      "explanation": "\`fullName\` is redundant (derived state). You can always compute it during render: \`const fullName = firstName + ' ' + lastName\`. Storing it in state creates two sources of truth that can fall out of sync. Only store the minimal set of state from which everything else can be derived.",
      "docs": "https://react.dev/learn/choosing-the-state-structure"
    }
  },
  {
    "id": "454fa09a-c375-4d67-8879-7d0e72be4946",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 2,
    "data": {
      "question": "What does 'lifting state up' mean in React?",
      "choices": [
        "Moving state from a class component to a function component",
        "Using a global state manager like Redux",
        "Moving state to the closest common ancestor component so multiple children can share it",
        "Initializing state at the top of a component file"
      ],
      "answer": "2",
      "tags": [
        "lifting-state"
      ],
      "explanation": "When two sibling components need to share the same state, you lift it up to their nearest common ancestor. The parent holds the state and passes it down as props along with setter callbacks. This keeps the data flow unidirectional and predictable.",
      "docs": "https://react.dev/learn/sharing-state-between-components"
    }
  },
  {
    "id": "ba279bb8-b4a2-40d6-b907-a305a8eea054",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 3,
    "data": {
      "question": "Two tabs (<TabA /> and <TabB />) need to show which tab is active. Where should the \`activeTab\` state live?",
      "choices": [
        "In TabA, which passes it to TabB via props",
        "In a separate TabState module",
        "In each tab individually — they each track their own active status",
        "In the parent component that renders both tabs"
      ],
      "answer": "3",
      "tags": [
        "lifting-state"
      ],
      "explanation": "Since both tabs need to know which is active (to display correctly) and only one can be active at a time, the state belongs in their parent. The parent controls which tab is active and passes the value down. Each tab independently tracking its own 'active' state would make them impossible to synchronize.",
      "docs": "https://react.dev/learn/sharing-state-between-components"
    }
  },
  {
    "id": "e6883823-5945-4e4d-8fc1-507178fb8329",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 4,
    "data": {
      "question": "When is useReducer preferable to useState?",
      "choices": [
        "When you have complex state logic with multiple sub-values or when the next state depends on the previous one through multiple action types",
        "When you need the absolute fastest re-render performance",
        "Only in class components",
        "When you have more than 3 separate useState calls"
      ],
      "answer": "0",
      "tags": [
        "reducers",
        "useReducer"
      ],
      "explanation": "useReducer shines when state transitions are complex — multiple fields updated together, or when different actions produce different state shapes. It centralizes update logic in a pure reducer function, making state transitions easier to test and reason about.",
      "docs": "https://react.dev/learn/extracting-state-logic-into-a-reducer"
    }
  },
  {
    "id": "f77dbc9d-0718-4847-8196-6b75d8b5cdbf",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 5,
    "data": {
      "question": "What does this reducer return when action is \`{type: 'increment'}\`?\n\nfunction reducer(state, action) {\n  switch(action.type) {\n    case 'increment': return { count: state.count + 1 };\n    case 'reset': return { count: 0 };\n    default: return state;\n  }\n}\n// Initial state: { count: 5 }",
      "choices": [
        "{ count: 5 }",
        "{ count: 6 }",
        "{ count: 1 }",
        "undefined"
      ],
      "answer": "1",
      "tags": [
        "useReducer"
      ],
      "explanation": "The reducer receives the current state \`{ count: 5 }\` and the action \`{ type: 'increment' }\`. The switch matches 'increment' and returns \`{ count: 5 + 1 }\` = \`{ count: 6 }\`. Reducers must be pure functions — they return new state objects without mutating the input.",
      "docs": "https://react.dev/reference/react/useReducer"
    }
  },
  {
    "id": "8aaabe50-ce2c-496c-b8d0-5d6e8d4ff668",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 6,
    "data": {
      "question": "What is the correct signature of a React reducer function?",
      "choices": [
        "(action, state) => newState",
        "(state, action) => newState",
        "(dispatch, state, action) => newState",
        "(state) => newState"
      ],
      "answer": "1",
      "tags": [
        "useReducer"
      ],
      "explanation": "A reducer takes the current state and an action, then returns the next state. The order matters — state comes first. The function must be pure: same inputs always produce the same output, no side effects. React passes these arguments when you call dispatch(action).",
      "docs": "https://react.dev/reference/react/useReducer"
    }
  },
  {
    "id": "952e2ca3-5752-4c8d-b766-a5299f9aa5f3",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 7,
    "data": {
      "question": "What problem does React Context solve?",
      "choices": [
        "Slow re-renders caused by large component trees",
        "Sharing state between completely separate React apps",
        "Prop drilling — passing data through many intermediate components that don't need it",
        "Replacing all useState calls"
      ],
      "answer": "2",
      "tags": [
        "context",
        "useContext"
      ],
      "explanation": "Context provides a way to pass data through the component tree without manually passing props at every level. It's ideal for data that many components at different nesting levels need — like the current theme, user authentication, or locale.",
      "docs": "https://react.dev/learn/passing-data-deeply-with-context"
    }
  },
  {
    "id": "d498e427-ccc5-4c2e-8b09-a62d4c9a56bc",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 8,
    "data": {
      "question": "What is the correct way to create and provide a context value?",
      "choices": [
        "Pattern B — Context constructor then wrap directly",
        "Both are equivalent",
        "Neither — context is created differently in React 19",
        "Pattern A — createContext() then wrap with .Provider"
      ],
      "answer": "3",
      "tags": [
        "context",
        "useContext"
      ],
      "explanation": "React.createContext(defaultValue) creates a context object. You wrap consumers with <Context.Provider value={...}> to inject a value. The default value is only used when a component reads context without a matching Provider above it. Pattern B is invalid JavaScript.",
      "docs": "https://react.dev/learn/passing-data-deeply-with-context"
    }
  },
  {
    "id": "0b6cc605-9d47-41f2-b385-8ad573159c72",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 9,
    "data": {
      "question": "How does a component read a context value in React 19?",
      "choices": [
        "const theme = useContext(ThemeContext);",
        "const theme = ThemeContext.read();",
        "const theme = this.context;",
        "const theme = getContext(ThemeContext);"
      ],
      "answer": "0",
      "tags": [
        "context",
        "useContext"
      ],
      "explanation": "useContext(SomeContext) returns the current value of the context from the nearest <SomeContext.Provider> above the calling component. When the Provider's value changes, all components calling useContext re-render. \`this.context\` only works in class components using contextType.",
      "docs": "https://react.dev/learn/passing-data-deeply-with-context"
    }
  },
  {
    "id": "7577a109-afd5-4a56-83bc-544f34664acc",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 10,
    "data": {
      "question": "What is new about using context in React 19 with the \`use()\` hook?",
      "choices": [
        "use() replaces createContext and no longer requires a Provider",
        "use() returns a Promise instead of the context value",
        "use(SomeContext) can be called conditionally inside if-statements, unlike useContext",
        "use() only works with server components"
      ],
      "answer": "2",
      "tags": [
        "context",
        "react-19",
        "use-hook"
      ],
      "explanation": "React 19 introduces the \`use()\` hook which can read context (and Promises). Unlike useContext, \`use()\` can be called inside conditionals and loops — it is not subject to the 'hooks must not be called conditionally' rule. This gives more flexibility in complex conditional rendering scenarios.",
      "docs": "https://react.dev/learn/passing-data-deeply-with-context"
    }
  },
  {
    "id": "50e893b7-4139-45e9-8329-688cea393f1b",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 11,
    "data": {
      "question": "What does \`use(promise)\` do in React 19?",
      "choices": [
        "Converts the promise to a callback-based API",
        "Suspends the component until the promise resolves, then returns the resolved value",
        "Caches the promise result in localStorage",
        "Creates a new promise from an existing value"
      ],
      "answer": "1",
      "tags": [
        "react-19",
        "use-hook"
      ],
      "explanation": "When you pass a Promise to \`use()\`, React suspends rendering of the component until the promise resolves, similar to how async/await works but integrated with Suspense boundaries. The component above must have a <Suspense fallback> to show while waiting.",
      "docs": "https://react.dev/blog/2024/12/05/react-19"
    }
  },
  {
    "id": "b2118dc1-70c6-407f-aea8-da12c7ec5d89",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 12,
    "data": {
      "question": "What is the 'avoid impossible states' principle in state design?",
      "choices": [
        "Never use boolean state variables",
        "Always use TypeScript to prevent invalid state",
        "Split all state into separate useState calls",
        "Structure state so that invalid combinations cannot be represented — e.g., use a status enum instead of multiple boolean flags"
      ],
      "answer": "3",
      "tags": [
        "state-structure"
      ],
      "explanation": "Multiple booleans like \`isLoading\` and \`isError\` can both be true simultaneously — an impossible real-world state. Replacing them with a status enum ('idle' | 'loading' | 'success' | 'error') makes invalid states unrepresentable, eliminating entire classes of bugs.",
      "docs": "https://react.dev/learn/choosing-the-state-structure"
    }
  },
  {
    "id": "1b3873df-b412-4cd3-bb06-f513c6439d50",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 13,
    "data": {
      "question": "Why should reducer functions be pure (no side effects)?",
      "choices": [
        "React Strict Mode calls reducers twice to detect side effects; impure reducers would cause bugs",
        "Reducers run on the server, where side effects are not allowed",
        "React cannot handle errors thrown inside reducers",
        "The action object becomes read-only inside the reducer"
      ],
      "answer": "0",
      "tags": [
        "reducers",
        "useReducer"
      ],
      "explanation": "React Strict Mode double-invokes reducers (in development) to help detect impurity. If a reducer performs side effects like API calls, they would run twice. Reducers should only compute and return new state — side effects belong in event handlers or useEffect.",
      "docs": "https://react.dev/learn/extracting-state-logic-into-a-reducer"
    }
  },
  {
    "id": "f32e1cdf-6631-450d-8f1f-ee0a6afa8b57",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 14,
    "data": {
      "question": "What is the 'Context + useReducer' pattern used for?",
      "choices": [
        "Replacing useContext with a more performant API",
        "A lightweight alternative to Redux: useReducer manages complex state, Context distributes it to the tree",
        "Server-side rendering of context values",
        "Persisting state to localStorage automatically"
      ],
      "answer": "1",
      "tags": [
        "context",
        "useReducer"
      ],
      "explanation": "Combining useReducer with Context gives you a Redux-like pattern without external libraries. The parent component holds the reducer state and dispatch, provides them through Context, and any descendant can read state or dispatch actions. This scales well for medium-complexity apps.",
      "docs": "https://react.dev/learn/passing-data-deeply-with-context"
    }
  },
  {
    "id": "5cf09984-6ce9-4399-a7d2-4abbdbfa12e5",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 15,
    "data": {
      "question": "What does React use to determine if state has changed?",
      "choices": [
        "JSON.stringify() comparison",
        "Deep equality (recursively compares nested properties)",
        "A hash of the component's render output",
        "Object.is() — strict equality check on the state value"
      ],
      "answer": "3",
      "tags": [
        "state-structure"
      ],
      "explanation": "React uses Object.is() (similar to ===) to compare old and new state. This is why mutating objects or arrays in state doesn't trigger re-renders — the reference stays the same. Creating a new object/array gives React a different reference, signaling a change.",
      "docs": "https://react.dev/learn/choosing-the-state-structure"
    }
  },
  {
    "id": "3b15ba6e-f2d2-4c08-83da-0b481ecee1c4",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "multi",
    "difficulty": "hard",
    "sortOrder": 16,
    "data": {
      "question": "Which of these are valid principles for structuring React state? (Select all that apply)",
      "choices": [
        "Always split related state into individual useState calls",
        "Don't mirror props in state unless you need to track independent mutations",
        "Avoid storing derived values in state — compute them during render",
        "Avoid deeply nested state — prefer flat structures"
      ],
      "answer": "[1,2,3]",
      "tags": [
        "state-structure"
      ],
      "explanation": "Mirroring props causes sync issues; derived values create redundancy; deep nesting makes immutable updates verbose. These three are core state design principles. Option C is wrong — related values that update together often belong in a single object to ensure they stay in sync.",
      "docs": "https://react.dev/learn/choosing-the-state-structure"
    }
  },
  {
    "id": "bbd48a3f-df91-4a34-8269-fa649d54c3ca",
    "moduleId": "14f95086-16bb-4c2c-abad-4c96136ce04e",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 17,
    "data": {
      "question": "What is a performance concern with Context and how can you mitigate it?",
      "choices": [
        "Context only works in class components, causing performance issues in functional apps",
        "Context causes memory leaks if not manually cleaned up",
        "Every consumer re-renders when the Provider value changes; split context by concern and memoize values",
        "Context cannot hold object values without performance degradation"
      ],
      "answer": "2",
      "tags": [
        "context"
      ],
      "explanation": "All components consuming a context re-render when the Provider value changes. If the value is a new object on every render (e.g., \`value={{ theme, setTheme }}\`), it will always trigger re-renders. Mitigate by splitting into separate contexts (data vs actions) and using useMemo to stabilize the value object.",
      "docs": "https://react.dev/learn/passing-data-deeply-with-context"
    }
  },
  {
    "id": "b5560544-821e-471f-a0ea-0bac9796c6fb",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 0,
    "data": {
      "question": "What is the key difference between useRef and useState?",
      "choices": [
        "Changing a ref's .current value does not trigger a re-render; changing state does",
        "Refs are for strings only; state can hold any type",
        "State persists across renders; refs reset to their initial value on every render",
        "useRef can only be used inside class components"
      ],
      "answer": "0",
      "tags": [
        "useRef"
      ],
      "explanation": "A ref is a mutable container whose \`.current\` property can be changed without causing a re-render. State, on the other hand, triggers a re-render when updated. Refs are ideal for storing values you need to remember across renders but don't need to display (e.g., timer IDs, previous values).",
      "docs": "https://react.dev/reference/react/useRef"
    }
  },
  {
    "id": "7aef3c7f-938e-4ef8-a2c5-6468b87056ab",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 1,
    "data": {
      "question": "How do you get a reference to a DOM element in React?",
      "choices": [
        "Option B: <input ref=\"inputRef\" />",
        "Option C: <input domRef={inputRef} />",
        "All three are equivalent",
        "Option A: <input ref={inputRef} />"
      ],
      "answer": "3",
      "tags": [
        "dom-refs"
      ],
      "explanation": "You attach a ref to a DOM element with the \`ref\` prop, passing the ref object (not a string). After mounting, \`inputRef.current\` points to the DOM node. String refs (option B) were deprecated and removed. After mounting, you can call methods like \`inputRef.current.focus()\`.",
      "docs": "https://react.dev/learn/manipulating-the-dom-with-refs"
    }
  },
  {
    "id": "331ec99f-046f-458d-b357-946e7fad925f",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 2,
    "data": {
      "question": "When is it safe to access a DOM ref's \`.current\` value?",
      "choices": [
        "During the render function, before JSX is returned",
        "After the component has mounted — refs are null during the initial render",
        "Inside the useState initializer function",
        "Anytime — refs are always populated"
      ],
      "answer": "1",
      "tags": [
        "dom-refs"
      ],
      "explanation": "During the initial render, the DOM element hasn't been created yet, so \`ref.current\` is null. React sets \`ref.current\` after the DOM is committed (post-mount). Access refs in event handlers, useEffect, or useLayoutEffect — never during rendering.",
      "docs": "https://react.dev/learn/manipulating-the-dom-with-refs"
    }
  },
  {
    "id": "10ddad13-81e5-4230-8d7b-79aeda238143",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 3,
    "data": {
      "question": "What is the purpose of useEffect?",
      "choices": [
        "To synchronize a component with an external system (APIs, subscriptions, timers) after rendering",
        "To replace useState for managing side effects",
        "To memoize expensive calculations between renders",
        "To run code before the component renders for the first time"
      ],
      "answer": "0",
      "tags": [
        "useEffect"
      ],
      "explanation": "useEffect lets you perform side effects — operations that reach outside of React's rendering system — after the component has been painted to the screen. This includes data fetching, subscriptions, timers, and manual DOM manipulation. It runs after every render by default.",
      "docs": "https://react.dev/reference/react/useEffect"
    }
  },
  {
    "id": "bf52783e-9b9c-4085-ba5a-f7b9e39be134",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 4,
    "data": {
      "question": "What does the dependency array in useEffect control?",
      "choices": [
        "The values listed are passed as arguments to the effect function",
        "The effect is skipped if any dependency is falsy",
        "The effect runs only when one of the listed dependencies changes between renders",
        "React validates that all listed dependencies are valid state variables"
      ],
      "answer": "2",
      "tags": [
        "useEffect"
      ],
      "explanation": "React compares each dependency with its previous value using Object.is(). If any changed, the effect re-runs. An empty array \`[]\` means run only on mount. Omitting the array means run after every render. The array should include every reactive value the effect uses.",
      "docs": "https://react.dev/reference/react/useEffect"
    }
  },
  {
    "id": "a679034b-a5f9-415e-8d0d-0cf9310618cb",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 5,
    "data": {
      "question": "What is the cleanup function in useEffect and when should you use it?",
      "choices": [
        "A function called before the effect runs for the first time",
        "A catch block for errors thrown inside the effect",
        "A function returned from the effect that React calls before re-running the effect or on unmount",
        "A function that cancels the dependency comparison"
      ],
      "answer": "2",
      "tags": [
        "useEffect"
      ],
      "explanation": "Returning a function from useEffect registers a cleanup. React calls it when the component unmounts OR before re-running the effect due to a dependency change. Use it to cancel subscriptions, clear timers, or abort fetch requests to prevent memory leaks and stale callbacks.",
      "docs": "https://react.dev/reference/react/useEffect"
    }
  },
  {
    "id": "ee0cc7b2-7384-43b9-a2fd-c79df76e26bf",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 6,
    "data": {
      "question": "How many times does the effect run?\n\nfunction App() {\n  const [x, setX] = useState(0);\n  useEffect(() => {\n    console.log('effect');\n  }, []);\n  return <button onClick={() => setX(x+1)}>{x}</button>;\n}",
      "choices": [
        "On every button click",
        "Twice — once on mount, once on unmount",
        "Every render",
        "Once — only on mount, regardless of how many times the button is clicked"
      ],
      "answer": "3",
      "tags": [
        "useEffect",
        "effects"
      ],
      "explanation": "An empty dependency array \`[]\` means the effect runs only once after the initial render (mount). Clicking the button updates state and re-renders the component, but the effect does NOT re-run because its dependencies haven't changed. In React Strict Mode, effects run twice on mount in development.",
      "docs": "https://react.dev/reference/react/useEffect"
    }
  },
  {
    "id": "afaf6ff5-ea3a-4390-85e0-2cec06f2ad40",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 7,
    "data": {
      "question": "What is wrong with this effect — it causes an infinite loop:\n\nuseEffect(() => {\n  setCount(count + 1);\n}, [count]);",
      "choices": [
        "Setting state inside an effect with that state as a dependency creates an infinite loop: effect → state change → re-render → effect again",
        "setCount cannot be called inside useEffect",
        "The dependency array should be empty to fix it",
        "count must be declared outside the component to avoid this"
      ],
      "answer": "0",
      "tags": [
        "useEffect",
        "effects"
      ],
      "explanation": "The effect reads \`count\`, updates it, which triggers a re-render, which runs the effect again because \`count\` changed. This cycle never ends. Fix by removing count from deps and using the functional updater: \`setCount(c => c + 1)\`, or by reconsidering whether an effect is needed at all.",
      "docs": "https://react.dev/reference/react/useEffect"
    }
  },
  {
    "id": "e26ef663-c307-4e17-b3ed-e8b757a485f8",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 8,
    "data": {
      "question": "What is the missing dependency bug here?\n\nfunction Search({ query }) {\n  const [results, setResults] = useState([]);\n  useEffect(() => {\n    fetch(\`/api/search?q=\${query}\`)\n      .then(r => r.json())\n      .then(setResults);\n  }, []); // <-- bug\n}",
      "choices": [
        "setResults should not be in the dependency array",
        "query is used inside the effect but missing from the dependency array — search won't re-run when query changes",
        "fetch is an external function that must be listed as a dependency",
        "The effect will never run because query is a prop"
      ],
      "answer": "1",
      "tags": [
        "useEffect"
      ],
      "explanation": "The effect uses \`query\` but the empty \`[]\` means it only runs on mount, capturing the initial query value forever. If the parent passes a new query prop, the search won't re-execute. Fix: add \`query\` to the dependency array. Also add an abort controller for cleanup to cancel stale requests.",
      "docs": "https://react.dev/reference/react/useEffect"
    }
  },
  {
    "id": "4255c4d8-148c-491f-a490-61f7d056cec3",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 9,
    "data": {
      "question": "What are the rules of hooks?",
      "choices": [
        "Hooks can only be called inside class components",
        "Only call hooks at the top level of a React function; don't call them inside conditions, loops, or nested functions",
        "Hooks must be imported from a file named 'hooks.js'",
        "You can call hooks anywhere in JavaScript, not just React components"
      ],
      "answer": "1",
      "tags": [
        "custom-hooks"
      ],
      "explanation": "The two rules of hooks are: (1) only call hooks at the top level — not inside loops, conditions, or nested functions; (2) only call hooks from React function components or custom hooks. These rules ensure React can correctly associate hook state with the right component instance.",
      "docs": "https://react.dev/learn/reusing-logic-with-custom-hooks"
    }
  },
  {
    "id": "8e0200a1-d0a1-47e5-8c70-ef1fb23705cc",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 10,
    "data": {
      "question": "What makes a function a 'custom hook' in React?",
      "choices": [
        "It is registered with React.registerHook()",
        "It extends the Hook class from React",
        "Its name starts with 'use' and it calls at least one React hook internally",
        "It is exported from a file named useHooks.ts"
      ],
      "answer": "2",
      "tags": [
        "custom-hooks"
      ],
      "explanation": "A custom hook is simply a JavaScript function whose name starts with 'use' and that calls React hooks internally. The naming convention lets linters enforce the rules of hooks. Custom hooks are a powerful abstraction for sharing stateful logic between components.",
      "docs": "https://react.dev/learn/reusing-logic-with-custom-hooks"
    }
  },
  {
    "id": "e9b6c7e2-967a-4253-8716-5c55d0229252",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 11,
    "data": {
      "question": "Two components use the same custom hook \`useCounter()\`. What is true about their state?",
      "choices": [
        "Both components share the same state instance — changing one changes the other",
        "The first component to mount owns the state; others get a read-only copy",
        "They share state only if the hook uses Context internally",
        "Each component gets its own independent state — hooks share logic but not state"
      ],
      "answer": "3",
      "tags": [
        "custom-hooks"
      ],
      "explanation": "Custom hooks share stateful logic, not state itself. Each call to useCounter() creates independent state within that component instance. To share state between components, you must lift it (common ancestor), use Context, or use an external store.",
      "docs": "https://react.dev/learn/reusing-logic-with-custom-hooks"
    }
  },
  {
    "id": "ccf92829-1fcb-4d4d-8c9d-98947e5d2039",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 12,
    "data": {
      "question": "What does the React 19 compiler (React Forget) do?",
      "choices": [
        "Automatically adds memoization (memo, useMemo, useCallback) at compile time, eliminating the need to write them manually",
        "Compiles React components to WebAssembly for faster execution",
        "Converts class components to function components automatically",
        "Type-checks JSX at compile time without TypeScript"
      ],
      "answer": "0",
      "tags": [
        "react-19",
        "compiler"
      ],
      "explanation": "The React compiler (formerly React Forget) statically analyzes your component code and automatically inserts useMemo, useCallback, and React.memo where appropriate. This eliminates the need to manually optimize re-renders, reducing boilerplate and potential mistakes.",
      "docs": "https://react.dev/blog/2024/12/05/react-19"
    }
  },
  {
    "id": "19c08477-07e7-46ce-9071-98d039450b36",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 13,
    "data": {
      "question": "You need to store a setTimeout ID to cancel it later. Should you use useRef or useState?",
      "choices": [
        "useState — to ensure the component updates when the timer is set",
        "A module-level variable — it persists better than a ref",
        "useRef — you don't need the component to re-render when the timer ID changes",
        "Neither — use the return value of useEffect instead"
      ],
      "answer": "2",
      "tags": [
        "useRef"
      ],
      "explanation": "Timer IDs are implementation details — you need to store them to cancel later, but displaying or reacting to them is unnecessary. Storing them in a ref avoids triggering re-renders. A module-level variable would be shared across all component instances, causing bugs.",
      "docs": "https://react.dev/reference/react/useRef"
    }
  },
  {
    "id": "4d95680f-1c10-46f6-9639-9fd9257d5718",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 14,
    "data": {
      "question": "What is the difference between useEffect and useLayoutEffect?",
      "choices": [
        "useLayoutEffect is for layout CSS changes; useEffect is for JavaScript logic",
        "useLayoutEffect fires synchronously after DOM mutations but before the browser paints; useEffect fires after paint",
        "useLayoutEffect runs on the server; useEffect only runs in the browser",
        "They are identical — useLayoutEffect is an alias"
      ],
      "answer": "1",
      "tags": [
        "useEffect"
      ],
      "explanation": "useLayoutEffect runs synchronously after React commits DOM changes but before the browser has painted. This lets you measure DOM layout and synchronously re-render without the user seeing intermediate states. Use it sparingly — it blocks painting. For most effects, useEffect (post-paint) is appropriate.",
      "docs": "https://react.dev/reference/react/useEffect"
    }
  },
  {
    "id": "41d2207e-20d2-4e1c-ba9c-49f6eb9cb3c5",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 15,
    "data": {
      "question": "You want to create a \`useWindowSize\` hook. What should it return and how should it update?",
      "choices": [
        "The cleanup function is wrong — you cannot remove event listeners in useEffect",
        "useState should not be used inside custom hooks",
        "window is not accessible inside useEffect",
        "This implementation is correct — it initializes from window, listens for resize, and cleans up"
      ],
      "answer": "3",
      "tags": [
        "useEffect",
        "custom-hooks"
      ],
      "explanation": "This is a textbook custom hook. It initializes state from window dimensions, adds a resize listener in useEffect, and returns the cleanup function to remove the listener on unmount. The empty dep array means the listener is set up once. This pattern correctly encapsulates the subscription lifecycle.",
      "docs": "https://react.dev/reference/react/useEffect"
    }
  },
  {
    "id": "d490027d-efcc-4c22-bf6b-410044acbce9",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "multi",
    "difficulty": "hard",
    "sortOrder": 16,
    "data": {
      "question": "Which of the following are appropriate use cases for useEffect? (Select all that apply)",
      "choices": [
        "Computing a derived value from props (e.g., formatted date string)",
        "Subscribing to a WebSocket after mount and unsubscribing on unmount",
        "Fetching data when a query parameter changes",
        "Setting the document title based on current state"
      ],
      "answer": "[1,2,3]",
      "tags": [
        "useEffect",
        "effects"
      ],
      "explanation": "Effects are for side effects that synchronize with external systems: subscriptions, data fetching, DOM mutations like document.title. Computing derived values from props/state does NOT need an effect — just compute during render. Using an effect for derived values adds unnecessary complexity and a render cycle.",
      "docs": "https://react.dev/reference/react/useEffect"
    }
  },
  {
    "id": "aa254178-122d-4e2a-a2ac-fed4c50618d8",
    "moduleId": "957b062a-1300-462c-a85e-ad70c2591671",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 17,
    "data": {
      "question": "What pattern avoids stale closures in useEffect without adding the function to the dependency array?",
      "choices": [
        "Store the callback in a ref and always call ref.current() inside the effect — the ref always holds the latest value",
        "Add the callback to the dependency array of the interval effect",
        "Use useCallback to stabilize the callback reference",
        "Move the callback definition inside the effect"
      ],
      "answer": "0",
      "tags": [
        "useRef",
        "useEffect"
      ],
      "explanation": "The 'ref pattern' stores the latest callback in a ref (updated every render), while the interval effect only depends on \`delay\`. The interval always calls \`callbackRef.current()\` which points to the latest callback, avoiding the stale closure problem without restarting the interval on every render.",
      "docs": "https://react.dev/reference/react/useRef"
    }
  },
  {
    "id": "4adef527-7e20-4742-98b9-86e63e2776a5",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 0,
    "data": {
      "question": "What does React.memo() do?",
      "choices": [
        "Memoizes the return value of an expensive function calculation",
        "Wraps a component and skips re-rendering if props haven't changed (shallow comparison)",
        "Wraps a callback function to maintain a stable reference across renders",
        "Caches the component's DOM output in the browser's memory"
      ],
      "answer": "1",
      "tags": [
        "memo"
      ],
      "explanation": "React.memo() is a higher-order component that shallowly compares props before re-rendering. If the parent re-renders but passes the same props, the memoized child is skipped. It only helps when the parent re-renders frequently and the child's props rarely change.",
      "docs": "https://react.dev/reference/react/memo"
    }
  },
  {
    "id": "e0040823-032c-4ab5-8343-93d4c5f18af6",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 1,
    "data": {
      "question": "When does React.memo() fail to prevent a re-render?",
      "choices": [
        "When the component has internal state",
        "When the component uses useContext",
        "When more than 5 props are passed",
        "When a prop is a new object or function reference created during the parent's render"
      ],
      "answer": "3",
      "tags": [
        "memo"
      ],
      "explanation": "React.memo uses shallow comparison. If a parent creates a new object \`{}\` or function \`() => {}\` on every render (even with identical values), those are new references and memo will not skip the re-render. Pair React.memo with useMemo (for objects) and useCallback (for functions) to stabilize references.",
      "docs": "https://react.dev/reference/react/memo"
    }
  },
  {
    "id": "880bfdb7-6844-43b3-8346-982401851def",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 2,
    "data": {
      "question": "What is the difference between useMemo and useCallback?",
      "choices": [
        "useMemo is for asynchronous values; useCallback is for synchronous ones",
        "useCallback returns a value; useMemo returns a function",
        "useMemo memoizes the result of a computation; useCallback memoizes the function itself",
        "They are identical — useCallback is an alias for useMemo"
      ],
      "answer": "2",
      "tags": [
        "useMemo",
        "useCallback"
      ],
      "explanation": "useMemo(() => compute(a, b), [a, b]) calls the function and returns its result. useCallback(() => doSomething(a), [a]) returns the function itself (not its result). useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). Both help maintain referential stability.",
      "docs": "https://react.dev/reference/react/useMemo"
    }
  },
  {
    "id": "08e67f23-515e-49bb-8736-f4c149ef5da2",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 3,
    "data": {
      "question": "When is useMemo actually beneficial?",
      "choices": [
        "When the computation is genuinely expensive (e.g., filtering 10,000 items) and the dependencies rarely change",
        "For every value derived from props to prevent any re-computation",
        "When you want to persist a value across page navigations",
        "When a value is used inside a useEffect"
      ],
      "answer": "0",
      "tags": [
        "useMemo"
      ],
      "explanation": "useMemo has a cost — the dependency comparison runs on every render. For cheap computations, useMemo can be slower than just recomputing. Only apply it to provably expensive operations. Profile first; avoid premature memoization. The React compiler automates this in React 19.",
      "docs": "https://react.dev/reference/react/useMemo"
    }
  },
  {
    "id": "57227fe9-081a-40c2-bb66-d18b15b4825c",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 4,
    "data": {
      "question": "What does this code do?\n\nconst Chart = React.lazy(() => import('./Chart'));\n\nfunction Dashboard() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <Chart />\n    </Suspense>\n  );\n}",
      "choices": [
        "Renders Chart immediately but shows Spinner if Chart throws an error",
        "Preloads Chart in the background when Dashboard first mounts",
        "Makes Chart optional — it only renders if the import succeeds",
        "Lazily loads the Chart module via dynamic import; shows <Spinner /> while the bundle is loading"
      ],
      "answer": "3",
      "tags": [
        "suspense",
        "lazy"
      ],
      "explanation": "React.lazy() + Suspense implements code splitting. The Chart component's JavaScript bundle is not loaded until Dashboard is rendered. While the bundle is fetching, Suspense shows the fallback. Once loaded, Chart renders. This reduces initial bundle size.",
      "docs": "https://react.dev/reference/react/Suspense"
    }
  },
  {
    "id": "2e4580f0-60aa-47f4-a73f-b32dbf2066ba",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 5,
    "data": {
      "question": "What do React error boundaries catch?",
      "choices": [
        "All JavaScript errors anywhere in the application",
        "JavaScript errors thrown during rendering, in lifecycle methods, and in constructors of child components",
        "Only errors thrown inside event handlers",
        "Network errors from fetch calls inside useEffect"
      ],
      "answer": "1",
      "tags": [
        "error-boundary"
      ],
      "explanation": "Error boundaries catch errors during rendering, lifecycle methods, and constructors. They do NOT catch errors in event handlers (use try/catch there), async code, server-side rendering, or errors in the error boundary itself. They must be class components implementing componentDidCatch or getDerivedStateFromError.",
      "docs": "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary"
    }
  },
  {
    "id": "2208f22f-99f2-4d8f-a11b-09c825f8eb91",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 6,
    "data": {
      "question": "Which statement correctly describes React Server Components?",
      "choices": [
        "They run only on the server, can access backend resources directly, and send rendered HTML + serialized props to the client",
        "They are components that fetch data using useEffect on the server",
        "They replace client components and always require a 'use server' directive",
        "They are components that run in a service worker"
      ],
      "answer": "0",
      "tags": [
        "react-19",
        "server-components"
      ],
      "explanation": "React Server Components execute on the server (at request time or build time), can directly access databases and file systems, never ship their JavaScript to the browser, and produce a special React tree that clients hydrate. They reduce client bundle size significantly.",
      "docs": "https://react.dev/blog/2024/12/05/react-19"
    }
  },
  {
    "id": "ad3d27ab-ac43-4dc1-a509-60c66393c5e8",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 7,
    "data": {
      "question": "Which of these cannot be done inside a React Server Component?",
      "choices": [
        "Reading from a database",
        "Rendering other Server Components",
        "Using useState, useEffect, or browser APIs like window/document",
        "Passing serializable props to Client Components"
      ],
      "answer": "2",
      "tags": [
        "react-19",
        "server-components",
        "use-client"
      ],
      "explanation": "Server Components run on the server — there is no browser, no event loop, no DOM. Therefore useState, useEffect, event handlers, and browser APIs are unavailable. Database reads, file I/O, and async data fetching are perfectly valid. Use 'use client' to mark components that need browser APIs.",
      "docs": "https://react.dev/blog/2024/12/05/react-19"
    }
  },
  {
    "id": "dea630ee-df6e-4c84-81f0-14f812dde6a1",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 8,
    "data": {
      "question": "What does the 'use client' directive do in a Next.js / React 19 project?",
      "choices": [
        "Enables client-side routing for the component",
        "Prevents the component from being rendered on the server",
        "Marks a component as a Client Component — it will be shipped to and executed in the browser",
        "Enables TypeScript type checking for browser APIs"
      ],
      "answer": "2",
      "tags": [
        "use-client"
      ],
      "explanation": "'use client' is a bundler directive placed at the top of a file. It creates a boundary: the file and all components imported by it are Client Components. They are included in the JavaScript bundle sent to the browser and can use hooks, event handlers, and browser APIs.",
      "docs": "https://react.dev/reference/rsc/use-client"
    }
  },
  {
    "id": "103343ba-b0b3-4844-9d33-304a7cda0e30",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 9,
    "data": {
      "question": "What is a hydration error and what causes it?",
      "choices": [
        "An error thrown when a Server Component fetches data from an unavailable API",
        "A memory leak caused by improper cleanup in useEffect",
        "An error when importing a Server Component into a Client Component",
        "A mismatch between the HTML rendered on the server and what React renders on the client during hydration"
      ],
      "answer": "3",
      "tags": [
        "react-19",
        "server-components"
      ],
      "explanation": "Hydration is the process where React attaches event listeners to server-rendered HTML. If the client renders different JSX (due to Date.now(), Math.random(), or browser-only APIs), React throws a hydration mismatch error. Fix by using suppressHydrationWarning or ensuring consistent rendering between server and client.",
      "docs": "https://react.dev/blog/2024/12/05/react-19"
    }
  },
  {
    "id": "1dcdc493-27a9-464d-8af0-f1b3ca39e4dd",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 10,
    "data": {
      "question": "How does \`use(promise)\` interact with Suspense in React 19?",
      "choices": [
        "While the promise is pending, the component suspends and the nearest Suspense boundary shows its fallback",
        "use(promise) blocks the main thread until the promise resolves",
        "use(promise) requires an ErrorBoundary — otherwise it crashes the app",
        "use(promise) only works inside Server Components"
      ],
      "answer": "0",
      "tags": [
        "react-19",
        "use-hook",
        "suspense"
      ],
      "explanation": "use(promise) integrates with Suspense: when the promise is pending, React suspends the component (throws a special signal), and the nearest <Suspense fallback> is shown. When the promise resolves, React re-renders the component with the resolved value. ErrorBoundary handles rejections.",
      "docs": "https://react.dev/blog/2024/12/05/react-19"
    }
  },
  {
    "id": "0b561802-6bed-46f3-a40d-861913dbf54b",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "multi",
    "difficulty": "hard",
    "sortOrder": 11,
    "data": {
      "question": "Which combinations make React.memo() effective? (Select all that apply)",
      "choices": [
        "React.memo on the child alone when props include inline arrow functions",
        "React.memo on the child + useCallback on handler functions passed as props",
        "React.memo on the child + useMemo on object props created in the parent",
        "React.memo on the child when all props are primitive values (strings, numbers, booleans)"
      ],
      "answer": "[1,2,3]",
      "tags": [
        "memo",
        "useMemo",
        "useCallback"
      ],
      "explanation": "React.memo works with shallow comparison. Primitives compare by value, so they're safe (option D). Functions and objects are compared by reference — inline definitions create new references every render, defeating memo (option C is wrong). useCallback stabilizes functions (A), useMemo stabilizes objects (B).",
      "docs": "https://react.dev/reference/react/memo"
    }
  },
  {
    "id": "394e5907-4009-4a63-8007-8f6bab953ddc",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 12,
    "data": {
      "question": "Where must a <Suspense> boundary be placed relative to a component using React.lazy() or use()?",
      "choices": [
        "As the direct parent of the lazy/suspending component only",
        "Anywhere above the suspending component in the tree — it catches suspension from any descendant",
        "At the root of the application only",
        "Inside the lazy component itself"
      ],
      "answer": "1",
      "tags": [
        "suspense"
      ],
      "explanation": "Suspense boundaries work like error boundaries — they catch suspension from any descendant, not just direct children. You can nest multiple Suspense boundaries for granular loading states. The nearest ancestor Suspense boundary catches the suspension and shows its fallback.",
      "docs": "https://react.dev/reference/react/Suspense"
    }
  },
  {
    "id": "da6f7828-d05e-4777-b27b-d82cfb921c6e",
    "moduleId": "cef9ccb0-c77f-4eea-97cc-89eea4fa1f05",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 13,
    "data": {
      "question": "Can a Server Component be imported by a Client Component?",
      "choices": [
        "Yes — freely import Server Components into Client Components",
        "No — but a Server Component can be passed to a Client Component as a prop (children or JSX slot)",
        "Yes — but only if the Server Component has no async operations",
        "No — Server and Client Components cannot interact at all"
      ],
      "answer": "1",
      "tags": [
        "react-19",
        "server-components"
      ],
      "explanation": "Once you cross into 'use client' territory, everything imported must be client-compatible. You cannot import a Server Component inside a Client Component. However, you CAN pass a server-rendered component as the \`children\` prop from a Server Component parent, which is the recommended composition pattern.",
      "docs": "https://react.dev/blog/2024/12/05/react-19"
    }
  },
  {
    "id": "03e00a18-a5b5-4ac3-8cf4-61301cfd7ff0",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 0,
    "data": {
      "question": "In the Next.js App Router, what is the role of \`layout.tsx\`?",
      "choices": [
        "Defines the page content for a specific route",
        "Handles errors thrown by pages in the segment",
        "Defines shared UI that wraps all pages in a route segment and persists across navigations",
        "Shows a loading skeleton while page data is being fetched"
      ],
      "answer": "2",
      "tags": [
        "nextjs",
        "app-router"
      ],
      "explanation": "layout.tsx wraps its route segment's page and all child segments. It persists across navigations within its scope — only the page content re-renders, not the layout. The root layout (app/layout.tsx) must include <html> and <body> tags and applies to every page.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "039a27a1-beca-4bf2-b1c9-831ce956ba84",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 1,
    "data": {
      "question": "What is the purpose of \`loading.tsx\` in the Next.js App Router?",
      "choices": [
        "Displays a loading bar at the top of the page during client-side navigations",
        "Replaces the page content until the layout has loaded its fonts",
        "Is only rendered on the server during SSR",
        "Automatically wraps the page in a <Suspense> boundary and shows the loading UI while the page's async data is fetching"
      ],
      "answer": "3",
      "tags": [
        "nextjs",
        "app-router"
      ],
      "explanation": "Next.js automatically wraps the page in <Suspense> when loading.tsx exists. While the async page component is awaiting data, loading.tsx renders as the fallback. This enables instant navigation UI — users see the loading state immediately rather than waiting for a blank page.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "88075992-3614-4795-96ec-3b58292142b5",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 2,
    "data": {
      "question": "What does \`error.tsx\` do in the Next.js App Router?",
      "choices": [
        "Acts as an Error Boundary for the route segment — catches rendering and data fetching errors and shows recovery UI",
        "Handles 404 not found errors for the segment",
        "Logs errors to an external monitoring service automatically",
        "Prevents error pages from being indexed by search engines"
      ],
      "answer": "0",
      "tags": [
        "nextjs",
        "app-router"
      ],
      "explanation": "error.tsx is a Client Component that wraps the segment in a React Error Boundary. It receives \`error\` and \`reset\` props. \`reset()\` retries the failed render. For 404s, use not-found.tsx instead. Error boundaries do not catch errors in layouts — use a parent segment's error.tsx.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "217cf493-990f-4cfb-919c-2eff932f2a0b",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 3,
    "data": {
      "question": "What does a route group — a folder named \`(marketing)\` — do in the App Router?",
      "choices": [
        "Creates a URL path segment named 'marketing'",
        "Applies a marketing-specific middleware to all routes inside",
        "Groups routes without affecting the URL path — the folder name is excluded from the URL",
        "Makes all routes inside the group client-side only"
      ],
      "answer": "2",
      "tags": [
        "nextjs",
        "routing"
      ],
      "explanation": "Route groups use parentheses \`()\` in the folder name. The name is purely organizational and does not appear in the URL. This lets you share layouts between specific routes, organize routes by concern (e.g., (auth), (shop)), and define multiple root layouts in the same project.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "ba7be74d-c375-493f-b8f5-9a28836ab334",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 4,
    "data": {
      "question": "What is the difference between \`[slug]\`, \`[...slug]\`, and \`[[...slug]]\` in Next.js route folders?",
      "choices": [
        "[slug]: optional segment; [...slug]: exactly one segment; [[...slug]]: two or more segments",
        "[slug]: single dynamic segment; [...slug]: catch-all (requires at least one segment); [[...slug]]: optional catch-all (also matches the base path)",
        "All three are equivalent — they match any URL pattern",
        "[slug]: client-side only; [...slug]: server-side only; [[...slug]]: hybrid"
      ],
      "answer": "1",
      "tags": [
        "nextjs",
        "routing"
      ],
      "explanation": "[slug] matches a single segment like /post/hello. [...slug] matches one or more segments like /docs/a/b/c. [[...slug]] is optional — it also matches the parent path /docs with no segments. The spread variants provide \`params.slug\` as an array. Useful for documentation sites with variable depth.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "3b5fde74-55d8-4163-aa84-7c566e1756f9",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 5,
    "data": {
      "question": "In Next.js App Router, components are Server Components by default. When must you use a Client Component?",
      "choices": [
        "When the component fetches data from an external API",
        "When the component is used in multiple pages",
        "When the component renders more than 100 elements",
        "When using hooks (useState, useEffect), event handlers, or browser-only APIs"
      ],
      "answer": "3",
      "tags": [
        "nextjs",
        "server-components",
        "client-components"
      ],
      "explanation": "Server Components cannot use React hooks, event listeners, or browser APIs (window, document). Add 'use client' at the top of any file that needs interactivity or browser APIs. Data fetching is preferred in Server Components — you can await fetch() directly.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "447df917-76bb-4ce3-b290-5ef96659c934",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 6,
    "data": {
      "question": "What is a Server Action in Next.js and how is it invoked from a form?",
      "choices": [
        "An async function marked with 'use server' that runs on the server; passed to a form's action prop",
        "A Server Component that handles POST requests via API routes",
        "A middleware function that intercepts form submissions",
        "A special React hook for server-side form validation"
      ],
      "answer": "0",
      "tags": [
        "nextjs",
        "server-actions"
      ],
      "explanation": "Server Actions are async functions tagged with the 'use server' directive. They are called directly from Client Components or HTML forms without creating API routes. When passed to \`<form action={myAction}>\`, Next.js handles serialization, CSRF protection, and the network round-trip automatically.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "1c962c38-27a8-4f45-8865-0d45804ab128",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 7,
    "data": {
      "question": "What is wrong with this Server Action usage?\n\n'use client'\nconst action = async (formData) => {\n  'use server';\n  const name = formData.get('name');\n  await db.insert({ name });\n};",
      "choices": [
        "formData.get() is not supported in Server Actions",
        "Server Actions defined inside Client Components must be in a separate file with 'use server' at the top — not inline",
        "db.insert() should be wrapped in a try/catch",
        "Nothing is wrong — inline Server Actions are valid in Client Components"
      ],
      "answer": "1",
      "tags": [
        "nextjs",
        "server-actions"
      ],
      "explanation": "You cannot define a Server Action inline inside a Client Component ('use client' file). Instead, create a separate file with 'use server' at the top and define your actions there, then import them into the Client Component. Co-locating 'use server' inline in a 'use client' function is not permitted.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "ad532006-827e-4a33-91d9-bbc22d4e5d3d",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 8,
    "data": {
      "question": "What are the main benefits of using next/image over a plain <img> tag?",
      "choices": [
        "It adds image filters and cropping without external libraries",
        "It stores images in a CDN automatically without configuration",
        "It only loads images visible in the viewport and discards the rest from memory",
        "Automatic lazy loading, resizing to device viewport, format conversion (WebP/AVIF), and preventing layout shift (CLS)"
      ],
      "answer": "3",
      "tags": [
        "nextjs",
        "image"
      ],
      "explanation": "next/image automatically optimizes images: lazy loads off-screen images, serves modern formats (WebP/AVIF), resizes for the requesting device, and reserves space with the width/height props to prevent Cumulative Layout Shift. These improvements directly impact Core Web Vitals.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "e78697e0-13fe-4833-a699-59bc6c17bfa0",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 9,
    "data": {
      "question": "How do you generate dynamic metadata (e.g., page title based on route params) in the App Router?",
      "choices": [
        "Use a <Head> component from 'next/head' inside the page component",
        "Set document.title inside a useEffect in the page",
        "Export an async \`generateMetadata\` function from the page/layout file that receives params",
        "Define a static \`metadata\` export and update it with JavaScript after hydration"
      ],
      "answer": "2",
      "tags": [
        "nextjs",
        "metadata"
      ],
      "explanation": "In App Router, export \`generateMetadata(props)\` from page.tsx for dynamic metadata. It receives the same params as the page component, can fetch data, and returns a Metadata object. For static metadata, export a \`metadata\` constant. The old <Head> from next/head does not work in App Router.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "6fa8bebf-08ed-4857-9b95-952a33e824cc",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 10,
    "data": {
      "question": "What is the difference between ISR (Incremental Static Regeneration) and SSR in Next.js?",
      "choices": [
        "ISR pre-builds pages and regenerates them in the background after a revalidation period; SSR renders on every request",
        "ISR renders only on the client; SSR renders on the server for every request",
        "ISR is only available for API routes; SSR is for page routes",
        "They are identical — ISR is just SSR with caching enabled"
      ],
      "answer": "0",
      "tags": [
        "nextjs",
        "rendering"
      ],
      "explanation": "ISR (using \`export const revalidate = 60\`) serves a cached static page and regenerates it in the background when the cache expires. SSR (dynamic rendering) rebuilds the page from scratch on every request. ISR gives near-static performance with the ability to update content periodically.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "c59ea766-c966-4069-a116-a015b3d17583",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 11,
    "data": {
      "question": "In App Router, what forces a route to become dynamically rendered (SSR per request)?",
      "choices": [
        "Having more than 10 components in the page",
        "Using a Client Component anywhere in the page tree",
        "Importing from a third-party package",
        "Using cookies(), headers(), or searchParams — or setting \`export const dynamic = 'force-dynamic'\`"
      ],
      "answer": "3",
      "tags": [
        "nextjs",
        "rendering"
      ],
      "explanation": "Next.js automatically opts routes into dynamic rendering when they access request-specific data: cookies(), headers(), or searchParams. You can also explicitly opt in with \`dynamic = 'force-dynamic'\`. Everything else is statically rendered at build time by default in the App Router.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "5f1cc9f6-6fc0-4069-89bc-d3a66585a120",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 12,
    "data": {
      "question": "Where does Next.js Middleware run and what can it do?",
      "choices": [
        "On the Node.js server after the page has been rendered",
        "At the Edge (before the cache) on every request — it can rewrite, redirect, modify headers, and set cookies",
        "On the client before React hydration",
        "Only on API routes, not on page routes"
      ],
      "answer": "1",
      "tags": [
        "nextjs",
        "middleware"
      ],
      "explanation": "Middleware (middleware.ts at project root) runs on the Edge Runtime before the request reaches cached content or the page. Common uses: authentication redirects, A/B testing rewrites, geolocation-based routing, and header manipulation. It runs on every matched request, so keep it fast.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "868ad312-7d34-4648-a03f-9c6b76fdea3d",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 13,
    "data": {
      "question": "Given this folder structure, what URL does \`app/(shop)/products/[id]/page.tsx\` respond to?",
      "choices": [
        "/products/123 — route groups don't affect the URL",
        "/(shop)/products/123",
        "/shop/products/123",
        "/products — [id] is optional"
      ],
      "answer": "0",
      "tags": [
        "nextjs",
        "app-router"
      ],
      "explanation": "Route group folders in parentheses \`(shop)\` are excluded from the URL. The URL is determined by the remaining path segments: \`products/[id]\`. So this page responds to \`/products/123\`, \`/products/abc\`, etc. The \`id\` param is available as \`params.id\`.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "9b948188-9edf-4a80-be8e-9366f47ec839",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 14,
    "data": {
      "question": "What is \`generateStaticParams\` used for?",
      "choices": [
        "Generates metadata for static pages",
        "Validates that route params match an expected format",
        "Pre-generates static pages for dynamic routes at build time — returns an array of param objects",
        "Fetches data for static pages from an API"
      ],
      "answer": "2",
      "tags": [
        "nextjs",
        "server-components",
        "rendering"
      ],
      "explanation": "generateStaticParams() (App Router equivalent of getStaticPaths) returns an array of param objects for dynamic routes. Next.js pre-renders a static page for each combination at build time. Unknown paths can be handled at runtime by setting \`dynamicParams = true\` (default) or 404 with \`false\`.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "9c766d67-da94-48b7-96ce-2c52acae68e2",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 15,
    "data": {
      "question": "What error occurs when you try to use useState inside a Server Component?",
      "choices": [
        "A TypeScript type error but the component still runs",
        "React silently ignores the hook and returns undefined",
        "Error: useState is not a function — hooks are not available in Server Components",
        "The component is automatically converted to a Client Component"
      ],
      "answer": "2",
      "tags": [
        "nextjs",
        "client-components"
      ],
      "explanation": "Server Components run in a Node.js-like environment where React hooks are not available. Using useState, useEffect, or any hook will throw an error at runtime (and a build-time warning). Add 'use client' to the top of the file to make it a Client Component.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "f48d8981-23b8-4b29-9830-a08f6e88ca58",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "multi",
    "difficulty": "hard",
    "sortOrder": 16,
    "data": {
      "question": "Which files in the Next.js App Router are reserved special filenames? (Select all that apply)",
      "choices": [
        "component.tsx",
        "page.tsx",
        "layout.tsx",
        "loading.tsx"
      ],
      "answer": "[1,2,3]",
      "tags": [
        "nextjs",
        "app-router"
      ],
      "explanation": "page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx, template.tsx, and route.ts are reserved filenames with special behavior in App Router. \`component.tsx\` has no special meaning — it's just a regular file. Using reserved names correctly is essential for App Router features.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "f3ee8ed0-7ea9-478b-a6e6-4f55824368df",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 17,
    "data": {
      "question": "What is the difference between Server Components fetching data vs client-side data fetching with useEffect?",
      "choices": [
        "Server Components can only fetch from internal APIs; useEffect can call any API",
        "useEffect is faster because it runs in the browser close to the user",
        "They are equivalent — choose based on preference",
        "Server Components fetch data on the server before HTML is sent (no waterfall, no client JS needed); useEffect fetches after hydration, causing loading states and JS bundle overhead"
      ],
      "answer": "3",
      "tags": [
        "nextjs",
        "rendering"
      ],
      "explanation": "Server Component data fetching happens before the HTML is sent to the client — data is baked into the HTML. No client JavaScript is needed for the fetch. useEffect-based fetching creates a request waterfall (render → hydrate → fetch → render again), adds bundle size, and shows loading spinners. Server fetching is preferred for initial data.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "6303aa5c-ef2b-4c2b-9947-ae1b5d2ccf15",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 18,
    "data": {
      "question": "What is the purpose of \`not-found.tsx\` in the App Router?",
      "choices": [
        "Renders a custom 404 UI when \`notFound()\` is called from a page or when no route matches",
        "Handles JavaScript runtime errors that result in missing components",
        "Displays when a dynamic import fails to load",
        "Wraps all routes to handle missing layout files"
      ],
      "answer": "0",
      "tags": [
        "nextjs",
        "app-router",
        "routing"
      ],
      "explanation": "not-found.tsx renders when the \`notFound()\` function is called (e.g., after failing to find a resource in the database) or when Next.js cannot match a URL to any route. It scopes to the nearest ancestor not-found.tsx in the route hierarchy, allowing segment-level 404 pages.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "0ba06d18-8ef6-4ef5-a732-caaad4874ffc",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 19,
    "data": {
      "question": "What does \`next/link\` prefetch by default in production?",
      "choices": [
        "Prefetches all pages in the app on initial load",
        "Prefetches page segments that are visible in the viewport, enabling instant navigation",
        "Does not prefetch — prefetch must be explicitly enabled with prefetch={true}",
        "Only prefetches the layout, not the page content"
      ],
      "answer": "1",
      "tags": [
        "nextjs",
        "routing"
      ],
      "explanation": "In production, next/link automatically prefetches page data for links visible in the viewport using the Intersection Observer. This makes subsequent navigations feel instant. Disable with \`prefetch={false}\` for rarely-visited or paid-content pages. In development, no prefetching occurs.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "2c163b90-3adc-4970-9c77-dbcdf58dbb1e",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 20,
    "data": {
      "question": "Can you pass a Server Component a non-serializable prop like a function from a Client Component?",
      "choices": [
        "Yes — all JavaScript values are transferable across the boundary",
        "No — props crossing the server/client boundary must be serializable (JSON-compatible)",
        "Yes — but only if the function is async",
        "No — Client Components cannot pass any props to Server Components"
      ],
      "answer": "1",
      "tags": [
        "nextjs",
        "server-components"
      ],
      "explanation": "The server/client boundary is serialized over the network (or at build time). Only JSON-serializable values (strings, numbers, arrays, plain objects, null) can cross. Functions, class instances, and Symbols cannot be serialized. Event handlers must stay within the Client Component tree.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "d045fff0-cad5-4240-8797-ad4667532837",
    "moduleId": "5d4b7fcf-b36e-473b-9618-6e793b2070f7",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 21,
    "data": {
      "question": "What does \`export const revalidate = 3600\` in a Next.js page file control?",
      "choices": [
        "The page sends Cache-Control headers telling browsers to cache for 3600 seconds",
        "The page fetches fresh data from its API every 3600 milliseconds",
        "The page's static cache is invalidated and the page is regenerated at most once every 3600 seconds (ISR)",
        "Revalidation runs a background job every hour to warm the cache"
      ],
      "answer": "2",
      "tags": [
        "nextjs",
        "rendering"
      ],
      "explanation": "The \`revalidate\` export configures ISR (Incremental Static Regeneration). The page is statically built and served from cache. After \`revalidate\` seconds pass, the next request triggers background regeneration. Subsequent requests serve the newly regenerated page. This balances performance with content freshness.",
      "docs": "https://nextjs.org/docs/app"
    }
  },
  {
    "id": "1f27dab5-2460-427f-b5e4-5cb1e0192834",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 0,
    "data": {
      "question": "Which HTML element is the most semantically correct for the main navigation of a website?",
      "choices": [
        "<div id=\"navigation\">",
        "<menu>",
        "<header>",
        "<nav>"
      ],
      "answer": "3",
      "tags": [
        "html",
        "semantics"
      ],
      "explanation": "<nav> is the semantic HTML5 element for navigation links. It helps screen readers and search engines identify navigation regions. <div> has no semantic meaning. <menu> is for toolbars/context menus. <header> wraps introductory content, which may contain a <nav> but isn't the nav itself.",
      "docs": null
    }
  },
  {
    "id": "ea62f516-cb4f-41fc-b6fd-93de0d339a5b",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 1,
    "data": {
      "question": "Which element should wrap an article's byline and publication date?",
      "choices": [
        "<footer> inside the <article>",
        "<small> below the <h1>",
        "<aside> adjacent to the article",
        "<caption> inside the article"
      ],
      "answer": "0",
      "tags": [
        "html",
        "semantics"
      ],
      "explanation": "<article> can contain a <footer> element that holds meta-information like author, publication date, and tags. This is the correct semantic structure. <aside> is for tangentially related content, not article metadata. <caption> is only for tables.",
      "docs": null
    }
  },
  {
    "id": "8daff447-8ab1-4e9a-bff0-e809d1807c03",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 2,
    "data": {
      "question": "Which selector wins when both apply to the same element? Selector A: \`#header .nav a\` | Selector B: \`nav ul li a.active\`",
      "choices": [
        "Selector B — it is more specific because it has more total selectors",
        "They are equal — each has 3 components",
        "Selector A — it has 1 ID (1,0,0) + 1 class (0,1,0) + 1 tag (0,0,1) = (1,1,1) vs B's 0 IDs, 1 class, 4 tags = (0,1,4)",
        "Selector B wins because classes beat IDs in modern CSS"
      ],
      "answer": "2",
      "tags": [
        "css",
        "specificity"
      ],
      "explanation": "Specificity is calculated as (IDs, classes/attrs/pseudoClasses, tags/pseudoElements). Selector A: 1 ID + 1 class + 1 tag = (1,1,1). Selector B: 0 IDs + 2 classes (class + .active) + 3 tags = (0,2,3). The ID in A makes it win because IDs outrank any number of classes.",
      "docs": null
    }
  },
  {
    "id": "6bf8f969-6ae2-451e-8bf3-5af58bd2fe5b",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 3,
    "data": {
      "question": "In what order does the CSS cascade resolve conflicts (highest to lowest priority)?",
      "choices": [
        "Inline styles > !important > IDs > classes > browser defaults",
        "!important declarations > inline styles > IDs > classes > tags > browser defaults",
        "IDs > classes > tags > inline styles > !important",
        "Browser defaults > tags > classes > IDs > !important > inline styles"
      ],
      "answer": "1",
      "tags": [
        "css",
        "specificity"
      ],
      "explanation": "The cascade order: (1) !important user-agent, (2) !important author, (3) !important user, (4) author inline, (5) author ID, (6) author class/attr/pseudo-class, (7) author tag, (8) browser defaults. !important always wins within its origin. Specificity only applies within the same cascade layer and origin.",
      "docs": null
    }
  },
  {
    "id": "38a845d9-ba9e-4956-9148-f460a1a336d3",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 4,
    "data": {
      "question": "What creates a new stacking context in CSS?",
      "choices": [
        "Any element with a z-index value",
        "Any element with position: relative",
        "Elements with display: flex or display: grid always create a stacking context",
        "An element with position: relative/absolute/fixed + a z-index value other than auto"
      ],
      "answer": "3",
      "tags": [
        "css"
      ],
      "explanation": "A stacking context is created by: positioned elements with z-index ≠ auto, opacity < 1, transform, filter, isolation: isolate, will-change, and others. Simply setting z-index on a static element does nothing. Elements inside a stacking context are painted as a group, independent of outside z-indexes.",
      "docs": null
    }
  },
  {
    "id": "aea97885-7157-449a-b4a8-513a980b94a4",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 5,
    "data": {
      "question": "What is true about CSS custom properties (variables)?",
      "choices": [
        "They cascade and inherit — a child element inherits the variable from its parent unless overridden",
        "They only work on :root and cannot be scoped to a component",
        "They are evaluated at compile time like SCSS variables",
        "Changing a custom property requires JavaScript — CSS alone cannot update them"
      ],
      "answer": "0",
      "tags": [
        "css",
        "custom-properties"
      ],
      "explanation": "CSS custom properties (--color: blue) cascade through the DOM like regular inherited properties. A value set on a parent is available to all descendants. You can scope them to a component: \`.card { --bg: white; }\`. They differ from SCSS variables which are static at compile time — CSS vars are dynamic and respond to media queries and DOM changes.",
      "docs": null
    }
  },
  {
    "id": "a32e906e-4fe7-4bea-a959-eb3c48e4eec9",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 6,
    "data": {
      "question": "How would you implement a dark/light theme switch using CSS custom properties?",
      "choices": [
        "Use CSS media queries only — custom properties cannot be toggled with JS",
        "Define variables on :root for light theme; override them on [data-theme='dark'] or .dark class; toggle the attribute/class with JS",
        "Import two separate CSS files and swap stylesheets with JS",
        "Use CSS @supports to detect dark mode and change variables"
      ],
      "answer": "1",
      "tags": [
        "css",
        "custom-properties",
        "theme"
      ],
      "explanation": "Define semantic tokens on :root (--bg: white; --text: black). Override them in a [data-theme='dark'] block (--bg: #111; --text: white). JavaScript toggles the attribute on document.documentElement. All components using the tokens automatically update. This is the standard modern theming approach.",
      "docs": null
    }
  },
  {
    "id": "2479975c-8bab-460f-ba8a-9d23117b2ea5",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 7,
    "data": {
      "question": "In a flex container with \`flex-direction: row\`, which axis does \`align-items\` affect?",
      "choices": [
        "The main axis (horizontal in row direction)",
        "Both axes simultaneously",
        "Neither — align-items only works with flex-direction: column",
        "The cross axis (vertical in row direction)"
      ],
      "answer": "3",
      "tags": [
        "css",
        "flexbox"
      ],
      "explanation": "In a row flex container, the main axis is horizontal and the cross axis is vertical. \`justify-content\` controls alignment along the main axis (horizontal); \`align-items\` controls alignment along the cross axis (vertical). These axis roles swap when flex-direction is column.",
      "docs": null
    }
  },
  {
    "id": "7583c718-34ec-4630-a40e-c7b1b25424bd",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 8,
    "data": {
      "question": "An element has \`flex: 1 0 200px\`. What does each value mean?",
      "choices": [
        "flex-grow: 0, flex-shrink: 1, flex-basis: 200px",
        "flex-grow: 1, flex-shrink: 1, flex-basis: 200px",
        "flex-grow: 1 (can grow), flex-shrink: 0 (cannot shrink), flex-basis: 200px (initial size)",
        "The shorthand is invalid — you must use three separate properties"
      ],
      "answer": "2",
      "tags": [
        "css",
        "flexbox"
      ],
      "explanation": "The \`flex\` shorthand maps to (flex-grow, flex-shrink, flex-basis). flex: 1 0 200px means the element starts at 200px, can grow to fill available space (grow:1), but will never shrink below 200px (shrink:0). This is common for sidebars that expand but don't compress.",
      "docs": null
    }
  },
  {
    "id": "30421ce9-78be-4f13-9a57-a237facf3922",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 9,
    "data": {
      "question": "What is the difference between \`auto-fill\` and \`auto-fit\` in CSS Grid?",
      "choices": [
        "auto-fill creates empty columns when items don't fill the row; auto-fit collapses empty tracks to 0 width, stretching items",
        "auto-fill only works with fixed column sizes; auto-fit works with minmax()",
        "auto-fit requires explicit column count; auto-fill is truly automatic",
        "They are identical — browser choice of which to use"
      ],
      "answer": "0",
      "tags": [
        "css",
        "grid"
      ],
      "explanation": "Both fill the row with as many columns as fit. The difference: auto-fill preserves empty column tracks (useful for consistent grid lines), while auto-fit collapses empty tracks and stretches existing items to fill space. When all tracks are full, they behave identically. auto-fit is usually preferred for responsive grids.",
      "docs": null
    }
  },
  {
    "id": "9789208c-271f-4e2c-98f9-8f4ff06cb449",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 10,
    "data": {
      "question": "What is the difference between \`::before\` and \`:hover\`?",
      "choices": [
        "::before is for CSS animations; :hover is for user interactions",
        "Both are pseudo-elements — the difference is only naming convention",
        "::before requires JavaScript to work; :hover is pure CSS",
        "::before is a pseudo-element (creates a new box in the DOM); :hover is a pseudo-class (selects an element in a particular state)"
      ],
      "answer": "3",
      "tags": [
        "css"
      ],
      "explanation": "Pseudo-elements (::before, ::after, ::first-line) create virtual elements that aren't in the HTML — they insert generated content. Pseudo-classes (:hover, :focus, :nth-child) target elements based on state or structural position. The double colon :: is the modern syntax for pseudo-elements (single colon still works for legacy reasons).",
      "docs": null
    }
  },
  {
    "id": "5fcc25db-c180-4ca5-a86e-9aace144619c",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 11,
    "data": {
      "question": "What is the difference between SCSS \`@use\` and \`@import\`?",
      "choices": [
        "@use is for external packages; @import is for local files",
        "@use creates a namespace, loads each file once, and hides private members (prefixed with _); @import is deprecated and pollutes the global scope",
        "@import supports variables; @use does not",
        "They are equivalent — @use is just the newer syntax"
      ],
      "answer": "1",
      "tags": [
        "scss"
      ],
      "explanation": "@import dumps everything into the global namespace and loads files multiple times if used in multiple places. @use loads a file once, namespaces its exports (e.g., \`colors.$primary\`), and respects private members (names starting with -_ or _). @import is deprecated since Dart Sass 1.23.",
      "docs": null
    }
  },
  {
    "id": "e113f92b-34c4-4828-a683-98524f5f95d3",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 12,
    "data": {
      "question": "What is the difference between SCSS \`@mixin\`/\`@include\` and \`%placeholder\`/\`@extend\`?",
      "choices": [
        "Mixins generate duplicate CSS for each include (supports arguments); extend groups selectors together (no duplication, no arguments)",
        "Mixins are for variables; extend is for functions",
        "Extend generates duplicate CSS; mixins share a single rule set",
        "They are identical — both generate the same CSS output"
      ],
      "answer": "0",
      "tags": [
        "scss"
      ],
      "explanation": "A mixin called 3 times generates 3 copies of the CSS — but supports parameters for customization. @extend groups selectors into one rule (no duplication), but can cause unexpected selector specificity and cannot accept arguments. Prefer mixins for customizable patterns and consider avoiding @extend in large codebases.",
      "docs": null
    }
  },
  {
    "id": "9b76bf6f-9870-4a03-b551-847a6a5dcd56",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 13,
    "data": {
      "question": "Given this SCSS structure, what is the correct file for an index that only forwards members for external use?\n\n_variables.scss | _reset.scss | _components.scss",
      "choices": [
        "index.scss should use @import to load all partials",
        "index.scss should use @use to make members available globally",
        "index.scss should use @forward to expose members from all partials",
        "index.scss should contain all styles directly, not forward partials"
      ],
      "answer": "2",
      "tags": [
        "scss"
      ],
      "explanation": "@forward makes a module's members available to files that @use the index. index.scss acts as a public API: \`@forward 'variables'; @forward 'components';\`. Consumers do \`@use 'path/to/theme'\` and access all forwarded members through the theme namespace. This is the modern SCSS architecture pattern.",
      "docs": null
    }
  },
  {
    "id": "8a90d967-d5ef-48ee-9b55-8657cda159f7",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 14,
    "data": {
      "question": "Which class name follows BEM (Block Element Modifier) naming convention for a disabled submit button inside a form?",
      "choices": [
        "form-submit-button-disabled",
        ".form .submit-button.disabled",
        "form__submit-button--disabled",
        "form_submit_button_disabled"
      ],
      "answer": "2",
      "tags": [
        "css",
        "bem"
      ],
      "explanation": "BEM: Block__Element--Modifier. The block is \`form\`, the element is \`submit-button\` (double underscore separator), and \`disabled\` is the modifier (double hyphen). BEM avoids specificity wars by keeping all selectors at class level (0,1,0 specificity) and making structure self-documenting.",
      "docs": null
    }
  },
  {
    "id": "84b32edf-77ba-448e-a94c-511bdad2a860",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 15,
    "data": {
      "question": "What does \`@layer\` do in CSS and why is it useful?",
      "choices": [
        "Splits the CSS file into lazy-loaded chunks for performance",
        "Creates a new stacking context for z-index management",
        "Enables CSS modules-style scoping of class names",
        "Creates named cascade layers where styles in later layers override earlier ones regardless of specificity — useful for managing third-party vs custom styles"
      ],
      "answer": "3",
      "tags": [
        "css"
      ],
      "explanation": "@layer lets you define cascade layers: \`@layer reset, base, components, utilities\`. Styles in later layers beat earlier ones regardless of selector specificity. This lets you safely import third-party CSS into a 'vendor' layer and override it in your 'components' layer without specificity fights.",
      "docs": null
    }
  },
  {
    "id": "90765299-c0c7-4873-837d-57fc84a82955",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 16,
    "data": {
      "question": "What is the specificity of \`:is(header, main, footer) p\`?",
      "choices": [
        "The specificity of :is() is determined by its most specific argument — here (0,0,1) for the tags + (0,0,1) for p = (0,0,2). Wait — header/main/footer are tags (0,0,1), so :is() contributes (0,0,1) + p (0,0,1) = (0,0,2)",
        "(0,3,1) because :is() counts all its arguments",
        "(0,0,0) — pseudo-classes are never counted",
        "Always (0,1,1) regardless of arguments"
      ],
      "answer": "0",
      "tags": [
        "css",
        "specificity"
      ],
      "explanation": ":is() takes the specificity of its most specific argument. Since header, main, and footer are all tags (0,0,1), :is() contributes (0,0,1). Plus the \`p\` tag selector (0,0,1), total = (0,0,2). If any argument were a class, :is() specificity would be (0,1,0). :where() works the same but always contributes (0,0,0).",
      "docs": null
    }
  },
  {
    "id": "a4f3c75d-ec13-4428-89ea-70c3915e24c9",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 17,
    "data": {
      "question": "What does this CSS grid template do?\n\n\`grid-template-areas: 'header header' 'sidebar main' 'footer footer'\`",
      "choices": [
        "Creates 6 equal-sized grid cells named header, sidebar, main, and footer",
        "Creates a named area layout: full-width header and footer, sidebar on left, main content on right",
        "Only works if child elements have matching id attributes",
        "Overrides all other grid properties and cannot be combined with grid-template-columns"
      ],
      "answer": "1",
      "tags": [
        "css",
        "grid"
      ],
      "explanation": "grid-template-areas defines named regions using quoted strings (one per row, space-separated column assignments). Child elements use \`grid-area: header\` to place themselves. Combined with grid-template-columns (250px for sidebar column, 1fr for main), this creates a classic two-column layout without absolute positioning.",
      "docs": null
    }
  },
  {
    "id": "af855fa4-abe9-4e84-b15c-e4163ca180b4",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 18,
    "data": {
      "question": "What is wrong with this SCSS?\n\n.button {\n  @extend .icon;\n  color: red;\n}\n.icon {\n  display: inline-block;\n}",
      "choices": [
        "@extend cannot be used with class selectors, only with element selectors",
        "@extend must reference a selector defined before the extending rule — or use %placeholder to avoid ordering issues",
        "color: red conflicts with display: inline-block",
        "Nothing is wrong — SCSS resolves @extend in any order"
      ],
      "answer": "1",
      "tags": [
        "scss"
      ],
      "explanation": "Actually Sass does resolve @extend regardless of order in most cases, but the safer and recommended pattern is using placeholder selectors (%icon) to avoid extending real class selectors which can accidentally match unrelated HTML. The real issue is that extending real selectors can produce unexpected selector combinations in the output, especially across files. Use %placeholders for @extend.",
      "docs": null
    }
  },
  {
    "id": "517690a5-23ff-4e14-9f53-49f05174bde2",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 19,
    "data": {
      "question": "How do you provide a fallback value for a CSS custom property that may not be defined?",
      "choices": [
        "Option B: the ?? nullish coalescing operator",
        "Option C: the || logical OR operator",
        "Option A: var(--brand-color, #3b82f6) — the comma syntax provides the fallback",
        "You cannot provide fallbacks for custom properties"
      ],
      "answer": "2",
      "tags": [
        "css",
        "custom-properties"
      ],
      "explanation": "The \`var()\` function accepts a second argument as a fallback: \`var(--property, fallback)\`. The fallback is used when the property is not defined or is invalid. The fallback can itself be another var(): \`var(--primary, var(--accent, blue))\`. JS-style operators (B, C) are not valid CSS.",
      "docs": null
    }
  },
  {
    "id": "e511cbf9-e469-45b6-bf91-a7eff026edca",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "multi",
    "difficulty": "hard",
    "sortOrder": 20,
    "data": {
      "question": "Which of the following are valid reasons to use SCSS over plain CSS? (Select all that apply)",
      "choices": [
        "SCSS compiles to faster CSS that the browser executes quicker",
        "Variables with type safety and scoping via @use",
        "Nesting for visual representation of DOM hierarchy",
        "Mixins for reusable parametric style patterns"
      ],
      "answer": "[1,2,3]",
      "tags": [
        "scss",
        "css"
      ],
      "explanation": "SCSS adds variables, nesting, mixins, functions, and @use/@forward module system — all compile-time features that produce standard CSS. Browsers execute the compiled CSS, not SCSS, so there's no runtime performance difference (option D is false). SCSS improves developer experience, not browser execution.",
      "docs": null
    }
  },
  {
    "id": "9b11f7a7-49d7-40eb-bda1-a88be45be830",
    "moduleId": "1c7b1f6f-4551-4ccc-8a69-293517a6ca8b",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 21,
    "data": {
      "question": "What is the computed color of the \`<p>\` element?\n\n\`\`\`css\np { color: blue; }\n.text { color: green; }\n#content p { color: red; }\n\`\`\`\n\`\`\`html\n<div id=\"content\"><p class=\"text\">Hello</p></div>",
      "choices": [
        "green — .text is more specific than a tag selector",
        "blue — the first rule is applied",
        "The styles conflict and no color is applied",
        "red — #content p has specificity (1,0,1) which beats .text (0,1,0) and p (0,0,1)"
      ],
      "answer": "3",
      "tags": [
        "css",
        "specificity"
      ],
      "explanation": "Specificity: \`p\` = (0,0,1); \`.text\` = (0,1,0); \`#content p\` = (1,0,1). The ID selector in \`#content p\` gives it the highest specificity. Even though \`.text\` is also applicable, the ID-containing selector wins. The computed color is red.",
      "docs": null
    }
  },
  {
    "id": "2ba086bc-03e2-40e3-96be-9ee378814bd0",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 0,
    "data": {
      "question": "Which SOLID principle does this code violate?\n\nclass Report {\n  generate() { /* ... */ }\n  saveToFile() { /* ... */ }\n  sendByEmail() { /* ... */ }\n}",
      "choices": [
        "Single Responsibility Principle — the class has three distinct responsibilities",
        "Open/Closed Principle — the class is not open for extension",
        "Liskov Substitution Principle — subclasses cannot replace this class",
        "Dependency Inversion Principle — it depends on concrete implementations"
      ],
      "answer": "0",
      "tags": [
        "solid"
      ],
      "explanation": "The Single Responsibility Principle states a class should have only one reason to change. Report has three: report logic changes, file system changes, and email sending changes. Split into Report, ReportFileWriter, and ReportEmailSender — each with a single responsibility.",
      "docs": null
    }
  },
  {
    "id": "b30fdfad-b134-4cdd-addd-a046e7479830",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 1,
    "data": {
      "question": "Which SOLID principle does this violation demonstrate?\n\nclass Shape { area() {} }\nclass Circle extends Shape { area() { return Math.PI * r * r; } }\n// New requirement: add Triangle\n// Developer modifies the original Shape.area() switch statement",
      "choices": [
        "Single Responsibility Principle — the function does too many things",
        "Interface Segregation Principle — the interface is too large",
        "Open/Closed Principle — classes should be open for extension but closed for modification",
        "Dependency Inversion Principle — depends on concrete types"
      ],
      "answer": "2",
      "tags": [
        "solid"
      ],
      "explanation": "OCP: software entities should be open for extension but closed for modification. Adding a new shape forces modification of existing code — a clear violation. Fix: each shape implements an \`area()\` method polymorphically. The calculation function calls \`shape.area()\` without knowing the type.",
      "docs": null
    }
  },
  {
    "id": "4fbc955d-0b29-4f20-a62b-52d5e90b6a0d",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 2,
    "data": {
      "question": "Which SOLID principle does this violate?\n\nclass Bird { fly() {} }\nclass Penguin extends Bird {\n  fly() { throw new Error('Penguins cannot fly!'); }\n}",
      "choices": [
        "Single Responsibility Principle — Bird has too many behaviours",
        "Liskov Substitution Principle — a Penguin cannot substitute a Bird without breaking behaviour",
        "Interface Segregation Principle — Bird's interface forces Penguin to implement fly()",
        "Open/Closed Principle — Bird was not designed for extension"
      ],
      "answer": "1",
      "tags": [
        "solid"
      ],
      "explanation": "LSP: objects of a superclass must be replaceable with objects of a subclass without altering correctness. Code expecting a Bird and calling fly() will crash on a Penguin. Fix: create separate interfaces — FlyingBird (with fly()) and SwimmingBird. Penguin implements SwimmingBird only.",
      "docs": null
    }
  },
  {
    "id": "6ba988b8-0ecf-49b8-b523-2c399c4b4a81",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 3,
    "data": {
      "question": "Which SOLID principle does this violate?\n\ninterface Worker {\n  work(): void;\n  eat(): void;\n  sleep(): void;\n}\nclass Robot implements Worker {\n  work() { /* ok */ }\n  eat() { throw new Error('Robots do not eat'); }\n  sleep() { throw new Error('Robots do not sleep'); }\n}",
      "choices": [
        "Single Responsibility Principle — Worker has too many methods",
        "Liskov Substitution Principle — Robot cannot replace Worker",
        "Dependency Inversion Principle — Robot depends on a concrete class",
        "Interface Segregation Principle — clients should not be forced to implement interfaces they don't use"
      ],
      "answer": "3",
      "tags": [
        "solid"
      ],
      "explanation": "ISP: many client-specific interfaces are better than one general-purpose interface. Robot is forced to implement eat() and sleep() which don't apply. Fix: split into Workable (work()), Eatable (eat()), Sleepable (sleep()). Robot only implements Workable. Classes implement only what they need.",
      "docs": null
    }
  },
  {
    "id": "6e8972ba-5eac-4d71-a426-288d5e94991c",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 4,
    "data": {
      "question": "Which SOLID principle does this violate?\n\nclass OrderService {\n  constructor() {\n    this.db = new MySQLDatabase(); // concrete dependency\n  }\n}",
      "choices": [
        "Dependency Inversion Principle — high-level modules should depend on abstractions, not concrete implementations",
        "Single Responsibility Principle — OrderService manages both orders and databases",
        "Open/Closed Principle — MySQLDatabase cannot be replaced without modifying OrderService",
        "Liskov Substitution Principle — MySQLDatabase cannot be substituted"
      ],
      "answer": "0",
      "tags": [
        "solid"
      ],
      "explanation": "DIP: high-level modules (OrderService) should not depend on low-level modules (MySQLDatabase) — both should depend on abstractions. Fix: inject an IDatabase interface via the constructor. \`constructor(db: IDatabase)\`. Now you can swap MySQL for PostgreSQL or a mock without touching OrderService.",
      "docs": null
    }
  },
  {
    "id": "814f0c4a-3b86-4011-ad2a-176cf6fd0431",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 5,
    "data": {
      "question": "What does the DRY principle stand for and what does it prevent?",
      "choices": [
        "Don't Refactor Yet — prevents premature optimization",
        "Don't Repeat Yourself — prevents knowledge duplication that requires updating multiple places when logic changes",
        "Declarative Renders Yield — a React-specific rendering principle",
        "Dynamic Runtime Yield — a Node.js async pattern"
      ],
      "answer": "1",
      "tags": [
        "dry"
      ],
      "explanation": "DRY (Don't Repeat Yourself) means every piece of knowledge should have a single, unambiguous, authoritative representation. Duplicated code means bugs must be fixed in multiple places and often one copy gets missed. Extract shared logic into functions, modules, or components.",
      "docs": null
    }
  },
  {
    "id": "e087b69e-8ef1-4c94-93e6-2d4f25565e22",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 6,
    "data": {
      "question": "What do KISS and YAGNI recommend?",
      "choices": [
        "KISS: keep interfaces stateless; YAGNI: use only verified algorithms",
        "KISS: use class-based components; YAGNI: avoid global state",
        "Both recommend never using third-party libraries",
        "KISS: prefer simple solutions; YAGNI: don't implement features until they're needed"
      ],
      "answer": "3",
      "tags": [
        "kiss",
        "yagni"
      ],
      "explanation": "KISS (Keep It Simple, Stupid) advocates for the simplest solution that works — complexity should only be introduced when necessary. YAGNI (You Ain't Gonna Need It) says don't build features in anticipation of future needs that may never materialise. Over-engineering wastes time and introduces bugs.",
      "docs": null
    }
  },
  {
    "id": "0dc08c3d-641c-4f44-ad0d-43a0f76d85c0",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 7,
    "data": {
      "question": "In Git Flow, which branch receives hotfixes for production bugs?",
      "choices": [
        "Directly committing to main/master",
        "Creating a fix/ branch from develop, then merging to main",
        "A hotfix/xxx branch created from main/master, then merged back into both main and develop",
        "A separate bugfix/ branch that only merges into develop"
      ],
      "answer": "2",
      "tags": [
        "git",
        "git-flow"
      ],
      "explanation": "Git Flow hotfixes branch off main (production state) to isolate the fix, get merged into main (to deploy immediately), and also merged into develop (so the fix isn't lost when the next release happens). This ensures production is patched without disrupting ongoing feature development.",
      "docs": null
    }
  },
  {
    "id": "1d330ec2-343d-43e0-b535-5968d14fae7f",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 8,
    "data": {
      "question": "Which conventional commit message correctly indicates a breaking change that bumps the MAJOR version?",
      "choices": [
        "feat!: remove deprecated login endpoint\n\nBREAKING CHANGE: /api/login is removed",
        "break: remove deprecated login endpoint",
        "feat(breaking): remove deprecated login endpoint",
        "major: remove deprecated login endpoint"
      ],
      "answer": "0",
      "tags": [
        "conventional-commits"
      ],
      "explanation": "Conventional Commits signals breaking changes with either a \`!\` after the type (\`feat!:\`) or a \`BREAKING CHANGE:\` footer (or both). This triggers a MAJOR semver bump. \`break:\` and \`major:\` are not valid conventional commit types. The standard types are: feat, fix, chore, docs, style, refactor, perf, test.",
      "docs": null
    }
  },
  {
    "id": "77c2788e-3855-4981-923c-c8fae5f9a662",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 9,
    "data": {
      "question": "When should you use \`git rebase\` instead of \`git merge\`?",
      "choices": [
        "When merging into main/master — rebase is safer than merge for production branches",
        "Rebase should always be used instead of merge — merge commits are bad practice",
        "Only when there are merge conflicts — rebase resolves them automatically",
        "To maintain a linear commit history when integrating feature branches — rebase replays commits on top of the target branch"
      ],
      "answer": "3",
      "tags": [
        "git"
      ],
      "explanation": "Rebase rewrites commit history for a linear log (no merge commits). Use it to update a feature branch with main's latest changes before merging. Never rebase shared branches (main, develop) as it rewrites history others depend on. Use merge for integrating completed features into shared branches to preserve history.",
      "docs": null
    }
  },
  {
    "id": "0ca7c348-e607-44ec-8b7c-7403b336bbf8",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 10,
    "data": {
      "question": "Given semver version 2.4.1, which part changes for each scenario? A) Security patch B) New backward-compatible feature C) Breaking API change",
      "choices": [
        "A: MINOR (2.5.1), B: PATCH (2.4.2), C: MAJOR (3.0.0)",
        "A: PATCH (2.4.2), B: MINOR (2.5.0), C: MAJOR (3.0.0)",
        "A: PATCH (2.4.2), B: MAJOR (3.0.0), C: MINOR (2.5.0)",
        "All three increment PATCH — other segments only change on major releases"
      ],
      "answer": "1",
      "tags": [
        "semver"
      ],
      "explanation": "Semantic Versioning (MAJOR.MINOR.PATCH): PATCH for backward-compatible bug fixes (2.4.1→2.4.2), MINOR for backward-compatible new features (2.4.1→2.5.0, resets PATCH), MAJOR for breaking changes (2.4.1→3.0.0, resets MINOR and PATCH). Systems using \`^2.4.1\` will accept PATCH/MINOR but not MAJOR bumps.",
      "docs": null
    }
  },
  {
    "id": "f18a3b14-4837-430e-a309-b0bc62959534",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 11,
    "data": {
      "question": "What is the typical order of stages in a CI/CD pipeline?",
      "choices": [
        "Install → Lint → Test → Build → Deploy",
        "Build → Test → Lint → Install → Deploy",
        "Deploy → Test → Build → Lint → Install",
        "Test → Lint → Install → Build → Deploy"
      ],
      "answer": "0",
      "tags": [
        "ci-cd"
      ],
      "explanation": "Install dependencies first, then lint (fail fast on code style), then test (catch logic errors), then build (compile the artifact), then deploy. Putting lint and test before build means you don't waste build time on code that already fails quality checks. Fast-fail stages are always ordered first.",
      "docs": null
    }
  },
  {
    "id": "36e91f09-8b9d-44bd-907d-4994b3ab0aea",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 12,
    "data": {
      "question": "What is the purpose of pre-commit hooks?",
      "choices": [
        "Push code to the remote repository after committing",
        "Authenticate the developer with the git server before committing",
        "Run automated checks (lint, format, tests) before a commit is created — block the commit if checks fail",
        "Generate a changelog based on commit messages"
      ],
      "answer": "2",
      "tags": [
        "git"
      ],
      "explanation": "Pre-commit hooks run scripts before git records a commit. Common uses: lint-staged (lint only changed files), Prettier formatting, type checking. If the hook exits with a non-zero code, the commit is aborted. Tools like Husky make it easy to manage hooks across a team.",
      "docs": null
    }
  },
  {
    "id": "a68adb6c-da8d-43d7-90b3-654ea4d116e5",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 13,
    "data": {
      "question": "This code violates DRY. What is the best fix?\n\nfunction getAdminUsers() {\n  return users.filter(u => u.role === 'admin' && u.active);\n}\nfunction getEditorUsers() {\n  return users.filter(u => u.role === 'editor' && u.active);\n}",
      "choices": [
        "Copy the filter logic into every place you need it — DRY only applies to classes",
        "Use a global variable for the active filter",
        "Extract a generic \`getUsersByRole(role)\` function that handles the shared \`u.active\` logic",
        "Replace both functions with a single function that takes a boolean"
      ],
      "answer": "2",
      "tags": [
        "clean-code",
        "dry"
      ],
      "explanation": "The \`u.active\` filter condition and the overall structure are duplicated. Create \`getUsersByRole(role) { return users.filter(u => u.role === role && u.active); }\`. The specific functions can call this: \`getAdminUsers = () => getUsersByRole('admin')\`. Any change to the active logic only needs to happen once.",
      "docs": null
    }
  },
  {
    "id": "fe8173e2-ce2f-4e35-9b6d-896d88ffcdec",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 14,
    "data": {
      "question": "In Git Flow, what is the purpose of a \`release/\` branch?",
      "choices": [
        "A branch that automatically deploys to production when pushed",
        "A long-lived branch that contains only production-ready commits",
        "A branch used to revert production incidents",
        "A stabilization branch cut from develop for final testing and bug fixes before merging into main"
      ],
      "answer": "3",
      "tags": [
        "git",
        "git-flow"
      ],
      "explanation": "A release branch is created from develop when the release candidate is ready. Only bug fixes, documentation, and version bumps are committed here (no new features). When stable, it merges into main (tag) and back into develop. This isolates release prep from ongoing feature development.",
      "docs": null
    }
  },
  {
    "id": "60a5c87d-ed28-42be-8cf2-d058d9e78480",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 15,
    "data": {
      "question": "What is 'cyclomatic complexity' and why should you keep it low?",
      "choices": [
        "A measure of the number of independent paths through code — high complexity means more test cases needed and harder maintenance",
        "The number of dependencies a module imports",
        "The time complexity (Big-O) of an algorithm",
        "The depth of component nesting in a React tree"
      ],
      "answer": "0",
      "tags": [
        "clean-code"
      ],
      "explanation": "Cyclomatic complexity counts independent code paths (incremented by each if, else, switch case, for, while, &&, ||, ternary). High complexity (>10) means the function is hard to test and understand. Reduce it by extracting helper functions, using early returns, and applying the strategy pattern for complex conditionals.",
      "docs": null
    }
  },
  {
    "id": "e9954632-4578-46ba-a5ab-b8a0bca0374c",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 16,
    "data": {
      "question": "What conventional commit type should be used for a change that updates tests only (no production code change)?",
      "choices": [
        "fix: add unit tests for AuthService",
        "test: add unit tests for AuthService",
        "feat: add unit tests for AuthService",
        "chore: add unit tests for AuthService"
      ],
      "answer": "1",
      "tags": [
        "conventional-commits"
      ],
      "explanation": "The \`test:\` type is specifically for adding or updating tests without changing production code. \`fix:\` implies a bug was fixed, \`feat:\` implies a new feature was added. \`chore:\` is for maintenance tasks that don't affect production code (e.g., updating build tools, .gitignore). Using the correct type is important for automated changelog generation.",
      "docs": null
    }
  },
  {
    "id": "5edd2b63-cdd1-4859-ae48-300edb556dda",
    "moduleId": "b06787b2-3a37-4847-bdae-705b2e082c83",
    "type": "multi",
    "difficulty": "hard",
    "sortOrder": 17,
    "data": {
      "question": "Which of the following are benefits of trunk-based development over long-lived feature branches? (Select all that apply)",
      "choices": [
        "Makes CI pipelines run less often",
        "Reduces merge conflicts by integrating small changes frequently",
        "Enables faster feedback loops — issues are caught when the diff is small",
        "Feature flags allow incomplete features to be merged without exposing them to users"
      ],
      "answer": "[1,2,3]",
      "tags": [
        "ci-cd",
        "git"
      ],
      "explanation": "Trunk-based development means committing frequently to main/trunk (or short-lived branches merged daily). Benefits: fewer merge conflicts (smaller diffs), faster CI feedback, and feature flags enable safe partial merges. It does NOT reduce CI runs — it increases them, which is a feature (more frequent validation), not a drawback.",
      "docs": null
    }
  },
  {
    "id": "e82c9b2f-7870-4f0a-9845-0ef78ea4406c",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 0,
    "data": {
      "question": "Which architecture pattern does this folder structure implement?",
      "choices": [
        "Feature-Sliced Design",
        "MVC (Model-View-Controller)",
        "Clean Architecture",
        "Hexagonal Architecture"
      ],
      "answer": "1",
      "tags": [
        "mvc"
      ],
      "explanation": "MVC organizes code by technical role: Models (data & business logic), Views (presentation), Controllers (handle requests, coordinate M and V). The dependency rule: Controllers call Models and Views. Views never call Controllers directly. This is a classic pattern for server-rendered web apps.",
      "docs": null
    }
  },
  {
    "id": "ea46c7b3-27dc-448b-ba82-b58a59e5fec7",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 1,
    "data": {
      "question": "Which architecture pattern does this folder structure implement?",
      "choices": [
        "Domain-Driven Design",
        "MVC (Model-View-Controller)",
        "Clean Architecture",
        "Hexagonal Architecture"
      ],
      "answer": "2",
      "tags": [
        "clean-architecture"
      ],
      "explanation": "Clean Architecture (Robert C. Martin) arranges code in concentric circles: Entities (innermost, pure business rules) → Use Cases (application rules) → Interface Adapters (controllers, repositories) → Frameworks/Drivers (DB, HTTP). The Dependency Rule: code only points inward. Inner layers are framework-independent.",
      "docs": null
    }
  },
  {
    "id": "975f6b58-fd50-48db-a7c9-cd3a2434564d",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 2,
    "data": {
      "question": "Which architecture pattern does this folder structure implement?",
      "choices": [
        "Domain-Driven Design",
        "Clean Architecture",
        "Micro-frontend architecture",
        "Feature-Sliced Design"
      ],
      "answer": "3",
      "tags": [
        "feature-sliced"
      ],
      "explanation": "Feature-Sliced Design (FSD) organizes frontend code in horizontal layers (app > pages > widgets > features > entities > shared) with vertical slices per domain inside each layer. The dependency rule: higher layers can import from lower layers but not vice versa. Features are isolated and recomposed at higher layers.",
      "docs": null
    }
  },
  {
    "id": "a52b67d0-e9f6-4af5-b8c2-31348b92f4b0",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 3,
    "data": {
      "question": "Which architecture pattern does this folder structure implement?",
      "choices": [
        "Hexagonal Architecture (Ports & Adapters)",
        "Clean Architecture",
        "CQRS",
        "Microservices"
      ],
      "answer": "0",
      "tags": [
        "hexagonal"
      ],
      "explanation": "Hexagonal Architecture (Alistair Cockburn) puts the application core in a hexagon. Ports are interfaces the core defines for external communication. Primary adapters drive the app (HTTP, CLI). Secondary adapters are driven by the app (DB, email, queues). The core never depends on adapters — only on its port interfaces.",
      "docs": null
    }
  },
  {
    "id": "68899c20-ebfb-4e5b-9172-74985b2e0e96",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 4,
    "data": {
      "question": "Which architecture pattern does this folder structure implement?",
      "choices": [
        "Microservices",
        "Feature-Sliced Design",
        "Domain-Driven Design (DDD)",
        "Clean Architecture"
      ],
      "answer": "2",
      "tags": [
        "ddd"
      ],
      "explanation": "DDD organizes code around business domains (bounded contexts). Each context has its own domain model, application layer, and infrastructure. The same concept (e.g., 'Product') may have different models in Ordering vs Inventory contexts. Contexts communicate via domain events or an anti-corruption layer.",
      "docs": null
    }
  },
  {
    "id": "0340515c-06b0-4551-ab33-944362e3fbfc",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 5,
    "data": {
      "question": "In Clean Architecture, which dependency direction is correct?",
      "choices": [
        "Entities → Use Cases → Adapters → Infrastructure (inner rings know about outer rings)",
        "Infrastructure → Adapters → Use Cases → Entities (code points inward only)",
        "All layers can freely import from any other layer",
        "Use Cases → Entities → Adapters → Infrastructure"
      ],
      "answer": "1",
      "tags": [
        "clean-architecture"
      ],
      "explanation": "The Dependency Rule: source code dependencies must always point inward toward Entities. Infrastructure (frameworks) depends on Adapters; Adapters depend on Use Cases; Use Cases depend on Entities. Entities know nothing about the outside world. This makes the business logic framework-independent and testable.",
      "docs": null
    }
  },
  {
    "id": "5755866f-9465-4f2c-a4ea-a80d376ee920",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 6,
    "data": {
      "question": "What does CQRS stand for and what problem does it solve?",
      "choices": [
        "Cached Query Response System — caches database queries for performance",
        "Component Query Resolution Strategy — a React data-fetching pattern",
        "Client Queue Request Synchronization — for real-time updates",
        "Command Query Responsibility Segregation — separates read and write models for independent scaling and optimization"
      ],
      "answer": "3",
      "tags": [
        "cqrs"
      ],
      "explanation": "CQRS separates the write model (Commands — change state) from the read model (Queries — return data). Read models can be denormalized and optimized for query performance; write models enforce business invariants. This enables independent scaling of reads and writes and is commonly paired with Event Sourcing.",
      "docs": null
    }
  },
  {
    "id": "800f5c0e-10cf-4106-afb2-3cad0a703ecb",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 7,
    "data": {
      "question": "What is a key trade-off of microservices compared to a monolith?",
      "choices": [
        "Microservices enable independent deployment and scaling per service but add operational complexity (distributed tracing, network latency, eventual consistency)",
        "Microservices are always faster than monoliths because services run in parallel",
        "Microservices eliminate the need for a database",
        "Monoliths cannot scale horizontally; microservices automatically scale"
      ],
      "answer": "0",
      "tags": [
        "microservices"
      ],
      "explanation": "Microservices decouple teams and deployments — each service can be deployed, scaled, and rewritten independently. The cost: distributed systems complexity — inter-service communication, distributed tracing, eventual consistency, network partitions, and the overhead of multiple deployment pipelines. Only adopt microservices when the team/product size justifies it.",
      "docs": null
    }
  },
  {
    "id": "88661f19-138f-4f8f-a7c2-26eb9b6129f6",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 8,
    "data": {
      "question": "What are the main benefits of a monorepo architecture?",
      "choices": [
        "Each project gets its own git history and can be versioned independently",
        "Atomic commits across projects, shared tooling, easy code sharing between packages, and unified CI/CD with affected graph analysis",
        "Monorepos are smaller in size because code is shared",
        "Eliminates the need for package managers — all code is in one file"
      ],
      "answer": "1",
      "tags": [
        "monorepo"
      ],
      "explanation": "Monorepos (like Nx, Turborepo) keep all projects in one repository. Benefits: atomic cross-project changes, shared ESLint/TypeScript configs, easy refactoring across packages, and affected-graph-based CI (only test/build what changed). The trade-off is larger repo size and more complex tooling.",
      "docs": null
    }
  },
  {
    "id": "92e845d0-0ffe-4a3a-b877-bedf2446552d",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 9,
    "data": {
      "question": "In an event-driven (pub/sub) architecture, what is the role of the event broker?",
      "choices": [
        "Validates business rules before events are published",
        "Transforms synchronous HTTP requests into asynchronous events",
        "Stores the application state and broadcasts it to all connected clients",
        "Decouples publishers from subscribers — producers emit events without knowing who consumes them; the broker routes events to interested consumers"
      ],
      "answer": "3",
      "tags": [
        "event-driven"
      ],
      "explanation": "An event broker (Kafka, RabbitMQ, SNS) decouples producers and consumers. Producers publish events to topics/queues without knowing about consumers. Consumers subscribe to topics they care about. This enables loose coupling, independent scaling, and the ability to add consumers without modifying producers.",
      "docs": null
    }
  },
  {
    "id": "fae27215-527b-4fab-831d-98ec697d6ed9",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 10,
    "data": {
      "question": "What is the key characteristic of MVVM (Model-View-ViewModel)?",
      "choices": [
        "The ViewModel is a controller that handles HTTP requests",
        "MVVM requires the View and Model to be in the same file",
        "The ViewModel exposes data streams/observables the View binds to automatically — no direct View→Model calls",
        "The ViewModel is identical to the Controller in MVC"
      ],
      "answer": "2",
      "tags": [
        "mvvm"
      ],
      "explanation": "In MVVM, the ViewModel is an abstraction of the View that exposes observable properties and commands. The View binds to the ViewModel (data binding) and never directly manipulates the Model. This makes Views thin, testable, and framework-agnostic. Common in Angular (reactive forms), WPF, and SwiftUI.",
      "docs": null
    }
  },
  {
    "id": "5a5597bb-f8e2-4b0e-b215-0d4543327aa4",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 11,
    "data": {
      "question": "When is a monolith the better architectural choice over microservices?",
      "choices": [
        "When the team is small, the domain is not fully understood yet, or when operational complexity outweighs the deployment flexibility benefits",
        "When the application handles more than 1000 requests per second",
        "When using React for the frontend — React apps require monolithic backends",
        "Monoliths are always the wrong choice for production applications"
      ],
      "answer": "0",
      "tags": [
        "microservices",
        "architecture"
      ],
      "explanation": "Start with a monolith (the 'Majestic Monolith'). Microservices require significant DevOps investment, domain expertise to define service boundaries, and distributed systems knowledge. If boundaries are wrong, the cost of refactoring across services is enormous. Extract services only when a specific service needs independent scaling or team autonomy.",
      "docs": null
    }
  },
  {
    "id": "32afc38a-5e3a-4629-8f0f-bb8f6d05f937",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 12,
    "data": {
      "question": "What is Event Sourcing and how does it relate to CQRS?",
      "choices": [
        "Event Sourcing is a pub/sub messaging pattern; CQRS is a database optimization",
        "Both are identical patterns with different names",
        "Event Sourcing replaces the need for CQRS",
        "Event Sourcing stores all changes as a sequence of events (the log IS the source of truth); CQRS reads from projections built from those events"
      ],
      "answer": "3",
      "tags": [
        "cqrs",
        "event-driven"
      ],
      "explanation": "In Event Sourcing, you never update records — you append immutable events (UserCreated, OrderPlaced). Current state is derived by replaying events. CQRS pairs naturally: the write side appends events; the read side maintains denormalized projections (read models) built by processing the event stream. You get full audit history for free.",
      "docs": null
    }
  },
  {
    "id": "c91659d8-d044-449e-845e-9da12075906c",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 13,
    "data": {
      "question": "What is the 'Dependency Rule' and which architectures enforce it?",
      "choices": [
        "Dependencies must be declared at the top of every file",
        "Source code dependencies must point inward — from infrastructure toward business logic; enforced by Clean Architecture and Hexagonal Architecture",
        "Third-party dependencies must be abstracted behind interfaces only in microservices",
        "The rule that no circular imports are allowed in any module system"
      ],
      "answer": "1",
      "tags": [
        "architecture"
      ],
      "explanation": "The Dependency Rule (from Clean Architecture) states that code dependencies must always point toward higher-level policies (business rules). Infrastructure depends on interfaces defined by the business logic — never the reverse. This makes business logic testable without spinning up a database or HTTP server.",
      "docs": null
    }
  },
  {
    "id": "a0a27a3b-b4eb-41eb-937b-b59206e4723b",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 14,
    "data": {
      "question": "In Feature-Sliced Design, can a \`features/auth\` module import from \`features/cart\`?",
      "choices": [
        "No — features in the same layer cannot import from each other; shared logic goes in \`entities/\` or \`shared/\`",
        "Yes — any feature can import from any other feature",
        "Yes — but only if using a barrel (index.ts) export",
        "No — features can only import from \`app/\` and \`pages/\`"
      ],
      "answer": "0",
      "tags": [
        "feature-sliced"
      ],
      "explanation": "FSD's key constraint: modules within the same layer cannot import from each other. This prevents circular dependencies and keeps features isolated. If auth and cart need shared logic, it belongs in \`entities/\` or \`shared/\`. Cross-slice imports are only allowed downward (higher layer imports from lower layer).",
      "docs": null
    }
  },
  {
    "id": "686a1e68-363e-472f-b96b-193bcf73cb5a",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "multi",
    "difficulty": "hard",
    "sortOrder": 15,
    "data": {
      "question": "Which of the following are valid reasons to choose a monorepo? (Select all that apply)",
      "choices": [
        "Each repo can have independent git history and branch strategies",
        "Atomic commits that span multiple packages (e.g., updating a shared lib and all consumers simultaneously)",
        "Eliminating the need for versioning internal packages — consumers always use the latest source",
        "Unified lint, TypeScript, and test configurations across all projects"
      ],
      "answer": "[1,2,3]",
      "tags": [
        "architecture",
        "monorepo"
      ],
      "explanation": "Monorepos enable atomic cross-package commits, eliminate internal versioning friction, and share tooling configuration. Option C describes polyrepo benefits (independent git history) — that's actually the trade-off you give up with a monorepo. In a monorepo all projects share one git history.",
      "docs": null
    }
  },
  {
    "id": "633ba0c3-76f5-4e6e-849a-4b30c27fb124",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 16,
    "data": {
      "question": "What does 'separation of concerns' mean in software architecture?",
      "choices": [
        "Splitting a system into microservices so each team owns a service",
        "Using separate files for CSS and JavaScript",
        "Dividing a system into distinct sections where each section addresses a specific concern — data, presentation, business logic are handled independently",
        "A security principle that limits data access per role"
      ],
      "answer": "2",
      "tags": [
        "architecture"
      ],
      "explanation": "Separation of concerns (SoC) is a design principle for separating a program into distinct sections, where each section addresses a separate concern. A concern is any aspect of the software: persistence, rendering, validation, authentication. SoC reduces coupling, enables parallel development, and improves testability.",
      "docs": null
    }
  },
  {
    "id": "70e78877-8835-41f5-8fbe-fe6b5480f7c2",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 17,
    "data": {
      "question": "In Hexagonal Architecture, what is an 'anti-corruption layer' used for?",
      "choices": [
        "Validates all incoming HTTP requests for security vulnerabilities",
        "Encrypts data at the infrastructure boundary",
        "Translates between an external model (third-party API, legacy system) and your domain model to prevent external concepts from leaking in",
        "Prevents circular dependencies between adapters"
      ],
      "answer": "2",
      "tags": [
        "hexagonal",
        "ddd"
      ],
      "explanation": "An Anti-Corruption Layer (ACL, from DDD) is a translation layer between your bounded context and an external system. Without it, external models (different terminology, structure) would 'corrupt' your clean domain model. The ACL maps external DTOs to your domain objects, keeping your core pristine.",
      "docs": null
    }
  },
  {
    "id": "ed3282c6-ed4c-4045-ada1-01f6cf2a669f",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 18,
    "data": {
      "question": "What is the 'strangler fig' pattern in the context of migration?",
      "choices": [
        "Immediately rewriting the entire application as microservices in one go",
        "Gradually removing deprecated API endpoints until only modern ones remain",
        "A pattern for strangling database connections to prevent overload",
        "Incrementally replacing a monolith by routing features to new microservices while the old system handles the rest — until the monolith is fully replaced"
      ],
      "answer": "3",
      "tags": [
        "microservices"
      ],
      "explanation": "The Strangler Fig pattern (Martin Fowler) incrementally migrates from a legacy system. New functionality is built as separate services; old functionality is routed to new services as they're ready. The legacy system shrinks (gets 'strangled') while the new system grows. This avoids risky big-bang rewrites.",
      "docs": null
    }
  },
  {
    "id": "6ef153ef-dff1-462e-8a84-e79a3af0b97f",
    "moduleId": "16aa695b-1eeb-4722-9b6a-44a40c43ea3d",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 19,
    "data": {
      "question": "What makes business logic 'framework-agnostic' and why is it important?",
      "choices": [
        "Business rules are expressed in plain language constructs (classes, functions) with no imports from frameworks like Express or React — enabling testing without framework overhead",
        "Business logic runs in the browser without a bundler",
        "Framework-agnostic means using vanilla JS with no libraries at all",
        "It means business logic is deployed as serverless functions"
      ],
      "answer": "0",
      "tags": [
        "architecture",
        "clean-architecture"
      ],
      "explanation": "When business logic has no framework imports, you can unit test it with no setup — just call functions. Frameworks change; business rules are more stable. Clean and Hexagonal architectures achieve this by having the core depend only on abstractions (interfaces), with framework-specific adapters in outer layers.",
      "docs": null
    }
  },
  {
    "id": "fa59cf1e-5c4b-4360-afb6-afd4160287b2",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 0,
    "data": {
      "question": "What is the time complexity of this function?",
      "choices": [
        "O(n) — each element is visited once",
        "O(n²) — nested loops each iterating up to n elements",
        "O(log n) — inner loop starts at i+1 so it's logarithmic",
        "O(n log n) — similar to sorting algorithms"
      ],
      "answer": "1",
      "tags": [
        "big-o"
      ],
      "explanation": "Two nested loops over an array of n elements gives O(n²). Even though the inner loop starts at i+1, in the worst case (no duplicates) it's still n*(n-1)/2 comparisons which simplifies to O(n²). An O(n) solution uses a Set: \`return arr.length !== new Set(arr).size\`.",
      "docs": null
    }
  },
  {
    "id": "4ad28520-c9e7-4d80-9bd7-9f965b6a2f6c",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 1,
    "data": {
      "question": "What does this code log?",
      "choices": [
        "0, 1, 2 — each callback captures its own i",
        "3, 3, 3 — var is function-scoped; by the time callbacks run, i is 3",
        "0, 1, 2 printed after 0ms delay",
        "An error — arrow functions cannot close over var"
      ],
      "answer": "1",
      "tags": [
        "closures",
        "output-prediction"
      ],
      "explanation": "With \`var\`, there is a single \`i\` variable shared by all closures. The loop completes (i=3) before any setTimeout callback runs. All three callbacks close over the same \`i\`, which is now 3. Fix: use \`let\` (block-scoped, new \`i\` per iteration) or \`setTimeout(console.log.bind(null, i), 0)\`.",
      "docs": null
    }
  },
  {
    "id": "7069e588-ce05-4aec-abf6-69d3c723b3d5",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 2,
    "data": {
      "question": "What does this log?",
      "choices": [
        "undefined — arrow functions have no \`this\`",
        "An error — \`this\` cannot be used inside nested functions",
        "'Alice' — arrow functions capture \`this\` from the enclosing lexical scope (greet's \`this\`)",
        "The global object's name property"
      ],
      "answer": "2",
      "tags": [
        "this"
      ],
      "explanation": "Arrow functions do not have their own \`this\` — they inherit it from the enclosing lexical context. When \`greet\` is called as \`obj.greet()\`, \`this\` inside greet is \`obj\`. The inner arrow function captures that \`this\`, so \`this.name\` is 'Alice'. Regular functions would have \`this = undefined\` in strict mode.",
      "docs": null
    }
  },
  {
    "id": "b2eb4155-346a-4c04-bcb7-87c95e8d3a83",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 3,
    "data": {
      "question": "What is the output order?",
      "choices": [
        "A, B, C — Promises resolve immediately",
        "B, A, C — Promises are prioritized",
        "The order is non-deterministic",
        "A, C, B — sync code runs first; promise microtask runs after current sync code completes"
      ],
      "answer": "3",
      "tags": [
        "promises",
        "output-prediction"
      ],
      "explanation": "JavaScript has a single thread with an event loop. Synchronous code runs first: A, then C. Promise .then() callbacks are microtasks — they run after the current synchronous task completes but before the next macrotask (setTimeout). So B runs after C. Order: A → C → B.",
      "docs": null
    }
  },
  {
    "id": "c3fc2a3a-4f8e-4216-bb7d-d9e7850c2587",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 4,
    "data": {
      "question": "What is the output order?",
      "choices": [
        "start, end, promise, timeout — sync first, then microtasks (promise), then macrotasks (setTimeout)",
        "start, timeout, promise, end",
        "start, promise, end, timeout",
        "start, end, timeout, promise"
      ],
      "answer": "0",
      "tags": [
        "async",
        "output-prediction"
      ],
      "explanation": "Execution order: (1) synchronous: 'start', 'end'; (2) microtask queue: 'promise' (.then callbacks); (3) macrotask queue: 'timeout' (setTimeout). Microtasks always drain before the next macrotask. This is the critical event loop distinction — Promise callbacks always run before setTimeout(fn, 0).",
      "docs": null
    }
  },
  {
    "id": "feb63fb6-c20e-4e9f-96d0-f530c75c40c5",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 5,
    "data": {
      "question": "What is the output of \`[] + []\` and \`[] + {}\`?",
      "choices": [
        "0 and NaN",
        "[] and {}",
        "\"\" and \"[object Object]\" — arrays convert to empty strings; {} converts to \"[object Object]\"",
        "null and undefined"
      ],
      "answer": "2",
      "tags": [
        "coercion"
      ],
      "explanation": "The \`+\` operator with objects triggers string coercion. An empty array [].toString() = ''. An object {}.toString() = '[object Object]'. So [] + [] = '' + '' = ''. [] + {} = '' + '[object Object]' = '[object Object]'. This is a classic JS coercion trap.",
      "docs": null
    }
  },
  {
    "id": "ec596b0f-6dd5-4111-a36f-5c0bddc58028",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 6,
    "data": {
      "question": "What does \`null == undefined\` return and why?",
      "choices": [
        "false — they are different types",
        "true — the abstract equality operator (==) considers null and undefined equal to each other (and only to each other)",
        "true — both are falsy so they are equal",
        "A ReferenceError — undefined is not defined"
      ],
      "answer": "1",
      "tags": [
        "coercion"
      ],
      "explanation": "The == operator with null only returns true when compared to null or undefined — not to 0, false, or empty string. \`null == undefined\` is true; \`null == 0\` is false. Use === (strict equality) to avoid coercion surprises. \`null === undefined\` is false — different types.",
      "docs": null
    }
  },
  {
    "id": "9cff4967-2a33-411e-a1f6-91bd6b765f96",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 7,
    "data": {
      "question": "What is the bug in this code — the error is never caught:\n\nasync function fetchData() {\n  try {\n    const data = fetch('/api/data')\n      .then(r => r.json());\n    return data;\n  } catch (e) {\n    console.error(e);\n  }\n}",
      "choices": [
        "fetch() is not a valid function in Node.js",
        "r.json() should be inside a separate try/catch",
        "The function should not be async since it uses .then()",
        "fetch() is not awaited — the Promise is returned before it rejects; try/catch cannot catch asynchronous rejections without await"
      ],
      "answer": "3",
      "tags": [
        "async",
        "debugging"
      ],
      "explanation": "Without \`await\`, the Promise is not resolved in the try block — it's just created and returned. If it rejects, the rejection is unhandled (the try/catch has already exited). Fix: \`const data = await fetch('/api/data').then(r => r.json())\`. Or use .catch() on the promise chain.",
      "docs": null
    }
  },
  {
    "id": "45306933-29a1-484a-9cb1-e06f7749b0dd",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 8,
    "data": {
      "question": "What does this React code log after 3 seconds if the button is clicked once?",
      "choices": [
        "0 — stale closure: the timeout captures count=0 from mount; button clicks update state but the old closure doesn't see it",
        "1 — React updates the closure automatically",
        "undefined — count is not in scope inside setTimeout",
        "An error — setTimeout cannot access React state"
      ],
      "answer": "0",
      "tags": [
        "output-prediction",
        "closures"
      ],
      "explanation": "The useEffect runs once on mount (empty deps). The setTimeout captures \`count\` from that render — it's 0. Even if the button is clicked (state updates, re-renders), the setTimeout closure still holds count=0. This is the classic stale closure problem. Fix: use a ref to always read the latest count.",
      "docs": null
    }
  },
  {
    "id": "0755131c-aa11-46b7-9140-8c27ac02d534",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 9,
    "data": {
      "question": "What is wrong with this reduce call?\n\nconst sum = [1, 2, 3].reduce((acc, val) => {\n  acc + val;\n});",
      "choices": [
        "reduce requires an initial value as the second argument",
        "The callback doesn't return a value — it computes acc + val but doesn't return it; sum will be undefined",
        "acc + val should use += instead",
        "The array must have more than 3 elements for reduce to work"
      ],
      "answer": "1",
      "tags": [
        "algorithms"
      ],
      "explanation": "The callback uses curly braces \`{}\` without a return statement. Without explicit return, the function returns undefined. On the next iteration, acc is undefined, and \`undefined + 2 = NaN\`. Fix: use implicit return with parens \`(acc, val) => acc + val\` or add \`return acc + val;\`. An initial value \`0\` is also good practice.",
      "docs": null
    }
  },
  {
    "id": "692a8240-77fb-461c-80ed-03194bc30ed3",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 10,
    "data": {
      "question": "What is the difference between \`null\` and \`undefined\` in JavaScript?",
      "choices": [
        "They are identical — both mean 'no value'",
        "null is a primitive; undefined is an object",
        "undefined can only appear in function arguments; null is for object properties",
        "undefined is the default value of uninitialized variables and missing properties; null is an explicit intentional absence of value"
      ],
      "answer": "3",
      "tags": [
        "this"
      ],
      "explanation": "undefined is what JavaScript assigns automatically to uninitialized variables, missing function arguments, and missing object properties. null is explicitly assigned by developers to signal 'no value here'. In strict equality: \`null === null\` ✓, \`undefined === undefined\` ✓, \`null === undefined\` ✗. \`typeof null === 'object'\` is a historical bug.",
      "docs": null
    }
  },
  {
    "id": "1e457a57-3076-4a1a-bdd3-5fd9e404ce62",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 11,
    "data": {
      "question": "What does this prototype chain code log?",
      "choices": [
        "'Rex speaks' and true — methods are copied to each instance",
        "Error — prototype methods are not accessible on instances",
        "'Rex speaks' and false — speak is on Animal.prototype, not dog's own properties",
        "'Rex speaks' and true — hasOwnProperty checks the prototype chain"
      ],
      "answer": "2",
      "tags": [
        "output-prediction"
      ],
      "explanation": "When you call \`dog.speak()\`, JS looks up \`speak\` on dog (not found), then on \`dog.__proto__\` (Animal.prototype) where it finds it. \`hasOwnProperty('speak')\` returns false because \`speak\` is on the prototype, not dog itself. \`hasOwnProperty\` does NOT traverse the prototype chain — it only checks own properties.",
      "docs": null
    }
  },
  {
    "id": "ad45c030-eeed-42ab-995d-3eef69998049",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 12,
    "data": {
      "question": "What is the time complexity of looking up a key in a JavaScript object/Map?",
      "choices": [
        "O(1) average — hash map lookup is constant time",
        "O(n) — must scan all keys to find a match",
        "O(log n) — objects use a binary search tree internally",
        "O(n²) — nested object structures always have quadratic lookup"
      ],
      "answer": "0",
      "tags": [
        "big-o"
      ],
      "explanation": "JavaScript objects and Maps are implemented as hash maps. Key lookup averages O(1) — the key is hashed, the bucket is found directly. Worst case (many hash collisions) is O(n) but this is extremely rare in practice. This makes objects ideal for caching (memoization) lookups.",
      "docs": null
    }
  },
  {
    "id": "25e64277-3aa2-4b93-8e93-400f21b5a2b4",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 13,
    "data": {
      "question": "What is the difference between debounce and throttle?",
      "choices": [
        "Throttle delays execution; debounce limits to once per interval",
        "They are identical — debounce is just an alias for throttle",
        "Debounce is for async functions; throttle is for synchronous ones",
        "Debounce delays execution until after a quiet period (no calls); throttle guarantees execution at most once per interval regardless of call frequency"
      ],
      "answer": "3",
      "tags": [
        "async"
      ],
      "explanation": "Debounce: resets a timer on each call; executes only after calls stop for N ms. Perfect for search inputs (fire only after user stops typing). Throttle: executes at most once per N ms regardless of call frequency. Perfect for scroll events (process at regular intervals, not every pixel). Both prevent excessive function calls.",
      "docs": null
    }
  },
  {
    "id": "fbd51bca-379d-44d4-850d-0bab78883f18",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 14,
    "data": {
      "question": "What does \`+'3' + 3\` evaluate to?",
      "choices": [
        "'33' — string concatenation",
        "6 — unary + converts '3' to number 3; then 3 + 3 = 6",
        "NaN",
        "An error — you cannot add a string to a number"
      ],
      "answer": "1",
      "tags": [
        "output-prediction",
        "coercion"
      ],
      "explanation": "The unary \`+\` operator converts its operand to a number: \`+'3'\` = 3. Then \`3 + 3\` = 6 (both are numbers). Contrast with \`'3' + 3\` (no unary +) = '33' (string concatenation because the left operand is a string). Understanding operator precedence and type coercion is key.",
      "docs": null
    }
  },
  {
    "id": "4ff7f233-c13d-4e65-a986-ea14a9ccebf0",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 15,
    "data": {
      "question": "What is the output of this Promise chain?",
      "choices": [
        "catch: oops, final — the throw is caught; the chain continues after catch",
        "catch: oops — execution stops at catch",
        "then: 2, final — errors are ignored",
        "An unhandled rejection error"
      ],
      "answer": "0",
      "tags": [
        "async",
        "promises"
      ],
      "explanation": "The throw in the second .then() causes the chain to skip to the nearest .catch(). After .catch() handles the error, the chain continues normally — .then() after a .catch() runs if the catch didn't throw. So 'catch: oops' logs, then 'final' logs. This is how Promise chains recover from errors.",
      "docs": null
    }
  },
  {
    "id": "02dc488f-2fc0-4082-89e5-0208fcb776cb",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 16,
    "data": {
      "question": "What is the time complexity of Array.prototype.includes() for an unsorted array?",
      "choices": [
        "O(1) — constant time like object property lookup",
        "O(log n) — binary search on the array",
        "O(n) — linear search through all elements in the worst case",
        "O(n²) — includes calls indexOf internally which is O(n²)"
      ],
      "answer": "2",
      "tags": [
        "big-o",
        "algorithms"
      ],
      "explanation": "Array.includes() performs a linear scan — it checks each element from left to right until it finds a match or exhausts the array. Worst case (value not found or at end) is O(n). For O(1) lookup, use a Set: \`new Set(arr).has(val)\` after O(n) construction. This trade-off matters at scale.",
      "docs": null
    }
  },
  {
    "id": "b0347641-e69b-47c2-890d-dfb00dd91abc",
    "moduleId": "bd2b1a5b-ca29-4a93-90da-e378cf7d5173",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 17,
    "data": {
      "question": "What does this function return for \`flatten([1, [2, [3, [4]]]])\`?",
      "choices": [
        "[1, [2, [3, [4]]]] — reduce doesn't flatten recursively",
        "[1, 2, [3, [4]]] — only one level is flattened",
        "[1, 2, 3, 4] — recursive reduce flattens all nesting levels",
        "An error — concat cannot accept arrays"
      ],
      "answer": "2",
      "tags": [
        "algorithms"
      ],
      "explanation": "The recursive flatten calls itself on nested arrays. When it encounters [2, [3, [4]]], it recursively flattens to [2, 3, 4] and concatenates. The base case is non-array values which are concatenated directly. Result: [1, 2, 3, 4]. Modern alternative: \`arr.flat(Infinity)\` in ES2019.",
      "docs": null
    }
  },
  {
    "id": "fcf600a8-43e9-4352-aebb-53d4d65bd345",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "easy",
    "sortOrder": 0,
    "data": {
      "question": "What does the STAR method stand for and when do you use it?",
      "choices": [
        "Skills, Tools, Achievements, Responsibilities — used for CV writing",
        "Strategy, Timeline, Approach, Review — used for project planning discussions",
        "Strength, Talent, Ambition, Resilience — used to answer competency questions",
        "Situation, Task, Action, Result — used to structure behavioral interview answers with concrete examples"
      ],
      "answer": "3",
      "tags": [
        "star-method",
        "soft-skills"
      ],
      "explanation": "STAR (Situation, Task, Action, Result) provides a structured format for behavioral interview questions (\"Tell me about a time when...\"). Situation: context; Task: what was your responsibility; Action: what YOU specifically did; Result: quantified outcome. It demonstrates experience with concrete evidence rather than vague claims.",
      "docs": null
    }
  },
  {
    "id": "61c1c141-0ed2-496e-9f36-8cf810e81e7c",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 1,
    "data": {
      "question": "Which structure is most effective for answering 'Tell me about yourself'?",
      "choices": [
        "Brief background → relevant experience highlights → current focus → why you're excited about this role",
        "Full chronological work history starting from school",
        "Personal hobbies and interests, then professional experience",
        "Reading from your CV verbatim"
      ],
      "answer": "0",
      "tags": [
        "soft-skills"
      ],
      "explanation": "Interviewers want a concise professional narrative (2-3 minutes). Start with your professional identity, highlight 2-3 relevant achievements, explain your current situation, and connect to why you're interested in this specific role. This shows self-awareness, communication skills, and alignment with the position.",
      "docs": null
    }
  },
  {
    "id": "b5e798e1-7137-4508-8474-1f30ac5b4e7d",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 2,
    "data": {
      "question": "How should you best frame a 'weakness' in a job interview?",
      "choices": [
        "Say 'I work too hard' or 'I'm a perfectionist' — these are positive traits framed as weaknesses",
        "Name a genuine weakness relevant but not critical to the role, then explain the concrete steps you're taking to improve it",
        "Refuse to answer — weaknesses are private",
        "Name the same weakness as your greatest strength"
      ],
      "answer": "1",
      "tags": [
        "soft-skills"
      ],
      "explanation": "Interviewers see through clichés like 'perfectionist'. Choose a real weakness that you've recognized and are actively working to improve. For example: 'I used to struggle delegating — I've been working on this by explicitly assigning ownership in sprint planning.' This shows self-awareness and a growth mindset.",
      "docs": null
    }
  },
  {
    "id": "efe7f839-5081-4989-9012-065155b03ff1",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 3,
    "data": {
      "question": "Using the STAR method, which conflict resolution answer demonstrates maturity?",
      "choices": [
        "Situation: teammate was wrong. Task: make them see my point. Action: escalated to manager. Result: I was right",
        "Situation: disagreed on API design. Task: reach consensus without blocking sprint. Action: called a 30-min meeting, presented trade-offs, agreed on a prototype to test both approaches. Result: shipped on time, chose approach 2 based on data",
        "Situation: conflict over code review. Task: get approval. Action: bypassed the review process. Result: shipped faster",
        "Situation: disagreement. Task: stay calm. Action: avoided the conflict. Result: resolved itself"
      ],
      "answer": "1",
      "tags": [
        "conflict",
        "star-method"
      ],
      "explanation": "A strong conflict answer shows: you understood both sides, proposed a constructive solution, involved the right people, measured the outcome. Escalating immediately, bypassing process, or avoiding conflict signal poor collaboration skills. The best candidates turn conflict into a collaborative problem-solving story.",
      "docs": null
    }
  },
  {
    "id": "62d2b145-8601-42ab-96d5-2559259261a2",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 4,
    "data": {
      "question": "Which answer to 'Why do you want to leave your current job?' is most effective?",
      "choices": [
        "Describe how terrible your current manager is in detail",
        "Say the compensation is too low — salary is always a valid reason",
        "Focus on growth opportunities in the new role rather than problems with the current one — be honest but forward-looking",
        "Explain that you were passed over for promotion and it's unfair"
      ],
      "answer": "2",
      "tags": [
        "career"
      ],
      "explanation": "Badmouthing current employers is a red flag — it signals poor professionalism and the interviewer wonders if you'll do the same to them. Focus on what you're moving toward: new challenges, growth areas, better alignment with your goals. If compensation is a factor, mention it briefly and positively (seeking market rate).",
      "docs": null
    }
  },
  {
    "id": "2a99577e-8393-4cbe-bfbe-4bd4a4bf6026",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 5,
    "data": {
      "question": "When answering 'Where do you see yourself in 5 years?', what do interviewers look for?",
      "choices": [
        "A specific job title you want to hold at a different company",
        "A commitment to never leave regardless of circumstances",
        "A detailed personal life plan including family goals",
        "Ambition aligned with the company's growth trajectory and the role's natural progression — shows you're planning to stay and grow"
      ],
      "answer": "3",
      "tags": [
        "career"
      ],
      "explanation": "Interviewers want to see that you've thought about your career, that your goals align with what the company can offer, and that you plan to invest in the role rather than use it as a stepping stone. Mentioning skills to develop and responsibilities to take on shows maturity. Don't mention a specific competing company.",
      "docs": null
    }
  },
  {
    "id": "3d35a48f-5c37-4f66-8b5b-7b4271085fcb",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 6,
    "data": {
      "question": "How should you handle a persistent technical disagreement with a senior developer?",
      "choices": [
        "Request a structured discussion, present your reasoning with evidence, propose a time-boxed experiment if stalemate, and accept the outcome gracefully",
        "Implement your approach without telling anyone and let the results speak",
        "Immediately defer to seniority — never challenge a senior developer",
        "Escalate to the engineering manager on the first disagreement"
      ],
      "answer": "0",
      "tags": [
        "conflict",
        "team"
      ],
      "explanation": "Healthy technical disagreement is a sign of a good team. Approach it with evidence (benchmarks, documentation, examples) not opinion. If both approaches have merit, propose a time-boxed experiment. Once a decision is made collaboratively, commit to it fully. This demonstrates both technical confidence and professional maturity.",
      "docs": null
    }
  },
  {
    "id": "a283d382-afb4-40cf-9822-15de696948e7",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 7,
    "data": {
      "question": "Which remote async communication practices are considered best?",
      "choices": [
        "Always use video calls for every discussion to replace in-person meetings",
        "Respond to messages instantly at all times to prove productivity",
        "Document decisions in writing, over-communicate context, set clear availability hours, prefer async-first for non-urgent matters and synchronous for complex discussions",
        "Avoid written documentation — slack messages are sufficient"
      ],
      "answer": "2",
      "tags": [
        "remote",
        "communication"
      ],
      "explanation": "Remote work thrives on written clarity. Document decisions where the whole team can find them. Async-first reduces interruptions and respects time zones. Synchronous time is valuable and should be used for brainstorming and complex decisions. Instant responses create burnout — set expectations for response times.",
      "docs": null
    }
  },
  {
    "id": "f356fdea-f618-40f0-909e-e0ffaee9a65f",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 8,
    "data": {
      "question": "When is the right time to bring up salary negotiation?",
      "choices": [
        "In the first screening call to avoid wasting time",
        "After receiving an offer — negotiate when you have maximum leverage (they've chosen you)",
        "Never — let the employer always make the first offer",
        "Bring it up in every interview stage to set expectations"
      ],
      "answer": "1",
      "tags": [
        "career",
        "soft-skills"
      ],
      "explanation": "Your negotiating power is highest after an offer is extended — they've invested time in the process and want you. Bringing it up too early risks being filtered out before they know your value. If asked about expectations early, give a range based on market research. Always negotiate — 85% of employers expect it.",
      "docs": null
    }
  },
  {
    "id": "65ae07c6-4bc6-40b1-b013-3edd88fd4a53",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 9,
    "data": {
      "question": "What do 'culture fit' questions (e.g., 'How do you prefer to work?') actually reveal?",
      "choices": [
        "Whether you will socialize with the team outside of work",
        "Whether you share the same political or religious views as the team",
        "Whether you will accept any working conditions without complaint",
        "Whether your working style, values, and communication preferences align with the team's way of operating"
      ],
      "answer": "3",
      "tags": [
        "soft-skills",
        "team"
      ],
      "explanation": "Culture fit questions assess collaboration style, feedback tolerance, work pace preferences, and alignment with company values — not personal life compatibility. Be authentic: describe how you actually work best. Poor culture fit on either side leads to attrition. It's also your opportunity to evaluate if the culture suits you.",
      "docs": null
    }
  },
  {
    "id": "f989cdb9-0716-402a-a6cf-41b9ed1f1466",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 10,
    "data": {
      "question": "How should you structure an answer to 'What is your biggest achievement?'",
      "choices": [
        "STAR method: context of the challenge, your specific ownership, measurable result, and what you learned",
        "Mention the achievement and let the interviewer ask follow-ups",
        "Describe team achievements only — individual achievements seem boastful",
        "Pick the most technically complex project regardless of business impact"
      ],
      "answer": "0",
      "tags": [
        "star-method",
        "soft-skills"
      ],
      "explanation": "Use STAR. Emphasize YOUR specific contribution (not just 'we'). Quantify the result (increased revenue by 15%, reduced load time from 8s to 1.2s). Include what you learned to show growth mindset. Choose an achievement relevant to the role — a business impact story often resonates more than a purely technical one.",
      "docs": null
    }
  },
  {
    "id": "544bd2da-400b-4971-bd3e-b000d45182a5",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 11,
    "data": {
      "question": "How do you answer 'Tell me about a time you missed a deadline'?",
      "choices": [
        "Claim you have never missed a deadline",
        "Choose a real example, own your responsibility, explain what went wrong, describe what you did to recover and communicate, and share what you changed going forward",
        "Blame unexpected external factors entirely",
        "Give a hypothetical instead of a real example"
      ],
      "answer": "1",
      "tags": [
        "conflict",
        "star-method"
      ],
      "explanation": "Interviewers expect you to have missed a deadline — pretending you haven't signals dishonesty or lack of experience with complex projects. Ownership demonstrates maturity. The recovery actions and process improvements show you learn from setbacks. The worst answer is blame-shifting or claiming perfection.",
      "docs": null
    }
  },
  {
    "id": "df551729-ff1e-4945-b73c-4db8435579e3",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "medium",
    "sortOrder": 12,
    "data": {
      "question": "What type of questions should you ask at the end of an interview?",
      "choices": [
        "Questions about salary, benefits, and vacation days",
        "No questions — asking questions suggests you didn't research the company",
        "Ask about the interviewer's opinion of the CEO",
        "Thoughtful questions about team culture, technical challenges, growth opportunities, and success metrics — show genuine curiosity and preparation"
      ],
      "answer": "3",
      "tags": [
        "communication",
        "soft-skills"
      ],
      "explanation": "Asking good questions demonstrates genuine interest, preparation, and critical thinking. Ask about engineering culture ('How does your team handle technical debt?'), success ('What does success look like in the first 90 days?'), and growth ('What does the career path look like for this role?'). Salary/benefits questions are fine but best left for the offer stage.",
      "docs": null
    }
  },
  {
    "id": "62e0b9a7-99b1-4f6f-af12-c6a8dc9d0230",
    "moduleId": "18b0fa5c-a3c0-4d56-a2db-077b8de9dd00",
    "type": "single",
    "difficulty": "hard",
    "sortOrder": 13,
    "data": {
      "question": "How should you demonstrate measurable impact in a behavioral interview answer?",
      "choices": [
        "Focus exclusively on the technical implementation details",
        "Only mention company-wide results to show scale",
        "Quantify results wherever possible: percentages, time saved, user numbers, revenue impact — even rough estimates are better than vague claims",
        "Avoid numbers — they can be questioned and undermine credibility"
      ],
      "answer": "2",
      "tags": [
        "star-method",
        "career"
      ],
      "explanation": "Quantified results make your stories memorable and credible. 'Reduced API response time by 60%, improving checkout conversion by 8%' is far stronger than 'made the API faster'. Even estimates ('roughly 30% faster') are better than vague claims. Numbers show business awareness and the ability to measure impact — key signals interviewers look for.",
      "docs": null
    }
  }
];

    for (const q of questions) {
      await queryRunner.query(
        `INSERT INTO "qcm_question" ("id", "moduleId", "type", "difficulty", "sortOrder", "data") VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
        [q.id, q.moduleId, q.type, q.difficulty, q.sortOrder, JSON.stringify(q.data)],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "qcm_question";`);
    await queryRunner.query(`DELETE FROM "qcm_module";`);
  }
}
