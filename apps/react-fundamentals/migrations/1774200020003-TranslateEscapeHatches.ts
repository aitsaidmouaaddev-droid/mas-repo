import type { MigrationInterface, QueryRunner } from 'typeorm';

export class TranslateEscapeHatches1774200020003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const questions = [
      {
        id: 'b5560544-821e-471f-a0ea-0bac9796c6fb',
        data: {
          question: {
            en: 'What is the key difference between useRef and useState?',
            fr: 'Quelle est la différence clé entre useRef et useState ?',
            de: 'Was ist der Hauptunterschied zwischen useRef und useState?',
            es: '¿Cuál es la diferencia clave entre useRef y useState?',
            it: 'Qual è la differenza chiave tra useRef e useState?',
          },
          choices: {
            en: [
              'Changing a ref\'s .current value does not trigger a re-render; changing state does',
              'Refs are for strings only; state can hold any type',
              'State persists across renders; refs reset to their initial value on every render',
              'useRef can only be used inside class components',
            ],
            fr: [
              'Modifier la valeur .current d\'une ref ne déclenche pas de re-render ; modifier le state le fait',
              'Les refs sont uniquement pour les chaînes ; le state peut contenir n\'importe quel type',
              'Le state persiste entre les renders ; les refs se réinitialisent à leur valeur initiale à chaque render',
              'useRef ne peut être utilisé que dans les class components',
            ],
            de: [
              'Das Ändern des .current-Werts einer ref löst kein Re-Rendering aus; das Ändern von state schon',
              'Refs sind nur für Strings; state kann jeden Typ enthalten',
              'State bleibt über Renders hinweg bestehen; refs werden bei jedem Render auf ihren Anfangswert zurückgesetzt',
              'useRef kann nur in class components verwendet werden',
            ],
            es: [
              'Cambiar el valor .current de una ref no provoca un re-render; cambiar el state sí',
              'Las refs son solo para strings; el state puede contener cualquier tipo',
              'El state persiste entre renders; las refs se reinician a su valor inicial en cada render',
              'useRef solo puede usarse dentro de class components',
            ],
            it: [
              'Modificare il valore .current di una ref non causa un re-render; modificare lo state sì',
              'Le ref sono solo per stringhe; lo state può contenere qualsiasi tipo',
              'Lo state persiste tra i render; le ref si reimpostano al loro valore iniziale ad ogni render',
              'useRef può essere usato solo all\'interno di class components',
            ],
          },
          answer: '0',
          tags: ['useRef'],
          explanation: {
            en: 'A ref is a mutable container whose `.current` property can be changed without causing a re-render. State, on the other hand, triggers a re-render when updated. Refs are ideal for storing values you need to remember across renders but don\'t need to display (e.g., timer IDs, previous values).',
            fr: 'Une ref est un conteneur mutable dont la propriété `.current` peut être modifiée sans déclencher de re-render. Le state, en revanche, déclenche un re-render lorsqu\'il est mis à jour. Les refs sont idéales pour stocker des valeurs que vous devez mémoriser entre les renders mais que vous n\'avez pas besoin d\'afficher (ex : IDs de timers, valeurs précédentes).',
            de: 'Eine ref ist ein veränderbarer Container, dessen `.current`-Eigenschaft geändert werden kann, ohne ein Re-Rendering auszulösen. State hingegen löst beim Update ein Re-Rendering aus. Refs sind ideal zum Speichern von Werten, die Sie sich über Renders hinweg merken müssen, aber nicht anzeigen müssen (z. B. Timer-IDs, vorherige Werte).',
            es: 'Una ref es un contenedor mutable cuya propiedad `.current` puede cambiarse sin provocar un re-render. El state, por otro lado, desencadena un re-render cuando se actualiza. Las refs son ideales para almacenar valores que necesitas recordar entre renders pero que no necesitas mostrar (ej: IDs de timers, valores anteriores).',
            it: 'Una ref è un contenitore mutabile la cui proprietà `.current` può essere modificata senza causare un re-render. Lo state, invece, attiva un re-render quando viene aggiornato. Le ref sono ideali per memorizzare valori che devi ricordare tra i render ma che non devi visualizzare (es: ID di timer, valori precedenti).',
          },
          docs: 'https://react.dev/reference/react/useRef',
        },
      },
      {
        id: '7aef3c7f-938e-4ef8-a2c5-6468b87056ab',
        data: {
          question: {
            en: 'How do you get a reference to a DOM element in React?',
            fr: 'Comment obtenir une référence à un élément DOM dans React ?',
            de: 'Wie erhält man eine Referenz zu einem DOM-Element in React?',
            es: '¿Cómo obtienes una referencia a un elemento DOM en React?',
            it: 'Come ottieni un riferimento a un elemento DOM in React?',
          },
          choices: {
            en: [
              'Option B: <input ref="inputRef" />',
              'Option C: <input domRef={inputRef} />',
              'All three are equivalent',
              'Option A: <input ref={inputRef} />',
            ],
            fr: [
              'Option B: <input ref="inputRef" />',
              'Option C: <input domRef={inputRef} />',
              'Les trois sont équivalentes',
              'Option A: <input ref={inputRef} />',
            ],
            de: [
              'Option B: <input ref="inputRef" />',
              'Option C: <input domRef={inputRef} />',
              'Alle drei sind gleichwertig',
              'Option A: <input ref={inputRef} />',
            ],
            es: [
              'Opción B: <input ref="inputRef" />',
              'Opción C: <input domRef={inputRef} />',
              'Las tres son equivalentes',
              'Opción A: <input ref={inputRef} />',
            ],
            it: [
              'Opzione B: <input ref="inputRef" />',
              'Opzione C: <input domRef={inputRef} />',
              'Tutte e tre sono equivalenti',
              'Opzione A: <input ref={inputRef} />',
            ],
          },
          answer: '3',
          tags: ['dom-refs'],
          explanation: {
            en: 'You attach a ref to a DOM element with the `ref` prop, passing the ref object (not a string). After mounting, `inputRef.current` points to the DOM node. String refs (option B) were deprecated and removed. After mounting, you can call methods like `inputRef.current.focus()`.',
            fr: 'Vous attachez une ref à un élément DOM avec la prop `ref`, en passant l\'objet ref (pas une chaîne). Après le montage, `inputRef.current` pointe vers le nœud DOM. Les refs sous forme de chaîne (option B) ont été dépréciées et supprimées. Après le montage, vous pouvez appeler des méthodes comme `inputRef.current.focus()`.',
            de: 'Sie fügen eine ref an ein DOM-Element mit der `ref`-Prop an und übergeben das ref-Objekt (keinen String). Nach dem Mounting zeigt `inputRef.current` auf den DOM-Knoten. String-refs (Option B) wurden veraltet und entfernt. Nach dem Mounting können Sie Methoden wie `inputRef.current.focus()` aufrufen.',
            es: 'Adjuntas una ref a un elemento DOM con la prop `ref`, pasando el objeto ref (no un string). Después del montaje, `inputRef.current` apunta al nodo DOM. Las refs en forma de string (opción B) fueron deprecadas y eliminadas. Después del montaje, puedes llamar métodos como `inputRef.current.focus()`.',
            it: 'Alleghi una ref a un elemento DOM con la prop `ref`, passando l\'oggetto ref (non una stringa). Dopo il mounting, `inputRef.current` punta al nodo DOM. Le ref come stringhe (opzione B) sono state deprecate e rimosse. Dopo il mounting, puoi chiamare metodi come `inputRef.current.focus()`.',
          },
          docs: 'https://react.dev/learn/manipulating-the-dom-with-refs',
        },
      },
      {
        id: '331ec99f-046f-458d-b357-946e7fad925f',
        data: {
          question: {
            en: 'When is it safe to access a DOM ref\'s `.current` value?',
            fr: 'Quand est-il sûr d\'accéder à la valeur `.current` d\'une ref DOM ?',
            de: 'Wann ist es sicher, auf den `.current`-Wert einer DOM-ref zuzugreifen?',
            es: '¿Cuándo es seguro acceder al valor `.current` de una ref DOM?',
            it: 'Quando è sicuro accedere al valore `.current` di una ref DOM?',
          },
          choices: {
            en: [
              'During the render function, before JSX is returned',
              'After the component has mounted — refs are null during the initial render',
              'Inside the useState initializer function',
              'Anytime — refs are always populated',
            ],
            fr: [
              'Pendant la fonction de render, avant que le JSX ne soit retourné',
              'Après que le component a été monté — les refs sont null pendant le render initial',
              'Dans la fonction d\'initialisation de useState',
              'N\'importe quand — les refs sont toujours remplies',
            ],
            de: [
              'Während der Render-Funktion, bevor JSX zurückgegeben wird',
              'Nach dem Mounting des Components — refs sind während des initialen Renderings null',
              'Innerhalb der useState-Initialisierungsfunktion',
              'Jederzeit — refs sind immer gefüllt',
            ],
            es: [
              'Durante la función de render, antes de que se retorne el JSX',
              'Después de que el component se haya montado — las refs son null durante el render inicial',
              'Dentro de la función inicializadora de useState',
              'En cualquier momento — las refs siempre están pobladas',
            ],
            it: [
              'Durante la funzione di render, prima che venga restituito il JSX',
              'Dopo che il component è stato montato — le ref sono null durante il render iniziale',
              'All\'interno della funzione di inizializzazione di useState',
              'In qualsiasi momento — le ref sono sempre popolate',
            ],
          },
          answer: '1',
          tags: ['dom-refs'],
          explanation: {
            en: 'During the initial render, the DOM element hasn\'t been created yet, so `ref.current` is null. React sets `ref.current` after the DOM is committed (post-mount). Access refs in event handlers, useEffect, or useLayoutEffect — never during rendering.',
            fr: 'Pendant le render initial, l\'élément DOM n\'a pas encore été créé, donc `ref.current` est null. React définit `ref.current` après que le DOM soit commité (post-montage). Accédez aux refs dans les gestionnaires d\'événements, useEffect ou useLayoutEffect — jamais pendant le rendering.',
            de: 'Während des initialen Renderings wurde das DOM-Element noch nicht erstellt, daher ist `ref.current` null. React setzt `ref.current` nach dem Commit des DOM (nach dem Mounting). Greifen Sie auf refs in Event-Handlern, useEffect oder useLayoutEffect zu — niemals während des Renderings.',
            es: 'Durante el render inicial, el elemento DOM aún no se ha creado, por lo que `ref.current` es null. React establece `ref.current` después de que el DOM se compromete (post-montaje). Accede a las refs en manejadores de eventos, useEffect o useLayoutEffect — nunca durante el rendering.',
            it: 'Durante il render iniziale, l\'elemento DOM non è ancora stato creato, quindi `ref.current` è null. React imposta `ref.current` dopo che il DOM viene committato (post-mounting). Accedi alle ref negli event handler, useEffect o useLayoutEffect — mai durante il rendering.',
          },
          docs: 'https://react.dev/learn/manipulating-the-dom-with-refs',
        },
      },
      {
        id: '10ddad13-81e5-4230-8d7b-79aeda238143',
        data: {
          question: {
            en: 'What is the purpose of useEffect?',
            fr: 'Quel est l\'objectif de useEffect ?',
            de: 'Was ist der Zweck von useEffect?',
            es: '¿Cuál es el propósito de useEffect?',
            it: 'Qual è lo scopo di useEffect?',
          },
          choices: {
            en: [
              'To synchronize a component with an external system (APIs, subscriptions, timers) after rendering',
              'To replace useState for managing side effects',
              'To memoize expensive calculations between renders',
              'To run code before the component renders for the first time',
            ],
            fr: [
              'Synchroniser un component avec un système externe (APIs, subscriptions, timers) après le rendering',
              'Remplacer useState pour gérer les effets secondaires',
              'Mémoriser des calculs coûteux entre les renders',
              'Exécuter du code avant que le component ne se rende pour la première fois',
            ],
            de: [
              'Um ein Component mit einem externen System (APIs, Subscriptions, Timer) nach dem Rendering zu synchronisieren',
              'Um useState für die Verwaltung von Seiteneffekten zu ersetzen',
              'Um teure Berechnungen zwischen Renderings zu memoizen',
              'Um Code auszuführen, bevor das Component zum ersten Mal gerendert wird',
            ],
            es: [
              'Sincronizar un component con un sistema externo (APIs, subscripciones, timers) después del rendering',
              'Reemplazar useState para gestionar efectos secundarios',
              'Memoizar cálculos costosos entre renders',
              'Ejecutar código antes de que el component se renderice por primera vez',
            ],
            it: [
              'Sincronizzare un component con un sistema esterno (API, sottoscrizioni, timer) dopo il rendering',
              'Sostituire useState per gestire gli effetti collaterali',
              'Memoizzare calcoli costosi tra i render',
              'Eseguire codice prima che il component venga renderizzato per la prima volta',
            ],
          },
          answer: '0',
          tags: ['useEffect'],
          explanation: {
            en: 'useEffect lets you perform side effects — operations that reach outside of React\'s rendering system — after the component has been painted to the screen. This includes data fetching, subscriptions, timers, and manual DOM manipulation. It runs after every render by default.',
            fr: 'useEffect vous permet d\'effectuer des effets secondaires — des opérations qui sortent du système de rendering de React — après que le component a été affiché à l\'écran. Cela inclut la récupération de données, les subscriptions, les timers et la manipulation manuelle du DOM. Il s\'exécute après chaque render par défaut.',
            de: 'useEffect ermöglicht es Ihnen, Seiteneffekte durchzuführen — Operationen, die außerhalb von Reacts Rendering-System liegen — nachdem das Component auf den Bildschirm gezeichnet wurde. Dazu gehören Datenabruf, Subscriptions, Timer und manuelle DOM-Manipulation. Es wird standardmäßig nach jedem Rendering ausgeführt.',
            es: 'useEffect te permite realizar efectos secundarios — operaciones que van más allá del sistema de rendering de React — después de que el component se ha pintado en la pantalla. Esto incluye la obtención de datos, subscripciones, timers y manipulación manual del DOM. Se ejecuta después de cada render por defecto.',
            it: 'useEffect ti permette di eseguire effetti collaterali — operazioni che vanno oltre il sistema di rendering di React — dopo che il component è stato dipinto sullo schermo. Ciò include il recupero dei dati, le sottoscrizioni, i timer e la manipolazione manuale del DOM. Viene eseguito dopo ogni render per impostazione predefinita.',
          },
          docs: 'https://react.dev/reference/react/useEffect',
        },
      },
      {
        id: 'bf52783e-9b9c-4085-ba5a-f7b9e39be134',
        data: {
          question: {
            en: 'What does the dependency array in useEffect control?',
            fr: 'Que contrôle le tableau de dépendances dans useEffect ?',
            de: 'Was kontrolliert das Dependency-Array in useEffect?',
            es: '¿Qué controla el array de dependencias en useEffect?',
            it: 'Cosa controlla l\'array di dipendenze in useEffect?',
          },
          choices: {
            en: [
              'The values listed are passed as arguments to the effect function',
              'The effect is skipped if any dependency is falsy',
              'The effect runs only when one of the listed dependencies changes between renders',
              'React validates that all listed dependencies are valid state variables',
            ],
            fr: [
              'Les valeurs listées sont passées comme arguments à la fonction d\'effet',
              'L\'effet est ignoré si une dépendance est falsy',
              'L\'effet s\'exécute uniquement lorsque l\'une des dépendances listées change entre les renders',
              'React valide que toutes les dépendances listées sont des variables de state valides',
            ],
            de: [
              'Die aufgelisteten Werte werden als Argumente an die Effect-Funktion übergeben',
              'Der Effect wird übersprungen, wenn eine Dependency falsy ist',
              'Der Effect wird nur ausgeführt, wenn sich eine der aufgelisteten Dependencies zwischen Renderings ändert',
              'React validiert, dass alle aufgelisteten Dependencies gültige State-Variablen sind',
            ],
            es: [
              'Los valores listados se pasan como argumentos a la función de efecto',
              'El efecto se omite si alguna dependencia es falsy',
              'El efecto se ejecuta solo cuando una de las dependencias listadas cambia entre renders',
              'React valida que todas las dependencias listadas son variables de state válidas',
            ],
            it: [
              'I valori elencati vengono passati come argomenti alla funzione di effetto',
              'L\'effetto viene saltato se una dipendenza è falsy',
              'L\'effetto viene eseguito solo quando una delle dipendenze elencate cambia tra i render',
              'React valida che tutte le dipendenze elencate sono variabili di state valide',
            ],
          },
          answer: '2',
          tags: ['useEffect'],
          explanation: {
            en: 'React compares each dependency with its previous value using Object.is(). If any changed, the effect re-runs. An empty array `[]` means run only on mount. Omitting the array means run after every render. The array should include every reactive value the effect uses.',
            fr: 'React compare chaque dépendance avec sa valeur précédente en utilisant Object.is(). Si l\'une a changé, l\'effet se réexécute. Un tableau vide `[]` signifie exécuter uniquement au montage. Omettre le tableau signifie exécuter après chaque render. Le tableau doit inclure toutes les valeurs réactives utilisées par l\'effet.',
            de: 'React vergleicht jede Dependency mit ihrem vorherigen Wert mit Object.is(). Wenn sich etwas geändert hat, wird der Effect erneut ausgeführt. Ein leeres Array `[]` bedeutet nur beim Mounting ausführen. Das Weglassen des Arrays bedeutet nach jedem Rendering ausführen. Das Array sollte jeden reaktiven Wert enthalten, den der Effect verwendet.',
            es: 'React compara cada dependencia con su valor anterior usando Object.is(). Si alguna cambió, el efecto se vuelve a ejecutar. Un array vacío `[]` significa ejecutar solo en el montaje. Omitir el array significa ejecutar después de cada render. El array debe incluir cada valor reactivo que use el efecto.',
            it: 'React confronta ogni dipendenza con il suo valore precedente usando Object.is(). Se qualcuna è cambiata, l\'effetto viene rieseguito. Un array vuoto `[]` significa eseguire solo al mounting. Omettere l\'array significa eseguire dopo ogni render. L\'array dovrebbe includere ogni valore reattivo che l\'effetto usa.',
          },
          docs: 'https://react.dev/reference/react/useEffect',
        },
      },
      {
        id: 'a679034b-a5f9-415e-8d0d-0cf9310618cb',
        data: {
          question: {
            en: 'What is the cleanup function in useEffect and when should you use it?',
            fr: 'Qu\'est-ce que la fonction de nettoyage dans useEffect et quand devriez-vous l\'utiliser ?',
            de: 'Was ist die Cleanup-Funktion in useEffect und wann sollte man sie verwenden?',
            es: '¿Qué es la función de limpieza en useEffect y cuándo debes usarla?',
            it: 'Cos\'è la funzione di pulizia in useEffect e quando dovresti usarla?',
          },
          choices: {
            en: [
              'A function called before the effect runs for the first time',
              'A catch block for errors thrown inside the effect',
              'A function returned from the effect that React calls before re-running the effect or on unmount',
              'A function that cancels the dependency comparison',
            ],
            fr: [
              'Une fonction appelée avant que l\'effet ne s\'exécute pour la première fois',
              'Un bloc catch pour les erreurs levées à l\'intérieur de l\'effet',
              'Une fonction retournée par l\'effet que React appelle avant de réexécuter l\'effet ou au démontage',
              'Une fonction qui annule la comparaison des dépendances',
            ],
            de: [
              'Eine Funktion, die aufgerufen wird, bevor der Effect zum ersten Mal ausgeführt wird',
              'Ein Catch-Block für Fehler, die im Effect geworfen werden',
              'Eine Funktion, die vom Effect zurückgegeben wird und die React vor dem erneuten Ausführen des Effects oder beim Unmounting aufruft',
              'Eine Funktion, die den Dependency-Vergleich abbricht',
            ],
            es: [
              'Una función llamada antes de que el efecto se ejecute por primera vez',
              'Un bloque catch para errores lanzados dentro del efecto',
              'Una función retornada por el efecto que React llama antes de volver a ejecutar el efecto o al desmontar',
              'Una función que cancela la comparación de dependencias',
            ],
            it: [
              'Una funzione chiamata prima che l\'effetto venga eseguito per la prima volta',
              'Un blocco catch per gli errori lanciati all\'interno dell\'effetto',
              'Una funzione restituita dall\'effetto che React chiama prima di rieseguire l\'effetto o al unmounting',
              'Una funzione che annulla il confronto delle dipendenze',
            ],
          },
          answer: '2',
          tags: ['useEffect'],
          explanation: {
            en: 'Returning a function from useEffect registers a cleanup. React calls it when the component unmounts OR before re-running the effect due to a dependency change. Use it to cancel subscriptions, clear timers, or abort fetch requests to prevent memory leaks and stale callbacks.',
            fr: 'Retourner une fonction depuis useEffect enregistre un nettoyage. React l\'appelle lorsque le component se démonte OU avant de réexécuter l\'effet en raison d\'un changement de dépendance. Utilisez-la pour annuler les subscriptions, effacer les timers ou interrompre les requêtes fetch pour éviter les fuites mémoire et les callbacks obsolètes.',
            de: 'Das Zurückgeben einer Funktion von useEffect registriert ein Cleanup. React ruft sie auf, wenn das Component unmountet ODER bevor der Effect aufgrund einer Dependency-Änderung erneut ausgeführt wird. Verwenden Sie sie, um Subscriptions zu kündigen, Timer zu löschen oder Fetch-Anfragen abzubrechen, um Speicherlecks und veraltete Callbacks zu verhindern.',
            es: 'Devolver una función desde useEffect registra una limpieza. React la llama cuando el component se desmonta O antes de volver a ejecutar el efecto debido a un cambio de dependencia. Úsala para cancelar subscripciones, limpiar timers o abortar solicitudes fetch para prevenir fugas de memoria y callbacks obsoletos.',
            it: 'Restituire una funzione da useEffect registra una pulizia. React la chiama quando il component viene smontato O prima di rieseguire l\'effetto a causa di un cambiamento di dipendenza. Usala per annullare le sottoscrizioni, cancellare i timer o interrompere le richieste fetch per prevenire perdite di memoria e callback obsoleti.',
          },
          docs: 'https://react.dev/reference/react/useEffect',
        },
      },
      {
        id: 'ee0cc7b2-7384-43b9-a2fd-c79df76e26bf',
        data: {
          question: {
            en: 'How many times does the effect run?\n\nfunction App() {\n  const [x, setX] = useState(0);\n  useEffect(() => {\n    console.log(\'effect\');\n  }, []);\n  return <button onClick={() => setX(x+1)}>{x}</button>;\n}',
            fr: 'Combien de fois l\'effet s\'exécute-t-il ?\n\nfunction App() {\n  const [x, setX] = useState(0);\n  useEffect(() => {\n    console.log(\'effect\');\n  }, []);\n  return <button onClick={() => setX(x+1)}>{x}</button>;\n}',
            de: 'Wie oft wird der Effect ausgeführt?\n\nfunction App() {\n  const [x, setX] = useState(0);\n  useEffect(() => {\n    console.log(\'effect\');\n  }, []);\n  return <button onClick={() => setX(x+1)}>{x}</button>;\n}',
            es: '¿Cuántas veces se ejecuta el efecto?\n\nfunction App() {\n  const [x, setX] = useState(0);\n  useEffect(() => {\n    console.log(\'effect\');\n  }, []);\n  return <button onClick={() => setX(x+1)}>{x}</button>;\n}',
            it: 'Quante volte viene eseguito l\'effetto?\n\nfunction App() {\n  const [x, setX] = useState(0);\n  useEffect(() => {\n    console.log(\'effect\');\n  }, []);\n  return <button onClick={() => setX(x+1)}>{x}</button>;\n}',
          },
          choices: {
            en: [
              'On every button click',
              'Twice — once on mount, once on unmount',
              'Every render',
              'Once — only on mount, regardless of how many times the button is clicked',
            ],
            fr: [
              'À chaque clic sur le bouton',
              'Deux fois — une fois au montage, une fois au démontage',
              'À chaque render',
              'Une fois — uniquement au montage, peu importe combien de fois le bouton est cliqué',
            ],
            de: [
              'Bei jedem Button-Klick',
              'Zweimal — einmal beim Mounting, einmal beim Unmounting',
              'Bei jedem Rendering',
              'Einmal — nur beim Mounting, unabhängig davon, wie oft der Button geklickt wird',
            ],
            es: [
              'En cada clic del botón',
              'Dos veces — una vez en el montaje, una vez al desmontar',
              'En cada render',
              'Una vez — solo en el montaje, sin importar cuántas veces se haga clic en el botón',
            ],
            it: [
              'Ad ogni clic del pulsante',
              'Due volte — una volta al mounting, una volta all\'unmounting',
              'Ad ogni render',
              'Una volta — solo al mounting, indipendentemente da quante volte viene cliccato il pulsante',
            ],
          },
          answer: '3',
          tags: ['useEffect', 'effects'],
          explanation: {
            en: 'An empty dependency array `[]` means the effect runs only once after the initial render (mount). Clicking the button updates state and re-renders the component, but the effect does NOT re-run because its dependencies haven\'t changed. In React Strict Mode, effects run twice on mount in development.',
            fr: 'Un tableau de dépendances vide `[]` signifie que l\'effet s\'exécute une seule fois après le render initial (montage). Cliquer sur le bouton met à jour le state et re-rend le component, mais l\'effet ne se réexécute PAS car ses dépendances n\'ont pas changé. En React Strict Mode, les effets s\'exécutent deux fois au montage en développement.',
            de: 'Ein leeres Dependency-Array `[]` bedeutet, dass der Effect nur einmal nach dem initialen Rendering (Mounting) ausgeführt wird. Das Klicken auf den Button aktualisiert den State und rendert das Component neu, aber der Effect wird NICHT erneut ausgeführt, weil sich seine Dependencies nicht geändert haben. Im React Strict Mode werden Effects beim Mounting in der Entwicklung zweimal ausgeführt.',
            es: 'Un array de dependencias vacío `[]` significa que el efecto se ejecuta solo una vez después del render inicial (montaje). Hacer clic en el botón actualiza el state y vuelve a renderizar el component, pero el efecto NO se vuelve a ejecutar porque sus dependencias no han cambiado. En React Strict Mode, los efectos se ejecutan dos veces en el montaje durante el desarrollo.',
            it: 'Un array di dipendenze vuoto `[]` significa che l\'effetto viene eseguito solo una volta dopo il render iniziale (mounting). Cliccare sul pulsante aggiorna lo state e ri-renderizza il component, ma l\'effetto NON viene rieseguito perché le sue dipendenze non sono cambiate. In React Strict Mode, gli effetti vengono eseguiti due volte al mounting durante lo sviluppo.',
          },
          docs: 'https://react.dev/reference/react/useEffect',
        },
      },
      {
        id: 'afaf6ff5-ea3a-4390-85e0-2cec06f2ad40',
        data: {
          question: {
            en: 'What is wrong with this effect — it causes an infinite loop:\n\nuseEffect(() => {\n  setCount(count + 1);\n}, [count]);',
            fr: 'Quel est le problème avec cet effet — il provoque une boucle infinie :\n\nuseEffect(() => {\n  setCount(count + 1);\n}, [count]);',
            de: 'Was ist falsch mit diesem Effect — er verursacht eine Endlosschleife:\n\nuseEffect(() => {\n  setCount(count + 1);\n}, [count]);',
            es: '¿Qué está mal con este efecto — causa un bucle infinito:\n\nuseEffect(() => {\n  setCount(count + 1);\n}, [count]);',
            it: 'Cosa c\'è di sbagliato in questo effetto — causa un loop infinito:\n\nuseEffect(() => {\n  setCount(count + 1);\n}, [count]);',
          },
          choices: {
            en: [
              'Setting state inside an effect with that state as a dependency creates an infinite loop: effect → state change → re-render → effect again',
              'setCount cannot be called inside useEffect',
              'The dependency array should be empty to fix it',
              'count must be declared outside the component to avoid this',
            ],
            fr: [
              'Définir le state dans un effet avec ce state comme dépendance crée une boucle infinie : effet → changement de state → re-render → effet à nouveau',
              'setCount ne peut pas être appelé dans useEffect',
              'Le tableau de dépendances devrait être vide pour le corriger',
              'count doit être déclaré en dehors du component pour éviter cela',
            ],
            de: [
              'Das Setzen von State in einem Effect mit diesem State als Dependency erzeugt eine Endlosschleife: Effect → State-Änderung → Re-Rendering → Effect wieder',
              'setCount kann nicht innerhalb von useEffect aufgerufen werden',
              'Das Dependency-Array sollte leer sein, um es zu beheben',
              'count muss außerhalb des Components deklariert werden, um dies zu vermeiden',
            ],
            es: [
              'Establecer state dentro de un efecto con ese state como dependencia crea un bucle infinito: efecto → cambio de state → re-render → efecto de nuevo',
              'setCount no puede ser llamado dentro de useEffect',
              'El array de dependencias debería estar vacío para arreglarlo',
              'count debe ser declarado fuera del component para evitar esto',
            ],
            it: [
              'Impostare lo state all\'interno di un effetto con quello state come dipendenza crea un loop infinito: effetto → cambio di state → re-render → effetto di nuovo',
              'setCount non può essere chiamato dentro useEffect',
              'L\'array di dipendenze dovrebbe essere vuoto per correggerlo',
              'count deve essere dichiarato fuori dal component per evitare questo',
            ],
          },
          answer: '0',
          tags: ['useEffect', 'effects'],
          explanation: {
            en: 'The effect reads `count`, updates it, which triggers a re-render, which runs the effect again because `count` changed. This cycle never ends. Fix by removing count from deps and using the functional updater: `setCount(c => c + 1)`, or by reconsidering whether an effect is needed at all.',
            fr: 'L\'effet lit `count`, le met à jour, ce qui déclenche un re-render, qui exécute à nouveau l\'effet car `count` a changé. Ce cycle ne se termine jamais. Corrigez en retirant count des dépendances et en utilisant le updater fonctionnel : `setCount(c => c + 1)`, ou en reconsidérant si un effet est nécessaire.',
            de: 'Der Effect liest `count`, aktualisiert es, was ein Re-Rendering auslöst, das den Effect erneut ausführt, weil sich `count` geändert hat. Dieser Zyklus endet nie. Beheben Sie dies, indem Sie count aus den Dependencies entfernen und den funktionalen Updater verwenden: `setCount(c => c + 1)`, oder indem Sie überdenken, ob überhaupt ein Effect benötigt wird.',
            es: 'El efecto lee `count`, lo actualiza, lo que desencadena un re-render, que ejecuta el efecto nuevamente porque `count` cambió. Este ciclo nunca termina. Corrígelo eliminando count de las dependencias y usando el actualizador funcional: `setCount(c => c + 1)`, o reconsiderando si se necesita un efecto en absoluto.',
            it: 'L\'effetto legge `count`, lo aggiorna, il che attiva un re-render, che esegue nuovamente l\'effetto perché `count` è cambiato. Questo ciclo non finisce mai. Correggilo rimuovendo count dalle dipendenze e usando l\'updater funzionale: `setCount(c => c + 1)`, o riconsiderando se un effetto è necessario.',
          },
          docs: 'https://react.dev/reference/react/useEffect',
        },
      },
      {
        id: 'e26ef663-c307-4e17-b3ed-e8b757a485f8',
        data: {
          question: {
            en: 'What is the missing dependency bug here?\n\nfunction Search({ query }) {\n  const [results, setResults] = useState([]);\n  useEffect(() => {\n    fetch(`/api/search?q=${query}`)\n      .then(r => r.json())\n      .then(setResults);\n  }, []); // <-- bug\n}',
            fr: 'Quel est le bug de dépendance manquante ici ?\n\nfunction Search({ query }) {\n  const [results, setResults] = useState([]);\n  useEffect(() => {\n    fetch(`/api/search?q=${query}`)\n      .then(r => r.json())\n      .then(setResults);\n  }, []); // <-- bug\n}',
            de: 'Was ist der fehlende Dependency-Bug hier?\n\nfunction Search({ query }) {\n  const [results, setResults] = useState([]);\n  useEffect(() => {\n    fetch(`/api/search?q=${query}`)\n      .then(r => r.json())\n      .then(setResults);\n  }, []); // <-- bug\n}',
            es: '¿Cuál es el bug de dependencia faltante aquí?\n\nfunction Search({ query }) {\n  const [results, setResults] = useState([]);\n  useEffect(() => {\n    fetch(`/api/search?q=${query}`)\n      .then(r => r.json())\n      .then(setResults);\n  }, []); // <-- bug\n}',
            it: 'Qual è il bug di dipendenza mancante qui?\n\nfunction Search({ query }) {\n  const [results, setResults] = useState([]);\n  useEffect(() => {\n    fetch(`/api/search?q=${query}`)\n      .then(r => r.json())\n      .then(setResults);\n  }, []); // <-- bug\n}',
          },
          choices: {
            en: [
              'setResults should not be in the dependency array',
              'query is used inside the effect but missing from the dependency array — search won\'t re-run when query changes',
              'fetch is an external function that must be listed as a dependency',
              'The effect will never run because query is a prop',
            ],
            fr: [
              'setResults ne devrait pas être dans le tableau de dépendances',
              'query est utilisé dans l\'effet mais manque dans le tableau de dépendances — la recherche ne se réexécutera pas quand query change',
              'fetch est une fonction externe qui doit être listée comme dépendance',
              'L\'effet ne s\'exécutera jamais car query est une prop',
            ],
            de: [
              'setResults sollte nicht im Dependency-Array sein',
              'query wird im Effect verwendet, fehlt aber im Dependency-Array — die Suche wird nicht erneut ausgeführt, wenn query sich ändert',
              'fetch ist eine externe Funktion, die als Dependency aufgelistet werden muss',
              'Der Effect wird nie ausgeführt, weil query eine Prop ist',
            ],
            es: [
              'setResults no debería estar en el array de dependencias',
              'query se usa dentro del efecto pero falta en el array de dependencias — la búsqueda no se volverá a ejecutar cuando query cambie',
              'fetch es una función externa que debe listarse como dependencia',
              'El efecto nunca se ejecutará porque query es una prop',
            ],
            it: [
              'setResults non dovrebbe essere nell\'array di dipendenze',
              'query viene usato nell\'effetto ma manca nell\'array di dipendenze — la ricerca non verrà rieseguita quando query cambia',
              'fetch è una funzione esterna che deve essere elencata come dipendenza',
              'L\'effetto non verrà mai eseguito perché query è una prop',
            ],
          },
          answer: '1',
          tags: ['useEffect'],
          explanation: {
            en: 'The effect uses `query` but the empty `[]` means it only runs on mount, capturing the initial query value forever. If the parent passes a new query prop, the search won\'t re-execute. Fix: add `query` to the dependency array. Also add an abort controller for cleanup to cancel stale requests.',
            fr: 'L\'effet utilise `query` mais le `[]` vide signifie qu\'il s\'exécute seulement au montage, capturant la valeur initiale de query pour toujours. Si le parent passe une nouvelle prop query, la recherche ne se réexécutera pas. Correction : ajoutez `query` au tableau de dépendances. Ajoutez aussi un abort controller pour le nettoyage afin d\'annuler les requêtes obsolètes.',
            de: 'Der Effect verwendet `query`, aber das leere `[]` bedeutet, dass er nur beim Mounting ausgeführt wird und den initialen query-Wert für immer erfasst. Wenn der Parent eine neue query-Prop übergibt, wird die Suche nicht erneut ausgeführt. Lösung: Fügen Sie `query` zum Dependency-Array hinzu. Fügen Sie auch einen Abort-Controller für Cleanup hinzu, um veraltete Anfragen abzubrechen.',
            es: 'El efecto usa `query` pero el `[]` vacío significa que solo se ejecuta en el montaje, capturando el valor inicial de query para siempre. Si el padre pasa una nueva prop query, la búsqueda no se volverá a ejecutar. Solución: añade `query` al array de dependencias. También añade un abort controller para la limpieza para cancelar solicitudes obsoletas.',
            it: 'L\'effetto usa `query` ma il `[]` vuoto significa che viene eseguito solo al mounting, catturando il valore iniziale di query per sempre. Se il parent passa una nuova prop query, la ricerca non verrà rieseguita. Soluzione: aggiungi `query` all\'array di dipendenze. Aggiungi anche un abort controller per la pulizia per annullare le richieste obsolete.',
          },
          docs: 'https://react.dev/reference/react/useEffect',
        },
      },
      {
        id: '4255c4d8-148c-491f-a490-61f7d056cec3',
        data: {
          question: {
            en: 'What are the rules of hooks?',
            fr: 'Quelles sont les règles des hooks ?',
            de: 'Was sind die Regeln von Hooks?',
            es: '¿Cuáles son las reglas de los hooks?',
            it: 'Quali sono le regole degli hooks?',
          },
          choices: {
            en: [
              'Hooks can only be called inside class components',
              'Only call hooks at the top level of a React function; don\'t call them inside conditions, loops, or nested functions',
              'Hooks must be imported from a file named \'hooks.js\'',
              'You can call hooks anywhere in JavaScript, not just React components',
            ],
            fr: [
              'Les hooks ne peuvent être appelés que dans les class components',
              'Appelez les hooks uniquement au niveau supérieur d\'une fonction React ; ne les appelez pas dans des conditions, boucles ou fonctions imbriquées',
              'Les hooks doivent être importés d\'un fichier nommé \'hooks.js\'',
              'Vous pouvez appeler les hooks n\'importe où en JavaScript, pas seulement dans les components React',
            ],
            de: [
              'Hooks können nur in Class Components aufgerufen werden',
              'Rufen Sie Hooks nur auf der obersten Ebene einer React-Funktion auf; rufen Sie sie nicht in Bedingungen, Schleifen oder verschachtelten Funktionen auf',
              'Hooks müssen aus einer Datei namens \'hooks.js\' importiert werden',
              'Sie können Hooks überall in JavaScript aufrufen, nicht nur in React-Components',
            ],
            es: [
              'Los hooks solo pueden ser llamados dentro de class components',
              'Solo llama hooks en el nivel superior de una función React; no los llames dentro de condiciones, bucles o funciones anidadas',
              'Los hooks deben ser importados desde un archivo llamado \'hooks.js\'',
              'Puedes llamar hooks en cualquier lugar de JavaScript, no solo en components React',
            ],
            it: [
              'Gli hooks possono essere chiamati solo all\'interno di class components',
              'Chiama gli hooks solo al livello superiore di una funzione React; non chiamarli all\'interno di condizioni, cicli o funzioni nidificate',
              'Gli hooks devono essere importati da un file chiamato \'hooks.js\'',
              'Puoi chiamare gli hooks ovunque in JavaScript, non solo nei components React',
            ],
          },
          answer: '1',
          tags: ['custom-hooks'],
          explanation: {
            en: 'The two rules of hooks are: (1) only call hooks at the top level — not inside loops, conditions, or nested functions; (2) only call hooks from React function components or custom hooks. These rules ensure React can correctly associate hook state with the right component instance.',
            fr: 'Les deux règles des hooks sont : (1) appelez les hooks uniquement au niveau supérieur — pas dans des boucles, conditions ou fonctions imbriquées ; (2) appelez les hooks uniquement depuis des function components React ou des custom hooks. Ces règles garantissent que React peut correctement associer l\'état des hooks avec la bonne instance de component.',
            de: 'Die zwei Regeln von Hooks sind: (1) rufen Sie Hooks nur auf der obersten Ebene auf — nicht in Schleifen, Bedingungen oder verschachtelten Funktionen; (2) rufen Sie Hooks nur von React-Function-Components oder Custom Hooks auf. Diese Regeln stellen sicher, dass React den Hook-State korrekt mit der richtigen Component-Instanz verknüpfen kann.',
            es: 'Las dos reglas de los hooks son: (1) solo llama hooks en el nivel superior — no dentro de bucles, condiciones o funciones anidadas; (2) solo llama hooks desde function components de React o custom hooks. Estas reglas aseguran que React pueda asociar correctamente el estado de los hooks con la instancia correcta del component.',
            it: 'Le due regole degli hooks sono: (1) chiama gli hooks solo al livello superiore — non all\'interno di cicli, condizioni o funzioni nidificate; (2) chiama gli hooks solo da function components React o custom hooks. Queste regole assicurano che React possa associare correttamente lo state degli hooks con l\'istanza giusta del component.',
          },
          docs: 'https://react.dev/learn/reusing-logic-with-custom-hooks',
        },
      },
      {
        id: '8e0200a1-d0a1-47e5-8c70-ef1fb23705cc',
        data: {
          question: {
            en: 'What makes a function a \'custom hook\' in React?',
            fr: 'Qu\'est-ce qui fait d\'une fonction un \'custom hook\' dans React ?',
            de: 'Was macht eine Funktion zu einem \'Custom Hook\' in React?',
            es: '¿Qué hace que una función sea un \'custom hook\' en React?',
            it: 'Cosa rende una funzione un \'custom hook\' in React?',
          },
          choices: {
            en: [
              'It is registered with React.registerHook()',
              'It extends the Hook class from React',
              'Its name starts with \'use\' and it calls at least one React hook internally',
              'It is exported from a file named useHooks.ts',
            ],
            fr: [
              'Elle est enregistrée avec React.registerHook()',
              'Elle étend la classe Hook de React',
              'Son nom commence par \'use\' et elle appelle au moins un hook React en interne',
              'Elle est exportée depuis un fichier nommé useHooks.ts',
            ],
            de: [
              'Sie wird mit React.registerHook() registriert',
              'Sie erweitert die Hook-Klasse von React',
              'Ihr Name beginnt mit \'use\' und sie ruft intern mindestens einen React-Hook auf',
              'Sie wird aus einer Datei namens useHooks.ts exportiert',
            ],
            es: [
              'Se registra con React.registerHook()',
              'Extiende la clase Hook de React',
              'Su nombre comienza con \'use\' y llama al menos un hook de React internamente',
              'Se exporta desde un archivo llamado useHooks.ts',
            ],
            it: [
              'È registrata con React.registerHook()',
              'Estende la classe Hook di React',
              'Il suo nome inizia con \'use\' e chiama almeno un hook React internamente',
              'Viene esportata da un file chiamato useHooks.ts',
            ],
          },
          answer: '2',
          tags: ['custom-hooks'],
          explanation: {
            en: 'A custom hook is simply a JavaScript function whose name starts with \'use\' and that calls React hooks internally. The naming convention lets linters enforce the rules of hooks. Custom hooks are a powerful abstraction for sharing stateful logic between components.',
            fr: 'Un custom hook est simplement une fonction JavaScript dont le nom commence par \'use\' et qui appelle des hooks React en interne. La convention de nommage permet aux linters d\'appliquer les règles des hooks. Les custom hooks sont une abstraction puissante pour partager de la logique avec état entre les components.',
            de: 'Ein Custom Hook ist einfach eine JavaScript-Funktion, deren Name mit \'use\' beginnt und die intern React-Hooks aufruft. Die Namenskonvention ermöglicht es Lintern, die Regeln von Hooks durchzusetzen. Custom Hooks sind eine mächtige Abstraktion zum Teilen von zustandsbehafteter Logik zwischen Components.',
            es: 'Un custom hook es simplemente una función JavaScript cuyo nombre comienza con \'use\' y que llama hooks de React internamente. La convención de nomenclatura permite a los linters hacer cumplir las reglas de los hooks. Los custom hooks son una abstracción poderosa para compartir lógica con estado entre components.',
            it: 'Un custom hook è semplicemente una funzione JavaScript il cui nome inizia con \'use\' e che chiama hooks React internamente. La convenzione di denominazione permette ai linter di far rispettare le regole degli hooks. I custom hooks sono un\'astrazione potente per condividere logica con stato tra i components.',
          },
          docs: 'https://react.dev/learn/reusing-logic-with-custom-hooks',
        },
      },
      {
        id: 'e9b6c7e2-967a-4253-8716-5c55d0229252',
        data: {
          question: {
            en: 'Two components use the same custom hook `useCounter()`. What is true about their state?',
            fr: 'Deux components utilisent le même custom hook `useCounter()`. Qu\'est-ce qui est vrai concernant leur state ?',
            de: 'Zwei Components verwenden denselben Custom Hook `useCounter()`. Was ist über ihren State wahr?',
            es: 'Dos components usan el mismo custom hook `useCounter()`. ¿Qué es verdadero sobre su state?',
            it: 'Due components usano lo stesso custom hook `useCounter()`. Cosa è vero riguardo al loro state?',
          },
          choices: {
            en: [
              'Both components share the same state instance — changing one changes the other',
              'The first component to mount owns the state; others get a read-only copy',
              'They share state only if the hook uses Context internally',
              'Each component gets its own independent state — hooks share logic but not state',
            ],
            fr: [
              'Les deux components partagent la même instance de state — changer l\'un change l\'autre',
              'Le premier component monté possède le state ; les autres obtiennent une copie en lecture seule',
              'Ils partagent le state uniquement si le hook utilise Context en interne',
              'Chaque component obtient son propre state indépendant — les hooks partagent la logique mais pas le state',
            ],
            de: [
              'Beide Components teilen sich dieselbe State-Instanz — das Ändern eines ändert das andere',
              'Das zuerst gemountete Component besitzt den State; andere erhalten eine schreibgeschützte Kopie',
              'Sie teilen State nur, wenn der Hook intern Context verwendet',
              'Jedes Component erhält seinen eigenen unabhängigen State — Hooks teilen Logik, aber nicht State',
            ],
            es: [
              'Ambos components comparten la misma instancia de state — cambiar uno cambia el otro',
              'El primer component en montarse posee el state; los demás obtienen una copia de solo lectura',
              'Comparten state solo si el hook usa Context internamente',
              'Cada component obtiene su propio state independiente — los hooks comparten lógica pero no state',
            ],
            it: [
              'Entrambi i components condividono la stessa istanza di state — cambiare uno cambia l\'altro',
              'Il primo component a montarsi possiede lo state; gli altri ottengono una copia di sola lettura',
              'Condividono lo state solo se l\'hook usa Context internamente',
              'Ogni component ottiene il proprio state indipendente — gli hooks condividono la logica ma non lo state',
            ],
          },
          answer: '3',
          tags: ['custom-hooks'],
          explanation: {
            en: 'Custom hooks share stateful logic, not state itself. Each call to useCounter() creates independent state within that component instance. To share state between components, you must lift it (common ancestor), use Context, or use an external store.',
            fr: 'Les custom hooks partagent la logique avec état, pas le state lui-même. Chaque appel à useCounter() crée un state indépendant dans cette instance de component. Pour partager le state entre les components, vous devez le remonter (ancêtre commun), utiliser Context ou utiliser un store externe.',
            de: 'Custom Hooks teilen zustandsbehaftete Logik, nicht den State selbst. Jeder Aufruf von useCounter() erstellt unabhängigen State innerhalb dieser Component-Instanz. Um State zwischen Components zu teilen, müssen Sie ihn hochheben (gemeinsamer Vorfahre), Context verwenden oder einen externen Store verwenden.',
            es: 'Los custom hooks comparten lógica con estado, no el state en sí. Cada llamada a useCounter() crea state independiente dentro de esa instancia del component. Para compartir state entre components, debes elevarlo (ancestro común), usar Context o usar un store externo.',
            it: 'I custom hooks condividono logica con stato, non lo state stesso. Ogni chiamata a useCounter() crea state indipendente all\'interno di quell\'istanza del component. Per condividere lo state tra i components, devi sollevarlo (antenato comune), usare Context o usare uno store esterno.',
          },
          docs: 'https://react.dev/learn/reusing-logic-with-custom-hooks',
        },
      },
      {
        id: 'ccf92829-1fcb-4d4d-8c9d-98947e5d2039',
        data: {
          question: {
            en: 'What does the React 19 compiler (React Forget) do?',
            fr: 'Que fait le compilateur React 19 (React Forget) ?',
            de: 'Was macht der React 19 Compiler (React Forget)?',
            es: '¿Qué hace el compilador de React 19 (React Forget)?',
            it: 'Cosa fa il compilatore React 19 (React Forget)?',
          },
          choices: {
            en: [
              'Automatically adds memoization (memo, useMemo, useCallback) at compile time, eliminating the need to write them manually',
              'Compiles React components to WebAssembly for faster execution',
              'Converts class components to function components automatically',
              'Type-checks JSX at compile time without TypeScript',
            ],
            fr: [
              'Ajoute automatiquement la mémoïsation (memo, useMemo, useCallback) au moment de la compilation, éliminant le besoin de les écrire manuellement',
              'Compile les components React en WebAssembly pour une exécution plus rapide',
              'Convertit automatiquement les class components en function components',
              'Vérifie le typage du JSX au moment de la compilation sans TypeScript',
            ],
            de: [
              'Fügt automatisch Memoization (memo, useMemo, useCallback) zur Compile-Zeit hinzu und eliminiert die Notwendigkeit, sie manuell zu schreiben',
              'Kompiliert React-Components zu WebAssembly für schnellere Ausführung',
              'Konvertiert Class Components automatisch zu Function Components',
              'Prüft JSX zur Compile-Zeit auf Typen ohne TypeScript',
            ],
            es: [
              'Agrega automáticamente memoización (memo, useMemo, useCallback) en tiempo de compilación, eliminando la necesidad de escribirlos manualmente',
              'Compila components de React a WebAssembly para una ejecución más rápida',
              'Convierte class components a function components automáticamente',
              'Verifica tipos de JSX en tiempo de compilación sin TypeScript',
            ],
            it: [
              'Aggiunge automaticamente la memoizzazione (memo, useMemo, useCallback) al momento della compilazione, eliminando la necessità di scriverli manualmente',
              'Compila i components React in WebAssembly per un\'esecuzione più veloce',
              'Converte automaticamente i class components in function components',
              'Verifica i tipi JSX al momento della compilazione senza TypeScript',
            ],
          },
          answer: '0',
          tags: ['react-19', 'compiler'],
          explanation: {
            en: 'The React compiler (formerly React Forget) statically analyzes your component code and automatically inserts useMemo, useCallback, and React.memo where appropriate. This eliminates the need to manually optimize re-renders, reducing boilerplate and potential mistakes.',
            fr: 'Le compilateur React (anciennement React Forget) analyse statiquement le code de vos components et insère automatiquement useMemo, useCallback et React.memo là où c\'est approprié. Cela élimine le besoin d\'optimiser manuellement les re-renders, réduisant le code répétitif et les erreurs potentielles.',
            de: 'Der React-Compiler (früher React Forget) analysiert Ihren Component-Code statisch und fügt automatisch useMemo, useCallback und React.memo ein, wo es angemessen ist. Dies eliminiert die Notwendigkeit, Re-Renderings manuell zu optimieren, und reduziert Boilerplate und potenzielle Fehler.',
            es: 'El compilador de React (anteriormente React Forget) analiza estáticamente el código de tus components e inserta automáticamente useMemo, useCallback y React.memo donde sea apropiado. Esto elimina la necesidad de optimizar manualmente los re-renders, reduciendo código repetitivo y errores potenciales.',
            it: 'Il compilatore React (precedentemente React Forget) analizza staticamente il codice dei tuoi components e inserisce automaticamente useMemo, useCallback e React.memo dove appropriato. Questo elimina la necessità di ottimizzare manualmente i re-render, riducendo il codice boilerplate e i potenziali errori.',
          },
          docs: 'https://react.dev/blog/2024/12/05/react-19',
        },
      },
      {
        id: '19c08477-07e7-46ce-9071-98d039450b36',
        data: {
          question: {
            en: 'You need to store a setTimeout ID to cancel it later. Should you use useRef or useState?',
            fr: 'Vous devez stocker un ID de setTimeout pour l\'annuler plus tard. Devriez-vous utiliser useRef ou useState ?',
            de: 'Sie müssen eine setTimeout-ID speichern, um sie später abzubrechen. Sollten Sie useRef oder useState verwenden?',
            es: 'Necesitas almacenar un ID de setTimeout para cancelarlo después. ¿Debes usar useRef o useState?',
            it: 'Devi memorizzare un ID di setTimeout per annullarlo successivamente. Dovresti usare useRef o useState?',
          },
          choices: {
            en: [
              'useState — to ensure the component updates when the timer is set',
              'A module-level variable — it persists better than a ref',
              'useRef — you don\'t need the component to re-render when the timer ID changes',
              'Neither — use the return value of useEffect instead',
            ],
            fr: [
              'useState — pour garantir que le component se met à jour lorsque le timer est défini',
              'Une variable au niveau du module — elle persiste mieux qu\'une ref',
              'useRef — vous n\'avez pas besoin que le component se re-rende lorsque l\'ID du timer change',
              'Ni l\'un ni l\'autre — utilisez plutôt la valeur de retour de useEffect',
            ],
            de: [
              'useState — um sicherzustellen, dass das Component aktualisiert wird, wenn der Timer gesetzt wird',
              'Eine Variable auf Modulebene — sie bleibt besser bestehen als eine ref',
              'useRef — Sie benötigen kein Re-Rendering des Components, wenn sich die Timer-ID ändert',
              'Keines von beiden — verwenden Sie stattdessen den Rückgabewert von useEffect',
            ],
            es: [
              'useState — para asegurar que el component se actualice cuando se establece el timer',
              'Una variable a nivel de módulo — persiste mejor que una ref',
              'useRef — no necesitas que el component se re-renderice cuando cambia el ID del timer',
              'Ninguno — usa el valor de retorno de useEffect en su lugar',
            ],
            it: [
              'useState — per garantire che il component si aggiorni quando viene impostato il timer',
              'Una variabile a livello di modulo — persiste meglio di una ref',
              'useRef — non hai bisogno che il component si ri-renderizzi quando cambia l\'ID del timer',
              'Nessuno dei due — usa invece il valore di ritorno di useEffect',
            ],
          },
          answer: '2',
          tags: ['useRef'],
          explanation: {
            en: 'Timer IDs are implementation details — you need to store them to cancel later, but displaying or reacting to them is unnecessary. Storing them in a ref avoids triggering re-renders. A module-level variable would be shared across all component instances, causing bugs.',
            fr: 'Les IDs de timer sont des détails d\'implémentation — vous devez les stocker pour les annuler plus tard, mais les afficher ou réagir à eux n\'est pas nécessaire. Les stocker dans une ref évite de déclencher des re-renders. Une variable au niveau du module serait partagée entre toutes les instances de component, causant des bugs.',
            de: 'Timer-IDs sind Implementierungsdetails — Sie müssen sie speichern, um sie später abzubrechen, aber sie anzuzeigen oder darauf zu reagieren ist unnötig. Das Speichern in einer ref vermeidet das Auslösen von Re-Renderings. Eine Variable auf Modulebene würde über alle Component-Instanzen geteilt, was Fehler verursacht.',
            es: 'Los IDs de timer son detalles de implementación — necesitas almacenarlos para cancelarlos después, pero mostrarlos o reaccionar a ellos es innecesario. Almacenarlos en una ref evita desencadenar re-renders. Una variable a nivel de módulo sería compartida entre todas las instancias del component, causando bugs.',
            it: 'Gli ID dei timer sono dettagli di implementazione — devi memorizzarli per annullarli successivamente, ma visualizzarli o reagire ad essi è inutile. Memorizzarli in una ref evita di attivare re-render. Una variabile a livello di modulo sarebbe condivisa tra tutte le istanze del component, causando bug.',
          },
          docs: 'https://react.dev/reference/react/useRef',
        },
      },
      {
        id: '4d95680f-1c10-46f6-9639-9fd9257d5718',
        data: {
          question: {
            en: 'What is the difference between useEffect and useLayoutEffect?',
            fr: 'Quelle est la différence entre useEffect et useLayoutEffect ?',
            de: 'Was ist der Unterschied zwischen useEffect und useLayoutEffect?',
            es: '¿Cuál es la diferencia entre useEffect y useLayoutEffect?',
            it: 'Qual è la differenza tra useEffect e useLayoutEffect?',
          },
          choices: {
            en: [
              'useLayoutEffect is for layout CSS changes; useEffect is for JavaScript logic',
              'useLayoutEffect fires synchronously after DOM mutations but before the browser paints; useEffect fires after paint',
              'useLayoutEffect runs on the server; useEffect only runs in the browser',
              'They are identical — useLayoutEffect is an alias',
            ],
            fr: [
              'useLayoutEffect est pour les changements CSS de layout ; useEffect est pour la logique JavaScript',
              'useLayoutEffect se déclenche de manière synchrone après les mutations du DOM mais avant que le navigateur ne peigne ; useEffect se déclenche après la peinture',
              'useLayoutEffect s\'exécute sur le serveur ; useEffect s\'exécute uniquement dans le navigateur',
              'Ils sont identiques — useLayoutEffect est un alias',
            ],
            de: [
              'useLayoutEffect ist für Layout-CSS-Änderungen; useEffect ist für JavaScript-Logik',
              'useLayoutEffect wird synchron nach DOM-Mutationen, aber vor dem Browser-Paint ausgelöst; useEffect wird nach dem Paint ausgelöst',
              'useLayoutEffect läuft auf dem Server; useEffect läuft nur im Browser',
              'Sie sind identisch — useLayoutEffect ist ein Alias',
            ],
            es: [
              'useLayoutEffect es para cambios de CSS de layout; useEffect es para lógica JavaScript',
              'useLayoutEffect se dispara sincrónicamente después de mutaciones del DOM pero antes de que el navegador pinte; useEffect se dispara después de pintar',
              'useLayoutEffect se ejecuta en el servidor; useEffect solo se ejecuta en el navegador',
              'Son idénticos — useLayoutEffect es un alias',
            ],
            it: [
              'useLayoutEffect è per le modifiche CSS del layout; useEffect è per la logica JavaScript',
              'useLayoutEffect si attiva in modo sincrono dopo le mutazioni del DOM ma prima che il browser dipinga; useEffect si attiva dopo il paint',
              'useLayoutEffect viene eseguito sul server; useEffect viene eseguito solo nel browser',
              'Sono identici — useLayoutEffect è un alias',
            ],
          },
          answer: '1',
          tags: ['useEffect'],
          explanation: {
            en: 'useLayoutEffect runs synchronously after React commits DOM changes but before the browser has painted. This lets you measure DOM layout and synchronously re-render without the user seeing intermediate states. Use it sparingly — it blocks painting. For most effects, useEffect (post-paint) is appropriate.',
            fr: 'useLayoutEffect s\'exécute de manière synchrone après que React ait commité les changements du DOM mais avant que le navigateur ne peigne. Cela vous permet de mesurer le layout du DOM et de re-rendre de manière synchrone sans que l\'utilisateur ne voie les états intermédiaires. Utilisez-le avec parcimonie — il bloque la peinture. Pour la plupart des effets, useEffect (post-peinture) est approprié.',
            de: 'useLayoutEffect wird synchron ausgeführt, nachdem React DOM-Änderungen committed hat, aber bevor der Browser gezeichnet hat. Damit können Sie DOM-Layout messen und synchron neu rendern, ohne dass der Benutzer Zwischenzustände sieht. Verwenden Sie es sparsam — es blockiert das Zeichnen. Für die meisten Effects ist useEffect (nach dem Paint) angemessen.',
            es: 'useLayoutEffect se ejecuta sincrónicamente después de que React compromete cambios del DOM pero antes de que el navegador haya pintado. Esto te permite medir el layout del DOM y re-renderizar sincrónicamente sin que el usuario vea estados intermedios. Úsalo con moderación — bloquea la pintura. Para la mayoría de los efectos, useEffect (post-pintura) es apropiado.',
            it: 'useLayoutEffect viene eseguito in modo sincrono dopo che React ha committato le modifiche al DOM ma prima che il browser abbia dipinto. Questo ti permette di misurare il layout del DOM e ri-renderizzare in modo sincrono senza che l\'utente veda stati intermedi. Usalo con parsimonia — blocca il painting. Per la maggior parte degli effetti, useEffect (post-paint) è appropriato.',
          },
          docs: 'https://react.dev/reference/react/useEffect',
        },
      },
      {
        id: '41d2207e-20d2-4e1c-ba9c-49f6eb9cb3c5',
        data: {
          question: {
            en: 'You want to create a `useWindowSize` hook. What should it return and how should it update?',
            fr: 'Vous voulez créer un hook `useWindowSize`. Que devrait-il retourner et comment devrait-il se mettre à jour ?',
            de: 'Sie möchten einen `useWindowSize`-Hook erstellen. Was sollte er zurückgeben und wie sollte er sich aktualisieren?',
            es: 'Quieres crear un hook `useWindowSize`. ¿Qué debería devolver y cómo debería actualizarse?',
            it: 'Vuoi creare un hook `useWindowSize`. Cosa dovrebbe restituire e come dovrebbe aggiornarsi?',
          },
          choices: {
            en: [
              'The cleanup function is wrong — you cannot remove event listeners in useEffect',
              'useState should not be used inside custom hooks',
              'window is not accessible inside useEffect',
              'This implementation is correct — it initializes from window, listens for resize, and cleans up',
            ],
            fr: [
              'La fonction de nettoyage est incorrecte — vous ne pouvez pas supprimer les event listeners dans useEffect',
              'useState ne devrait pas être utilisé dans les custom hooks',
              'window n\'est pas accessible dans useEffect',
              'Cette implémentation est correcte — elle s\'initialise depuis window, écoute le redimensionnement et nettoie',
            ],
            de: [
              'Die Cleanup-Funktion ist falsch — Sie können Event-Listener in useEffect nicht entfernen',
              'useState sollte nicht in Custom Hooks verwendet werden',
              'window ist in useEffect nicht zugänglich',
              'Diese Implementierung ist korrekt — sie initialisiert von window, hört auf Resize und räumt auf',
            ],
            es: [
              'La función de limpieza está mal — no puedes eliminar event listeners en useEffect',
              'useState no debería usarse dentro de custom hooks',
              'window no es accesible dentro de useEffect',
              'Esta implementación es correcta — inicializa desde window, escucha el redimensionamiento y limpia',
            ],
            it: [
              'La funzione di pulizia è sbagliata — non puoi rimuovere event listener in useEffect',
              'useState non dovrebbe essere usato all\'interno di custom hooks',
              'window non è accessibile all\'interno di useEffect',
              'Questa implementazione è corretta — inizializza da window, ascolta il resize e pulisce',
            ],
          },
          answer: '3',
          tags: ['useEffect', 'custom-hooks'],
          explanation: {
            en: 'This is a textbook custom hook. It initializes state from window dimensions, adds a resize listener in useEffect, and returns the cleanup function to remove the listener on unmount. The empty dep array means the listener is set up once. This pattern correctly encapsulates the subscription lifecycle.',
            fr: 'Ceci est un custom hook classique. Il initialise le state à partir des dimensions de la window, ajoute un listener de redimensionnement dans useEffect et retourne la fonction de nettoyage pour supprimer le listener au démontage. Le tableau de dépendances vide signifie que le listener est configuré une fois. Ce pattern encapsule correctement le cycle de vie de la subscription.',
            de: 'Dies ist ein Lehrbuch-Custom-Hook. Er initialisiert State von Window-Dimensionen, fügt einen Resize-Listener in useEffect hinzu und gibt die Cleanup-Funktion zurück, um den Listener beim Unmounting zu entfernen. Das leere Dep-Array bedeutet, dass der Listener einmal eingerichtet wird. Dieses Muster kapselt den Subscription-Lebenszyklus korrekt.',
            es: 'Este es un custom hook de libro de texto. Inicializa el state desde las dimensiones de window, agrega un listener de redimensionamiento en useEffect y devuelve la función de limpieza para eliminar el listener al desmontar. El array de dependencias vacío significa que el listener se configura una vez. Este patrón encapsula correctamente el ciclo de vida de la subscripción.',
            it: 'Questo è un custom hook da manuale. Inizializza lo state dalle dimensioni della window, aggiunge un listener di resize in useEffect e restituisce la funzione di pulizia per rimuovere il listener all\'unmounting. L\'array di dipendenze vuoto significa che il listener viene configurato una volta. Questo pattern incapsula correttamente il ciclo di vita della sottoscrizione.',
          },
          docs: 'https://react.dev/reference/react/useEffect',
        },
      },
      {
        id: 'd490027d-efcc-4c22-bf6b-410044acbce9',
        data: {
          question: {
            en: 'Which of the following are appropriate use cases for useEffect? (Select all that apply)',
            fr: 'Lesquels des cas suivants sont des cas d\'utilisation appropriés pour useEffect ? (Sélectionnez tous ceux qui s\'appliquent)',
            de: 'Welche der folgenden sind geeignete Anwendungsfälle für useEffect? (Wählen Sie alle zutreffenden aus)',
            es: '¿Cuáles de los siguientes son casos de uso apropiados para useEffect? (Selecciona todos los que apliquen)',
            it: 'Quali dei seguenti sono casi d\'uso appropriati per useEffect? (Seleziona tutti quelli applicabili)',
          },
          choices: {
            en: [
              'Computing a derived value from props (e.g., formatted date string)',
              'Subscribing to a WebSocket after mount and unsubscribing on unmount',
              'Fetching data when a query parameter changes',
              'Setting the document title based on current state',
            ],
            fr: [
              'Calculer une valeur dérivée des props (ex : chaîne de date formatée)',
              'S\'abonner à un WebSocket après le montage et se désabonner au démontage',
              'Récupérer des données lorsqu\'un paramètre de requête change',
              'Définir le titre du document en fonction de l\'état actuel',
            ],
            de: [
              'Berechnen eines abgeleiteten Werts aus Props (z. B. formatierter Datumsstring)',
              'Abonnieren eines WebSockets nach dem Mounting und Abmelden beim Unmounting',
              'Abrufen von Daten, wenn sich ein Query-Parameter ändert',
              'Setzen des Dokumenttitels basierend auf dem aktuellen State',
            ],
            es: [
              'Calcular un valor derivado de las props (ej: cadena de fecha formateada)',
              'Suscribirse a un WebSocket después del montaje y desuscribirse al desmontar',
              'Obtener datos cuando cambia un parámetro de consulta',
              'Establecer el título del documento basado en el state actual',
            ],
            it: [
              'Calcolare un valore derivato dalle props (es: stringa di data formattata)',
              'Sottoscriversi a un WebSocket dopo il mounting e annullare la sottoscrizione all\'unmounting',
              'Recuperare dati quando cambia un parametro di query',
              'Impostare il titolo del documento in base allo state attuale',
            ],
          },
          answer: '[1,2,3]',
          tags: ['useEffect', 'effects'],
          explanation: {
            en: 'Effects are for side effects that synchronize with external systems: subscriptions, data fetching, DOM mutations like document.title. Computing derived values from props/state does NOT need an effect — just compute during render. Using an effect for derived values adds unnecessary complexity and a render cycle.',
            fr: 'Les effets sont pour les effets secondaires qui se synchronisent avec des systèmes externes : subscriptions, récupération de données, mutations du DOM comme document.title. Calculer des valeurs dérivées des props/state n\'a PAS besoin d\'un effet — il suffit de calculer pendant le render. Utiliser un effet pour des valeurs dérivées ajoute une complexité inutile et un cycle de render.',
            de: 'Effects sind für Seiteneffekte, die mit externen Systemen synchronisieren: Subscriptions, Datenabruf, DOM-Mutationen wie document.title. Das Berechnen abgeleiteter Werte aus Props/State benötigt KEINEN Effect — berechnen Sie einfach während des Renderings. Die Verwendung eines Effects für abgeleitete Werte fügt unnötige Komplexität und einen Render-Zyklus hinzu.',
            es: 'Los efectos son para efectos secundarios que se sincronizan con sistemas externos: subscripciones, obtención de datos, mutaciones del DOM como document.title. Calcular valores derivados de props/state NO necesita un efecto — simplemente calcula durante el render. Usar un efecto para valores derivados añade complejidad innecesaria y un ciclo de render.',
            it: 'Gli effetti sono per effetti collaterali che si sincronizzano con sistemi esterni: sottoscrizioni, recupero dati, mutazioni del DOM come document.title. Calcolare valori derivati da props/state NON richiede un effetto — basta calcolare durante il render. Usare un effetto per valori derivati aggiunge complessità inutile e un ciclo di render.',
          },
          docs: 'https://react.dev/reference/react/useEffect',
        },
      },
      {
        id: 'aa254178-122d-4e2a-a2ac-fed4c50618d8',
        data: {
          question: {
            en: 'What pattern avoids stale closures in useEffect without adding the function to the dependency array?',
            fr: 'Quel pattern évite les closures obsolètes dans useEffect sans ajouter la fonction au tableau de dépendances ?',
            de: 'Welches Muster vermeidet veraltete Closures in useEffect, ohne die Funktion zum Dependency-Array hinzuzufügen?',
            es: '¿Qué patrón evita closures obsoletos en useEffect sin agregar la función al array de dependencias?',
            it: 'Quale pattern evita le closure obsolete in useEffect senza aggiungere la funzione all\'array di dipendenze?',
          },
          choices: {
            en: [
              'Store the callback in a ref and always call ref.current() inside the effect — the ref always holds the latest value',
              'Add the callback to the dependency array of the interval effect',
              'Use useCallback to stabilize the callback reference',
              'Move the callback definition inside the effect',
            ],
            fr: [
              'Stocker le callback dans une ref et toujours appeler ref.current() dans l\'effet — la ref contient toujours la dernière valeur',
              'Ajouter le callback au tableau de dépendances de l\'effet d\'intervalle',
              'Utiliser useCallback pour stabiliser la référence du callback',
              'Déplacer la définition du callback à l\'intérieur de l\'effet',
            ],
            de: [
              'Speichern Sie den Callback in einer ref und rufen Sie immer ref.current() im Effect auf — die ref enthält immer den neuesten Wert',
              'Fügen Sie den Callback zum Dependency-Array des Interval-Effects hinzu',
              'Verwenden Sie useCallback, um die Callback-Referenz zu stabilisieren',
              'Verschieben Sie die Callback-Definition in den Effect',
            ],
            es: [
              'Almacena el callback en una ref y siempre llama a ref.current() dentro del efecto — la ref siempre contiene el último valor',
              'Agrega el callback al array de dependencias del efecto de intervalo',
              'Usa useCallback para estabilizar la referencia del callback',
              'Mueve la definición del callback dentro del efecto',
            ],
            it: [
              'Memorizza il callback in una ref e chiama sempre ref.current() all\'interno dell\'effetto — la ref contiene sempre l\'ultimo valore',
              'Aggiungi il callback all\'array di dipendenze dell\'effetto di intervallo',
              'Usa useCallback per stabilizzare il riferimento del callback',
              'Sposta la definizione del callback all\'interno dell\'effetto',
            ],
          },
          answer: '0',
          tags: ['useRef', 'useEffect'],
          explanation: {
            en: 'The \'ref pattern\' stores the latest callback in a ref (updated every render), while the interval effect only depends on `delay`. The interval always calls `callbackRef.current()` which points to the latest callback, avoiding the stale closure problem without restarting the interval on every render.',
            fr: 'Le \'pattern ref\' stocke le dernier callback dans une ref (mise à jour à chaque render), tandis que l\'effet d\'intervalle ne dépend que de `delay`. L\'intervalle appelle toujours `callbackRef.current()` qui pointe vers le dernier callback, évitant le problème de closure obsolète sans redémarrer l\'intervalle à chaque render.',
            de: 'Das \'ref-Muster\' speichert den neuesten Callback in einer ref (bei jedem Rendering aktualisiert), während der Interval-Effect nur von `delay` abhängt. Das Interval ruft immer `callbackRef.current()` auf, das auf den neuesten Callback zeigt, und vermeidet so das Problem veralteter Closures, ohne das Interval bei jedem Rendering neu zu starten.',
            es: 'El \'patrón ref\' almacena el último callback en una ref (actualizada en cada render), mientras que el efecto de intervalo solo depende de `delay`. El intervalo siempre llama a `callbackRef.current()` que apunta al último callback, evitando el problema de closure obsoleto sin reiniciar el intervalo en cada render.',
            it: 'Il \'pattern ref\' memorizza l\'ultimo callback in una ref (aggiornata ad ogni render), mentre l\'effetto di intervallo dipende solo da `delay`. L\'intervallo chiama sempre `callbackRef.current()` che punta all\'ultimo callback, evitando il problema della closure obsoleta senza riavviare l\'intervallo ad ogni render.',
          },
          docs: 'https://react.dev/reference/react/useRef',
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
      `SELECT id, data FROM "qcm_question" WHERE "moduleId" = '957b062a-1300-462c-a85e-ad70c2591671'`
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
