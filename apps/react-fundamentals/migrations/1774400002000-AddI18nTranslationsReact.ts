import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddI18nTranslationsReact1774400002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE qcm_module SET label = label || $1::jsonb, description = description || $2::jsonb WHERE id = $3`,
      [
        JSON.stringify({
          fr: "Définitions React",
          de: "React-Definitionen",
          es: "Definiciones de React",
          it: "Definizioni React",
        }),
        JSON.stringify({
          fr: "Vocabulaire React de base : ce qu'est React, JSX, composants, props, state, hooks (useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer, useLayoutEffect), virtual DOM, reconciliation, Fiber, Context API, memoization, portals, Suspense, lazy loading, error boundaries, HOCs, composants contrôlés / non contrôlés, custom hooks, hydration et nouveautés de React 19.",
          de: "Zentrales React-Vokabular: Was ist React, JSX, Komponenten, Props, State, Hooks (useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer, useLayoutEffect), Virtual DOM, Reconciliation, Fiber, Context API, Memoization, Portals, Suspense, Lazy Loading, Error Boundaries, HOCs, kontrollierte / unkontrollierte Komponenten, Custom Hooks, Hydration und Neuerungen in React 19.",
          es: "Vocabulario básico de React: qué es React, JSX, componentes, props, state, hooks (useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer, useLayoutEffect), virtual DOM, reconciliation, Fiber, Context API, memoization, portals, Suspense, lazy loading, error boundaries, HOCs, componentes controlados / no controlados, custom hooks, hydration y novedades de React 19.",
          it: "Vocabolario base di React: che cos'è React, JSX, componenti, props, state, hooks (useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer, useLayoutEffect), virtual DOM, reconciliation, Fiber, Context API, memoization, portals, Suspense, lazy loading, error boundaries, HOC, componenti controllati / non controllati, custom hook, hydration e novità di React 19.",
        }),
        'c3100000-0000-4000-8000-000000000001',
      ]
    );

    // Question 1
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que React ?",
          de: 'Was ist React?',
          es: '¿Qué es React?',
          it: "Che cos'è React?",
        }),
        JSON.stringify({
          fr: [
            'Une bibliothèque de base de données relationnelle pour JavaScript',
            'Une bibliothèque JavaScript déclarative et basée sur des composants pour construire des interfaces utilisateur',
            'Un runtime JavaScript construit sur Node.js',
            'Un framework CSS-in-JS développé par Facebook',
          ],
          de: [
            'Eine relationale Datenbankbibliothek für JavaScript',
            'Eine deklarative, komponentenbasierte JavaScript-Bibliothek zum Erstellen von Benutzeroberflächen',
            'Eine JavaScript-Laufzeitumgebung, die auf Node.js aufbaut',
            'Ein CSS-in-JS-Framework, das von Facebook entwickelt wurde',
          ],
          es: [
            'Una biblioteca de base de datos relacional para JavaScript',
            'Una biblioteca de JavaScript declarativa y basada en componentes para crear interfaces de usuario',
            'Un runtime de JavaScript construido sobre Node.js',
            'Un framework de CSS-in-JS desarrollado por Facebook',
          ],
          it: [
            'Una libreria di database relazionali per JavaScript',
            'Una libreria JavaScript dichiarativa e basata su componenti per costruire interfacce utente',
            'Un runtime JavaScript costruito su Node.js',
            'Un framework CSS-in-JS sviluppato da Facebook',
          ],
        }),
        JSON.stringify({
          fr: "React est une bibliothèque JavaScript open source développée par Meta (Facebook) pour créer des interfaces utilisateur. Elle est déclarative (vous décrivez ce que l'interface doit afficher, pas comment la mettre à jour), basée sur des composants réutilisables et utilise un virtual DOM pour mettre à jour efficacement le DOM réel.",
          de: 'React ist eine Open-Source-JavaScript-Bibliothek von Meta (Facebook) zum Erstellen von Benutzeroberflächen. Sie ist deklarativ (Sie beschreiben, wie die UI aussehen soll, nicht wie sie aktualisiert wird), komponentenbasiert und verwendet ein Virtual DOM, um den echten DOM effizient zu aktualisieren.',
          es: 'React es una biblioteca JavaScript de código abierto creada por Meta (Facebook) para construir interfaces de usuario. Es declarativa (describes cómo debería verse la UI, no cómo actualizarla), basada en componentes reutilizables y utiliza un virtual DOM para actualizar de forma eficiente el DOM real.',
          it: "React è una libreria JavaScript open source sviluppata da Meta (Facebook) per creare interfacce utente. È dichiarativa (descrivi come deve apparire la UI, non come aggiornarla), basata su componenti riutilizzabili e utilizza un virtual DOM per aggiornare in modo efficiente il DOM reale.",
        }),
        'c3100001-0000-4000-8001-000000000001',
      ]
    );

    // Question 2
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que JSX ?",
          de: 'Was ist JSX?',
          es: '¿Qué es JSX?',
          it: "Che cos'è JSX?",
        }),
        JSON.stringify({
          fr: [
            'Un nouveau moteur JavaScript',
            'Une extension de syntaxe pour JavaScript qui ressemble à du HTML et est transformée en appels React.createElement()',
            'Un préprocesseur CSS fourni avec React',
            'Un format de schéma JSON utilisé par React',
          ],
          de: [
            'Eine neue JavaScript-Engine',
            'Eine Syntaxerweiterung für JavaScript, die wie HTML aussieht und in React.createElement()-Aufrufe übersetzt wird',
            'Ein CSS-Präprozessor, der mit React ausgeliefert wird',
            'Ein JSON-Schemaformat, das von React verwendet wird',
          ],
          es: [
            'Un nuevo motor de JavaScript',
            'Una extensión de sintaxis para JavaScript que parece HTML y se transforma en llamadas a React.createElement()',
            'Un preprocesador de CSS incluido con React',
            'Un formato de esquema JSON utilizado por React',
          ],
          it: [
            'Un nuovo motore JavaScript',
            "Un'estensione di sintassi per JavaScript che assomiglia a HTML e viene trasformata in chiamate a React.createElement()",
            'Un preprocessore CSS fornito con React',
            'Un formato di schema JSON utilizzato da React',
          ],
        }),
        JSON.stringify({
          fr: "JSX (JavaScript XML) est une extension de syntaxe qui permet d'écrire du balisage de type HTML dans du code JavaScript. Ce n'est pas du JavaScript valide en soi : des outils comme Babel le transforment en appels `React.createElement()`. JSX rend les modèles de composants plus lisibles tout en restant pleinement pilotés par JavaScript.",
          de: 'JSX (JavaScript XML) ist eine Syntaxerweiterung, mit der Sie HTML-ähnliches Markup in JavaScript schreiben können. Es ist für sich genommen kein gültiges JavaScript – Tools wie Babel übersetzen es in `React.createElement()`-Aufrufe. JSX macht Komponentenvorlagen besser lesbar und bleibt trotzdem voll von JavaScript gesteuert.',
          es: 'JSX (JavaScript XML) es una extensión de sintaxis que permite escribir marcado similar a HTML dentro de JavaScript. No es JavaScript válido por sí mismo: herramientas como Babel lo transforman en llamadas a `React.createElement()`. JSX hace que las plantillas de los componentes sean más legibles sin dejar de estar controladas por JavaScript.',
          it: "JSX (JavaScript XML) è un'estensione di sintassi che permette di scrivere markup simile a HTML all'interno di JavaScript. Non è JavaScript valido da solo: strumenti come Babel lo trasformano in chiamate a `React.createElement()`. JSX rende i template dei componenti più leggibili rimanendo completamente guidati da JavaScript.",
        }),
        'c3100001-0000-4000-8001-000000000002',
      ]
    );

    // Question 3
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un composant React ?",
          de: 'Was ist eine React-Komponente?',
          es: '¿Qué es un componente de React?',
          it: "Che cos'è un componente React?",
        }),
        JSON.stringify({
          fr: [
            'Un fichier HTML autonome contenant du JavaScript',
            "Une partie d'interface réutilisable et autonome qui peut accepter des entrées et renvoie du JSX décrivant ce qui doit apparaître à l'écran",
            'Une classe qui étend HTMLElement',
            "Un créateur d'actions Redux",
          ],
          de: [
            'Eine eigenständige HTML-Datei mit JavaScript darin',
            'Ein wiederverwendbares, in sich geschlossenes UI-Element, das Eingaben akzeptieren kann und JSX zurückgibt, das beschreibt, was auf dem Bildschirm erscheinen soll',
            'Eine Klasse, die HTMLElement erweitert',
            'Ein Redux-Action-Creator',
          ],
          es: [
            'Un archivo HTML independiente con JavaScript dentro',
            'Una parte de interfaz reutilizable y autosuficiente que puede aceptar entradas y devuelve JSX que describe lo que debe aparecer en pantalla',
            'Una clase que extiende HTMLElement',
            'Un creador de acciones de Redux',
          ],
          it: [
            "Un file HTML autonomo con JavaScript all'interno",
            'Una porzione di UI riutilizzabile e autonoma che può accettare input e restituisce JSX che descrive cosa deve apparire sullo schermo',
            'Una classe che estende HTMLElement',
            'Un action creator di Redux',
          ],
        }),
        JSON.stringify({
          fr: 'Un composant React est une fonction JavaScript (ou une classe) qui accepte des props en entrée et renvoie du JSX. Les composants peuvent être composés entre eux pour construire des interfaces complexes et encapsulent leur propre balisage, logique et style, ce qui les rend réutilisables et testables de manière isolée.',
          de: 'Eine React-Komponente ist eine JavaScript-Funktion (oder Klasse), die Props als Eingabe erhält und JSX zurückgibt. Komponenten können zusammengesetzt werden, um komplexe UIs zu bauen, und kapseln ihr eigenes Markup, ihre Logik und ihren Stil, wodurch sie wiederverwendbar und separat testbar sind.',
          es: 'Un componente de React es una función de JavaScript (o una clase) que recibe props como entrada y devuelve JSX. Los componentes se pueden componer entre sí para construir interfaces complejas y encapsulan su propio marcado, lógica y estilo, lo que los hace reutilizables y fáciles de probar de forma aislada.',
          it: 'Un componente React è una funzione JavaScript (o una classe) che accetta delle props in input e restituisce JSX. I componenti possono essere composti tra loro per costruire interfacce complesse e incapsulano il proprio markup, la logica e lo stile, rendendoli riutilizzabili e facilmente testabili.',
        }),
        'c3100001-0000-4000-8001-000000000003',
      ]
    );

    // Question 4
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Que sont les props en React ?',
          de: 'Was sind Props in React?',
          es: '¿Qué son las props en React?',
          it: 'Cosa sono le props in React?',
        }),
        JSON.stringify({
          fr: [
            "L'état interne mutable d'un composant",
            "Des données en lecture seule passées d'un composant parent à un composant enfant",
            'Des propriétés CSS appliquées à un composant',
            'Une API du navigateur pour gérer les événements',
          ],
          de: [
            'Interner veränderlicher Zustand einer Komponente',
            'Schreibgeschützte Daten, die von einer Elternkomponente an eine Kindkomponente weitergegeben werden',
            'CSS-Eigenschaften, die auf eine Komponente angewendet werden',
            'Eine Browser-API zur Ereignisbehandlung',
          ],
          es: [
            'El estado interno mutable de un componente',
            'Datos de solo lectura que se pasan de un componente padre a un componente hijo',
            'Propiedades CSS aplicadas a un componente',
            'Una API del navegador para manejar eventos',
          ],
          it: [
            'Lo stato interno mutabile di un componente',
            'Dati di sola lettura passati da un componente genitore a un componente figlio',
            'Proprietà CSS applicate a un componente',
            "Un'API del browser per gestire gli eventi",
          ],
        }),
        JSON.stringify({
          fr: "Les props (pour \"properties\") sont le mécanisme qui permet de passer des données d'un composant parent à un composant enfant. Elles sont en lecture seule : un enfant ne doit jamais modifier ses props. Ce flux de données unidirectionnel rend le comportement de l'UI plus prévisible ; pour remonter des informations, un enfant appelle des callbacks passés via les props.",
          de: 'Props (Eigenschaften) sind der Mechanismus, mit dem Daten von einer Eltern- zu einer Kindkomponente übergeben werden. Sie sind schreibgeschützt – eine Kindkomponente darf ihre Props nie verändern. Dieser unidirektionale Datenfluss macht das Verhalten der UI vorhersagbar; Kommunikation zurück erfolgt über Callback-Funktionen, die als Props übergeben werden.',
          es: 'Las props (propiedades) son el mecanismo para pasar datos de un componente padre a uno hijo. Son de solo lectura: un hijo nunca debe modificar sus props. Este flujo de datos unidireccional hace que el comportamiento de la interfaz sea más predecible; para comunicarse hacia arriba, el hijo llama a funciones de callback pasadas como props.',
          it: "Le props (properties) sono il meccanismo con cui si passano dati da un componente padre a un componente figlio. Sono in sola lettura: un figlio non dovrebbe mai modificare le proprie props. Questo flusso di dati unidirezionale rende il comportamento della UI più prevedibile; per comunicare verso l'alto, il figlio chiama funzioni di callback passate tramite le props.",
        }),
        'c3100001-0000-4000-8001-000000000004',
      ]
    );

    // Question 5
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que l'état (state) en React ?",
          de: 'Was ist State in React?',
          es: '¿Qué es el estado (state) en React?',
          it: "Che cos'è lo state in React?",
        }),
        JSON.stringify({
          fr: [
            'Des données partagées globalement entre tous les composants',
            "Les données privées et mutables d'un composant qui, lorsqu'elles changent, provoquent un nouveau rendu du composant",
            "L'URL du navigateur stockée dans le composant",
            'Des données statiques passées via les props qui ne peuvent pas changer',
          ],
          de: [
            'Daten, die global zwischen allen Komponenten geteilt werden',
            'Private, veränderliche Daten einer Komponente, deren Änderung ein erneutes Rendern der Komponente auslöst',
            'Die im Komponentenstate gespeicherte Browser-URL',
            'Statische Daten, die über Props übergeben werden und sich nicht ändern können',
          ],
          es: [
            'Datos compartidos globalmente entre todos los componentes',
            'Datos privados y mutables de un componente que, cuando cambian, hacen que el componente se vuelva a renderizar',
            'La URL del navegador almacenada en el componente',
            'Datos estáticos pasados por props que no pueden cambiar',
          ],
          it: [
            'Dati condivisi globalmente tra tutti i componenti',
            'I dati privati e mutabili di un componente che, quando cambiano, causano il nuovo render del componente',
            "L'URL del browser memorizzato nel componente",
            'Dati statici passati tramite props che non possono cambiare',
          ],
        }),
        JSON.stringify({
          fr: "Le state représente des données locales et privées à un composant. Contrairement aux props, il est géré à l'intérieur du composant et peut changer au cours du temps ; lorsqu'il change, React programme un nouveau rendu du composant et de ses enfants pour garder l'interface synchronisée avec les données.",
          de: 'State sind lokale, private Daten einer Komponente. Im Gegensatz zu Props wird der State innerhalb der Komponente verwaltet und kann sich im Laufe der Zeit ändern; wenn er sich ändert, plant React ein erneutes Rendern der Komponente und ihrer Kinder, damit die UI mit den Daten synchron bleibt.',
          es: 'El state representa datos locales y privados de un componente. A diferencia de las props, se gestiona dentro del propio componente y puede cambiar con el tiempo; cuando cambia, React programa un nuevo renderizado del componente y sus hijos para mantener la interfaz sincronizada con los datos.',
          it: "Lo state rappresenta dati locali e privati di un componente. A differenza delle props è gestito all'interno del componente e può cambiare nel tempo; quando cambia, React programma un nuovo render del componente e dei suoi figli così che la UI rimanga sincronizzata con i dati.",
        }),
        'c3100001-0000-4000-8001-000000000005',
      ]
    );

    // Question 6
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useState` ?",
          de: 'Was ist `useState`?',
          es: '¿Qué es `useState`?',
          it: "Che cos'è `useState`?",
        }),
        JSON.stringify({
          fr: [
            'Une méthode de cycle de vie pour les composants de classe',
            "Un hook React qui permet d'ajouter une variable d'état à un composant fonctionnel et renvoie la valeur actuelle et une fonction de mise à jour",
            "Un gestionnaire d'état global similaire à Redux",
            'Un hook qui abonne un composant aux changements de contexte',
          ],
          de: [
            'Eine Lifecycle-Methode für Klassenkomponenten',
            'Ein React-Hook, mit dem Sie einer Funktionskomponente eine State-Variable hinzufügen und den aktuellen Wert sowie eine Setter-Funktion zurückgeben können',
            'Ein globaler State-Manager ähnlich wie Redux',
            'Ein Hook, der eine Komponente an Kontextänderungen abonniert',
          ],
          es: [
            'Un método de ciclo de vida para componentes de clase',
            'Un hook de React que permite añadir una variable de estado a un componente funcional y devuelve el valor actual y una función para actualizarlo',
            'Un gestor de estado global similar a Redux',
            'Un hook que suscribe un componente a los cambios de contexto',
          ],
          it: [
            'Un metodo di lifecycle per i componenti a classe',
            'Un hook di React che permette di aggiungere una variabile di state a un componente funzionale e restituisce il valore corrente e una funzione setter',
            'Un gestore di stato globale simile a Redux',
            'Un hook che iscrive un componente ai cambiamenti di context',
          ],
        }),
        JSON.stringify({
          fr: "`useState(initialValue)` est un hook React qui ajoute un state à un composant fonctionnel. Il renvoie un tableau `[valeur, setValeur]` où `valeur` est l'état courant et `setValeur` une fonction pour le mettre à jour. Appeler `setValeur` déclenche un nouveau rendu avec la valeur mise à jour.",
          de: '`useState(initialValue)` ist ein React-Hook, der einer Funktionskomponente State hinzufügt. Er gibt ein Tupel `[value, setValue]` zurück, wobei `value` der aktuelle Zustand ist und `setValue` eine Funktion, um ihn zu aktualisieren. Ein Aufruf von `setValue` löst ein erneutes Rendern mit dem neuen Wert aus.',
          es: '`useState(initialValue)` es un hook de React que añade estado a un componente funcional. Devuelve una tupla `[value, setValue]`, donde `value` es el estado actual y `setValue` una función para actualizarlo. Llamar a `setValue` provoca un nuevo renderizado con el valor actualizado.',
          it: '`useState(initialValue)` è un hook di React che aggiunge dello state a un componente funzionale. Restituisce una tupla `[value, setValue]` in cui `value` è lo stato corrente e `setValue` è la funzione per aggiornarlo. Chiamando `setValue` React effettua un nuovo render con il nuovo valore.',
        }),
        'c3100001-0000-4000-8001-000000000006',
      ]
    );

    // Question 7
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useEffect` ?",
          de: 'Was ist `useEffect`?',
          es: '¿Qué es `useEffect`?',
          it: "Che cos'è `useEffect`?",
        }),
        JSON.stringify({
          fr: [
            'Un hook qui mémorise les calculs coûteux',
            'Un hook qui permet de synchroniser un composant avec un système externe en exécutant des effets de bord après le rendu',
            'Un hook qui gère les soumissions de formulaires',
            "Une méthode de cycle de vie qui s'exécute avant le montage du composant",
          ],
          de: [
            'Ein Hook, der teure Berechnungen memoisiert',
            'Ein Hook, der eine Komponente mit einem externen System synchronisiert, indem er Side Effects nach dem Rendern ausführt',
            'Ein Hook, der Formularübermittlungen verwaltet',
            'Eine Lifecycle-Methode, die vor dem Mounten der Komponente ausgeführt wird',
          ],
          es: [
            'Un hook que memoriza cálculos costosos',
            'Un hook que permite sincronizar un componente con un sistema externo ejecutando efectos secundarios después del renderizado',
            'Un hook que gestiona el envío de formularios',
            'Un método de ciclo de vida que se ejecuta antes de que el componente se monte',
          ],
          it: [
            'Un hook che memoizza le computazioni costose',
            'Un hook che permette di sincronizzare un componente con un sistema esterno eseguendo side effect dopo il render',
            "Un hook che gestisce l'invio dei form",
            'Un metodo di lifecycle che viene eseguito prima del mount del componente',
          ],
        }),
        JSON.stringify({
          fr: '`useEffect(setup, deps?)` exécute un effet de bord (fetch de données, abonnements, manipulation du DOM) après le rendu du composant. Le tableau de dépendances optionnel contrôle quand il est relancé : tableau vide = une fois au montage ; omis = à chaque rendu ; avec des dépendances = lorsque ces dépendances changent. La fonction de nettoyage retournée est appelée avant le prochain effet ou au démontage.',
          de: '`useEffect(setup, deps?)` führt einen Side Effect (Daten-Fetching, Subscriptions, DOM-Manipulation) nach dem Rendern der Komponente aus. Das optionale Abhängigkeitsarray steuert, wann es erneut ausgeführt wird: leeres Array = einmal beim Mount; weggelassen = bei jedem Render; mit Abhängigkeiten = wenn sich diese ändern. Die zurückgegebene Cleanup-Funktion läuft vor dem nächsten Effect oder beim Unmount.',
          es: '`useEffect(setup, deps?)` ejecuta un efecto secundario (petición de datos, suscripciones, manipulación del DOM) después de que el componente se renderice. El array de dependencias opcional controla cuándo se vuelve a ejecutar: array vacío = una vez al montar; omitido = en cada renderizado; con dependencias = cuando esas dependencias cambian. La función de limpieza devuelta se ejecuta antes del siguiente efecto o al desmontar.',
          it: "`useEffect(setup, deps?)` esegue un side effect (fetch dei dati, sottoscrizioni, manipolazioni del DOM) dopo il render del componente. L'array di dipendenze opzionale controlla quando viene rieseguito: array vuoto = una volta al mount; omesso = a ogni render; con dipendenze = quando quelle dipendenze cambiano. La funzione di cleanup restituita viene eseguita prima del prossimo effect o all'unmount.",
        }),
        'c3100001-0000-4000-8001-000000000007',
      ]
    );

    // Question 8
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le virtual DOM en React ?",
          de: 'Was ist das Virtual DOM in React?',
          es: '¿Qué es el virtual DOM en React?',
          it: "Che cos'è il virtual DOM in React?",
        }),
        JSON.stringify({
          fr: [
            'Une API du navigateur qui permet à JavaScript de manipuler le DOM plus rapidement',
            'Une représentation légère en mémoire du DOM réel que React utilise pour calculer des mises à jour minimales',
            'Un arbre DOM séparé utilisé pour le rendu côté serveur',
            'Le shadow DOM utilisé par les Web Components',
          ],
          de: [
            'Eine Browser-API, mit der JavaScript den DOM schneller manipulieren kann',
            'Eine leichtgewichtige In-Memory-Repräsentation des echten DOM, die React verwendet, um minimale Updates zu berechnen',
            'Ein separater DOM-Baum, der für Server-Side Rendering verwendet wird',
            'Der Shadow DOM, der von Web Components genutzt wird',
          ],
          es: [
            'Una API del navegador que permite a JavaScript manipular el DOM más rápido',
            'Una representación ligera en memoria del DOM real que React utiliza para calcular actualizaciones mínimas',
            'Un árbol DOM separado utilizado para el renderizado en el servidor',
            'El shadow DOM utilizado por los Web Components',
          ],
          it: [
            'Una API del browser che permette a JavaScript di manipolare il DOM più velocemente',
            'Una rappresentazione in memoria leggera del DOM reale che React usa per calcolare aggiornamenti minimi',
            'Un albero DOM separato usato per il rendering lato server',
            'Lo shadow DOM usato dai Web Components',
          ],
        }),
        JSON.stringify({
          fr: "Le virtual DOM (VDOM) est un simple arbre d'objets JavaScript qui reflète le DOM réel. Quand les props ou le state changent, React crée un nouvel arbre VDOM et le compare à l'ancien (reconciliation) pour déterminer l'ensemble minimal d'opérations à appliquer au DOM réel. Ce regroupement d'updates est plus efficace que des manipulations directes du DOM.",
          de: 'Das Virtual DOM (VDOM) ist ein JavaScript-Objektbaum, der den echten DOM widerspiegelt. Wenn sich Props oder State ändern, erstellt React einen neuen VDOM-Baum und vergleicht ihn mit dem vorherigen (Reconciliation), um das minimale Set an DOM-Operationen zu bestimmen. Dieses Batching der Updates ist effizienter als direkte DOM-Manipulation.',
          es: 'El virtual DOM (VDOM) es un árbol de objetos JavaScript que refleja el DOM real. Cuando cambian las props o el estado, React crea un nuevo árbol de VDOM y lo compara con el anterior (reconciliation) para identificar el conjunto mínimo de operaciones sobre el DOM real. Este agrupamiento de actualizaciones es más eficiente que manipular el DOM directamente.',
          it: "Il virtual DOM (VDOM) è un albero di oggetti JavaScript che rispecchia il DOM reale. Quando props o state cambiano, React crea un nuovo albero VDOM e lo confronta con il precedente (reconciliation) per determinare il set minimo di operazioni sul DOM reale. Questo batching degli aggiornamenti è più efficiente della manipolazione diretta del DOM.",
        }),
        'c3100001-0000-4000-8001-000000000008',
      ]
    );

    // Question 9
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un composant fonctionnel en React ?",
          de: 'Was ist eine Funktionskomponente in React?',
          es: '¿Qué es un componente funcional en React?',
          it: "Che cos'è un componente funzionale in React?",
        }),
        JSON.stringify({
          fr: [
            'Un composant qui ne peut rendre que du HTML statique sans logique',
            'Une simple fonction JavaScript qui accepte des props et renvoie du JSX, et peut utiliser des hooks pour la gestion du state et du cycle de vie',
            'Un composant qui étend React.PureComponent',
            "Un composant qui ne se rend que lorsqu'une condition est vraie",
          ],
          de: [
            'Eine Komponente, die nur statisches HTML ohne Logik rendern kann',
            'Eine einfache JavaScript-Funktion, die Props akzeptiert und JSX zurückgibt und Hooks für State und Lifecycle verwenden kann',
            'Eine Komponente, die React.PureComponent erweitert',
            'Eine Komponente, die nur gerendert wird, wenn eine Bedingung wahr ist',
          ],
          es: [
            'Un componente que solo puede renderizar HTML estático sin lógica',
            'Una función de JavaScript que acepta props y devuelve JSX, y puede usar hooks para gestionar estado y ciclo de vida',
            'Un componente que extiende React.PureComponent',
            'Un componente que solo se renderiza cuando una condición es verdadera',
          ],
          it: [
            'Un componente che può renderizzare solo HTML statico senza logica',
            'Una semplice funzione JavaScript che accetta props e restituisce JSX e può usare gli hook per gestire state e lifecycle',
            'Un componente che estende React.PureComponent',
            'Un componente che viene renderizzato solo quando una condizione è vera',
          ],
        }),
        JSON.stringify({
          fr: "Un composant fonctionnel est une fonction JavaScript (classique ou arrow function) dont le nom commence par une majuscule, qui accepte un objet props et renvoie du JSX. Depuis l'introduction des hooks dans React 16.8, les composants fonctionnels peuvent gérer le state, les effets et le contexte, ce qui rend les composants de classe largement obsolètes.",
          de: 'Eine Funktionskomponente ist eine JavaScript-Funktion (normal oder Arrow Function) mit großgeschriebenem Namen, die ein Props-Objekt akzeptiert und JSX zurückgibt. Seit der Einführung der Hooks in React 16.8 können Funktionskomponenten State, Side Effects und Context verwalten – Klassenkomponenten werden dadurch weitgehend überflüssig.',
          es: 'Un componente funcional es una función de JavaScript (normal o función flecha) cuyo nombre empieza por mayúscula, que acepta un objeto de props y devuelve JSX. Desde la introducción de los hooks en React 16.8, los componentes funcionales pueden gestionar estado, efectos y contexto, por lo que los componentes de clase han quedado en gran medida obsoletos.',
          it: "Un componente funzionale è una funzione JavaScript (normale o arrow function) il cui nome inizia con una lettera maiuscola, che accetta un oggetto props e restituisce JSX. Dall'introduzione degli hook in React 16.8, i componenti funzionali possono gestire state, side effect e context, rendendo in gran parte obsoleti i componenti a classe.",
        }),
        'c3100001-0000-4000-8001-000000000009',
      ]
    );

    // Question 10
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un Fragment React ?",
          de: 'Was ist ein React Fragment?',
          es: '¿Qué es un Fragment de React?',
          it: "Che cos'è un React Fragment?",
        }),
        JSON.stringify({
          fr: [
            'Un composant qui charge paresseusement ses enfants',
            'Un conteneur qui permet de regrouper plusieurs éléments JSX sans ajouter de nœud DOM supplémentaire',
            'Une syntaxe de commentaire spéciale dans JSX',
            "Un espace réservé rendu pendant qu'un composant est suspendu",
          ],
          de: [
            'Eine Komponente, die ihre Kinder lazy lädt',
            'Ein Wrapper, mit dem Sie mehrere JSX-Elemente gruppieren können, ohne ein zusätzliches DOM-Element hinzuzufügen',
            'Eine spezielle Kommentarsyntax in JSX',
            'Ein Platzhalter, der gerendert wird, während eine Komponente suspendiert ist',
          ],
          es: [
            'Un componente que carga perezosamente a sus hijos',
            'Un contenedor que permite agrupar varios elementos JSX sin añadir un nodo DOM adicional',
            'Una sintaxis especial de comentarios en JSX',
            'Un marcador de posición que se renderiza mientras un componente está suspendido',
          ],
          it: [
            'Un componente che carica in modo lazy i propri figli',
            'Un wrapper che permette di raggruppare più elementi JSX senza aggiungere un ulteriore nodo DOM',
            'Una sintassi speciale per i commenti in JSX',
            'Un segnaposto renderizzato mentre un componente è in sospensione',
          ],
        }),
        JSON.stringify({
          fr: "Un Fragment (`<React.Fragment>` ou le raccourci `<>...</>`) permet de regrouper plusieurs éléments dans une seule expression JSX sans introduire d'élément DOM supplémentaire. C'est utile quand un parent n'accepte qu'un seul enfant (par exemple `<td>` dans `<tr>`) mais que vous devez renvoyer plusieurs éléments.",
          de: 'Ein Fragment (`<React.Fragment>` oder die Kurzschreibweise `<>...</>`) ermöglicht es, mehrere Elemente zu einer einzigen JSX-Ausdrucksgruppe zusammenzufassen, ohne ein zusätzliches DOM-Element einzuführen. Das ist wichtig, wenn ein Eltern-Element nur ein Kind erlaubt (z. B. `<td>` in `<tr>`), Sie aber mehrere Elemente zurückgeben müssen.',
          es: 'Un Fragment (`<React.Fragment>` o la forma abreviada `<>...</>`) permite agrupar varios elementos en una única expresión JSX sin añadir un nodo DOM extra. Es útil cuando un elemento padre solo admite un hijo (por ejemplo `<td>` dentro de `<tr>`) pero necesitas devolver varios elementos.',
          it: 'Un Fragment (`<React.Fragment>` o la scorciatoia `<>...</>`) consente di raggruppare più elementi in una singola espressione JSX senza introdurre un ulteriore elemento DOM. È utile quando un genitore richiede un solo elemento figlio (ad esempio `<td>` dentro `<tr>`) ma devi restituire più elementi.',
        }),
        'c3100001-0000-4000-8001-000000000010',
      ]
    );

    // Question 11
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'À quoi sert la prop `key` en React ?',
          de: 'Wozu dient die Prop `key` in React?',
          es: '¿Para qué sirve la prop `key` en React?',
          it: 'A cosa serve la prop `key` in React?',
        }),
        JSON.stringify({
          fr: [
            'Une prop qui chiffre les données du composant pour la sécurité',
            "Un attribut spécial qui aide React à identifier quels éléments d'une liste ont changé, été ajoutés ou supprimés",
            'Une prop utilisée pour transférer une ref à un élément enfant',
            "Un identifiant basé sur l'index automatiquement ajouté à chaque élément",
          ],
          de: [
            'Eine Prop, die Komponentendaten aus Sicherheitsgründen verschlüsselt',
            'Ein spezielles Attribut, das React hilft zu erkennen, welche Listenelemente sich geändert haben, hinzugefügt oder entfernt wurden',
            'Eine Prop, die verwendet wird, um eine Ref an ein Kindelement weiterzuleiten',
            'Eine indexbasierte Kennung, die automatisch zu jedem Element hinzugefügt wird',
          ],
          es: [
            'Una prop que cifra los datos del componente por seguridad',
            'Un atributo especial que ayuda a React a identificar qué elementos de una lista han cambiado, se han añadido o eliminado',
            'Una prop utilizada para reenviar una ref a un elemento hijo',
            'Un identificador basado en el índice que se añade automáticamente a cada elemento',
          ],
          it: [
            'Una prop che cifra i dati del componente per motivi di sicurezza',
            "Una proprietà speciale che aiuta React a identificare quali elementi di una lista sono cambiati, sono stati aggiunti o rimossi",
            'Una prop usata per inoltrare una ref a un elemento figlio',
            "Un identificatore basato sull'indice aggiunto automaticamente a ogni elemento",
          ],
        }),
        JSON.stringify({
          fr: "La prop `key` est un attribut spécial que React utilise pendant la reconciliation pour suivre les éléments d'une liste entre les rendus. Les clés doivent être stables et uniques parmi les frères et sœurs ; utiliser l'ID unique d'un élément (et non son index de tableau) évite des bugs lors des réordonnancements ou suppressions et permet à React de réutiliser les bons nœuds DOM.",
          de: 'Die Prop `key` ist ein spezielles Attribut, das React während der Reconciliation verwendet, um Listenelemente zwischen Renderzyklen nachzuverfolgen. Keys müssen stabil und unter Geschwistern eindeutig sein; die Verwendung einer eindeutigen ID eines Elements (nicht des Array-Index) verhindert Bugs bei Umordnungen oder Löschungen und stellt sicher, dass React die richtigen DOM-Knoten wiederverwendet.',
          es: 'La prop `key` es un atributo especial que React utiliza durante la reconciliation para seguir los elementos de una lista entre renderizados. Las keys deben ser estables y únicas entre hermanos; usar el ID único del elemento (no su índice en el array) evita errores cuando se reordenan o eliminan elementos y asegura que React reutilice los nodos del DOM correctos.',
          it: "La prop `key` è un attributo speciale che React usa durante la reconciliation per tracciare gli elementi di una lista tra un render e l'altro. Le chiavi devono essere stabili e univoche tra i fratelli; usare l'ID univoco dell'elemento (e non l'indice dell'array) evita bug quando gli elementi vengono riordinati o rimossi e permette a React di riutilizzare i nodi DOM corretti.",
        }),
        'c3100001-0000-4000-8001-000000000011',
      ]
    );

    // Question 12
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que la prop children en React ?",
          de: 'Was ist die Prop children in React?',
          es: '¿Qué es la prop children en React?',
          it: "Che cos'è la prop children in React?",
        }),
        JSON.stringify({
          fr: [
            'Un tableau contenant tous les composants frères',
            "Une prop spéciale qui contient les éléments JSX placés entre les balises ouvrante et fermante d'un composant",
            "Une prop qui contient l'état interne d'un composant",
            'Une liste de callbacks de méthodes de cycle de vie',
          ],
          de: [
            'Ein Array aller Geschwisterkomponenten',
            'Eine spezielle Prop, die die JSX-Elemente enthält, die zwischen den öffnenden und schließenden Tags einer Komponente platziert werden',
            'Eine Prop, die den internen State einer Komponente enthält',
            'Eine Liste von Lifecycle-Callbackfunktionen',
          ],
          es: [
            'Un array con todos los componentes hermanos',
            'Una prop especial que contiene los elementos JSX colocados entre las etiquetas de apertura y cierre de un componente',
            'Una prop que contiene el estado interno de un componente',
            'Una lista de callbacks de métodos de ciclo de vida',
          ],
          it: [
            'Un array che contiene tutti i componenti fratelli',
            'Una prop speciale che contiene gli elementi JSX inseriti tra i tag di apertura e chiusura di un componente',
            'Una prop che contiene lo state interno di un componente',
            'Un elenco di callback dei metodi di lifecycle',
          ],
        }),
        JSON.stringify({
          fr: "`props.children` contient le JSX placé entre les balises ouvrante et fermante d'un composant quand il est utilisé. Cela permet des modèles de composition : des composants de mise en page ou de wrapper peuvent rendre leurs enfants sans savoir ce qu'ils contiennent. La prop `children` peut être une chaîne, un élément unique, un tableau d'éléments ou `undefined`.",
          de: '`props.children` enthält das JSX, das zwischen den öffnenden und schließenden Tags einer Komponente steht, wenn sie verwendet wird. Dies ermöglicht Kompositionsmuster: Wrapper- oder Layout-Komponenten können ihre Kinder rendern, ohne zu wissen, was sie sind. Die Prop `children` kann ein String, ein einzelnes Element, ein Array oder `undefined` sein.',
          es: '`props.children` contiene el JSX que se coloca entre las etiquetas de apertura y cierre de un componente cuando se usa. Esto permite patrones de composición: componentes de maquetación o contenedores pueden renderizar a sus hijos sin saber qué son. La prop `children` puede ser una cadena, un único elemento, un array o `undefined`.',
          it: '`props.children` contiene il JSX inserito tra i tag di apertura e chiusura di un componente quando viene usato. Questo abilita pattern di composizione: componenti wrapper o di layout possono renderizzare i loro figli senza sapere cosa sono. La prop `children` può essere una stringa, un singolo elemento, un array oppure `undefined`.',
        }),
        'c3100001-0000-4000-8001-000000000012',
      ]
    );

    // Question 13
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useContext` ?",
          de: 'Was ist `useContext`?',
          es: '¿Qué es `useContext`?',
          it: "Che cos'è `useContext`?",
        }),
        JSON.stringify({
          fr: [
            'Un hook qui crée un nouveau contexte',
            'Un hook qui lit et abonne un composant à un contexte React, ce qui évite le prop drilling',
            'Un hook qui mémorise une valeur de contexte',
            'Un hook qui fournit un contexte aux composants enfants',
          ],
          de: [
            'Ein Hook, der einen neuen Kontext erstellt',
            'Ein Hook, der eine Komponente an einen React-Kontext anschließt und so Prop Drilling vermeidet',
            'Ein Hook, der einen Kontextwert memoisiert',
            'Ein Hook, der Kontext für Kindkomponenten bereitstellt',
          ],
          es: [
            'Un hook que crea un nuevo contexto',
            'Un hook que lee y suscribe un componente a un contexto de React, evitando el prop drilling',
            'Un hook que memoriza un valor de contexto',
            'Un hook que proporciona contexto a los componentes hijos',
          ],
          it: [
            'Un hook che crea un nuovo context',
            'Un hook che legge e sottoscrive un componente a un context di React, evitando il prop drilling',
            'Un hook che memoizza un valore di context',
            'Un hook che fornisce un context ai componenti figli',
          ],
        }),
        JSON.stringify({
          fr: "`useContext(MyContext)` lit la valeur actuelle d'un contexte fourni par le `<MyContext.Provider>` le plus proche plus haut dans l'arbre. Le composant se re-render automatiquement lorsque la valeur de contexte change. Cela remplace l'ancien pattern `<Context.Consumer>` et élimine le prop drilling pour des données globales comme le thème ou l'authentification.",
          de: '`useContext(MyContext)` liest den aktuellen Wert eines Kontexts aus dem nächstgelegenen `<MyContext.Provider>` weiter oben im Baum. Die Komponente rendert automatisch neu, wenn sich der Kontextwert ändert. Es ersetzt das ältere `<Context.Consumer>`-Pattern und verhindert Prop Drilling für globale Daten wie Theme oder Auth.',
          es: '`useContext(MyContext)` lee el valor actual de un contexto proporcionado por el `<MyContext.Provider>` más cercano en el árbol. El componente se vuelve a renderizar automáticamente cuando cambia el valor del contexto. Sustituye al patrón antiguo `<Context.Consumer>` y elimina el prop drilling para datos globales como el tema o la autenticación.',
          it: "`useContext(MyContext)` legge il valore corrente di un context fornito dal `<MyContext.Provider>` più vicino più in alto nell'albero. Il componente viene renderizzato di nuovo automaticamente quando il valore di context cambia. Sostituisce il vecchio pattern `<Context.Consumer>` ed elimina il prop drilling per dati globali come tema o autenticazione.",
        }),
        'c3100001-0000-4000-8001-000000000013',
      ]
    );

    // Question 14
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useRef` ?",
          de: 'Was ist `useRef`?',
          es: '¿Qué es `useRef`?',
          it: "Che cos'è `useRef`?",
        }),
        JSON.stringify({
          fr: [
            "Un hook qui crée une variable d'état réactive",
            'Un hook qui renvoie un objet ref mutable dont la propriété `.current` persiste entre les rendus sans provoquer de re-render',
            "Un hook qui s'abonne aux événements de redimensionnement du navigateur",
            'Un hook qui transfère une ref à un composant parent',
          ],
          de: [
            'Ein Hook, der eine reaktive State-Variable erstellt',
            'Ein Hook, der ein veränderliches Ref-Objekt mit einer `.current`-Eigenschaft zurückgibt, das Renderzyklen überdauert, ohne neue Renders auszulösen',
            'Ein Hook, der sich auf Resize-Ereignisse des Browsers abonniert',
            'Ein Hook, der eine Ref an eine Elternkomponente weiterleitet',
          ],
          es: [
            'Un hook que crea una variable de estado reactiva',
            'Un hook que devuelve un objeto ref mutable cuya propiedad `.current` persiste entre renderizados sin provocar nuevos renders',
            'Un hook que se suscribe a eventos de cambio de tamaño del navegador',
            'Un hook que reenvía una ref a un componente padre',
          ],
          it: [
            'Un hook che crea una variabile di state reattiva',
            'Un hook che restituisce un oggetto ref mutabile la cui proprietà `.current` persiste tra i render senza causare nuovi render',
            'Un hook che si sottoscrive agli eventi di resize del browser',
            'Un hook che inoltra una ref a un componente genitore',
          ],
        }),
        JSON.stringify({
          fr: "`useRef(initialValue)` renvoie un objet `{ current: initialValue }`. Contrairement au state, modifier `.current` ne déclenche PAS de nouveau rendu. Il sert principalement à accéder directement aux nœuds DOM via `ref={myRef}` et à stocker des valeurs mutables qui doivent persister entre les rendus (par exemple des IDs d'intervalle ou des valeurs précédentes).",
          de: '`useRef(initialValue)` gibt ein Objekt `{ current: initialValue }` zurück. Anders als beim State löst das Ändern von `.current` KEIN erneutes Rendern aus. Es wird hauptsächlich verwendet, um DOM-Knoten direkt über `ref={myRef}` zu referenzieren und veränderliche Werte über mehrere Renders zu speichern (z. B. Interval-IDs oder vorherige Werte).',
          es: '`useRef(initialValue)` devuelve un objeto `{ current: initialValue }`. A diferencia del state, mutar `.current` NO provoca un nuevo renderizado. Se usa principalmente para acceder directamente a nodos del DOM mediante `ref={myRef}` y para almacenar valores mutables que deben persistir entre renderizados (por ejemplo IDs de intervalos o valores anteriores).',
          it: '`useRef(initialValue)` restituisce un oggetto `{ current: initialValue }`. A differenza dello state, modificare `.current` NON provoca un nuovo render. Si usa principalmente per accedere direttamente ai nodi DOM tramite `ref={myRef}` e per memorizzare valori mutabili che devono persistere tra i render (ad esempio ID di intervalli o valori precedenti).',
        }),
        'c3100001-0000-4000-8001-000000000014',
      ]
    );

    // Question 15
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useMemo` ?",
          de: 'Was ist `useMemo`?',
          es: '¿Qué es `useMemo`?',
          it: "Che cos'è `useMemo`?",
        }),
        JSON.stringify({
          fr: [
            'Un hook qui mémorise une fonction de rappel entre les rendus',
            "Un hook qui met en cache le résultat d'un calcul coûteux et ne le recalcule que lorsque ses dépendances changent",
            'Un hook qui empêche un composant de se re-render',
            'Un hook qui regroupe plusieurs mises à jour de state',
          ],
          de: [
            'Ein Hook, der eine Callback-Funktion zwischen Renders memoisiert',
            'Ein Hook, der das Ergebnis einer teuren Berechnung cached und nur neu berechnet, wenn sich seine Abhängigkeiten ändern',
            'Ein Hook, der verhindert, dass eine Komponente neu gerendert wird',
            'Ein Hook, der mehrere State-Updates bündelt',
          ],
          es: [
            'Un hook que memoriza una función de callback entre renderizados',
            'Un hook que almacena en caché el resultado de un cálculo costoso y solo lo recalcula cuando cambian sus dependencias',
            'Un hook que evita que un componente se vuelva a renderizar',
            'Un hook que agrupa varias actualizaciones de estado',
          ],
          it: [
            'Un hook che memoizza una funzione di callback tra i render',
            'Un hook che mette in cache il risultato di un calcolo costoso e lo ricalcola solo quando le sue dipendenze cambiano',
            'Un hook che impedisce a un componente di essere renderizzato di nuovo',
            'Un hook che raggruppa più aggiornamenti di state',
          ],
        }),
        JSON.stringify({
          fr: "`useMemo(() => calculCoûteux(), deps)` met en cache (memoise) la valeur de retour d'une fonction. La valeur mémorisée est réutilisée aux rendus suivants tant que les dépendances ne changent pas. Il sert à éviter de recalculer des opérations réellement coûteuses à chaque rendu ; inutile de l'utiliser partout, son surcoût ne se justifie que pour des calculs lourds.",
          de: '`useMemo(() => teureBerechnung(), deps)` cached (memoisiert) den Rückgabewert einer Funktion. Der gespeicherte Wert wird bei Re-Renders wiederverwendet, solange sich die Abhängigkeiten nicht ändern. Es wird verwendet, um wirklich teure Berechnungen nicht bei jedem Render erneut durchführen zu müssen; der Overhead lohnt sich nicht für triviale Berechnungen.',
          es: '`useMemo(() => calculoCostoso(), deps)` almacena en caché (memoiza) el valor devuelto por una función. El valor memorizado se reutiliza en renderizados posteriores mientras las dependencias no cambien. Sirve para evitar recomputar operaciones realmente costosas en cada render; no tiene sentido usarlo para todo, su sobrecoste solo compensa en cálculos pesados.',
          it: '`useMemo(() => calcoloCostoso(), deps)` memorizza (memoizza) il valore di ritorno di una funzione. Il valore memorizzato viene riutilizzato nei render successivi finché le dipendenze non cambiano. Serve per evitare di ricalcolare operazioni davvero costose a ogni render; non va usato ovunque perché ha un overhead che si giustifica solo per calcoli pesanti.',
        }),
        'c3100001-0000-4000-8001-000000000015',
      ]
    );

    // Question 16
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useCallback` ?",
          de: 'Was ist `useCallback`?',
          es: '¿Qué es `useCallback`?',
          it: "Che cos'è `useCallback`?",
        }),
        JSON.stringify({
          fr: [
            'Un hook qui appelle une fonction immédiatement au montage',
            "Un hook qui met en cache une référence de fonction entre les rendus pour qu'elle ne change que lorsque ses dépendances changent",
            "Un hook qui applique un debounce aux gestionnaires d'événements",
            "Un hook qui mémorise la valeur de retour d'une fonction",
          ],
          de: [
            'Ein Hook, der eine Funktion direkt beim Mounten aufruft',
            'Ein Hook, der eine Funktionsreferenz zwischen Renderzyklen cached, sodass sie sich nur ändert, wenn sich ihre Abhängigkeiten ändern',
            "Ein Hook, der Event-Handler debounce't",
            'Ein Hook, der den Rückgabewert einer Funktion memoisiert',
          ],
          es: [
            'Un hook que llama a una función inmediatamente al montar',
            'Un hook que almacena en caché una referencia de función entre renderizados para que solo cambie cuando cambian sus dependencias',
            'Un hook que aplica debounce a los manejadores de eventos',
            'Un hook que memoiza el valor devuelto por una función',
          ],
          it: [
            'Un hook che invoca una funzione immediatamente al mount',
            'Un hook che memorizza una referenza di funzione tra i render in modo che cambi solo quando cambiano le sue dipendenze',
            'Un hook che applica un debounce ai gestori di eventi',
            'Un hook che memoizza il valore restituito da una funzione',
          ],
        }),
        JSON.stringify({
          fr: "`useCallback(fn, deps)` renvoie une version mémoïsée d'une fonction qui ne change que lorsque les dépendances changent. Sans cela, une nouvelle fonction serait créée à chaque rendu. C'est important lorsqu'on passe des callbacks à des composants mémoïsés (`React.memo`) pour éviter des re-rendus inutiles ; c'est en pratique équivalent à `useMemo(() => fn, deps)`.",
          de: '`useCallback(fn, deps)` gibt eine memoiserte Version einer Funktion zurück, die sich nur ändert, wenn sich die Abhängigkeiten ändern. Ohne diesen Hook würde bei jedem Render eine neue Funktionsreferenz erzeugt. Das ist wichtig, wenn man Callbacks an memoiserte Kinder (`React.memo`) übergibt, um unnötige Re-Renders zu vermeiden; im Grunde entspricht es `useMemo(() => fn, deps)`.',
          es: '`useCallback(fn, deps)` devuelve una versión memorizada de una función que solo cambia cuando cambian sus dependencias. Sin este hook se crearía una nueva referencia de función en cada renderizado. Es importante al pasar callbacks a componentes memorizados (`React.memo`) para evitar renders innecesarios; en la práctica equivale a `useMemo(() => fn, deps)`.',
          it: '`useCallback(fn, deps)` restituisce una versione memoizzata di una funzione che cambia solo quando cambiano le sue dipendenze. Senza questo hook verrebbe creata una nuova referenza di funzione a ogni render. È importante quando si passano callback a componenti memoizzati (`React.memo`) per evitare render inutili; in pratica è equivalente a `useMemo(() => fn, deps)`.',
        }),
        'c3100001-0000-4000-8001-000000000016',
      ]
    );

    // Question 17
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useReducer` ?",
          de: 'Was ist `useReducer`?',
          es: '¿Qué es `useReducer`?',
          it: "Che cos'è `useReducer`?",
        }),
        JSON.stringify({
          fr: [
            'Un hook qui connecte un composant à un store Redux',
            "Un hook qui gère des transitions d'état complexes via une fonction reducer et renvoie l'état courant et une fonction dispatch",
            "Un hook qui réduit un tableau d'enfants en une seule valeur",
            'Un hook qui remplace useEffect pour le fetch de données',
          ],
          de: [
            'Ein Hook, der eine Komponente mit einem Redux-Store verbindet',
            'Ein Hook, der komplexe State-Übergänge über eine Reducer-Funktion verwaltet und den aktuellen State sowie eine Dispatch-Funktion zurückgibt',
            'Ein Hook, der ein Array von Kindern auf einen einzelnen Wert reduziert',
            'Ein Hook, der useEffect für Datenabrufe ersetzt',
          ],
          es: [
            'Un hook que conecta un componente a un store de Redux',
            'Un hook que gestiona transiciones de estado complejas mediante una función reducer y devuelve el estado actual y una función dispatch',
            'Un hook que reduce un array de hijos a un solo valor',
            'Un hook que sustituye a useEffect para la obtención de datos',
          ],
          it: [
            'Un hook che collega un componente a uno store Redux',
            'Un hook che gestisce transizioni di state complesse tramite una funzione reducer e restituisce lo state corrente e una funzione dispatch',
            'Un hook che riduce un array di figli a un singolo valore',
            'Un hook che sostituisce useEffect per il data fetching',
          ],
        }),
        JSON.stringify({
          fr: "`useReducer(reducer, initialState)` est une alternative à `useState` pour des logiques d'état complexes. Il prend une fonction `reducer(state, action) => newState` et un état initial, et renvoie `[state, dispatch]`. Le fait de dispatcher des actions rend les transitions d'état explicites et testables et rapproche le pattern Redux au niveau du composant.",
          de: '`useReducer(reducer, initialState)` ist eine Alternative zu `useState` für komplexe State-Logik. Es nimmt eine Funktion `reducer(state, action) => newState` und einen Initialzustand und gibt `[state, dispatch]` zurück. Durch das Dispatchen von Actions werden Zustandsübergänge explizit und testbar und ähneln dem Redux-Pattern auf Komponentenebene.',
          es: '`useReducer(reducer, initialState)` es una alternativa a `useState` para lógica de estado compleja. Recibe una función `reducer(state, action) => newState` y un estado inicial, y devuelve `[state, dispatch]`. Despachar acciones hace que las transiciones de estado sean explícitas y fáciles de probar, acercándose al patrón de Redux a nivel de componente.',
          it: "`useReducer(reducer, initialState)` è un'alternativa a `useState` per logiche di state complesse. Accetta una funzione `reducer(state, action) => newState` e uno state iniziale e restituisce `[state, dispatch]`. Fare dispatch di azioni rende le transizioni di stato esplicite e testabili e riprende il pattern Redux a livello di componente.",
        }),
        'c3100001-0000-4000-8001-000000000017',
      ]
    );

    // Question 18
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que la Context API en React ?",
          de: 'Was ist die Context API in React?',
          es: '¿Qué es la Context API en React?',
          it: "Che cos'è la Context API in React?",
        }),
        JSON.stringify({
          fr: [
            'Une API pour faire des requêtes HTTP sans prop drilling',
            "Un mécanisme intégré pour partager des données dans l'arbre de composants sans passer des props à chaque niveau",
            'Un store global similaire à Redux mais intégré à React',
            'Une API pour persister le state des composants dans localStorage',
          ],
          de: [
            'Eine API zum Ausführen von HTTP-Anfragen ohne Prop Drilling',
            'Ein eingebauter Mechanismus, um Daten im Komponentenbaum zu teilen, ohne Props auf jeder Ebene weiterzureichen',
            'Ein globaler Store ähnlich Redux, aber in React eingebaut',
            'Eine API, um Component State in localStorage zu persistieren',
          ],
          es: [
            'Una API para hacer solicitudes HTTP sin prop drilling',
            'Un mecanismo incorporado para compartir datos en el árbol de componentes sin pasar props en cada nivel',
            'Un store global similar a Redux pero integrado en React',
            'Una API para persistir el estado de los componentes en localStorage',
          ],
          it: [
            'Una API per effettuare richieste HTTP senza prop drilling',
            "Un meccanismo integrato per condividere dati nell'albero dei componenti senza passare props a ogni livello",
            'Uno store globale simile a Redux ma integrato in React',
            "Un'API per persistere lo state dei componenti in localStorage",
          ],
        }),
        JSON.stringify({
          fr: "La Context API (`React.createContext`, `Provider`, `useContext`) permet de partager des valeurs (thème, utilisateur, locale, etc.) dans l'arbre de composants sans passer des props manuellement à chaque niveau intermédiaire. Un `Provider` englobe un sous-arbre et fournit une valeur ; tout descendant qui appelle `useContext` reçoit cette valeur.",
          de: 'Die Context API (`React.createContext`, `Provider`, `useContext`) ermöglicht es, Werte (Theme, Benutzer, Locale usw.) im Komponentenbaum zu teilen, ohne Props durch jede Zwischenebene zu reichen. Ein `Provider` umschließt einen Teilbaum und stellt einen Wert bereit; jeder Nachkomme, der `useContext` verwendet, erhält diesen Wert.',
          es: 'La Context API (`React.createContext`, `Provider`, `useContext`) permite compartir valores (tema, usuario, idioma, etc.) a lo largo del árbol de componentes sin pasar props manualmente por cada nivel intermedio. Un `Provider` envuelve un subárbol y proporciona un valor; cualquier descendiente que use `useContext` recibe ese valor.',
          it: "La Context API (`React.createContext`, `Provider`, `useContext`) consente di condividere valori (tema, utente, lingua, ecc.) nell'albero dei componenti senza passare props manualmente a ogni livello intermedio. Un `Provider` avvolge un sottoalbero e fornisce un valore; qualsiasi discendente che usa `useContext` riceve quel valore.",
        }),
        'c3100001-0000-4000-8001-000000000018',
      ]
    );

    // Question 19
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `React.memo` ?",
          de: 'Was ist `React.memo`?',
          es: '¿Qué es `React.memo`?',
          it: "Che cos'è `React.memo`?",
        }),
        JSON.stringify({
          fr: [
            'Un hook qui mémorise une valeur calculée dans un composant',
            "Un higher-order component qui empêche un composant fonctionnel de se re-render si ses props n'ont pas changé",
            'Un remplacement de `useMemo` dans React 19',
            "Un moyen de mettre en cache le résultat d'un appel d'API",
          ],
          de: [
            'Ein Hook, der einen berechneten Wert in einer Komponente memoisiert',
            'Ein Higher-Order-Component, der verhindert, dass eine Funktionskomponente neu rendert, wenn sich ihre Props nicht geändert haben',
            'Ein Ersatz für `useMemo` in React 19',
            'Eine Möglichkeit, das Ergebnis eines API-Calls zu cachen',
          ],
          es: [
            'Un hook que memoriza un valor calculado dentro de un componente',
            'Un higher-order component que evita que un componente funcional se vuelva a renderizar cuando sus props no han cambiado',
            'Un reemplazo de `useMemo` en React 19',
            'Una forma de almacenar en caché el resultado de una llamada a una API',
          ],
          it: [
            'Un hook che memoizza un valore calcolato dentro di un componente',
            'Un higher-order component che impedisce a un componente funzionale di essere renderizzato di nuovo quando le sue props non sono cambiate',
            'Un sostituto di `useMemo` in React 19',
            'Un modo per mettere in cache il risultato di una chiamata API',
          ],
        }),
        JSON.stringify({
          fr: "`React.memo(Component)` enveloppe un composant fonctionnel et effectue une comparaison superficielle de ses props. Si les props sont identiques au rendu précédent, React saute le re-rendu et réutilise le résultat précédent. C'est une optimisation de performance à utiliser pour les composants qui se re-rendent souvent mais produisent la même sortie pour les mêmes props.",
          de: '`React.memo(Component)` umschließt eine Funktionskomponente und führt einen flachen Vergleich der Props durch. Sind die Props identisch mit dem vorherigen Render, überspringt React das erneute Rendern und verwendet das letzte Ergebnis. Dies ist eine Performance-Optimierung für Komponenten, die häufig neu gerendert werden, aber für die gleichen Props dieselbe Ausgabe liefern.',
          es: '`React.memo(Component)` envuelve un componente funcional y realiza una comparación superficial de sus props. Si las props son iguales a las del renderizado anterior, React omite el nuevo renderizado y reutiliza el resultado previo. Es una optimización de rendimiento para componentes que se renderizan con frecuencia pero producen la misma salida para las mismas props.',
          it: "`React.memo(Component)` avvolge un componente funzionale ed esegue un confronto superficiale delle sue props. Se le props sono uguali al render precedente, React salta il nuovo render e riutilizza il risultato precedente. È un'ottimizzazione delle prestazioni per componenti che fanno molti render ma producono lo stesso output per le stesse props.",
        }),
        'c3100001-0000-4000-8001-000000000019',
      ]
    );

    // Question 20
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un composant contrôlé en React ?",
          de: 'Was ist eine kontrollierte Komponente in React?',
          es: '¿Qué es un componente controlado en React?',
          it: "Che cos'è un componente controllato in React?",
        }),
        JSON.stringify({
          fr: [
            'Un composant géré par un parent via des refs',
            "Un élément de formulaire dont la valeur est pilotée par le state React et ne change qu'au travers du setter de state",
            'Un composant qui ne peut pas être démonté',
            'Un composant enveloppé avec React.memo',
          ],
          de: [
            'Eine Komponente, die von einem Elternteil über Refs gesteuert wird',
            'Ein Formularelement, dessen Wert von React State gesteuert wird und nur über eine State-Setter-Funktion aktualisiert wird',
            'Eine Komponente, die nicht unmountet werden kann',
            'Eine Komponente, die mit React.memo umhüllt ist',
          ],
          es: [
            'Un componente gestionado por un padre mediante refs',
            'Un elemento de formulario cuyo valor está controlado por el estado de React y solo se actualiza mediante un setter de estado',
            'Un componente que no se puede desmontar',
            'Un componente envuelto con React.memo',
          ],
          it: [
            'Un componente gestito da un genitore tramite ref',
            'Un elemento di form il cui valore è guidato dallo state di React e viene aggiornato solo tramite una funzione setter',
            'Un componente che non può essere smontato',
            'Un componente avvolto con React.memo',
          ],
        }),
        JSON.stringify({
          fr: "Un composant contrôlé est un élément de formulaire (input, textarea, select) dont la valeur affichée est toujours synchronisée avec le state React. Le state est l'unique source de vérité : chaque frappe appelle `setState`, et la prop `value` de l'élément reflète le state courant. Cela rend la lecture, la validation et la transformation des saisies utilisateur beaucoup plus simples.",
          de: 'Eine kontrollierte Komponente ist ein Formularelement (input, textarea, select), dessen angezeigter Wert immer mit dem React State synchron ist. Der State ist die einzige Quelle der Wahrheit: Jeder Tastendruck ruft `setState` auf und die `value`-Prop des Elements spiegelt den aktuellen State wider. Dadurch werden Lesen, Validieren und Transformieren von Benutzereingaben deutlich vereinfacht.',
          es: 'Un componente controlado es un elemento de formulario (input, textarea, select) cuyo valor mostrado está siempre sincronizado con el estado de React. El estado es la única fuente de verdad: cada pulsación de tecla llama a `setState` y la prop `value` del elemento refleja el estado actual. Esto hace que leer, validar y transformar la entrada del usuario sea mucho más sencillo.',
          it: "Un componente controllato è un elemento di form (input, textarea, select) il cui valore visualizzato è sempre sincronizzato con lo state di React. Lo state è l'unica fonte di verità: ogni battuta di tasto chiama `setState` e la prop `value` dell'elemento riflette lo state corrente. Questo rende molto più semplice leggere, validare e trasformare l'input dell'utente.",
        }),
        'c3100001-0000-4000-8001-000000000020',
      ]
    );

    // Question 21
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un composant non contrôlé en React ?",
          de: 'Was ist eine unkontrollierte Komponente in React?',
          es: '¿Qué es un componente no controlado en React?',
          it: "Che cos'è un componente non controllato in React?",
        }),
        JSON.stringify({
          fr: [
            "Un composant dont le state n'est pas accessible par son parent",
            "Un élément de formulaire qui gère sa propre valeur en interne via le DOM, accessible au moyen d'une ref",
            'Un composant sans props ni state',
            "Un composant rendu en dehors de l'arbre React",
          ],
          de: [
            'Eine Komponente, deren State für den Elternteil nicht zugänglich ist',
            'Ein Formularelement, das seinen Wert intern im DOM verwaltet und über eine Ref ausgelesen wird',
            'Eine Komponente ohne Props oder State',
            'Eine Komponente, die außerhalb des React-Baums gerendert wird',
          ],
          es: [
            'Un componente cuyo estado no es accesible por su padre',
            'Un elemento de formulario que gestiona su propio valor internamente en el DOM y se accede mediante una ref',
            'Un componente sin props ni estado',
            'Un componente renderizado fuera del árbol de React',
          ],
          it: [
            'Un componente il cui state non è accessibile dal genitore',
            'Un elemento di form che gestisce internamente il proprio valore nel DOM e a cui si accede tramite una ref',
            'Un componente senza props né state',
            "Un componente renderizzato al di fuori dell'albero React",
          ],
        }),
        JSON.stringify({
          fr: "Un composant non contrôlé stocke la valeur de son formulaire directement dans le DOM plutôt que dans le state React. Vous lisez la valeur via `useRef` et la propriété `.current.value`, généralement lors de la soumission. C'est plus simple pour des formulaires très basiques ou pour intégrer du code non-React, mais plus difficile à valider ou transformer à la volée.",
          de: 'Eine unkontrollierte Komponente speichert ihren Formularwert im DOM statt im React State. Sie lesen den Wert über `useRef` und die Eigenschaft `.current.value` aus, typischerweise beim Submit. Das ist für sehr einfache Formulare oder die Integration von Nicht-React-Code einfacher, aber schwieriger für Validierung oder Transformation in Echtzeit.',
          es: 'Un componente no controlado almacena el valor del formulario directamente en el DOM en lugar de en el estado de React. Se lee el valor mediante `useRef` y la propiedad `.current.value`, normalmente al enviar el formulario. Es más sencillo para formularios muy básicos o para integrar código que no es de React, pero resulta más difícil de validar o transformar en tiempo real.',
          it: 'Un componente non controllato memorizza il valore del form direttamente nel DOM invece che nello state di React. Si legge il valore tramite `useRef` e la proprietà `.current.value`, in genere al submit. È più semplice per form molto basilari o quando si integra codice non React, ma è più difficile da validare o trasformare al volo.',
        }),
        'c3100001-0000-4000-8001-000000000021',
      ]
    );

    // Question 22
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un Higher-Order Component (HOC) en React ?",
          de: 'Was ist ein Higher-Order Component (HOC) in React?',
          es: '¿Qué es un Higher-Order Component (HOC) en React?',
          it: "Che cos'è un Higher-Order Component (HOC) in React?",
        }),
        JSON.stringify({
          fr: [
            'Un composant qui apparaît en haut de la mise en page de la page',
            'Une fonction qui prend un composant et renvoie un nouveau composant avec un comportement supplémentaire',
            'Un composant de classe qui étend React.PureComponent',
            'Un composant qui affiche plusieurs enfants à la fois',
          ],
          de: [
            'Eine Komponente, die ganz oben im Seitenlayout erscheint',
            'Eine Funktion, die eine Komponente entgegennimmt und eine neue Komponente mit zusätzlichem Verhalten zurückgibt',
            'Eine Klassenkomponente, die React.PureComponent erweitert',
            'Eine Komponente, die mehrere Kinder gleichzeitig rendert',
          ],
          es: [
            'Un componente que aparece en la parte superior del diseño de la página',
            'Una función que recibe un componente y devuelve un nuevo componente con comportamiento añadido',
            'Un componente de clase que extiende React.PureComponent',
            'Un componente que renderiza varios hijos a la vez',
          ],
          it: [
            'Un componente che appare in cima al layout della pagina',
            'Una funzione che prende un componente e restituisce un nuovo componente con comportamento aggiuntivo',
            'Un componente a classe che estende React.PureComponent',
            'Un componente che renderizza più figli contemporaneamente',
          ],
        }),
        JSON.stringify({
          fr: "Un Higher-Order Component est un pattern où une fonction prend un composant et renvoie un composant amélioré. Les HOC ajoutent une logique réutilisable (authentification, logging, theming, etc.) sans modifier le composant d'origine. Des exemples classiques sont `withRouter` ou `connect`, même si ce pattern est aujourd'hui largement remplacé par les hooks.",
          de: 'Ein Higher-Order Component ist ein Pattern, bei dem eine Funktion eine Komponente entgegennimmt und eine neue, erweiterte Komponente zurückgibt. HOCs fügen wiederverwendbare Logik hinzu (z. B. Authentifizierung, Logging, Theming), ohne die ursprüngliche Komponente zu verändern. Beispiele sind `withRouter` oder `connect`, auch wenn dieses Pattern heute weitgehend durch Hooks ersetzt wurde.',
          es: 'Un Higher-Order Component es un patrón en el que una función recibe un componente y devuelve un nuevo componente mejorado. Los HOC añaden lógica reutilizable (auth, logging, theming, etc.) sin modificar el componente original. Ejemplos típicos son `withRouter` o `connect`, aunque este patrón ha sido reemplazado en gran medida por los hooks.',
          it: 'Un Higher-Order Component è un pattern in cui una funzione prende un componente e restituisce un nuovo componente potenziato. Gli HOC aggiungono logica riutilizzabile (auth, logging, theming, ecc.) senza modificare il componente originale. Esempi classici sono `withRouter` o `connect`, anche se oggi questo pattern è stato in gran parte sostituito dagli hook.',
        }),
        'c3100001-0000-4000-8001-000000000022',
      ]
    );

    // Question 23
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un Portal React ?",
          de: 'Was ist ein React Portal?',
          es: '¿Qué es un Portal de React?',
          it: "Che cos'è un React Portal?",
        }),
        JSON.stringify({
          fr: [
            "Un composant de routing qui téléporte l'utilisateur vers une autre page",
            'Un moyen de rendre un composant enfant dans un autre nœud DOM en dehors de la hiérarchie DOM de son parent',
            'Un contexte spécial qui partage des données entre onglets du navigateur',
            'Une API React pour diffuser des composants depuis le serveur',
          ],
          de: [
            'Eine Routing-Komponente, die den Benutzer auf eine andere Seite teleportiert',
            'Eine Möglichkeit, ein Kindelement in einen anderen DOM-Knoten außerhalb der DOM-Hierarchie des Elternteils zu rendern',
            'Ein spezieller Kontext, der Daten zwischen Browser-Tabs teilt',
            'Eine React-API zum Streamen von Komponenten vom Server',
          ],
          es: [
            'Un componente de enrutado que teletransporta al usuario a otra página',
            'Una forma de renderizar un componente hijo en un nodo del DOM distinto fuera de la jerarquía del DOM de su padre',
            'Un contexto especial que comparte datos entre pestañas del navegador',
            'Una API de React para hacer streaming de componentes desde el servidor',
          ],
          it: [
            "Un componente di routing che teletrasporta l'utente su un'altra pagina",
            'Un modo per renderizzare un componente figlio in un nodo DOM diverso al di fuori della gerarchia DOM del padre',
            'Un context speciale che condivide dati tra tab del browser',
            'Una API di React per fare streaming di componenti dal server',
          ],
        }),
        JSON.stringify({
          fr: "`ReactDOM.createPortal(children, domNode)` permet de rendre des enfants dans une autre partie du DOM (par exemple `document.body`) tout en les gardant dans l'arbre React pour la propagation des événements et le contexte. Les Portals sont essentiels pour les modales, tooltips et menus déroulants qui doivent s'afficher en dehors d'un conteneur avec `overflow: hidden` ou d'un contexte de `z-index`.",
          de: '`ReactDOM.createPortal(children, domNode)` rendert Kinder in einem anderen Teil des DOM (z. B. `document.body`), behält sie aber logisch im React-Baum für Event-Bubbling und Context. Portals sind wichtig für Modals, Tooltips und Dropdowns, die visuell aus einem Container mit `overflow: hidden` oder aus einem `z-index`-Stacking-Context ausbrechen müssen.',
          es: '`ReactDOM.createPortal(children, domNode)` renderiza hijos en otra parte del DOM (por ejemplo `document.body`) pero los mantiene lógicamente dentro del árbol de React para el bubbling de eventos y el contexto. Los Portals son esenciales para modales, tooltips y menús desplegables que deben salir visualmente de un contenedor con `overflow: hidden` o de un contexto de `z-index`.',
          it: "`ReactDOM.createPortal(children, domNode)` renderizza i figli in un'altra parte del DOM (ad esempio `document.body`) mantenendoli però logicamente all'interno dell'albero React per il bubbling degli eventi e il context. I Portals sono fondamentali per modali, tooltip e dropdown che devono uscire visivamente da un contenitore con `overflow: hidden` o da un contesto di `z-index`.",
        }),
        'c3100001-0000-4000-8001-000000000023',
      ]
    );

    // Question 24
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `React.Suspense` ?",
          de: 'Was ist `React.Suspense`?',
          es: '¿Qué es `React.Suspense`?',
          it: "Che cos'è `React.Suspense`?",
        }),
        JSON.stringify({
          fr: [
            "Un composant qui retarde tous les rendus jusqu'à ce que toutes les données soient récupérées globalement",
            "Un composant qui permet d'afficher une UI de repli pendant que ses enfants chargent (code splitting ou données asynchrones)",
            "Un hook qui met en pause l'exécution de useEffect jusqu'à ce qu'une condition soit remplie",
            'Un composant qui intercepte les erreurs de rendu dans son sous-arbre',
          ],
          de: [
            'Eine Komponente, die alle Renders verzögert, bis global alle Daten geladen sind',
            'Eine Komponente, mit der Sie ein Fallback-UI anzeigen können, während ihre Kinder laden (Code-Splitting oder asynchrone Daten)',
            'Ein Hook, der die Ausführung von useEffect pausiert, bis eine Bedingung erfüllt ist',
            'Eine Komponente, die Rendering-Fehler in ihrem Unterbaum abfängt',
          ],
          es: [
            'Un componente que retrasa todos los renderizados hasta que se han obtenido todos los datos globalmente',
            'Un componente que permite mostrar una UI de reserva mientras sus hijos se están cargando (code splitting o datos asíncronos)',
            'Un hook que pausa la ejecución de useEffect hasta que se cumpla una condición',
            'Un componente que captura errores de renderizado en su subárbol',
          ],
          it: [
            'Un componente che ritarda tutti i render finché tutti i dati non sono stati caricati globalmente',
            'Un componente che permette di mostrare una UI di fallback mentre i figli stanno caricando (code splitting o dati asincroni)',
            "Un hook che mette in pausa l'esecuzione di useEffect finché una condizione non è soddisfatta",
            'Un componente che intercetta gli errori di rendering nel proprio sotto-albero',
          ],
        }),
        JSON.stringify({
          fr: "`<Suspense fallback={<Spinner />}>` enveloppe des composants qui ne sont pas encore prêts à être rendus. Il affiche l'UI de `fallback` tant que les enfants suspendus ne sont pas prêts. Il fonctionne avec `React.lazy` pour le code splitting et avec des bibliothèques de fetch qui implémentent le protocole Suspense (comme Relay ou le hook `use()` de React 19).",
          de: '`<Suspense fallback={<Spinner />}>` umschließt Komponenten, die noch nicht bereit zum Rendern sind. Es zeigt das `fallback`-UI an, bis alle suspendierten Kinder bereit sind. Es funktioniert mit `React.lazy` für Code-Splitting und mit Daten-Fetching-Bibliotheken, die das Suspense-Protokoll unterstützen (z. B. Relay oder der Hook `use()` in React 19).',
          es: '`<Suspense fallback={<Spinner />}>` envuelve componentes que todavía no están listos para renderizarse. Muestra la UI definida en `fallback` mientras los hijos suspendidos se están cargando. Funciona con `React.lazy` para el code splitting y con librerías de datos que implementan el protocolo de Suspense (como Relay o el hook `use()` de React 19).',
          it: '`<Suspense fallback={<Spinner />}>` avvolge componenti che non sono ancora pronti per essere renderizzati. Mostra la UI di `fallback` finché i figli sospesi non sono pronti. Funziona con `React.lazy` per il code splitting e con librerie di data fetching che implementano il protocollo Suspense (come Relay o il hook `use()` di React 19).',
        }),
        'c3100001-0000-4000-8001-000000000024',
      ]
    );

    // Question 25
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `React.lazy` ?",
          de: 'Was ist `React.lazy`?',
          es: '¿Qué es `React.lazy`?',
          it: "Che cos'è `React.lazy`?",
        }),
        JSON.stringify({
          fr: [
            "Un hook qui diffère le rendu d'un composant jusqu'à ce qu'il soit visible dans le viewport",
            "Une fonction qui permet d'importer dynamiquement un composant afin qu'il ne soit chargé que lorsqu'il est rendu pour la première fois (code splitting)",
            'Un utilitaire qui regroupe des mises à jour de state paresseuses',
            "Un drapeau d'optimisation du compilateur React",
          ],
          de: [
            'Ein Hook, der das Rendern einer Komponente verzögert, bis sie im Viewport sichtbar ist',
            'Eine Funktion, mit der eine Komponente dynamisch importiert wird, sodass sie erst beim ersten Rendern geladen wird (Code-Splitting)',
            'Ein Hilfswerkzeug, das lazy State-Updates bündelt',
            'Ein Optimierungs-Flag des React-Compilers',
          ],
          es: [
            'Un hook que retrasa el renderizado de un componente hasta que sea visible en el viewport',
            'Una función que permite importar dinámicamente un componente para que solo se cargue cuando se renderiza por primera vez (code splitting)',
            'Una utilidad que agrupa actualizaciones de estado perezosas',
            'Un flag de optimización del compilador de React',
          ],
          it: [
            'Un hook che rimanda il render di un componente finché non è visibile nel viewport',
            'Una funzione che consente di importare dinamicamente un componente in modo che venga caricato solo quando è renderizzato per la prima volta (code splitting)',
            "Un'utility che raggruppa lazy state update",
            'Un flag di ottimizzazione del compilatore React',
          ],
        }),
        JSON.stringify({
          fr: "`React.lazy(() => import(\"./MyComponent\"))` crée un composant chargé dynamiquement au premier rendu. Le module qui contient le composant est extrait dans un bundle séparé téléchargé uniquement en cas de besoin. `React.lazy` doit toujours être utilisé à l'intérieur d'un `<Suspense>` qui fournit l'UI de chargement de secours.",
          de: '`React.lazy(() => import("./MyComponent"))` erstellt eine Komponente, die beim ersten Rendern dynamisch geladen wird. Das Modul mit der Komponente wird in ein separates Bundle aufgeteilt, das nur bei Bedarf heruntergeladen wird. `React.lazy` muss immer innerhalb einer `<Suspense>`-Boundary verwendet werden, die das Lade-Fallback bereitstellt.',
          es: '`React.lazy(() => import("./MyComponent"))` crea un componente que se carga dinámicamente en su primer renderizado. El módulo que contiene el componente se separa en un bundle independiente que solo se descarga cuando se necesita. `React.lazy` debe usarse siempre dentro de un `<Suspense>` que proporcione la UI de carga de reserva.',
          it: "`React.lazy(() => import(\"./MyComponent\"))` crea un componente che viene caricato dinamicamente al primo render. Il modulo che contiene il componente viene suddiviso in un bundle separato scaricato solo quando serve. `React.lazy` deve essere usato all'interno di un `<Suspense>` che fornisce una UI di caricamento di fallback.",
        }),
        'c3100001-0000-4000-8001-000000000025',
      ]
    );

    // Question 26
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que la reconciliation en React ?",
          de: 'Was ist Reconciliation in React?',
          es: '¿Qué es la reconciliation en React?',
          it: "Che cos'è la reconciliation in React?",
        }),
        JSON.stringify({
          fr: [
            'Le processus de fusion de deux stores Redux',
            "L'algorithme que React utilise pour comparer les anciens et les nouveaux arbres de virtual DOM afin de déterminer le minimum de changements à appliquer au DOM réel",
            'Un hook qui résout les conflits de mises à jour de state',
            "Le processus d'hydration d'une page rendue côté serveur",
          ],
          de: [
            'Der Prozess des Zusammenführens zweier Redux-Stores',
            'Der Algorithmus, mit dem React die alten und neuen Virtual-DOM-Bäume diffed, um das minimale Set an Änderungen am echten DOM zu bestimmen',
            'Ein Hook, der widersprüchliche State-Updates auflöst',
            'Der Prozess der Hydration einer serverseitig gerenderten Seite',
          ],
          es: [
            'El proceso de fusionar dos stores de Redux',
            'El algoritmo que usa React para comparar los árboles de virtual DOM anterior y nuevo para determinar el mínimo de cambios necesarios en el DOM real',
            'Un hook que reconcilia actualizaciones de estado en conflicto',
            'El proceso de hidratación de una página renderizada en el servidor',
          ],
          it: [
            'Il processo di unione di due store Redux',
            "L'algoritmo che React utilizza per confrontare i vecchi e i nuovi alberi di virtual DOM per determinare il numero minimo di modifiche da applicare al DOM reale",
            'Un hook che riconcilia aggiornamenti di state in conflitto',
            'Il processo di hydration di una pagina renderizzata sul server',
          ],
        }),
        JSON.stringify({
          fr: "La reconciliation est l'algorithme de diff de React. Quand les props ou le state changent, React génère un nouvel arbre de virtual DOM et le compare à l'ancien. Il suppose que des composants de types différents produisent des sous-arbres différents (qu'il remplace entièrement) et utilise la prop `key` pour faire correspondre les éléments d'une liste entre les rendus ; seules les différences calculées sont appliquées au DOM réel.",
          de: 'Reconciliation ist der Diff-Algorithmus von React. Wenn sich Props oder State ändern, erzeugt React einen neuen Virtual-DOM-Baum und vergleicht ihn mit dem alten. React nimmt an, dass Komponenten unterschiedlichen Typs unterschiedliche Bäume erzeugen (die komplett ersetzt werden) und verwendet die Prop `key`, um Listenelemente zwischen Renders zuzuordnen; nur die ermittelten Unterschiede werden auf den echten DOM angewendet.',
          es: 'La reconciliation es el algoritmo de diff de React. Cuando cambian las props o el estado, React genera un nuevo árbol de virtual DOM y lo compara con el anterior. Asume que los componentes de distinto tipo producen subárboles distintos (que se reemplazan por completo) y usa la prop `key` para hacer corresponder elementos de una lista entre renderizados; solo se aplican al DOM real las diferencias calculadas.',
          it: "La reconciliation è l'algoritmo di diff di React. Quando props o state cambiano, React genera un nuovo albero di virtual DOM e lo confronta con il precedente. Presume che componenti di tipo diverso producano sotto-alberi diversi (che vengono sostituiti completamente) e usa la prop `key` per abbinare gli elementi di una lista tra i render; solo le differenze calcolate vengono applicate al DOM reale.",
        }),
        'c3100001-0000-4000-8001-000000000026',
      ]
    );

    // Question 27
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que l'architecture React Fiber ?",
          de: 'Was ist die React Fiber-Architektur?',
          es: '¿Qué es la arquitectura React Fiber?',
          it: "Che cos'è l'architettura React Fiber?",
        }),
        JSON.stringify({
          fr: [
            'Une couche réseau pour les server components',
            'Une réécriture complète du moteur de reconciliation de React qui permet un rendu incrémental, la priorisation et la pause / reprise du travail',
            'Un moteur CSS-in-JS utilisé par React Native',
            'Une couche de data fetching introduite dans React 19',
          ],
          de: [
            'Eine Netzwerkschicht für Server Components',
            'Eine komplette Neuschreibung der Reconciliation-Engine von React, die inkrementelles Rendering, Priorisierung sowie Pausieren/Fortsetzen von Arbeit ermöglicht',
            'Eine CSS-in-JS-Engine, die von React Native verwendet wird',
            'Eine Data-Fetching-Schicht, die in React 19 eingeführt wurde',
          ],
          es: [
            'Una capa de red para server components',
            'Una reescritura completa del motor de reconciliation de React que permite renderizado incremental, priorización y pausar/reanudar trabajo',
            'Un motor de CSS-in-JS usado por React Native',
            'Una capa de obtención de datos introducida en React 19',
          ],
          it: [
            'Un livello di rete per i server components',
            'Una riscrittura completa del motore di reconciliation di React che abilita il rendering incrementale, la priorizzazione e la pausa/ripresa del lavoro',
            'Un motore CSS-in-JS usato da React Native',
            'Un livello di data fetching introdotto in React 19',
          ],
        }),
        JSON.stringify({
          fr: "React Fiber (introduit dans React 16) est une ré-implémentation du reconciler sous forme de liste chaînée d'unités de travail appelées \"fibers\". Contrairement à l'ancien reconciler synchrone basé sur la pile, Fiber peut mettre en pause, prioriser, réutiliser et annuler du travail de rendu. Cela permet les fonctionnalités de Concurrent React : time slicing, Suspense, transitions et mises à jour différées.",
          de: 'React Fiber (eingeführt in React 16) ist eine Neuimplementierung des Reconcilers als verkettete Liste von Arbeitseinheiten, den "Fibers". Im Gegensatz zum alten synchronen Stack-Reconciler kann Fiber Rendering-Arbeit pausieren, priorisieren, wiederverwenden und abbrechen. Dadurch werden Concurrent-React-Features wie Time Slicing, Suspense, Transitions und verzögerte Updates möglich.',
          es: 'React Fiber (introducido en React 16) es una reimplementación del reconciler como una lista enlazada de unidades de trabajo llamadas "fibers". A diferencia del antiguo reconciler síncrono basado en la pila, Fiber puede pausar, priorizar, reutilizar y abortar trabajo de renderizado. Esto habilita las características de React concurrente: time slicing, Suspense, transiciones y actualizaciones diferidas.',
          it: 'React Fiber (introdotto in React 16) è una reimplementazione del reconciler come lista collegata di unità di lavoro chiamate "fiber". A differenza del vecchio reconciler sincrono basato sullo stack, Fiber può mettere in pausa, dare priorità, riutilizzare e annullare il lavoro di rendering. Questo abilita le funzionalità di Concurrent React: time slicing, Suspense, transizioni e aggiornamenti differiti.',
        }),
        'c3100001-0000-4000-8001-000000000027',
      ]
    );

    // Question 28
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un Error Boundary en React ?",
          de: 'Was ist ein Error Boundary in React?',
          es: '¿Qué es un Error Boundary en React?',
          it: "Che cos'è un Error Boundary in React?",
        }),
        JSON.stringify({
          fr: [
            "Un bloc try/catch à l'intérieur de useEffect",
            "Un composant de classe qui intercepte les erreurs JavaScript dans son sous-arbre, les journalise et affiche une UI de repli au lieu de faire planter l'application",
            "Un higher-order component qui valide les prop types à l'exécution",
            "Un type utilitaire TypeScript pour affiner les valeurs d'erreur",
          ],
          de: [
            'Ein try/catch-Block innerhalb von useEffect',
            'Eine Klassenkomponente, die JavaScript-Fehler in ihrem Kindbaum abfängt, sie protokolliert und ein Fallback-UI anzeigt, anstatt die App abstürzen zu lassen',
            'Ein Higher-Order-Component, der PropTypes zur Laufzeit validiert',
            'Ein TypeScript-Utility-Typ zum Eingrenzen von Fehlerwerten',
          ],
          es: [
            'Un bloque try/catch dentro de useEffect',
            'Un componente de clase que captura errores de JavaScript en su subárbol, los registra y muestra una UI alternativa en lugar de que la aplicación se caiga',
            'Un higher-order component que valida los prop types en tiempo de ejecución',
            'Un tipo utilitario de TypeScript para acotar valores de error',
          ],
          it: [
            'Un blocco try/catch dentro di useEffect',
            "Un componente a classe che intercetta gli errori JavaScript nel proprio sotto-albero, li registra e mostra una UI di fallback invece di far crashare l'app",
            'Un higher-order component che valida i prop types a runtime',
            'Un tipo utility di TypeScript per restringere i valori di errore',
          ],
        }),
        JSON.stringify({
          fr: 'Un Error Boundary est un composant de classe qui implémente `static getDerivedStateFromError()` et/ou `componentDidCatch()`. Il intercepte les erreurs de rendu dans son sous-arbre (pendant le render, dans les méthodes de cycle de vie et dans les constructeurs) et peut afficher une UI de secours. Les composants fonctionnels ne peuvent pas être Error Boundaries ; des bibliothèques comme `react-error-boundary` fournissent une API basée sur des hooks par-dessus.',
          de: 'Ein Error Boundary ist eine Klassenkomponente, die `static getDerivedStateFromError()` und/oder `componentDidCatch()` implementiert. Sie fängt Rendering-Fehler in ihrem Unterbaum ab (während des Renderns, in Lifecycle-Methoden und Konstruktoren) und kann ein Fallback-UI anzeigen. Funktionskomponenten können selbst keine Error Boundaries sein; Bibliotheken wie `react-error-boundary` stellen eine hook-freundliche API darüber bereit.',
          es: 'Un Error Boundary es un componente de clase que implementa `static getDerivedStateFromError()` y/o `componentDidCatch()`. Captura errores de renderizado en su subárbol (durante el render, en métodos de ciclo de vida y en constructores) y puede mostrar una UI de reserva. Los componentes funcionales no pueden ser Error Boundaries; librerías como `react-error-boundary` ofrecen una API basada en hooks sobre este patrón.',
          it: "Un Error Boundary è un componente a classe che implementa `static getDerivedStateFromError()` e/o `componentDidCatch()`. Intercetta gli errori di rendering nel proprio sotto-albero (durante il render, nei metodi di lifecycle e nei costruttori) e può mostrare una UI di fallback. I componenti funzionali non possono essere Error Boundary; librerie come `react-error-boundary` forniscono un'API basata su hook sopra questo pattern.",
        }),
        'c3100001-0000-4000-8001-000000000028',
      ]
    );

    // Question 29
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useLayoutEffect` et en quoi diffère-t-il de `useEffect` ?",
          de: 'Was ist `useLayoutEffect` und wie unterscheidet es sich von `useEffect`?',
          es: '¿Qué es `useLayoutEffect` y en qué se diferencia de `useEffect`?',
          it: "Che cos'è `useLayoutEffect` e in cosa differisce da `useEffect`?",
        }),
        JSON.stringify({
          fr: [
            "useLayoutEffect s'exécute de façon asynchrone après le paint ; useEffect s'exécute de façon synchrone avant le paint",
            "useLayoutEffect s'exécute de façon synchrone après les mutations du DOM mais avant le paint du navigateur ; useEffect s'exécute de façon asynchrone après le paint",
            'Les deux sont identiques — useLayoutEffect est juste un alias de useEffect',
            "useLayoutEffect ne s'exécute qu'au montage ; useEffect s'exécute à chaque rendu",
          ],
          de: [
            'useLayoutEffect läuft asynchron nach dem Paint; useEffect läuft synchron vor dem Paint',
            'useLayoutEffect läuft synchron nach DOM-Mutationen, aber bevor der Browser zeichnet; useEffect läuft asynchron nach dem Paint',
            'Sie sind identisch – useLayoutEffect ist nur ein Alias für useEffect',
            'useLayoutEffect läuft nur beim Mount; useEffect läuft bei jedem Render',
          ],
          es: [
            'useLayoutEffect se ejecuta de forma asíncrona después del paint; useEffect se ejecuta de forma síncrona antes del paint',
            'useLayoutEffect se ejecuta de forma síncrona después de las mutaciones del DOM pero antes de que el navegador pinte; useEffect se ejecuta de forma asíncrona después del paint',
            'Son idénticos: useLayoutEffect es solo un alias de useEffect',
            'useLayoutEffect solo se ejecuta al montar; useEffect se ejecuta en cada renderizado',
          ],
          it: [
            'useLayoutEffect viene eseguito in modo asincrono dopo il paint; useEffect viene eseguito in modo sincrono prima del paint',
            'useLayoutEffect viene eseguito in modo sincrono dopo le mutazioni del DOM ma prima del paint del browser; useEffect viene eseguito in modo asincrono dopo il paint',
            'Sono identici: useLayoutEffect è solo un alias di useEffect',
            'useLayoutEffect viene eseguito solo al mount; useEffect viene eseguito a ogni render',
          ],
        }),
        JSON.stringify({
          fr: "`useLayoutEffect` est déclenché de manière synchrone après que React a appliqué les mutations du DOM mais avant que le navigateur n'effectue le premier paint. Il est adapté à la lecture de la mise en page (par exemple mesurer un élément) et aux modifications du DOM qui doivent être visibles sans effet de flash. Pour la plupart des effets (fetch de données, logs, abonnements), on privilégie `useEffect`, qui est asynchrone et ne bloque pas le navigateur.",
          de: '`useLayoutEffect` wird synchron ausgeführt, nachdem React die DOM-Mutationen angewendet hat, aber bevor der Browser zeichnet. Dadurch eignet es sich zum Auslesen des Layouts (z. B. Messen eines Elements) und für DOM-Änderungen, die ohne Flackern sichtbar sein müssen. Für die meisten Side Effects (Daten-Fetching, Logging, Subscriptions) sollte `useEffect` verwendet werden, da es asynchron ist und den Browser nicht blockiert.',
          es: '`useLayoutEffect` se ejecuta de forma síncrona después de que React aplica las mutaciones del DOM pero antes de que el navegador pinte. Es adecuado para leer el layout (por ejemplo medir un elemento) y hacer cambios en el DOM que deben ser visibles sin parpadeos. Para la mayoría de efectos (peticiones de datos, logs, suscripciones) se prefiere `useEffect`, que es asíncrono y no bloquea el navegador.',
          it: '`useLayoutEffect` viene eseguito in modo sincrono dopo che React ha applicato le mutazioni del DOM ma prima che il browser effettui il paint. È adatto per leggere il layout (ad esempio misurare un elemento) e per modifiche del DOM che devono essere visibili senza flicker. Per la maggior parte dei side effect (data fetching, logging, sottoscrizioni) è meglio usare `useEffect`, che è asincrono e non blocca il browser.',
        }),
        'c3100001-0000-4000-8001-000000000029',
      ]
    );

    // Question 30
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un custom hook en React ?",
          de: 'Was ist ein Custom Hook in React?',
          es: '¿Qué es un custom hook en React?',
          it: "Che cos'è un custom hook in React?",
        }),
        JSON.stringify({
          fr: [
            'Un composant qui expose une API publique via le DOM',
            "Une fonction JavaScript dont le nom commence par \"use\" et qui appelle d'autres hooks pour encapsuler et partager de la logique avec état entre composants",
            'Une méthode de classe qui surcharge un cycle de vie React',
            'Un hook fourni uniquement par des bibliothèques tierces',
          ],
          de: [
            'Eine Komponente, die über den DOM eine öffentliche API bereitstellt',
            'Eine JavaScript-Funktion, deren Name mit "use" beginnt und die andere Hooks aufruft, um zustandsbehaftete Logik zwischen Komponenten zu kapseln und zu teilen',
            'Eine Klassenmethode, die einen React-Lifecycle überschreibt',
            'Ein Hook, der nur von Drittanbieterbibliotheken bereitgestellt wird',
          ],
          es: [
            'Un componente que expone una API pública a través del DOM',
            'Una función de JavaScript cuyo nombre empieza por "use" y que llama a otros hooks para encapsular y compartir lógica con estado entre componentes',
            'Un método de clase que sobreescribe un ciclo de vida de React',
            'Un hook que solo proporcionan las librerías de terceros',
          ],
          it: [
            'Un componente che espone una API pubblica tramite il DOM',
            'Una funzione JavaScript il cui nome inizia con "use" e che chiama altri hook per incapsulare e condividere logica con stato tra i componenti',
            'Un metodo di classe che sovrascrive un lifecycle di React',
            'Un hook fornito solo da librerie di terze parti',
          ],
        }),
        JSON.stringify({
          fr: "Un custom hook est une fonction dont le nom commence par `use` et qui appelle en interne des hooks React (`useState`, `useEffect`, etc.) pour encapsuler une logique avec état réutilisable. Contrairement aux HOC ou aux render props, les custom hooks partagent la logique sans modifier l'arbre de composants. Des exemples typiques sont `useFetch`, `useDebounce` ou `useLocalStorage`, chaque composant qui les utilise ayant son propre state indépendant.",
          de: 'Ein Custom Hook ist eine Funktion, deren Name mit `use` beginnt und die intern React Hooks (`useState`, `useEffect` usw.) aufruft, um wiederverwendbare zustandsbehaftete Logik zu kapseln. Anders als HOCs oder Render Props teilen Custom Hooks Logik, ohne den Komponentenbaum zu verändern. Typische Beispiele sind `useFetch`, `useDebounce` oder `useLocalStorage`; jede Komponente, die den Hook verwendet, erhält dabei ihren eigenen, unabhängigen State.',
          es: 'Un custom hook es una función cuyo nombre empieza por `use` y que internamente llama a hooks de React (`useState`, `useEffect`, etc.) para encapsular lógica con estado reutilizable. A diferencia de los HOC o los render props, los custom hooks comparten lógica sin modificar el árbol de componentes. Ejemplos típicos son `useFetch`, `useDebounce` o `useLocalStorage`; cada componente que los usa tiene su propio estado independiente.',
          it: "Un custom hook è una funzione il cui nome inizia con `use` e che internamente chiama hook di React (`useState`, `useEffect`, ecc.) per incapsulare logica con stato riutilizzabile. A differenza degli HOC o dei render props, i custom hook condividono logica senza modificare l'albero dei componenti. Esempi tipici sono `useFetch`, `useDebounce` o `useLocalStorage`; ogni componente che li utilizza ha il proprio state indipendente.",
        }),
        'c3100001-0000-4000-8001-000000000030',
      ]
    );

    // Question 31
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que \"remonter l'état\" (lifting state up) en React ?",
          de: 'Was bedeutet "State nach oben heben" (lifting state up) in React?',
          es: '¿Qué significa "levantar el estado" (lifting state up) en React?',
          it: 'Che cosa significa "lifting state up" in React?',
        }),
        JSON.stringify({
          fr: [
            'Déplacer le state local dans un store Redux',
            "Déplacer le state vers l'ancêtre commun le plus proche des composants qui doivent le partager, afin qu'ils le reçoivent via les props",
            'Utiliser React.memo pour empêcher le state de se propager vers le bas',
            "Persister le state d'un composant dans sessionStorage au démontage",
          ],
          de: [
            'Den lokalen State in einen Redux-Store verschieben',
            'Den State zum nächstgelegenen gemeinsamen Vorfahren der Komponenten verschieben, die ihn teilen müssen, sodass sie ihn über Props erhalten',
            'React.memo verwenden, um zu verhindern, dass sich State nach unten ausbreitet',
            'Den State einer Komponente beim Unmount in sessionStorage persistieren',
          ],
          es: [
            'Mover el estado local a un store de Redux',
            'Mover el estado al ancestro común más cercano de los componentes que necesitan compartirlo, para que lo reciban mediante props',
            'Usar React.memo para evitar que el estado se propague hacia abajo',
            'Persistir el estado de un componente en sessionStorage al desmontarlo',
          ],
          it: [
            'Spostare lo state locale in uno store Redux',
            "Spostare lo state verso l'antenato comune più vicino dei componenti che devono condividerlo, così che lo ricevano tramite props",
            'Usare React.memo per impedire allo state di propagarsi verso il basso',
            "PERSISTERE lo state di un componente in sessionStorage al momento dell'unmount",
          ],
        }),
        JSON.stringify({
          fr: "\"Remonter l'état\" signifie déplacer un state partagé vers le plus proche ancêtre commun. Quand deux composants frères doivent partager ou synchroniser des données, on déplace ce state dans leur parent, qui le passe ensuite via des props et fournit des callbacks pour le mettre à jour. Cela maintient une seule source de vérité et évite les incohérences entre états dupliqués.",
          de: '"State nach oben heben" bedeutet, gemeinsam genutzten State in den nächstgelegenen gemeinsamen Vorfahren zu verschieben. Wenn zwei Geschwisterkomponenten Daten teilen oder synchronisieren müssen, wird der State in den Eltern verschoben, der ihn als Props nach unten reicht und Setter-Callbacks bereitstellt. So bleibt eine einzige Quelle der Wahrheit erhalten und Inkonsistenzen zwischen duplizierten States werden vermieden.',
          es: '"Levantar el estado" significa mover un estado compartido al ancestro común más cercano. Cuando dos componentes hermanos necesitan compartir o sincronizar datos, se mueve ese estado al padre, que lo pasa como props y expone callbacks para actualizarlo. Esto mantiene una única fuente de verdad y evita inconsistencias entre estados duplicados.',
          it: "Per \"lifting state up\" si intende spostare uno state condiviso verso l'antenato comune più vicino. Quando due componenti fratelli devono condividere o sincronizzare dei dati, si sposta lo state nel loro genitore, che lo passa come props e fornisce callback per aggiornarlo. In questo modo si mantiene un'unica fonte di verità e si evitano incoerenze tra stati duplicati.",
        }),
        'c3100001-0000-4000-8001-000000000031',
      ]
    );

    // Question 32
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `forwardRef` en React ?",
          de: 'Was ist `forwardRef` in React?',
          es: '¿Qué es `forwardRef` en React?',
          it: "Che cos'è `forwardRef` in React?",
        }),
        JSON.stringify({
          fr: [
            "Une fonction qui crée une ref et l'attache automatiquement au premier nœud DOM rendu",
            "Une fonction de higher-order qui permet à un composant d'exposer un nœud DOM ou un handle impératif à son parent via une ref",
            'Un hook qui surveille une ref et re-render quand elle change',
            'Un utilitaire qui copie les props vers un composant enfant',
          ],
          de: [
            'Eine Funktion, die eine Ref erstellt und sie automatisch an den ersten gerenderten DOM-Knoten anhängt',
            'Eine Higher-Order-Funktion, mit der eine Komponente einen DOM-Knoten oder ein imperatives Handle ihrem Elternteil über eine Ref zur Verfügung stellen kann',
            'Ein Hook, der eine Ref überwacht und bei Änderungen neu rendert',
            'Ein Utility, das Props an ein Kindelement kopiert',
          ],
          es: [
            'Una función que crea una ref y la adjunta automáticamente al primer nodo del DOM renderizado',
            'Una función de orden superior que permite que un componente exponga un nodo del DOM o un manejador imperativo a su padre mediante una ref',
            'Un hook que observa una ref y vuelve a renderizar cuando cambia',
            'Una utilidad que copia las props a un componente hijo',
          ],
          it: [
            'Una funzione che crea una ref e la collega automaticamente al primo nodo DOM renderizzato',
            'Una funzione higher-order che permette a un componente di esporre un nodo DOM o un handle imperativo al genitore tramite una ref',
            'Un hook che osserva una ref e fa un nuovo render quando cambia',
            "Un'utility che copia le props su un componente figlio",
          ],
        }),
        JSON.stringify({
          fr: "`React.forwardRef((props, ref) => <jsx ref={ref} />)` permet à un composant d'accepter une ref depuis son parent et de la transférer à un élément DOM ou à un composant enfant. Sans lui, les refs posées sur des composants personnalisés valent `null`. Dans React 19, les refs sont passées comme une prop classique et `forwardRef` n'est plus nécessaire dans de nombreux cas.",
          de: '`React.forwardRef((props, ref) => <jsx ref={ref} />)` ermöglicht es einer Komponente, eine Ref von ihrem Elternteil zu akzeptieren und sie an ein DOM-Element oder eine Kindkomponente weiterzuleiten. Ohne diese Funktion würden Refs auf benutzerdefinierten Komponenten `null` sein. In React 19 werden Refs als normale Prop weitergegeben und `forwardRef` ist in vielen Fällen nicht mehr nötig.',
          es: '`React.forwardRef((props, ref) => <jsx ref={ref} />)` permite que un componente acepte una ref de su padre y la reenvíe a un elemento del DOM o a un componente hijo. Sin esto, las refs en componentes personalizados apuntarían a `null`. En React 19 las refs se pasan como una prop normal y `forwardRef` deja de ser necesario en muchos casos.',
          it: '`React.forwardRef((props, ref) => <jsx ref={ref} />)` permette a un componente di accettare una ref dal genitore e inoltrarla a un elemento DOM o a un componente figlio. Senza di esso le ref applicate a componenti personalizzati risulterebbero `null`. In React 19 le ref vengono passate come una normale prop e `forwardRef` non è più necessario in molti casi.',
        }),
        'c3100001-0000-4000-8001-000000000032',
      ]
    );

    // Question 33
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useImperativeHandle` ?",
          de: 'Was ist `useImperativeHandle`?',
          es: '¿Qué es `useImperativeHandle`?',
          it: "Che cos'è `useImperativeHandle`?",
        }),
        JSON.stringify({
          fr: [
            "Un hook qui donne à un composant un contrôle impératif sur son propre cycle d'animation",
            'Un hook utilisé avec forwardRef pour personnaliser la valeur exposée sur une ref à un composant parent',
            'Un hook qui remplace useRef pour accéder aux nœuds DOM',
            "Un hook qui s'abonne à des APIs impératives du navigateur comme IntersectionObserver",
          ],
          de: [
            'Ein Hook, der einer Komponente imperativen Zugriff auf ihren Animationszyklus gibt',
            'Ein Hook, der zusammen mit forwardRef verwendet wird, um den über eine Ref an den Eltern weitergegebenen Wert anzupassen',
            'Ein Hook, der useRef zum Zugriff auf DOM-Knoten ersetzt',
            'Ein Hook, der sich auf imperative Browser-APIs wie IntersectionObserver abonniert',
          ],
          es: [
            'Un hook que da a un componente control imperativo sobre su propio ciclo de animación',
            'Un hook que se utiliza con forwardRef para personalizar el valor expuesto a través de una ref a un componente padre',
            'Un hook que sustituye a useRef para acceder a nodos del DOM',
            'Un hook que se suscribe a APIs imperativas del navegador como IntersectionObserver',
          ],
          it: [
            'Un hook che dà a un componente controllo imperativo sul proprio ciclo di animazione',
            'Un hook usato insieme a forwardRef per personalizzare il valore esposto tramite una ref a un componente genitore',
            'Un hook che sostituisce useRef per accedere ai nodi DOM',
            'Un hook che si sottoscrive ad API imperative del browser come IntersectionObserver',
          ],
        }),
        JSON.stringify({
          fr: "`useImperativeHandle(ref, () => ({ focus, reset }), deps)` permet de personnaliser la valeur vue par le parent via une ref transférée. Au lieu d'exposer tout le nœud DOM, on expose uniquement certaines méthodes choisies. C'est utile dans les bibliothèques de composants pour proposer une API impérative contrôlée (par exemple `inputRef.current.focus()`).",
          de: '`useImperativeHandle(ref, () => ({ focus, reset }), deps)` passt den Wert an, den der Elternteil über eine weitergeleitete Ref sieht. Statt den gesamten DOM-Knoten offenzulegen, werden nur explizit definierte Methoden bereitgestellt. Das ist nützlich in Komponentenbibliotheken, um eine kontrollierte imperative API anzubieten (z. B. `inputRef.current.focus()`).',
          es: '`useImperativeHandle(ref, () => ({ focus, reset }), deps)` personaliza el valor que ve el componente padre a través de una ref reenviada. En lugar de exponer todo el nodo del DOM, se exponen solo ciertos métodos. Es útil en librerías de componentes para ofrecer una API imperativa controlada (por ejemplo `inputRef.current.focus()`).',
          it: "`useImperativeHandle(ref, () => ({ focus, reset }), deps)` personalizza il valore visto dal genitore tramite una ref inoltrata. Invece di esporre l'intero nodo DOM si espongono solo metodi specifici. È utile nelle librerie di componenti per fornire una API imperativa controllata (ad esempio `inputRef.current.focus()`).",
        }),
        'c3100001-0000-4000-8001-000000000033',
      ]
    );

    // Question 34
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que l'hydration en React ?",
          de: 'Was ist Hydration in React?',
          es: '¿Qué es la hydration en React?',
          it: "Che cos'è l'hydration in React?",
        }),
        JSON.stringify({
          fr: [
            'Un procédé pour ajouter des animations "fluides" à une UI',
            "Le processus par lequel React attache des gestionnaires d'événements et rend interactive une page HTML rendue côté serveur sans régénérer le DOM",
            'Une manière de persister le state entre les navigations',
            "Une technique pour charger des données avant le montage d'un composant",
          ],
          de: [
            'Ein Verfahren, um wasserähnliche Animationen in eine UI einzubauen',
            'Der Prozess, bei dem React Event Listener an eine serverseitig gerenderte HTML-Seite anhängt und sie interaktiv macht, ohne den DOM neu zu erzeugen',
            'Eine Möglichkeit, State zwischen Seitenwechseln zu persistieren',
            'Eine Technik, um Daten vor dem Mounten einer Komponente zu laden',
          ],
          es: [
            'Un proceso para añadir animaciones "acuosas" a una UI',
            'El proceso por el cual React adjunta listeners de eventos y hace interactiva una página HTML renderizada en el servidor sin volver a generar el DOM',
            'Una forma de persistir el estado entre navegaciones',
            'Una técnica para cargar datos antes de montar un componente',
          ],
          it: [
            'Un processo per aggiungere animazioni "fluide" a una UI',
            'Il processo con cui React aggancia i listener degli eventi e rende interattiva una pagina HTML renderizzata sul server senza rigenerare il DOM',
            'Un modo per persistere lo state tra le navigazioni',
            'Una tecnica per caricare dati prima del mount di un componente',
          ],
        }),
        JSON.stringify({
          fr: "L'hydration est le processus côté client qui suit le SSR (Server-Side Rendering). Le serveur envoie un HTML déjà rendu pour un affichage initial rapide, puis React \"hydrate\" ce DOM en le parcourant et en attachant les gestionnaires d'événements, ce qui rend la page interactive sans recréer les nœuds. React 18 a introduit l'hydration partielle et sélective pour le SSR en streaming.",
          de: 'Hydration ist der clientseitige Prozess, der auf SSR (Server-Side Rendering) folgt. Der Server sendet vollständig gerendertes HTML für ein schnelles Initial-Rendering und React "hydratisiert" diesen DOM anschließend, indem es ihn durchläuft und Event Listener anhängt, ohne die Knoten neu zu erzeugen. React 18 hat selektive/partielle Hydration für Streaming-SSR eingeführt.',
          es: 'La hydration es el proceso en el cliente que sigue al SSR (Server-Side Rendering). El servidor envía HTML ya renderizado para un primer pintado rápido y luego React "hidrata" ese DOM recorriéndolo y adjuntando los listeners de eventos, lo que hace la página interactiva sin recrear los nodos. React 18 introdujo hydration parcial y selectiva para el SSR en streaming.',
          it: "L'hydration è il processo lato client che segue il SSR (Server-Side Rendering). Il server invia HTML già renderizzato per avere un primo paint veloce e poi React \"idrata\" quel DOM attraversandolo e agganciando i listener degli eventi, rendendo la pagina interattiva senza ricreare i nodi. React 18 ha introdotto l'hydration parziale e selettiva per lo SSR in streaming.",
        }),
        'c3100001-0000-4000-8001-000000000034',
      ]
    );

    // Question 35
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useTransition` en React ?",
          de: 'Was ist `useTransition` in React?',
          es: '¿Qué es `useTransition` en React?',
          it: "Che cos'è `useTransition` in React?",
        }),
        JSON.stringify({
          fr: [
            'Un hook qui anime les changements de state avec des transitions CSS',
            "Un hook qui permet de marquer une mise à jour de state comme non urgente afin qu'elle puisse être interrompue par des mises à jour plus prioritaires",
            'Un hook qui enveloppe les fonctions async pour afficher automatiquement un spinner de chargement',
            'Un hook de React Router pour les transitions de route',
          ],
          de: [
            'Ein Hook, der State-Änderungen mit CSS-Transitions animiert',
            'Ein Hook, mit dem Sie ein State-Update als nicht dringlich markieren können, sodass es von höher priorisierten Updates unterbrochen werden kann',
            'Ein Hook, der asynchrone Funktionen umhüllt und automatisch einen Ladespinner anzeigt',
            'Ein Hook aus React Router für Routenübergänge',
          ],
          es: [
            'Un hook que anima cambios de estado usando transiciones CSS',
            'Un hook que permite marcar una actualización de estado como no urgente para que pueda ser interrumpida por actualizaciones de mayor prioridad',
            'Un hook que envuelve funciones asíncronas para mostrar automáticamente un spinner de carga',
            'Un hook de React Router para transiciones de ruta',
          ],
          it: [
            'Un hook che anima i cambiamenti di state con transizioni CSS',
            'Un hook che consente di contrassegnare un aggiornamento di state come non urgente in modo che possa essere interrotto da aggiornamenti con priorità più alta',
            'Un hook che incapsula funzioni async per mostrare automaticamente uno spinner di caricamento',
            'Un hook di React Router per le transizioni di route',
          ],
        }),
        JSON.stringify({
          fr: "`const [isPending, startTransition] = useTransition()` permet de marquer une mise à jour de state comme transition \"non urgente\". React peut l'interrompre pour traiter des mises à jour plus importantes (comme la saisie au clavier), tandis que `isPending` vaut `true` pendant la transition. Cela garde l'UI réactive pendant des re-rendus coûteux (par exemple filtrer une grande liste) sans afficher un écran de chargement complet.",
          de: '`const [isPending, startTransition] = useTransition()` markiert ein State-Update als nicht dringliche "Transition". React kann dieses Update unterbrechen, um wichtigere Updates (wie Tippen) zu verarbeiten, während `isPending` während der Transition auf `true` steht. Dadurch bleibt die UI auch bei teuren Re-Renders (z. B. Filtern einer großen Liste) reaktionsfähig, ohne einen vollständigen Ladezustand zu zeigen.',
          es: '`const [isPending, startTransition] = useTransition()` marca una actualización de estado como una transición "no urgente". React puede interrumpirla para procesar actualizaciones más prioritarias (como la escritura), mientras que `isPending` es `true` mientras la transición está en curso. Esto mantiene la UI reactiva durante re-renderizados costosos (por ejemplo al filtrar una lista grande) sin mostrar una pantalla de carga completa.',
          it: '`const [isPending, startTransition] = useTransition()` consente di marcare un aggiornamento di state come transizione "non urgente". React può interromperla per gestire aggiornamenti più prioritari (come la digitazione), mentre `isPending` rimane `true` finché la transizione è in corso. Questo mantiene la UI reattiva durante render costosi (ad esempio filtrare una lista grande) senza mostrare uno stato di caricamento totale.',
        }),
        'c3100001-0000-4000-8001-000000000035',
      ]
    );

    // Question 36
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useDeferredValue` en React ?",
          de: 'Was ist `useDeferredValue` in React?',
          es: '¿Qué es `useDeferredValue` en React?',
          it: "Che cos'è `useDeferredValue` in React?",
        }),
        JSON.stringify({
          fr: [
            'Un hook qui applique un debounce à une valeur de state avec un timeout fixe',
            "Un hook qui permet de différer la mise à jour d'une partie de l'UI en fournissant une copie en retard d'une valeur que React mettra à jour quand le navigateur sera idle",
            'Un hook qui renvoie une Promise pour une valeur asynchrone',
            "Un hook qui mémorise une valeur jusqu'à l'arrivée d'une réponse du serveur",
          ],
          de: [
            "Ein Hook, der einen State-Wert mit einem festen Timeout debounce't",
            'Ein Hook, der es ermöglicht, die Aktualisierung eines UI-Teils zu verzögern, indem eine verzögerte Kopie eines Werts bereitgestellt wird, die React aktualisiert, wenn der Browser Leerlauf hat',
            'Ein Hook, der ein Promise für einen asynchronen Wert zurückgibt',
            'Ein Hook, der einen Wert memoisiert, bis eine Serverantwort eintrifft',
          ],
          es: [
            'Un hook que aplica debounce a un valor de estado con un tiempo fijo',
            'Un hook que permite diferir la actualización de una parte de la UI proporcionando una copia retrasada de un valor que React actualizará cuando el navegador esté libre',
            'Un hook que devuelve una Promise para un valor asíncrono',
            'Un hook que memorizap una valor hasta que llega una respuesta del servidor',
          ],
          it: [
            'Un hook che applica un debounce a un valore di state con un timeout fisso',
            "Un hook che permette di rinviare l'aggiornamento di una parte della UI fornendo una copia ritardata di un valore che React aggiornerà quando il browser è idle",
            'Un hook che restituisce una Promise per un valore asincrono',
            'Un hook che memoizza un valore finché non arriva una risposta dal server',
          ],
        }),
        JSON.stringify({
          fr: "`useDeferredValue(value)` renvoie une copie différée de la valeur qui reste en retard par rapport à la valeur la plus récente pendant le rendu concurrent. React rend d'abord avec l'ancienne valeur (pour garder l'UI fluide), puis re-render avec la nouvelle valeur quand les ressources le permettent. C'est utile pour différer des rendus enfants coûteux (par exemple une liste filtrée) tout en gardant un champ de recherche réactif.",
          de: '`useDeferredValue(value)` gibt eine "verzögerte" Kopie des Werts zurück, die dem neuesten Wert während des Concurrent Renderings hinterherhinkt. React rendert zunächst mit dem alten Wert (um die UI responsiv zu halten) und rendert dann mit dem neuen Wert, wenn Kapazität vorhanden ist. Das ist nützlich, um teure Kind-Renderings (z. B. eine gefilterte Ergebnisliste) zu verzögern, während ein Eingabefeld reaktiv bleibt.',
          es: '`useDeferredValue(value)` devuelve una copia "diferida" del valor que va por detrás del valor más reciente durante el renderizado concurrente. React renderiza primero con el valor antiguo (para mantener la UI fluida) y después vuelve a renderizar con el valor nuevo cuando el navegador tiene capacidad. Es útil para diferir renders costosos de hijos (por ejemplo una lista filtrada) mientras un campo de búsqueda se mantiene reactivo.',
          it: '`useDeferredValue(value)` restituisce una copia "differita" del valore che rimane indietro rispetto al valore più recente durante il rendering concorrente. React renderizza inizialmente con il valore vecchio (per mantenere la UI reattiva), poi effettua un nuovo render con il valore nuovo quando il browser ha capacità. È utile per rinviare render costosi dei figli (ad esempio una lista filtrata) mantenendo reattivo un campo di ricerca.',
        }),
        'c3100001-0000-4000-8001-000000000036',
      ]
    );

    // Question 37
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useActionState` dans React 19 ?",
          de: 'Was ist `useActionState` in React 19?',
          es: '¿Qué es `useActionState` en React 19?',
          it: "Che cos'è `useActionState` in React 19?",
        }),
        JSON.stringify({
          fr: [
            'Un hook pour gérer les action creators Redux',
            "Un hook qui gère un state dérivé d'une fonction d'action de formulaire, en prenant en charge automatiquement l'état pending et le résultat renvoyé",
            'Un hook qui suit quelles actions Redux ont été dispatchées',
            'Un hook qui remplace useReducer avec un state côté serveur',
          ],
          de: [
            'Ein Hook zur Verwaltung von Redux-Action-Creators',
            'Ein Hook, der State aus einer Form-Action-Funktion verwaltet und Pending-State sowie das zurückgegebene Ergebnis automatisch handhabt',
            'Ein Hook, der verfolgt, welche Redux-Actions dispatcht wurden',
            'Ein Hook, der useReducer mit serverseitigem State ersetzt',
          ],
          es: [
            'Un hook para gestionar los action creators de Redux',
            'Un hook que gestiona estado derivado de una función de acción de formulario, manejando automáticamente el estado pending y el resultado devuelto',
            'Un hook que rastrea qué acciones de Redux se han despachado',
            'Un hook que sustituye a useReducer con estado en el servidor',
          ],
          it: [
            'Un hook per gestire gli action creator di Redux',
            'Un hook che gestisce lo state derivato da una funzione di action di un form gestendo automaticamente lo stato pending e il risultato restituito',
            'Un hook che tiene traccia di quali azioni Redux sono state dispatchate',
            'Un hook che sostituisce useReducer con uno state lato server',
          ],
        }),
        JSON.stringify({
          fr: "`useActionState(actionFn, initialState)` (React 19) prend une fonction d'action asynchrone et renvoie `[state, dispatch, isPending]`. Quand `dispatch` est appelée (par exemple depuis un formulaire), React exécute `actionFn(prevState, formData)`, passe `isPending` à `true` pendant l'exécution puis met `state` à jour avec la valeur résolue. Cela remplace l'ancien `useFormState` de react-dom.",
          de: '`useActionState(actionFn, initialState)` (React 19) nimmt eine asynchrone Action-Funktion und gibt `[state, dispatch, isPending]` zurück. Wenn `dispatch` aufgerufen wird (z. B. aus einem Formular), führt React `actionFn(prevState, formData)` aus, setzt `isPending` währenddessen auf `true` und aktualisiert `state` mit dem aufgelösten Wert. Es ersetzt das frühere `useFormState` aus react-dom.',
          es: '`useActionState(actionFn, initialState)` (React 19) recibe una función de acción asíncrona y devuelve `[state, dispatch, isPending]`. Cuando se llama a `dispatch` (por ejemplo desde un formulario), React ejecuta `actionFn(prevState, formData)`, pone `isPending` a `true` mientras se ejecuta y actualiza `state` con el valor resuelto. Sustituye al antiguo `useFormState` de react-dom.',
          it: "`useActionState(actionFn, initialState)` (React 19) accetta una funzione di action asincrona e restituisce `[state, dispatch, isPending]`. Quando si chiama `dispatch` (ad esempio da un form), React esegue `actionFn(prevState, formData)`, imposta `isPending` a `true` durante l'esecuzione e aggiorna `state` con il valore risolto. Sostituisce il vecchio `useFormState` di react-dom.",
        }),
        'c3100001-0000-4000-8001-000000000037',
      ]
    );

    // Question 38
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useOptimistic` dans React 19 ?",
          de: 'Was ist `useOptimistic` in React 19?',
          es: '¿Qué es `useOptimistic` en React 19?',
          it: "Che cos'è `useOptimistic` in React 19?",
        }),
        JSON.stringify({
          fr: [
            'Un hook qui relance automatiquement les requêtes réseau échouées',
            "Un hook qui permet d'afficher immédiatement un state optimiste (prédit) pendant qu'une opération async est en cours, puis de revenir en arrière si elle échoue",
            "Un hook qui prefetch des données avant le montage d'un composant",
            'Un hook qui remplace useMemo avec une optimisation automatique',
          ],
          de: [
            'Ein Hook, der fehlgeschlagene Netzwerkrequests automatisch wiederholt',
            'Ein Hook, der es ermöglicht, während einer laufenden asynchronen Operation sofort einen optimistischen (prognostizierten) State anzuzeigen und bei Fehler zurückzurollen',
            'Ein Hook, der Daten vor dem Mounten einer Komponente prefetcht',
            'Ein Hook, der `useMemo` mit automatischer Optimierung ersetzt',
          ],
          es: [
            'Un hook que reintenta automáticamente las peticiones de red fallidas',
            'Un hook que permite mostrar inmediatamente un estado optimista (previsto) mientras una operación asíncrona está en curso y revertirlo si falla',
            'Un hook que hace prefetch de datos antes de montar un componente',
            'Un hook que sustituye a useMemo con optimización automática',
          ],
          it: [
            'Un hook che ritenta automaticamente le richieste di rete fallite',
            "Un hook che permette di mostrare immediatamente uno state ottimistico (previsto) mentre un'operazione async è in corso e poi tornare indietro se fallisce",
            'Un hook che esegue il prefetch dei dati prima del mount di un componente',
            "Un hook che sostituisce useMemo con un'ottimizzazione automatica",
          ],
        }),
        JSON.stringify({
          fr: "`useOptimistic(state, updateFn)` renvoie `[optimisticState, addOptimistic]`. Quand `addOptimistic(optimisticValue)` est appelé, `optimisticState` reflète immédiatement la mise à jour via `updateFn`, comme si l'action côté serveur avait déjà réussi. Une fois l'opération réelle terminée, `optimisticState` revient au `state` réel, ce qui permet un retour visuel instantané pour des mutations serveur (likes, envoi de messages, etc.).",
          de: '`useOptimistic(state, updateFn)` gibt `[optimisticState, addOptimistic]` zurück. Wenn `addOptimistic(optimisticValue)` aufgerufen wird, spiegelt `optimisticState` die Aktualisierung sofort über `updateFn` wider, als ob die Serveraktion bereits erfolgreich gewesen wäre. Sobald die eigentliche Operation abgeschlossen ist, wird `optimisticState` wieder auf den echten `state` zurückgesetzt, was ein direktes, angenehmes Feedback für Servermutationen (Likes, Senden) ermöglicht.',
          es: '`useOptimistic(state, updateFn)` devuelve `[optimisticState, addOptimistic]`. Cuando se llama a `addOptimistic(optimisticValue)`, `optimisticState` refleja inmediatamente la actualización mediante `updateFn`, como si la acción en el servidor ya hubiera tenido éxito. Una vez que la operación real termina, `optimisticState` vuelve al `state` real, ofreciendo un feedback instantáneo y fluido para mutaciones en el servidor (likes, envíos, etc.).',
          it: "`useOptimistic(state, updateFn)` restituisce `[optimisticState, addOptimistic]`. Quando si chiama `addOptimistic(optimisticValue)`, `optimisticState` riflette immediatamente l'aggiornamento tramite `updateFn`, come se l'operazione sul server fosse già andata a buon fine. Una volta terminata l'operazione reale, `optimisticState` torna allo `state` effettivo, offrendo un feedback immediato e gradevole per le mutazioni lato server (like, invio di messaggi, ecc.).",
        }),
        'c3100001-0000-4000-8001-000000000038',
      ]
    );

    // Question 39
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le hook `use()` dans React 19 ?",
          de: 'Was ist der Hook `use()` in React 19?',
          es: '¿Qué es el hook `use()` en React 19?',
          it: "Che cos'è il hook `use()` in React 19?",
        }),
        JSON.stringify({
          fr: [
            'Un remplacement de tous les hooks existants',
            "Un hook qui peut lire la valeur d'une Promise ou d'un Context dans un composant et s'intègre avec Suspense et les Error Boundaries",
            'Un hook qui crée un nouveau contexte React',
            'Un hook qui charge paresseusement un module à la demande',
          ],
          de: [
            'Ein Ersatz für alle vorhandenen Hooks',
            'Ein Hook, der den Wert eines Promise oder Contexts in einer Komponente lesen kann und mit Suspense und Error Boundaries integriert ist',
            'Ein Hook, der einen neuen React Context erstellt',
            'Ein Hook, der ein Modul bei Bedarf lazy lädt',
          ],
          es: [
            'Un reemplazo de todos los hooks existentes',
            'Un hook que puede leer el valor de una Promise o un Context dentro de un componente e integrarse con Suspense y los Error Boundaries',
            'Un hook que crea un nuevo contexto de React',
            'Un hook que carga de forma perezosa un módulo bajo demanda',
          ],
          it: [
            'Un sostituto di tutti gli hook esistenti',
            'Un hook che può leggere il valore di una Promise o di un Context dentro un componente e si integra con Suspense ed Error Boundary',
            'Un hook che crea un nuovo context React',
            'Un hook che carica in modo lazy un modulo su richiesta',
          ],
        }),
        JSON.stringify({
          fr: "`use(resource)` est un nouveau hook de React 19 qui peut déballer une Promise ou lire un Context n'importe où dans un composant — y compris dans des boucles et des conditions (contrairement aux autres hooks). Si la Promise est en attente, le composant se met en attente (Suspense) et affiche le fallback du `<Suspense>` le plus proche ; si elle est rejetée, le plus proche Error Boundary l'intercepte.",
          de: '`use(resource)` ist ein neuer Hook in React 19, der ein Promise oder einen Context überall in einer Komponente auslesen kann – auch in Schleifen und Bedingungen (anders als andere Hooks). Ist das Promise noch pending, wird die Komponente suspendiert und zeigt das Fallback des nächsten `<Suspense>` an; schlägt es fehl, fängt der nächstgelegene Error Boundary den Fehler ab.',
          es: '`use(resource)` es un nuevo hook de React 19 que puede desempaquetar una Promise o leer un Context en cualquier parte de un componente, incluso dentro de bucles y condicionales (a diferencia de otros hooks). Si la Promise está pendiente, el componente se suspende (Suspense) y muestra el fallback del `<Suspense>` más cercano; si se rechaza, el Error Boundary más próximo la captura.',
          it: "`use(resource)` è un nuovo hook di React 19 che può leggere una Promise o un Context ovunque all'interno di un componente — anche dentro cicli e condizioni (a differenza degli altri hook). Se la Promise è pending, il componente viene sospeso (Suspense) e mostra il fallback del `<Suspense>` più vicino; se viene rifiutata, l'Error Boundary più vicino intercetta l'errore.",
        }),
        'c3100001-0000-4000-8001-000000000039',
      ]
    );

    // Question 40
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que `useFormStatus` dans React 19 ?",
          de: 'Was ist `useFormStatus` in React 19?',
          es: '¿Qué es `useFormStatus` en React 19?',
          it: "Che cos'è `useFormStatus` in React 19?",
        }),
        JSON.stringify({
          fr: [
            "Un hook qui valide tous les champs d'un formulaire et renvoie les erreurs",
            "Un hook utilisé à l'intérieur d'un composant enfant de formulaire pour lire l'état pending et les données de la soumission du formulaire parent",
            'Un hook qui suit combien de fois un formulaire a été soumis',
            'Un hook qui remplace les inputs contrôlés par un state de formulaire automatique',
          ],
          de: [
            'Ein Hook, der alle Formularfelder validiert und Fehler zurückgibt',
            'Ein Hook, der innerhalb einer Form-Kindkomponente verwendet wird, um den Pending-Status und die Daten der Formularübermittlung des Elternteils zu lesen',
            'Ein Hook, der verfolgt, wie oft ein Formular abgeschickt wurde',
            'Ein Hook, der kontrollierte Inputs durch automatischen Formularstate ersetzt',
          ],
          es: [
            'Un hook que valida todos los campos de un formulario y devuelve errores',
            'Un hook que se usa dentro de un componente hijo de un formulario para leer el estado pending y los datos del envío del formulario padre',
            'Un hook que rastrea cuántas veces se ha enviado un formulario',
            'Un hook que sustituye los inputs controlados por un estado de formulario automático',
          ],
          it: [
            'Un hook che valida tutti i campi di un form e restituisce gli errori',
            'Un hook usato dentro un componente figlio di un form per leggere lo stato pending e i dati della submission del form genitore',
            'Un hook che tiene traccia di quante volte è stato inviato un form',
            'Un hook che sostituisce gli input controllati con uno state di form automatico',
          ],
        }),
        JSON.stringify({
          fr: "`useFormStatus()` (de `react-dom`) doit être appelé dans un composant rendu à l'intérieur d'un `<form>`. Il renvoie `{ pending, data, method, action }` qui reflètent l'état courant de la soumission du formulaire parent. La propriété `pending` vaut `true` pendant l'exécution de l'action de formulaire, ce qui permet à des composants enfants comme les boutons de submit de réagir à l'état du formulaire sans prop drilling.",
          de: '`useFormStatus()` (aus `react-dom`) muss in einer Komponente aufgerufen werden, die innerhalb eines `<form>` gerendert wird. Es liefert `{ pending, data, method, action }`, die den aktuellen Übermittlungszustand des Elternformulars widerspiegeln. Die Eigenschaft `pending` ist `true`, solange die Form-Action ausgeführt wird, wodurch Kindkomponenten wie Submit-Buttons auf den Formularstatus reagieren können, ohne dass Props durchgereicht werden müssen.',
          es: '`useFormStatus()` (de `react-dom`) debe llamarse dentro de un componente renderizado dentro de un `<form>`. Devuelve `{ pending, data, method, action }`, que reflejan el estado actual del envío del formulario padre. La propiedad `pending` es `true` mientras la acción del formulario se está ejecutando, lo que permite que componentes hijos como los botones de envío reaccionen al estado del formulario sin prop drilling.',
          it: "`useFormStatus()` (da `react-dom`) deve essere chiamato all'interno di un componente renderizzato dentro un `<form>`. Restituisce `{ pending, data, method, action }`, che riflettono lo stato corrente della submission del form genitore. La proprietà `pending` è `true` mentre l'azione del form è in esecuzione, permettendo a componenti figli come i pulsanti di submit di reagire allo stato del form senza prop drilling.",
        }),
        'c3100001-0000-4000-8001-000000000040',
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE qcm_module SET label = label - 'fr' - 'de' - 'es' - 'it', description = description - 'fr' - 'de' - 'es' - 'it' WHERE id = $1`,
      ['c3100000-0000-4000-8000-000000000001']
    );
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' - 'fr' - 'de' - 'es' - 'it')), '{choices}', (data->'choices' - 'fr' - 'de' - 'es' - 'it')), '{explanation}', (data->'explanation' - 'fr' - 'de' - 'es' - 'it')) WHERE moduleId = $1`,
      ['c3100000-0000-4000-8000-000000000001']
    );
  }
}
