import type { MigrationInterface, QueryRunner } from 'typeorm';

export class TranslateManagingState1774200020002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const questions = [
      {
        id: '81c298b8-edc1-42e1-a843-11f93001b501',
        data: {
          question: {
            en: 'When should you split one piece of state into two separate state variables?',
            fr: 'Quand devriez-vous diviser un élément de state en deux variables de state distinctes ?',
            de: 'Wann sollten Sie ein State-Element in zwei separate State-Variablen aufteilen?',
            es: '¿Cuándo deberías dividir una pieza de state en dos variables de state separadas?',
            it: 'Quando dovresti dividere un elemento di state in due variabili di state separate?',
          },
          choices: {
            en: ['When the two values change independently from each other', 'When both values are objects', 'Always — one state variable per data point is the rule', 'When a component has more than 3 props'],
            fr: ['Quand les deux valeurs changent indépendamment l\'une de l\'autre', 'Quand les deux valeurs sont des objets', 'Toujours — une variable de state par donnée est la règle', 'Quand un component a plus de 3 props'],
            de: ['Wenn die beiden Werte sich unabhängig voneinander ändern', 'Wenn beide Werte Objekte sind', 'Immer — eine State-Variable pro Datenpunkt ist die Regel', 'Wenn eine Component mehr als 3 Props hat'],
            es: ['Cuando los dos valores cambian independientemente uno del otro', 'Cuando ambos valores son objetos', 'Siempre — una variable de state por dato es la regla', 'Cuando un component tiene más de 3 props'],
            it: ['Quando i due valori cambiano indipendentemente l\'uno dall\'altro', 'Quando entrambi i valori sono oggetti', 'Sempre — una variabile di state per dato è la regola', 'Quando un component ha più di 3 props'],
          },
          answer: '0',
          tags: ['state-structure'],
          explanation: {
            en: 'Group state that changes together and split state that changes independently. If you always update x and y together (like coordinates), a single `{x, y}` object makes sense. If they change at different times, separate useState calls are clearer and avoid over-updating.',
            fr: 'Regroupez le state qui change ensemble et divisez le state qui change indépendamment. Si vous mettez toujours à jour x et y ensemble (comme des coordonnées), un seul objet `{x, y}` est logique. S\'ils changent à des moments différents, des appels useState séparés sont plus clairs et évitent les mises à jour excessives.',
            de: 'Gruppieren Sie State, der sich zusammen ändert, und trennen Sie State, der sich unabhängig ändert. Wenn Sie x und y immer zusammen aktualisieren (wie Koordinaten), macht ein einzelnes `{x, y}`-Objekt Sinn. Wenn sie sich zu unterschiedlichen Zeiten ändern, sind separate useState-Aufrufe klarer und vermeiden Über-Aktualisierungen.',
            es: 'Agrupa el state que cambia junto y divide el state que cambia independientemente. Si siempre actualizas x e y juntos (como coordenadas), un solo objeto `{x, y}` tiene sentido. Si cambian en momentos diferentes, llamadas useState separadas son más claras y evitan actualizaciones excesivas.',
            it: 'Raggruppa lo state che cambia insieme e dividi lo state che cambia indipendentemente. Se aggiorni sempre x e y insieme (come coordinate), un singolo oggetto `{x, y}` ha senso. Se cambiano in momenti diversi, chiamate useState separate sono più chiare ed evitano aggiornamenti eccessivi.',
          },
          docs: 'https://react.dev/learn/choosing-the-state-structure',
        },
      },
      {
        id: 'd472d477-7893-437f-bb30-1df3c4a17384',
        data: {
          question: {
            en: 'Which of these state structures has redundant state?',
            fr: 'Laquelle de ces structures de state contient du state redondant ?',
            de: 'Welche dieser State-Strukturen hat redundanten State?',
            es: '¿Cuál de estas estructuras de state tiene state redundante?',
            it: 'Quale di queste strutture di state ha state ridondante?',
          },
          choices: {
            en: ['firstName — it\'s redundant because fullName already stores all the data', 'lastName — it\'s redundant if fullName is stored', 'fullName — it can be computed as `${firstName} ${lastName}` during render', 'None — all three are needed'],
            fr: ['firstName — c\'est redondant car fullName stocke déjà toutes les données', 'lastName — c\'est redondant si fullName est stocké', 'fullName — il peut être calculé comme `${firstName} ${lastName}` pendant le rendu', 'Aucun — les trois sont nécessaires'],
            de: ['firstName — es ist redundant, weil fullName bereits alle Daten speichert', 'lastName — es ist redundant, wenn fullName gespeichert wird', 'fullName — es kann während des Renderns als `${firstName} ${lastName}` berechnet werden', 'Keiner — alle drei werden benötigt'],
            es: ['firstName — es redundante porque fullName ya almacena todos los datos', 'lastName — es redundante si fullName está almacenado', 'fullName — puede calcularse como `${firstName} ${lastName}` durante el render', 'Ninguno — los tres son necesarios'],
            it: ['firstName — è ridondante perché fullName memorizza già tutti i dati', 'lastName — è ridondante se fullName è memorizzato', 'fullName — può essere calcolato come `${firstName} ${lastName}` durante il render', 'Nessuno — tutti e tre sono necessari'],
          },
          answer: '2',
          tags: ['state-structure'],
          explanation: {
            en: '`fullName` is redundant (derived state). You can always compute it during render: `const fullName = firstName + \' \' + lastName`. Storing it in state creates two sources of truth that can fall out of sync. Only store the minimal set of state from which everything else can be derived.',
            fr: '`fullName` est redondant (state dérivé). Vous pouvez toujours le calculer pendant le rendu : `const fullName = firstName + \' \' + lastName`. Le stocker dans le state crée deux sources de vérité qui peuvent se désynchroniser. Stockez uniquement l\'ensemble minimal de state à partir duquel tout le reste peut être dérivé.',
            de: '`fullName` ist redundant (abgeleiteter State). Sie können es immer während des Renderns berechnen: `const fullName = firstName + \' \' + lastName`. Das Speichern im State erstellt zwei Wahrheitsquellen, die nicht synchron sein können. Speichern Sie nur den minimalen State-Satz, von dem alles andere abgeleitet werden kann.',
            es: '`fullName` es redundante (state derivado). Siempre puedes calcularlo durante el render: `const fullName = firstName + \' \' + lastName`. Almacenarlo en el state crea dos fuentes de verdad que pueden desincronizarse. Solo almacena el conjunto mínimo de state del cual todo lo demás puede derivarse.',
            it: '`fullName` è ridondante (state derivato). Puoi sempre calcolarlo durante il render: `const fullName = firstName + \' \' + lastName`. Memorizzarlo nello state crea due fonti di verità che possono andare fuori sincronia. Memorizza solo il set minimo di state da cui tutto il resto può essere derivato.',
          },
          docs: 'https://react.dev/learn/choosing-the-state-structure',
        },
      },
      {
        id: '454fa09a-c375-4d67-8879-7d0e72be4946',
        data: {
          question: {
            en: 'What does \'lifting state up\' mean in React?',
            fr: 'Que signifie \'remonter le state\' dans React ?',
            de: 'Was bedeutet \'State nach oben heben\' in React?',
            es: '¿Qué significa \'elevar el state\' en React?',
            it: 'Cosa significa \'sollevare lo state\' in React?',
          },
          choices: {
            en: ['Moving state from a class component to a function component', 'Using a global state manager like Redux', 'Moving state to the closest common ancestor component so multiple children can share it', 'Initializing state at the top of a component file'],
            fr: ['Déplacer le state d\'un class component vers un function component', 'Utiliser un gestionnaire de state global comme Redux', 'Déplacer le state vers le component ancêtre commun le plus proche pour que plusieurs enfants puissent le partager', 'Initialiser le state en haut d\'un fichier component'],
            de: ['State von einer Class-Component zu einer Function-Component verschieben', 'Einen globalen State-Manager wie Redux verwenden', 'State zum nächsten gemeinsamen Vorfahren-Component verschieben, damit mehrere Kinder ihn teilen können', 'State am Anfang einer Component-Datei initialisieren'],
            es: ['Mover el state de un class component a un function component', 'Usar un gestor de state global como Redux', 'Mover el state al component ancestro común más cercano para que múltiples hijos puedan compartirlo', 'Inicializar el state en la parte superior de un archivo component'],
            it: ['Spostare lo state da un class component a un function component', 'Usare un gestore di state globale come Redux', 'Spostare lo state al component antenato comune più vicino in modo che più figli possano condividerlo', 'Inizializzare lo state all\'inizio di un file component'],
          },
          answer: '2',
          tags: ['lifting-state'],
          explanation: {
            en: 'When two sibling components need to share the same state, you lift it up to their nearest common ancestor. The parent holds the state and passes it down as props along with setter callbacks. This keeps the data flow unidirectional and predictable.',
            fr: 'Lorsque deux components frères ont besoin de partager le même state, vous le remontez vers leur ancêtre commun le plus proche. Le parent détient le state et le transmet comme props avec des callbacks de modification. Cela maintient le flux de données unidirectionnel et prévisible.',
            de: 'Wenn zwei Geschwister-Components denselben State teilen müssen, heben Sie ihn zu ihrem nächsten gemeinsamen Vorfahren. Der Elternteil hält den State und gibt ihn als Props zusammen mit Setter-Callbacks weiter. Dies hält den Datenfluss unidirektional und vorhersehbar.',
            es: 'Cuando dos components hermanos necesitan compartir el mismo state, lo elevas a su ancestro común más cercano. El padre mantiene el state y lo pasa como props junto con callbacks de actualización. Esto mantiene el flujo de datos unidireccional y predecible.',
            it: 'Quando due components fratelli devono condividere lo stesso state, lo sollevi al loro antenato comune più vicino. Il genitore mantiene lo state e lo passa come props insieme ai callback di modifica. Questo mantiene il flusso di dati unidirezionale e prevedibile.',
          },
          docs: 'https://react.dev/learn/sharing-state-between-components',
        },
      },
      {
        id: 'ba279bb8-b4a2-40d6-b907-a305a8eea054',
        data: {
          question: {
            en: 'Two tabs (<TabA /> and <TabB />) need to show which tab is active. Where should the `activeTab` state live?',
            fr: 'Deux onglets (<TabA /> et <TabB />) doivent afficher quel onglet est actif. Où le state `activeTab` doit-il se trouver ?',
            de: 'Zwei Tabs (<TabA /> und <TabB />) müssen anzeigen, welcher Tab aktiv ist. Wo sollte der `activeTab`-State liegen?',
            es: 'Dos pestañas (<TabA /> y <TabB />) necesitan mostrar qué pestaña está activa. ¿Dónde debería estar el state `activeTab`?',
            it: 'Due schede (<TabA /> e <TabB />) devono mostrare quale scheda è attiva. Dove dovrebbe trovarsi lo state `activeTab`?',
          },
          choices: {
            en: ['In TabA, which passes it to TabB via props', 'In a separate TabState module', 'In each tab individually — they each track their own active status', 'In the parent component that renders both tabs'],
            fr: ['Dans TabA, qui le transmet à TabB via props', 'Dans un module TabState séparé', 'Dans chaque onglet individuellement — chacun suit son propre statut actif', 'Dans le component parent qui rend les deux onglets'],
            de: ['In TabA, das es über Props an TabB weitergibt', 'In einem separaten TabState-Modul', 'In jedem Tab einzeln — jeder verfolgt seinen eigenen aktiven Status', 'Im Eltern-Component, das beide Tabs rendert'],
            es: ['En TabA, que lo pasa a TabB vía props', 'En un módulo TabState separado', 'En cada pestaña individualmente — cada una rastrea su propio estado activo', 'En el component padre que renderiza ambas pestañas'],
            it: ['In TabA, che lo passa a TabB tramite props', 'In un modulo TabState separato', 'In ogni scheda individualmente — ognuna traccia il proprio stato attivo', 'Nel component genitore che renderizza entrambe le schede'],
          },
          answer: '3',
          tags: ['lifting-state'],
          explanation: {
            en: 'Since both tabs need to know which is active (to display correctly) and only one can be active at a time, the state belongs in their parent. The parent controls which tab is active and passes the value down. Each tab independently tracking its own \'active\' state would make them impossible to synchronize.',
            fr: 'Comme les deux onglets doivent savoir lequel est actif (pour s\'afficher correctement) et qu\'un seul peut être actif à la fois, le state appartient à leur parent. Le parent contrôle quel onglet est actif et transmet la valeur. Chaque onglet suivant indépendamment son propre état \'actif\' rendrait leur synchronisation impossible.',
            de: 'Da beide Tabs wissen müssen, welcher aktiv ist (um korrekt anzuzeigen) und nur einer gleichzeitig aktiv sein kann, gehört der State zu ihrem Elternteil. Der Elternteil steuert, welcher Tab aktiv ist und gibt den Wert weiter. Wenn jeder Tab unabhängig seinen eigenen \'aktiven\' Zustand verfolgt, wäre eine Synchronisierung unmöglich.',
            es: 'Como ambas pestañas necesitan saber cuál está activa (para mostrarse correctamente) y solo una puede estar activa a la vez, el state pertenece a su padre. El padre controla qué pestaña está activa y pasa el valor. Cada pestaña rastreando independientemente su propio estado \'activo\' haría imposible sincronizarlas.',
            it: 'Poiché entrambe le schede devono sapere quale è attiva (per visualizzare correttamente) e solo una può essere attiva alla volta, lo state appartiene al loro genitore. Il genitore controlla quale scheda è attiva e passa il valore. Ogni scheda che traccia indipendentemente il proprio stato \'attivo\' renderebbe impossibile sincronizzarle.',
          },
          docs: 'https://react.dev/learn/sharing-state-between-components',
        },
      },
      {
        id: 'e6883823-5945-4e4d-8fc1-507178fb8329',
        data: {
          question: {
            en: 'When is useReducer preferable to useState?',
            fr: 'Quand useReducer est-il préférable à useState ?',
            de: 'Wann ist useReducer gegenüber useState vorzuziehen?',
            es: '¿Cuándo es preferible useReducer a useState?',
            it: 'Quando è preferibile useReducer a useState?',
          },
          choices: {
            en: ['When you have complex state logic with multiple sub-values or when the next state depends on the previous one through multiple action types', 'When you need the absolute fastest re-render performance', 'Only in class components', 'When you have more than 3 separate useState calls'],
            fr: ['Quand vous avez une logique de state complexe avec plusieurs sous-valeurs ou quand le state suivant dépend du précédent via plusieurs types d\'action', 'Quand vous avez besoin des performances de rendu les plus rapides', 'Uniquement dans les class components', 'Quand vous avez plus de 3 appels useState séparés'],
            de: ['Wenn Sie komplexe State-Logik mit mehreren Unterwerten haben oder wenn der nächste State vom vorherigen durch mehrere Action-Typen abhängt', 'Wenn Sie die absolut schnellste Render-Performance benötigen', 'Nur in Class-Components', 'Wenn Sie mehr als 3 separate useState-Aufrufe haben'],
            es: ['Cuando tienes lógica de state compleja con múltiples subvalores o cuando el siguiente state depende del anterior a través de múltiples tipos de acción', 'Cuando necesitas el rendimiento de renderizado más rápido posible', 'Solo en class components', 'Cuando tienes más de 3 llamadas useState separadas'],
            it: ['Quando hai logica di state complessa con più sottovalori o quando il prossimo state dipende dal precedente attraverso più tipi di action', 'Quando hai bisogno delle prestazioni di rendering più veloci in assoluto', 'Solo nei class components', 'Quando hai più di 3 chiamate useState separate'],
          },
          answer: '0',
          tags: ['reducers', 'useReducer'],
          explanation: {
            en: 'useReducer shines when state transitions are complex — multiple fields updated together, or when different actions produce different state shapes. It centralizes update logic in a pure reducer function, making state transitions easier to test and reason about.',
            fr: 'useReducer excelle lorsque les transitions de state sont complexes — plusieurs champs mis à jour ensemble, ou lorsque différentes actions produisent différentes formes de state. Il centralise la logique de mise à jour dans une fonction reducer pure, rendant les transitions de state plus faciles à tester et à comprendre.',
            de: 'useReducer glänzt, wenn State-Übergänge komplex sind — mehrere Felder werden zusammen aktualisiert, oder wenn verschiedene Actions unterschiedliche State-Formen erzeugen. Es zentralisiert die Update-Logik in einer reinen Reducer-Funktion, wodurch State-Übergänge einfacher zu testen und zu verstehen sind.',
            es: 'useReducer brilla cuando las transiciones de state son complejas — múltiples campos actualizados juntos, o cuando diferentes acciones producen diferentes formas de state. Centraliza la lógica de actualización en una función reducer pura, haciendo que las transiciones de state sean más fáciles de probar y razonar.',
            it: 'useReducer eccelle quando le transizioni di state sono complesse — più campi aggiornati insieme, o quando azioni diverse producono forme di state diverse. Centralizza la logica di aggiornamento in una funzione reducer pura, rendendo le transizioni di state più facili da testare e comprendere.',
          },
          docs: 'https://react.dev/learn/extracting-state-logic-into-a-reducer',
        },
      },
      {
        id: 'f77dbc9d-0718-4847-8196-6b75d8b5cdbf',
        data: {
          question: {
            en: 'What does this reducer return when action is `{type: \'increment\'}`?\n\nfunction reducer(state, action) {\n  switch(action.type) {\n    case \'increment\': return { count: state.count + 1 };\n    case \'reset\': return { count: 0 };\n    default: return state;\n  }\n}\n// Initial state: { count: 5 }',
            fr: 'Que retourne ce reducer quand l\'action est `{type: \'increment\'}` ?\n\nfunction reducer(state, action) {\n  switch(action.type) {\n    case \'increment\': return { count: state.count + 1 };\n    case \'reset\': return { count: 0 };\n    default: return state;\n  }\n}\n// State initial : { count: 5 }',
            de: 'Was gibt dieser Reducer zurück, wenn die Action `{type: \'increment\'}` ist?\n\nfunction reducer(state, action) {\n  switch(action.type) {\n    case \'increment\': return { count: state.count + 1 };\n    case \'reset\': return { count: 0 };\n    default: return state;\n  }\n}\n// Anfangszustand: { count: 5 }',
            es: '¿Qué devuelve este reducer cuando la acción es `{type: \'increment\'}`?\n\nfunction reducer(state, action) {\n  switch(action.type) {\n    case \'increment\': return { count: state.count + 1 };\n    case \'reset\': return { count: 0 };\n    default: return state;\n  }\n}\n// State inicial: { count: 5 }',
            it: 'Cosa restituisce questo reducer quando l\'action è `{type: \'increment\'}`?\n\nfunction reducer(state, action) {\n  switch(action.type) {\n    case \'increment\': return { count: state.count + 1 };\n    case \'reset\': return { count: 0 };\n    default: return state;\n  }\n}\n// State iniziale: { count: 5 }',
          },
          choices: {
            en: ['{ count: 5 }', '{ count: 6 }', '{ count: 1 }', 'undefined'],
            fr: ['{ count: 5 }', '{ count: 6 }', '{ count: 1 }', 'undefined'],
            de: ['{ count: 5 }', '{ count: 6 }', '{ count: 1 }', 'undefined'],
            es: ['{ count: 5 }', '{ count: 6 }', '{ count: 1 }', 'undefined'],
            it: ['{ count: 5 }', '{ count: 6 }', '{ count: 1 }', 'undefined'],
          },
          answer: '1',
          tags: ['useReducer'],
          explanation: {
            en: 'The reducer receives the current state `{ count: 5 }` and the action `{ type: \'increment\' }`. The switch matches \'increment\' and returns `{ count: 5 + 1 }` = `{ count: 6 }`. Reducers must be pure functions — they return new state objects without mutating the input.',
            fr: 'Le reducer reçoit le state actuel `{ count: 5 }` et l\'action `{ type: \'increment\' }`. Le switch correspond à \'increment\' et retourne `{ count: 5 + 1 }` = `{ count: 6 }`. Les reducers doivent être des fonctions pures — ils retournent de nouveaux objets state sans muter l\'entrée.',
            de: 'Der Reducer erhält den aktuellen State `{ count: 5 }` und die Action `{ type: \'increment\' }`. Das Switch stimmt mit \'increment\' überein und gibt `{ count: 5 + 1 }` = `{ count: 6 }` zurück. Reducer müssen reine Funktionen sein — sie geben neue State-Objekte zurück, ohne die Eingabe zu mutieren.',
            es: 'El reducer recibe el state actual `{ count: 5 }` y la acción `{ type: \'increment\' }`. El switch coincide con \'increment\' y devuelve `{ count: 5 + 1 }` = `{ count: 6 }`. Los reducers deben ser funciones puras — devuelven nuevos objetos state sin mutar la entrada.',
            it: 'Il reducer riceve lo state corrente `{ count: 5 }` e l\'action `{ type: \'increment\' }`. Lo switch corrisponde a \'increment\' e restituisce `{ count: 5 + 1 }` = `{ count: 6 }`. I reducers devono essere funzioni pure — restituiscono nuovi oggetti state senza mutare l\'input.',
          },
          docs: 'https://react.dev/reference/react/useReducer',
        },
      },
      {
        id: '8aaabe50-ce2c-496c-b8d0-5d6e8d4ff668',
        data: {
          question: {
            en: 'What is the correct signature of a React reducer function?',
            fr: 'Quelle est la signature correcte d\'une fonction reducer React ?',
            de: 'Was ist die korrekte Signatur einer React-Reducer-Funktion?',
            es: '¿Cuál es la firma correcta de una función reducer de React?',
            it: 'Qual è la firma corretta di una funzione reducer React?',
          },
          choices: {
            en: ['(action, state) => newState', '(state, action) => newState', '(dispatch, state, action) => newState', '(state) => newState'],
            fr: ['(action, state) => newState', '(state, action) => newState', '(dispatch, state, action) => newState', '(state) => newState'],
            de: ['(action, state) => newState', '(state, action) => newState', '(dispatch, state, action) => newState', '(state) => newState'],
            es: ['(action, state) => newState', '(state, action) => newState', '(dispatch, state, action) => newState', '(state) => newState'],
            it: ['(action, state) => newState', '(state, action) => newState', '(dispatch, state, action) => newState', '(state) => newState'],
          },
          answer: '1',
          tags: ['useReducer'],
          explanation: {
            en: 'A reducer takes the current state and an action, then returns the next state. The order matters — state comes first. The function must be pure: same inputs always produce the same output, no side effects. React passes these arguments when you call dispatch(action).',
            fr: 'Un reducer prend le state actuel et une action, puis retourne le state suivant. L\'ordre est important — le state vient en premier. La fonction doit être pure : les mêmes entrées produisent toujours la même sortie, sans effets secondaires. React passe ces arguments quand vous appelez dispatch(action).',
            de: 'Ein Reducer nimmt den aktuellen State und eine Action und gibt dann den nächsten State zurück. Die Reihenfolge ist wichtig — State kommt zuerst. Die Funktion muss rein sein: Dieselben Eingaben erzeugen immer dieselbe Ausgabe, keine Seiteneffekte. React übergibt diese Argumente, wenn Sie dispatch(action) aufrufen.',
            es: 'Un reducer toma el state actual y una acción, luego devuelve el siguiente state. El orden importa — el state viene primero. La función debe ser pura: las mismas entradas siempre producen la misma salida, sin efectos secundarios. React pasa estos argumentos cuando llamas dispatch(action).',
            it: 'Un reducer prende lo state corrente e un\'action, poi restituisce il prossimo state. L\'ordine è importante — lo state viene prima. La funzione deve essere pura: gli stessi input producono sempre lo stesso output, senza effetti collaterali. React passa questi argomenti quando chiami dispatch(action).',
          },
          docs: 'https://react.dev/reference/react/useReducer',
        },
      },
      {
        id: '952e2ca3-5752-4c8d-b766-a5299f9aa5f3',
        data: {
          question: {
            en: 'What problem does React Context solve?',
            fr: 'Quel problème React Context résout-il ?',
            de: 'Welches Problem löst React Context?',
            es: '¿Qué problema resuelve React Context?',
            it: 'Che problema risolve React Context?',
          },
          choices: {
            en: ['Slow re-renders caused by large component trees', 'Sharing state between completely separate React apps', 'Prop drilling — passing data through many intermediate components that don\'t need it', 'Replacing all useState calls'],
            fr: ['Rendus lents causés par de grands arbres de components', 'Partage de state entre des applications React complètement séparées', 'Prop drilling — passer des données à travers de nombreux components intermédiaires qui n\'en ont pas besoin', 'Remplacer tous les appels useState'],
            de: ['Langsame Re-Renders durch große Component-Bäume', 'State-Sharing zwischen völlig getrennten React-Apps', 'Prop Drilling — Daten durch viele Zwischen-Components leiten, die sie nicht benötigen', 'Ersetzen aller useState-Aufrufe'],
            es: ['Renderizados lentos causados por grandes árboles de components', 'Compartir state entre aplicaciones React completamente separadas', 'Prop drilling — pasar datos a través de muchos components intermedios que no los necesitan', 'Reemplazar todas las llamadas useState'],
            it: ['Re-render lenti causati da grandi alberi di components', 'Condivisione di state tra app React completamente separate', 'Prop drilling — passare dati attraverso molti components intermedi che non ne hanno bisogno', 'Sostituire tutte le chiamate useState'],
          },
          answer: '2',
          tags: ['context', 'useContext'],
          explanation: {
            en: 'Context provides a way to pass data through the component tree without manually passing props at every level. It\'s ideal for data that many components at different nesting levels need — like the current theme, user authentication, or locale.',
            fr: 'Context fournit un moyen de transmettre des données à travers l\'arbre de components sans passer manuellement des props à chaque niveau. C\'est idéal pour les données dont de nombreux components à différents niveaux d\'imbrication ont besoin — comme le thème actuel, l\'authentification utilisateur ou la locale.',
            de: 'Context bietet eine Möglichkeit, Daten durch den Component-Baum zu leiten, ohne Props manuell auf jeder Ebene zu übergeben. Es ist ideal für Daten, die viele Components auf verschiedenen Verschachtelungsebenen benötigen — wie das aktuelle Theme, Benutzer-Authentifizierung oder Locale.',
            es: 'Context proporciona una forma de pasar datos a través del árbol de components sin pasar props manualmente en cada nivel. Es ideal para datos que muchos components en diferentes niveles de anidación necesitan — como el tema actual, autenticación de usuario o locale.',
            it: 'Context fornisce un modo per passare dati attraverso l\'albero di components senza passare manualmente props ad ogni livello. È ideale per dati che molti components a diversi livelli di nidificazione necessitano — come il tema corrente, autenticazione utente o locale.',
          },
          docs: 'https://react.dev/learn/passing-data-deeply-with-context',
        },
      },
      {
        id: 'd498e427-ccc5-4c2e-8b09-a62d4c9a56bc',
        data: {
          question: {
            en: 'What is the correct way to create and provide a context value?',
            fr: 'Quelle est la manière correcte de créer et fournir une valeur de context ?',
            de: 'Was ist der richtige Weg, um einen Context-Wert zu erstellen und bereitzustellen?',
            es: '¿Cuál es la forma correcta de crear y proporcionar un valor de context?',
            it: 'Qual è il modo corretto per creare e fornire un valore di context?',
          },
          choices: {
            en: ['Pattern B — Context constructor then wrap directly', 'Both are equivalent', 'Neither — context is created differently in React 19', 'Pattern A — createContext() then wrap with .Provider'],
            fr: ['Pattern B — constructeur Context puis envelopper directement', 'Les deux sont équivalents', 'Ni l\'un ni l\'autre — le context est créé différemment dans React 19', 'Pattern A — createContext() puis envelopper avec .Provider'],
            de: ['Pattern B — Context-Konstruktor und dann direkt umwickeln', 'Beide sind gleichwertig', 'Keiner — Context wird in React 19 anders erstellt', 'Pattern A — createContext() und dann mit .Provider umwickeln'],
            es: ['Pattern B — constructor Context y luego envolver directamente', 'Ambos son equivalentes', 'Ninguno — el context se crea de manera diferente en React 19', 'Pattern A — createContext() y luego envolver con .Provider'],
            it: ['Pattern B — costruttore Context poi avvolgere direttamente', 'Entrambi sono equivalenti', 'Nessuno — il context viene creato in modo diverso in React 19', 'Pattern A — createContext() poi avvolgere con .Provider'],
          },
          answer: '3',
          tags: ['context', 'useContext'],
          explanation: {
            en: 'React.createContext(defaultValue) creates a context object. You wrap consumers with <Context.Provider value={...}> to inject a value. The default value is only used when a component reads context without a matching Provider above it. Pattern B is invalid JavaScript.',
            fr: 'React.createContext(defaultValue) crée un objet context. Vous enveloppez les consommateurs avec <Context.Provider value={...}> pour injecter une valeur. La valeur par défaut n\'est utilisée que lorsqu\'un component lit le context sans Provider correspondant au-dessus. Pattern B est du JavaScript invalide.',
            de: 'React.createContext(defaultValue) erstellt ein Context-Objekt. Sie umwickeln Konsumenten mit <Context.Provider value={...}>, um einen Wert einzufügen. Der Standardwert wird nur verwendet, wenn eine Component Context ohne passenden Provider darüber liest. Pattern B ist ungültiges JavaScript.',
            es: 'React.createContext(defaultValue) crea un objeto context. Envuelves los consumidores con <Context.Provider value={...}> para inyectar un valor. El valor por defecto solo se usa cuando un component lee context sin un Provider coincidente arriba. Pattern B es JavaScript inválido.',
            it: 'React.createContext(defaultValue) crea un oggetto context. Avvolgi i consumatori con <Context.Provider value={...}> per iniettare un valore. Il valore predefinito viene utilizzato solo quando un component legge il context senza un Provider corrispondente sopra. Pattern B è JavaScript non valido.',
          },
          docs: 'https://react.dev/learn/passing-data-deeply-with-context',
        },
      },
      {
        id: '0b6cc605-9d47-41f2-b385-8ad573159c72',
        data: {
          question: {
            en: 'How does a component read a context value in React 19?',
            fr: 'Comment un component lit-il une valeur de context dans React 19 ?',
            de: 'Wie liest eine Component einen Context-Wert in React 19?',
            es: '¿Cómo lee un component un valor de context en React 19?',
            it: 'Come legge un component un valore di context in React 19?',
          },
          choices: {
            en: ['const theme = useContext(ThemeContext);', 'const theme = ThemeContext.read();', 'const theme = this.context;', 'const theme = getContext(ThemeContext);'],
            fr: ['const theme = useContext(ThemeContext);', 'const theme = ThemeContext.read();', 'const theme = this.context;', 'const theme = getContext(ThemeContext);'],
            de: ['const theme = useContext(ThemeContext);', 'const theme = ThemeContext.read();', 'const theme = this.context;', 'const theme = getContext(ThemeContext);'],
            es: ['const theme = useContext(ThemeContext);', 'const theme = ThemeContext.read();', 'const theme = this.context;', 'const theme = getContext(ThemeContext);'],
            it: ['const theme = useContext(ThemeContext);', 'const theme = ThemeContext.read();', 'const theme = this.context;', 'const theme = getContext(ThemeContext);'],
          },
          answer: '0',
          tags: ['context', 'useContext'],
          explanation: {
            en: 'useContext(SomeContext) returns the current value of the context from the nearest <SomeContext.Provider> above the calling component. When the Provider\'s value changes, all components calling useContext re-render. `this.context` only works in class components using contextType.',
            fr: 'useContext(SomeContext) retourne la valeur actuelle du context depuis le <SomeContext.Provider> le plus proche au-dessus du component appelant. Lorsque la valeur du Provider change, tous les components appelant useContext sont re-rendus. `this.context` ne fonctionne que dans les class components utilisant contextType.',
            de: 'useContext(SomeContext) gibt den aktuellen Wert des Contexts vom nächsten <SomeContext.Provider> über der aufrufenden Component zurück. Wenn sich der Wert des Providers ändert, werden alle Components, die useContext aufrufen, neu gerendert. `this.context` funktioniert nur in Class-Components mit contextType.',
            es: 'useContext(SomeContext) devuelve el valor actual del context desde el <SomeContext.Provider> más cercano arriba del component que lo llama. Cuando el valor del Provider cambia, todos los components que llaman useContext se vuelven a renderizar. `this.context` solo funciona en class components usando contextType.',
            it: 'useContext(SomeContext) restituisce il valore corrente del context dal <SomeContext.Provider> più vicino sopra il component chiamante. Quando il valore del Provider cambia, tutti i components che chiamano useContext vengono re-renderizzati. `this.context` funziona solo nei class components che usano contextType.',
          },
          docs: 'https://react.dev/learn/passing-data-deeply-with-context',
        },
      },
      {
        id: '7577a109-afd5-4a56-83bc-544f34664acc',
        data: {
          question: {
            en: 'What is new about using context in React 19 with the `use()` hook?',
            fr: 'Qu\'y a-t-il de nouveau dans l\'utilisation du context dans React 19 avec le hook `use()` ?',
            de: 'Was ist neu an der Verwendung von Context in React 19 mit dem `use()`-Hook?',
            es: '¿Qué hay de nuevo sobre el uso de context en React 19 con el hook `use()`?',
            it: 'Cosa c\'è di nuovo nell\'uso del context in React 19 con l\'hook `use()`?',
          },
          choices: {
            en: ['use() replaces createContext and no longer requires a Provider', 'use() returns a Promise instead of the context value', 'use(SomeContext) can be called conditionally inside if-statements, unlike useContext', 'use() only works with server components'],
            fr: ['use() remplace createContext et ne nécessite plus de Provider', 'use() retourne une Promise au lieu de la valeur de context', 'use(SomeContext) peut être appelé conditionnellement dans des instructions if, contrairement à useContext', 'use() ne fonctionne qu\'avec les server components'],
            de: ['use() ersetzt createContext und benötigt keinen Provider mehr', 'use() gibt ein Promise anstelle des Context-Werts zurück', 'use(SomeContext) kann bedingt in if-Anweisungen aufgerufen werden, im Gegensatz zu useContext', 'use() funktioniert nur mit Server-Components'],
            es: ['use() reemplaza createContext y ya no requiere un Provider', 'use() devuelve una Promise en lugar del valor de context', 'use(SomeContext) puede ser llamado condicionalmente dentro de sentencias if, a diferencia de useContext', 'use() solo funciona con server components'],
            it: ['use() sostituisce createContext e non richiede più un Provider', 'use() restituisce una Promise invece del valore di context', 'use(SomeContext) può essere chiamato condizionalmente all\'interno di istruzioni if, a differenza di useContext', 'use() funziona solo con i server components'],
          },
          answer: '2',
          tags: ['context', 'react-19', 'use-hook'],
          explanation: {
            en: 'React 19 introduces the `use()` hook which can read context (and Promises). Unlike useContext, `use()` can be called inside conditionals and loops — it is not subject to the \'hooks must not be called conditionally\' rule. This gives more flexibility in complex conditional rendering scenarios.',
            fr: 'React 19 introduit le hook `use()` qui peut lire le context (et les Promises). Contrairement à useContext, `use()` peut être appelé dans des conditions et des boucles — il n\'est pas soumis à la règle \'les hooks ne doivent pas être appelés conditionnellement\'. Cela donne plus de flexibilité dans des scénarios de rendu conditionnel complexes.',
            de: 'React 19 führt den `use()`-Hook ein, der Context (und Promises) lesen kann. Im Gegensatz zu useContext kann `use()` innerhalb von Bedingungen und Schleifen aufgerufen werden — es unterliegt nicht der Regel \'Hooks dürfen nicht bedingt aufgerufen werden\'. Dies gibt mehr Flexibilität in komplexen bedingten Rendering-Szenarien.',
            es: 'React 19 introduce el hook `use()` que puede leer context (y Promises). A diferencia de useContext, `use()` puede ser llamado dentro de condicionales y bucles — no está sujeto a la regla \'los hooks no deben ser llamados condicionalmente\'. Esto da más flexibilidad en escenarios de renderizado condicional complejos.',
            it: 'React 19 introduce l\'hook `use()` che può leggere il context (e le Promises). A differenza di useContext, `use()` può essere chiamato all\'interno di condizionali e cicli — non è soggetto alla regola \'gli hooks non devono essere chiamati condizionalmente\'. Questo offre maggiore flessibilità in scenari di rendering condizionale complessi.',
          },
          docs: 'https://react.dev/learn/passing-data-deeply-with-context',
        },
      },
      {
        id: '50e893b7-4139-45e9-8329-688cea393f1b',
        data: {
          question: {
            en: 'What does `use(promise)` do in React 19?',
            fr: 'Que fait `use(promise)` dans React 19 ?',
            de: 'Was macht `use(promise)` in React 19?',
            es: '¿Qué hace `use(promise)` en React 19?',
            it: 'Cosa fa `use(promise)` in React 19?',
          },
          choices: {
            en: ['Converts the promise to a callback-based API', 'Suspends the component until the promise resolves, then returns the resolved value', 'Caches the promise result in localStorage', 'Creates a new promise from an existing value'],
            fr: ['Convertit la promise en API basée sur des callbacks', 'Suspend le component jusqu\'à ce que la promise se résolve, puis retourne la valeur résolue', 'Met en cache le résultat de la promise dans localStorage', 'Crée une nouvelle promise à partir d\'une valeur existante'],
            de: ['Konvertiert das Promise in eine Callback-basierte API', 'Suspendiert die Component, bis das Promise aufgelöst wird, und gibt dann den aufgelösten Wert zurück', 'Speichert das Promise-Ergebnis in localStorage zwischen', 'Erstellt ein neues Promise aus einem vorhandenen Wert'],
            es: ['Convierte la promesa en una API basada en callbacks', 'Suspende el component hasta que la promesa se resuelve, luego devuelve el valor resuelto', 'Almacena en caché el resultado de la promesa en localStorage', 'Crea una nueva promesa a partir de un valor existente'],
            it: ['Converte la promise in un\'API basata su callback', 'Sospende il component fino a quando la promise si risolve, poi restituisce il valore risolto', 'Memorizza nella cache il risultato della promise in localStorage', 'Crea una nuova promise da un valore esistente'],
          },
          answer: '1',
          tags: ['react-19', 'use-hook'],
          explanation: {
            en: 'When you pass a Promise to `use()`, React suspends rendering of the component until the promise resolves, similar to how async/await works but integrated with Suspense boundaries. The component above must have a <Suspense fallback> to show while waiting.',
            fr: 'Lorsque vous passez une Promise à `use()`, React suspend le rendu du component jusqu\'à ce que la promise se résolve, similaire au fonctionnement d\'async/await mais intégré aux limites Suspense. Le component au-dessus doit avoir un <Suspense fallback> à afficher pendant l\'attente.',
            de: 'Wenn Sie ein Promise an `use()` übergeben, suspendiert React das Rendering der Component, bis das Promise aufgelöst wird, ähnlich wie async/await funktioniert, aber integriert mit Suspense-Grenzen. Die Component darüber muss ein <Suspense fallback> haben, das während des Wartens angezeigt wird.',
            es: 'Cuando pasas una Promise a `use()`, React suspende el renderizado del component hasta que la promesa se resuelve, similar a cómo funciona async/await pero integrado con límites Suspense. El component arriba debe tener un <Suspense fallback> para mostrar mientras espera.',
            it: 'Quando passi una Promise a `use()`, React sospende il rendering del component fino a quando la promise si risolve, simile a come funziona async/await ma integrato con i confini Suspense. Il component sopra deve avere un <Suspense fallback> da mostrare durante l\'attesa.',
          },
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: 'b2118dc1-70c6-407f-aea8-da12c7ec5d89',
        data: {
          question: {
            en: 'What is the \'avoid impossible states\' principle in state design?',
            fr: 'Quel est le principe \'éviter les états impossibles\' dans la conception du state ?',
            de: 'Was ist das Prinzip \'unmögliche Zustände vermeiden\' im State-Design?',
            es: '¿Qué es el principio \'evitar estados imposibles\' en el diseño de state?',
            it: 'Qual è il principio \'evitare stati impossibili\' nella progettazione dello state?',
          },
          choices: {
            en: ['Never use boolean state variables', 'Always use TypeScript to prevent invalid state', 'Split all state into separate useState calls', 'Structure state so that invalid combinations cannot be represented — e.g., use a status enum instead of multiple boolean flags'],
            fr: ['Ne jamais utiliser de variables de state booléennes', 'Toujours utiliser TypeScript pour empêcher un state invalide', 'Diviser tout le state en appels useState séparés', 'Structurer le state pour que les combinaisons invalides ne puissent pas être représentées — par ex., utiliser un enum de statut au lieu de plusieurs drapeaux booléens'],
            de: ['Niemals boolesche State-Variablen verwenden', 'Immer TypeScript verwenden, um ungültigen State zu verhindern', 'Gesamten State in separate useState-Aufrufe aufteilen', 'State so strukturieren, dass ungültige Kombinationen nicht dargestellt werden können — z.B. ein Status-Enum anstelle mehrerer boolescher Flags verwenden'],
            es: ['Nunca usar variables de state booleanas', 'Siempre usar TypeScript para prevenir state inválido', 'Dividir todo el state en llamadas useState separadas', 'Estructurar el state para que las combinaciones inválidas no puedan representarse — p. ej., usar un enum de estado en lugar de múltiples banderas booleanas'],
            it: ['Non usare mai variabili di state booleane', 'Usare sempre TypeScript per prevenire state non valido', 'Dividere tutto lo state in chiamate useState separate', 'Strutturare lo state in modo che le combinazioni non valide non possano essere rappresentate — ad es., usare un enum di stato invece di più flag booleani'],
          },
          answer: '3',
          tags: ['state-structure'],
          explanation: {
            en: 'Multiple booleans like `isLoading` and `isError` can both be true simultaneously — an impossible real-world state. Replacing them with a status enum (\'idle\' | \'loading\' | \'success\' | \'error\') makes invalid states unrepresentable, eliminating entire classes of bugs.',
            fr: 'Plusieurs booléens comme `isLoading` et `isError` peuvent être vrais simultanément — un état du monde réel impossible. Les remplacer par un enum de statut (\'idle\' | \'loading\' | \'success\' | \'error\') rend les états invalides non représentables, éliminant des classes entières de bugs.',
            de: 'Mehrere Booleans wie `isLoading` und `isError` können beide gleichzeitig wahr sein — ein unmöglicher realer Zustand. Das Ersetzen durch ein Status-Enum (\'idle\' | \'loading\' | \'success\' | \'error\') macht ungültige Zustände nicht darstellbar und eliminiert ganze Klassen von Bugs.',
            es: 'Múltiples booleanos como `isLoading` e `isError` pueden ser verdaderos simultáneamente — un estado del mundo real imposible. Reemplazarlos con un enum de estado (\'idle\' | \'loading\' | \'success\' | \'error\') hace que los estados inválidos sean irrepresentables, eliminando clases enteras de errores.',
            it: 'Più booleani come `isLoading` e `isError` possono essere entrambi veri simultaneamente — uno stato del mondo reale impossibile. Sostituirli con un enum di stato (\'idle\' | \'loading\' | \'success\' | \'error\') rende gli stati non validi irrapresentabili, eliminando intere classi di bug.',
          },
          docs: 'https://react.dev/learn/choosing-the-state-structure',
        },
      },
      {
        id: '1b3873df-b412-4cd3-bb06-f513c6439d50',
        data: {
          question: {
            en: 'Why should reducer functions be pure (no side effects)?',
            fr: 'Pourquoi les fonctions reducer doivent-elles être pures (sans effets secondaires) ?',
            de: 'Warum sollten Reducer-Funktionen rein sein (keine Seiteneffekte)?',
            es: '¿Por qué las funciones reducer deben ser puras (sin efectos secundarios)?',
            it: 'Perché le funzioni reducer dovrebbero essere pure (senza effetti collaterali)?',
          },
          choices: {
            en: ['React Strict Mode calls reducers twice to detect side effects; impure reducers would cause bugs', 'Reducers run on the server, where side effects are not allowed', 'React cannot handle errors thrown inside reducers', 'The action object becomes read-only inside the reducer'],
            fr: ['React Strict Mode appelle les reducers deux fois pour détecter les effets secondaires ; les reducers impurs causeraient des bugs', 'Les reducers s\'exécutent sur le serveur, où les effets secondaires ne sont pas autorisés', 'React ne peut pas gérer les erreurs levées dans les reducers', 'L\'objet action devient en lecture seule dans le reducer'],
            de: ['React Strict Mode ruft Reducer zweimal auf, um Seiteneffekte zu erkennen; unreine Reducer würden Bugs verursachen', 'Reducer laufen auf dem Server, wo Seiteneffekte nicht erlaubt sind', 'React kann Fehler, die in Reducern geworfen werden, nicht behandeln', 'Das Action-Objekt wird innerhalb des Reducers schreibgeschützt'],
            es: ['React Strict Mode llama a los reducers dos veces para detectar efectos secundarios; los reducers impuros causarían errores', 'Los reducers se ejecutan en el servidor, donde los efectos secundarios no están permitidos', 'React no puede manejar errores lanzados dentro de reducers', 'El objeto action se vuelve de solo lectura dentro del reducer'],
            it: ['React Strict Mode chiama i reducers due volte per rilevare effetti collaterali; i reducers impuri causerebbero bug', 'I reducers vengono eseguiti sul server, dove gli effetti collaterali non sono consentiti', 'React non può gestire gli errori lanciati all\'interno dei reducers', 'L\'oggetto action diventa di sola lettura all\'interno del reducer'],
          },
          answer: '0',
          tags: ['reducers', 'useReducer'],
          explanation: {
            en: 'React Strict Mode double-invokes reducers (in development) to help detect impurity. If a reducer performs side effects like API calls, they would run twice. Reducers should only compute and return new state — side effects belong in event handlers or useEffect.',
            fr: 'React Strict Mode invoque les reducers deux fois (en développement) pour aider à détecter l\'impureté. Si un reducer effectue des effets secondaires comme des appels API, ils s\'exécuteraient deux fois. Les reducers ne devraient que calculer et retourner un nouveau state — les effets secondaires appartiennent aux gestionnaires d\'événements ou useEffect.',
            de: 'React Strict Mode ruft Reducer doppelt auf (in der Entwicklung), um Unreinheit zu erkennen. Wenn ein Reducer Seiteneffekte wie API-Aufrufe ausführt, würden sie zweimal ausgeführt. Reducer sollten nur neuen State berechnen und zurückgeben — Seiteneffekte gehören in Event-Handler oder useEffect.',
            es: 'React Strict Mode invoca los reducers dos veces (en desarrollo) para ayudar a detectar impureza. Si un reducer realiza efectos secundarios como llamadas API, se ejecutarían dos veces. Los reducers solo deben calcular y devolver nuevo state — los efectos secundarios pertenecen a los manejadores de eventos o useEffect.',
            it: 'React Strict Mode invoca i reducers due volte (in sviluppo) per aiutare a rilevare l\'impurità. Se un reducer esegue effetti collaterali come chiamate API, verrebbero eseguiti due volte. I reducers dovrebbero solo calcolare e restituire nuovo state — gli effetti collaterali appartengono ai gestori di eventi o useEffect.',
          },
          docs: 'https://react.dev/learn/extracting-state-logic-into-a-reducer',
        },
      },
      {
        id: 'f32e1cdf-6631-450d-8f1f-ee0a6afa8b57',
        data: {
          question: {
            en: 'What is the \'Context + useReducer\' pattern used for?',
            fr: 'À quoi sert le pattern \'Context + useReducer\' ?',
            de: 'Wofür wird das \'Context + useReducer\'-Muster verwendet?',
            es: '¿Para qué se usa el patrón \'Context + useReducer\'?',
            it: 'A cosa serve il pattern \'Context + useReducer\'?',
          },
          choices: {
            en: ['Replacing useContext with a more performant API', 'A lightweight alternative to Redux: useReducer manages complex state, Context distributes it to the tree', 'Server-side rendering of context values', 'Persisting state to localStorage automatically'],
            fr: ['Remplacer useContext par une API plus performante', 'Une alternative légère à Redux : useReducer gère le state complexe, Context le distribue à l\'arbre', 'Rendu côté serveur des valeurs de context', 'Persistance automatique du state dans localStorage'],
            de: ['useContext durch eine performantere API ersetzen', 'Eine leichtgewichtige Alternative zu Redux: useReducer verwaltet komplexen State, Context verteilt ihn an den Baum', 'Server-seitiges Rendering von Context-Werten', 'Automatisches Speichern von State in localStorage'],
            es: ['Reemplazar useContext con una API más eficiente', 'Una alternativa ligera a Redux: useReducer gestiona state complejo, Context lo distribuye al árbol', 'Renderizado del lado del servidor de valores de context', 'Persistencia automática del state en localStorage'],
            it: ['Sostituire useContext con un\'API più performante', 'Un\'alternativa leggera a Redux: useReducer gestisce lo state complesso, Context lo distribuisce all\'albero', 'Rendering lato server dei valori di context', 'Persistenza automatica dello state in localStorage'],
          },
          answer: '1',
          tags: ['context', 'useReducer'],
          explanation: {
            en: 'Combining useReducer with Context gives you a Redux-like pattern without external libraries. The parent component holds the reducer state and dispatch, provides them through Context, and any descendant can read state or dispatch actions. This scales well for medium-complexity apps.',
            fr: 'Combiner useReducer avec Context vous donne un pattern similaire à Redux sans bibliothèques externes. Le component parent détient le state du reducer et dispatch, les fournit via Context, et tout descendant peut lire le state ou dispatcher des actions. Cela évolue bien pour les applications de complexité moyenne.',
            de: 'Die Kombination von useReducer mit Context gibt Ihnen ein Redux-ähnliches Muster ohne externe Bibliotheken. Die Eltern-Component hält den Reducer-State und dispatch, stellt sie über Context bereit, und jeder Nachkomme kann State lesen oder Actions dispatchen. Dies skaliert gut für Apps mittlerer Komplexität.',
            es: 'Combinar useReducer con Context te da un patrón similar a Redux sin bibliotecas externas. El component padre mantiene el state del reducer y dispatch, los proporciona a través de Context, y cualquier descendiente puede leer state o despachar acciones. Esto escala bien para aplicaciones de complejidad media.',
            it: 'Combinare useReducer con Context ti dà un pattern simile a Redux senza librerie esterne. Il component genitore mantiene lo state del reducer e dispatch, li fornisce tramite Context, e qualsiasi discendente può leggere lo state o inviare actions. Questo scala bene per app di media complessità.',
          },
          docs: 'https://react.dev/learn/passing-data-deeply-with-context',
        },
      },
      {
        id: '5cf09984-6ce9-4399-a7d2-4abbdbfa12e5',
        data: {
          question: {
            en: 'What does React use to determine if state has changed?',
            fr: 'Qu\'utilise React pour déterminer si le state a changé ?',
            de: 'Was verwendet React, um festzustellen, ob sich der State geändert hat?',
            es: '¿Qué usa React para determinar si el state ha cambiado?',
            it: 'Cosa usa React per determinare se lo state è cambiato?',
          },
          choices: {
            en: ['JSON.stringify() comparison', 'Deep equality (recursively compares nested properties)', 'A hash of the component\'s render output', 'Object.is() — strict equality check on the state value'],
            fr: ['Comparaison JSON.stringify()', 'Égalité profonde (compare récursivement les propriétés imbriquées)', 'Un hash de la sortie de rendu du component', 'Object.is() — vérification d\'égalité stricte sur la valeur de state'],
            de: ['JSON.stringify()-Vergleich', 'Tiefe Gleichheit (vergleicht rekursiv verschachtelte Eigenschaften)', 'Ein Hash der Render-Ausgabe der Component', 'Object.is() — strikte Gleichheitsprüfung auf den State-Wert'],
            es: ['Comparación JSON.stringify()', 'Igualdad profunda (compara recursivamente propiedades anidadas)', 'Un hash de la salida de render del component', 'Object.is() — verificación de igualdad estricta en el valor de state'],
            it: ['Confronto JSON.stringify()', 'Uguaglianza profonda (confronta ricorsivamente le proprietà annidate)', 'Un hash dell\'output di render del component', 'Object.is() — controllo di uguaglianza rigoroso sul valore di state'],
          },
          answer: '3',
          tags: ['state-structure'],
          explanation: {
            en: 'React uses Object.is() (similar to ===) to compare old and new state. This is why mutating objects or arrays in state doesn\'t trigger re-renders — the reference stays the same. Creating a new object/array gives React a different reference, signaling a change.',
            fr: 'React utilise Object.is() (similaire à ===) pour comparer l\'ancien et le nouveau state. C\'est pourquoi muter des objets ou des tableaux dans le state ne déclenche pas de re-rendu — la référence reste la même. Créer un nouvel objet/tableau donne à React une référence différente, signalant un changement.',
            de: 'React verwendet Object.is() (ähnlich wie ===), um alten und neuen State zu vergleichen. Deshalb löst das Mutieren von Objekten oder Arrays im State keine Re-Renders aus — die Referenz bleibt gleich. Das Erstellen eines neuen Objekts/Arrays gibt React eine andere Referenz und signalisiert eine Änderung.',
            es: 'React usa Object.is() (similar a ===) para comparar el state antiguo y nuevo. Por eso mutar objetos o arrays en el state no desencadena re-renders — la referencia permanece igual. Crear un nuevo objeto/array le da a React una referencia diferente, señalando un cambio.',
            it: 'React usa Object.is() (simile a ===) per confrontare lo state vecchio e nuovo. Questo è il motivo per cui mutare oggetti o array nello state non attiva re-render — il riferimento rimane lo stesso. Creare un nuovo oggetto/array dà a React un riferimento diverso, segnalando un cambiamento.',
          },
          docs: 'https://react.dev/learn/choosing-the-state-structure',
        },
      },
      {
        id: '3b15ba6e-f2d2-4c08-83da-0b481ecee1c4',
        data: {
          question: {
            en: 'Which of these are valid principles for structuring React state? (Select all that apply)',
            fr: 'Lesquels de ces principes sont valides pour structurer le state React ? (Sélectionnez toutes les réponses correctes)',
            de: 'Welche dieser Prinzipien sind gültig für die Strukturierung von React-State? (Wählen Sie alle zutreffenden aus)',
            es: '¿Cuáles de estos son principios válidos para estructurar el state de React? (Selecciona todos los que apliquen)',
            it: 'Quali di questi sono principi validi per strutturare lo state di React? (Seleziona tutte le opzioni corrette)',
          },
          choices: {
            en: ['Always split related state into individual useState calls', 'Don\'t mirror props in state unless you need to track independent mutations', 'Avoid storing derived values in state — compute them during render', 'Avoid deeply nested state — prefer flat structures'],
            fr: ['Toujours diviser le state lié en appels useState individuels', 'Ne pas reproduire les props dans le state sauf si vous devez suivre des mutations indépendantes', 'Éviter de stocker des valeurs dérivées dans le state — les calculer pendant le rendu', 'Éviter le state profondément imbriqué — préférer les structures plates'],
            de: ['Immer verwandten State in einzelne useState-Aufrufe aufteilen', 'Props nicht im State spiegeln, es sei denn, Sie müssen unabhängige Mutationen verfolgen', 'Abgeleitete Werte nicht im State speichern — während des Renderns berechnen', 'Tief verschachtelten State vermeiden — flache Strukturen bevorzugen'],
            es: ['Siempre dividir el state relacionado en llamadas useState individuales', 'No reflejar props en state a menos que necesites rastrear mutaciones independientes', 'Evitar almacenar valores derivados en state — calcularlos durante el render', 'Evitar state profundamente anidado — preferir estructuras planas'],
            it: ['Dividere sempre lo state correlato in chiamate useState individuali', 'Non rispecchiare le props nello state a meno che tu non debba tracciare mutazioni indipendenti', 'Evitare di memorizzare valori derivati nello state — calcolarli durante il render', 'Evitare state profondamente annidato — preferire strutture piatte'],
          },
          answer: '[1,2,3]',
          tags: ['state-structure'],
          explanation: {
            en: 'Mirroring props causes sync issues; derived values create redundancy; deep nesting makes immutable updates verbose. These three are core state design principles. Option C is wrong — related values that update together often belong in a single object to ensure they stay in sync.',
            fr: 'Reproduire les props cause des problèmes de synchronisation ; les valeurs dérivées créent de la redondance ; l\'imbrication profonde rend les mises à jour immuables verbeuses. Ces trois principes sont fondamentaux pour la conception du state. L\'option C est incorrecte — les valeurs liées qui se mettent à jour ensemble appartiennent souvent à un seul objet pour garantir qu\'elles restent synchronisées.',
            de: 'Props zu spiegeln verursacht Sync-Probleme; abgeleitete Werte schaffen Redundanz; tiefe Verschachtelung macht unveränderliche Updates ausführlich. Diese drei sind zentrale State-Design-Prinzipien. Option C ist falsch — verwandte Werte, die zusammen aktualisiert werden, gehören oft in ein einzelnes Objekt, um sicherzustellen, dass sie synchron bleiben.',
            es: 'Reflejar props causa problemas de sincronización; los valores derivados crean redundancia; el anidamiento profundo hace que las actualizaciones inmutables sean verbosas. Estos tres son principios centrales del diseño de state. La opción C es incorrecta — los valores relacionados que se actualizan juntos a menudo pertenecen a un solo objeto para asegurar que permanezcan sincronizados.',
            it: 'Rispecchiare le props causa problemi di sincronizzazione; i valori derivati creano ridondanza; l\'annidamento profondo rende gli aggiornamenti immutabili prolissi. Questi tre sono principi fondamentali della progettazione dello state. L\'opzione C è sbagliata — i valori correlati che si aggiornano insieme spesso appartengono a un singolo oggetto per garantire che rimangano sincronizzati.',
          },
          docs: 'https://react.dev/learn/choosing-the-state-structure',
        },
      },
      {
        id: 'bbd48a3f-df91-4a34-8269-fa649d54c3ca',
        data: {
          question: {
            en: 'What is a performance concern with Context and how can you mitigate it?',
            fr: 'Quel est un problème de performance avec Context et comment pouvez-vous l\'atténuer ?',
            de: 'Was ist ein Performance-Problem mit Context und wie können Sie es mildern?',
            es: '¿Cuál es una preocupación de rendimiento con Context y cómo puedes mitigarla?',
            it: 'Qual è un problema di prestazioni con Context e come puoi mitigarlo?',
          },
          choices: {
            en: ['Context only works in class components, causing performance issues in functional apps', 'Context causes memory leaks if not manually cleaned up', 'Every consumer re-renders when the Provider value changes; split context by concern and memoize values', 'Context cannot hold object values without performance degradation'],
            fr: ['Context ne fonctionne que dans les class components, causant des problèmes de performance dans les applications fonctionnelles', 'Context cause des fuites mémoire s\'il n\'est pas nettoyé manuellement', 'Chaque consommateur se re-rend lorsque la valeur du Provider change ; diviser le context par préoccupation et mémoïser les valeurs', 'Context ne peut pas contenir de valeurs d\'objet sans dégradation des performances'],
            de: ['Context funktioniert nur in Class-Components und verursacht Performance-Probleme in funktionalen Apps', 'Context verursacht Speicherlecks, wenn es nicht manuell bereinigt wird', 'Jeder Konsument rendert neu, wenn sich der Provider-Wert ändert; Context nach Anliegen aufteilen und Werte memoizen', 'Context kann keine Objektwerte ohne Performance-Verschlechterung halten'],
            es: ['Context solo funciona en class components, causando problemas de rendimiento en aplicaciones funcionales', 'Context causa fugas de memoria si no se limpia manualmente', 'Cada consumidor se vuelve a renderizar cuando el valor del Provider cambia; dividir el context por preocupación y memorizar valores', 'Context no puede contener valores de objeto sin degradación del rendimiento'],
            it: ['Context funziona solo nei class components, causando problemi di prestazioni nelle app funzionali', 'Context causa perdite di memoria se non viene pulito manualmente', 'Ogni consumatore viene re-renderizzato quando il valore del Provider cambia; dividere il context per preoccupazione e memoizzare i valori', 'Context non può contenere valori di oggetti senza degradazione delle prestazioni'],
          },
          answer: '2',
          tags: ['context'],
          explanation: {
            en: 'All components consuming a context re-render when the Provider value changes. If the value is a new object on every render (e.g., `value={{ theme, setTheme }}`), it will always trigger re-renders. Mitigate by splitting into separate contexts (data vs actions) and using useMemo to stabilize the value object.',
            fr: 'Tous les components consommant un context se re-rendent lorsque la valeur du Provider change. Si la valeur est un nouvel objet à chaque rendu (par ex., `value={{ theme, setTheme }}`), cela déclenchera toujours des re-rendus. Atténuez en divisant en contexts séparés (données vs actions) et en utilisant useMemo pour stabiliser l\'objet valeur.',
            de: 'Alle Components, die einen Context konsumieren, rendern neu, wenn sich der Provider-Wert ändert. Wenn der Wert bei jedem Render ein neues Objekt ist (z.B. `value={{ theme, setTheme }}`), löst es immer Re-Renders aus. Mildern Sie dies, indem Sie in separate Contexts aufteilen (Daten vs. Actions) und useMemo verwenden, um das Wert-Objekt zu stabilisieren.',
            es: 'Todos los components que consumen un context se vuelven a renderizar cuando el valor del Provider cambia. Si el valor es un nuevo objeto en cada render (p. ej., `value={{ theme, setTheme }}`), siempre desencadenará re-renders. Mitiga dividiendo en contexts separados (datos vs acciones) y usando useMemo para estabilizar el objeto valor.',
            it: 'Tutti i components che consumano un context vengono re-renderizzati quando il valore del Provider cambia. Se il valore è un nuovo oggetto ad ogni render (ad es., `value={{ theme, setTheme }}`), attiverà sempre re-render. Mitiga dividendo in contexts separati (dati vs actions) e usando useMemo per stabilizzare l\'oggetto valore.',
          },
          docs: 'https://react.dev/learn/passing-data-deeply-with-context',
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
      `SELECT id, data FROM "qcm_question" WHERE "moduleId" = '14f95086-16bb-4c2c-abad-4c96136ce04e'`
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
