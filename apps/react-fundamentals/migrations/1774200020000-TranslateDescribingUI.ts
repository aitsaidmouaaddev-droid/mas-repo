import type { MigrationInterface, QueryRunner } from 'typeorm';

export class TranslateDescribingUI1774200020000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const questions = [
      {
        id: '2a848ec1-8aad-42f8-ae9b-93cad83eccce',
        data: {
          question: {
            en: 'What is a React component?',
            fr: 'Qu\'est-ce qu\'un composant React ?',
            de: 'Was ist eine React-Komponente?',
            es: '¿Qué es un componente React?',
            it: 'Cos\'è un componente React?',
          },
          choices: {
            en: ['A class that extends HTMLElement', 'A JavaScript function that returns JSX or null', 'A CSS selector targeting a DOM node', 'A browser built-in API for creating UI elements'],
            fr: ['Une classe qui étend HTMLElement', 'Une fonction JavaScript qui retourne du JSX ou null', 'Un sélecteur CSS ciblant un nœud DOM', 'Une API native du navigateur pour créer des éléments UI'],
            de: ['Eine Klasse, die HTMLElement erweitert', 'Eine JavaScript-Funktion, die JSX oder null zurückgibt', 'Ein CSS-Selektor, der einen DOM-Knoten anspricht', 'Eine Browser-integrierte API zum Erstellen von UI-Elementen'],
            es: ['Una clase que extiende HTMLElement', 'Una función JavaScript que devuelve JSX o null', 'Un selector CSS que apunta a un nodo DOM', 'Una API nativa del navegador para crear elementos UI'],
            it: ['Una classe che estende HTMLElement', 'Una funzione JavaScript che restituisce JSX o null', 'Un selettore CSS che punta a un nodo DOM', 'Un\'API nativa del browser per creare elementi UI'],
          },
          answer: '1',
          tags: ['jsx', 'components'],
          explanation: {
            en: 'A React component is a JavaScript function (or class) that returns JSX describing what should appear on screen. React 19 encourages function components exclusively. Components must start with a capital letter so React can distinguish them from plain HTML tags.',
            fr: 'Un composant React est une fonction JavaScript (ou une classe) qui retourne du JSX décrivant ce qui doit apparaître à l\'écran. React 19 encourage exclusivement les composants fonction. Les composants doivent commencer par une lettre majuscule pour que React puisse les distinguer des balises HTML ordinaires.',
            de: 'Eine React-Komponente ist eine JavaScript-Funktion (oder Klasse), die JSX zurückgibt, das beschreibt, was auf dem Bildschirm erscheinen soll. React 19 empfiehlt ausschließlich Funktionskomponenten. Komponenten müssen mit einem Großbuchstaben beginnen, damit React sie von einfachen HTML-Tags unterscheiden kann.',
            es: 'Un componente React es una función JavaScript (o clase) que devuelve JSX describiendo lo que debe aparecer en pantalla. React 19 fomenta exclusivamente los componentes de función. Los componentes deben comenzar con una letra mayúscula para que React pueda distinguirlos de las etiquetas HTML simples.',
            it: 'Un componente React è una funzione JavaScript (o classe) che restituisce JSX descrivendo ciò che deve apparire sullo schermo. React 19 incoraggia esclusivamente i componenti funzione. I componenti devono iniziare con una lettera maiuscola in modo che React possa distinguerli dai tag HTML semplici.',
          },
          docs: 'https://react.dev/learn/writing-markup-with-jsx',
        },
      },
      {
        id: '4931e5dc-d905-4732-83d5-75e0071f2371',
        data: {
          question: {
            en: 'Which of the following is NOT valid JSX?',
            fr: 'Lequel des éléments suivants n\'est PAS du JSX valide ?',
            de: 'Welches der folgenden ist KEIN gültiges JSX?',
            es: '¿Cuál de los siguientes NO es JSX válido?',
            it: 'Quale dei seguenti NON è JSX valido?',
          },
          choices: {
            en: ['<div className="box">Hello</div>', '<img src={url} alt="photo" />', '<for x in items>...</for>', '<Fragment>...</Fragment>'],
            fr: ['<div className="box">Hello</div>', '<img src={url} alt="photo" />', '<for x in items>...</for>', '<Fragment>...</Fragment>'],
            de: ['<div className="box">Hello</div>', '<img src={url} alt="photo" />', '<for x in items>...</for>', '<Fragment>...</Fragment>'],
            es: ['<div className="box">Hello</div>', '<img src={url} alt="photo" />', '<for x in items>...</for>', '<Fragment>...</Fragment>'],
            it: ['<div className="box">Hello</div>', '<img src={url} alt="photo" />', '<for x in items>...</for>', '<Fragment>...</Fragment>'],
          },
          answer: '2',
          tags: ['jsx'],
          explanation: {
            en: 'JSX does not have control-flow tags like <for> or <if>. You must use JavaScript expressions (map, ternary, &&) inside JSX for conditionals and loops. The other options are valid JSX syntax.',
            fr: 'JSX n\'a pas de balises de contrôle de flux comme <for> ou <if>. Vous devez utiliser des expressions JavaScript (map, ternaire, &&) à l\'intérieur de JSX pour les conditions et les boucles. Les autres options sont une syntaxe JSX valide.',
            de: 'JSX hat keine Kontrollfluss-Tags wie <for> oder <if>. Sie müssen JavaScript-Ausdrücke (map, ternär, &&) innerhalb von JSX für Bedingungen und Schleifen verwenden. Die anderen Optionen sind gültige JSX-Syntax.',
            es: 'JSX no tiene etiquetas de control de flujo como <for> o <if>. Debes usar expresiones JavaScript (map, ternario, &&) dentro de JSX para condicionales y bucles. Las otras opciones son sintaxis JSX válida.',
            it: 'JSX non ha tag di controllo del flusso come <for> o <if>. Devi usare espressioni JavaScript (map, ternario, &&) all\'interno di JSX per condizionali e cicli. Le altre opzioni sono sintassi JSX valida.',
          },
          docs: 'https://react.dev/learn/writing-markup-with-jsx',
        },
      },
      {
        id: 'ce0efa4a-fc7b-40b0-96c3-60b4ab031cd6',
        data: {
          question: {
            en: 'Why must a JSX expression have a single root element?',
            fr: 'Pourquoi une expression JSX doit-elle avoir un seul élément racine ?',
            de: 'Warum muss ein JSX-Ausdruck ein einzelnes Wurzelelement haben?',
            es: '¿Por qué una expresión JSX debe tener un único elemento raíz?',
            it: 'Perché un\'espressione JSX deve avere un singolo elemento radice?',
          },
          choices: {
            en: ['Because HTML requires a single root element', "Because the browser's DOM API only accepts one root node", "Because React's reconciler cannot handle siblings", 'Because JSX compiles to React.createElement() calls which return a single value'],
            fr: ['Parce que HTML nécessite un seul élément racine', 'Parce que l\'API DOM du navigateur n\'accepte qu\'un seul nœud racine', 'Parce que le reconciler de React ne peut pas gérer les éléments frères', 'Parce que JSX se compile en appels React.createElement() qui retournent une seule valeur'],
            de: ['Weil HTML ein einzelnes Wurzelelement erfordert', 'Weil die DOM-API des Browsers nur einen Wurzelknoten akzeptiert', 'Weil Reacts Reconciler keine Geschwisterelemente verarbeiten kann', 'Weil JSX zu React.createElement()-Aufrufen kompiliert wird, die einen einzelnen Wert zurückgeben'],
            es: ['Porque HTML requiere un único elemento raíz', 'Porque la API DOM del navegador solo acepta un nodo raíz', 'Porque el reconciliador de React no puede manejar hermanos', 'Porque JSX se compila en llamadas a React.createElement() que devuelven un único valor'],
            it: ['Perché HTML richiede un singolo elemento radice', 'Perché l\'API DOM del browser accetta solo un nodo radice', 'Perché il riconciliatore di React non può gestire i fratelli', 'Perché JSX viene compilato in chiamate React.createElement() che restituiscono un singolo valore'],
          },
          answer: '3',
          tags: ['jsx'],
          explanation: {
            en: 'JSX is syntactic sugar for React.createElement() calls. A function can only return one value, so JSX must also resolve to a single root. You can use <></> (Fragment) to wrap siblings without adding an extra DOM node.',
            fr: 'JSX est du sucre syntaxique pour les appels React.createElement(). Une fonction ne peut retourner qu\'une seule valeur, donc JSX doit également se résoudre en une seule racine. Vous pouvez utiliser <></> (Fragment) pour envelopper des éléments frères sans ajouter un nœud DOM supplémentaire.',
            de: 'JSX ist syntaktischer Zucker für React.createElement()-Aufrufe. Eine Funktion kann nur einen Wert zurückgeben, daher muss auch JSX zu einer einzelnen Wurzel aufgelöst werden. Sie können <></> (Fragment) verwenden, um Geschwisterelemente zu umschließen, ohne einen zusätzlichen DOM-Knoten hinzuzufügen.',
            es: 'JSX es azúcar sintáctico para llamadas a React.createElement(). Una función solo puede devolver un valor, por lo que JSX también debe resolverse en una única raíz. Puedes usar <></> (Fragment) para envolver hermanos sin agregar un nodo DOM adicional.',
            it: 'JSX è zucchero sintattico per le chiamate React.createElement(). Una funzione può restituire solo un valore, quindi anche JSX deve risolversi in una singola radice. Puoi usare <></> (Fragment) per avvolgere i fratelli senza aggiungere un nodo DOM extra.',
          },
          docs: 'https://react.dev/learn/writing-markup-with-jsx',
        },
      },
      {
        id: '9608d88a-ca76-42f8-b2a3-e0f5fe24632a',
        data: {
          question: {
            en: "What does this component render?\n\nfunction Greeting({ name = 'World' }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\n<Greeting />",
            fr: "Que rend ce composant ?\n\nfunction Greeting({ name = 'World' }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\n<Greeting />",
            de: "Was rendert diese Komponente?\n\nfunction Greeting({ name = 'World' }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\n<Greeting />",
            es: "¿Qué renderiza este componente?\n\nfunction Greeting({ name = 'World' }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\n<Greeting />",
            it: "Cosa rende questo componente?\n\nfunction Greeting({ name = 'World' }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\n<Greeting />",
          },
          choices: {
            en: ['<h1>Hello, World!</h1>', '<h1>Hello, undefined!</h1>', '<h1>Hello, !</h1>', 'A runtime error because name is required'],
            fr: ['<h1>Hello, World!</h1>', '<h1>Hello, undefined!</h1>', '<h1>Hello, !</h1>', 'Une erreur d\'exécution car name est requis'],
            de: ['<h1>Hello, World!</h1>', '<h1>Hello, undefined!</h1>', '<h1>Hello, !</h1>', 'Ein Laufzeitfehler, weil name erforderlich ist'],
            es: ['<h1>Hello, World!</h1>', '<h1>Hello, undefined!</h1>', '<h1>Hello, !</h1>', 'Un error de ejecución porque name es obligatorio'],
            it: ['<h1>Hello, World!</h1>', '<h1>Hello, undefined!</h1>', '<h1>Hello, !</h1>', 'Un errore di runtime perché name è obbligatorio'],
          },
          answer: '0',
          tags: ['jsx', 'components'],
          explanation: {
            en: "The destructuring default value `name = 'World'` kicks in when the prop is not passed (or passed as undefined). So <Greeting /> renders <h1>Hello, World!</h1>. Default props via destructuring are the idiomatic React pattern.",
            fr: "La valeur par défaut de déstructuration `name = 'World'` s'active lorsque la prop n'est pas passée (ou passée comme undefined). Donc <Greeting /> rend <h1>Hello, World!</h1>. Les props par défaut via déstructuration sont le pattern idiomatique de React.",
            de: "Der Destrukturierungs-Standardwert `name = 'World'` greift, wenn die Prop nicht übergeben wird (oder als undefined übergeben wird). Also rendert <Greeting /> <h1>Hello, World!</h1>. Standard-Props über Destrukturierung sind das idiomatische React-Muster.",
            es: "El valor predeterminado de desestructuración `name = 'World'` se activa cuando no se pasa la prop (o se pasa como undefined). Entonces <Greeting /> renderiza <h1>Hello, World!</h1>. Las props predeterminadas mediante desestructuración son el patrón idiomático de React.",
            it: "Il valore predefinito di destrutturazione `name = 'World'` entra in gioco quando la prop non viene passata (o viene passata come undefined). Quindi <Greeting /> rende <h1>Hello, World!</h1>. Le props predefinite tramite destrutturazione sono il pattern idiomatico di React.",
          },
          docs: 'https://react.dev/learn/writing-markup-with-jsx',
        },
      },
      {
        id: '1030c054-2feb-4e8a-836a-67141c978a76',
        data: {
          question: {
            en: 'Which statement about props is correct?',
            fr: 'Quelle affirmation sur les props est correcte ?',
            de: 'Welche Aussage über Props ist richtig?',
            es: '¿Qué afirmación sobre las props es correcta?',
            it: 'Quale affermazione sulle props è corretta?',
          },
          choices: {
            en: ['Props can be mutated directly to trigger a re-render', 'Props and state are the same thing', 'Props are read-only inside a component and must never be mutated', 'You must always pass props using the spread operator'],
            fr: ['Les props peuvent être mutées directement pour déclencher un nouveau rendu', 'Les props et le state sont la même chose', 'Les props sont en lecture seule à l\'intérieur d\'un composant et ne doivent jamais être mutées', 'Vous devez toujours passer les props en utilisant l\'opérateur spread'],
            de: ['Props können direkt mutiert werden, um ein erneutes Rendern auszulösen', 'Props und State sind dasselbe', 'Props sind innerhalb einer Komponente schreibgeschützt und dürfen niemals mutiert werden', 'Sie müssen Props immer mit dem Spread-Operator übergeben'],
            es: ['Las props pueden mutarse directamente para activar un re-renderizado', 'Las props y el estado son lo mismo', 'Las props son de solo lectura dentro de un componente y nunca deben mutarse', 'Siempre debes pasar props usando el operador spread'],
            it: ['Le props possono essere mutate direttamente per attivare un re-render', 'Le props e lo state sono la stessa cosa', 'Le props sono di sola lettura all\'interno di un componente e non devono mai essere mutate', 'Devi sempre passare le props usando l\'operatore spread'],
          },
          answer: '2',
          tags: ['props'],
          explanation: {
            en: "Props are immutable from the child's perspective. React enforces a strict unidirectional data flow: a component receives props from its parent and must not modify them. To change displayed data, use state or lift state up to the parent.",
            fr: 'Les props sont immuables du point de vue de l\'enfant. React impose un flux de données strictement unidirectionnel : un composant reçoit des props de son parent et ne doit pas les modifier. Pour changer les données affichées, utilisez le state ou remontez le state au parent.',
            de: 'Props sind aus Sicht des Kindes unveränderlich. React erzwingt einen strikt unidirektionalen Datenfluss: Eine Komponente empfängt Props von ihrem Elternteil und darf diese nicht ändern. Um angezeigte Daten zu ändern, verwenden Sie State oder heben Sie den State zum Elternteil an.',
            es: 'Las props son inmutables desde la perspectiva del hijo. React impone un flujo de datos estrictamente unidireccional: un componente recibe props de su padre y no debe modificarlas. Para cambiar los datos mostrados, usa estado o eleva el estado al padre.',
            it: 'Le props sono immutabili dal punto di vista del figlio. React impone un flusso di dati strettamente unidirezionale: un componente riceve props dal suo genitore e non deve modificarle. Per modificare i dati visualizzati, usa lo state o solleva lo state al genitore.',
          },
          docs: 'https://react.dev/learn/passing-props-to-a-component',
        },
      },
      {
        id: 'c53a3193-768b-4bd0-8a62-9688c4f29099',
        data: {
          question: {
            en: 'Given `const extra = { id: \'box\', role: \'main\' }`, what does `<div {...extra} className="container" />` render as?',
            fr: 'Étant donné `const extra = { id: \'box\', role: \'main\' }`, que rend `<div {...extra} className="container" />` ?',
            de: 'Bei `const extra = { id: \'box\', role: \'main\' }`, was rendert `<div {...extra} className="container" />`?',
            es: 'Dado `const extra = { id: \'box\', role: \'main\' }`, ¿qué renderiza `<div {...extra} className="container" />`?',
            it: 'Dato `const extra = { id: \'box\', role: \'main\' }`, cosa rende `<div {...extra} className="container" />`?',
          },
          choices: {
            en: ['<div extra={...} className="container" />', '<div id="box" role="main" className="container" />', 'A syntax error because spread is not allowed on JSX', '<div className="container" />'],
            fr: ['<div extra={...} className="container" />', '<div id="box" role="main" className="container" />', 'Une erreur de syntaxe car spread n\'est pas autorisé sur JSX', '<div className="container" />'],
            de: ['<div extra={...} className="container" />', '<div id="box" role="main" className="container" />', 'Ein Syntaxfehler, weil Spread in JSX nicht erlaubt ist', '<div className="container" />'],
            es: ['<div extra={...} className="container" />', '<div id="box" role="main" className="container" />', 'Un error de sintaxis porque spread no está permitido en JSX', '<div className="container" />'],
            it: ['<div extra={...} className="container" />', '<div id="box" role="main" className="container" />', 'Un errore di sintassi perché lo spread non è consentito in JSX', '<div className="container" />'],
          },
          answer: '1',
          tags: ['props'],
          explanation: {
            en: 'JSX supports the spread operator on props: `{...extra}` expands to individual prop assignments. The result is a div with id, role, and className all applied. Props listed after the spread will override same-named spread props.',
            fr: 'JSX prend en charge l\'opérateur spread sur les props : `{...extra}` se développe en assignations de props individuelles. Le résultat est un div avec id, role et className tous appliqués. Les props listées après le spread écraseront les props spread de même nom.',
            de: 'JSX unterstützt den Spread-Operator bei Props: `{...extra}` wird zu einzelnen Prop-Zuweisungen erweitert. Das Ergebnis ist ein div mit id, role und className, die alle angewendet werden. Props, die nach dem Spread aufgeführt sind, überschreiben gleichnamige Spread-Props.',
            es: 'JSX admite el operador spread en props: `{...extra}` se expande a asignaciones de props individuales. El resultado es un div con id, role y className todos aplicados. Las props listadas después del spread sobrescribirán las props spread del mismo nombre.',
            it: 'JSX supporta l\'operatore spread sulle props: `{...extra}` si espande in assegnazioni di props individuali. Il risultato è un div con id, role e className tutti applicati. Le props elencate dopo lo spread sovrascriveranno le props spread con lo stesso nome.',
          },
          docs: 'https://react.dev/learn/passing-props-to-a-component',
        },
      },
      {
        id: '2f33d398-5d15-454a-858f-22611ab88910',
        data: {
          question: {
            en: 'What is rendered by this code?\n\nconst count = 0;\nreturn <div>{count && <span>Items</span>}</div>;',
            fr: 'Que rend ce code ?\n\nconst count = 0;\nreturn <div>{count && <span>Items</span>}</div>;',
            de: 'Was wird von diesem Code gerendert?\n\nconst count = 0;\nreturn <div>{count && <span>Items</span>}</div>;',
            es: '¿Qué renderiza este código?\n\nconst count = 0;\nreturn <div>{count && <span>Items</span>}</div>;',
            it: 'Cosa rende questo codice?\n\nconst count = 0;\nreturn <div>{count && <span>Items</span>}</div>;',
          },
          choices: {
            en: ['<div></div>', '<div><span>Items</span></div>', '<div>false</div>', '<div>0</div>'],
            fr: ['<div></div>', '<div><span>Items</span></div>', '<div>false</div>', '<div>0</div>'],
            de: ['<div></div>', '<div><span>Items</span></div>', '<div>false</div>', '<div>0</div>'],
            es: ['<div></div>', '<div><span>Items</span></div>', '<div>false</div>', '<div>0</div>'],
            it: ['<div></div>', '<div><span>Items</span></div>', '<div>false</div>', '<div>0</div>'],
          },
          answer: '3',
          tags: ['conditional-rendering'],
          explanation: {
            en: "When the left side of `&&` is the number 0, JavaScript short-circuits and returns 0 (not false). React renders the number 0 as text. This is a classic React gotcha — use `count > 0 && ...` or a ternary to avoid rendering '0'.",
            fr: "Lorsque le côté gauche de `&&` est le nombre 0, JavaScript court-circuite et retourne 0 (pas false). React rend le nombre 0 comme texte. C'est un piège classique de React — utilisez `count > 0 && ...` ou un ternaire pour éviter de rendre '0'.",
            de: "Wenn die linke Seite von `&&` die Zahl 0 ist, schließt JavaScript kurz und gibt 0 zurück (nicht false). React rendert die Zahl 0 als Text. Dies ist eine klassische React-Falle — verwenden Sie `count > 0 && ...` oder ein ternäres, um das Rendern von '0' zu vermeiden.",
            es: "Cuando el lado izquierdo de `&&` es el número 0, JavaScript hace cortocircuito y devuelve 0 (no false). React renderiza el número 0 como texto. Este es un error clásico de React — usa `count > 0 && ...` o un ternario para evitar renderizar '0'.",
            it: "Quando il lato sinistro di `&&` è il numero 0, JavaScript va in cortocircuito e restituisce 0 (non false). React rende il numero 0 come testo. Questo è un classico trabocchetto di React — usa `count > 0 && ...` o un ternario per evitare di rendere '0'.",
          },
          docs: 'https://react.dev/learn/conditional-rendering',
        },
      },
      {
        id: '60adc0e1-a82f-467d-bade-20fe272b640c',
        data: {
          question: {
            en: 'Which pattern correctly conditionally renders a component only when `isLoggedIn` is true?',
            fr: 'Quel pattern rend correctement un composant de manière conditionnelle uniquement lorsque `isLoggedIn` est true ?',
            de: 'Welches Muster rendert eine Komponente korrekt bedingt nur wenn `isLoggedIn` true ist?',
            es: '¿Qué patrón renderiza correctamente un componente condicionalmente solo cuando `isLoggedIn` es true?',
            it: 'Quale pattern rende correttamente un componente condizionalmente solo quando `isLoggedIn` è true?',
          },
          choices: {
            en: ['Both A and B are correct', '{isLoggedIn && <Dashboard />}', "{isLoggedIn ? <Dashboard /> : ''}", 'Neither — you must use an if statement outside JSX'],
            fr: ['A et B sont tous deux corrects', '{isLoggedIn && <Dashboard />}', "{isLoggedIn ? <Dashboard /> : ''}", 'Ni l\'un ni l\'autre — vous devez utiliser une instruction if en dehors de JSX'],
            de: ['Sowohl A als auch B sind richtig', '{isLoggedIn && <Dashboard />}', "{isLoggedIn ? <Dashboard /> : ''}", 'Keines — Sie müssen eine if-Anweisung außerhalb von JSX verwenden'],
            es: ['Tanto A como B son correctos', '{isLoggedIn && <Dashboard />}', "{isLoggedIn ? <Dashboard /> : ''}", 'Ninguno — debes usar una declaración if fuera de JSX'],
            it: ['Sia A che B sono corretti', '{isLoggedIn && <Dashboard />}', "{isLoggedIn ? <Dashboard /> : ''}", 'Nessuno dei due — devi usare un\'istruzione if fuori da JSX'],
          },
          answer: '0',
          tags: ['conditional-rendering'],
          explanation: {
            en: 'Both patterns are valid. `&&` short-circuits and renders nothing when false (as long as the left side is boolean). The ternary with empty string also renders nothing. If statements outside the return are also fine — React is flexible about how you express conditional logic.',
            fr: 'Les deux patterns sont valides. `&&` court-circuite et ne rend rien lorsque false (tant que le côté gauche est un booléen). Le ternaire avec une chaîne vide ne rend également rien. Les instructions if en dehors du return conviennent également — React est flexible sur la manière d\'exprimer la logique conditionnelle.',
            de: 'Beide Muster sind gültig. `&&` schließt kurz und rendert nichts, wenn false (solange die linke Seite ein Boolean ist). Das ternäre mit leerem String rendert ebenfalls nichts. If-Anweisungen außerhalb des Returns sind ebenfalls in Ordnung — React ist flexibel, wie Sie bedingte Logik ausdrücken.',
            es: 'Ambos patrones son válidos. `&&` hace cortocircuito y no renderiza nada cuando es false (siempre que el lado izquierdo sea booleano). El ternario con cadena vacía tampoco renderiza nada. Las declaraciones if fuera del return también están bien — React es flexible sobre cómo expresar lógica condicional.',
            it: 'Entrambi i pattern sono validi. `&&` va in cortocircuito e non rende nulla quando è false (purché il lato sinistro sia booleano). Il ternario con stringa vuota non rende nulla nemmeno. Le istruzioni if fuori dal return vanno bene anche — React è flessibile su come si esprime la logica condizionale.',
          },
          docs: 'https://react.dev/learn/conditional-rendering',
        },
      },
      {
        id: 'c1b6f6d7-c517-46ea-bb39-be4a6cad8b70',
        data: {
          question: {
            en: 'Why does React require a `key` prop on elements in a list?',
            fr: 'Pourquoi React nécessite-t-il une prop `key` sur les éléments d\'une liste ?',
            de: 'Warum benötigt React eine `key`-Prop bei Elementen in einer Liste?',
            es: '¿Por qué React requiere una prop `key` en los elementos de una lista?',
            it: 'Perché React richiede una prop `key` sugli elementi in una lista?',
          },
          choices: {
            en: ['To style list items individually', 'To help React identify which items changed, were added, or removed during reconciliation', 'To give the element a unique CSS id', 'Keys are optional and only used for accessibility'],
            fr: ['Pour styliser les éléments de liste individuellement', 'Pour aider React à identifier quels éléments ont changé, ont été ajoutés ou supprimés pendant la réconciliation', 'Pour donner à l\'élément un id CSS unique', 'Les keys sont optionnelles et utilisées uniquement pour l\'accessibilité'],
            de: ['Um Listenelemente individuell zu stylen', 'Um React dabei zu helfen, zu identifizieren, welche Elemente sich während der Versöhnung geändert, hinzugefügt oder entfernt wurden', 'Um dem Element eine eindeutige CSS-ID zu geben', 'Keys sind optional und werden nur für Barrierefreiheit verwendet'],
            es: ['Para dar estilo a los elementos de lista individualmente', 'Para ayudar a React a identificar qué elementos cambiaron, se agregaron o eliminaron durante la reconciliación', 'Para darle al elemento un id CSS único', 'Las keys son opcionales y solo se usan para accesibilidad'],
            it: ['Per stilizzare gli elementi della lista individualmente', 'Per aiutare React a identificare quali elementi sono cambiati, aggiunti o rimossi durante la riconciliazione', 'Per dare all\'elemento un id CSS univoco', 'Le keys sono opzionali e utilizzate solo per l\'accessibilità'],
          },
          answer: '1',
          tags: ['lists', 'keys'],
          explanation: {
            en: 'React uses keys to match elements in the current tree against the previous tree during reconciliation. Stable, unique keys let React reuse DOM nodes correctly. Without keys, React falls back to index-based matching, which can cause bugs with reordered or filtered lists.',
            fr: 'React utilise les keys pour faire correspondre les éléments de l\'arbre actuel avec l\'arbre précédent pendant la réconciliation. Des keys stables et uniques permettent à React de réutiliser correctement les nœuds DOM. Sans keys, React revient à une correspondance basée sur l\'index, ce qui peut causer des bugs avec des listes réordonnées ou filtrées.',
            de: 'React verwendet Keys, um Elemente im aktuellen Baum während der Versöhnung mit dem vorherigen Baum abzugleichen. Stabile, eindeutige Keys ermöglichen es React, DOM-Knoten korrekt wiederzuverwenden. Ohne Keys fällt React auf indexbasiertes Matching zurück, was bei umsortierten oder gefilterten Listen zu Fehlern führen kann.',
            es: 'React usa keys para emparejar elementos en el árbol actual contra el árbol anterior durante la reconciliación. Las keys estables y únicas permiten a React reutilizar los nodos DOM correctamente. Sin keys, React recurre a la coincidencia basada en índices, lo que puede causar errores con listas reordenadas o filtradas.',
            it: 'React usa le keys per abbinare gli elementi nell\'albero corrente con l\'albero precedente durante la riconciliazione. Keys stabili e univoche permettono a React di riutilizzare correttamente i nodi DOM. Senza keys, React ricorre all\'abbinamento basato sull\'indice, che può causare bug con liste riordinate o filtrate.',
          },
          docs: 'https://react.dev/learn/rendering-lists',
        },
      },
      {
        id: '6f09ecc9-3b78-4807-a5fb-3f50a6b0af71',
        data: {
          question: {
            en: 'Which key strategy is problematic and should be avoided?',
            fr: 'Quelle stratégie de key est problématique et devrait être évitée ?',
            de: 'Welche Key-Strategie ist problematisch und sollte vermieden werden?',
            es: '¿Qué estrategia de key es problemática y debería evitarse?',
            it: 'Quale strategia di key è problematica e dovrebbe essere evitata?',
          },
          choices: {
            en: ['Using a UUID string as a key', "Using the item's database id as a key", 'Using a stable string derived from item content as a key', 'Using the array index as a key when the list can be reordered or filtered'],
            fr: ['Utiliser une chaîne UUID comme key', 'Utiliser l\'id de base de données de l\'élément comme key', 'Utiliser une chaîne stable dérivée du contenu de l\'élément comme key', 'Utiliser l\'index du tableau comme key lorsque la liste peut être réordonnée ou filtrée'],
            de: ['Eine UUID-Zeichenfolge als Key verwenden', 'Die Datenbank-ID des Elements als Key verwenden', 'Eine stabile Zeichenfolge verwenden, die aus dem Elementinhalt abgeleitet ist', 'Den Array-Index als Key verwenden, wenn die Liste umsortiert oder gefiltert werden kann'],
            es: ['Usar una cadena UUID como key', 'Usar el id de base de datos del elemento como key', 'Usar una cadena estable derivada del contenido del elemento como key', 'Usar el índice del array como key cuando la lista puede reordenarse o filtrarse'],
            it: ['Usare una stringa UUID come key', 'Usare l\'id del database dell\'elemento come key', 'Usare una stringa stabile derivata dal contenuto dell\'elemento come key', 'Usare l\'indice dell\'array come key quando la lista può essere riordinata o filtrata'],
          },
          answer: '3',
          tags: ['lists', 'keys'],
          explanation: {
            en: 'Index-based keys cause problems when items are reordered, filtered, or inserted at positions other than the end. React will incorrectly associate old DOM state (e.g., input values) with new list items. Prefer stable, unique IDs from your data.',
            fr: 'Les keys basées sur l\'index causent des problèmes lorsque les éléments sont réordonnés, filtrés ou insérés à des positions autres que la fin. React associera incorrectement l\'ancien état DOM (par exemple, les valeurs d\'entrée) avec de nouveaux éléments de liste. Préférez des IDs stables et uniques provenant de vos données.',
            de: 'Indexbasierte Keys verursachen Probleme, wenn Elemente umsortiert, gefiltert oder an anderen Positionen als am Ende eingefügt werden. React wird alten DOM-Zustand (z. B. Eingabewerte) fälschlicherweise mit neuen Listenelementen verknüpfen. Bevorzugen Sie stabile, eindeutige IDs aus Ihren Daten.',
            es: 'Las keys basadas en índices causan problemas cuando los elementos se reordenan, filtran o insertan en posiciones distintas al final. React asociará incorrectamente el estado DOM antiguo (por ejemplo, valores de entrada) con nuevos elementos de lista. Prefiere IDs estables y únicos de tus datos.',
            it: 'Le keys basate sull\'indice causano problemi quando gli elementi vengono riordinati, filtrati o inseriti in posizioni diverse dalla fine. React assocerà erroneamente il vecchio stato DOM (ad esempio, valori di input) con nuovi elementi della lista. Preferisci ID stabili e univoci dai tuoi dati.',
          },
          docs: 'https://react.dev/learn/rendering-lists',
        },
      },
      {
        id: '7269f906-504f-4568-9235-bd7ca6bccddb',
        data: {
          question: {
            en: "Which statement best defines a 'pure' React component?",
            fr: 'Quelle affirmation définit le mieux un composant React \'pur\' ?',
            de: 'Welche Aussage definiert am besten eine \'reine\' React-Komponente?',
            es: '¿Qué afirmación define mejor un componente React \'puro\'?',
            it: 'Quale affermazione definisce meglio un componente React \'puro\'?',
          },
          choices: {
            en: ['A component that never uses useState', 'A component that only renders text, no child components', 'Given the same props and state, it always renders the same JSX and has no side effects during rendering', 'A component wrapped in React.memo()'],
            fr: ['Un composant qui n\'utilise jamais useState', 'Un composant qui rend uniquement du texte, pas de composants enfants', 'Étant donné les mêmes props et state, il rend toujours le même JSX et n\'a pas d\'effets secondaires pendant le rendu', 'Un composant enveloppé dans React.memo()'],
            de: ['Eine Komponente, die niemals useState verwendet', 'Eine Komponente, die nur Text rendert, keine Kindkomponenten', 'Bei gleichen Props und State rendert sie immer dasselbe JSX und hat keine Nebeneffekte während des Renderns', 'Eine Komponente, die in React.memo() eingewickelt ist'],
            es: ['Un componente que nunca usa useState', 'Un componente que solo renderiza texto, sin componentes hijos', 'Dadas las mismas props y estado, siempre renderiza el mismo JSX y no tiene efectos secundarios durante el renderizado', 'Un componente envuelto en React.memo()'],
            it: ['Un componente che non usa mai useState', 'Un componente che rende solo testo, nessun componente figlio', 'Date le stesse props e state, rende sempre lo stesso JSX e non ha effetti collaterali durante il rendering', 'Un componente avvolto in React.memo()'],
          },
          answer: '2',
          tags: ['purity'],
          explanation: {
            en: "Purity means determinism: same inputs → same output, with no side effects during the render phase. Side effects (data fetching, subscriptions, DOM mutations) belong in event handlers or useEffect. React's Strict Mode deliberately double-invokes render functions to surface purity violations.",
            fr: 'La pureté signifie le déterminisme : mêmes entrées → même sortie, sans effets secondaires pendant la phase de rendu. Les effets secondaires (récupération de données, abonnements, mutations DOM) appartiennent aux gestionnaires d\'événements ou useEffect. Le Strict Mode de React invoque délibérément deux fois les fonctions de rendu pour révéler les violations de pureté.',
            de: 'Reinheit bedeutet Determinismus: gleiche Eingaben → gleiche Ausgabe, ohne Nebeneffekte während der Renderphase. Nebeneffekte (Datenabruf, Abonnements, DOM-Mutationen) gehören in Event-Handler oder useEffect. Reacts Strict Mode ruft Renderfunktionen absichtlich doppelt auf, um Reinheitsverletzungen aufzudecken.',
            es: 'Pureza significa determinismo: mismas entradas → misma salida, sin efectos secundarios durante la fase de renderizado. Los efectos secundarios (recuperación de datos, suscripciones, mutaciones DOM) pertenecen a los manejadores de eventos o useEffect. El modo estricto de React invoca deliberadamente dos veces las funciones de renderizado para detectar violaciones de pureza.',
            it: 'Purezza significa determinismo: stessi input → stesso output, senza effetti collaterali durante la fase di rendering. Gli effetti collaterali (recupero dati, sottoscrizioni, mutazioni DOM) appartengono ai gestori di eventi o useEffect. Lo Strict Mode di React invoca deliberatamente due volte le funzioni di rendering per rivelare violazioni della purezza.',
          },
          docs: 'https://react.dev/learn/keeping-components-pure',
        },
      },
      {
        id: '70c3c858-ed2d-4ef6-9fb7-64d1372b6e91',
        data: {
          question: {
            en: 'What is wrong with this component?\n\nlet counter = 0;\nfunction Counter() {\n  counter++;\n  return <p>{counter}</p>;\n}',
            fr: 'Quel est le problème avec ce composant ?\n\nlet counter = 0;\nfunction Counter() {\n  counter++;\n  return <p>{counter}</p>;\n}',
            de: 'Was ist falsch an dieser Komponente?\n\nlet counter = 0;\nfunction Counter() {\n  counter++;\n  return <p>{counter}</p>;\n}',
            es: '¿Qué está mal con este componente?\n\nlet counter = 0;\nfunction Counter() {\n  counter++;\n  return <p>{counter}</p>;\n}',
            it: 'Cosa c\'è di sbagliato in questo componente?\n\nlet counter = 0;\nfunction Counter() {\n  counter++;\n  return <p>{counter}</p>;\n}',
          },
          choices: {
            en: ['It mutates a variable outside its scope during rendering, making it impure', 'counter should be a string, not a number', 'The return statement is missing parentheses', 'Nothing is wrong — this is a valid pattern'],
            fr: ['Il mute une variable en dehors de sa portée pendant le rendu, le rendant impur', 'counter devrait être une chaîne, pas un nombre', 'L\'instruction return manque de parenthèses', 'Rien n\'est faux — c\'est un pattern valide'],
            de: ['Es mutiert eine Variable außerhalb seines Geltungsbereichs während des Renderns, was sie unrein macht', 'counter sollte ein String sein, keine Zahl', 'Der return-Anweisung fehlen Klammern', 'Nichts ist falsch — das ist ein gültiges Muster'],
            es: ['Muta una variable fuera de su alcance durante el renderizado, haciéndolo impuro', 'counter debería ser una cadena, no un número', 'La declaración return carece de paréntesis', 'Nada está mal — este es un patrón válido'],
            it: ['Muta una variabile al di fuori del suo ambito durante il rendering, rendendolo impuro', 'counter dovrebbe essere una stringa, non un numero', 'L\'istruzione return manca di parentesi', 'Niente è sbagliato — questo è un pattern valido'],
          },
          answer: '0',
          tags: ['purity'],
          explanation: {
            en: 'Modifying `counter` (a module-level variable) during the render phase is an impure side effect. In React Strict Mode the component renders twice, causing counter to increment by 2. State or a ref should be used instead. Pure components should only read from their props/state.',
            fr: 'Modifier `counter` (une variable au niveau du module) pendant la phase de rendu est un effet secondaire impur. En React Strict Mode, le composant rend deux fois, ce qui fait incrémenter counter de 2. Il faut plutôt utiliser le state ou une ref. Les composants purs ne doivent lire que depuis leurs props/state.',
            de: 'Das Ändern von `counter` (eine Variable auf Modulebene) während der Renderphase ist ein unreiner Nebeneffekt. Im React Strict Mode wird die Komponente zweimal gerendert, wodurch counter um 2 erhöht wird. Stattdessen sollte State oder eine Ref verwendet werden. Reine Komponenten sollten nur von ihren Props/State lesen.',
            es: 'Modificar `counter` (una variable a nivel de módulo) durante la fase de renderizado es un efecto secundario impuro. En el modo estricto de React, el componente se renderiza dos veces, causando que counter se incremente en 2. Se debería usar estado o una ref en su lugar. Los componentes puros solo deben leer de sus props/estado.',
            it: 'Modificare `counter` (una variabile a livello di modulo) durante la fase di rendering è un effetto collaterale impuro. In React Strict Mode il componente rende due volte, causando l\'incremento di counter di 2. Dovrebbe essere usato lo state o un ref invece. I componenti puri dovrebbero solo leggere dalle loro props/state.',
          },
          docs: 'https://react.dev/learn/keeping-components-pure',
        },
      },
      {
        id: 'a7aa4df3-f1b1-405b-9f2a-5d665a21e563',
        data: {
          question: {
            en: 'In React 19, how can you pass a ref to a function component?',
            fr: 'Dans React 19, comment pouvez-vous passer une ref à un composant fonction ?',
            de: 'Wie können Sie in React 19 eine Ref an eine Funktionskomponente übergeben?',
            es: 'En React 19, ¿cómo puedes pasar una ref a un componente de función?',
            it: 'In React 19, come puoi passare una ref a un componente funzione?',
          },
          choices: {
            en: ['You must still use React.forwardRef() to forward refs', 'Using a ref callback stored in context', 'Refs cannot be passed to function components', 'Directly as a prop named `ref` — forwardRef is no longer required'],
            fr: ['Vous devez toujours utiliser React.forwardRef() pour transmettre les refs', 'En utilisant un callback de ref stocké dans le context', 'Les refs ne peuvent pas être passées aux composants fonction', 'Directement comme une prop nommée `ref` — forwardRef n\'est plus nécessaire'],
            de: ['Sie müssen weiterhin React.forwardRef() verwenden, um Refs weiterzuleiten', 'Mit einem Ref-Callback, der im Context gespeichert ist', 'Refs können nicht an Funktionskomponenten übergeben werden', 'Direkt als Prop namens `ref` — forwardRef ist nicht mehr erforderlich'],
            es: ['Todavía debes usar React.forwardRef() para reenviar refs', 'Usando un callback de ref almacenado en el contexto', 'Las refs no se pueden pasar a componentes de función', 'Directamente como una prop llamada `ref` — forwardRef ya no es necesario'],
            it: ['Devi ancora usare React.forwardRef() per inoltrare le ref', 'Usando un callback di ref memorizzato nel contesto', 'Le ref non possono essere passate ai componenti funzione', 'Direttamente come una prop chiamata `ref` — forwardRef non è più richiesto'],
          },
          answer: '3',
          tags: ['jsx', 'react-19'],
          explanation: {
            en: 'React 19 treats `ref` as a regular prop for function components, eliminating the need for `React.forwardRef()`. You simply destructure `ref` from props and attach it to the desired DOM element. This simplifies the API and reduces boilerplate.',
            fr: 'React 19 traite `ref` comme une prop normale pour les composants fonction, éliminant le besoin de `React.forwardRef()`. Vous déstructurez simplement `ref` depuis les props et l\'attachez à l\'élément DOM souhaité. Cela simplifie l\'API et réduit le code boilerplate.',
            de: 'React 19 behandelt `ref` als normale Prop für Funktionskomponenten und beseitigt die Notwendigkeit von `React.forwardRef()`. Sie destrukturieren einfach `ref` aus den Props und hängen es an das gewünschte DOM-Element an. Dies vereinfacht die API und reduziert Boilerplate.',
            es: 'React 19 trata `ref` como una prop normal para componentes de función, eliminando la necesidad de `React.forwardRef()`. Simplemente desestructuras `ref` de las props y lo adjuntas al elemento DOM deseado. Esto simplifica la API y reduce el código repetitivo.',
            it: 'React 19 tratta `ref` come una prop normale per i componenti funzione, eliminando la necessità di `React.forwardRef()`. Basta destrutturare `ref` dalle props e attaccarlo all\'elemento DOM desiderato. Questo semplifica l\'API e riduce il boilerplate.',
          },
          docs: 'https://react.dev/learn/writing-markup-with-jsx',
        },
      },
      {
        id: '831a321b-ad8b-4d11-9c91-3f0f94e08315',
        data: {
          question: {
            en: 'React 19 allows you to render <title> and <meta> tags directly inside a component. What does React do with them?',
            fr: 'React 19 vous permet de rendre les balises <title> et <meta> directement dans un composant. Que fait React avec elles ?',
            de: 'React 19 ermöglicht es Ihnen, <title>- und <meta>-Tags direkt in einer Komponente zu rendern. Was macht React damit?',
            es: 'React 19 te permite renderizar etiquetas <title> y <meta> directamente dentro de un componente. ¿Qué hace React con ellas?',
            it: 'React 19 ti consente di rendere i tag <title> e <meta> direttamente all\'interno di un componente. Cosa fa React con loro?',
          },
          choices: {
            en: ["Renders them inline in the component's position in the DOM", 'Hoists them to the <head> of the document automatically', 'Throws a warning and ignores them', 'Requires a special DocumentHead wrapper component'],
            fr: ['Les rend en ligne à la position du composant dans le DOM', 'Les remonte automatiquement dans le <head> du document', 'Lance un avertissement et les ignore', 'Nécessite un composant wrapper DocumentHead spécial'],
            de: ['Rendert sie inline an der Position der Komponente im DOM', 'Hebt sie automatisch in den <head> des Dokuments', 'Gibt eine Warnung aus und ignoriert sie', 'Benötigt eine spezielle DocumentHead-Wrapper-Komponente'],
            es: ['Las renderiza en línea en la posición del componente en el DOM', 'Las eleva al <head> del documento automáticamente', 'Lanza una advertencia y las ignora', 'Requiere un componente envoltorio DocumentHead especial'],
            it: ['Le rende inline nella posizione del componente nel DOM', 'Le solleva automaticamente nel <head> del documento', 'Lancia un avviso e le ignora', 'Richiede un componente wrapper DocumentHead speciale'],
          },
          answer: '1',
          tags: ['react-19'],
          explanation: {
            en: 'React 19 introduces built-in support for document metadata. When you render <title>, <meta>, or <link> tags inside any component, React automatically hoists them to the document <head>. This eliminates the need for third-party libraries like react-helmet.',
            fr: 'React 19 introduit un support intégré pour les métadonnées de document. Lorsque vous rendez des balises <title>, <meta> ou <link> à l\'intérieur de n\'importe quel composant, React les remonte automatiquement dans le <head> du document. Cela élimine le besoin de bibliothèques tierces comme react-helmet.',
            de: 'React 19 führt integrierte Unterstützung für Dokument-Metadaten ein. Wenn Sie <title>-, <meta>- oder <link>-Tags innerhalb einer Komponente rendern, hebt React sie automatisch in den <head> des Dokuments. Dies macht Drittanbieter-Bibliotheken wie react-helmet überflüssig.',
            es: 'React 19 introduce soporte integrado para metadatos de documento. Cuando renderizas etiquetas <title>, <meta> o <link> dentro de cualquier componente, React las eleva automáticamente al <head> del documento. Esto elimina la necesidad de bibliotecas de terceros como react-helmet.',
            it: 'React 19 introduce il supporto integrato per i metadati del documento. Quando rendi i tag <title>, <meta> o <link> all\'interno di qualsiasi componente, React li solleva automaticamente nel <head> del documento. Questo elimina la necessità di librerie di terze parti come react-helmet.',
          },
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: 'aedcd18b-5233-465d-995f-c059bb8a8444',
        data: {
          question: {
            en: 'What is the rule about component names in JSX?',
            fr: 'Quelle est la règle concernant les noms de composants en JSX ?',
            de: 'Was ist die Regel für Komponentennamen in JSX?',
            es: '¿Cuál es la regla sobre los nombres de componentes en JSX?',
            it: 'Qual è la regola sui nomi dei componenti in JSX?',
          },
          choices: {
            en: ['Component names must start with an uppercase letter', 'Component names must be all lowercase', "Component names must end with 'Component'", 'Component names can be any valid JavaScript identifier'],
            fr: ['Les noms de composants doivent commencer par une lettre majuscule', 'Les noms de composants doivent être entièrement en minuscules', "Les noms de composants doivent se terminer par 'Component'", 'Les noms de composants peuvent être n\'importe quel identificateur JavaScript valide'],
            de: ['Komponentennamen müssen mit einem Großbuchstaben beginnen', 'Komponentennamen müssen vollständig kleingeschrieben sein', "Komponentennamen müssen mit 'Component' enden", 'Komponentennamen können jeder gültige JavaScript-Bezeichner sein'],
            es: ['Los nombres de componentes deben comenzar con una letra mayúscula', 'Los nombres de componentes deben estar todos en minúsculas', "Los nombres de componentes deben terminar con 'Component'", 'Los nombres de componentes pueden ser cualquier identificador JavaScript válido'],
            it: ['I nomi dei componenti devono iniziare con una lettera maiuscola', 'I nomi dei componenti devono essere tutti minuscoli', "I nomi dei componenti devono terminare con 'Component'", 'I nomi dei componenti possono essere qualsiasi identificatore JavaScript valido'],
          },
          answer: '0',
          tags: ['components', 'jsx'],
          explanation: {
            en: 'In JSX, a tag starting with a lowercase letter (e.g., <div>) is treated as a native HTML element. A tag starting with an uppercase letter (e.g., <MyComponent>) is treated as a React component reference. This distinction is baked into the JSX transform.',
            fr: 'En JSX, une balise commençant par une lettre minuscule (par exemple, <div>) est traitée comme un élément HTML natif. Une balise commençant par une lettre majuscule (par exemple, <MyComponent>) est traitée comme une référence de composant React. Cette distinction est intégrée dans la transformation JSX.',
            de: 'In JSX wird ein Tag, das mit einem Kleinbuchstaben beginnt (z. B. <div>), als natives HTML-Element behandelt. Ein Tag, das mit einem Großbuchstaben beginnt (z. B. <MyComponent>), wird als React-Komponentenreferenz behandelt. Diese Unterscheidung ist in die JSX-Transformation eingebaut.',
            es: 'En JSX, una etiqueta que comienza con una letra minúscula (p. ej., <div>) se trata como un elemento HTML nativo. Una etiqueta que comienza con una letra mayúscula (p. ej., <MyComponent>) se trata como una referencia de componente React. Esta distinción está incorporada en la transformación JSX.',
            it: 'In JSX, un tag che inizia con una lettera minuscola (ad es., <div>) viene trattato come un elemento HTML nativo. Un tag che inizia con una lettera maiuscola (ad es., <MyComponent>) viene trattato come un riferimento a un componente React. Questa distinzione è integrata nella trasformazione JSX.',
          },
          docs: 'https://react.dev/learn/your-first-component',
        },
      },
      {
        id: '75235c1e-cb62-4447-8531-71526c40ae1d',
        data: {
          question: {
            en: 'Which of the following are valid ways to export a React component? (Select all that apply)',
            fr: 'Parmi les éléments suivants, lesquels sont des moyens valides d\'exporter un composant React ? (Sélectionnez toutes les réponses applicables)',
            de: 'Welche der folgenden Methoden sind gültige Möglichkeiten, eine React-Komponente zu exportieren? (Alle zutreffenden auswählen)',
            es: '¿Cuáles de las siguientes son formas válidas de exportar un componente React? (Selecciona todas las que apliquen)',
            it: 'Quali dei seguenti sono modi validi per esportare un componente React? (Seleziona tutte le opzioni applicabili)',
          },
          choices: {
            en: ['module.exports = function MyComponent() { return <div /> }', 'export default function MyComponent() { return <div /> }', 'export const MyComponent = () => <div />;', 'export { MyComponent }; (where MyComponent is defined above)'],
            fr: ['module.exports = function MyComponent() { return <div /> }', 'export default function MyComponent() { return <div /> }', 'export const MyComponent = () => <div />;', 'export { MyComponent }; (où MyComponent est défini ci-dessus)'],
            de: ['module.exports = function MyComponent() { return <div /> }', 'export default function MyComponent() { return <div /> }', 'export const MyComponent = () => <div />;', 'export { MyComponent }; (wobei MyComponent oben definiert ist)'],
            es: ['module.exports = function MyComponent() { return <div /> }', 'export default function MyComponent() { return <div /> }', 'export const MyComponent = () => <div />;', 'export { MyComponent }; (donde MyComponent está definido arriba)'],
            it: ['module.exports = function MyComponent() { return <div /> }', 'export default function MyComponent() { return <div /> }', 'export const MyComponent = () => <div />;', 'export { MyComponent }; (dove MyComponent è definito sopra)'],
          },
          answer: '[1,2,3]',
          tags: ['jsx', 'components'],
          explanation: {
            en: 'ESM named exports (export const, export { }), default exports (export default), and arrow functions are all valid. CommonJS module.exports works in Node.js but is not idiomatic for React component files which use ES modules. TypeScript and bundlers expect ESM syntax in React projects.',
            fr: 'Les exports nommés ESM (export const, export { }), les exports par défaut (export default) et les fonctions fléchées sont tous valides. CommonJS module.exports fonctionne dans Node.js mais n\'est pas idiomatique pour les fichiers de composants React qui utilisent les modules ES. TypeScript et les bundlers attendent la syntaxe ESM dans les projets React.',
            de: 'ESM-benannte Exporte (export const, export { }), Standard-Exporte (export default) und Pfeilfunktionen sind alle gültig. CommonJS module.exports funktioniert in Node.js, ist aber nicht idiomatisch für React-Komponentendateien, die ES-Module verwenden. TypeScript und Bundler erwarten ESM-Syntax in React-Projekten.',
            es: 'Las exportaciones con nombre ESM (export const, export { }), las exportaciones predeterminadas (export default) y las funciones de flecha son todas válidas. CommonJS module.exports funciona en Node.js pero no es idiomático para archivos de componentes React que usan módulos ES. TypeScript y los bundlers esperan sintaxis ESM en proyectos React.',
            it: 'Le esportazioni con nome ESM (export const, export { }), le esportazioni predefinite (export default) e le funzioni freccia sono tutte valide. CommonJS module.exports funziona in Node.js ma non è idiomatico per i file di componenti React che usano moduli ES. TypeScript e i bundler si aspettano la sintassi ESM nei progetti React.',
          },
          docs: 'https://react.dev/learn/writing-markup-with-jsx',
        },
      },
      {
        id: '751ac247-e1a7-4f90-9b8d-b82062b086bd',
        data: {
          question: {
            en: 'What does `children` represent in this component and what does it render?\n\nfunction Card({ children }) {\n  return <div className="card">{children}</div>;\n}\n\n<Card><p>Hello</p></Card>',
            fr: 'Que représente `children` dans ce composant et que rend-il ?\n\nfunction Card({ children }) {\n  return <div className="card">{children}</div>;\n}\n\n<Card><p>Hello</p></Card>',
            de: 'Was stellt `children` in dieser Komponente dar und was rendert sie?\n\nfunction Card({ children }) {\n  return <div className="card">{children}</div>;\n}\n\n<Card><p>Hello</p></Card>',
            es: '¿Qué representa `children` en este componente y qué renderiza?\n\nfunction Card({ children }) {\n  return <div className="card">{children}</div>;\n}\n\n<Card><p>Hello</p></Card>',
            it: 'Cosa rappresenta `children` in questo componente e cosa rende?\n\nfunction Card({ children }) {\n  return <div className="card">{children}</div>;\n}\n\n<Card><p>Hello</p></Card>',
          },
          choices: {
            en: ['<div class="card"></div>', '<div class="card">[object Object]</div>', '<div class="card"><p>Hello</p></div>', 'An error — children must be passed as an explicit prop'],
            fr: ['<div class="card"></div>', '<div class="card">[object Object]</div>', '<div class="card"><p>Hello</p></div>', 'Une erreur — children doit être passé comme une prop explicite'],
            de: ['<div class="card"></div>', '<div class="card">[object Object]</div>', '<div class="card"><p>Hello</p></div>', 'Ein Fehler — children muss als explizite Prop übergeben werden'],
            es: ['<div class="card"></div>', '<div class="card">[object Object]</div>', '<div class="card"><p>Hello</p></div>', 'Un error — children debe pasarse como una prop explícita'],
            it: ['<div class="card"></div>', '<div class="card">[object Object]</div>', '<div class="card"><p>Hello</p></div>', 'Un errore — children deve essere passato come una prop esplicita'],
          },
          answer: '2',
          tags: ['props', 'jsx'],
          explanation: {
            en: 'Content placed between JSX opening and closing tags is automatically passed as the `children` prop. The Card component renders its container div wrapping whatever was placed inside it — in this case <p>Hello</p>. The children prop is the standard React composition mechanism.',
            fr: 'Le contenu placé entre les balises d\'ouverture et de fermeture JSX est automatiquement passé comme prop `children`. Le composant Card rend son div conteneur enveloppant ce qui a été placé à l\'intérieur — dans ce cas <p>Hello</p>. La prop children est le mécanisme de composition standard de React.',
            de: 'Inhalt, der zwischen JSX-öffnenden und -schließenden Tags platziert wird, wird automatisch als `children`-Prop übergeben. Die Card-Komponente rendert ihr Container-Div, das umschließt, was darin platziert wurde — in diesem Fall <p>Hello</p>. Die children-Prop ist der Standard-React-Kompositionsmechanismus.',
            es: 'El contenido colocado entre las etiquetas de apertura y cierre JSX se pasa automáticamente como la prop `children`. El componente Card renderiza su div contenedor envolviendo lo que se colocó dentro de él — en este caso <p>Hello</p>. La prop children es el mecanismo de composición estándar de React.',
            it: 'Il contenuto posizionato tra i tag di apertura e chiusura JSX viene passato automaticamente come prop `children`. Il componente Card rende il suo div contenitore avvolgendo ciò che è stato posizionato al suo interno — in questo caso <p>Hello</p>. La prop children è il meccanismo di composizione standard di React.',
          },
          docs: 'https://react.dev/learn/passing-props-to-a-component',
        },
      },
      {
        id: 'aa5cec0f-87db-4b30-9940-eff8f03fe692',
        data: {
          question: {
            en: 'You need to render either <AdminPanel /> or <UserPanel /> based on `role`. Which approach follows React best practices?',
            fr: 'Vous devez rendre soit <AdminPanel /> soit <UserPanel /> en fonction de `role`. Quelle approche suit les meilleures pratiques React ?',
            de: 'Sie müssen entweder <AdminPanel /> oder <UserPanel /> basierend auf `role` rendern. Welcher Ansatz folgt den React-Best-Practices?',
            es: 'Necesitas renderizar <AdminPanel /> o <UserPanel /> según `role`. ¿Qué enfoque sigue las mejores prácticas de React?',
            it: 'Devi rendere <AdminPanel /> o <UserPanel /> in base a `role`. Quale approccio segue le migliori pratiche di React?',
          },
          choices: {
            en: ["if (role === 'admin') document.getElementById('root').innerHTML = '<AdminPanel />';", "return role === 'admin' ? React.render(<AdminPanel />) : React.render(<UserPanel />);", "const Panel = role === 'admin' ? AdminPanel : UserPanel; return <Panel />;", 'Conditionally import the component file at runtime'],
            fr: ["if (role === 'admin') document.getElementById('root').innerHTML = '<AdminPanel />';", "return role === 'admin' ? React.render(<AdminPanel />) : React.render(<UserPanel />);", "const Panel = role === 'admin' ? AdminPanel : UserPanel; return <Panel />;", 'Importer conditionnellement le fichier de composant au moment de l\'exécution'],
            de: ["if (role === 'admin') document.getElementById('root').innerHTML = '<AdminPanel />';", "return role === 'admin' ? React.render(<AdminPanel />) : React.render(<UserPanel />);", "const Panel = role === 'admin' ? AdminPanel : UserPanel; return <Panel />;", 'Die Komponentendatei zur Laufzeit bedingt importieren'],
            es: ["if (role === 'admin') document.getElementById('root').innerHTML = '<AdminPanel />';", "return role === 'admin' ? React.render(<AdminPanel />) : React.render(<UserPanel />);", "const Panel = role === 'admin' ? AdminPanel : UserPanel; return <Panel />;", 'Importar condicionalmente el archivo del componente en tiempo de ejecución'],
            it: ["if (role === 'admin') document.getElementById('root').innerHTML = '<AdminPanel />';", "return role === 'admin' ? React.render(<AdminPanel />) : React.render(<UserPanel />);", "const Panel = role === 'admin' ? AdminPanel : UserPanel; return <Panel />;", 'Importare condizionalmente il file del componente a runtime'],
          },
          answer: '2',
          tags: ['conditional-rendering', 'purity'],
          explanation: {
            en: "Storing the component type in a variable and rendering it as a JSX element is a clean, idiomatic pattern. It keeps logic declarative and inside the render function. Direct DOM manipulation (option B) bypasses React's reconciler and causes bugs.",
            fr: 'Stocker le type de composant dans une variable et le rendre comme un élément JSX est un pattern propre et idiomatique. Cela garde la logique déclarative et à l\'intérieur de la fonction de rendu. La manipulation directe du DOM (option B) contourne le reconciler de React et cause des bugs.',
            de: 'Das Speichern des Komponententyps in einer Variablen und das Rendern als JSX-Element ist ein sauberes, idiomatisches Muster. Es hält die Logik deklarativ und innerhalb der Renderfunktion. Direkte DOM-Manipulation (Option B) umgeht Reacts Reconciler und verursacht Fehler.',
            es: 'Almacenar el tipo de componente en una variable y renderizarlo como un elemento JSX es un patrón limpio e idiomático. Mantiene la lógica declarativa y dentro de la función de renderizado. La manipulación directa del DOM (opción B) evita el reconciliador de React y causa errores.',
            it: 'Memorizzare il tipo di componente in una variabile e renderizzarlo come elemento JSX è un pattern pulito e idiomatico. Mantiene la logica dichiarativa e all\'interno della funzione di rendering. La manipolazione diretta del DOM (opzione B) aggira il riconciliatore di React e causa bug.',
          },
          docs: 'https://react.dev/learn/conditional-rendering',
        },
      },
    ];
    for (const q of questions) {
      await queryRunner.query(
        `UPDATE "qcm_question" SET "data" = $1::jsonb WHERE "id" = $2`,
        [JSON.stringify(q.data), q.id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const rows: Array<{ id: string; data: any }> = await queryRunner.query(
      `SELECT id, data FROM "qcm_question" WHERE "moduleId" = '756c8434-a704-4c6e-88f9-e467dc8c3f91'`
    );
    for (const row of rows) {
      const d = row.data;
      if (typeof d.question === 'object') d.question = { en: d.question.en };
      if (typeof d.choices === 'object' && d.choices.en) d.choices = { en: d.choices.en };
      if (d.explanation && typeof d.explanation === 'object') d.explanation = { en: d.explanation.en };
      await queryRunner.query(`UPDATE "qcm_question" SET "data" = $1::jsonb WHERE "id" = $2`, [JSON.stringify(d), row.id]);
    }
  }
}
