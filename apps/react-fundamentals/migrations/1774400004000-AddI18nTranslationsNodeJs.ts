import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddI18nTranslationsNodeJs1774400004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE qcm_module SET label = label || $1::jsonb, description = description || $2::jsonb WHERE id = $3`,
      [
        JSON.stringify({
          fr: 'Définitions Node.js',
          de: 'Node.js-Grundbegriffe',
          es: 'Definiciones de Node.js',
          it: 'Definizioni Node.js',
        }),
        JSON.stringify({
          fr: "Vocabulaire de base de Node.js : ce qu'est Node.js, les phases de l'event loop, V8, libuv, l'I/O non bloquante, CommonJS vs ESM, npm, package.json, l'objet process, Buffer, les streams, EventEmitter, child_process, cluster, worker_threads, fs, http, path, les variables d'environnement, les modèles asynchrones, la gestion des erreurs et les objets globaux.",
          de: "Zentrales Node.js-Vokabular: Was ist Node.js, die Phasen der Event Loop, V8, libuv, nicht-blockierendes I/O, CommonJS vs ESM, npm, package.json, das process-Objekt, Buffer, Streams, EventEmitter, child_process, cluster, worker_threads, fs, http, path, Umgebungsvariablen, asynchrone Muster, Fehlerbehandlung und globale Objekte.",
          es: "Vocabulario básico de Node.js: qué es Node.js, las fases del event loop, V8, libuv, E/S no bloqueante, CommonJS vs ESM, npm, package.json, el objeto process, Buffer, los streams, EventEmitter, child_process, cluster, worker_threads, fs, http, path, variables de entorno, patrones asíncronos, manejo de errores y objetos globales.",
          it: "Vocabolario base di Node.js: che cos'è Node.js, le fasi dell'event loop, V8, libuv, I/O non bloccante, CommonJS vs ESM, npm, package.json, l'oggetto process, Buffer, gli streams, EventEmitter, child_process, cluster, worker_threads, fs, http, path, variabili d'ambiente, pattern asincroni, gestione degli errori e oggetti globali.",
        }),
        'd4100000-0000-4000-8000-000000000001',
      ]
    );

    // d4100001-0000-4000-8001-000000000001 - What is Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que Node.js ?",
          de: 'Was ist Node.js?',
          es: '¿Qué es Node.js?',
          it: "Che cos'è Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Un framework JavaScript côté navigateur pour construire des SPA',
            "Un runtime JavaScript construit sur le moteur V8 de Chrome qui exécute du code JavaScript en dehors du navigateur et permet le développement côté serveur",
            'Un langage compilé qui se transpile en C++ pour les performances',
            'Un bundler JavaScript similaire à Webpack',
          ],
          de: [
            'Ein browserbasiertes JavaScript-Framework zum Erstellen von SPAs',
            'Eine JavaScript-Laufzeitumgebung auf Basis der V8-Engine von Chrome, die JavaScript außerhalb des Browsers ausführt und serverseitige Entwicklung ermöglicht',
            'Eine kompilierte Sprache, die zur Performance in C++ transpiliert wird',
            'Ein JavaScript-Bundler ähnlich wie Webpack',
          ],
          es: [
            'Un framework de JavaScript del lado del navegador para construir SPA',
            'Un runtime de JavaScript construido sobre el motor V8 de Chrome que ejecuta código JavaScript fuera del navegador y permite el desarrollo del lado del servidor',
            'Un lenguaje compilado que se transpila a C++ para ganar rendimiento',
            'Un bundler de JavaScript similar a Webpack',
          ],
          it: [
            'Un framework JavaScript lato browser per creare SPA',
            "Un runtime JavaScript basato sul motore V8 di Chrome che esegue JavaScript fuori dal browser e abilita lo sviluppo lato server",
            'Un linguaggio compilato che viene traspilato in C++ per le prestazioni',
            'Un bundler JavaScript simile a Webpack',
          ],
        }),
        JSON.stringify({
          fr: "Node.js est un environnement d'exécution JavaScript multiplateforme et open source basé sur le moteur V8 de Chrome. Il permet d'exécuter JavaScript côté serveur pour construire des applications réseau scalables. Son architecture événementielle et non bloquante le rend particulièrement adapté aux applications I/O intensives comme les API, les applications temps réel et les CLI.",
          de: 'Node.js ist eine plattformübergreifende, Open-Source-JavaScript-Laufzeitumgebung auf Basis der V8-Engine von Chrome. Sie ermöglicht es, JavaScript auf dem Server auszuführen und skalierbare Netzwerkanwendungen zu bauen. Durch das ereignisgesteuerte, nicht-blockierende Modell eignet sich Node.js besonders für I/O-lastige Anwendungen wie APIs, Echtzeitanwendungen und CLIs.',
          es: 'Node.js es un entorno de ejecución de JavaScript multiplataforma y de código abierto basado en el motor V8 de Chrome. Permite ejecutar JavaScript en el servidor para construir aplicaciones de red escalables. Gracias a su arquitectura dirigida por eventos y no bloqueante, es muy adecuado para aplicaciones intensivas en E/S como APIs, aplicaciones en tiempo real y herramientas de línea de comandos.',
          it: "Node.js è un ambiente di esecuzione JavaScript multipiattaforma e open source basato sul motore V8 di Chrome. Permette di eseguire JavaScript sul server per creare applicazioni di rete scalabili. Grazie all'architettura event-driven e non bloccante è ideale per applicazioni I/O intensive come API, app real-time e strumenti da riga di comando.",
        }),
        'd4100001-0000-4000-8001-000000000001',
      ]
    );

    // d4100001-0000-4000-8001-000000000002 - What is the V8 engine in the context of Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le moteur V8 dans le contexte de Node.js ?",
          de: 'Was ist die V8-Engine im Kontext von Node.js?',
          es: '¿Qué es el motor V8 en el contexto de Node.js?',
          it: "Che cos'è il motore V8 nel contesto di Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Une version 8 de la bibliothèque standard Node.js',
            'Un moteur JavaScript et WebAssembly open source et haute performance écrit en C++ qui compile le JavaScript en code machine natif',
            'Un ramasse-miettes (garbage collector) spécifique aux serveurs Node.js',
            "La huitième version du résolveur de dépendances de npm",
          ],
          de: [
            'Ein Versionssprung (Version 8) der Node.js-Standardbibliothek',
            'Eine Open-Source-JavaScript- und WebAssembly-Engine mit hoher Performance in C++, die JavaScript in nativen Maschinencode kompiliert',
            'Ein Garbage Collector, der speziell für Node.js-Server entwickelt wurde',
            'Die achte Version des npm-Dependency-Resolvers',
          ],
          es: [
            'Una versión 8 de la biblioteca estándar de Node.js',
            'Un motor de JavaScript y WebAssembly de código abierto y alto rendimiento escrito en C++ que compila JavaScript a código máquina nativo',
            'Un recolector de basura específico para servidores Node.js',
            'La octava versión del resolvedor de dependencias de npm',
          ],
          it: [
            'Una versione 8 della libreria standard di Node.js',
            'Un motore JavaScript e WebAssembly open source ad alte prestazioni scritto in C++ che compila il JavaScript in codice macchina nativo',
            'Un garbage collector specifico per i server Node.js',
            'L’ottava versione del resolver delle dipendenze di npm',
          ],
        }),
        JSON.stringify({
          fr: "V8 est le moteur JavaScript open source de Google, également utilisé dans Chrome. Il compile le JavaScript en code machine natif grâce à la compilation JIT (Just-In-Time) plutôt que de l'interpréter. Node.js s'appuie sur V8 pour exécuter le JavaScript côté serveur et bénéficier de ses optimisations de performance, de son ramasse-miettes et de son support des fonctionnalités du langage.",
          de: 'V8 ist die Open-Source-JavaScript-Engine von Google, die auch in Chrome verwendet wird. Sie kompiliert JavaScript per Just-In-Time-Compiler direkt in nativen Maschinencode, anstatt es nur zu interpretieren. Node.js nutzt V8, um JavaScript auf dem Server auszuführen und von Performance-Optimierungen, Garbage Collection und moderner Sprachunterstützung zu profitieren.',
          es: 'V8 es el motor de JavaScript de código abierto de Google, usado también en Chrome. Compila JavaScript a código máquina nativo mediante compilación JIT (Just-In-Time) en lugar de solo interpretarlo. Node.js se apoya en V8 para ejecutar JavaScript en el servidor y aprovechar sus optimizaciones de rendimiento, recolección de basura y compatibilidad con las características del lenguaje.',
          it: "V8 è il motore JavaScript open source di Google, utilizzato anche in Chrome. Compila il JavaScript in codice macchina nativo tramite compilazione JIT (Just-In-Time) invece di interpretarlo. Node.js usa V8 per eseguire JavaScript sul server e sfruttare le sue ottimizzazioni di performance, il garbage collector e il supporto alle funzionalità del linguaggio.",
        }),
        'd4100001-0000-4000-8001-000000000002',
      ]
    );

    // d4100001-0000-4000-8001-000000000003 - What is non-blocking I/O in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que l'I/O non bloquante dans Node.js ?",
          de: 'Was ist nicht-blockierendes I/O in Node.js?',
          es: '¿Qué es la E/S no bloqueante en Node.js?',
          it: "Che cos'è l'I/O non bloccante in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Des opérations d’I/O qui s’exécutent toujours sur un autre cœur CPU',
            "Un modèle où les opérations d'I/O (lecture de fichiers, requêtes réseau) sont lancées puis l'exécution continue immédiatement sans attendre le résultat, qui sera récupéré via des callbacks ou des promesses",
            'Une façon d’empêcher JavaScript de faire toute opération d’I/O',
            "De l'I/O bloquante optimisée avec du cache",
          ],
          de: [
            'I/O-Operationen, die immer auf einem separaten CPU-Kern laufen',
            'Ein Modell, bei dem I/O-Operationen (Dateizugriffe, Netzwerk-Requests) gestartet werden und der Code sofort weiterläuft, während das Ergebnis später über Callbacks/Promises geliefert wird',
            'Eine Möglichkeit, JavaScript jede I/O-Operation zu verbieten',
            'Blockierendes I/O, das mit Caching optimiert wurde',
          ],
          es: [
            'Operaciones de E/S que siempre se ejecutan en otro núcleo de CPU',
            'Un modelo en el que las operaciones de E/S (lectura de archivos, peticiones de red) se inician y la ejecución continúa inmediatamente sin esperar a que terminen, usando callbacks o promesas para obtener el resultado',
            'Una forma de impedir que JavaScript realice cualquier operación de E/S',
            'E/S bloqueante optimizada mediante caché',
          ],
          it: [
            'Operazioni di I/O che girano sempre su un altro core della CPU',
            "Un modello in cui le operazioni di I/O (lettura file, richieste di rete) vengono avviate e l'esecuzione prosegue subito senza aspettare il risultato, che verrà recuperato tramite callback o promise",
            'Un modo per impedire a JavaScript di eseguire qualsiasi operazione di I/O',
            'I/O bloccante ottimizzato con la cache',
          ],
        }),
        JSON.stringify({
          fr: "Avec l'I/O non bloquante, lorsque Node.js démarre une opération d'entrée/sortie, il enregistre un callback et passe immédiatement à la suite du code. Quand l'I/O se termine, le callback est placé dans la file d'attente d'événements. Cela permet à un seul thread de gérer efficacement des milliers d'opérations d'I/O concurrentes sans avoir un thread par connexion.",
          de: 'Bei nicht-blockierendem I/O startet Node.js eine Ein-/Ausgabeoperation, registriert einen Callback und fährt sofort mit dem nächsten Code fort. Sobald die I/O-Operation fertig ist, wird der Callback in die Event-Queue gestellt. So kann ein einzelner Thread Tausende gleichzeitiger I/O-Operationen effizient handhaben, ohne für jede Verbindung einen eigenen Thread zu benötigen.',
          es: 'Con la E/S no bloqueante, cuando Node.js inicia una operación de entrada/salida registra un callback y continúa inmediatamente con el siguiente código. Cuando la E/S termina, el callback se añade a la cola de eventos. Esto permite que un único hilo maneje de forma eficiente miles de operaciones de E/S concurrentes sin necesitar un hilo por conexión.',
          it: "Con l'I/O non bloccante, quando Node.js avvia un'operazione di input/output registra una callback e passa subito alla riga di codice successiva. Quando l'I/O termina, la callback viene inserita nella coda degli eventi. In questo modo un singolo thread può gestire in modo efficiente migliaia di operazioni di I/O concorrenti senza dover creare un thread per ogni connessione.",
        }),
        'd4100001-0000-4000-8001-000000000003',
      ]
    );

    // d4100001-0000-4000-8001-000000000004 - What is npm?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que npm ?",
          de: 'Was ist npm?',
          es: '¿Qué es npm?',
          it: "Che cos'è npm?",
        }),
        JSON.stringify({
          fr: [
            'Node Performance Monitor — un outil de profilage pour les apps Node.js',
            'Node Package Manager — le gestionnaire de paquets par défaut de Node.js utilisé pour installer, publier et gérer les paquets JavaScript',
            'Un outil de build Node.js similaire à Webpack',
            'Le process manager Node.js utilisé en production',
          ],
          de: [
            'Node Performance Monitor — ein Tool zum Profiling von Node.js-Apps',
            'Node Package Manager — der Standard-Paketmanager für Node.js zum Installieren, Veröffentlichen und Verwalten von JavaScript-Paketen',
            'Ein Node.js-Build-Tool ähnlich wie Webpack',
            'Der Node.js-Process-Manager für Produktionsumgebungen',
          ],
          es: [
            'Node Performance Monitor: una herramienta de perfilado para aplicaciones Node.js',
            'Node Package Manager: el gestor de paquetes por defecto de Node.js para instalar, publicar y gestionar paquetes de JavaScript',
            'Una herramienta de build de Node.js similar a Webpack',
            'El gestor de procesos de Node.js utilizado en producción',
          ],
          it: [
            'Node Performance Monitor: uno strumento di profiling per applicazioni Node.js',
            'Node Package Manager: il package manager predefinito di Node.js usato per installare, pubblicare e gestire i pacchetti JavaScript',
            'Uno strumento di build per Node.js simile a Webpack',
            'Il process manager di Node.js usato in produzione',
          ],
        }),
        JSON.stringify({
          fr: "npm (Node Package Manager) est le plus grand registre logiciel au monde et le gestionnaire de paquets par défaut livré avec Node.js. Il permet d'installer des dépendances tierces (`npm install`), d'exécuter des scripts (`npm run`), de publier des paquets et de gérer les dépendances d'un projet via `package.json`. Des alternatives populaires sont `yarn` et `pnpm`.",
          de: 'npm (Node Package Manager) ist das größte Software-Registry der Welt und der standardmäßige Paketmanager, der mit Node.js ausgeliefert wird. Er erlaubt es, Drittanbieter-Pakete zu installieren (`npm install`), Skripte auszuführen (`npm run`), Pakete zu veröffentlichen und Abhängigkeiten über `package.json` zu verwalten. Beliebte Alternativen sind `yarn` und `pnpm`.',
          es: 'npm (Node Package Manager) es el mayor registro de software del mundo y el gestor de paquetes por defecto que viene con Node.js. Permite instalar dependencias de terceros (`npm install`), ejecutar scripts (`npm run`), publicar paquetes y gestionar dependencias de un proyecto a través de `package.json`. Como alternativas destacan `yarn` y `pnpm`.',
          it: 'npm (Node Package Manager) è il più grande registro software al mondo e il package manager predefinito fornito con Node.js. Permette di installare dipendenze di terze parti (`npm install`), eseguire script (`npm run`), pubblicare pacchetti e gestire le dipendenze del progetto tramite `package.json`. Alternative diffuse sono `yarn` e `pnpm`.',
        }),
        'd4100001-0000-4000-8001-000000000004',
      ]
    );

    // d4100001-0000-4000-8001-000000000005 - What is package.json?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que package.json ?",
          de: 'Was ist die Datei package.json?',
          es: '¿Qué es package.json?',
          it: "Che cos'è package.json?",
        }),
        JSON.stringify({
          fr: [
            'Un fichier JSON généré à l’exécution contenant les métadonnées de la requête courante',
            "Un fichier manifeste pour un projet Node.js qui décrit les métadonnées du projet, ses dépendances, ses scripts et sa configuration",
            'Un fichier de configuration TypeScript pour le compilateur',
            'Un lockfile qui fige les versions exactes des dépendances',
          ],
          de: [
            'Eine JSON-Datei, die zur Laufzeit erzeugt wird und Metadaten der aktuellen Anfrage enthält',
            'Eine Manifestdatei für ein Node.js-Projekt, die Metadaten, Abhängigkeiten, Scripts und Konfiguration beschreibt',
            'Eine TypeScript-Konfigurationsdatei für den Compiler',
            'Eine Lockfile-Datei, die exakte Abhängigkeitsversionen fixiert',
          ],
          es: [
            'Un archivo JSON generado en tiempo de ejecución con los metadatos de la petición actual',
            'Un archivo manifiesto de un proyecto de Node.js que describe los metadatos del proyecto, sus dependencias, scripts y configuración',
            'Un archivo de configuración de TypeScript para el compilador',
            'Un archivo de bloqueo (lockfile) que fija las versiones exactas de las dependencias',
          ],
          it: [
            'Un file JSON generato a runtime che contiene i metadati della richiesta corrente',
            "Un file di manifest di un progetto Node.js che descrive i metadati del progetto, le dipendenze, gli script e la configurazione",
            'Un file di configurazione di TypeScript per il compilatore',
            'Un lockfile che blocca le versioni esatte delle dipendenze',
          ],
        }),
        JSON.stringify({
          fr: "`package.json` est le fichier manifeste situé à la racine d'un projet Node.js. Les champs clés incluent : `name`, `version`, `scripts` (commandes exécutables), `dependencies` (dépendances runtime), `devDependencies` (dépendances de build/test), `main`/`module`/`exports` (points d'entrée) et `type` (\"module\" pour ESM ou \"commonjs\"). C'est la configuration centrale pour npm.",
          de: 'Die Datei `package.json` ist das Manifest im Wurzelverzeichnis eines Node.js-Projekts. Wichtige Felder sind: `name`, `version`, `scripts` (ausführbare Befehle), `dependencies` (Laufzeitabhängigkeiten), `devDependencies` (Build-/Test-Abhängigkeiten), `main`/`module`/`exports` (Entry Points) und `type` ("module" für ESM oder "commonjs"). Sie ist die zentrale Konfigurationsquelle für npm.',
          es: '`package.json` es el archivo manifiesto en la raíz de un proyecto de Node.js. Los campos clave incluyen: `name`, `version`, `scripts` (comandos ejecutables), `dependencies` (dependencias de ejecución), `devDependencies` (dependencias de build/test), `main`/`module`/`exports` (puntos de entrada) y `type` ("module" para ESM o "commonjs"). Es la configuración central para npm.',
          it: '`package.json` è il file di manifest nella root di un progetto Node.js. I campi principali sono: `name`, `version`, `scripts` (comandi eseguibili), `dependencies` (dipendenze runtime), `devDependencies` (dipendenze di build/test), `main`/`module`/`exports` (entry point) e `type` ("module" per ESM o "commonjs"). È la configurazione centrale usata da npm.',
        }),
        'd4100001-0000-4000-8001-000000000005',
      ]
    );

    // d4100001-0000-4000-8001-000000000006 - What is the process object in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que l'objet process dans Node.js ?",
          de: 'Was ist das process-Objekt in Node.js?',
          es: '¿Qué es el objeto process en Node.js?',
          it: "Che cos'è l'oggetto process in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Une API du navigateur polyfillée par Node.js',
            'Un objet global qui fournit des informations et un contrôle sur le process Node.js courant, y compris les variables d’environnement, les arguments de ligne de commande, les codes de sortie et les flux standards',
            'Un process enfant créé avec child_process.fork()',
            'Un type TypeScript qui représente les process du système d’exploitation',
          ],
          de: [
            'Eine Browser-API, die von Node.js polyfilled wird',
            'Ein globales Objekt, das Informationen und Kontrolle über den aktuellen Node.js-Prozess bietet, einschließlich Umgebungsvariablen, CLI-Argumenten, Exit-Codes und Standard-Streams',
            'Ein Child-Prozess, der mit child_process.fork() erzeugt wird',
            'Ein TypeScript-Typ zur Repräsentation von Betriebssystemprozessen',
          ],
          es: [
            'Una API del navegador que Node.js polyfillea',
            'Un objeto global que proporciona información y control sobre el proceso actual de Node.js, incluyendo variables de entorno, argumentos de la CLI, códigos de salida y flujos estándar',
            'Un proceso hijo creado con child_process.fork()',
            'Un tipo de TypeScript para representar procesos del sistema operativo',
          ],
          it: [
            'Una API del browser polyfillata da Node.js',
            "Un oggetto globale che fornisce informazioni e controllo sul processo Node.js corrente, incluse variabili d'ambiente, argomenti della CLI, codici di uscita e stream standard",
            'Un processo figlio creato con child_process.fork()',
            'Un tipo TypeScript che rappresenta i processi del sistema operativo',
          ],
        }),
        JSON.stringify({
          fr: "`process` est un objet global de Node.js (aucun import nécessaire) qui expose notamment : `process.env` (variables d'environnement), `process.argv` (arguments de la ligne de commande), `process.exit(code)` (terminer le process), `process.pid` (PID) et `process.stdin/stdout/stderr` (flux standards).", 
          de: '`process` ist ein globales Objekt in Node.js (kein Import nötig), das u. a. `process.env` (Umgebungsvariablen), `process.argv` (CLI-Argumente), `process.exit(code)` (Prozess beenden), `process.pid` (Prozess-ID) sowie `process.stdin/stdout/stderr` (Standard-Streams) bereitstellt.',
          es: '`process` es un objeto global de Node.js (no necesita importación) que proporciona, entre otros: `process.env` (variables de entorno), `process.argv` (argumentos de la línea de comandos), `process.exit(code)` (terminar el proceso), `process.pid` (PID) y `process.stdin/stdout/stderr` (flujos estándar).',
          it: "`process` è un oggetto globale di Node.js (non richiede import) che espone tra l'altro: `process.env` (variabili d'ambiente), `process.argv` (argomenti della riga di comando), `process.exit(code)` (termina il processo), `process.pid` (PID) e `process.stdin/stdout/stderr` (stream standard).",
        }),
        'd4100001-0000-4000-8001-000000000006',
      ]
    );

    // d4100001-0000-4000-8001-000000000007 - What is CommonJS (CJS) in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que CommonJS (CJS) dans Node.js ?",
          de: 'Was ist CommonJS (CJS) in Node.js?',
          es: '¿Qué es CommonJS (CJS) en Node.js?',
          it: "Che cos'è CommonJS (CJS) in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Un standard Web pour des API JavaScript partagées entre navigateurs',
            "Le système de modules historique de Node.js qui utilise require() et module.exports pour charger et exporter des modules de façon synchrone",
            'Un format universel de feuilles de style utilisé dans les projets Node.js',
            'Un standard de sécurité Node.js pour isoler les modules',
          ],
          de: [
            'Ein Webstandard für gemeinsame JavaScript-APIs in Browsern',
            'Das ursprüngliche Modulsystem von Node.js, das require() und module.exports verwendet, um Module synchron zu laden und zu exportieren',
            'Ein universelles Stylesheet-Format, das in Node.js-Projekten verwendet wird',
            'Ein Node.js-Sicherheitsstandard für die Modul-Sandboxing',
          ],
          es: [
            'Un estándar web para APIs de JavaScript compartidas entre navegadores',
            'El sistema de módulos original de Node.js que usa require() y module.exports para cargar y exportar módulos de forma síncrona',
            'Un formato universal de hojas de estilo usado en proyectos de Node.js',
            'Un estándar de seguridad de Node.js para aislar módulos',
          ],
          it: [
            'Uno standard Web per API JavaScript condivise tra browser',
            "Il sistema di moduli originale di Node.js che usa require() e module.exports per caricare ed esportare i moduli in modo sincrono",
            'Un formato universale di stylesheet usato nei progetti Node.js',
            'Uno standard di sicurezza Node.js per il sandboxing dei moduli',
          ],
        }),
        JSON.stringify({
          fr: "CommonJS est le système de modules historique intégré à Node.js. Les modules sont chargés de manière synchrone avec `const x = require('./x')` et exportés via `module.exports = { ... }` ou `exports.fn = fn`. CJS est adapté au code côté serveur mais est en grande partie supplanté par les ES Modules (ESM) dans les versions modernes de Node.js.",
          de: "CommonJS ist das ursprüngliche Modulsystem von Node.js. Module werden synchron mit `const x = require('./x')` geladen und über `module.exports = { ... }` oder `exports.fn = fn` exportiert. CJS eignet sich gut für serverseitigen Code, wurde aber in modernen Node.js-Versionen weitgehend von ES Modules (ESM) abgelöst.",
          es: "CommonJS es el sistema de módulos original integrado en Node.js. Los módulos se cargan de forma síncrona con `const x = require('./x')` y se exportan con `module.exports = { ... }` o `exports.fn = fn`. CJS es adecuado para código del lado del servidor, pero en las versiones modernas de Node.js ha sido sustituido en gran medida por los ES Modules (ESM).",
          it: "CommonJS è il sistema di moduli storico integrato in Node.js. I moduli vengono caricati in modo sincrono con `const x = require('./x')` ed esportati tramite `module.exports = { ... }` o `exports.fn = fn`. CJS è adatto al codice lato server ma è stato in gran parte sostituito dagli ES Modules (ESM) nelle versioni moderne di Node.js.",
        }),
        'd4100001-0000-4000-8001-000000000007',
      ]
    );

    // d4100001-0000-4000-8001-000000000008 - What is a Buffer in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un Buffer dans Node.js ?",
          de: 'Was ist ein Buffer in Node.js?',
          es: '¿Qué es un Buffer en Node.js?',
          it: "Che cos'è un Buffer in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Un tableau temporaire utilisé pour stocker les rendus de composants React',
            "Un bloc de mémoire de taille fixe alloué en dehors du tas V8 utilisé pour manipuler des données binaires brutes (flux TCP, I/O disque, cryptographie)",
            'Une structure de données de type file (queue) fournie par la bibliothèque standard de Node.js',
            'Un tampon de saisie pour collecter les entrées utilisateur du terminal',
          ],
          de: [
            'Ein temporäres Array zum Speichern von React-Komponenten-Renderings',
            'Ein Speicherblock fester Größe, der außerhalb des V8-Heaps alloziert wird, um rohe Binärdaten zu verarbeiten (TCP-Streams, Datei-I/O, Kryptografie)',
            'Eine Warteschlangen-Datenstruktur aus der Node.js-Standardbibliothek',
            'Ein Eingabepuffer zum Sammeln von Terminaleingaben',
          ],
          es: [
            'Un array temporal para almacenar renderizados de componentes de React',
            'Un bloque de memoria de tamaño fijo asignado fuera del heap de V8 para trabajar con datos binarios crudos (streams TCP, E/S de archivos, criptografía)',
            'Una estructura de datos de cola proporcionada por la librería estándar de Node.js',
            'Un búfer de lectura para recoger la entrada del usuario en el terminal',
          ],
          it: [
            'Un array temporaneo usato per memorizzare i render dei componenti React',
            'Un blocco di memoria a dimensione fissa allocato fuori dall’heap di V8 usato per lavorare con dati binari grezzi (stream TCP, I/O su file, crittografia)',
            'Una struttura dati di coda fornita dalla libreria standard di Node.js',
            'Un buffer di lettura per raccogliere l’input dell’utente dal terminale',
          ],
        }),
        JSON.stringify({
          fr: "`Buffer` est une classe globale de Node.js qui alloue de la mémoire brute en dehors du tas de V8. Elle sert à gérer des données binaires — lecture de fichiers en octets, traitement de paquets TCP/UDP, encodage/décodage entre UTF-8 et base64 ou opérations cryptographiques. Les méthodes courantes incluent `Buffer.from()`, `Buffer.alloc()` et `buf.toString('utf8')`.",
          de: "`Buffer` ist eine globale Node.js-Klasse, die rohen Speicher außerhalb des V8-Heaps alloziiert. Sie wird verwendet, um Binärdaten zu verarbeiten – Dateien als Bytes lesen, TCP/UDP-Pakete behandeln, zwischen UTF-8 und Base64 kodieren/dekodieren oder kryptografische Operationen ausführen. Gängige Methoden sind `Buffer.from()`, `Buffer.alloc()` und `buf.toString('utf8')`.",
          es: "`Buffer` es una clase global de Node.js que asigna memoria cruda fuera del heap de V8. Se utiliza para manejar datos binarios: leer archivos como bytes, procesar paquetes TCP/UDP, codificar/decodificar entre UTF-8 y base64 y realizar operaciones criptográficas. Métodos habituales son `Buffer.from()`, `Buffer.alloc()` y `buf.toString('utf8')`.",
          it: "`Buffer` è una classe globale di Node.js che alloca memoria grezza al di fuori dell’heap di V8. Si usa per gestire dati binari, ad esempio leggere file come byte, elaborare pacchetti TCP/UDP, convertire tra UTF-8 e base64 e fare operazioni crittografiche. Metodi comuni sono `Buffer.from()`, `Buffer.alloc()` e `buf.toString('utf8')`.",
        }),
        'd4100001-0000-4000-8001-000000000008',
      ]
    );

    // d4100001-0000-4000-8001-000000000009 - What is the event loop in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que l'event loop dans Node.js ?",
          de: 'Was ist die Event Loop in Node.js?',
          es: '¿Qué es el event loop en Node.js?',
          it: "Che cos'è l'event loop in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Un patron de conception basé sur une récursion infinie',
            'Le mécanisme qui permet à Node.js de faire de l’I/O non bloquante en déléguant les opérations au système et en exécutant leurs callbacks quand elles sont terminées',
            'Une boucle for qui lit continuellement des fichiers de logs',
            'Un thread libuv dédié uniquement à la surveillance des événements du système de fichiers',
          ],
          de: [
            'Ein Entwurfsmuster für unendliche rekursive Funktionsaufrufe',
            'Der Mechanismus, der Node.js nicht-blockierendes I/O ermöglicht, indem Operationen an das Betriebssystem ausgelagert und deren Callbacks bei Fertigstellung ausgeführt werden',
            'Eine for-Schleife, die ständig Logdateien einliest',
            'Ein libuv-Thread, der ausschließlich Dateisystem-Ereignisse überwacht',
          ],
          es: [
            'Un patrón de diseño basado en llamadas recursivas infinitas',
            'El mecanismo que permite a Node.js realizar E/S no bloqueante delegando operaciones al sistema operativo y ejecutando sus callbacks cuando terminan',
            'Un bucle for que lee continuamente archivos de logs',
            'Un hilo de libuv dedicado solo a vigilar eventos del sistema de archivos',
          ],
          it: [
            'Un pattern di progettazione basato su chiamate ricorsive infinite',
            'Il meccanismo che permette a Node.js di eseguire I/O non bloccante delegando le operazioni al sistema operativo ed eseguendo le callback quando sono completate',
            'Un ciclo for che legge continuamente i file di log',
            'Un thread di libuv dedicato solo al monitoraggio degli eventi del file system',
          ],
        }),
        JSON.stringify({
          fr: "L'event loop est le cœur de la concurrence dans Node.js. Il tourne sur le thread JavaScript unique et vérifie en continu : y a-t-il des callbacks à exécuter ? des timers prêts ? des résultats d'I/O à traiter ? Les phases de la boucle (timers, I/O, idle, poll, check, close) déterminent l'ordre d'exécution des callbacks et permettent un comportement non bloquant sur un seul thread.",
          de: 'Die Event Loop ist das Herzstück der Nebenläufigkeit in Node.js. Sie läuft auf dem einzelnen JavaScript-Thread und prüft fortlaufend: Gibt es Callbacks auszuführen? Timer, die fällig sind? I/O-Ergebnisse, die verarbeitet werden müssen? Die Phasen der Schleife (timers, I/O, idle, poll, check, close) bestimmen die Reihenfolge, in der Callbacks ausgeführt werden, und ermöglichen nicht-blockierendes Verhalten auf einem einzigen Thread.',
          es: 'El event loop es el corazón de la concurrencia en Node.js. Se ejecuta en el único hilo de JavaScript y comprueba continuamente si hay callbacks por procesar, timers listos o resultados de E/S pendientes. Las fases del bucle (timers, I/O, idle, poll, check, close) determinan el orden en el que se ejecutan los callbacks y permiten un comportamiento no bloqueante con un solo hilo.',
          it: "L'event loop è il cuore della concorrenza in Node.js. Gira sull'unico thread JavaScript e controlla continuamente se ci sono callback da eseguire, timer pronti o risultati di I/O da gestire. Le fasi del loop (timers, I/O, idle, poll, check, close) determinano l'ordine di esecuzione dei callback e consentono un comportamento non bloccante su un singolo thread.",
        }),
        'd4100001-0000-4000-8001-000000000009',
      ]
    );

    // d4100001-0000-4000-8001-000000000010 - What is an ES Module (ESM) in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un ES Module (ESM) dans Node.js ?",
          de: 'Was ist ein ES Module (ESM) in Node.js?',
          es: '¿Qué es un ES Module (ESM) en Node.js?',
          it: "Che cos'è un ES Module (ESM) in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Un ancien format de module Node.js basé sur require()',
            "Le système de modules standard d'ECMAScript utilisant la syntaxe import/export, pris en charge nativement dans Node.js 12+ via les fichiers .mjs ou \"type\":\"module\" dans package.json",
            'Un bundler de modules intégré à Node.js depuis la version 18',
            'Une option de configuration Webpack pour le code splitting',
          ],
          de: [
            'Ein älteres Node.js-Modulformat auf Basis von require()',
            'Das offizielle ECMAScript-Modulsystem mit import/export, das seit Node.js 12+ nativ unterstützt wird, z. B. per .mjs-Dateien oder "type":"module" in der package.json',
            'Ein in Node.js integrierter Module-Bundler seit Version 18',
            'Eine Webpack-Konfigurationsoption für Code Splitting',
          ],
          es: [
            'Un formato antiguo de módulos de Node.js basado en require()',
            'El sistema de módulos estándar de ECMAScript que usa la sintaxis import/export, soportado de forma nativa en Node.js 12+ mediante archivos .mjs o "type":"module" en package.json',
            'Un empaquetador de módulos integrado en Node.js desde la versión 18',
            'Una opción de configuración de Webpack para el code splitting',
          ],
          it: [
            'Un vecchio formato di modulo di Node.js basato su require()',
            'Il sistema di moduli standard ECMAScript che usa la sintassi import/export, supportato nativamente in Node.js 12+ tramite file .mjs o "type":"module" in package.json',
            'Un bundler di moduli integrato in Node.js dalla versione 18',
            "Un'opzione di configurazione di Webpack per il code splitting",
          ],
        }),
        JSON.stringify({
          fr: "Les ES Modules sont le standard officiel ECMAScript pour les modules JavaScript. Dans Node.js, on utilise `import x from './x.js'` et `export const fn = ...`. Ils sont activés via l'extension `.mjs` ou en mettant `\"type\": \"module\"` dans `package.json`. Contrairement à CJS, les imports ESM sont statiquement analysables et chargés de manière asynchrone, avec des contraintes d'interopérabilité importantes avec CJS.",
          de: "ES Modules sind der offizielle ECMAScript-Standard für JavaScript-Module. In Node.js verwendet man `import x from './x.js'` und `export const fn = ...`. Sie werden entweder über die Dateiendung `.mjs` oder über `\"type\": \"module\"` in der `package.json` aktiviert. Im Gegensatz zu CJS sind ESM-Imports statisch analysierbar und werden asynchron geladen, was wichtige Interop-Einschränkungen mit CJS zur Folge hat.",
          es: "Los ES Modules son el estándar oficial de ECMAScript para módulos de JavaScript. En Node.js se usan con `import x from './x.js'` y `export const fn = ...`. Se habilitan mediante la extensión `.mjs` o definiendo `\"type\": \"module\"` en `package.json`. A diferencia de CJS, las importaciones ESM son estáticamente analizables y se cargan de forma asíncrona, con restricciones importantes de interoperabilidad con CJS.",
          it: "Gli ES Modules sono lo standard ufficiale ECMAScript per i moduli JavaScript. In Node.js si usano con `import x from './x.js'` e `export const fn = ...`. Si abilitano tramite l'estensione `.mjs` oppure impostando `\"type\": \"module\"` in `package.json`. A differenza di CJS, gli import ESM sono analizzabili staticamente e vengono caricati in modo asincrono, con importanti limiti di interoperabilità con CJS.",
        }),
        'd4100001-0000-4000-8001-000000000010',
      ]
    );

    // Remaining questions 11-35
    // For brevity, follow the same pattern as above for each question id
    // d4100001-0000-4000-8001-000000000011 through d4100001-0000-4000-8001-000000000035
    // Each uses the provided SQL structure and adds fr/de/es/it translations

    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Quelles sont les phases de l'event loop Node.js ?",
          de: 'Welche Phasen hat die Node.js-Event-Loop?',
          es: '¿Cuáles son las fases del event loop de Node.js?',
          it: "Quali sono le fasi dell'event loop di Node.js?",
        }),
        JSON.stringify({
          fr: [
            'mount → update → destroy',
            'timers → pending callbacks → idle/prepare → poll → check → close callbacks',
            'microtasks → macrotasks → I/O → rendering',
            'queue → process → callback → flush',
          ],
          de: [
            'mount → update → destroy',
            'timers → pending callbacks → idle/prepare → poll → check → close callbacks',
            'microtasks → macrotasks → I/O → rendering',
            'queue → process → callback → flush',
          ],
          es: [
            'mount → update → destroy',
            'timers → pending callbacks → idle/prepare → poll → check → close callbacks',
            'microtasks → macrotasks → I/O → rendering',
            'queue → process → callback → flush',
          ],
          it: [
            'mount → update → destroy',
            'timers → pending callbacks → idle/prepare → poll → check → close callbacks',
            'microtasks → macrotasks → I/O → rendering',
            'queue → process → callback → flush',
          ],
        }),
        JSON.stringify({
          fr: "La boucle d'événements comporte 6 phases : (1) **timers** — exécute les callbacks de `setTimeout`/`setInterval` ; (2) **pending callbacks** — callbacks d'I/O reportés ; (3) **idle/prepare** — usage interne ; (4) **poll** — récupère les nouveaux événements d'I/O ; (5) **check** — exécute les callbacks de `setImmediate` ; (6) **close callbacks** — par exemple `socket.on('close')`. `process.nextTick` et les Promises (microtasks) sont vidés entre chaque phase.",
          de: "Die Event-Loop hat 6 Phasen: (1) **timers** — führt `setTimeout`/`setInterval`-Callbacks aus; (2) **pending callbacks** — I/O-Callbacks, die in den nächsten Zyklus verschoben wurden; (3) **idle/prepare** — intern; (4) **poll** — holt neue I/O-Ereignisse; (5) **check** — führt `setImmediate`-Callbacks aus; (6) **close callbacks** — z. B. `socket.on('close')`. `process.nextTick` und Promise-Microtasks werden zwischen den Phasen abgearbeitet.",
          es: "El event loop tiene 6 fases: (1) **timers** — ejecuta callbacks de `setTimeout`/`setInterval`; (2) **pending callbacks** — callbacks de E/S aplazados; (3) **idle/prepare** — uso interno; (4) **poll** — obtiene nuevos eventos de E/S; (5) **check** — ejecuta callbacks de `setImmediate`; (6) **close callbacks** — por ejemplo `socket.on('close')`. `process.nextTick` y las promesas (microtasks) se procesan entre cada fase.",
          it: "L'event loop ha 6 fasi: (1) **timers** — esegue i callback di `setTimeout`/`setInterval`; (2) **pending callbacks** — callback di I/O rimandati; (3) **idle/prepare** — uso interno; (4) **poll** — legge i nuovi eventi di I/O; (5) **check** — esegue i callback di `setImmediate`; (6) **close callbacks** — ad es. `socket.on('close')`. `process.nextTick` e le Promises (microtasks) vengono svuotate tra una fase e l'altra.",
        }),
        'd4100001-0000-4000-8001-000000000011',
      ]
    );

    // d4100001-0000-4000-8001-000000000012 - What is libuv in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que libuv dans Node.js ?",
          de: 'Was ist libuv in Node.js?',
          es: '¿Qué es libuv en Node.js?',
          it: "Che cos'è libuv in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Un analyseur JavaScript que Node.js utilise pour tokenizer les fichiers sources',
            "Une bibliothèque C multiplateforme qui fournit à Node.js l'event loop, l'I/O asynchrone, un thread pool et des abstractions OS pour le système de fichiers, le DNS et le réseau",
            'Un module intégré de Node.js pour gérer des capteurs de lumière UV (ultraviolet)',
            'Le pont C++ entre V8 et la bibliothèque standard de Node.js',
          ],
          de: [
            'Ein JavaScript-Parser, den Node.js zum Tokenisieren von Quelldateien verwendet',
            'Eine plattformübergreifende C-Bibliothek, die Node.js die Event-Loop, asynchrones I/O, einen Thread-Pool und Betriebssystemabstraktionen für Dateisystem, DNS und Netzwerk bereitstellt',
            'Ein eingebautes Node.js-Modul zur Verwaltung von UV-(Ultraviolett-)Lichtsensoren',
            'Die C++-Brücke zwischen V8 und der Node.js-Standardbibliothek',
          ],
          es: [
            'Un analizador de JavaScript que Node.js usa para tokenizar archivos fuente',
            'Una biblioteca de C multiplataforma que proporciona a Node.js el event loop, E/S asíncrona, un thread pool y abstracciones del sistema operativo para sistema de archivos, DNS y red',
            'Un módulo integrado de Node.js para gestionar sensores de luz ultravioleta (UV)',
            'El puente en C++ entre V8 y la librería estándar de Node.js',
          ],
          it: [
            'Un parser JavaScript che Node.js usa per tokenizzare i file sorgente',
            "Una libreria C multipiattaforma che fornisce a Node.js l'event loop, l'I/O asincrono, un thread pool e astrazioni di sistema operativo per file system, DNS e networking",
            'Un modulo integrato di Node.js per gestire sensori di luce UV (ultravioletta)',
            'Il ponte C++ tra V8 e la libreria standard di Node.js',
          ],
        }),
        JSON.stringify({
          fr: "libuv est la bibliothèque C au cœur de Node.js. Elle implémente l'event loop, le réseau TCP/UDP asynchrone (en s'appuyant sur epoll/kqueue/IOCP), un thread pool (4 threads par défaut) pour les opérations bloquantes (I/O disque, DNS, crypto), la gestion des processus enfants et des abstractions multiplateformes. Node.js utilise libuv pour déléguer au système d'exploitation le travail pouvant être fait de manière asynchrone.",
          de: 'libuv ist die C-Bibliothek im Kern von Node.js. Sie implementiert die Event-Loop, asynchrone TCP/UDP-Netzwerkkommunikation (mit epoll/kqueue/IOCP), einen Thread-Pool (standardmäßig 4 Threads) für blockierende Operationen (Datei-I/O, DNS, Crypto), Prozessverwaltung und plattformübergreifende Abstraktionen. Node.js nutzt libuv, um Arbeit an das Betriebssystem auszulagern, die dort asynchron erledigt werden kann.',
          es: 'libuv es la biblioteca en C que está en el núcleo de Node.js. Implementa el event loop, la red TCP/UDP asíncrona (mediante mecanismos del SO como epoll/kqueue/IOCP), un thread pool (4 hilos por defecto) para operaciones bloqueantes (E/S de archivos, DNS, criptografía), gestión de procesos hijo y abstracciones multiplataforma. Node.js usa libuv para delegar al sistema operativo el trabajo que puede hacerse de forma asíncrona.',
          it: "libuv è la libreria C al cuore di Node.js. Implementa l'event loop, il networking TCP/UDP asincrono (usando primitive del sistema operativo come epoll/kqueue/IOCP), un thread pool (4 thread di default) per operazioni bloccanti (I/O su file, DNS, crypto), la gestione dei processi figli e astrazioni multipiattaforma. Node.js usa libuv per delegare al sistema operativo il lavoro che può essere svolto in modo asincrono.",
        }),
        'd4100001-0000-4000-8001-000000000012',
      ]
    );

    // d4100001-0000-4000-8001-000000000013 - What is a Stream in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un Stream dans Node.js ?",
          de: 'Was ist ein Stream in Node.js?',
          es: '¿Qué es un Stream en Node.js?',
          it: "Che cos'è uno Stream in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Un pipeline vidéo/audio temps réel intégré à Node.js',
            'Une interface abstraite pour travailler avec des données en flux — lire ou écrire des données par morceaux sans tout charger en mémoire',
            'Un pool de connexions base de données qui \"streame\" les requêtes',
            'Un utilitaire de logs qui envoie les sorties vers un fichier en streaming',
          ],
          de: [
            'Eine Echtzeit-Video/Audio-Pipeline, die in Node.js eingebaut ist',
            'Eine abstrakte Schnittstelle zum Arbeiten mit Datenströmen – Daten werden in Chunks gelesen oder geschrieben, statt alles auf einmal in den Speicher zu laden',
            'Ein Datenbank-Verbindungspool, der Abfragen streamt',
            'Ein Logging-Tool, das Ausgaben in eine Datei streamt',
          ],
          es: [
            'Una canalización de vídeo/audio en tiempo real integrada en Node.js',
            'Una interfaz abstracta para trabajar con datos en streaming: leer o escribir datos en bloques en lugar de cargarlos todos en memoria de una vez',
            'Un pool de conexiones de base de datos que hace streaming de consultas',
            'Una utilidad de logs que envía la salida a un archivo mediante streaming',
          ],
          it: [
            'Una pipeline audio/video in tempo reale integrata in Node.js',
            "Un'interfaccia astratta per lavorare con dati in streaming: leggere o scrivere i dati a chunk invece di caricarli tutti in memoria",
            'Un pool di connessioni al database che effettua lo streaming delle query',
            "Un'utility di logging che scrive i log su file in streaming",
          ],
        }),
        JSON.stringify({
          fr: "Les streams Node.js sont des objets qui permettent de lire ou d'écrire des données morceau par morceau. On distingue quatre types : **Readable** (source de données, par ex. `fs.createReadStream`), **Writable** (destination, par ex. `fs.createWriteStream`), **Duplex** (lecture/écriture, par ex. un socket TCP) et **Transform** (duplex qui modifie les données en transit, par ex. `zlib.createGzip`). Les streams sont efficaces en mémoire pour les gros fichiers ou les flux continus.",
          de: 'Streams in Node.js sind Objekte, mit denen man Daten stückweise lesen oder schreiben kann. Es gibt vier Typen: **Readable** (Datenquelle, z. B. `fs.createReadStream`), **Writable** (Ziel, z. B. `fs.createWriteStream`), **Duplex** (lesend und schreibend, z. B. ein TCP-Socket) und **Transform** (Duplex, das Daten unterwegs verändert, z. B. `zlib.createGzip`). Streams sind speichereffizient für große Dateien oder kontinuierliche Datenströme.',
          es: 'Los streams de Node.js son objetos que permiten leer o escribir datos por partes. Hay cuatro tipos: **Readable** (fuente de datos, por ejemplo `fs.createReadStream`), **Writable** (destino, por ejemplo `fs.createWriteStream`), **Duplex** (lectura y escritura, por ejemplo un socket TCP) y **Transform** (duplex que transforma los datos en tránsito, como `zlib.createGzip`). Los streams son eficientes en memoria para archivos grandes o datos continuos.',
          it: 'Gli stream di Node.js sono oggetti che permettono di leggere o scrivere dati a pezzi. Esistono quattro tipi: **Readable** (sorgente dei dati, ad es. `fs.createReadStream`), **Writable** (destinazione, ad es. `fs.createWriteStream`), **Duplex** (sia lettura che scrittura, ad es. un socket TCP) e **Transform** (duplex che modifica i dati mentre passano, ad es. `zlib.createGzip`). Gli stream sono efficienti in memoria per file grandi o flussi continui.',
        }),
        'd4100001-0000-4000-8001-000000000013',
      ]
    );

    // d4100001-0000-4000-8001-000000000014 - What is the EventEmitter in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que l'EventEmitter dans Node.js ?",
          de: 'Was ist der EventEmitter in Node.js?',
          es: '¿Qué es el EventEmitter en Node.js?',
          it: "Che cos'è l'EventEmitter in Node.js?",
        }),
        JSON.stringify({
          fr: [
            "Un polyfill de gestionnaires d'événements DOM pour le navigateur",
            "Une classe centrale de Node.js qui implémente le pattern observateur, permettant aux objets d'émettre des événements nommés et d'enregistrer des callbacks d'écoute",
            'Un utilitaire pour émettre des événements de navigateur factices dans les tests Node.js',
            'Une classe qui émet des événements HTTP depuis le serveur HTTP de Node.js',
          ],
          de: [
            'Ein DOM-Event-Listener-Polyfill für Browser',
            'Eine zentrale Node.js-Klasse, die das Observer-Pattern implementiert und es Objekten erlaubt, benannte Events zu emittieren und Listener-Callbacks zu registrieren',
            'Ein Hilfsmodul zum Auslösen synthetischer Browser-Events in Node.js-Tests',
            'Eine Klasse, die HTTP-Events des Node.js-HTTP-Servers emittiert',
          ],
          es: [
            'Un polyfill de listeners de eventos del DOM para el navegador',
            'Una clase central de Node.js que implementa el patrón observador y permite que los objetos emitan eventos con nombre y registren callbacks oyentes',
            'Una utilidad para emitir eventos de navegador sintéticos en tests de Node.js',
            'Una clase que emite eventos HTTP desde el servidor HTTP de Node.js',
          ],
          it: [
            'Un polyfill per i listener di eventi DOM nel browser',
            "Una classe core di Node.js che implementa il pattern observer permettendo agli oggetti di emettere eventi con nome e registrare callback di ascolto",
            "Un'utility per emettere eventi browser sintetici nei test Node.js",
            'Una classe che emette eventi HTTP dal server HTTP di Node.js',
          ],
        }),
        JSON.stringify({
          fr: "`EventEmitter` (du module `events`) est la base de l'architecture événementielle de Node.js. Les objets qui étendent `EventEmitter` peuvent appeler `emit('event', data)` pour émettre un événement, `on('event', cb)` pour s'abonner, `once('event', cb)` pour ne réagir qu'une fois et `removeListener()` pour se désabonner. De nombreuses API noyau (streams, http.Server) héritent d'EventEmitter.",
          de: "`EventEmitter` (aus dem Modul `events`) ist die Grundlage der ereignisgesteuerten Architektur von Node.js. Objekte, die von `EventEmitter` erben, können mit `emit('event', data)` Events aussenden, mit `on('event', cb)` abonnieren, mit `once('event', cb)` nur auf das erste Auftreten reagieren und mit `removeListener()` Abonnements entfernen. Viele eingebaute Node.js-Klassen (Streams, http.Server) erweitern EventEmitter.",
          es: "`EventEmitter` (del módulo `events`) es la base de la arquitectura dirigida por eventos de Node.js. Los objetos que extienden `EventEmitter` pueden usar `emit('event', data)` para emitir un evento, `on('event', cb)` para suscribirse, `once('event', cb)` para escuchar solo la primera vez y `removeListener()` para desuscribirse. Muchos componentes internos de Node.js (streams, http.Server) extienden EventEmitter.",
          it: "`EventEmitter` (dal modulo `events`) è la base dell'architettura event-driven di Node.js. Gli oggetti che estendono `EventEmitter` possono chiamare `emit('event', data)` per emettere un evento, `on('event', cb)` per iscriversi, `once('event', cb)` per ascoltare solo la prima occorrenza e `removeListener()` per disiscriversi. Molte API core di Node.js (stream, http.Server) estendono EventEmitter.",
        }),
        'd4100001-0000-4000-8001-000000000014',
      ]
    );

    // d4100001-0000-4000-8001-000000000015 - What is child_process in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que child_process dans Node.js ?",
          de: 'Was ist child_process in Node.js?',
          es: '¿Qué es child_process en Node.js?',
          it: "Che cos'è child_process in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Un sous-processus léger créé en scindant un worker monothread',
            "Un module natif de Node.js qui permet de lancer des process système enfants, d'exécuter des commandes shell et de communiquer avec le process parent (IPC)",
            'Un type particulier de Promise qui se résout quand un composant enfant est rendu',
            'Un worker de cluster Node.js limité à la gestion de routes \"enfant\"',
          ],
          de: [
            'Ein leichtgewichtiger Subprozess, der durch Aufteilen eines Single-Thread-Workers entsteht',
            'Ein eingebautes Node.js-Modul, mit dem man OS-Kindprozesse starten, Shell-Befehle ausführen und per IPC mit dem Elternprozess kommunizieren kann',
            'Eine spezielle Promise-Art, die aufgelöst wird, wenn eine Kindkomponente gerendert wurde',
            'Ein Cluster-Worker in Node.js, der nur Child-Routen verarbeitet',
          ],
          es: [
            'Un subproceso ligero creado a partir de dividir un worker monohilo',
            'Un módulo integrado de Node.js que permite lanzar procesos hijo del sistema operativo, ejecutar comandos de shell y comunicarse con el proceso padre mediante IPC',
            'Un tipo de promesa que se resuelve cuando se renderiza un componente hijo',
            'Un worker de cluster de Node.js limitado a manejar rutas hijas',
          ],
          it: [
            'Un sottoprocesso leggero creato dividendo un worker single-thread',
            'Un modulo integrato di Node.js che consente di avviare processi figli del sistema operativo, eseguire comandi shell e comunicare con il processo padre tramite IPC',
            'Un tipo particolare di Promise che si risolve quando viene renderizzato un componente figlio',
            'Un worker del modulo cluster di Node.js limitato alla gestione di route figlie',
          ],
        }),
        JSON.stringify({
          fr: "Le module `child_process` fournit notamment : `spawn()` — streame stdin/stdout de n'importe quel exécutable ; `exec()` — exécute une commande shell et bufferise la sortie ; `execFile()` — comme exec mais sans shell ; `fork()` — une variante spécialisée pour lancer des scripts Node.js avec un canal IPC (`child.send()` / `process.on('message')`). Il est utile pour les tâches CPU-intensives et l'automatisation de commandes shell.",
          de: "Das Modul `child_process` bietet u. a.: `spawn()` — streamt stdin/stdout eines beliebigen Programms; `exec()` — führt einen Shell-Befehl aus und puffert die Ausgabe; `execFile()` — wie exec, aber ohne Shell; `fork()` — eine Spezialvariante zum Starten von Node.js-Skripten mit IPC-Kanal (`child.send()` / `process.on('message')`). Es eignet sich für CPU-intensive Aufgaben und Shell-Automatisierung.",
          es: "El módulo `child_process` proporciona, entre otros: `spawn()` — hace streaming de stdin/stdout de cualquier ejecutable; `exec()` — ejecuta un comando de shell y almacena la salida en un búfer; `execFile()` — similar a exec pero sin shell; `fork()` — una variante especial para lanzar scripts de Node.js con un canal IPC (`child.send()` / `process.on('message')`). Es útil para tareas intensivas en CPU y automatización de comandos de shell.",
          it: "Il modulo `child_process` offre tra l'altro: `spawn()` — effettua lo streaming di stdin/stdout di un qualsiasi eseguibile; `exec()` — esegue un comando shell e bufferizza l'output; `execFile()` — come exec ma senza shell; `fork()` — una variante specializzata per avviare script Node.js con un canale IPC (`child.send()` / `process.on('message')`). È utile per compiti CPU-intensive e per l'automazione di comandi shell.",
        }),
        'd4100001-0000-4000-8001-000000000015',
      ]
    );

    // d4100001-0000-4000-8001-000000000016 - What is the cluster module in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le module cluster dans Node.js ?",
          de: 'Was ist das cluster-Modul in Node.js?',
          es: '¿Qué es el módulo cluster en Node.js?',
          it: "Che cos'è il modulo cluster in Node.js?",
        }),
        JSON.stringify({
          fr: [
            "Un module Node.js qui regroupe les paquets npm en \"clusters\" d'installation",
            'Un module qui permet à une application Node.js de créer plusieurs workers (un par cœur CPU) qui partagent le même port serveur pour augmenter le débit',
            'Un client Redis cluster intégré à Node.js',
            'Un module pour créer des groupes de connexions WebSocket',
          ],
          de: [
            'Ein Node.js-Modul, das npm-Pakete in Installations-Cluster gruppiert',
            'Ein Modul, mit dem eine Node.js-Anwendung mehrere Worker-Prozesse (einen pro CPU-Kern) erstellen kann, die sich denselben Server-Port teilen und so den Durchsatz erhöhen',
            'Ein in Node.js eingebauter Redis-Cluster-Client',
            'Ein Modul zum Bilden gruppierter WebSocket-Verbindungen',
          ],
          es: [
            'Un módulo de Node.js que agrupa paquetes de npm en “clusters” de instalación',
            'Un módulo que permite que una aplicación de Node.js cree múltiples procesos worker (uno por núcleo de CPU) que comparten el mismo puerto del servidor para aumentar el rendimiento',
            'Un cliente de Redis Cluster integrado en Node.js',
            'Un módulo para crear grupos de conexiones WebSocket',
          ],
          it: [
            'Un modulo Node.js che raggruppa i pacchetti npm in “cluster” di installazione',
            "Un modulo che consente a un'applicazione Node.js di creare più processi worker (uno per core CPU) che condividono la stessa porta del server, aumentando il throughput",
            'Un client Redis cluster integrato in Node.js',
            'Un modulo per creare gruppi di connessioni WebSocket',
          ],
        }),
        JSON.stringify({
          fr: "Node.js tourne sur un seul thread. Le module `cluster` permet de forker plusieurs process workers (via `cluster.fork()`) qui partagent tous le même port TCP/HTTP. Le process maître répartit les connexions entrantes entre les workers, ce qui permet d'utiliser tous les cœurs CPU plutôt qu'un seul.",
          de: 'Node.js läuft standardmäßig auf einem einzelnen Thread. Das Modul `cluster` ermöglicht es, mit `cluster.fork()` mehrere Worker-Prozesse zu starten, die sich denselben TCP/HTTP-Port teilen. Der Master-Prozess verteilt eingehende Verbindungen auf die Worker und nutzt so mehrere CPU-Kerne.',
          es: 'Node.js se ejecuta en un solo hilo. El módulo `cluster` permite hacer fork de varios procesos worker (con `cluster.fork()`) que comparten el mismo puerto TCP/HTTP. El proceso maestro distribuye las conexiones entrantes entre los workers, aprovechando todos los núcleos de CPU.',
          it: 'Node.js gira su un singolo thread. Il modulo `cluster` permette di fare fork di più processi worker (con `cluster.fork()`) che condividono la stessa porta TCP/HTTP. Il processo master distribuisce le connessioni in ingresso tra i worker, sfruttando tutti i core della CPU.',
        }),
        'd4100001-0000-4000-8001-000000000016',
      ]
    );

    // d4100001-0000-4000-8001-000000000017 - What are Worker Threads in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Que sont les Worker Threads dans Node.js ?',
          de: 'Was sind Worker Threads in Node.js?',
          es: '¿Qué son los Worker Threads en Node.js?',
          it: 'Cosa sono i Worker Threads in Node.js?',
        }),
        JSON.stringify({
          fr: [
            "Des threads du système d'exploitation créés automatiquement par libuv pour toutes les opérations asynchrones",
            "Un module Node.js qui permet d'exécuter du JavaScript en parallèle dans plusieurs threads partageant la mémoire, adapté aux tâches CPU-intensives sans bloquer l'event loop",
            'Des alias pour les process enfants créés avec child_process.fork()',
            'Des Web Workers du navigateur portés dans Node.js pour manipuler le DOM',
          ],
          de: [
            'Vom Betriebssystem automatisch erzeugte Threads für alle asynchronen Operationen',
            'Ein Node.js-Modul, mit dem JavaScript in parallelen Threads mit gemeinsamem Speicher ausgeführt werden kann, geeignet für CPU-intensive Aufgaben ohne Blockieren der Event-Loop',
            'Aliase für Child-Prozesse, die mit child_process.fork() erstellt werden',
            'Browser-Web-Workers, die nach Node.js portiert wurden, um den DOM zu manipulieren',
          ],
          es: [
            'Hilos del sistema operativo creados automáticamente por libuv para todas las operaciones asíncronas',
            'Un módulo de Node.js que permite ejecutar JavaScript en hilos paralelos que comparten memoria, adecuado para tareas intensivas en CPU sin bloquear el event loop',
            'Alias de procesos hijo creados con child_process.fork()',
            'Web Workers del navegador portados a Node.js para manipular el DOM',
          ],
          it: [
            'Thread del sistema operativo creati automaticamente da libuv per tutte le operazioni asincrone',
            "Un modulo di Node.js che permette di eseguire JavaScript in thread paralleli con memoria condivisa, adatto a compiti CPU-intensive senza bloccare l'event loop",
            'Alias per i processi figli creati con child_process.fork()',
            'Web Worker del browser portati in Node.js per manipolare il DOM',
          ],
        }),
        JSON.stringify({
          fr: "`worker_threads` (stable depuis Node 12) permet d'exécuter du JavaScript dans de vrais threads parallèles au sein du même process, en partageant la mémoire via `SharedArrayBuffer` et `Atomics`. Contrairement à `child_process`, les worker threads partagent en partie le tas V8 et communiquent via passage de messages (`postMessage`). Ils sont adaptés aux tâches très consommatrices en CPU (traitement d'images, ML, compression) qui bloqueraient sinon l'event loop.",
          de: '`worker_threads` (stabil seit Node 12) ermöglicht es, JavaScript in echten parallelen Threads im selben Prozess auszuführen und Speicher über `SharedArrayBuffer` und `Atomics` zu teilen. Im Gegensatz zu `child_process` teilen sich Worker Threads teilweise den V8-Heap und kommunizieren über Nachrichten (`postMessage`). Sie eignen sich für CPU-intensive Aufgaben (Bildverarbeitung, ML-Inferenz, Kompression), die sonst die Event-Loop blockieren würden.',
          es: '`worker_threads` (estable desde Node 12) permite ejecutar JavaScript en hilos paralelos reales dentro del mismo proceso, compartiendo memoria mediante `SharedArrayBuffer` y `Atomics`. A diferencia de `child_process`, los worker threads comparten parcialmente el heap de V8 y se comunican mediante paso de mensajes (`postMessage`). Son adecuados para tareas muy intensivas en CPU (procesamiento de imágenes, inferencia de ML, compresión) que de otro modo bloquearían el event loop.',
          it: "`worker_threads` (stabile da Node 12) consente di eseguire JavaScript in veri thread paralleli all'interno dello stesso processo, condividendo memoria tramite `SharedArrayBuffer` e `Atomics`. A differenza di `child_process`, i worker threads condividono parzialmente l'heap di V8 e comunicano tramite passaggio di messaggi (`postMessage`). Sono ideali per compiti molto CPU-intensive (elaborazione immagini, inferenza ML, compressione) che altrimenti bloccherebbero l'event loop.",
        }),
        'd4100001-0000-4000-8001-000000000017',
      ]
    );

    // d4100001-0000-4000-8001-000000000018 - What is process.nextTick() in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que process.nextTick() dans Node.js ?",
          de: 'Was ist process.nextTick() in Node.js?',
          es: '¿Qué es process.nextTick() en Node.js?',
          it: "Che cos'è process.nextTick() in Node.js?",
        }),
        JSON.stringify({
          fr: [
            "Une fonction qui retarde l'exécution de exactement un \"tick\" d'event loop (une milliseconde)",
            "Une fonction qui planifie l'exécution d'un callback à la fin de l'opération courante, avant que l'event loop ne passe à la phase suivante — avant tout callback d'I/O",
            'Un alias de setImmediate() avec une priorité plus élevée',
            "Un moyen de planifier une microtâche qui s'exécute après tous les callbacks de Promise",
          ],
          de: [
            'Eine Funktion, die die Ausführung um genau einen Event-Loop-Tick (eine Millisekunde) verzögert',
            'Eine Funktion, die einen Callback so einplant, dass er am Ende der aktuellen Operation läuft, bevor die Event-Loop in die nächste Phase geht – also vor allen I/O-Callbacks',
            'Ein Alias für setImmediate() mit höherer Priorität',
            'Eine Möglichkeit, eine Microtask zu planen, die nach allen Promise-Callbacks läuft',
          ],
          es: [
            'Una función que retrasa la ejecución un tick del event loop (un milisegundo)',
            'Una función que programa un callback para que se ejecute al final de la operación actual, antes de que el event loop pase a la siguiente fase, es decir, antes de cualquier callback de E/S',
            'Un alias de setImmediate() con mayor prioridad',
            'Una forma de programar una microtarea que se ejecuta después de todos los callbacks de Promise',
          ],
          it: [
            "Una funzione che ritarda l'esecuzione di un tick dell'event loop (un millisecondo)",
            "Una funzione che pianifica l'esecuzione di una callback alla fine dell'operazione corrente, prima che l'event loop passi alla fase successiva — quindi prima di qualsiasi callback di I/O",
            'Un alias di setImmediate() con priorità più alta',
            'Un modo per pianificare una microtask che viene eseguita dopo tutte le callback delle Promise',
          ],
        }),
        JSON.stringify({
          fr: "`process.nextTick(cb)` place un callback dans une file spéciale pour l'exécuter immédiatement après la fin du code synchrone courant, avant que l'event loop ne passe à la phase suivante. Il a une priorité plus élevée que les microtâches de Promises et que `setImmediate`. Un usage excessif peut affamer l'I/O ; `queueMicrotask(cb)` et `setImmediate(cb)` sont des alternatives.",
          de: '`process.nextTick(cb)` reiht einen Callback in eine spezielle Warteschlange ein, sodass er direkt nach dem aktuellen synchronen Code ausgeführt wird, bevor die Event-Loop in die nächste Phase übergeht. Er hat eine höhere Priorität als Promise-Microtasks und `setImmediate`. Übermäßige Nutzung kann I/O verhungern lassen; Alternativen sind `queueMicrotask(cb)` und `setImmediate(cb)`.',
          es: '`process.nextTick(cb)` encola un callback para ejecutarlo inmediatamente después de que termine el código síncrono actual, antes de que el event loop avance a la siguiente fase. Tiene mayor prioridad que las microtareas de Promise y que `setImmediate`. Un uso excesivo puede dejar sin tiempo a la E/S; `queueMicrotask(cb)` y `setImmediate(cb)` son alternativas.',
          it: "`process.nextTick(cb)` accoda una callback in una coda speciale che viene svuotata subito dopo il codice sincrono corrente, prima che l'event loop passi alla fase successiva. Ha priorità più alta delle microtask delle Promise e di `setImmediate`. Un uso eccessivo può affamare l'I/O; alternative sono `queueMicrotask(cb)` e `setImmediate(cb)`.",
        }),
        'd4100001-0000-4000-8001-000000000018',
      ]
    );

    // d4100001-0000-4000-8001-000000000019 - Difference between setImmediate() and setTimeout() in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Quelle est la différence entre setImmediate() et setTimeout() dans Node.js ?',
          de: 'Was ist der Unterschied zwischen setImmediate() und setTimeout() in Node.js?',
          es: '¿Cuál es la diferencia entre setImmediate() y setTimeout() en Node.js?',
          it: 'Qual è la differenza tra setImmediate() e setTimeout() in Node.js?',
        }),
        JSON.stringify({
          fr: [
            "setImmediate s'exécute après le cycle courant de l'event loop dans la phase check ; setTimeout s'exécute après au moins le délai spécifié dans la phase timers",
            'setImmediate est une version basée sur Promise de setTimeout(0)',
            'setTimeout est synchrone ; setImmediate est asynchrone',
            'Elles sont identiques, mais setImmediate est dépréciée',
          ],
          de: [
            'setImmediate läuft nach dem aktuellen Event-Loop-Zyklus in der check-Phase; setTimeout läuft nach mindestens der angegebenen Verzögerung in der timers-Phase',
            'setImmediate ist eine Promise-basierte Version von setTimeout(0)',
            'setTimeout läuft synchron; setImmediate läuft asynchron',
            'Sie sind identisch, aber setImmediate ist veraltet',
          ],
          es: [
            'setImmediate se ejecuta después del ciclo actual del event loop en la fase check; setTimeout se ejecuta tras al menos el retraso indicado en la fase timers',
            'setImmediate es una versión basada en Promises de setTimeout(0)',
            'setTimeout se ejecuta de forma síncrona; setImmediate de forma asíncrona',
            'Son idénticas pero setImmediate está obsoleta',
          ],
          it: [
            "setImmediate viene eseguita dopo il ciclo corrente dell'event loop nella fase check; setTimeout viene eseguita dopo almeno il ritardo specificato nella fase timers",
            'setImmediate è una versione basata su Promise di setTimeout(0)',
            'setTimeout è sincrona; setImmediate è asincrona',
            'Sono identiche ma setImmediate è deprecata',
          ],
        }),
        JSON.stringify({
          fr: "`setTimeout(fn, 0)` planifie `fn` dans la phase **timers** après au moins 0 ms (souvent un peu plus à cause du système). `setImmediate(fn)` planifie `fn` dans la phase **check** — après les événements d'I/O du cycle courant. Dans un callback d'I/O, `setImmediate` se déclenche toujours avant `setTimeout(fn, 0)` ; hors contexte I/O, l'ordre n'est pas garanti.",
          de: '`setTimeout(fn, 0)` plant `fn` in der **timers-Phase** nach mindestens 0 ms (oft etwas später wegen OS-Granularität). `setImmediate(fn)` plant `fn` in der **check-Phase** – nach den I/O-Ereignissen des aktuellen Zyklus. In einem I/O-Callback wird `setImmediate` immer vor `setTimeout(fn, 0)` ausgeführt; außerhalb eines I/O-Kontexts ist die Reihenfolge nicht deterministisch.',
          es: '`setTimeout(fn, 0)` programa `fn` en la fase **timers** tras al menos 0 ms (a menudo algo más por la granularidad del sistema). `setImmediate(fn)` programa `fn` en la fase **check**, después de los eventos de E/S del ciclo actual. Dentro de un callback de E/S, `setImmediate` siempre se ejecuta antes que `setTimeout(fn, 0)`; fuera de ese contexto, el orden no es determinista.',
          it: "`setTimeout(fn, 0)` pianifica `fn` nella fase **timers** dopo almeno 0 ms (spesso qualcosa in più per via del sistema operativo). `setImmediate(fn)` pianifica `fn` nella fase **check`, dopo gli eventi di I/O del ciclo corrente. In un callback di I/O, `setImmediate` verrà eseguita sempre prima di `setTimeout(fn, 0)`; fuori da quel contesto, l'ordine non è deterministico.",
        }),
        'd4100001-0000-4000-8001-000000000019',
      ]
    );

    // d4100001-0000-4000-8001-000000000020 - What is the fs module in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le module fs dans Node.js ?",
          de: 'Was ist das fs-Modul in Node.js?',
          es: '¿Qué es el módulo fs en Node.js?',
          it: "Che cos'è il modulo fs in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Un polyfill de navigateur pour parcourir le système de fichiers',
            'Le module intégré de Node.js pour interagir avec le système de fichiers — lire, écrire, supprimer et renommer des fichiers et dossiers',
            'Une bibliothèque de state management front-end pour Node.js',
            'Un module de compression de flux très rapide fourni avec Node.js',
          ],
          de: [
            'Ein File-System-Browser-Polyfill für Node.js',
            'Das eingebaute Node.js-Modul zur Interaktion mit dem Dateisystem – Dateien und Verzeichnisse lesen, schreiben, löschen und umbenennen',
            'Eine Frontend-State-Management-Bibliothek für Node.js',
            'Ein schnelles Stream-Komprimierungsmodul, das mit Node.js gebündelt wird',
          ],
          es: [
            'Un polyfill de navegador para explorar el sistema de archivos',
            'El módulo integrado de Node.js para interactuar con el sistema de archivos: leer, escribir, borrar y renombrar archivos y directorios',
            'Una librería de gestión de estado de front-end para Node.js',
            'Un módulo rápido de compresión de streams incluido con Node.js',
          ],
          it: [
            'Un polyfill da browser per navigare il file system',
            'Il modulo integrato di Node.js per interagire con il file system — leggere, scrivere, eliminare e rinominare file e directory',
            'Una libreria di state management front-end per Node.js',
            'Un modulo di compressione degli stream ad alte prestazioni fornito con Node.js',
          ],
        }),
        JSON.stringify({
          fr: "Le module `fs` (file system) fournit les API pour interagir avec le système de fichiers de l'OS. Méthodes clés : `fs.readFile()` / `fs.writeFile()` (asynchrone avec callbacks), `fs.promises.readFile()` (basé sur Promise), `fs.readFileSync()` (synchrone, bloque l'event loop), `fs.createReadStream()` / `fs.createWriteStream()` (streaming). En production, privilégiez les APIs asynchrones ou en streaming.",
          de: 'Das Modul `fs` (File System) stellt APIs zur Interaktion mit dem Betriebssystem-Dateisystem bereit. Wichtige Methoden: `fs.readFile()` / `fs.writeFile()` (asynchron mit Callbacks), `fs.promises.readFile()` (Promise-basiert), `fs.readFileSync()` (synchron, blockiert die Event-Loop), `fs.createReadStream()` / `fs.createWriteStream()` (Streaming). In produktivem Code sollten asynchrone oder Streaming-APIs bevorzugt werden.',
          es: 'El módulo `fs` (file system) proporciona APIs para interactuar con el sistema de archivos del sistema operativo. Métodos clave: `fs.readFile()` / `fs.writeFile()` (asíncronos con callbacks), `fs.promises.readFile()` (basado en Promises), `fs.readFileSync()` (sincrónico, bloquea el event loop), `fs.createReadStream()` / `fs.createWriteStream()` (streaming). En producción conviene usar APIs asíncronas o basadas en streams.',
          it: "Il modulo `fs` (file system) fornisce le API per interagire con il file system del sistema operativo. Metodi chiave: `fs.readFile()` / `fs.writeFile()` (asincroni con callback), `fs.promises.readFile()` (basato su Promise), `fs.readFileSync()` (sincrono, blocca l'event loop), `fs.createReadStream()` / `fs.createWriteStream()` (streaming). In produzione è meglio usare API asincrone o basate su stream.",
        }),
        'd4100001-0000-4000-8001-000000000020',
      ]
    );

    // d4100001-0000-4000-8001-000000000021 - What is the http module in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le module http dans Node.js ?",
          de: 'Was ist das http-Modul in Node.js?',
          es: '¿Qué es el módulo http en Node.js?',
          it: "Che cos'è il modulo http in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Une bibliothèque HTTP tierce équivalente à fetch',
            'Le module intégré de Node.js pour créer des serveurs HTTP et effectuer des requêtes HTTP sans dépendances externes',
            "Un module qui polyfill l'API fetch du navigateur dans Node.js",
            'Un middleware de compression pour les réponses HTTP',
          ],
          de: [
            'Eine externe HTTP-Client-Bibliothek, die fetch entspricht',
            'Das eingebaute Node.js-Modul zum Erstellen von HTTP-Servern und zum Absetzen von HTTP-Anfragen ohne externe Abhängigkeiten',
            'Ein Modul, das die browserseitige fetch-API in Node.js polyfilled',
            'Ein Kompressions-Middleware für HTTP-Antworten',
          ],
          es: [
            'Una librería HTTP de terceros equivalente a fetch',
            'El módulo integrado de Node.js para crear servidores HTTP y hacer peticiones HTTP sin dependencias externas',
            'Un módulo que polyfillea la API fetch del navegador en Node.js',
            'Un middleware de compresión para respuestas HTTP',
          ],
          it: [
            'Una libreria HTTP di terze parti equivalente a fetch',
            'Il modulo integrato di Node.js per creare server HTTP ed effettuare richieste HTTP senza dipendenze esterne',
            "Un modulo che polyfilla l'API fetch del browser in Node.js",
            'Un middleware di compressione per le risposte HTTP',
          ],
        }),
        JSON.stringify({
          fr: "Le module `http` permet de créer des serveurs HTTP avec `http.createServer((req, res) => { ... }).listen(3000)`. L'objet `req` est un `IncomingMessage` (stream lisible avec en-têtes, méthode, URL) et `res` est un `ServerResponse` (stream inscriptible). Pour les requêtes sortantes, on utilise `http.request(options, callback)`. En production, beaucoup de développeurs s'appuient sur Express ou Fastify qui encapsulent `http`.",
          de: 'Das Modul `http` ermöglicht das Erstellen von HTTP-Servern mit `http.createServer((req, res) => { ... }).listen(3000)`. `req` ist ein `IncomingMessage` (lesbarer Stream mit Headern, Methode, URL) und `res` ein `ServerResponse` (schreibbarer Stream). Für ausgehende Anfragen gibt es `http.request(options, callback)`. In der Praxis setzen viele Entwickler auf Express oder Fastify, die `http` mit einer komfortableren API umhüllen.',
          es: 'El módulo `http` permite crear servidores HTTP con `http.createServer((req, res) => { ... }).listen(3000)`. `req` es un `IncomingMessage` (stream legible con cabeceras, método y URL) y `res` es un `ServerResponse` (stream escribible). Para peticiones salientes se usa `http.request(options, callback)`. En producción la mayoría de desarrolladores utilizan Express o Fastify, que encapsulan `http` con una API más cómoda.',
          it: "Il modulo `http` consente di creare server HTTP con `http.createServer((req, res) => { ... }).listen(3000)`. `req` è un `IncomingMessage` (stream leggibile con header, metodo e URL) e `res` è un `ServerResponse` (stream scrivibile). Per le richieste in uscita si usa `http.request(options, callback)`. In produzione molti sviluppatori usano Express o Fastify, che incapsulano `http` offrendo un'API più ergonomica.",
        }),
        'd4100001-0000-4000-8001-000000000021',
      ]
    );

    // d4100001-0000-4000-8001-000000000022 - What is the path module in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le module path dans Node.js ?",
          de: 'Was ist das path-Modul in Node.js?',
          es: '¿Qué es el módulo path en Node.js?',
          it: "Che cos'è il modulo path in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Un module qui gère le routage HTTP dans Node.js',
            'Un module natif qui fournit des utilitaires pour travailler avec les chemins de fichiers et de dossiers de façon multiplateforme',
            'Un module pour résoudre les chemins vers les paquets npm',
            "Un module Node.js pour lire la variable d'environnement PATH",
          ],
          de: [
            'Ein Modul zum Routen von HTTP-Requests in Node.js',
            'Ein eingebautes Modul mit Hilfsfunktionen zum plattformunabhängigen Arbeiten mit Datei- und Verzeichnispfaden',
            'Ein Modul zum Auflösen von npm-Paketpfaden',
            'Ein Node.js-Modul zum Auslesen der PATH-Umgebungsvariablen',
          ],
          es: [
            'Un módulo para hacer routing de peticiones HTTP en Node.js',
            'Un módulo integrado que proporciona utilidades para trabajar con rutas de archivos y directorios de forma multiplataforma',
            'Un módulo para resolver rutas de paquetes de npm',
            'Un módulo de Node.js para leer la variable de entorno PATH',
          ],
          it: [
            'Un modulo che gestisce il routing HTTP in Node.js',
            'Un modulo integrato che fornisce utility per lavorare con i percorsi di file e directory in modo multipiattaforma',
            'Un modulo per risolvere i percorsi dei pacchetti npm',
            "Un modulo Node.js per leggere la variabile d'ambiente PATH",
          ],
        }),
        JSON.stringify({
          fr: "Le module `path` fournit des utilitaires de chemins multiplateformes : `path.join(...segments)` construit un chemin correct pour l'OS, `path.resolve()` donne un chemin absolu, `path.dirname()` / `path.basename()` / `path.extname()` extraient des parties du chemin et `path.sep` expose le séparateur (`/` ou `\\`). Utilisez toujours `path.join` plutôt que la concaténation de chaînes pour éviter les incompatibilités Windows/Linux.",
          de: 'Das Modul `path` bietet plattformunabhängige Pfad-Utilities: `path.join(...segments)` baut Pfade korrekt für das Betriebssystem, `path.resolve()` gibt einen absoluten Pfad zurück, `path.dirname()` / `path.basename()` / `path.extname()` extrahieren Pfadbestandteile und `path.sep` liefert den Trenner (`/` oder `\\`). Verwenden Sie `path.join` statt String-Konkatenation, um Windows/Linux-Inkompatibilitäten zu vermeiden.',
          es: 'El módulo `path` ofrece utilidades de rutas multiplataforma: `path.join(...segments)` construye una ruta correcta para el sistema operativo, `path.resolve()` devuelve una ruta absoluta, `path.dirname()` / `path.basename()` / `path.extname()` extraen partes de la ruta y `path.sep` expone el separador (`/` o `\\`). Usa siempre `path.join` en lugar de concatenar cadenas para evitar incompatibilidades entre Windows y Linux.',
          it: 'Il modulo `path` fornisce utility per i percorsi in modo multipiattaforma: `path.join(...segments)` costruisce un percorso corretto per il sistema operativo, `path.resolve()` restituisce un percorso assoluto, `path.dirname()` / `path.basename()` / `path.extname()` estraggono parti del percorso e `path.sep` espone il separatore (`/` o `\\`). Usa sempre `path.join` invece di concatenare stringhe per evitare incompatibilità tra Windows e Linux.',
        }),
        'd4100001-0000-4000-8001-000000000022',
      ]
    );

    // d4100001-0000-4000-8001-000000000023 - What is the __dirname variable in Node.js (CJS)?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que la variable __dirname dans Node.js (CJS) ?",
          de: 'Was ist die Variable __dirname in Node.js (CJS)?',
          es: '¿Qué es la variable __dirname en Node.js (CJS)?',
          it: "Che cos'è la variabile __dirname in Node.js (CJS)?",
        }),
        JSON.stringify({
          fr: [
            "Une variable globale qui pointe toujours vers le répertoire personnel de l'utilisateur courant",
            'Une variable propre à CommonJS qui contient le chemin absolu du dossier dans lequel se trouve le fichier de module courant',
            'Une variable Node.js pour le répertoire racine du projet',
            'Une globale ESM qui contient le chemin vers le dossier node_modules',
          ],
          de: [
            'Eine globale Variable, die immer auf das Home-Verzeichnis des aktuellen Benutzers zeigt',
            "Eine nur in CommonJS verfügbare Variable, die den absoluten Pfad des Verzeichnisses enthält, in dem sich die aktuelle Moduld'atei befindet",
            'Eine Node.js-Variable für das Projektwurzelverzeichnis',
            'Eine ESM-Globale, die auf den node_modules-Ordner zeigt',
          ],
          es: [
            'Una variable global que siempre apunta al directorio home del usuario actual',
            'Una variable propia de CommonJS que contiene la ruta absoluta del directorio en el que se encuentra el archivo de módulo actual',
            'Una variable de Node.js para el directorio raíz del proyecto',
            'Una global de ESM que contiene la ruta a la carpeta node_modules',
          ],
          it: [
            "Una variabile globale che punta sempre alla home dell'utente corrente",
            "Una variabile disponibile solo in CommonJS che contiene il percorso assoluto della cartella in cui si trova il file di modulo corrente",
            'Una variabile Node.js per la directory root del progetto',
            'Una globale ESM che contiene il percorso alla cartella node_modules',
          ],
        }),
        JSON.stringify({
          fr: "`__dirname` (et `__filename`) sont disponibles automatiquement dans les modules CommonJS. `__dirname` correspond au chemin absolu du dossier qui contient le fichier courant. Combiné avec `path.join(__dirname, '../config.json')`, il permet d'obtenir des chemins fiables, quel que soit le répertoire depuis lequel le process a été lancé. En ESM, on utilise `import.meta.url` et `new URL('./file', import.meta.url)` à la place.",
          de: "`__dirname` (und `__filename`) sind automatisch in CommonJS-Modulen verfügbar. `__dirname` ist der absolute Pfad des Verzeichnisses, das die aktuelle Datei enthält. Zusammen mit `path.join(__dirname, '../config.json')` erhält man zuverlässige Pfade, unabhängig davon, von wo aus der Prozess gestartet wurde. In ESM verwendet man stattdessen `import.meta.url` und `new URL('./file', import.meta.url)`.",
          es: "`__dirname` (y `__filename`) están disponibles automáticamente en los módulos CommonJS. `__dirname` es la ruta absoluta del directorio que contiene el archivo actual. Combinado con `path.join(__dirname, '../config.json')` te da rutas fiables sin importar desde qué directorio se haya iniciado el proceso. En ESM se usan `import.meta.url` y `new URL('./file', import.meta.url)` en su lugar.",
          it: "`__dirname` (insieme a `__filename`) è disponibile automaticamente nei moduli CommonJS. `__dirname` è il percorso assoluto della cartella che contiene il file corrente. In combinazione con `path.join(__dirname, '../config.json')` fornisce percorsi affidabili indipendentemente da dove è stato avviato il processo. In ESM si usano invece `import.meta.url` e `new URL('./file', import.meta.url)`.",
        }),
        'd4100001-0000-4000-8001-000000000023',
      ]
    );

    // d4100001-0000-4000-8001-000000000024 - What is error-first callback pattern in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le pattern de callback error-first dans Node.js ?",
          de: 'Was ist das Error-First-Callback-Pattern in Node.js?',
          es: '¿Qué es el patrón de callback error-first en Node.js?',
          it: "Che cos'è il pattern di callback error-first in Node.js?",
        }),
        JSON.stringify({
          fr: [
            "Un pattern où le premier argument d'un callback est réservé à l'erreur (null en cas de succès) et les suivants contiennent le résultat",
            'Un pattern où les erreurs sont toujours levées de façon synchrone avant tout travail asynchrone',
            'Une convention où les erreurs sont toujours passées en dernier argument des callbacks',
            'Un pattern try/catch spécifique à Node.js pour les fonctions asynchrones',
          ],
          de: [
            'Ein Muster, bei dem das erste Argument eines Callbacks für ein Error-Objekt reserviert ist (null bei Erfolg) und die folgenden Argumente das Ergebnis enthalten',
            'Ein Muster, bei dem Fehler immer synchron geworfen werden, bevor asynchrone Arbeit beginnt',
            'Eine Konvention, bei der Fehler immer als letztes Callback-Argument übergeben werden',
            'Ein Node.js-spezifisches try/catch-Pattern für asynchrone Funktionen',
          ],
          es: [
            'Un patrón en el que el primer argumento de un callback se reserva para un objeto de error (null si hay éxito) y los siguientes contienen el resultado',
            'Un patrón en el que los errores siempre se lanzan de forma síncrona antes de cualquier trabajo asíncrono',
            'Una convención en la que los errores se pasan siempre como último argumento de los callbacks',
            'Un patrón específico de try/catch de Node.js para funciones asíncronas',
          ],
          it: [
            "Un pattern in cui il primo argomento di una callback è riservato a un oggetto errore (null in caso di successo) e i successivi contengono il risultato",
            'Un pattern in cui gli errori vengono sempre lanciati in modo sincrono prima di qualsiasi lavoro asincrono',
            'Una convenzione in cui gli errori vengono passati sempre come ultimo argomento delle callback',
            'Un pattern try/catch specifico di Node.js per le funzioni asincrone',
          ],
        }),
        JSON.stringify({
          fr: "La convention error-first (errback) est : `callback(err, result)` où le premier argument vaut `null` en cas de succès ou une instance d'`Error` en cas d'échec. Exemple : `fs.readFile(path, (err, data) => { if (err) return handleError(err); use(data); })`. Ce pattern, antérieur aux Promises, est la convention asynchrone standard des APIs cœur de Node.js, même si Promises et async/await l'ont largement remplacé.",
          de: 'Die Error-First- (Errback-)Konvention lautet: `callback(err, result)`, wobei das erste Argument bei Erfolg `null` und bei Fehler eine `Error`-Instanz ist. Beispiel: `fs.readFile(path, (err, data) => { if (err) return handleError(err); use(data); })`. Dieses Muster stammt aus der Zeit vor Promises und ist der Standard für asynchrone Node.js-Core-APIs, auch wenn es heute oft von Promises und async/await abgelöst wird.',
          es: 'La convención error-first (errback) es: `callback(err, result)`, donde el primer argumento es `null` en caso de éxito o una instancia de `Error` en caso de fallo. Ejemplo: `fs.readFile(path, (err, data) => { if (err) return handleError(err); use(data); })`. Este patrón, anterior a las Promises, es la convención asíncrona estándar en las APIs principales de Node.js, aunque hoy en día las Promises y async/await lo han sustituido en gran medida.',
          it: "La convenzione error-first (errback) è: `callback(err, result)`, dove il primo argomento è `null` in caso di successo oppure un'istanza di `Error` in caso di errore. Esempio: `fs.readFile(path, (err, data) => { if (err) return handleError(err); use(data); })`. Questo pattern, precedente alle Promises, è la convenzione asincrona standard delle API core di Node.js, anche se Promises e async/await lo hanno in gran parte sostituito.",
        }),
        'd4100001-0000-4000-8001-000000000024',
      ]
    );

    // d4100001-0000-4000-8001-000000000025 - What is backpressure in Node.js streams?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le backpressure dans les streams Node.js ?",
          de: 'Was ist Backpressure in Node.js-Streams?',
          es: '¿Qué es el backpressure en los streams de Node.js?',
          it: "Che cos'è il backpressure negli stream di Node.js?",
        }),
        JSON.stringify({
          fr: [
            "La pression CPU causée par trop d'event listeners actifs",
            'Un mécanisme de contrôle de flux où un stream inscriptible signale à un stream lisible de faire une pause quand son buffer interne est plein',
            "Un signal TCP de backpressure au niveau de l'OS renvoyé à Node.js",
            'La pression mémoire due au stockage de gros Buffer dans le tas V8',
          ],
          de: [
            'CPU-Druck, der durch zu viele aktive Event Listener entsteht',
            'Ein Flusskontrollmechanismus, bei dem ein schreibbarer Stream einem lesbaren Stream signalisiert, die Datenzufuhr zu pausieren, wenn sein interner Puffer voll ist',
            'Ein TCP-Backpressure-Signal auf OS-Ebene, das an Node.js weitergeleitet wird',
            'Speicherdruck durch das Ablegen großer Buffer im V8-Heap',
          ],
          es: [
            'La presión de CPU causada por demasiados event listeners activos',
            'Un mecanismo de control de flujo en el que un stream escribible indica a un stream legible que pause el envío de datos cuando su búfer interno está lleno',
            'Una señal de backpressure de TCP a nivel de SO reenviada a Node.js',
            'La presión de memoria que produce almacenar Buffers grandes en el heap de V8',
          ],
          it: [
            "La pressione sulla CPU causata da troppi event listener attivi",
            'Un meccanismo di controllo del flusso in cui uno stream scrivibile segnala a uno stream leggibile di fermarsi quando il suo buffer interno è pieno',
            'Un segnale di backpressure TCP a livello di sistema operativo inoltrato a Node.js',
            "La pressione di memoria dovuta all'archiviazione di Buffer molto grandi nell'heap di V8",
          ],
        }),
        JSON.stringify({
          fr: "Le backpressure se produit quand le buffer d'un stream inscriptible se remplit plus vite qu'il ne se vide. Quand `write()` renvoie `false`, la source lisible doit arrêter d'appeler `read()` jusqu'à ce que le stream inscriptible émette l'événement `'drain'`. La méthode `pipe()` gère automatiquement ce mécanisme ; l'ignorer peut conduire à une explosion de l'utilisation mémoire.",
          de: "Backpressure entsteht, wenn sich der Puffer eines schreibbaren Streams schneller füllt, als er geleert werden kann. Gibt `write()` `false` zurück, sollte die lesbare Quelle aufhören, `read()` aufzurufen, bis der schreibbare Stream das `'drain'`-Event emittiert. Die Methode `pipe()` behandelt Backpressure automatisch; wird es ignoriert, kann der Speicherverbrauch unkontrolliert wachsen.",
          es: "El backpressure ocurre cuando el búfer de un stream escribible se llena más rápido de lo que se vacía. Cuando `write()` devuelve `false`, la fuente legible debe dejar de llamar a `read()` hasta que el stream escribible emita el evento `'drain'`. El método `pipe()` maneja este mecanismo automáticamente; ignorarlo puede provocar un crecimiento descontrolado de memoria.",
          it: "Il backpressure si verifica quando il buffer di uno stream scrivibile si riempie più velocemente di quanto riesca a svuotarsi. Quando `write()` restituisce `false`, la sorgente leggibile deve smettere di chiamare `read()` finché lo stream scrivibile non emette l'evento `'drain'`. Il metodo `pipe()` gestisce automaticamente il backpressure; ignorarlo può causare una crescita incontrollata della memoria.",
        }),
        'd4100001-0000-4000-8001-000000000025',
      ]
    );

    // d4100001-0000-4000-8001-000000000026 - What is the libuv thread pool used for in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'À quoi sert le thread pool de libuv dans Node.js ?',
          de: 'Wofür wird der libuv-Thread-Pool in Node.js verwendet?',
          es: '¿Para qué se utiliza el thread pool de libuv en Node.js?',
          it: 'A cosa serve il thread pool di libuv in Node.js?',
        }),
        JSON.stringify({
          fr: [
            'À exécuter tout le code JavaScript en parallèle sur plusieurs cœurs CPU',
            "À exécuter des opérations bloquantes (I/O disque, résolutions DNS, crypto, zlib) qui ne peuvent pas être rendues vraiment asynchrones au niveau de l'OS",
            "À exécuter le garbage collector en parallèle de l'event loop",
            'À exécuter setTimeout et setInterval dans un thread séparé',
          ],
          de: [
            'Um allen JavaScript-Code parallel über mehrere CPU-Kerne auszuführen',
            'Um blockierende Operationen (Datei-I/O, DNS-Lookups, Crypto, zlib) auszuführen, die auf OS-Ebene nicht wirklich asynchron sind',
            'Um den Garbage Collector parallel zur Event-Loop auszuführen',
            'Um setTimeout und setInterval in einem separaten Thread auszuführen',
          ],
          es: [
            'Para ejecutar todo el código JavaScript en paralelo en varios núcleos de CPU',
            'Para realizar operaciones bloqueantes (E/S de archivos, resoluciones DNS, criptografía, zlib) que no pueden hacerse realmente asíncronas a nivel de sistema operativo',
            'Para ejecutar el recolector de basura en paralelo al event loop',
            'Para ejecutar setTimeout y setInterval en un hilo separado',
          ],
          it: [
            'Per eseguire tutto il codice JavaScript in parallelo su più core CPU',
            "Per eseguire operazioni bloccanti (I/O su file, risoluzioni DNS, crypto, zlib) che non possono essere rese veramente asincrone a livello di sistema operativo",
            "Per eseguire il garbage collector in parallelo all'event loop",
            'Per eseguire setTimeout e setInterval in un thread separato',
          ],
        }),
        JSON.stringify({
          fr: "libuv maintient un thread pool de 4 threads par défaut (configurable avec `UV_THREADPOOL_SIZE`). Il prend en charge les opérations sur le système de fichiers, la résolution DNS (`dns.lookup`), certaines opérations de `crypto` et `zlib`. L'I/O réseau (TCP/UDP) n'utilise PAS ce pool mais les mécanismes asynchrones de l'OS. Augmenter la taille du pool peut aider lorsque de nombreuses opérations de fichier/crypto concurrentes sont en attente.",
          de: 'libuv verwaltet standardmäßig einen Thread-Pool mit 4 Threads (konfigurierbar über `UV_THREADPOOL_SIZE`). Er verarbeitet Dateisystemoperationen, DNS-Auflösungen (`dns.lookup`), bestimmte `crypto`- und `zlib`-Operationen. Netzwerk-I/O (TCP/UDP) nutzt diesen Pool NICHT, sondern OS-eigene asynchrone Mechanismen. Eine größere Poolgröße kann helfen, wenn viele gleichzeitige Datei-/Krypto-Operationen anstehen.',
          es: 'libuv mantiene un thread pool de 4 hilos por defecto (configurable mediante `UV_THREADPOOL_SIZE`). Se encarga de operaciones de sistema de archivos, resolución de DNS (`dns.lookup`), ciertas operaciones de `crypto` y `zlib`. La E/S de red (TCP/UDP) NO utiliza este pool sino los mecanismos asíncronos del sistema operativo. Aumentar el tamaño del pool puede ayudar cuando hay muchas operaciones de archivos/criptografía en paralelo.',
          it: "libuv mantiene un thread pool di 4 thread per default (configurabile tramite `UV_THREADPOOL_SIZE`). Gestisce le operazioni sul file system, la risoluzione DNS (`dns.lookup`), alcune operazioni di `crypto` e `zlib`. L'I/O di rete (TCP/UDP) NON usa questo pool ma le primitive asincrone del sistema operativo. Aumentare la dimensione del pool può aiutare quando molte operazioni su file/crypto sono in coda.",
        }),
        'd4100001-0000-4000-8001-000000000026',
      ]
    );

    // d4100001-0000-4000-8001-000000000027 - Difference between microtasks and macrotasks in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Quelle est la différence entre microtasks et macrotasks dans Node.js ?',
          de: 'Was ist der Unterschied zwischen Microtasks und Macrotasks in Node.js?',
          es: '¿Cuál es la diferencia entre microtasks y macrotasks en Node.js?',
          it: 'Qual è la differenza tra microtasks e macrotasks in Node.js?',
        }),
        JSON.stringify({
          fr: [
            'Les microtasks sont de petites opérations async ; les macrotasks sont des opérations sur de grands jeux de données',
            "Les microtasks (callbacks de Promise, process.nextTick) s'exécutent entre chaque phase de l'event loop ; les macrotasks (setTimeout, setImmediate, I/O) sont planifiées dans des phases spécifiques",
            'Les macrotasks tournent dans le thread pool ; les microtasks sur le thread principal',
            'Elles sont identiques — cette distinction ne concerne que les navigateurs, pas Node.js',
          ],
          de: [
            'Microtasks sind kleinere asynchrone Operationen; Macrotasks sind Operationen auf großen Datenmengen',
            'Microtasks (Promise-Callbacks, process.nextTick) laufen zwischen den Phasen der Event-Loop; Macrotasks (setTimeout, setImmediate, I/O) werden in bestimmten Phasen geplant',
            'Macrotasks laufen im Thread-Pool; Microtasks auf dem Hauptthread',
            'Sie sind identisch – die Unterscheidung gilt nur im Browser, nicht in Node.js',
          ],
          es: [
            'Las microtasks son operaciones asíncronas pequeñas; las macrotasks son operaciones sobre grandes conjuntos de datos',
            'Las microtasks (callbacks de Promise, process.nextTick) se ejecutan entre cada fase del event loop; las macrotasks (setTimeout, setImmediate, E/S) se programan en fases concretas',
            'Las macrotasks se ejecutan en el thread pool; las microtasks en el hilo principal',
            'Son idénticas: la distinción solo aplica en navegadores, no en Node.js',
          ],
          it: [
            'Le microtasks sono piccole operazioni asincrone; le macrotasks sono operazioni su grandi set di dati',
            "Le microtasks (callback delle Promise, process.nextTick) vengono eseguite tra una fase e l'altra dell'event loop; le macrotasks (setTimeout, setImmediate, I/O) sono pianificate in fasi specifiche",
            'Le macrotasks girano nel thread pool; le microtasks sul thread principale',
            'Sono identiche: la distinzione riguarda solo i browser, non Node.js',
          ],
        }),
        JSON.stringify({
          fr: "Après chaque phase de l'event loop (et après chaque macrotask), Node.js vide la **microtask queue** — qui contient les callbacks `process.nextTick` (priorité maximale) et les callbacks `.then` de Promise. L'event loop ne passe à la phase suivante que lorsque cette file est vide. Cela signifie que `nextTick` et les Promises résolues s'exécutent toujours avant `setImmediate` ou le prochain callback d'I/O.",
          de: 'Nach jeder Event-Loop-Phase (und nach jeder Macrotask) leert Node.js die **Microtask-Queue**, die `process.nextTick`-Callbacks (höchste Priorität) und Promise-`.then`-Callbacks enthält. Erst wenn diese Schlange leer ist, geht die Event-Loop in die nächste Phase über. Dadurch laufen `nextTick` und aufgelöste Promises immer vor `setImmediate` oder dem nächsten I/O-Callback.',
          es: 'Tras cada fase del event loop (y tras cada macrotask), Node.js vacía la **cola de microtasks**, que incluye callbacks de `process.nextTick` (de máxima prioridad) y callbacks `.then` de Promise. Solo cuando la cola está vacía, el event loop avanza a la fase siguiente. Esto significa que `nextTick` y las Promises resueltas se ejecutan siempre antes que `setImmediate` o el próximo callback de E/S.',
          it: "Dopo ogni fase dell'event loop (e dopo ogni macrotask), Node.js svuota la **microtask queue**, che include le callback di `process.nextTick` (priorità massima) e le callback `.then` delle Promise. Solo quando la coda è vuota l'event loop passa alla fase successiva. Questo significa che `nextTick` e le Promise risolte vengono sempre eseguite prima di `setImmediate` o del successivo callback di I/O.",
        }),
        'd4100001-0000-4000-8001-000000000027',
      ]
    );

    // d4100001-0000-4000-8001-000000000028 - What is module caching in Node.js CJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le module caching en CommonJS dans Node.js ?",
          de: 'Was ist Module Caching in Node.js CommonJS?',
          es: '¿Qué es el módulo de caching en Node.js CJS?',
          it: "Che cos'è il module caching in Node.js CJS?",
        }),
        JSON.stringify({
          fr: [
            'Un cache basé sur Redis pour les imports de modules npm',
            'Le comportement où require() renvoie le même objet exporté lors des appels suivants — le module est exécuté une fois et son export est stocké dans require.cache',
            'Une optimisation de V8 qui compile en code machine les modules fréquemment utilisés',
            'Une fonctionnalité de npm qui met en cache les paquets téléchargés sur disque',
          ],
          de: [
            'Ein Redis-basierter Cache für npm-Modulimporte',
            'Das Verhalten, bei dem `require()` bei späteren Aufrufen dasselbe Export-Objekt zurückgibt – das Modul wird einmal ausgeführt und seine Exporte werden in `require.cache` gespeichert',
            'Eine V8-Optimierung, die häufig verwendete Module in Maschinencode kompiliert',
            'Ein npm-Feature, das heruntergeladene Pakete auf der Festplatte cached',
          ],
          es: [
            'Una caché basada en Redis para imports de módulos de npm',
            'El comportamiento por el que require() devuelve el mismo objeto exportado en llamadas posteriores: el módulo se ejecuta una vez y sus exports se guardan en require.cache',
            'Una optimización de V8 que compila a código máquina los módulos usados frecuentemente',
            'Una característica de npm que cachea en disco los paquetes descargados',
          ],
          it: [
            'Una cache basata su Redis per gli import dei moduli npm',
            'Il comportamento per cui `require()` restituisce lo stesso oggetto esportato alle chiamate successive — il modulo viene eseguito una sola volta e i suoi export sono memorizzati in `require.cache`',
            "Un'ottimizzazione di V8 che compila in codice macchina i moduli utilizzati più spesso",
            'Una funzionalità di npm che memorizza nella cache i pacchetti scaricati su disco',
          ],
        }),
        JSON.stringify({
          fr: "En CJS, la première fois que vous faites `require('./foo')`, Node.js exécute `foo.js` et stocke le `module.exports` résultant dans `require.cache` sous la clé du chemin de fichier résolu. Tous les `require` suivants vers ce même chemin renvoient l'objet mis en cache sans réexécuter le fichier. Les modules se comportent donc comme des singletons ; supprimer une entrée de `require.cache` force un rechargement (utile en tests).",
          de: "In CommonJS gilt: Beim ersten `require('./foo')` führt Node.js `foo.js` aus und speichert das resultierende `module.exports` in `require.cache`, indiziert mit dem aufgelösten Dateinamen. Alle weiteren `require`-Aufrufe für denselben Pfad liefern das gecachte Export-Objekt, ohne die Datei erneut auszuführen. Module verhalten sich damit wie Singletons; entfernt man einen Eintrag aus `require.cache`, wird ein erneutes Laden erzwungen (nützlich in Tests).",
          es: "En CJS, la primera vez que haces `require('./foo')`, Node.js ejecuta `foo.js` y guarda el `module.exports` resultante en `require.cache` con la ruta del archivo resuelta como clave. Todas las llamadas posteriores a `require` con esa ruta devuelven el export cacheado sin volver a ejecutar el archivo. Los módulos se comportan así como singletons; si eliminas una entrada de `require.cache` fuerzas una recarga (útil en tests).",
          it: "In CJS, alla prima chiamata `require('./foo')` Node.js esegue `foo.js` e salva il `module.exports` risultante in `require.cache`, indicizzato con il percorso risolto del file. Tutte le chiamate successive a `require` per lo stesso percorso restituiscono l'export in cache senza rieseguire il file. I moduli si comportano quindi come dei singleton; rimuovere una voce da `require.cache` forza un nuovo caricamento (utile nei test).",
        }),
        'd4100001-0000-4000-8001-000000000028',
      ]
    );

    // d4100001-0000-4000-8001-000000000029 - Differences between cluster module and worker_threads
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Quelles sont les principales différences entre le module cluster et worker_threads ?',
          de: 'Was sind die wichtigsten Unterschiede zwischen dem Modul cluster und worker_threads?',
          es: '¿Cuáles son las principales diferencias entre el módulo cluster y worker_threads?',
          it: 'Quali sono le principali differenze tra il modulo cluster e worker_threads?',
        }),
        JSON.stringify({
          fr: [
            'cluster utilise la mémoire partagée ; worker_threads utilisent des process séparés',
            'cluster crée des process OS distincts (chacun avec sa propre event loop et son propre tas V8) qui partagent un port ; worker_threads tournent dans le même process et partagent la mémoire via SharedArrayBuffer',
            'worker_threads sont faits pour les tâches CPU ; cluster est pour les tâches GPU',
            'Ils sont identiques — cluster est juste une API plus haut niveau au-dessus de worker_threads',
          ],
          de: [
            'cluster nutzt gemeinsamen Speicher; worker_threads nutzen getrennte Prozesse',
            'cluster erstellt separate Betriebssystemprozesse (jeweils mit eigener Event-Loop und eigenem V8-Heap), die sich einen Port teilen; worker_threads laufen im selben Prozess und können Speicher über SharedArrayBuffer teilen',
            'worker_threads sind für CPU-Aufgaben; cluster für GPU-Aufgaben',
            'Sie sind identisch – cluster ist nur eine höherstufige API über worker_threads',
          ],
          es: [
            'cluster usa memoria compartida; worker_threads usan procesos separados',
            'cluster crea procesos de SO separados (cada uno con su propio event loop y heap de V8) que comparten un puerto; worker_threads se ejecutan en el mismo proceso y comparten memoria mediante SharedArrayBuffer',
            'worker_threads son para tareas de CPU; cluster para tareas de GPU',
            'Son idénticos: cluster es solo una API de más alto nivel sobre worker_threads',
          ],
          it: [
            'cluster usa memoria condivisa; worker_threads usano processi separati',
            'cluster crea processi del sistema operativo separati (ognuno con il proprio event loop e heap V8) che condividono una porta; worker_threads girano nello stesso processo e possono condividere memoria tramite SharedArrayBuffer',
            'worker_threads sono per compiti CPU; cluster per compiti GPU',
            "Sono identici: cluster è solo un'API di livello più alto sopra worker_threads",
          ],
        }),
        JSON.stringify({
          fr: "`cluster` fork des process Node.js séparés — chacun a son propre tas V8, son event loop et son espace mémoire. La communication se fait via IPC (plus isolé mais plus lent). `worker_threads` tournent dans le même process et peuvent partager la mémoire via `SharedArrayBuffer` (plus rapide). On utilise généralement cluster pour scaler des serveurs HTTP sur plusieurs cœurs et worker_threads pour les calculs intensifs qui doivent partager des données efficacement.",
          de: '`cluster` startet separate Node.js-Prozesse – jeder mit eigenem V8-Heap, eigener Event-Loop und eigenem Adressraum. Die Kommunikation erfolgt über IPC (langsamer, aber isolierter). `worker_threads` laufen im selben Prozess und können Speicher über `SharedArrayBuffer` teilen (schneller). Typischerweise nutzt man cluster zum Skalieren von HTTP-Servern über CPU-Kerne hinweg und worker_threads für rechenintensive Aufgaben mit gemeinsam genutzten Daten.',
          es: '`cluster` hace fork de procesos de Node.js separados, cada uno con su propio heap de V8, event loop y espacio de memoria. La comunicación es mediante IPC (más aislado pero más lento). `worker_threads` se ejecutan en el mismo proceso y pueden compartir memoria mediante `SharedArrayBuffer` (más rápido). Normalmente se usa cluster para escalar servidores HTTP entre varios núcleos y worker_threads para cálculos intensivos que necesitan compartir datos eficientemente.',
          it: '`cluster` crea processi Node.js separati, ognuno con il proprio heap V8, event loop e spazio di memoria. La comunicazione avviene tramite IPC (più isolata ma più lenta). `worker_threads` girano nello stesso processo e possono condividere memoria tramite `SharedArrayBuffer` (più veloce). In genere si usa cluster per scalare server HTTP su più core e worker_threads per calcoli intensivi che devono condividere dati in modo efficiente.',
        }),
        'd4100001-0000-4000-8001-000000000029',
      ]
    );

    // d4100001-0000-4000-8001-000000000030 - What is the crypto module in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le module crypto dans Node.js ?",
          de: 'Was ist das crypto-Modul in Node.js?',
          es: '¿Qué es el módulo crypto en Node.js?',
          it: "Che cos'è il modulo crypto in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Une bibliothèque tierce pour le développement blockchain en Node.js',
            "Le module intégré de Node.js qui fournit des fonctionnalités cryptographiques comme le hashing, les HMAC, les chiffrements, la génération de clés et les signatures numériques",
            "Un module dédié uniquement au chiffrement des variables d'environnement",
            'Une implémentation Node.js de la Web Crypto API des navigateurs',
          ],
          de: [
            'Eine Drittanbieterbibliothek für Blockchain-Entwicklung in Node.js',
            'Das eingebaute Node.js-Modul, das kryptografische Funktionen wie Hashing, HMAC, Cipher, Schlüsselgenerierung und digitale Signaturen bereitstellt',
            'Ein Modul, das ausschließlich Umgebungsvariablen verschlüsselt',
            'Eine Node.js-Implementierung der Web Crypto API aus dem Browser',
          ],
          es: [
            'Una librería de terceros para desarrollo de blockchain en Node.js',
            'El módulo integrado de Node.js que proporciona funcionalidad criptográfica como hashing, HMAC, cifrados, generación de claves y firmas digitales',
            'Un módulo dedicado solo a cifrar variables de entorno',
            'Una implementación en Node.js de la Web Crypto API del navegador',
          ],
          it: [
            'Una libreria di terze parti per lo sviluppo blockchain in Node.js',
            'Il modulo integrato di Node.js che fornisce funzionalità crittografiche come hashing, HMAC, cifrari, generazione di chiavi e firme digitali',
            "Un modulo dedicato esclusivamente alla cifratura delle variabili d'ambiente",
            "Un'implementazione Node.js della Web Crypto API del browser",
          ],
        }),
        JSON.stringify({
          fr: "Le module intégré `crypto` de Node.js encapsule OpenSSL. APIs clés : `crypto.createHash('sha256').update(data).digest('hex')` (hashing), `crypto.createHmac()` (HMAC), `crypto.randomBytes(n)` (aléatoire sécurisé), `crypto.createCipher/Decipher()` (chiffrement symétrique) et `crypto.generateKeyPair()` (asymétrique). Pour de la crypto compatible navigateur, `globalThis.crypto` (WebCrypto API) est aussi disponible à partir de Node 19+.",
          de: "Das eingebaute Modul `crypto` in Node.js nutzt OpenSSL. Wichtige APIs: `crypto.createHash('sha256').update(data).digest('hex')` (Hashing), `crypto.createHmac()` (HMAC), `crypto.randomBytes(n)` (kryptografisch sichere Zufallszahlen), `crypto.createCipher/Decipher()` (symmetrische Verschlüsselung) und `crypto.generateKeyPair()` (asymmetrische Schlüssel). Für browserkompatible Kryptografie steht in Node.js 19+ zusätzlich `globalThis.crypto` (WebCrypto API) zur Verfügung.",
          es: "El módulo integrado `crypto` de Node.js envuelve OpenSSL. APIs clave: `crypto.createHash('sha256').update(data).digest('hex')` (hashing), `crypto.createHmac()` (HMAC), `crypto.randomBytes(n)` (aleatoriedad segura), `crypto.createCipher/Decipher()` (cifrado simétrico) y `crypto.generateKeyPair()` (claves asimétricas). Para criptografía compatible con navegador, `globalThis.crypto` (WebCrypto API) también está disponible en Node.js 19+.",
          it: "Il modulo integrato `crypto` di Node.js incapsula OpenSSL. API principali: `crypto.createHash('sha256').update(data).digest('hex')` (hashing), `crypto.createHmac()` (HMAC), `crypto.randomBytes(n)` (random sicuro), `crypto.createCipher/Decipher()` (cifratura simmetrica) e `crypto.generateKeyPair()` (chiavi asimmetriche). Per una crittografia compatibile browser è disponibile anche `globalThis.crypto` (WebCrypto API) da Node.js 19+.",
        }),
        'd4100001-0000-4000-8001-000000000030',
      ]
    );

    // d4100001-0000-4000-8001-000000000031 - What is CJS/ESM interoperability in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que l'interopérabilité CJS/ESM dans Node.js ?",
          de: 'Was bedeutet CJS/ESM-Interoperabilität in Node.js?',
          es: '¿Qué es la interoperabilidad CJS/ESM en Node.js?',
          it: "Che cos'è l'interoperabilità CJS/ESM in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Les modules CJS et ESM sont totalement compatibles et peuvent être mélangés librement',
            "CJS peut faire require() d'un module ESM de façon asynchrone dans Node.js 22+ ; ESM peut importer des modules CJS mais ne reçoit que l'export par défaut (module.exports) — les exports nommés CJS ne sont pas importables individuellement via un import ESM statique",
            'ESM ne peut pas du tout importer de modules CJS',
            'CJS et ESM sont identiques dans Node.js — "type":"module" est un simple drapeau cosmétique',
          ],
          de: [
            'CJS- und ESM-Module sind vollständig kompatibel und frei mischbar',
            'CJS kann in Node.js 22+ ESM-Module asynchron per require() laden; ESM kann CJS-Module importieren, erhält dabei aber nur den Default-Export (`module.exports`); benannte CJS-Exporte sind nicht direkt als einzelne ESM-Imports verfügbar',
            'ESM kann überhaupt keine CJS-Module importieren',
            'CJS und ESM sind in Node.js identisch – "type":"module" ist nur ein kosmetischer Schalter',
          ],
          es: [
            'Los módulos CJS y ESM son totalmente compatibles y se pueden mezclar libremente',
            'CJS puede hacer require() de módulos ESM de forma asíncrona en Node.js 22+; ESM puede importar módulos CJS pero solo obtiene el export por defecto (`module.exports`); los exports con nombre de CJS no se pueden importar individualmente con un import ESM estático',
            'ESM no puede importar en absoluto módulos CJS',
            'CJS y ESM son idénticos en Node.js: "type":"module" es solo una marca cosmética',
          ],
          it: [
            'I moduli CJS ed ESM sono totalmente compatibili e possono essere mescolati liberamente',
            "CJS può fare require() di moduli ESM in modo asincrono in Node.js 22+; ESM può importare moduli CJS ma ottiene solo l'export di default (`module.exports`); gli export nominali CJS non sono importabili singolarmente tramite un import ESM statico",
            'ESM non può importare affatto moduli CJS',
            'CJS ed ESM sono identici in Node.js — "type":"module" è solo un flag cosmetico',
          ],
        }),
        JSON.stringify({
          fr: "CJS → ESM : utiliser l'import dynamique `await import('esm-pkg')` (seule option dans Node.js < 22 ; un require() synchrone d'un ESM lève une erreur). ESM → CJS : `import cjsMod from './cjs.cjs'` fonctionne mais ne donne que `module.exports` comme export par défaut — les exports nommés doivent être extraits de cet objet. Cette asymétrie est une cause fréquente d'erreurs \"package is ESM only\" lors de la consommation de paquets modernes.",
          de: "CJS → ESM: Verwende dynamisches `await import('esm-pkg')` (die einzige Option in Node.js < 22; ein synchrones `require()` von ESM wirft einen Fehler). ESM → CJS: `import cjsMod from './cjs.cjs'` funktioniert, liefert aber nur `module.exports` als Default-Export – benannte Exporte müssen daraus destrukturiert werden. Diese Asymmetrie ist eine häufige Ursache für Fehler wie \"package is ESM only\" beim Konsum moderner Pakete.",
          es: "CJS → ESM: usa `await import('esm-pkg')` de forma dinámica (la única opción en Node.js < 22; un `require()` síncrono de un ESM lanza error). ESM → CJS: `import cjsMod from './cjs.cjs'` funciona pero solo entrega `module.exports` como export por defecto; los exports con nombre deben desestructurarse a partir de ese objeto. Esta asimetría es una fuente común de errores del tipo \"package is ESM only\" al consumir paquetes modernos.",
          it: "CJS → ESM: si usa l'import dinamico `await import('esm-pkg')` (l'unica opzione in Node.js < 22; un `require()` sincrono di un ESM genera un errore). ESM → CJS: `import cjsMod from './cjs.cjs'` funziona ma restituisce solo `module.exports` come default export, quindi gli export nominali devono essere destrutturati da quell'oggetto. Questa asimmetria è una causa frequente di errori \"package is ESM only\" quando si consumano pacchetti moderni.",
        }),
        'd4100001-0000-4000-8001-000000000031',
      ]
    );

    // d4100001-0000-4000-8001-000000000032 - What is the util module in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le module util dans Node.js ?",
          de: 'Was ist das util-Modul in Node.js?',
          es: '¿Qué es el módulo util en Node.js?',
          it: "Che cos'è il modulo util in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Un module \"utility belt\" pour construire des middlewares Express',
            "Un module natif de Node.js qui fournit des fonctions utilitaires comme util.promisify(), util.inspect(), util.format() et util.types",
            'Un module pour créer des CLI avec readline',
            'Une bibliothèque utilitaire de type lodash intégrée à Node.js',
          ],
          de: [
            'Ein „Utility Belt“-Modul zum Bauen von Express-Middleware',
            'Ein eingebautes Node.js-Modul mit Hilfsfunktionen wie util.promisify(), util.inspect(), util.format() und util.types',
            'Ein Modul zum Erstellen von CLI-Tools mit readline',
            'Eine lodash-ähnliche Utility-Bibliothek, die in Node.js eingebaut ist',
          ],
          es: [
            'Un módulo “utility belt” para construir middlewares de Express',
            'Un módulo integrado de Node.js con funciones de ayuda como util.promisify(), util.inspect(), util.format() y util.types',
            'Un módulo para construir CLI con readline',
            'Una librería de utilidades tipo lodash integrada en Node.js',
          ],
          it: [
            'Un modulo "utility belt" per costruire middleware Express',
            'Un modulo integrato di Node.js con funzioni di utilità come util.promisify(), util.inspect(), util.format() e util.types',
            'Un modulo per creare CLI usando readline',
            'Una libreria di utility in stile lodash integrata in Node.js',
          ],
        }),
        JSON.stringify({
          fr: "Parmi les utilitaires clés de `util` : `util.promisify(fn)` convertit une fonction à callback error-first en fonction qui renvoie une Promise ; `util.inspect(obj, opts)` convertit un objet en chaîne (utilisé en interne par `console.log`) ; `util.format(fmt, ...args)` fait un formatage de type printf ; `util.types` fournit des helpers de typage et `util.deprecate()` enveloppe une fonction pour émettre un avertissement de dépréciation.",
          de: 'Zu den wichtigsten Helfern von `util` gehören: `util.promisify(fn)` konvertiert eine Error-First-Callback-Funktion in eine Promise-basierte Funktion; `util.inspect(obj, opts)` wandelt ein Objekt in einen String um (wird intern von `console.log` verwendet); `util.format(fmt, ...args)` formatiert Strings ähnlich wie printf; `util.types` stellt Typprüfungs-Helfer bereit und `util.deprecate()` versieht Funktionen mit Deprecation-Warnungen.',
          es: 'Entre las utilidades clave de `util` están: `util.promisify(fn)` convierte una función con callback error-first en una función que devuelve una Promise; `util.inspect(obj, opts)` convierte un objeto en cadena (lo usa internamente `console.log`); `util.format(fmt, ...args)` hace formateo estilo printf; `util.types` ofrece helpers de tipos y `util.deprecate()` envuelve una función para emitir avisos de deprecación.',
          it: 'Tra le utility principali di `util`: `util.promisify(fn)` converte una funzione con callback error-first in una funzione che restituisce una Promise; `util.inspect(obj, opts)` converte un oggetto in stringa (è usato internamente da `console.log`); `util.format(fmt, ...args)` formatta stringhe in stile printf; `util.types` fornisce helper per il controllo dei tipi e `util.deprecate()` avvolge una funzione per emettere avvisi di deprecazione.',
        }),
        'd4100001-0000-4000-8001-000000000032',
      ]
    );

    // d4100001-0000-4000-8001-000000000033 - What is the os module in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le module os dans Node.js ?",
          de: 'Was ist das os-Modul in Node.js?',
          es: '¿Qué es el módulo os en Node.js?',
          it: "Che cos'è il modulo os in Node.js?",
        }),
        JSON.stringify({
          fr: [
            "Un module qui donne accès au shell du système d'exploitation",
            'Un module natif qui fournit des informations sur le système : plateforme, CPU, mémoire, hostname, répertoire utilisateur et interfaces réseau',
            "Un module pour créer des daemons au niveau de l'OS",
            "Une couche d'abstraction pour lancer des conteneurs Docker depuis Node.js",
          ],
          de: [
            'Ein Modul, das Zugriff auf die System-Shell bietet',
            'Ein eingebautes Modul, das Betriebssysteminformationen liefert: Plattform, CPU-Infos, Speicher, Hostname, Home-Verzeichnis und Netzwerkinterfaces',
            'Ein Modul zum Erstellen von OS-Daemons',
            'Eine Abstraktionsschicht zum Starten von Docker-Containern aus Node.js heraus',
          ],
          es: [
            'Un módulo que da acceso al shell del sistema operativo',
            'Un módulo integrado que proporciona utilidades relacionadas con el sistema operativo: plataforma, información de CPU, memoria, hostname, directorio home e interfaces de red',
            'Un módulo para crear demonios a nivel de SO',
            'Una capa de abstracción para ejecutar contenedores Docker desde Node.js',
          ],
          it: [
            'Un modulo che fornisce accesso alla shell del sistema operativo',
            'Un modulo integrato che fornisce informazioni sul sistema operativo: piattaforma, CPU, memoria, hostname, directory home e interfacce di rete',
            'Un modulo per creare daemon a livello di sistema operativo',
            'Un livello di astrazione per eseguire container Docker da Node.js',
          ],
        }),
        JSON.stringify({
          fr: "Le module `os` fournit des informations sur le système : `os.platform()` ('linux', 'darwin', 'win32'), `os.cpus()` (tableau décrivant les cœurs CPU), `os.totalmem()` / `os.freemem()` (en octets), `os.hostname()`, `os.homedir()`, `os.tmpdir()`, `os.networkInterfaces()` et `os.EOL` (fin de ligne). Il est utile pour le diagnostic, pour configurer la taille du thread pool en fonction des cœurs ou pour écrire des CLI multiplateformes.",
          de: "Das Modul `os` liefert Systeminformationen: `os.platform()` ('linux', 'darwin', 'win32'), `os.cpus()` (Array mit CPU-Core-Infos), `os.totalmem()` / `os.freemem()` (Bytes), `os.hostname()`, `os.homedir()`, `os.tmpdir()`, `os.networkInterfaces()` und `os.EOL` (Zeilenende). Es wird z. B. für Diagnosen, zum Setzen der Thread-Pool-Größe anhand der CPU-Anzahl oder beim Bau plattformübergreifender CLI-Tools verwendet.",
          es: "El módulo `os` proporciona información del sistema: `os.platform()` ('linux', 'darwin', 'win32'), `os.cpus()` (array con información de los núcleos de CPU), `os.totalmem()` / `os.freemem()` (en bytes), `os.hostname()`, `os.homedir()`, `os.tmpdir()`, `os.networkInterfaces()` y `os.EOL` (fin de línea). Es útil para diagnósticos, para ajustar el tamaño del thread pool según los núcleos o para construir herramientas de CLI multiplataforma.",
          it: "Il modulo `os` fornisce informazioni sul sistema: `os.platform()` ('linux', 'darwin', 'win32'), `os.cpus()` (array con le informazioni sui core CPU), `os.totalmem()` / `os.freemem()` (in byte), `os.hostname()`, `os.homedir()`, `os.tmpdir()`, `os.networkInterfaces()` e `os.EOL` (fine riga). È utile per la diagnostica, per impostare la dimensione del thread pool in base ai core o per costruire CLI multipiattaforma.",
        }),
        'd4100001-0000-4000-8001-000000000033',
      ]
    );

    // d4100001-0000-4000-8001-000000000034 - What is a Transform stream in Node.js?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un Transform stream dans Node.js ?",
          de: 'Was ist ein Transform-Stream in Node.js?',
          es: '¿Qué es un Transform stream en Node.js?',
          it: "Che cos'è un Transform stream in Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Un stream qui ne fait que lire et transforme les données en place',
            "Un stream duplex qui modifie ou transforme les données à mesure qu'elles sont écrites, en rendant les données transformées disponibles en lecture",
            'Un stream lisible qui émet des événements transformés au lieu de données',
            'Un stream inscriptible avec compression intégrée',
          ],
          de: [
            'Ein Stream, der nur liest und Daten inplace transformiert',
            'Ein Duplex-Stream, der Daten beim Schreiben transformiert und das transformierte Ergebnis lesbar macht',
            'Ein lesbarer Stream, der transformierte Events statt Daten-Events emittiert',
            'Ein schreibbarer Stream mit integrierter Kompression',
          ],
          es: [
            'Un stream que solo lee y transforma los datos en el sitio',
            'Un stream duplex que modifica o transforma los datos a medida que se escriben, poniendo a disposición los datos transformados para lectura',
            'Un stream legible que emite eventos transformados en lugar de eventos de datos',
            'Un stream escribible con compresión integrada',
          ],
          it: [
            'Uno stream che legge soltanto e trasforma i dati in place',
            'Uno stream duplex che modifica o trasforma i dati mentre vengono scritti, rendendo disponibili in lettura i dati trasformati',
            'Uno stream leggibile che emette eventi trasformati al posto di eventi di dati',
            'Uno stream scrivibile con compressione integrata',
          ],
        }),
        JSON.stringify({
          fr: "Un Transform stream implémente à la fois les interfaces Readable et Writable. On y écrit des données en entrée, il les traite, puis on lit en sortie le résultat transformé. Pour en créer un, on étend `Transform` et on implémente `_transform(chunk, encoding, callback)`. Des exemples sont `zlib.createGzip()` (compression) ou `crypto.createCipheriv()` (chiffrement). Les Transform streams se chaînent avec `pipe()` pour former des pipelines de traitement.",
          de: 'Ein Transform-Stream implementiert sowohl die Readable- als auch die Writable-Schnittstelle. Man schreibt Daten hinein, der Stream verarbeitet sie und man liest das transformierte Ergebnis heraus. Zur Erstellung erweitert man `Transform` und implementiert `_transform(chunk, encoding, callback)`. Beispiele sind `zlib.createGzip()` (Kompression) oder `crypto.createCipheriv()` (Verschlüsselung). Transform-Streams lassen sich mit `pipe()` zu Verarbeitungspipelines verketten.',
          es: 'Un Transform stream implementa tanto la interfaz Readable como la Writable. Se escriben datos en él, los procesa y luego se leen los resultados transformados. Para crear uno se extiende `Transform` e implementa `_transform(chunk, encoding, callback)`. Ejemplos son `zlib.createGzip()` (compresión) o `crypto.createCipheriv()` (cifrado). Los Transform streams se encadenan con `pipe()` para construir pipelines de procesamiento.',
          it: "Un Transform stream implementa sia l'interfaccia Readable che quella Writable. Si scrivono i dati in ingresso, li elabora e si leggono in uscita i risultati trasformati. Per crearne uno si estende `Transform` e si implementa `_transform(chunk, encoding, callback)`. Esempi sono `zlib.createGzip()` (compressione) o `crypto.createCipheriv()` (cifratura). I Transform stream possono essere concatenati con `pipe()` per creare pipeline di elaborazione.",
        }),
        'd4100001-0000-4000-8001-000000000034',
      ]
    );

    // d4100001-0000-4000-8001-000000000035 - What is graceful shutdown in a Node.js HTTP server?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le graceful shutdown dans un serveur HTTP Node.js ?",
          de: 'Was bedeutet Graceful Shutdown bei einem Node.js-HTTP-Server?',
          es: '¿Qué es el graceful shutdown en un servidor HTTP de Node.js?',
          it: "Che cos'è il graceful shutdown in un server HTTP Node.js?",
        }),
        JSON.stringify({
          fr: [
            'Arrêter le serveur en lui envoyant un SIGTERM depuis un autre process',
            "Le pattern qui consiste à écouter les signaux SIGTERM/SIGINT, à arrêter d'accepter de nouvelles connexions, à attendre la fin des requêtes en cours puis à quitter proprement",
            "Appeler process.exit(0) immédiatement à la réception d'un signal d'arrêt",
            'Utiliser cluster.fork() pour redémarrer les workers sans coupure',
          ],
          de: [
            'Den Server durch Senden eines SIGTERM aus einem anderen Prozess herunterfahren',
            'Das Muster, bei dem man auf SIGTERM/SIGINT hört, den Server daran hindert, neue Verbindungen anzunehmen, laufende Anfragen beendet und dann sauber beendet',
            'Sofortiges Aufrufen von process.exit(0) beim Empfang eines Shutdown-Signals',
            'Verwendung von cluster.fork(), um Worker ohne Downtime neu zu starten',
          ],
          es: [
            'Apagar el servidor enviándole una señal SIGTERM desde otro proceso',
            'El patrón que consiste en escuchar las señales SIGTERM/SIGINT, dejar de aceptar nuevas conexiones, esperar a que terminen las peticiones en curso y luego salir de forma limpia',
            'Llamar a process.exit(0) inmediatamente al recibir una señal de apagado',
            'Usar cluster.fork() para reiniciar workers sin tiempo de inactividad',
          ],
          it: [
            'Spegnere il server inviando un SIGTERM da un altro processo',
            'Il pattern che prevede di ascoltare i segnali SIGTERM/SIGINT, smettere di accettare nuove connessioni, attendere che le richieste in corso finiscano e poi terminare in modo pulito',
            'Chiamare process.exit(0) immediatamente alla ricezione di un segnale di spegnimento',
            'Usare cluster.fork() per riavviare i worker senza downtime',
          ],
        }),
        JSON.stringify({
          fr: "Le graceful shutdown garantit que les requêtes en cours ne sont pas interrompues brutalement lorsque le process reçoit un signal d'arrêt (par exemple `SIGTERM` depuis Kubernetes). Le pattern typique est : `process.on('SIGTERM', () => { server.close(() => { db.disconnect(); process.exit(0); }); })`. `server.close()` empêche de nouvelles connexions tout en laissant finir celles en cours ; on ajoute souvent un timeout pour forcer l'arrêt si certaines requêtes prennent trop de temps.",
          de: "Graceful Shutdown stellt sicher, dass laufende Anfragen nicht abrupt abgebrochen werden, wenn der Prozess ein Shutdown-Signal erhält (z. B. `SIGTERM` von Kubernetes). Das Muster lautet: `process.on('SIGTERM', () => { server.close(() => { db.disconnect(); process.exit(0); }); })`. `server.close()` akzeptiert keine neuen Verbindungen mehr, lässt aber bestehende auslaufen; häufig ergänzt man einen Timeout, um das Beenden zu erzwingen, falls Anfragen zu lange dauern.",
          es: "El graceful shutdown garantiza que las peticiones en curso no se corten de forma brusca cuando el proceso recibe una señal de apagado (por ejemplo `SIGTERM` desde Kubernetes). El patrón típico es: `process.on('SIGTERM', () => { server.close(() => { db.disconnect(); process.exit(0); }); })`. `server.close()` deja de aceptar nuevas conexiones pero permite que terminen las existentes; a menudo se añade un timeout para forzar la salida si algunas peticiones tardan demasiado.",
          it: "Il graceful shutdown assicura che le richieste in corso non vengano interrotte bruscamente quando il processo riceve un segnale di arresto (ad es. `SIGTERM` da Kubernetes). Il pattern tipico è: `process.on('SIGTERM', () => { server.close(() => { db.disconnect(); process.exit(0); }); })`. `server.close()` smette di accettare nuove connessioni ma lascia terminare quelle esistenti; spesso si aggiunge un timeout per forzare la chiusura se alcune richieste durano troppo.",
        }),
        'd4100001-0000-4000-8001-000000000035',
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE qcm_module SET label=label-'fr'-'de'-'es'-'it',description=description-'fr'-'de'-'es'-'it' WHERE id=$1`,
      ['d4100000-0000-4000-8000-000000000001']
    );
    await queryRunner.query(
      `UPDATE qcm_question SET data=jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'-'fr'-'de'-'es'-'it')),'{choices}',(data->'choices'-'fr'-'de'-'es'-'it')),'{explanation}',(data->'explanation'-'fr'-'de'-'es'-'it')) WHERE moduleId=$1`,
      ['d4100000-0000-4000-8000-000000000001']
    );
  }
}
