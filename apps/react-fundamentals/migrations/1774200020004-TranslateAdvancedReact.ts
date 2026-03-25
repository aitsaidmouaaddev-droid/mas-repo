import type { MigrationInterface, QueryRunner } from 'typeorm';

export class TranslateAdvancedReact1774200020004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const questions = [
      {
        id: '4adef527-7e20-4742-98b9-86e63e2776a5',
        data: {
          question: {
            en: 'What does React.memo() do?',
            fr: "Que fait React.memo() ?",
            de: 'Was macht React.memo()?',
            es: '¿Qué hace React.memo()?',
            it: "Cosa fa React.memo()?",
          },
          choices: {
            en: [
              'Memoizes the return value of an expensive function calculation',
              'Wraps a component and skips re-rendering if props haven\'t changed (shallow comparison)',
              'Wraps a callback function to maintain a stable reference across renders',
              'Caches the component\'s DOM output in the browser\'s memory',
            ],
            fr: [
              "Mémorise la valeur de retour d'un calcul de fonction coûteux",
              "Enveloppe un component et saute le re-render si les props n'ont pas changé (comparaison superficielle)",
              "Enveloppe une fonction callback pour maintenir une référence stable entre les renders",
              "Met en cache la sortie DOM du component dans la mémoire du navigateur",
            ],
            de: [
              'Memoiert den Rückgabewert einer teuren Funktionsberechnung',
              'Umschließt ein Component und überspringt das Re-Rendering, wenn sich die props nicht geändert haben (flacher Vergleich)',
              'Umschließt eine Callback-Funktion, um eine stabile Referenz über Renders hinweg zu behalten',
              'Cached die DOM-Ausgabe des Components im Browser-Speicher',
            ],
            es: [
              'Memoiza el valor de retorno de un cálculo de función costoso',
              'Envuelve un component y omite el re-render si las props no han cambiado (comparación superficial)',
              'Envuelve una función callback para mantener una referencia estable entre renders',
              'Almacena en caché la salida DOM del component en la memoria del navegador',
            ],
            it: [
              "Memoizza il valore di ritorno di un calcolo di funzione costoso",
              "Avvolge un component e salta il re-render se le props non sono cambiate (confronto superficiale)",
              "Avvolge una funzione callback per mantenere un riferimento stabile tra i render",
              "Memorizza nella cache l'output DOM del component nella memoria del browser",
            ],
          },
          answer: '1',
          tags: ['memo'],
          explanation: {
            en: 'React.memo() is a higher-order component that shallowly compares props before re-rendering. If the parent re-renders but passes the same props, the memoized child is skipped. It only helps when the parent re-renders frequently and the child\'s props rarely change.',
            fr: "React.memo() est un component d'ordre supérieur qui compare superficiellement les props avant le re-render. Si le parent fait un re-render mais passe les mêmes props, l'enfant mémorisé est ignoré. Cela n'aide que lorsque le parent fait des re-renders fréquents et que les props de l'enfant changent rarement.",
            de: 'React.memo() ist ein Higher-Order-Component, das props vor dem Re-Rendering oberflächlich vergleicht. Wenn das Parent neu rendert, aber die gleichen props übergibt, wird das memoierte Child übersprungen. Es hilft nur, wenn das Parent häufig neu rendert und sich die props des Childs selten ändern.',
            es: 'React.memo() es un component de orden superior que compara superficialmente las props antes del re-render. Si el parent hace re-render pero pasa las mismas props, el child memoizado se omite. Solo ayuda cuando el parent hace re-render frecuentemente y las props del child cambian raramente.',
            it: "React.memo() è un component di ordine superiore che confronta superficialmente le props prima del re-render. Se il parent fa re-render ma passa le stesse props, il child memoizzato viene saltato. Aiuta solo quando il parent fa re-render frequentemente e le props del child cambiano raramente.",
          },
          docs: 'https://react.dev/reference/react/memo',
        },
      },
      {
        id: 'e0040823-032c-4ab5-8343-93d4c5f18af6',
        data: {
          question: {
            en: 'When does React.memo() fail to prevent a re-render?',
            fr: "Quand React.memo() échoue-t-il à empêcher un re-render ?",
            de: 'Wann versagt React.memo() dabei, ein Re-Rendering zu verhindern?',
            es: '¿Cuándo falla React.memo() en prevenir un re-render?',
            it: "Quando React.memo() fallisce nel prevenire un re-render?",
          },
          choices: {
            en: [
              'When the component has internal state',
              'When the component uses useContext',
              'When more than 5 props are passed',
              'When a prop is a new object or function reference created during the parent\'s render',
            ],
            fr: [
              "Quand le component a un state interne",
              "Quand le component utilise useContext",
              "Quand plus de 5 props sont passées",
              "Quand une prop est un nouvel objet ou une nouvelle référence de fonction créée pendant le render du parent",
            ],
            de: [
              'Wenn das Component internen State hat',
              'Wenn das Component useContext verwendet',
              'Wenn mehr als 5 props übergeben werden',
              'Wenn eine prop eine neue Objekt- oder Funktionsreferenz ist, die während des Renderings des Parents erstellt wurde',
            ],
            es: [
              'Cuando el component tiene state interno',
              'Cuando el component usa useContext',
              'Cuando se pasan más de 5 props',
              'Cuando una prop es un nuevo objeto o referencia de función creada durante el render del parent',
            ],
            it: [
              "Quando il component ha uno state interno",
              "Quando il component usa useContext",
              "Quando vengono passate più di 5 props",
              "Quando una prop è un nuovo oggetto o riferimento di funzione creato durante il render del parent",
            ],
          },
          answer: '3',
          tags: ['memo'],
          explanation: {
            en: 'React.memo uses shallow comparison. If a parent creates a new object `{}` or function `() => {}` on every render (even with identical values), those are new references and memo will not skip the re-render. Pair React.memo with useMemo (for objects) and useCallback (for functions) to stabilize references.',
            fr: "React.memo utilise une comparaison superficielle. Si un parent crée un nouvel objet `{}` ou une fonction `() => {}` à chaque render (même avec des valeurs identiques), ce sont de nouvelles références et memo ne sautera pas le re-render. Associez React.memo avec useMemo (pour les objets) et useCallback (pour les fonctions) pour stabiliser les références.",
            de: 'React.memo verwendet oberflächliche Vergleiche. Wenn ein Parent bei jedem Render ein neues Objekt `{}` oder eine Funktion `() => {}` erstellt (auch mit identischen Werten), sind das neue Referenzen und memo überspringt das Re-Rendering nicht. Kombinieren Sie React.memo mit useMemo (für Objekte) und useCallback (für Funktionen), um Referenzen zu stabilisieren.',
            es: 'React.memo usa comparación superficial. Si un parent crea un nuevo objeto `{}` o función `() => {}` en cada render (incluso con valores idénticos), esas son nuevas referencias y memo no omitirá el re-render. Combina React.memo con useMemo (para objetos) y useCallback (para funciones) para estabilizar referencias.',
            it: "React.memo usa un confronto superficiale. Se un parent crea un nuovo oggetto `{}` o funzione `() => {}` ad ogni render (anche con valori identici), questi sono nuovi riferimenti e memo non salterà il re-render. Abbina React.memo con useMemo (per oggetti) e useCallback (per funzioni) per stabilizzare i riferimenti.",
          },
          docs: 'https://react.dev/reference/react/memo',
        },
      },
      {
        id: '880bfdb7-6844-43b3-8346-982401851def',
        data: {
          question: {
            en: 'What is the difference between useMemo and useCallback?',
            fr: "Quelle est la différence entre useMemo et useCallback ?",
            de: 'Was ist der Unterschied zwischen useMemo und useCallback?',
            es: '¿Cuál es la diferencia entre useMemo y useCallback?',
            it: "Qual è la differenza tra useMemo e useCallback?",
          },
          choices: {
            en: [
              'useMemo is for asynchronous values; useCallback is for synchronous ones',
              'useCallback returns a value; useMemo returns a function',
              'useMemo memoizes the result of a computation; useCallback memoizes the function itself',
              'They are identical — useCallback is an alias for useMemo',
            ],
            fr: [
              "useMemo est pour les valeurs asynchrones ; useCallback est pour les valeurs synchrones",
              "useCallback retourne une valeur ; useMemo retourne une fonction",
              "useMemo mémorise le résultat d'un calcul ; useCallback mémorise la fonction elle-même",
              "Ils sont identiques — useCallback est un alias pour useMemo",
            ],
            de: [
              'useMemo ist für asynchrone Werte; useCallback ist für synchrone',
              'useCallback gibt einen Wert zurück; useMemo gibt eine Funktion zurück',
              'useMemo memoiert das Ergebnis einer Berechnung; useCallback memoiert die Funktion selbst',
              'Sie sind identisch — useCallback ist ein Alias für useMemo',
            ],
            es: [
              'useMemo es para valores asíncronos; useCallback es para valores síncronos',
              'useCallback retorna un valor; useMemo retorna una función',
              'useMemo memoiza el resultado de un cálculo; useCallback memoiza la función misma',
              'Son idénticos — useCallback es un alias para useMemo',
            ],
            it: [
              "useMemo è per valori asincroni; useCallback è per valori sincroni",
              "useCallback restituisce un valore; useMemo restituisce una funzione",
              "useMemo memoizza il risultato di un calcolo; useCallback memoizza la funzione stessa",
              "Sono identici — useCallback è un alias per useMemo",
            ],
          },
          answer: '2',
          tags: ['useMemo', 'useCallback'],
          explanation: {
            en: 'useMemo(() => compute(a, b), [a, b]) calls the function and returns its result. useCallback(() => doSomething(a), [a]) returns the function itself (not its result). useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). Both help maintain referential stability.',
            fr: "useMemo(() => compute(a, b), [a, b]) appelle la fonction et retourne son résultat. useCallback(() => doSomething(a), [a]) retourne la fonction elle-même (pas son résultat). useCallback(fn, deps) est équivalent à useMemo(() => fn, deps). Les deux aident à maintenir la stabilité référentielle.",
            de: 'useMemo(() => compute(a, b), [a, b]) ruft die Funktion auf und gibt ihr Ergebnis zurück. useCallback(() => doSomething(a), [a]) gibt die Funktion selbst zurück (nicht ihr Ergebnis). useCallback(fn, deps) ist äquivalent zu useMemo(() => fn, deps). Beide helfen, referenzielle Stabilität aufrechtzuerhalten.',
            es: 'useMemo(() => compute(a, b), [a, b]) llama a la función y retorna su resultado. useCallback(() => doSomething(a), [a]) retorna la función misma (no su resultado). useCallback(fn, deps) es equivalente a useMemo(() => fn, deps). Ambos ayudan a mantener la estabilidad referencial.',
            it: "useMemo(() => compute(a, b), [a, b]) chiama la funzione e restituisce il suo risultato. useCallback(() => doSomething(a), [a]) restituisce la funzione stessa (non il suo risultato). useCallback(fn, deps) è equivalente a useMemo(() => fn, deps). Entrambi aiutano a mantenere la stabilità referenziale.",
          },
          docs: 'https://react.dev/reference/react/useMemo',
        },
      },
      {
        id: '08e67f23-515e-49bb-8736-f4c149ef5da2',
        data: {
          question: {
            en: 'When is useMemo actually beneficial?',
            fr: "Quand useMemo est-il réellement bénéfique ?",
            de: 'Wann ist useMemo tatsächlich vorteilhaft?',
            es: '¿Cuándo es realmente beneficioso useMemo?',
            it: "Quando useMemo è realmente vantaggioso?",
          },
          choices: {
            en: [
              'When the computation is genuinely expensive (e.g., filtering 10,000 items) and the dependencies rarely change',
              'For every value derived from props to prevent any re-computation',
              'When you want to persist a value across page navigations',
              'When a value is used inside a useEffect',
            ],
            fr: [
              "Quand le calcul est véritablement coûteux (ex : filtrer 10 000 éléments) et que les dépendances changent rarement",
              "Pour toute valeur dérivée des props pour empêcher tout re-calcul",
              "Quand vous voulez persister une valeur entre les navigations de page",
              "Quand une valeur est utilisée dans un useEffect",
            ],
            de: [
              'Wenn die Berechnung wirklich teuer ist (z. B. Filtern von 10.000 Elementen) und sich die Abhängigkeiten selten ändern',
              'Für jeden von props abgeleiteten Wert, um jede Neuberechnung zu verhindern',
              'Wenn Sie einen Wert über Seitennavigationen hinweg beibehalten möchten',
              'Wenn ein Wert innerhalb eines useEffect verwendet wird',
            ],
            es: [
              'Cuando el cálculo es genuinamente costoso (ej: filtrar 10,000 elementos) y las dependencias cambian raramente',
              'Para cada valor derivado de props para prevenir cualquier re-cálculo',
              'Cuando quieres persistir un valor a través de navegaciones de página',
              'Cuando un valor se usa dentro de un useEffect',
            ],
            it: [
              "Quando il calcolo è veramente costoso (es: filtrare 10.000 elementi) e le dipendenze cambiano raramente",
              "Per ogni valore derivato dalle props per prevenire qualsiasi ri-calcolo",
              "Quando vuoi persistere un valore tra le navigazioni di pagina",
              "Quando un valore è usato all'interno di un useEffect",
            ],
          },
          answer: '0',
          tags: ['useMemo'],
          explanation: {
            en: 'useMemo has a cost — the dependency comparison runs on every render. For cheap computations, useMemo can be slower than just recomputing. Only apply it to provably expensive operations. Profile first; avoid premature memoization. The React compiler automates this in React 19.',
            fr: "useMemo a un coût — la comparaison des dépendances s'exécute à chaque render. Pour les calculs peu coûteux, useMemo peut être plus lent que de simplement recalculer. Appliquez-le uniquement aux opérations prouvées coûteuses. Profilez d'abord ; évitez la mémorisation prématurée. Le compilateur React automatise cela dans React 19.",
            de: 'useMemo hat Kosten — der Abhängigkeitsvergleich läuft bei jedem Render. Für billige Berechnungen kann useMemo langsamer sein als einfach neu zu berechnen. Wenden Sie es nur auf nachweislich teure Operationen an. Profilieren Sie zuerst; vermeiden Sie vorzeitige Memoierung. Der React-Compiler automatisiert dies in React 19.',
            es: 'useMemo tiene un costo — la comparación de dependencias se ejecuta en cada render. Para cálculos baratos, useMemo puede ser más lento que simplemente recalcular. Solo aplícalo a operaciones probadamente costosas. Perfila primero; evita la memoización prematura. El compilador de React automatiza esto en React 19.',
            it: "useMemo ha un costo — il confronto delle dipendenze viene eseguito ad ogni render. Per calcoli economici, useMemo può essere più lento che semplicemente ricalcolare. Applicalo solo a operazioni provabilmente costose. Profila prima; evita la memoizzazione prematura. Il compilatore React automatizza questo in React 19.",
          },
          docs: 'https://react.dev/reference/react/useMemo',
        },
      },
      {
        id: '57227fe9-081a-40c2-bb66-d18b15b4825c',
        data: {
          question: {
            en: 'What does this code do?\n\nconst Chart = React.lazy(() => import(\'./Chart\'));\n\nfunction Dashboard() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <Chart />\n    </Suspense>\n  );\n}',
            fr: "Que fait ce code ?\n\nconst Chart = React.lazy(() => import('./Chart'));\n\nfunction Dashboard() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <Chart />\n    </Suspense>\n  );\n}",
            de: 'Was macht dieser Code?\n\nconst Chart = React.lazy(() => import(\'./Chart\'));\n\nfunction Dashboard() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <Chart />\n    </Suspense>\n  );\n}',
            es: '¿Qué hace este código?\n\nconst Chart = React.lazy(() => import(\'./Chart\'));\n\nfunction Dashboard() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <Chart />\n    </Suspense>\n  );\n}',
            it: "Cosa fa questo codice?\n\nconst Chart = React.lazy(() => import('./Chart'));\n\nfunction Dashboard() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <Chart />\n    </Suspense>\n  );\n}",
          },
          choices: {
            en: [
              'Renders Chart immediately but shows Spinner if Chart throws an error',
              'Preloads Chart in the background when Dashboard first mounts',
              'Makes Chart optional — it only renders if the import succeeds',
              'Lazily loads the Chart module via dynamic import; shows <Spinner /> while the bundle is loading',
            ],
            fr: [
              "Rend Chart immédiatement mais affiche Spinner si Chart lève une erreur",
              "Précharge Chart en arrière-plan quand Dashboard est monté pour la première fois",
              "Rend Chart optionnel — il ne s'affiche que si l'import réussit",
              "Charge Chart de manière lazy via un import dynamique ; affiche <Spinner /> pendant le chargement du bundle",
            ],
            de: [
              'Rendert Chart sofort, zeigt aber Spinner, wenn Chart einen Fehler wirft',
              'Lädt Chart im Hintergrund vor, wenn Dashboard zum ersten Mal gemountet wird',
              'Macht Chart optional — es wird nur gerendert, wenn der Import erfolgreich ist',
              'Lädt das Chart-Modul lazy über dynamischen Import; zeigt <Spinner /> während das Bundle lädt',
            ],
            es: [
              'Renderiza Chart inmediatamente pero muestra Spinner si Chart lanza un error',
              'Precarga Chart en segundo plano cuando Dashboard se monta por primera vez',
              'Hace Chart opcional — solo se renderiza si el import tiene éxito',
              'Carga Chart de forma lazy mediante import dinámico; muestra <Spinner /> mientras se carga el bundle',
            ],
            it: [
              "Renderizza Chart immediatamente ma mostra Spinner se Chart lancia un errore",
              "Precarica Chart in background quando Dashboard viene montato per la prima volta",
              "Rende Chart opzionale — viene renderizzato solo se l'import ha successo",
              "Carica Chart in modo lazy tramite import dinamico; mostra <Spinner /> mentre il bundle sta caricando",
            ],
          },
          answer: '3',
          tags: ['suspense', 'lazy'],
          explanation: {
            en: 'React.lazy() + Suspense implements code splitting. The Chart component\'s JavaScript bundle is not loaded until Dashboard is rendered. While the bundle is fetching, Suspense shows the fallback. Once loaded, Chart renders. This reduces initial bundle size.',
            fr: "React.lazy() + Suspense implémente le code splitting. Le bundle JavaScript du component Chart n'est pas chargé avant que Dashboard ne soit rendu. Pendant que le bundle est en cours de récupération, Suspense affiche le fallback. Une fois chargé, Chart s'affiche. Cela réduit la taille du bundle initial.",
            de: 'React.lazy() + Suspense implementiert Code-Splitting. Das JavaScript-Bundle des Chart-Components wird erst geladen, wenn Dashboard gerendert wird. Während das Bundle geladen wird, zeigt Suspense das Fallback. Sobald geladen, wird Chart gerendert. Dies reduziert die initiale Bundle-Größe.',
            es: 'React.lazy() + Suspense implementa code splitting. El bundle JavaScript del component Chart no se carga hasta que Dashboard se renderiza. Mientras el bundle se está obteniendo, Suspense muestra el fallback. Una vez cargado, Chart se renderiza. Esto reduce el tamaño del bundle inicial.',
            it: "React.lazy() + Suspense implementa il code splitting. Il bundle JavaScript del component Chart non viene caricato finché Dashboard non viene renderizzato. Mentre il bundle sta venendo recuperato, Suspense mostra il fallback. Una volta caricato, Chart viene renderizzato. Questo riduce la dimensione del bundle iniziale.",
          },
          docs: 'https://react.dev/reference/react/Suspense',
        },
      },
      {
        id: '2e4580f0-60aa-47f4-a73f-b32dbf2066ba',
        data: {
          question: {
            en: 'What do React error boundaries catch?',
            fr: "Qu'attrapent les error boundaries de React ?",
            de: 'Was fangen React Error Boundaries ab?',
            es: '¿Qué capturan las error boundaries de React?',
            it: "Cosa catturano le error boundaries di React?",
          },
          choices: {
            en: [
              'All JavaScript errors anywhere in the application',
              'JavaScript errors thrown during rendering, in lifecycle methods, and in constructors of child components',
              'Only errors thrown inside event handlers',
              'Network errors from fetch calls inside useEffect',
            ],
            fr: [
              "Toutes les erreurs JavaScript n'importe où dans l'application",
              "Les erreurs JavaScript levées pendant le rendering, dans les méthodes de cycle de vie et dans les constructeurs des components enfants",
              "Uniquement les erreurs levées dans les gestionnaires d'événements",
              "Les erreurs réseau des appels fetch dans useEffect",
            ],
            de: [
              'Alle JavaScript-Fehler irgendwo in der Anwendung',
              'JavaScript-Fehler, die während des Renderings, in Lifecycle-Methoden und in Konstruktoren von Child-Components geworfen werden',
              'Nur Fehler, die in Event-Handlern geworfen werden',
              'Netzwerkfehler von fetch-Aufrufen innerhalb von useEffect',
            ],
            es: [
              'Todos los errores de JavaScript en cualquier lugar de la aplicación',
              'Errores de JavaScript lanzados durante el rendering, en métodos de ciclo de vida y en constructores de components hijos',
              'Solo errores lanzados dentro de manejadores de eventos',
              'Errores de red de llamadas fetch dentro de useEffect',
            ],
            it: [
              "Tutti gli errori JavaScript ovunque nell'applicazione",
              "Gli errori JavaScript lanciati durante il rendering, nei metodi del ciclo di vita e nei costruttori dei components figli",
              "Solo errori lanciati all'interno di event handler",
              "Errori di rete da chiamate fetch all'interno di useEffect",
            ],
          },
          answer: '1',
          tags: ['error-boundary'],
          explanation: {
            en: 'Error boundaries catch errors during rendering, lifecycle methods, and constructors. They do NOT catch errors in event handlers (use try/catch there), async code, server-side rendering, or errors in the error boundary itself. They must be class components implementing componentDidCatch or getDerivedStateFromError.',
            fr: "Les error boundaries attrapent les erreurs pendant le rendering, les méthodes de cycle de vie et les constructeurs. Elles n'attrapent PAS les erreurs dans les gestionnaires d'événements (utilisez try/catch là), le code asynchrone, le server-side rendering ou les erreurs dans l'error boundary elle-même. Elles doivent être des class components implémentant componentDidCatch ou getDerivedStateFromError.",
            de: 'Error Boundaries fangen Fehler während des Renderings, in Lifecycle-Methoden und Konstruktoren ab. Sie fangen KEINE Fehler in Event-Handlern ab (verwenden Sie dort try/catch), in asynchronem Code, beim Server-Side-Rendering oder Fehler in der Error Boundary selbst. Sie müssen Class-Components sein, die componentDidCatch oder getDerivedStateFromError implementieren.',
            es: 'Las error boundaries capturan errores durante el rendering, métodos de ciclo de vida y constructores. NO capturan errores en manejadores de eventos (usa try/catch ahí), código asíncrono, server-side rendering o errores en la error boundary misma. Deben ser class components que implementen componentDidCatch o getDerivedStateFromError.',
            it: "Le error boundaries catturano errori durante il rendering, metodi del ciclo di vita e costruttori. NON catturano errori negli event handler (usa try/catch lì), codice asincrono, server-side rendering o errori nell'error boundary stessa. Devono essere class components che implementano componentDidCatch o getDerivedStateFromError.",
          },
          docs: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary',
        },
      },
      {
        id: '2208f22f-99f2-4d8f-a11b-09c825f8eb91',
        data: {
          question: {
            en: 'Which statement correctly describes React Server Components?',
            fr: "Quelle affirmation décrit correctement les React Server Components ?",
            de: 'Welche Aussage beschreibt React Server Components korrekt?',
            es: '¿Qué afirmación describe correctamente los React Server Components?',
            it: "Quale affermazione descrive correttamente i React Server Components?",
          },
          choices: {
            en: [
              'They run only on the server, can access backend resources directly, and send rendered HTML + serialized props to the client',
              'They are components that fetch data using useEffect on the server',
              'They replace client components and always require a \'use server\' directive',
              'They are components that run in a service worker',
            ],
            fr: [
              "Ils s'exécutent uniquement sur le serveur, peuvent accéder directement aux ressources backend et envoient du HTML rendu + des props sérialisées au client",
              "Ce sont des components qui récupèrent des données en utilisant useEffect sur le serveur",
              "Ils remplacent les client components et nécessitent toujours une directive 'use server'",
              "Ce sont des components qui s'exécutent dans un service worker",
            ],
            de: [
              'Sie laufen nur auf dem Server, können direkt auf Backend-Ressourcen zugreifen und senden gerenderte HTML + serialisierte props an den Client',
              'Sie sind Components, die Daten mit useEffect auf dem Server abrufen',
              'Sie ersetzen Client-Components und erfordern immer eine \'use server\'-Direktive',
              'Sie sind Components, die in einem Service Worker laufen',
            ],
            es: [
              'Se ejecutan solo en el servidor, pueden acceder a recursos backend directamente y envían HTML renderizado + props serializadas al cliente',
              'Son components que obtienen datos usando useEffect en el servidor',
              'Reemplazan a los client components y siempre requieren una directiva \'use server\'',
              'Son components que se ejecutan en un service worker',
            ],
            it: [
              "Vengono eseguiti solo sul server, possono accedere direttamente alle risorse backend e inviano HTML renderizzato + props serializzate al client",
              "Sono components che recuperano dati usando useEffect sul server",
              "Sostituiscono i client components e richiedono sempre una direttiva 'use server'",
              "Sono components che vengono eseguiti in un service worker",
            ],
          },
          answer: '0',
          tags: ['react-19', 'server-components'],
          explanation: {
            en: 'React Server Components execute on the server (at request time or build time), can directly access databases and file systems, never ship their JavaScript to the browser, and produce a special React tree that clients hydrate. They reduce client bundle size significantly.',
            fr: "Les React Server Components s'exécutent sur le serveur (au moment de la requête ou de la build), peuvent accéder directement aux bases de données et aux systèmes de fichiers, n'envoient jamais leur JavaScript au navigateur et produisent un arbre React spécial que les clients hydratent. Ils réduisent considérablement la taille du bundle client.",
            de: 'React Server Components werden auf dem Server ausgeführt (bei Request-Zeit oder Build-Zeit), können direkt auf Datenbanken und Dateisysteme zugreifen, senden ihr JavaScript nie an den Browser und erzeugen einen speziellen React-Baum, den Clients hydrieren. Sie reduzieren die Client-Bundle-Größe erheblich.',
            es: 'Los React Server Components se ejecutan en el servidor (en tiempo de solicitud o compilación), pueden acceder directamente a bases de datos y sistemas de archivos, nunca envían su JavaScript al navegador y producen un árbol React especial que los clientes hidratan. Reducen significativamente el tamaño del bundle del cliente.',
            it: "I React Server Components vengono eseguiti sul server (al momento della richiesta o della build), possono accedere direttamente a database e file system, non inviano mai il loro JavaScript al browser e producono un albero React speciale che i client idratano. Riducono significativamente la dimensione del bundle del client.",
          },
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: 'ad3d27ab-ac43-4dc1-a509-60c66393c5e8',
        data: {
          question: {
            en: 'Which of these cannot be done inside a React Server Component?',
            fr: "Laquelle de ces actions ne peut pas être effectuée dans un React Server Component ?",
            de: 'Was kann nicht innerhalb eines React Server Components gemacht werden?',
            es: '¿Cuál de estas acciones no se puede hacer dentro de un React Server Component?',
            it: "Quale di queste azioni non può essere eseguita all'interno di un React Server Component?",
          },
          choices: {
            en: [
              'Reading from a database',
              'Rendering other Server Components',
              'Using useState, useEffect, or browser APIs like window/document',
              'Passing serializable props to Client Components',
            ],
            fr: [
              "Lire depuis une base de données",
              "Rendre d'autres Server Components",
              "Utiliser useState, useEffect ou des APIs navigateur comme window/document",
              "Passer des props sérialisables aux Client Components",
            ],
            de: [
              'Aus einer Datenbank lesen',
              'Andere Server Components rendern',
              'useState, useEffect oder Browser-APIs wie window/document verwenden',
              'Serialisierbare props an Client-Components übergeben',
            ],
            es: [
              'Leer desde una base de datos',
              'Renderizar otros Server Components',
              'Usar useState, useEffect o APIs del navegador como window/document',
              'Pasar props serializables a Client Components',
            ],
            it: [
              "Leggere da un database",
              "Renderizzare altri Server Components",
              "Usare useState, useEffect o API del browser come window/document",
              "Passare props serializzabili ai Client Components",
            ],
          },
          answer: '2',
          tags: ['react-19', 'server-components', 'use-client'],
          explanation: {
            en: 'Server Components run on the server — there is no browser, no event loop, no DOM. Therefore useState, useEffect, event handlers, and browser APIs are unavailable. Database reads, file I/O, and async data fetching are perfectly valid. Use \'use client\' to mark components that need browser APIs.',
            fr: "Les Server Components s'exécutent sur le serveur — il n'y a pas de navigateur, pas de boucle d'événements, pas de DOM. Par conséquent useState, useEffect, les gestionnaires d'événements et les APIs navigateur ne sont pas disponibles. Les lectures de base de données, les I/O de fichiers et la récupération de données asynchrones sont parfaitement valides. Utilisez 'use client' pour marquer les components qui nécessitent des APIs navigateur.",
            de: 'Server Components laufen auf dem Server — es gibt keinen Browser, keine Event-Loop, kein DOM. Daher sind useState, useEffect, Event-Handler und Browser-APIs nicht verfügbar. Datenbanklesevorgänge, Datei-I/O und asynchrones Datenabrufen sind vollkommen gültig. Verwenden Sie \'use client\', um Components zu markieren, die Browser-APIs benötigen.',
            es: 'Los Server Components se ejecutan en el servidor — no hay navegador, no hay event loop, no hay DOM. Por lo tanto useState, useEffect, manejadores de eventos y APIs del navegador no están disponibles. Las lecturas de base de datos, I/O de archivos y obtención de datos asíncrona son perfectamente válidas. Usa \'use client\' para marcar components que necesiten APIs del navegador.',
            it: "I Server Components vengono eseguiti sul server — non c'è browser, non c'è event loop, non c'è DOM. Pertanto useState, useEffect, event handler e API del browser non sono disponibili. Le letture del database, I/O di file e recupero dati asincrono sono perfettamente validi. Usa 'use client' per marcare i components che necessitano di API del browser.",
          },
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: 'dea630ee-df6e-4c84-81f0-14f812dde6a1',
        data: {
          question: {
            en: 'What does the \'use client\' directive do in a Next.js / React 19 project?',
            fr: "Que fait la directive 'use client' dans un projet Next.js / React 19 ?",
            de: 'Was macht die \'use client\'-Direktive in einem Next.js / React 19-Projekt?',
            es: '¿Qué hace la directiva \'use client\' en un proyecto Next.js / React 19?',
            it: "Cosa fa la direttiva 'use client' in un progetto Next.js / React 19?",
          },
          choices: {
            en: [
              'Enables client-side routing for the component',
              'Prevents the component from being rendered on the server',
              'Marks a component as a Client Component — it will be shipped to and executed in the browser',
              'Enables TypeScript type checking for browser APIs',
            ],
            fr: [
              "Active le routage côté client pour le component",
              "Empêche le component d'être rendu sur le serveur",
              "Marque un component comme Client Component — il sera envoyé et exécuté dans le navigateur",
              "Active la vérification de type TypeScript pour les APIs navigateur",
            ],
            de: [
              'Aktiviert Client-seitiges Routing für das Component',
              'Verhindert, dass das Component auf dem Server gerendert wird',
              'Markiert ein Component als Client-Component — es wird an den Browser gesendet und dort ausgeführt',
              'Aktiviert TypeScript-Typprüfung für Browser-APIs',
            ],
            es: [
              'Habilita el enrutamiento del lado del cliente para el component',
              'Evita que el component se renderice en el servidor',
              'Marca un component como Client Component — será enviado y ejecutado en el navegador',
              'Habilita la verificación de tipos TypeScript para APIs del navegador',
            ],
            it: [
              "Abilita il routing lato client per il component",
              "Impedisce che il component venga renderizzato sul server",
              "Marca un component come Client Component — verrà inviato ed eseguito nel browser",
              "Abilita il controllo dei tipi TypeScript per le API del browser",
            ],
          },
          answer: '2',
          tags: ['use-client'],
          explanation: {
            en: '\'use client\' is a bundler directive placed at the top of a file. It creates a boundary: the file and all components imported by it are Client Components. They are included in the JavaScript bundle sent to the browser and can use hooks, event handlers, and browser APIs.',
            fr: "'use client' est une directive du bundler placée en haut d'un fichier. Elle crée une frontière : le fichier et tous les components importés par celui-ci sont des Client Components. Ils sont inclus dans le bundle JavaScript envoyé au navigateur et peuvent utiliser des hooks, des gestionnaires d'événements et des APIs navigateur.",
            de: '\'use client\' ist eine Bundler-Direktive, die am Anfang einer Datei platziert wird. Sie erstellt eine Grenze: die Datei und alle von ihr importierten Components sind Client-Components. Sie sind im JavaScript-Bundle enthalten, das an den Browser gesendet wird, und können Hooks, Event-Handler und Browser-APIs verwenden.',
            es: '\'use client\' es una directiva del empaquetador colocada en la parte superior de un archivo. Crea un límite: el archivo y todos los components importados por él son Client Components. Se incluyen en el bundle JavaScript enviado al navegador y pueden usar hooks, manejadores de eventos y APIs del navegador.',
            it: "'use client' è una direttiva del bundler posta all'inizio di un file. Crea un confine: il file e tutti i components importati da esso sono Client Components. Sono inclusi nel bundle JavaScript inviato al browser e possono usare hooks, event handler e API del browser.",
          },
          docs: 'https://react.dev/reference/rsc/use-client',
        },
      },
      {
        id: '103343ba-b0b3-4844-9d33-304a7cda0e30',
        data: {
          question: {
            en: 'What is a hydration error and what causes it?',
            fr: "Qu'est-ce qu'une erreur d'hydration et qu'est-ce qui la cause ?",
            de: 'Was ist ein Hydration-Fehler und was verursacht ihn?',
            es: '¿Qué es un error de hidratación y qué lo causa?',
            it: "Cos'è un errore di idratazione e cosa lo causa?",
          },
          choices: {
            en: [
              'An error thrown when a Server Component fetches data from an unavailable API',
              'A memory leak caused by improper cleanup in useEffect',
              'An error when importing a Server Component into a Client Component',
              'A mismatch between the HTML rendered on the server and what React renders on the client during hydration',
            ],
            fr: [
              "Une erreur levée quand un Server Component récupère des données depuis une API indisponible",
              "Une fuite mémoire causée par un nettoyage inapproprié dans useEffect",
              "Une erreur lors de l'import d'un Server Component dans un Client Component",
              "Une discordance entre le HTML rendu sur le serveur et ce que React rend sur le client pendant l'hydration",
            ],
            de: [
              'Ein Fehler, der geworfen wird, wenn ein Server Component Daten von einer nicht verfügbaren API abruft',
              'Ein Speicherleck, das durch unsachgemäße Bereinigung in useEffect verursacht wird',
              'Ein Fehler beim Importieren eines Server Components in ein Client Component',
              'Eine Diskrepanz zwischen dem auf dem Server gerenderten HTML und dem, was React während der Hydration auf dem Client rendert',
            ],
            es: [
              'Un error lanzado cuando un Server Component obtiene datos de una API no disponible',
              'Una fuga de memoria causada por una limpieza incorrecta en useEffect',
              'Un error al importar un Server Component en un Client Component',
              'Una discrepancia entre el HTML renderizado en el servidor y lo que React renderiza en el cliente durante la hidratación',
            ],
            it: [
              "Un errore lanciato quando un Server Component recupera dati da un'API non disponibile",
              "Una perdita di memoria causata da una pulizia impropria in useEffect",
              "Un errore quando si importa un Server Component in un Client Component",
              "Una discrepanza tra l'HTML renderizzato sul server e ciò che React renderizza sul client durante l'idratazione",
            ],
          },
          answer: '3',
          tags: ['react-19', 'server-components'],
          explanation: {
            en: 'Hydration is the process where React attaches event listeners to server-rendered HTML. If the client renders different JSX (due to Date.now(), Math.random(), or browser-only APIs), React throws a hydration mismatch error. Fix by using suppressHydrationWarning or ensuring consistent rendering between server and client.',
            fr: "L'hydration est le processus où React attache des écouteurs d'événements au HTML rendu par le serveur. Si le client rend un JSX différent (à cause de Date.now(), Math.random() ou des APIs exclusives au navigateur), React lève une erreur de discordance d'hydration. Corrigez en utilisant suppressHydrationWarning ou en assurant un rendu cohérent entre serveur et client.",
            de: 'Hydration ist der Prozess, bei dem React Event-Listener an vom Server gerendertes HTML anhängt. Wenn der Client unterschiedliches JSX rendert (aufgrund von Date.now(), Math.random() oder browserspezifischen APIs), wirft React einen Hydration-Mismatch-Fehler. Beheben Sie dies durch Verwendung von suppressHydrationWarning oder durch konsistentes Rendering zwischen Server und Client.',
            es: 'La hidratación es el proceso donde React adjunta event listeners al HTML renderizado por el servidor. Si el cliente renderiza JSX diferente (debido a Date.now(), Math.random() o APIs exclusivas del navegador), React lanza un error de discrepancia de hidratación. Corrígelo usando suppressHydrationWarning o asegurando un renderizado consistente entre servidor y cliente.',
            it: "L'idratazione è il processo in cui React allega event listener all'HTML renderizzato dal server. Se il client renderizza JSX diverso (a causa di Date.now(), Math.random() o API esclusive del browser), React lancia un errore di discrepanza di idratazione. Correggilo usando suppressHydrationWarning o assicurando un rendering coerente tra server e client.",
          },
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: '1dcdc493-27a9-464d-8af0-f1b3ca39e4dd',
        data: {
          question: {
            en: 'How does `use(promise)` interact with Suspense in React 19?',
            fr: "Comment `use(promise)` interagit-il avec Suspense dans React 19 ?",
            de: 'Wie interagiert `use(promise)` mit Suspense in React 19?',
            es: '¿Cómo interactúa `use(promise)` con Suspense en React 19?',
            it: "Come interagisce `use(promise)` con Suspense in React 19?",
          },
          choices: {
            en: [
              'While the promise is pending, the component suspends and the nearest Suspense boundary shows its fallback',
              'use(promise) blocks the main thread until the promise resolves',
              'use(promise) requires an ErrorBoundary — otherwise it crashes the app',
              'use(promise) only works inside Server Components',
            ],
            fr: [
              "Pendant que la promesse est en attente, le component se suspend et la Suspense boundary la plus proche affiche son fallback",
              "use(promise) bloque le thread principal jusqu'à ce que la promesse se résolve",
              "use(promise) nécessite une ErrorBoundary — sinon il fait planter l'app",
              "use(promise) fonctionne uniquement dans les Server Components",
            ],
            de: [
              'Während das Promise pending ist, wird das Component suspendiert und die nächste Suspense-Grenze zeigt ihr Fallback',
              'use(promise) blockiert den Haupt-Thread, bis das Promise aufgelöst wird',
              'use(promise) erfordert eine ErrorBoundary — andernfalls stürzt die App ab',
              'use(promise) funktioniert nur in Server Components',
            ],
            es: [
              'Mientras la promesa está pendiente, el component se suspende y el límite Suspense más cercano muestra su fallback',
              'use(promise) bloquea el hilo principal hasta que la promesa se resuelva',
              'use(promise) requiere una ErrorBoundary — de lo contrario hace fallar la app',
              'use(promise) solo funciona dentro de Server Components',
            ],
            it: [
              "Mentre la promise è in sospeso, il component si sospende e il confine Suspense più vicino mostra il suo fallback",
              "use(promise) blocca il thread principale finché la promise non si risolve",
              "use(promise) richiede una ErrorBoundary — altrimenti fa crashare l'app",
              "use(promise) funziona solo all'interno dei Server Components",
            ],
          },
          answer: '0',
          tags: ['react-19', 'use-hook', 'suspense'],
          explanation: {
            en: 'use(promise) integrates with Suspense: when the promise is pending, React suspends the component (throws a special signal), and the nearest <Suspense fallback> is shown. When the promise resolves, React re-renders the component with the resolved value. ErrorBoundary handles rejections.',
            fr: "use(promise) s'intègre avec Suspense : quand la promesse est en attente, React suspend le component (lance un signal spécial), et le <Suspense fallback> le plus proche est affiché. Quand la promesse se résout, React re-rend le component avec la valeur résolue. ErrorBoundary gère les rejets.",
            de: 'use(promise) integriert sich mit Suspense: wenn das Promise pending ist, suspendiert React das Component (wirft ein spezielles Signal), und das nächste <Suspense fallback> wird angezeigt. Wenn das Promise aufgelöst wird, rendert React das Component mit dem aufgelösten Wert neu. ErrorBoundary behandelt Ablehnungen.',
            es: 'use(promise) se integra con Suspense: cuando la promesa está pendiente, React suspende el component (lanza una señal especial), y se muestra el <Suspense fallback> más cercano. Cuando la promesa se resuelve, React vuelve a renderizar el component con el valor resuelto. ErrorBoundary maneja los rechazos.',
            it: "use(promise) si integra con Suspense: quando la promise è in sospeso, React sospende il component (lancia un segnale speciale), e viene mostrato il <Suspense fallback> più vicino. Quando la promise si risolve, React ri-renderizza il component con il valore risolto. ErrorBoundary gestisce i rifiuti.",
          },
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: '0b561802-6bed-46f3-a40d-861913dbf54b',
        data: {
          question: {
            en: 'Which combinations make React.memo() effective? (Select all that apply)',
            fr: "Quelles combinaisons rendent React.memo() efficace ? (Sélectionnez toutes celles qui s'appliquent)",
            de: 'Welche Kombinationen machen React.memo() effektiv? (Wählen Sie alle zutreffenden)',
            es: '¿Qué combinaciones hacen efectivo React.memo()? (Selecciona todas las que apliquen)',
            it: "Quali combinazioni rendono React.memo() efficace? (Seleziona tutte quelle applicabili)",
          },
          choices: {
            en: [
              'React.memo on the child alone when props include inline arrow functions',
              'React.memo on the child + useCallback on handler functions passed as props',
              'React.memo on the child + useMemo on object props created in the parent',
              'React.memo on the child when all props are primitive values (strings, numbers, booleans)',
            ],
            fr: [
              "React.memo sur l'enfant seul quand les props incluent des fonctions fléchées inline",
              "React.memo sur l'enfant + useCallback sur les fonctions de gestion passées comme props",
              "React.memo sur l'enfant + useMemo sur les props objets créées dans le parent",
              "React.memo sur l'enfant quand toutes les props sont des valeurs primitives (strings, numbers, booleans)",
            ],
            de: [
              'React.memo auf dem Child allein, wenn props Inline-Arrow-Funktionen enthalten',
              'React.memo auf dem Child + useCallback auf Handler-Funktionen, die als props übergeben werden',
              'React.memo auf dem Child + useMemo auf Objekt-props, die im Parent erstellt werden',
              'React.memo auf dem Child, wenn alle props primitive Werte sind (Strings, Numbers, Booleans)',
            ],
            es: [
              'React.memo en el child solo cuando las props incluyen funciones flecha inline',
              'React.memo en el child + useCallback en funciones manejadoras pasadas como props',
              'React.memo en el child + useMemo en props objeto creadas en el parent',
              'React.memo en el child cuando todas las props son valores primitivos (strings, numbers, booleans)',
            ],
            it: [
              "React.memo sul child da solo quando le props includono arrow functions inline",
              "React.memo sul child + useCallback sulle funzioni handler passate come props",
              "React.memo sul child + useMemo sulle props oggetto create nel parent",
              "React.memo sul child quando tutte le props sono valori primitivi (stringhe, numeri, booleani)",
            ],
          },
          answer: '[1,2,3]',
          tags: ['memo', 'useMemo', 'useCallback'],
          explanation: {
            en: 'React.memo works with shallow comparison. Primitives compare by value, so they\'re safe (option D). Functions and objects are compared by reference — inline definitions create new references every render, defeating memo (option C is wrong). useCallback stabilizes functions (A), useMemo stabilizes objects (B).',
            fr: "React.memo fonctionne avec une comparaison superficielle. Les primitives se comparent par valeur, donc elles sont sûres (option D). Les fonctions et objets se comparent par référence — les définitions inline créent de nouvelles références à chaque render, ce qui rend memo inefficace (l'option C est fausse). useCallback stabilise les fonctions (A), useMemo stabilise les objets (B).",
            de: 'React.memo arbeitet mit oberflächlichem Vergleich. Primitive vergleichen nach Wert, daher sind sie sicher (Option D). Funktionen und Objekte werden nach Referenz verglichen — Inline-Definitionen erstellen bei jedem Render neue Referenzen, was memo unwirksam macht (Option C ist falsch). useCallback stabilisiert Funktionen (A), useMemo stabilisiert Objekte (B).',
            es: 'React.memo funciona con comparación superficial. Los primitivos se comparan por valor, por lo que son seguros (opción D). Las funciones y objetos se comparan por referencia — las definiciones inline crean nuevas referencias en cada render, anulando memo (la opción C es incorrecta). useCallback estabiliza funciones (A), useMemo estabiliza objetos (B).',
            it: "React.memo funziona con confronto superficiale. I primitivi si confrontano per valore, quindi sono sicuri (opzione D). Funzioni e oggetti sono confrontati per riferimento — le definizioni inline creano nuovi riferimenti ad ogni render, vanificando memo (l'opzione C è sbagliata). useCallback stabilizza le funzioni (A), useMemo stabilizza gli oggetti (B).",
          },
          docs: 'https://react.dev/reference/react/memo',
        },
      },
      {
        id: '394e5907-4009-4a63-8007-8f6bab953ddc',
        data: {
          question: {
            en: 'Where must a <Suspense> boundary be placed relative to a component using React.lazy() or use()?',
            fr: "Où doit être placée une boundary <Suspense> par rapport à un component utilisant React.lazy() ou use() ?",
            de: 'Wo muss eine <Suspense>-Grenze relativ zu einem Component platziert werden, das React.lazy() oder use() verwendet?',
            es: '¿Dónde debe colocarse un límite <Suspense> en relación a un component que usa React.lazy() o use()?',
            it: "Dove deve essere posizionato un confine <Suspense> rispetto a un component che usa React.lazy() o use()?",
          },
          choices: {
            en: [
              'As the direct parent of the lazy/suspending component only',
              'Anywhere above the suspending component in the tree — it catches suspension from any descendant',
              'At the root of the application only',
              'Inside the lazy component itself',
            ],
            fr: [
              "Comme parent direct du component lazy/suspending uniquement",
              "N'importe où au-dessus du component suspending dans l'arbre — il attrape la suspension de n'importe quel descendant",
              "À la racine de l'application uniquement",
              "À l'intérieur du component lazy lui-même",
            ],
            de: [
              'Nur als direkter Parent des lazy/suspendierenden Components',
              'Irgendwo oberhalb des suspendierenden Components im Baum — es fängt Suspension von jedem Nachfahren ab',
              'Nur an der Wurzel der Anwendung',
              'Innerhalb des lazy Components selbst',
            ],
            es: [
              'Como parent directo del component lazy/suspendido solamente',
              'En cualquier lugar por encima del component suspendido en el árbol — captura la suspensión de cualquier descendiente',
              'Solo en la raíz de la aplicación',
              'Dentro del component lazy mismo',
            ],
            it: [
              "Come parent diretto del component lazy/sospeso solamente",
              "Ovunque sopra il component sospeso nell'albero — cattura la sospensione da qualsiasi discendente",
              "Solo alla radice dell'applicazione",
              "All'interno del component lazy stesso",
            ],
          },
          answer: '1',
          tags: ['suspense'],
          explanation: {
            en: 'Suspense boundaries work like error boundaries — they catch suspension from any descendant, not just direct children. You can nest multiple Suspense boundaries for granular loading states. The nearest ancestor Suspense boundary catches the suspension and shows its fallback.',
            fr: "Les boundaries Suspense fonctionnent comme les error boundaries — elles attrapent la suspension de n'importe quel descendant, pas seulement des enfants directs. Vous pouvez imbriquer plusieurs boundaries Suspense pour des états de chargement granulaires. La boundary Suspense ancêtre la plus proche attrape la suspension et affiche son fallback.",
            de: 'Suspense-Grenzen funktionieren wie Error Boundaries — sie fangen Suspension von jedem Nachfahren ab, nicht nur von direkten Children. Sie können mehrere Suspense-Grenzen für granulare Ladezustände verschachteln. Die nächste Vorfahren-Suspense-Grenze fängt die Suspension ab und zeigt ihr Fallback.',
            es: 'Los límites Suspense funcionan como error boundaries — capturan la suspensión de cualquier descendiente, no solo de children directos. Puedes anidar múltiples límites Suspense para estados de carga granulares. El límite Suspense ancestro más cercano captura la suspensión y muestra su fallback.',
            it: "I confini Suspense funzionano come le error boundaries — catturano la sospensione da qualsiasi discendente, non solo dai children diretti. Puoi annidare più confini Suspense per stati di caricamento granulari. Il confine Suspense antenato più vicino cattura la sospensione e mostra il suo fallback.",
          },
          docs: 'https://react.dev/reference/react/Suspense',
        },
      },
      {
        id: 'da6f7828-d05e-4777-b27b-d82cfb921c6e',
        data: {
          question: {
            en: 'Can a Server Component be imported by a Client Component?',
            fr: "Un Server Component peut-il être importé par un Client Component ?",
            de: 'Kann ein Server Component von einem Client Component importiert werden?',
            es: '¿Puede un Server Component ser importado por un Client Component?',
            it: "Un Server Component può essere importato da un Client Component?",
          },
          choices: {
            en: [
              'Yes — freely import Server Components into Client Components',
              'No — but a Server Component can be passed to a Client Component as a prop (children or JSX slot)',
              'Yes — but only if the Server Component has no async operations',
              'No — Server and Client Components cannot interact at all',
            ],
            fr: [
              "Oui — importez librement les Server Components dans les Client Components",
              "Non — mais un Server Component peut être passé à un Client Component comme prop (children ou slot JSX)",
              "Oui — mais seulement si le Server Component n'a pas d'opérations asynchrones",
              "Non — les Server et Client Components ne peuvent pas interagir du tout",
            ],
            de: [
              'Ja — importieren Sie Server Components frei in Client Components',
              'Nein — aber ein Server Component kann als prop (children oder JSX-Slot) an ein Client Component übergeben werden',
              'Ja — aber nur wenn das Server Component keine asynchronen Operationen hat',
              'Nein — Server und Client Components können überhaupt nicht interagieren',
            ],
            es: [
              'Sí — importa libremente Server Components en Client Components',
              'No — pero un Server Component puede pasarse a un Client Component como prop (children o slot JSX)',
              'Sí — pero solo si el Server Component no tiene operaciones asíncronas',
              'No — los Server y Client Components no pueden interactuar en absoluto',
            ],
            it: [
              "Sì — importa liberamente Server Components nei Client Components",
              "No — ma un Server Component può essere passato a un Client Component come prop (children o slot JSX)",
              "Sì — ma solo se il Server Component non ha operazioni asincrone",
              "No — i Server e Client Components non possono interagire affatto",
            ],
          },
          answer: '1',
          tags: ['react-19', 'server-components'],
          explanation: {
            en: 'Once you cross into \'use client\' territory, everything imported must be client-compatible. You cannot import a Server Component inside a Client Component. However, you CAN pass a server-rendered component as the `children` prop from a Server Component parent, which is the recommended composition pattern.',
            fr: "Une fois que vous entrez en territoire 'use client', tout ce qui est importé doit être compatible client. Vous ne pouvez pas importer un Server Component dans un Client Component. Cependant, vous POUVEZ passer un component rendu côté serveur comme prop `children` depuis un parent Server Component, ce qui est le pattern de composition recommandé.",
            de: 'Sobald Sie in \'use client\'-Territorium wechseln, muss alles Importierte clientkompatibel sein. Sie können kein Server Component innerhalb eines Client Components importieren. Sie KÖNNEN jedoch ein serverseitig gerendertes Component als `children`-prop von einem Server Component-Parent übergeben, was das empfohlene Kompositionsmuster ist.',
            es: 'Una vez que cruzas al territorio \'use client\', todo lo importado debe ser compatible con el cliente. No puedes importar un Server Component dentro de un Client Component. Sin embargo, PUEDES pasar un component renderizado en el servidor como prop `children` desde un parent Server Component, que es el patrón de composición recomendado.',
            it: "Una volta che entri nel territorio 'use client', tutto ciò che viene importato deve essere client-compatibile. Non puoi importare un Server Component all'interno di un Client Component. Tuttavia, PUOI passare un component renderizzato lato server come prop `children` da un parent Server Component, che è il pattern di composizione raccomandato.",
          },
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
    ];

    for (const question of questions) {
      await queryRunner.query(
        `
        UPDATE qcm_question
        SET data = $1
        WHERE id = $2 AND module_id = $3
      `,
        [question.data, question.id, 'cef9ccb0-c77f-4eea-97cc-89eea4fa1f05'],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const questions = [
      {
        id: '4adef527-7e20-4742-98b9-86e63e2776a5',
        data: {
          question: 'What does React.memo() do?',
          choices: [
            'Memoizes the return value of an expensive function calculation',
            'Wraps a component and skips re-rendering if props haven\'t changed (shallow comparison)',
            'Wraps a callback function to maintain a stable reference across renders',
            'Caches the component\'s DOM output in the browser\'s memory',
          ],
          answer: '1',
          tags: ['memo'],
          explanation:
            'React.memo() is a higher-order component that shallowly compares props before re-rendering. If the parent re-renders but passes the same props, the memoized child is skipped. It only helps when the parent re-renders frequently and the child\'s props rarely change.',
          docs: 'https://react.dev/reference/react/memo',
        },
      },
      {
        id: 'e0040823-032c-4ab5-8343-93d4c5f18af6',
        data: {
          question: 'When does React.memo() fail to prevent a re-render?',
          choices: [
            'When the component has internal state',
            'When the component uses useContext',
            'When more than 5 props are passed',
            'When a prop is a new object or function reference created during the parent\'s render',
          ],
          answer: '3',
          tags: ['memo'],
          explanation:
            'React.memo uses shallow comparison. If a parent creates a new object `{}` or function `() => {}` on every render (even with identical values), those are new references and memo will not skip the re-render. Pair React.memo with useMemo (for objects) and useCallback (for functions) to stabilize references.',
          docs: 'https://react.dev/reference/react/memo',
        },
      },
      {
        id: '880bfdb7-6844-43b3-8346-982401851def',
        data: {
          question: 'What is the difference between useMemo and useCallback?',
          choices: [
            'useMemo is for asynchronous values; useCallback is for synchronous ones',
            'useCallback returns a value; useMemo returns a function',
            'useMemo memoizes the result of a computation; useCallback memoizes the function itself',
            'They are identical — useCallback is an alias for useMemo',
          ],
          answer: '2',
          tags: ['useMemo', 'useCallback'],
          explanation:
            'useMemo(() => compute(a, b), [a, b]) calls the function and returns its result. useCallback(() => doSomething(a), [a]) returns the function itself (not its result). useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). Both help maintain referential stability.',
          docs: 'https://react.dev/reference/react/useMemo',
        },
      },
      {
        id: '08e67f23-515e-49bb-8736-f4c149ef5da2',
        data: {
          question: 'When is useMemo actually beneficial?',
          choices: [
            'When the computation is genuinely expensive (e.g., filtering 10,000 items) and the dependencies rarely change',
            'For every value derived from props to prevent any re-computation',
            'When you want to persist a value across page navigations',
            'When a value is used inside a useEffect',
          ],
          answer: '0',
          tags: ['useMemo'],
          explanation:
            'useMemo has a cost — the dependency comparison runs on every render. For cheap computations, useMemo can be slower than just recomputing. Only apply it to provably expensive operations. Profile first; avoid premature memoization. The React compiler automates this in React 19.',
          docs: 'https://react.dev/reference/react/useMemo',
        },
      },
      {
        id: '57227fe9-081a-40c2-bb66-d18b15b4825c',
        data: {
          question:
            'What does this code do?\n\nconst Chart = React.lazy(() => import(\'./Chart\'));\n\nfunction Dashboard() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <Chart />\n    </Suspense>\n  );\n}',
          choices: [
            'Renders Chart immediately but shows Spinner if Chart throws an error',
            'Preloads Chart in the background when Dashboard first mounts',
            'Makes Chart optional — it only renders if the import succeeds',
            'Lazily loads the Chart module via dynamic import; shows <Spinner /> while the bundle is loading',
          ],
          answer: '3',
          tags: ['suspense', 'lazy'],
          explanation:
            'React.lazy() + Suspense implements code splitting. The Chart component\'s JavaScript bundle is not loaded until Dashboard is rendered. While the bundle is fetching, Suspense shows the fallback. Once loaded, Chart renders. This reduces initial bundle size.',
          docs: 'https://react.dev/reference/react/Suspense',
        },
      },
      {
        id: '2e4580f0-60aa-47f4-a73f-b32dbf2066ba',
        data: {
          question: 'What do React error boundaries catch?',
          choices: [
            'All JavaScript errors anywhere in the application',
            'JavaScript errors thrown during rendering, in lifecycle methods, and in constructors of child components',
            'Only errors thrown inside event handlers',
            'Network errors from fetch calls inside useEffect',
          ],
          answer: '1',
          tags: ['error-boundary'],
          explanation:
            'Error boundaries catch errors during rendering, lifecycle methods, and constructors. They do NOT catch errors in event handlers (use try/catch there), async code, server-side rendering, or errors in the error boundary itself. They must be class components implementing componentDidCatch or getDerivedStateFromError.',
          docs: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary',
        },
      },
      {
        id: '2208f22f-99f2-4d8f-a11b-09c825f8eb91',
        data: {
          question: 'Which statement correctly describes React Server Components?',
          choices: [
            'They run only on the server, can access backend resources directly, and send rendered HTML + serialized props to the client',
            'They are components that fetch data using useEffect on the server',
            'They replace client components and always require a \'use server\' directive',
            'They are components that run in a service worker',
          ],
          answer: '0',
          tags: ['react-19', 'server-components'],
          explanation:
            'React Server Components execute on the server (at request time or build time), can directly access databases and file systems, never ship their JavaScript to the browser, and produce a special React tree that clients hydrate. They reduce client bundle size significantly.',
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: 'ad3d27ab-ac43-4dc1-a509-60c66393c5e8',
        data: {
          question: 'Which of these cannot be done inside a React Server Component?',
          choices: [
            'Reading from a database',
            'Rendering other Server Components',
            'Using useState, useEffect, or browser APIs like window/document',
            'Passing serializable props to Client Components',
          ],
          answer: '2',
          tags: ['react-19', 'server-components', 'use-client'],
          explanation:
            'Server Components run on the server — there is no browser, no event loop, no DOM. Therefore useState, useEffect, event handlers, and browser APIs are unavailable. Database reads, file I/O, and async data fetching are perfectly valid. Use \'use client\' to mark components that need browser APIs.',
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: 'dea630ee-df6e-4c84-81f0-14f812dde6a1',
        data: {
          question: 'What does the \'use client\' directive do in a Next.js / React 19 project?',
          choices: [
            'Enables client-side routing for the component',
            'Prevents the component from being rendered on the server',
            'Marks a component as a Client Component — it will be shipped to and executed in the browser',
            'Enables TypeScript type checking for browser APIs',
          ],
          answer: '2',
          tags: ['use-client'],
          explanation:
            '\'use client\' is a bundler directive placed at the top of a file. It creates a boundary: the file and all components imported by it are Client Components. They are included in the JavaScript bundle sent to the browser and can use hooks, event handlers, and browser APIs.',
          docs: 'https://react.dev/reference/rsc/use-client',
        },
      },
      {
        id: '103343ba-b0b3-4844-9d33-304a7cda0e30',
        data: {
          question: 'What is a hydration error and what causes it?',
          choices: [
            'An error thrown when a Server Component fetches data from an unavailable API',
            'A memory leak caused by improper cleanup in useEffect',
            'An error when importing a Server Component into a Client Component',
            'A mismatch between the HTML rendered on the server and what React renders on the client during hydration',
          ],
          answer: '3',
          tags: ['react-19', 'server-components'],
          explanation:
            'Hydration is the process where React attaches event listeners to server-rendered HTML. If the client renders different JSX (due to Date.now(), Math.random(), or browser-only APIs), React throws a hydration mismatch error. Fix by using suppressHydrationWarning or ensuring consistent rendering between server and client.',
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: '1dcdc493-27a9-464d-8af0-f1b3ca39e4dd',
        data: {
          question: 'How does `use(promise)` interact with Suspense in React 19?',
          choices: [
            'While the promise is pending, the component suspends and the nearest Suspense boundary shows its fallback',
            'use(promise) blocks the main thread until the promise resolves',
            'use(promise) requires an ErrorBoundary — otherwise it crashes the app',
            'use(promise) only works inside Server Components',
          ],
          answer: '0',
          tags: ['react-19', 'use-hook', 'suspense'],
          explanation:
            'use(promise) integrates with Suspense: when the promise is pending, React suspends the component (throws a special signal), and the nearest <Suspense fallback> is shown. When the promise resolves, React re-renders the component with the resolved value. ErrorBoundary handles rejections.',
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: '0b561802-6bed-46f3-a40d-861913dbf54b',
        data: {
          question:
            'Which combinations make React.memo() effective? (Select all that apply)',
          choices: [
            'React.memo on the child alone when props include inline arrow functions',
            'React.memo on the child + useCallback on handler functions passed as props',
            'React.memo on the child + useMemo on object props created in the parent',
            'React.memo on the child when all props are primitive values (strings, numbers, booleans)',
          ],
          answer: '[1,2,3]',
          tags: ['memo', 'useMemo', 'useCallback'],
          explanation:
            'React.memo works with shallow comparison. Primitives compare by value, so they\'re safe (option D). Functions and objects are compared by reference — inline definitions create new references every render, defeating memo (option C is wrong). useCallback stabilizes functions (A), useMemo stabilizes objects (B).',
          docs: 'https://react.dev/reference/react/memo',
        },
      },
      {
        id: '394e5907-4009-4a63-8007-8f6bab953ddc',
        data: {
          question:
            'Where must a <Suspense> boundary be placed relative to a component using React.lazy() or use()?',
          choices: [
            'As the direct parent of the lazy/suspending component only',
            'Anywhere above the suspending component in the tree — it catches suspension from any descendant',
            'At the root of the application only',
            'Inside the lazy component itself',
          ],
          answer: '1',
          tags: ['suspense'],
          explanation:
            'Suspense boundaries work like error boundaries — they catch suspension from any descendant, not just direct children. You can nest multiple Suspense boundaries for granular loading states. The nearest ancestor Suspense boundary catches the suspension and shows its fallback.',
          docs: 'https://react.dev/reference/react/Suspense',
        },
      },
      {
        id: 'da6f7828-d05e-4777-b27b-d82cfb921c6e',
        data: {
          question: 'Can a Server Component be imported by a Client Component?',
          choices: [
            'Yes — freely import Server Components into Client Components',
            'No — but a Server Component can be passed to a Client Component as a prop (children or JSX slot)',
            'Yes — but only if the Server Component has no async operations',
            'No — Server and Client Components cannot interact at all',
          ],
          answer: '1',
          tags: ['react-19', 'server-components'],
          explanation:
            'Once you cross into \'use client\' territory, everything imported must be client-compatible. You cannot import a Server Component inside a Client Component. However, you CAN pass a server-rendered component as the `children` prop from a Server Component parent, which is the recommended composition pattern.',
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
    ];

    for (const question of questions) {
      await queryRunner.query(
        `
        UPDATE qcm_question
        SET data = $1
        WHERE id = $2 AND module_id = $3
      `,
        [question.data, question.id, 'cef9ccb0-c77f-4eea-97cc-89eea4fa1f05'],
      );
    }
  }
}
