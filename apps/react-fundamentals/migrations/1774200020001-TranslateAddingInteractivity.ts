import type { MigrationInterface, QueryRunner } from 'typeorm';

export class TranslateAddingInteractivity1774200020001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const questions = [
      {
        id: '6c36b381-154c-4431-b2de-b20b4a5333d5',
        data: {
          question: {
            en: 'How do you correctly attach a click event handler in JSX?',
            fr: 'Comment attacher correctement un gestionnaire d\'événement click en JSX ?',
            de: 'Wie befestigen Sie einen Click-Event-Handler korrekt in JSX?',
            es: '¿Cómo se adjunta correctamente un manejador de evento click en JSX?',
            it: 'Come si collega correttamente un gestore di evento click in JSX?',
          },
          choices: {
            en: [
              '<button onclick={handleClick()}>Click</button>',
              '<button onClick="handleClick()">Click</button>',
              '<button on-click={handleClick}>Click</button>',
              '<button onClick={handleClick}>Click</button>',
            ],
            fr: [
              '<button onclick={handleClick()}>Click</button>',
              '<button onClick="handleClick()">Click</button>',
              '<button on-click={handleClick}>Click</button>',
              '<button onClick={handleClick}>Click</button>',
            ],
            de: [
              '<button onclick={handleClick()}>Click</button>',
              '<button onClick="handleClick()">Click</button>',
              '<button on-click={handleClick}>Click</button>',
              '<button onClick={handleClick}>Click</button>',
            ],
            es: [
              '<button onclick={handleClick()}>Click</button>',
              '<button onClick="handleClick()">Click</button>',
              '<button on-click={handleClick}>Click</button>',
              '<button onClick={handleClick}>Click</button>',
            ],
            it: [
              '<button onclick={handleClick()}>Click</button>',
              '<button onClick="handleClick()">Click</button>',
              '<button on-click={handleClick}>Click</button>',
              '<button onClick={handleClick}>Click</button>',
            ],
          },
          answer: '3',
          tags: ['events'],
          explanation: {
            en: 'JSX event names are camelCase (onClick, not onclick). The value must be the function reference itself, not a call (no parentheses). Writing `{handleClick()}` would call the function immediately during render instead of on click.',
            fr: 'Les noms d\'événements JSX sont en camelCase (onClick, pas onclick). La valeur doit être la référence de la fonction elle-même, pas un appel (sans parenthèses). Écrire `{handleClick()}` appellerait la fonction immédiatement pendant le rendu au lieu de lors du clic.',
            de: 'JSX-Ereignisnamen sind camelCase (onClick, nicht onclick). Der Wert muss die Funktionsreferenz selbst sein, kein Aufruf (keine Klammern). Das Schreiben von `{handleClick()}` würde die Funktion sofort während des Renderns aufrufen statt beim Klick.',
            es: 'Los nombres de eventos JSX están en camelCase (onClick, no onclick). El valor debe ser la referencia de la función en sí, no una llamada (sin paréntesis). Escribir `{handleClick()}` llamaría a la función inmediatamente durante el renderizado en lugar de al hacer clic.',
            it: 'I nomi degli eventi JSX sono camelCase (onClick, non onclick). Il valore deve essere il riferimento alla funzione stessa, non una chiamata (senza parentesi). Scrivere `{handleClick()}` chiamerebbe la funzione immediatamente durante il rendering invece che al clic.',
          },
          docs: 'https://react.dev/learn/responding-to-events',
        },
      },
      {
        id: '47197547-f29b-42e8-b4b8-ea16ff1451f6',
        data: {
          question: {
            en: 'What does useState return?',
            fr: 'Que retourne useState ?',
            de: 'Was gibt useState zurück?',
            es: '¿Qué devuelve useState?',
            it: 'Cosa restituisce useState?',
          },
          choices: {
            en: [
              'An array with the current state value and a setter function',
              'An object with a `value` and `setValue` property',
              'The current state value only',
              'A ref object with a `.current` property',
            ],
            fr: [
              'Un tableau avec la valeur d\'état actuelle et une fonction setter',
              'Un objet avec une propriété `value` et `setValue`',
              'La valeur d\'état actuelle uniquement',
              'Un objet ref avec une propriété `.current`',
            ],
            de: [
              'Ein Array mit dem aktuellen State-Wert und einer Setter-Funktion',
              'Ein Objekt mit einer `value`- und `setValue`-Eigenschaft',
              'Nur den aktuellen State-Wert',
              'Ein Ref-Objekt mit einer `.current`-Eigenschaft',
            ],
            es: [
              'Un array con el valor de estado actual y una función setter',
              'Un objeto con una propiedad `value` y `setValue`',
              'Solo el valor de estado actual',
              'Un objeto ref con una propiedad `.current`',
            ],
            it: [
              'Un array con il valore di stato corrente e una funzione setter',
              'Un oggetto con una proprietà `value` e `setValue`',
              'Solo il valore di stato corrente',
              'Un oggetto ref con una proprietà `.current`',
            ],
          },
          answer: '0',
          tags: ['useState'],
          explanation: {
            en: 'useState returns a two-element array: the current state value and the setter function. Destructuring is idiomatic: `const [count, setCount] = useState(0)`. This tuple pattern allows you to name the values anything you want.',
            fr: 'useState retourne un tableau à deux éléments : la valeur d\'état actuelle et la fonction setter. La déstructuration est idiomatique : `const [count, setCount] = useState(0)`. Ce pattern de tuple vous permet de nommer les valeurs comme vous le souhaitez.',
            de: 'useState gibt ein Array mit zwei Elementen zurück: den aktuellen State-Wert und die Setter-Funktion. Destructuring ist idiomatisch: `const [count, setCount] = useState(0)`. Dieses Tuple-Pattern ermöglicht es Ihnen, die Werte beliebig zu benennen.',
            es: 'useState devuelve un array de dos elementos: el valor de estado actual y la función setter. La desestructuración es idiomática: `const [count, setCount] = useState(0)`. Este patrón de tupla te permite nombrar los valores como quieras.',
            it: 'useState restituisce un array a due elementi: il valore di stato corrente e la funzione setter. La destrutturazione è idiomatica: `const [count, setCount] = useState(0)`. Questo pattern di tupla ti consente di nominare i valori come preferisci.',
          },
          docs: 'https://react.dev/reference/react/useState',
        },
      },
      {
        id: '3cc8f7c6-8922-4869-a340-7f2071af3e47',
        data: {
          question: {
            en: 'What does this code alert after clicking the button 3 times fast?\n\nconst [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}\n<button onClick={handleClick}>+</button>',
            fr: 'Qu\'affiche ce code après avoir cliqué 3 fois rapidement sur le bouton ?\n\nconst [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}\n<button onClick={handleClick}>+</button>',
            de: 'Was zeigt dieser Code nach 3-maligem schnellem Klicken auf den Button an?\n\nconst [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}\n<button onClick={handleClick}>+</button>',
            es: '¿Qué alerta este código después de hacer clic en el botón 3 veces rápido?\n\nconst [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}\n<button onClick={handleClick}>+</button>',
            it: 'Cosa mostra questo codice dopo aver cliccato 3 volte rapidamente sul pulsante?\n\nconst [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}\n<button onClick={handleClick}>+</button>',
          },
          choices: {
            en: [
              '3 — because setCount is called 3 times',
              '1 — because count is captured as a snapshot',
              '0 — state never updates synchronously',
              'An error is thrown',
            ],
            fr: [
              '3 — car setCount est appelé 3 fois',
              '1 — car count est capturé comme un instantané',
              '0 — l\'état ne se met jamais à jour de manière synchrone',
              'Une erreur est levée',
            ],
            de: [
              '3 — weil setCount 3-mal aufgerufen wird',
              '1 — weil count als Snapshot erfasst wird',
              '0 — State wird nie synchron aktualisiert',
              'Es wird ein Fehler ausgelöst',
            ],
            es: [
              '3 — porque setCount se llama 3 veces',
              '1 — porque count se captura como una instantánea',
              '0 — el estado nunca se actualiza sincrónicamente',
              'Se lanza un error',
            ],
            it: [
              '3 — perché setCount viene chiamato 3 volte',
              '1 — perché count viene catturato come uno snapshot',
              '0 — lo stato non si aggiorna mai in modo sincrono',
              'Viene lanciato un errore',
            ],
          },
          answer: '1',
          tags: ['useState', 'state-snapshot'],
          explanation: {
            en: 'State is a snapshot: within a single event handler, `count` always has the same value (0 on first click). All three setCount calls enqueue `0 + 1 = 1`. React batches them and only one update happens. Use the functional form `setCount(c => c + 1)` to chain updates correctly.',
            fr: 'L\'état est un instantané : dans un seul gestionnaire d\'événement, `count` a toujours la même valeur (0 au premier clic). Les trois appels à setCount mettent en file `0 + 1 = 1`. React les regroupe et une seule mise à jour se produit. Utilisez la forme fonctionnelle `setCount(c => c + 1)` pour enchaîner correctement les mises à jour.',
            de: 'State ist ein Snapshot: Innerhalb eines einzelnen Event-Handlers hat `count` immer denselben Wert (0 beim ersten Klick). Alle drei setCount-Aufrufe reihen `0 + 1 = 1` ein. React bündelt sie und nur ein Update erfolgt. Verwenden Sie die funktionale Form `setCount(c => c + 1)`, um Updates korrekt zu verketten.',
            es: 'El estado es una instantánea: dentro de un solo manejador de eventos, `count` siempre tiene el mismo valor (0 en el primer clic). Las tres llamadas a setCount encolan `0 + 1 = 1`. React las agrupa y solo ocurre una actualización. Usa la forma funcional `setCount(c => c + 1)` para encadenar actualizaciones correctamente.',
            it: 'Lo stato è uno snapshot: all\'interno di un singolo gestore di eventi, `count` ha sempre lo stesso valore (0 al primo clic). Tutte e tre le chiamate a setCount accodano `0 + 1 = 1`. React le raggruppa e avviene un solo aggiornamento. Usa la forma funzionale `setCount(c => c + 1)` per concatenare correttamente gli aggiornamenti.',
          },
          docs: 'https://react.dev/reference/react/useState',
        },
      },
      {
        id: '9eb59585-35bd-409c-af31-5456f656b108',
        data: {
          question: {
            en: 'How do you correctly increment state 3 times in a single event handler?',
            fr: 'Comment incrémenter correctement l\'état 3 fois dans un seul gestionnaire d\'événement ?',
            de: 'Wie inkrementieren Sie State korrekt 3-mal in einem einzelnen Event-Handler?',
            es: '¿Cómo se incrementa correctamente el estado 3 veces en un solo manejador de eventos?',
            it: 'Come si incrementa correttamente lo stato 3 volte in un singolo gestore di eventi?',
          },
          choices: {
            en: [
              'setCount(c => c + 1); setCount(c => c + 1); setCount(c => c + 1);',
              'Both A and B are correct',
              'setCount(count + 3);',
              'setCount(count + 1); setCount(count + 1); setCount(count + 1);',
            ],
            fr: [
              'setCount(c => c + 1); setCount(c => c + 1); setCount(c => c + 1);',
              'A et B sont tous les deux corrects',
              'setCount(count + 3);',
              'setCount(count + 1); setCount(count + 1); setCount(count + 1);',
            ],
            de: [
              'setCount(c => c + 1); setCount(c => c + 1); setCount(c => c + 1);',
              'Sowohl A als auch B sind korrekt',
              'setCount(count + 3);',
              'setCount(count + 1); setCount(count + 1); setCount(count + 1);',
            ],
            es: [
              'setCount(c => c + 1); setCount(c => c + 1); setCount(c => c + 1);',
              'Tanto A como B son correctos',
              'setCount(count + 3);',
              'setCount(count + 1); setCount(count + 1); setCount(count + 1);',
            ],
            it: [
              'setCount(c => c + 1); setCount(c => c + 1); setCount(c => c + 1);',
              'Sia A che B sono corretti',
              'setCount(count + 3);',
              'setCount(count + 1); setCount(count + 1); setCount(count + 1);',
            ],
          },
          answer: '1',
          tags: ['useState', 'state-snapshot'],
          explanation: {
            en: 'Option A uses updater functions which React queues and applies sequentially, yielding +3. Option B directly adds 3, also yielding +3. Both work. Option C (the wrong pattern) uses the captured snapshot value so all three enqueue the same value and only increment by 1.',
            fr: 'L\'option A utilise des fonctions de mise à jour que React met en file et applique séquentiellement, donnant +3. L\'option B ajoute directement 3, donnant également +3. Les deux fonctionnent. L\'option C (le mauvais pattern) utilise la valeur d\'instantané capturée, donc les trois mettent en file la même valeur et n\'incrémentent que de 1.',
            de: 'Option A verwendet Updater-Funktionen, die React in die Warteschlange stellt und sequenziell anwendet, was +3 ergibt. Option B addiert direkt 3, was ebenfalls +3 ergibt. Beide funktionieren. Option C (das falsche Muster) verwendet den erfassten Snapshot-Wert, sodass alle drei denselben Wert einreihen und nur um 1 inkrementieren.',
            es: 'La opción A usa funciones actualizadoras que React encola y aplica secuencialmente, dando +3. La opción B agrega directamente 3, también dando +3. Ambas funcionan. La opción C (el patrón incorrecto) usa el valor de instantánea capturado, por lo que las tres encolan el mismo valor y solo incrementan en 1.',
            it: 'L\'opzione A usa funzioni aggiornatore che React accoda e applica in sequenza, producendo +3. L\'opzione B aggiunge direttamente 3, producendo anch\'essa +3. Entrambe funzionano. L\'opzione C (il pattern sbagliato) usa il valore di snapshot catturato, quindi tutte e tre accodano lo stesso valore e incrementano solo di 1.',
          },
          docs: 'https://react.dev/reference/react/useState',
        },
      },
      {
        id: 'c627705a-9944-4226-8402-037a3e1bd0c1',
        data: {
          question: {
            en: 'In React 18+, when does React batch state updates?',
            fr: 'Dans React 18+, quand React regroupe-t-il les mises à jour d\'état ?',
            de: 'Wann bündelt React in React 18+ State-Updates?',
            es: '¿En React 18+, cuándo agrupa React las actualizaciones de estado?',
            it: 'In React 18+, quando React raggruppa gli aggiornamenti di stato?',
          },
          choices: {
            en: [
              'Only inside React synthetic event handlers',
              'Only when you explicitly call ReactDOM.unstable_batchedUpdates()',
              'All state updates are automatically batched, including inside setTimeout, Promises, and native event handlers',
              'Batching only happens in class components',
            ],
            fr: [
              'Uniquement dans les gestionnaires d\'événements synthétiques React',
              'Uniquement lorsque vous appelez explicitement ReactDOM.unstable_batchedUpdates()',
              'Toutes les mises à jour d\'état sont automatiquement regroupées, y compris dans setTimeout, les Promises et les gestionnaires d\'événements natifs',
              'Le regroupement ne se produit que dans les class components',
            ],
            de: [
              'Nur innerhalb von React-Synthetic-Event-Handlern',
              'Nur wenn Sie explizit ReactDOM.unstable_batchedUpdates() aufrufen',
              'Alle State-Updates werden automatisch gebündelt, einschließlich innerhalb von setTimeout, Promises und nativen Event-Handlern',
              'Batching erfolgt nur in Class Components',
            ],
            es: [
              'Solo dentro de manejadores de eventos sintéticos de React',
              'Solo cuando llamas explícitamente a ReactDOM.unstable_batchedUpdates()',
              'Todas las actualizaciones de estado se agrupan automáticamente, incluso dentro de setTimeout, Promises y manejadores de eventos nativos',
              'El agrupamiento solo ocurre en class components',
            ],
            it: [
              'Solo all\'interno dei gestori di eventi sintetici di React',
              'Solo quando chiami esplicitamente ReactDOM.unstable_batchedUpdates()',
              'Tutti gli aggiornamenti di stato vengono raggruppati automaticamente, inclusi quelli dentro setTimeout, Promise e gestori di eventi nativi',
              'Il raggruppamento avviene solo nei class component',
            ],
          },
          answer: '2',
          tags: ['batching'],
          explanation: {
            en: 'React 18 introduced automatic batching for all state updates regardless of where they originate — event handlers, setTimeout, Promises, native DOM events. Before React 18, only updates inside React synthetic events were batched. This reduces unnecessary re-renders.',
            fr: 'React 18 a introduit le regroupement automatique pour toutes les mises à jour d\'état, peu importe d\'où elles proviennent — gestionnaires d\'événements, setTimeout, Promises, événements DOM natifs. Avant React 18, seules les mises à jour dans les événements synthétiques React étaient regroupées. Cela réduit les rendus inutiles.',
            de: 'React 18 führte automatisches Batching für alle State-Updates ein, unabhängig von ihrer Herkunft — Event-Handler, setTimeout, Promises, native DOM-Events. Vor React 18 wurden nur Updates innerhalb von React-Synthetic-Events gebündelt. Dies reduziert unnötige Re-Renders.',
            es: 'React 18 introdujo el agrupamiento automático para todas las actualizaciones de estado, independientemente de dónde se originen — manejadores de eventos, setTimeout, Promises, eventos DOM nativos. Antes de React 18, solo se agrupaban las actualizaciones dentro de eventos sintéticos de React. Esto reduce renderizados innecesarios.',
            it: 'React 18 ha introdotto il raggruppamento automatico per tutti gli aggiornamenti di stato, indipendentemente dalla loro origine — gestori di eventi, setTimeout, Promise, eventi DOM nativi. Prima di React 18, venivano raggruppati solo gli aggiornamenti all\'interno degli eventi sintetici di React. Questo riduce i re-render non necessari.',
          },
          docs: 'https://react.dev/learn/queueing-a-series-of-state-updates',
        },
      },
      {
        id: '5158f987-d819-4c10-9c30-75b986afe3cb',
        data: {
          question: {
            en: 'What is wrong with this state update?\n\nconst [user, setUser] = useState({ name: \'Alice\', age: 30 });\nfunction birthday() {\n  user.age += 1;\n  setUser(user);\n}',
            fr: 'Quel est le problème avec cette mise à jour d\'état ?\n\nconst [user, setUser] = useState({ name: \'Alice\', age: 30 });\nfunction birthday() {\n  user.age += 1;\n  setUser(user);\n}',
            de: 'Was ist falsch an diesem State-Update?\n\nconst [user, setUser] = useState({ name: \'Alice\', age: 30 });\nfunction birthday() {\n  user.age += 1;\n  setUser(user);\n}',
            es: '¿Qué está mal con esta actualización de estado?\n\nconst [user, setUser] = useState({ name: \'Alice\', age: 30 });\nfunction birthday() {\n  user.age += 1;\n  setUser(user);\n}',
            it: 'Cosa c\'è di sbagliato in questo aggiornamento di stato?\n\nconst [user, setUser] = useState({ name: \'Alice\', age: 30 });\nfunction birthday() {\n  user.age += 1;\n  setUser(user);\n}',
          },
          choices: {
            en: [
              'setUser must receive a primitive, not an object',
              'user.age is a read-only property in React',
              'Nothing is wrong — this is correct',
              'Mutating the state object directly; React may not detect the change and re-render',
            ],
            fr: [
              'setUser doit recevoir un primitif, pas un objet',
              'user.age est une propriété en lecture seule dans React',
              'Rien n\'est faux — c\'est correct',
              'Mutation directe de l\'objet d\'état ; React peut ne pas détecter le changement et re-rendre',
            ],
            de: [
              'setUser muss einen Primitiv erhalten, kein Objekt',
              'user.age ist eine schreibgeschützte Eigenschaft in React',
              'Nichts ist falsch — das ist korrekt',
              'Direktes Mutieren des State-Objekts; React erkennt die Änderung möglicherweise nicht und rendert nicht neu',
            ],
            es: [
              'setUser debe recibir un primitivo, no un objeto',
              'user.age es una propiedad de solo lectura en React',
              'Nada está mal — esto es correcto',
              'Mutar el objeto de estado directamente; React puede no detectar el cambio y re-renderizar',
            ],
            it: [
              'setUser deve ricevere un primitivo, non un oggetto',
              'user.age è una proprietà di sola lettura in React',
              'Non c\'è nulla di sbagliato — questo è corretto',
              'Mutare l\'oggetto di stato direttamente; React potrebbe non rilevare il cambiamento e ri-renderizzare',
            ],
          },
          answer: '3',
          tags: ['immutability'],
          explanation: {
            en: 'React uses referential equality to detect state changes. Since `user` is mutated in place (same object reference), React sees the old and new state as identical and may skip the re-render. Always create a new object: `setUser({ ...user, age: user.age + 1 })`.',
            fr: 'React utilise l\'égalité référentielle pour détecter les changements d\'état. Puisque `user` est muté sur place (même référence d\'objet), React voit l\'ancien et le nouvel état comme identiques et peut sauter le rendu. Créez toujours un nouvel objet : `setUser({ ...user, age: user.age + 1 })`.',
            de: 'React verwendet referentielle Gleichheit, um State-Änderungen zu erkennen. Da `user` an Ort und Stelle mutiert wird (dieselbe Objektreferenz), sieht React den alten und neuen State als identisch an und überspringt möglicherweise das Re-Rendering. Erstellen Sie immer ein neues Objekt: `setUser({ ...user, age: user.age + 1 })`.',
            es: 'React usa igualdad referencial para detectar cambios de estado. Como `user` se muta en el lugar (misma referencia de objeto), React ve el estado antiguo y nuevo como idénticos y puede omitir el re-renderizado. Siempre crea un nuevo objeto: `setUser({ ...user, age: user.age + 1 })`.',
            it: 'React usa l\'uguaglianza referenziale per rilevare i cambiamenti di stato. Poiché `user` viene mutato sul posto (stessa referenza all\'oggetto), React vede il vecchio e il nuovo stato come identici e potrebbe saltare il ri-rendering. Crea sempre un nuovo oggetto: `setUser({ ...user, age: user.age + 1 })`.',
          },
          docs: 'https://react.dev/learn/updating-objects-in-state',
        },
      },
      {
        id: '14992f80-8c70-4492-a5ee-ff769d8d7c55',
        data: {
          question: {
            en: 'You have an array in state: `const [items, setItems] = useState([1, 2, 3])`. How do you correctly add a new item `4`?',
            fr: 'Vous avez un tableau dans l\'état : `const [items, setItems] = useState([1, 2, 3])`. Comment ajouter correctement un nouvel élément `4` ?',
            de: 'Sie haben ein Array im State: `const [items, setItems] = useState([1, 2, 3])`. Wie fügen Sie korrekt ein neues Element `4` hinzu?',
            es: 'Tienes un array en el estado: `const [items, setItems] = useState([1, 2, 3])`. ¿Cómo agregas correctamente un nuevo elemento `4`?',
            it: 'Hai un array nello stato: `const [items, setItems] = useState([1, 2, 3])`. Come aggiungi correttamente un nuovo elemento `4`?',
          },
          choices: {
            en: [
              'setItems([...items, 4])',
              'items.push(4); setItems(items);',
              'setItems(items.push(4));',
              'setItems(items.concat); ',
            ],
            fr: [
              'setItems([...items, 4])',
              'items.push(4); setItems(items);',
              'setItems(items.push(4));',
              'setItems(items.concat); ',
            ],
            de: [
              'setItems([...items, 4])',
              'items.push(4); setItems(items);',
              'setItems(items.push(4));',
              'setItems(items.concat); ',
            ],
            es: [
              'setItems([...items, 4])',
              'items.push(4); setItems(items);',
              'setItems(items.push(4));',
              'setItems(items.concat); ',
            ],
            it: [
              'setItems([...items, 4])',
              'items.push(4); setItems(items);',
              'setItems(items.push(4));',
              'setItems(items.concat); ',
            ],
          },
          answer: '0',
          tags: ['immutability'],
          explanation: {
            en: 'Creating a new array with the spread operator gives React a new reference to compare. `items.push(4)` mutates the existing array and returns the new length (not the array), causing both bugs. Always use non-mutating array methods or spread to update array state.',
            fr: 'Créer un nouveau tableau avec l\'opérateur spread donne à React une nouvelle référence à comparer. `items.push(4)` mute le tableau existant et retourne la nouvelle longueur (pas le tableau), causant deux bugs. Utilisez toujours des méthodes de tableau non mutantes ou spread pour mettre à jour l\'état du tableau.',
            de: 'Das Erstellen eines neuen Arrays mit dem Spread-Operator gibt React eine neue Referenz zum Vergleichen. `items.push(4)` mutiert das vorhandene Array und gibt die neue Länge zurück (nicht das Array), was beide Bugs verursacht. Verwenden Sie immer nicht-mutierende Array-Methoden oder Spread, um den Array-State zu aktualisieren.',
            es: 'Crear un nuevo array con el operador spread le da a React una nueva referencia para comparar. `items.push(4)` muta el array existente y devuelve la nueva longitud (no el array), causando ambos errores. Siempre usa métodos de array no mutantes o spread para actualizar el estado del array.',
            it: 'Creare un nuovo array con l\'operatore spread fornisce a React un nuovo riferimento da confrontare. `items.push(4)` muta l\'array esistente e restituisce la nuova lunghezza (non l\'array), causando entrambi i bug. Usa sempre metodi di array non mutanti o spread per aggiornare lo stato dell\'array.',
          },
          docs: 'https://react.dev/learn/updating-objects-in-state',
        },
      },
      {
        id: '396a78cc-d3fc-4ea8-9ed5-29e1bd09b97b',
        data: {
          question: {
            en: 'You have `const [list, setList] = useState([{id:1,done:false},{id:2,done:false}])`. How do you toggle `done` for id=1 correctly?',
            fr: 'Vous avez `const [list, setList] = useState([{id:1,done:false},{id:2,done:false}])`. Comment basculer `done` pour id=1 correctement ?',
            de: 'Sie haben `const [list, setList] = useState([{id:1,done:false},{id:2,done:false}])`. Wie schalten Sie `done` für id=1 korrekt um?',
            es: 'Tienes `const [list, setList] = useState([{id:1,done:false},{id:2,done:false}])`. ¿Cómo cambias `done` para id=1 correctamente?',
            it: 'Hai `const [list, setList] = useState([{id:1,done:false},{id:2,done:false}])`. Come modifichi `done` per id=1 correttamente?',
          },
          choices: {
            en: [
              'list[0].done = true; setList(list);',
              'setList(list.filter(item => item.id !== 1).push({id:1,done:true}))',
              'setList(list.map(item => item.id === 1 ? { ...item, done: !item.done } : item))',
              'setList([...list, {id:1,done:true}])',
            ],
            fr: [
              'list[0].done = true; setList(list);',
              'setList(list.filter(item => item.id !== 1).push({id:1,done:true}))',
              'setList(list.map(item => item.id === 1 ? { ...item, done: !item.done } : item))',
              'setList([...list, {id:1,done:true}])',
            ],
            de: [
              'list[0].done = true; setList(list);',
              'setList(list.filter(item => item.id !== 1).push({id:1,done:true}))',
              'setList(list.map(item => item.id === 1 ? { ...item, done: !item.done } : item))',
              'setList([...list, {id:1,done:true}])',
            ],
            es: [
              'list[0].done = true; setList(list);',
              'setList(list.filter(item => item.id !== 1).push({id:1,done:true}))',
              'setList(list.map(item => item.id === 1 ? { ...item, done: !item.done } : item))',
              'setList([...list, {id:1,done:true}])',
            ],
            it: [
              'list[0].done = true; setList(list);',
              'setList(list.filter(item => item.id !== 1).push({id:1,done:true}))',
              'setList(list.map(item => item.id === 1 ? { ...item, done: !item.done } : item))',
              'setList([...list, {id:1,done:true}])',
            ],
          },
          answer: '2',
          tags: ['immutability'],
          explanation: {
            en: 'Using `.map()` to produce a new array where only the matching item is replaced with a spread copy is the idiomatic pattern. It preserves immutability (new array, new object for the changed item) while keeping all other elements untouched.',
            fr: 'Utiliser `.map()` pour produire un nouveau tableau où seul l\'élément correspondant est remplacé par une copie spread est le pattern idiomatique. Il préserve l\'immutabilité (nouveau tableau, nouvel objet pour l\'élément modifié) tout en gardant tous les autres éléments intacts.',
            de: 'Die Verwendung von `.map()`, um ein neues Array zu erzeugen, bei dem nur das übereinstimmende Element durch eine Spread-Kopie ersetzt wird, ist das idiomatische Muster. Es bewahrt die Unveränderlichkeit (neues Array, neues Objekt für das geänderte Element), während alle anderen Elemente unberührt bleiben.',
            es: 'Usar `.map()` para producir un nuevo array donde solo el elemento coincidente se reemplaza con una copia spread es el patrón idiomático. Preserva la inmutabilidad (nuevo array, nuevo objeto para el elemento cambiado) mientras mantiene todos los demás elementos intactos.',
            it: 'Usare `.map()` per produrre un nuovo array dove solo l\'elemento corrispondente viene sostituito con una copia spread è il pattern idiomatico. Preserva l\'immutabilità (nuovo array, nuovo oggetto per l\'elemento modificato) mantenendo tutti gli altri elementi intatti.',
          },
          docs: 'https://react.dev/learn/updating-objects-in-state',
        },
      },
      {
        id: '13cf93f1-16dc-4efd-a7dc-d6b9a89faac3',
        data: {
          question: {
            en: 'How do you prevent the default form submission behaviour in a React event handler?',
            fr: 'Comment empêcher le comportement de soumission de formulaire par défaut dans un gestionnaire d\'événement React ?',
            de: 'Wie verhindern Sie das Standard-Formularübermittlungsverhalten in einem React-Event-Handler?',
            es: '¿Cómo se previene el comportamiento de envío de formulario predeterminado en un manejador de eventos de React?',
            it: 'Come si previene il comportamento di invio del form predefinito in un gestore di eventi React?',
          },
          choices: {
            en: [
              'Return false from the handler',
              'Call event.preventDefault() inside the handler',
              'Set the form\'s action attribute to \'#\'',
              'Use onSubmitCapture instead of onSubmit',
            ],
            fr: [
              'Retourner false depuis le gestionnaire',
              'Appeler event.preventDefault() dans le gestionnaire',
              'Définir l\'attribut action du formulaire à \'#\'',
              'Utiliser onSubmitCapture au lieu de onSubmit',
            ],
            de: [
              'False vom Handler zurückgeben',
              'event.preventDefault() innerhalb des Handlers aufrufen',
              'Das action-Attribut des Formulars auf \'#\' setzen',
              'onSubmitCapture anstelle von onSubmit verwenden',
            ],
            es: [
              'Retornar false desde el manejador',
              'Llamar a event.preventDefault() dentro del manejador',
              'Establecer el atributo action del formulario en \'#\'',
              'Usar onSubmitCapture en lugar de onSubmit',
            ],
            it: [
              'Restituire false dal gestore',
              'Chiamare event.preventDefault() all\'interno del gestore',
              'Impostare l\'attributo action del form su \'#\'',
              'Usare onSubmitCapture invece di onSubmit',
            ],
          },
          answer: '1',
          tags: ['events'],
          explanation: {
            en: 'In React, you must call `event.preventDefault()` explicitly. Unlike HTML\'s inline event handlers, returning `false` from a React event handler does NOT prevent default behaviour. React\'s SyntheticEvent wraps the native event and exposes the same preventDefault() method.',
            fr: 'Dans React, vous devez appeler `event.preventDefault()` explicitement. Contrairement aux gestionnaires d\'événements inline HTML, retourner `false` depuis un gestionnaire d\'événement React ne prévient PAS le comportement par défaut. Le SyntheticEvent de React enveloppe l\'événement natif et expose la même méthode preventDefault().',
            de: 'In React müssen Sie `event.preventDefault()` explizit aufrufen. Im Gegensatz zu HTML-Inline-Event-Handlern verhindert die Rückgabe von `false` aus einem React-Event-Handler NICHT das Standardverhalten. Reacts SyntheticEvent umhüllt das native Event und stellt dieselbe preventDefault()-Methode bereit.',
            es: 'En React, debes llamar a `event.preventDefault()` explícitamente. A diferencia de los manejadores de eventos inline de HTML, devolver `false` desde un manejador de eventos de React NO previene el comportamiento predeterminado. El SyntheticEvent de React envuelve el evento nativo y expone el mismo método preventDefault().',
            it: 'In React, devi chiamare `event.preventDefault()` esplicitamente. A differenza dei gestori di eventi inline di HTML, restituire `false` da un gestore di eventi React NON previene il comportamento predefinito. Il SyntheticEvent di React avvolge l\'evento nativo ed espone lo stesso metodo preventDefault().',
          },
          docs: 'https://react.dev/learn/responding-to-events',
        },
      },
      {
        id: '83e93ac7-9c5b-4db3-916c-5fbb519175d3',
        data: {
          question: {
            en: 'What is the `useState` lazy initialization pattern and when should you use it?',
            fr: 'Qu\'est-ce que le pattern d\'initialisation paresseuse `useState` et quand devriez-vous l\'utiliser ?',
            de: 'Was ist das `useState` Lazy-Initialization-Pattern und wann sollten Sie es verwenden?',
            es: '¿Qué es el patrón de inicialización perezosa de `useState` y cuándo deberías usarlo?',
            it: 'Cos\'è il pattern di inizializzazione lazy di `useState` e quando dovresti usarlo?',
          },
          choices: {
            en: [
              'Pass a function to useState; it runs on every render for fresh data',
              'It is used to initialize state from an API call',
              'It is identical to `useState(computeExpensiveInitialValue())`',
              'Pass a function to useState; it runs only once on mount, avoiding expensive recalculation on every render',
            ],
            fr: [
              'Passer une fonction à useState ; elle s\'exécute à chaque rendu pour des données fraîches',
              'Elle est utilisée pour initialiser l\'état depuis un appel API',
              'C\'est identique à `useState(computeExpensiveInitialValue())`',
              'Passer une fonction à useState ; elle s\'exécute une seule fois au montage, évitant un recalcul coûteux à chaque rendu',
            ],
            de: [
              'Eine Funktion an useState übergeben; sie wird bei jedem Rendering für neue Daten ausgeführt',
              'Es wird verwendet, um State aus einem API-Aufruf zu initialisieren',
              'Es ist identisch mit `useState(computeExpensiveInitialValue())`',
              'Eine Funktion an useState übergeben; sie wird nur einmal beim Mounten ausgeführt und vermeidet teure Neuberechnungen bei jedem Rendering',
            ],
            es: [
              'Pasar una función a useState; se ejecuta en cada renderizado para datos frescos',
              'Se usa para inicializar el estado desde una llamada API',
              'Es idéntico a `useState(computeExpensiveInitialValue())`',
              'Pasar una función a useState; se ejecuta solo una vez al montar, evitando recálculos costosos en cada renderizado',
            ],
            it: [
              'Passare una funzione a useState; viene eseguita ad ogni rendering per dati freschi',
              'Viene usata per inizializzare lo stato da una chiamata API',
              'È identica a `useState(computeExpensiveInitialValue())`',
              'Passare una funzione a useState; viene eseguita solo una volta al mount, evitando ricalcoli costosi ad ogni rendering',
            ],
          },
          answer: '3',
          tags: ['useState'],
          explanation: {
            en: 'When you pass a function (initializer) to useState, React calls it only during the first render. If you pass the result directly (e.g., `useState(expensiveCalc())`), the function is called on every render even though only the first call\'s result is used. The lazy form avoids this waste.',
            fr: 'Lorsque vous passez une fonction (initialiseur) à useState, React l\'appelle uniquement lors du premier rendu. Si vous passez le résultat directement (par ex., `useState(expensiveCalc())`), la fonction est appelée à chaque rendu même si seul le résultat du premier appel est utilisé. La forme paresseuse évite ce gaspillage.',
            de: 'Wenn Sie eine Funktion (Initialisierer) an useState übergeben, ruft React sie nur beim ersten Rendering auf. Wenn Sie das Ergebnis direkt übergeben (z.B. `useState(expensiveCalc())`), wird die Funktion bei jedem Rendering aufgerufen, obwohl nur das Ergebnis des ersten Aufrufs verwendet wird. Die Lazy-Form vermeidet diese Verschwendung.',
            es: 'Cuando pasas una función (inicializador) a useState, React la llama solo durante el primer renderizado. Si pasas el resultado directamente (p. ej., `useState(expensiveCalc())`), la función se llama en cada renderizado aunque solo se use el resultado de la primera llamada. La forma perezosa evita este desperdicio.',
            it: 'Quando passi una funzione (inizializzatore) a useState, React la chiama solo durante il primo rendering. Se passi il risultato direttamente (ad es., `useState(expensiveCalc())`), la funzione viene chiamata ad ogni rendering anche se viene usato solo il risultato della prima chiamata. La forma lazy evita questo spreco.',
          },
          docs: 'https://react.dev/reference/react/useState',
        },
      },
      {
        id: '69987e18-6bf7-4858-ae26-515b1733f58b',
        data: {
          question: {
            en: 'In React 19, what is an \'Action\' in the context of form handling?',
            fr: 'Dans React 19, qu\'est-ce qu\'une \'Action\' dans le contexte de la gestion des formulaires ?',
            de: 'Was ist in React 19 eine \'Action\' im Kontext der Formularverarbeitung?',
            es: 'En React 19, ¿qué es una \'Action\' en el contexto del manejo de formularios?',
            it: 'In React 19, cos\'è un\'\'Action\' nel contesto della gestione dei form?',
          },
          choices: {
            en: [
              'An async function passed to a form\'s action prop that React automatically wraps with pending/error state management',
              'A Redux action creator used inside a form component',
              'A server-side function that validates form data',
              'A custom event dispatched when a form submits',
            ],
            fr: [
              'Une fonction async passée à la prop action d\'un formulaire que React enveloppe automatiquement avec une gestion d\'état pending/error',
              'Un Redux action creator utilisé dans un composant de formulaire',
              'Une fonction côté serveur qui valide les données du formulaire',
              'Un événement personnalisé dispatché lorsqu\'un formulaire est soumis',
            ],
            de: [
              'Eine async-Funktion, die an die action-Prop eines Formulars übergeben wird und die React automatisch mit Pending/Error-State-Management umhüllt',
              'Ein Redux-Action-Creator, der innerhalb einer Formular-Komponente verwendet wird',
              'Eine serverseitige Funktion, die Formulardaten validiert',
              'Ein benutzerdefiniertes Event, das beim Absenden eines Formulars ausgelöst wird',
            ],
            es: [
              'Una función async pasada a la prop action de un formulario que React envuelve automáticamente con gestión de estado pending/error',
              'Un Redux action creator usado dentro de un componente de formulario',
              'Una función del lado del servidor que valida datos de formulario',
              'Un evento personalizado despachado cuando un formulario se envía',
            ],
            it: [
              'Una funzione async passata alla prop action di un form che React avvolge automaticamente con gestione dello stato pending/error',
              'Un Redux action creator usato all\'interno di un componente form',
              'Una funzione lato server che valida i dati del form',
              'Un evento personalizzato inviato quando un form viene inviato',
            ],
          },
          answer: '0',
          tags: ['react-19', 'actions'],
          explanation: {
            en: 'React 19 introduces support for async functions as form actions. You pass an async function to `<form action={myAction}>` and React manages the transition state automatically. This pairs with useFormStatus and useOptimistic to give full pending/optimistic UI without manual state.',
            fr: 'React 19 introduit le support des fonctions async comme actions de formulaire. Vous passez une fonction async à `<form action={myAction}>` et React gère automatiquement l\'état de transition. Cela se combine avec useFormStatus et useOptimistic pour offrir une UI pending/optimiste complète sans état manuel.',
            de: 'React 19 führt Unterstützung für async-Funktionen als Formular-Actions ein. Sie übergeben eine async-Funktion an `<form action={myAction}>` und React verwaltet den Übergangszustand automatisch. Dies funktioniert zusammen mit useFormStatus und useOptimistic, um eine vollständige Pending/Optimistic-UI ohne manuellen State zu bieten.',
            es: 'React 19 introduce soporte para funciones async como acciones de formulario. Pasas una función async a `<form action={myAction}>` y React gestiona el estado de transición automáticamente. Esto se combina con useFormStatus y useOptimistic para dar una UI completa pending/optimista sin estado manual.',
            it: 'React 19 introduce il supporto per funzioni async come azioni di form. Passi una funzione async a `<form action={myAction}>` e React gestisce automaticamente lo stato di transizione. Questo si abbina a useFormStatus e useOptimistic per fornire una UI pending/ottimistica completa senza stato manuale.',
          },
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: '2c26aca1-a1d6-44d5-b51f-4c95bb299c8d',
        data: {
          question: {
            en: 'What does `useOptimistic` do in React 19?',
            fr: 'Que fait `useOptimistic` dans React 19 ?',
            de: 'Was macht `useOptimistic` in React 19?',
            es: '¿Qué hace `useOptimistic` en React 19?',
            it: 'Cosa fa `useOptimistic` in React 19?',
          },
          choices: {
            en: [
              'Memoizes the result of an expensive render to avoid re-computation',
              'Shows a temporary optimistic UI state during an async operation, reverting to real state when the operation completes',
              'Defers a state update to after the browser has painted',
              'Prefetches data before a component mounts',
            ],
            fr: [
              'Mémorise le résultat d\'un rendu coûteux pour éviter le recalcul',
              'Affiche un état UI optimiste temporaire pendant une opération async, revenant à l\'état réel lorsque l\'opération se termine',
              'Reporte une mise à jour d\'état après que le navigateur a peint',
              'Précharge les données avant qu\'un composant ne se monte',
            ],
            de: [
              'Speichert das Ergebnis eines teuren Renderings zwischen, um Neuberechnungen zu vermeiden',
              'Zeigt einen temporären optimistischen UI-Zustand während einer async-Operation an und kehrt zum realen Zustand zurück, wenn die Operation abgeschlossen ist',
              'Verschiebt ein State-Update auf nach dem Browser-Paint',
              'Lädt Daten vor, bevor eine Komponente gemountet wird',
            ],
            es: [
              'Memoriza el resultado de un renderizado costoso para evitar recálculo',
              'Muestra un estado de UI optimista temporal durante una operación async, revirtiendo al estado real cuando la operación se completa',
              'Difiere una actualización de estado hasta después de que el navegador haya pintado',
              'Precarga datos antes de que un componente se monte',
            ],
            it: [
              'Memorizza il risultato di un rendering costoso per evitare ricalcoli',
              'Mostra uno stato UI ottimistico temporaneo durante un\'operazione async, ritornando allo stato reale quando l\'operazione si completa',
              'Rinvia un aggiornamento di stato a dopo che il browser ha dipinto',
              'Precarica i dati prima che un componente venga montato',
            ],
          },
          answer: '1',
          tags: ['react-19', 'useOptimistic'],
          explanation: {
            en: 'useOptimistic(state, updateFn) returns an optimistic value that immediately reflects the intended future state. While the async operation is in-flight, the optimistic value is shown. If the operation succeeds, React syncs to real state; if it fails, it reverts. This creates snappy perceived performance.',
            fr: 'useOptimistic(state, updateFn) retourne une valeur optimiste qui reflète immédiatement l\'état futur prévu. Pendant que l\'opération async est en cours, la valeur optimiste est affichée. Si l\'opération réussit, React se synchronise avec l\'état réel ; si elle échoue, elle revient. Cela crée une performance perçue rapide.',
            de: 'useOptimistic(state, updateFn) gibt einen optimistischen Wert zurück, der sofort den beabsichtigten zukünftigen Zustand widerspiegelt. Während die async-Operation läuft, wird der optimistische Wert angezeigt. Wenn die Operation erfolgreich ist, synchronisiert React zum realen State; wenn sie fehlschlägt, kehrt es zurück. Dies schafft eine wahrgenommene flotte Performance.',
            es: 'useOptimistic(state, updateFn) devuelve un valor optimista que refleja inmediatamente el estado futuro previsto. Mientras la operación async está en curso, se muestra el valor optimista. Si la operación tiene éxito, React sincroniza con el estado real; si falla, revierte. Esto crea un rendimiento percibido ágil.',
            it: 'useOptimistic(state, updateFn) restituisce un valore ottimistico che riflette immediatamente lo stato futuro previsto. Mentre l\'operazione async è in corso, viene mostrato il valore ottimistico. Se l\'operazione ha successo, React sincronizza allo stato reale; se fallisce, ripristina. Questo crea una performance percepita scattante.',
          },
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: 'ffddb8ae-ce2a-4b88-97db-8babc124f3a1',
        data: {
          question: {
            en: 'Which statement about `useFormStatus` in React 19 is correct?',
            fr: 'Quelle affirmation à propos de `useFormStatus` dans React 19 est correcte ?',
            de: 'Welche Aussage über `useFormStatus` in React 19 ist korrekt?',
            es: '¿Qué afirmación sobre `useFormStatus` en React 19 es correcta?',
            it: 'Quale affermazione su `useFormStatus` in React 19 è corretta?',
          },
          choices: {
            en: [
              'It can be called anywhere in the component tree to get global form status',
              'It replaces useState for all form-related state',
              'It is imported from \'react-dom/server\'',
              'It must be called inside a component that is a child of a <form> element to read that form\'s pending state',
            ],
            fr: [
              'Il peut être appelé n\'importe où dans l\'arbre de composants pour obtenir le statut global du formulaire',
              'Il remplace useState pour tout état lié aux formulaires',
              'Il est importé depuis \'react-dom/server\'',
              'Il doit être appelé dans un composant qui est un enfant d\'un élément <form> pour lire l\'état pending de ce formulaire',
            ],
            de: [
              'Es kann überall im Komponentenbaum aufgerufen werden, um den globalen Formularstatus zu erhalten',
              'Es ersetzt useState für alle formularbezogenen States',
              'Es wird aus \'react-dom/server\' importiert',
              'Es muss innerhalb einer Komponente aufgerufen werden, die ein Kind eines <form>-Elements ist, um den Pending-Zustand dieses Formulars zu lesen',
            ],
            es: [
              'Se puede llamar en cualquier lugar del árbol de componentes para obtener el estado global del formulario',
              'Reemplaza useState para todo el estado relacionado con formularios',
              'Se importa desde \'react-dom/server\'',
              'Debe llamarse dentro de un componente que sea hijo de un elemento <form> para leer el estado pendiente de ese formulario',
            ],
            it: [
              'Può essere chiamato ovunque nell\'albero dei componenti per ottenere lo stato globale del form',
              'Sostituisce useState per tutto lo stato relativo ai form',
              'Viene importato da \'react-dom/server\'',
              'Deve essere chiamato all\'interno di un componente che è figlio di un elemento <form> per leggere lo stato pending di quel form',
            ],
          },
          answer: '3',
          tags: ['react-19', 'useFormStatus'],
          explanation: {
            en: 'useFormStatus reads the status (pending, data, method, action) of the nearest ancestor <form> element. The component calling it must be rendered inside the form — it cannot read a sibling or parent form\'s status. Import it from \'react-dom\', not \'react\'.',
            fr: 'useFormStatus lit le statut (pending, data, method, action) de l\'élément <form> ancêtre le plus proche. Le composant qui l\'appelle doit être rendu à l\'intérieur du formulaire — il ne peut pas lire le statut d\'un formulaire frère ou parent. Importez-le depuis \'react-dom\', pas \'react\'.',
            de: 'useFormStatus liest den Status (pending, data, method, action) des nächsten vorfahren <form>-Elements. Die Komponente, die es aufruft, muss innerhalb des Formulars gerendert werden — sie kann nicht den Status eines Geschwister- oder Elternformulars lesen. Importieren Sie es aus \'react-dom\', nicht aus \'react\'.',
            es: 'useFormStatus lee el estado (pending, data, method, action) del elemento <form> ancestro más cercano. El componente que lo llama debe renderizarse dentro del formulario — no puede leer el estado de un formulario hermano o padre. Impórtalo desde \'react-dom\', no \'react\'.',
            it: 'useFormStatus legge lo stato (pending, data, method, action) dell\'elemento <form> antenato più vicino. Il componente che lo chiama deve essere renderizzato all\'interno del form — non può leggere lo stato di un form fratello o genitore. Importalo da \'react-dom\', non da \'react\'.',
          },
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: '7162c26a-955b-44e3-9fdf-2f398c5ab432',
        data: {
          question: {
            en: 'What will be alerted 3 seconds after clicking the button?\n\nconst [name, setName] = useState(\'Alice\');\nfunction handleClick() {\n  setTimeout(() => alert(name), 3000);\n}\n// User clicks, then immediately types changing name to \'Bob\'',
            fr: 'Qu\'est-ce qui sera affiché 3 secondes après avoir cliqué sur le bouton ?\n\nconst [name, setName] = useState(\'Alice\');\nfunction handleClick() {\n  setTimeout(() => alert(name), 3000);\n}\n// L\'utilisateur clique, puis tape immédiatement pour changer le nom en \'Bob\'',
            de: 'Was wird 3 Sekunden nach dem Klicken auf den Button angezeigt?\n\nconst [name, setName] = useState(\'Alice\');\nfunction handleClick() {\n  setTimeout(() => alert(name), 3000);\n}\n// Benutzer klickt, dann tippt sofort und ändert den Namen zu \'Bob\'',
            es: '¿Qué se alertará 3 segundos después de hacer clic en el botón?\n\nconst [name, setName] = useState(\'Alice\');\nfunction handleClick() {\n  setTimeout(() => alert(name), 3000);\n}\n// El usuario hace clic, luego escribe inmediatamente cambiando el nombre a \'Bob\'',
            it: 'Cosa verrà mostrato 3 secondi dopo aver cliccato il pulsante?\n\nconst [name, setName] = useState(\'Alice\');\nfunction handleClick() {\n  setTimeout(() => alert(name), 3000);\n}\n// L\'utente clicca, poi digita immediatamente cambiando il nome in \'Bob\'',
          },
          choices: {
            en: [
              '\'Bob\' — setTimeout reads the latest state',
              'undefined — state is cleared after 3 seconds',
              '\'Alice\' — the closure captures the snapshot value at click time',
              'An error — state cannot be read inside setTimeout',
            ],
            fr: [
              '\'Bob\' — setTimeout lit le dernier état',
              'undefined — l\'état est effacé après 3 secondes',
              '\'Alice\' — la fermeture capture la valeur d\'instantané au moment du clic',
              'Une erreur — l\'état ne peut pas être lu dans setTimeout',
            ],
            de: [
              '\'Bob\' — setTimeout liest den neuesten State',
              'undefined — State wird nach 3 Sekunden gelöscht',
              '\'Alice\' — die Closure erfasst den Snapshot-Wert zum Zeitpunkt des Klicks',
              'Ein Fehler — State kann nicht innerhalb von setTimeout gelesen werden',
            ],
            es: [
              '\'Bob\' — setTimeout lee el último estado',
              'undefined — el estado se borra después de 3 segundos',
              '\'Alice\' — el closure captura el valor de instantánea en el momento del clic',
              'Un error — el estado no se puede leer dentro de setTimeout',
            ],
            it: [
              '\'Bob\' — setTimeout legge lo stato più recente',
              'undefined — lo stato viene cancellato dopo 3 secondi',
              '\'Alice\' — la closure cattura il valore di snapshot al momento del clic',
              'Un errore — lo stato non può essere letto dentro setTimeout',
            ],
          },
          answer: '2',
          tags: ['state-snapshot'],
          explanation: {
            en: 'State in React is a snapshot per render. The setTimeout closure captures `name` from the render that created it (\'Alice\'). Even if state changes later, that closure holds the old value. To always read the latest state in async code, use a ref.',
            fr: 'L\'état dans React est un instantané par rendu. La fermeture setTimeout capture `name` depuis le rendu qui l\'a créé (\'Alice\'). Même si l\'état change plus tard, cette fermeture conserve l\'ancienne valeur. Pour toujours lire le dernier état dans du code async, utilisez une ref.',
            de: 'State in React ist ein Snapshot pro Rendering. Die setTimeout-Closure erfasst `name` aus dem Rendering, das sie erstellt hat (\'Alice\'). Auch wenn sich der State später ändert, hält diese Closure den alten Wert. Um immer den neuesten State in async-Code zu lesen, verwenden Sie eine Ref.',
            es: 'El estado en React es una instantánea por renderizado. El closure de setTimeout captura `name` desde el renderizado que lo creó (\'Alice\'). Incluso si el estado cambia después, ese closure mantiene el valor antiguo. Para leer siempre el último estado en código async, usa una ref.',
            it: 'Lo stato in React è uno snapshot per rendering. La closure di setTimeout cattura `name` dal rendering che l\'ha creata (\'Alice\'). Anche se lo stato cambia dopo, quella closure mantiene il vecchio valore. Per leggere sempre lo stato più recente nel codice async, usa una ref.',
          },
          docs: 'https://react.dev/learn/state-as-a-snapshot',
        },
      },
      {
        id: '6455038e-6fff-4fd7-8972-f815e687454d',
        data: {
          question: {
            en: 'What is event propagation (bubbling) and how do you stop it in React?',
            fr: 'Qu\'est-ce que la propagation d\'événements (bubbling) et comment l\'arrêter dans React ?',
            de: 'Was ist Event-Propagation (Bubbling) und wie stoppt man sie in React?',
            es: '¿Qué es la propagación de eventos (bubbling) y cómo se detiene en React?',
            it: 'Cos\'è la propagazione degli eventi (bubbling) e come la si ferma in React?',
          },
          choices: {
            en: [
              'Events bubble up from child to parent; call event.stopPropagation() to stop them',
              'Events trickle from parent to child; call event.preventDefault() to stop them',
              'React does not support event propagation',
              'Call event.stopImmediatePropagation() — stopPropagation is not available in React',
            ],
            fr: [
              'Les événements remontent de l\'enfant vers le parent ; appelez event.stopPropagation() pour les arrêter',
              'Les événements descendent du parent vers l\'enfant ; appelez event.preventDefault() pour les arrêter',
              'React ne supporte pas la propagation d\'événements',
              'Appelez event.stopImmediatePropagation() — stopPropagation n\'est pas disponible dans React',
            ],
            de: [
              'Events sprudeln vom Kind zum Elternteil; rufen Sie event.stopPropagation() auf, um sie zu stoppen',
              'Events tröpfeln vom Elternteil zum Kind; rufen Sie event.preventDefault() auf, um sie zu stoppen',
              'React unterstützt keine Event-Propagation',
              'Rufen Sie event.stopImmediatePropagation() auf — stopPropagation ist in React nicht verfügbar',
            ],
            es: [
              'Los eventos burbujean hacia arriba de hijo a padre; llama a event.stopPropagation() para detenerlos',
              'Los eventos gotean de padre a hijo; llama a event.preventDefault() para detenerlos',
              'React no admite la propagación de eventos',
              'Llama a event.stopImmediatePropagation() — stopPropagation no está disponible en React',
            ],
            it: [
              'Gli eventi risalgono dal figlio al genitore; chiama event.stopPropagation() per fermarli',
              'Gli eventi scendono dal genitore al figlio; chiama event.preventDefault() per fermarli',
              'React non supporta la propagazione degli eventi',
              'Chiama event.stopImmediatePropagation() — stopPropagation non è disponibile in React',
            ],
          },
          answer: '0',
          tags: ['events'],
          explanation: {
            en: 'Most React events bubble up the component tree (child → parent). `event.stopPropagation()` stops the event from reaching ancestor handlers. `event.preventDefault()` prevents the browser\'s default action (e.g., form submit, link navigation) — these are two separate concerns.',
            fr: 'La plupart des événements React remontent l\'arbre de composants (enfant → parent). `event.stopPropagation()` empêche l\'événement d\'atteindre les gestionnaires ancêtres. `event.preventDefault()` empêche l\'action par défaut du navigateur (par ex., soumission de formulaire, navigation de lien) — ce sont deux préoccupations distinctes.',
            de: 'Die meisten React-Events sprudeln den Komponentenbaum nach oben (Kind → Elternteil). `event.stopPropagation()` verhindert, dass das Event die Ancestor-Handler erreicht. `event.preventDefault()` verhindert die Standardaktion des Browsers (z.B. Formularübermittlung, Link-Navigation) — das sind zwei separate Belange.',
            es: 'La mayoría de los eventos de React burbujean hacia arriba en el árbol de componentes (hijo → padre). `event.stopPropagation()` detiene el evento para que no alcance los manejadores ancestros. `event.preventDefault()` previene la acción predeterminada del navegador (p. ej., envío de formulario, navegación de enlace) — son dos preocupaciones separadas.',
            it: 'La maggior parte degli eventi React risale l\'albero dei componenti (figlio → genitore). `event.stopPropagation()` impedisce all\'evento di raggiungere i gestori antenati. `event.preventDefault()` previene l\'azione predefinita del browser (ad es., invio form, navigazione link) — sono due problemi separati.',
          },
          docs: 'https://react.dev/learn/responding-to-events',
        },
      },
      {
        id: 'c8ce9b03-5593-45b0-a2f6-28e431e8b571',
        data: {
          question: {
            en: 'When does React re-render a component after a state update?',
            fr: 'Quand React re-rend-il un composant après une mise à jour d\'état ?',
            de: 'Wann rendert React eine Komponente nach einem State-Update neu?',
            es: '¿Cuándo re-renderiza React un componente después de una actualización de estado?',
            it: 'Quando React ri-renderizza un componente dopo un aggiornamento di stato?',
          },
          choices: {
            en: [
              'Every time setState is called, regardless of the new value',
              'Only on the next browser animation frame',
              'Only when the component\'s parent also re-renders',
              'When the new state value is different from the current state (using Object.is comparison)',
            ],
            fr: [
              'Chaque fois que setState est appelé, quelle que soit la nouvelle valeur',
              'Uniquement à la prochaine trame d\'animation du navigateur',
              'Uniquement lorsque le parent du composant re-rend également',
              'Lorsque la nouvelle valeur d\'état est différente de l\'état actuel (en utilisant la comparaison Object.is)',
            ],
            de: [
              'Jedes Mal, wenn setState aufgerufen wird, unabhängig vom neuen Wert',
              'Nur im nächsten Browser-Animationsframe',
              'Nur wenn das Elternteil der Komponente ebenfalls neu rendert',
              'Wenn der neue State-Wert vom aktuellen State unterschiedlich ist (unter Verwendung des Object.is-Vergleichs)',
            ],
            es: [
              'Cada vez que se llama a setState, independientemente del nuevo valor',
              'Solo en el próximo frame de animación del navegador',
              'Solo cuando el padre del componente también re-renderiza',
              'Cuando el nuevo valor de estado es diferente del estado actual (usando la comparación Object.is)',
            ],
            it: [
              'Ogni volta che setState viene chiamato, indipendentemente dal nuovo valore',
              'Solo al prossimo frame di animazione del browser',
              'Solo quando il genitore del componente ri-renderizza anch\'esso',
              'Quando il nuovo valore di stato è diverso dallo stato corrente (usando il confronto Object.is)',
            ],
          },
          answer: '3',
          tags: ['useState'],
          explanation: {
            en: 'React uses Object.is() to compare old and new state. If they are the same (e.g., setting a number to the same number), React bails out and skips the re-render. This is an important performance optimization — avoid creating new object references unnecessarily.',
            fr: 'React utilise Object.is() pour comparer l\'ancien et le nouvel état. S\'ils sont identiques (par ex., définir un nombre au même nombre), React abandonne et saute le rendu. C\'est une optimisation de performance importante — évitez de créer de nouvelles références d\'objet inutilement.',
            de: 'React verwendet Object.is(), um alten und neuen State zu vergleichen. Wenn sie gleich sind (z.B. eine Zahl auf dieselbe Zahl setzen), bricht React ab und überspringt das Re-Rendering. Dies ist eine wichtige Performance-Optimierung — vermeiden Sie es, unnötig neue Objektreferenzen zu erstellen.',
            es: 'React usa Object.is() para comparar el estado antiguo y nuevo. Si son iguales (p. ej., establecer un número al mismo número), React aborta y omite el re-renderizado. Esta es una optimización de rendimiento importante — evita crear nuevas referencias de objeto innecesariamente.',
            it: 'React usa Object.is() per confrontare lo stato vecchio e nuovo. Se sono uguali (ad es., impostare un numero allo stesso numero), React abbandona e salta il ri-rendering. Questa è un\'importante ottimizzazione delle prestazioni — evita di creare nuovi riferimenti agli oggetti inutilmente.',
          },
          docs: 'https://react.dev/reference/react/useState',
        },
      },
      {
        id: '862ef22f-cd48-4925-8297-6a8f11847b49',
        data: {
          question: {
            en: 'Which of the following are safe (immutable) ways to update an array in state? (Select all that apply)',
            fr: 'Lesquelles des méthodes suivantes sont des façons sûres (immuables) de mettre à jour un tableau dans l\'état ? (Sélectionnez toutes les réponses applicables)',
            de: 'Welche der folgenden Methoden sind sichere (unveränderliche) Wege, ein Array im State zu aktualisieren? (Wählen Sie alle zutreffenden aus)',
            es: '¿Cuáles de las siguientes son formas seguras (inmutables) de actualizar un array en el estado? (Selecciona todas las aplicables)',
            it: 'Quali dei seguenti sono modi sicuri (immutabili) per aggiornare un array nello stato? (Seleziona tutte le risposte applicabili)',
          },
          choices: {
            en: [
              'items.splice(index, 1)  — splice to remove',
              '[...items, newItem]  — spreading to add',
              'items.filter(i => i.id !== id)  — filtering to remove',
              'items.map(i => i.id === id ? {...i, done:true} : i)  — map to update',
            ],
            fr: [
              'items.splice(index, 1)  — splice pour retirer',
              '[...items, newItem]  — spread pour ajouter',
              'items.filter(i => i.id !== id)  — filtrage pour retirer',
              'items.map(i => i.id === id ? {...i, done:true} : i)  — map pour mettre à jour',
            ],
            de: [
              'items.splice(index, 1)  — splice zum Entfernen',
              '[...items, newItem]  — Spreading zum Hinzufügen',
              'items.filter(i => i.id !== id)  — Filtern zum Entfernen',
              'items.map(i => i.id === id ? {...i, done:true} : i)  — Map zum Aktualisieren',
            ],
            es: [
              'items.splice(index, 1)  — splice para eliminar',
              '[...items, newItem]  — spread para agregar',
              'items.filter(i => i.id !== id)  — filtrado para eliminar',
              'items.map(i => i.id === id ? {...i, done:true} : i)  — map para actualizar',
            ],
            it: [
              'items.splice(index, 1)  — splice per rimuovere',
              '[...items, newItem]  — spread per aggiungere',
              'items.filter(i => i.id !== id)  — filtraggio per rimuovere',
              'items.map(i => i.id === id ? {...i, done:true} : i)  — map per aggiornare',
            ],
          },
          answer: '[1,2,3]',
          tags: ['immutability', 'useState'],
          explanation: {
            en: 'Spread, filter, and map all return new arrays without mutating the original — these are safe for React state. Array.splice() mutates the array in place and returns removed elements, so it must be avoided. Use slice + spread as an alternative to splice.',
            fr: 'Spread, filter et map retournent tous de nouveaux tableaux sans muter l\'original — ils sont sûrs pour l\'état React. Array.splice() mute le tableau sur place et retourne les éléments retirés, il doit donc être évité. Utilisez slice + spread comme alternative à splice.',
            de: 'Spread, Filter und Map geben alle neue Arrays zurück, ohne das Original zu mutieren — diese sind sicher für React-State. Array.splice() mutiert das Array an Ort und Stelle und gibt entfernte Elemente zurück, daher muss es vermieden werden. Verwenden Sie slice + Spread als Alternative zu splice.',
            es: 'Spread, filter y map devuelven nuevos arrays sin mutar el original — estos son seguros para el estado de React. Array.splice() muta el array en el lugar y devuelve elementos eliminados, por lo que debe evitarse. Usa slice + spread como alternativa a splice.',
            it: 'Spread, filter e map restituiscono tutti nuovi array senza mutare l\'originale — questi sono sicuri per lo stato React. Array.splice() muta l\'array sul posto e restituisce elementi rimossi, quindi deve essere evitato. Usa slice + spread come alternativa a splice.',
          },
          docs: 'https://react.dev/learn/updating-objects-in-state',
        },
      },
      {
        id: 'ecb8c21a-56aa-482c-9187-2ad4837b6517',
        data: {
          question: {
            en: 'What is the correct way to initialize state from a prop while avoiding the \'derived state from props\' anti-pattern?',
            fr: 'Quelle est la bonne façon d\'initialiser l\'état depuis une prop tout en évitant l\'anti-pattern \'état dérivé des props\' ?',
            de: 'Was ist der richtige Weg, State aus einer Prop zu initialisieren und dabei das Anti-Pattern \'abgeleiteter State aus Props\' zu vermeiden?',
            es: '¿Cuál es la forma correcta de inicializar el estado desde una prop evitando el anti-patrón \'estado derivado de props\'?',
            it: 'Qual è il modo corretto per inizializzare lo stato da una prop evitando l\'anti-pattern \'stato derivato dalle props\'?',
          },
          choices: {
            en: [
              'Re-assign the prop inside the component: props.value = newValue',
              'Use the prop only as the initial value in useState and manage state independently: useState(props.value)',
              'Use useEffect to sync state with every prop change',
              'Always derive the value from props instead of using state',
            ],
            fr: [
              'Réassigner la prop à l\'intérieur du composant : props.value = newValue',
              'Utiliser la prop uniquement comme valeur initiale dans useState et gérer l\'état indépendamment : useState(props.value)',
              'Utiliser useEffect pour synchroniser l\'état avec chaque changement de prop',
              'Toujours dériver la valeur des props au lieu d\'utiliser l\'état',
            ],
            de: [
              'Die Prop innerhalb der Komponente neu zuweisen: props.value = newValue',
              'Die Prop nur als Anfangswert in useState verwenden und den State unabhängig verwalten: useState(props.value)',
              'useEffect verwenden, um State mit jeder Prop-Änderung zu synchronisieren',
              'Den Wert immer von Props ableiten, anstatt State zu verwenden',
            ],
            es: [
              'Reasignar la prop dentro del componente: props.value = newValue',
              'Usar la prop solo como valor inicial en useState y gestionar el estado independientemente: useState(props.value)',
              'Usar useEffect para sincronizar el estado con cada cambio de prop',
              'Siempre derivar el valor de las props en lugar de usar estado',
            ],
            it: [
              'Riassegnare la prop all\'interno del componente: props.value = newValue',
              'Usare la prop solo come valore iniziale in useState e gestire lo stato indipendentemente: useState(props.value)',
              'Usare useEffect per sincronizzare lo stato con ogni cambiamento di prop',
              'Derivare sempre il valore dalle props invece di usare lo stato',
            ],
          },
          answer: '1',
          tags: ['useState'],
          explanation: {
            en: 'Passing a prop as the initial value to useState is valid for \'uncontrolled\' initialization. The state then lives independently. The anti-pattern is adding a useEffect that copies every prop change into state — that creates two sources of truth. If you need derived values, compute them during render or lift state up.',
            fr: 'Passer une prop comme valeur initiale à useState est valide pour une initialisation \'non contrôlée\'. L\'état vit ensuite indépendamment. L\'anti-pattern consiste à ajouter un useEffect qui copie chaque changement de prop dans l\'état — cela crée deux sources de vérité. Si vous avez besoin de valeurs dérivées, calculez-les pendant le rendu ou remontez l\'état.',
            de: 'Eine Prop als Anfangswert an useState zu übergeben ist gültig für \'unkontrollierte\' Initialisierung. Der State lebt dann unabhängig. Das Anti-Pattern besteht darin, einen useEffect hinzuzufügen, der jede Prop-Änderung in State kopiert — das schafft zwei Wahrheitsquellen. Wenn Sie abgeleitete Werte benötigen, berechnen Sie sie während des Renderings oder heben Sie den State an.',
            es: 'Pasar una prop como valor inicial a useState es válido para inicialización \'no controlada\'. El estado luego vive independientemente. El anti-patrón es agregar un useEffect que copia cada cambio de prop al estado — eso crea dos fuentes de verdad. Si necesitas valores derivados, calcúlalos durante el renderizado o eleva el estado.',
            it: 'Passare una prop come valore iniziale a useState è valido per l\'inizializzazione \'non controllata\'. Lo stato vive poi indipendentemente. L\'anti-pattern consiste nell\'aggiungere un useEffect che copia ogni cambiamento di prop nello stato — questo crea due fonti di verità. Se hai bisogno di valori derivati, calcolali durante il rendering o solleva lo stato.',
          },
          docs: 'https://react.dev/reference/react/useState',
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
      `SELECT id, data FROM "qcm_question" WHERE "moduleId" = '7da5ab84-ab82-4522-82e6-17835c297654'`
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
