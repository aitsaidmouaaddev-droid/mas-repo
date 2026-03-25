import type { MigrationInterface, QueryRunner } from 'typeorm';

interface I18nTranslation {
  en: string;
  fr: string;
  de: string;
  es: string;
  it: string;
}

interface ModuleI18n {
  id: string;
  label: I18nTranslation;
  description: I18nTranslation | null;
}

export class ConvertModuleLabelsToI18n1774200010000 implements MigrationInterface {
  private readonly modules: ModuleI18n[] = [
    // ─── Base Modules (no category) ───
    {
      id: '756c8434-a704-4c6e-88f9-e467dc8c3f91',
      label: {
        en: 'Describing the UI',
        fr: 'Décrire l\'interface utilisateur',
        de: 'Die Benutzeroberfläche beschreiben',
        es: 'Describir la interfaz de usuario',
        it: 'Descrivere l\'interfaccia utente',
      },
      description: null,
    },
    {
      id: '7da5ab84-ab82-4522-82e6-17835c297654',
      label: {
        en: 'Adding Interactivity',
        fr: 'Ajouter de l\'interactivité',
        de: 'Interaktivität hinzufügen',
        es: 'Añadir interactividad',
        it: 'Aggiungere interattività',
      },
      description: null,
    },
    {
      id: '14f95086-16bb-4c2c-abad-4c96136ce04e',
      label: {
        en: 'Managing State',
        fr: 'Gérer l\'état',
        de: 'State verwalten',
        es: 'Gestionar el estado',
        it: 'Gestire lo stato',
      },
      description: null,
    },
    {
      id: '957b062a-1300-462c-a85e-ad70c2591671',
      label: {
        en: 'Escape Hatches',
        fr: 'Échappatoires',
        de: 'Notausstiege',
        es: 'Vías de escape',
        it: 'Vie di fuga',
      },
      description: null,
    },
    {
      id: 'cef9ccb0-c77f-4eea-97cc-89eea4fa1f05',
      label: {
        en: 'Advanced React Patterns',
        fr: 'Patterns React avancés',
        de: 'Fortgeschrittene React-Patterns',
        es: 'Patrones avanzados de React',
        it: 'Pattern avanzati di React',
      },
      description: null,
    },
    {
      id: '5d4b7fcf-b36e-473b-9618-6e793b2070f7',
      label: {
        en: 'Next.js — App Router & Full-Stack',
        fr: 'Next.js — App Router & Full-Stack',
        de: 'Next.js — App Router & Full-Stack',
        es: 'Next.js — App Router & Full-Stack',
        it: 'Next.js — App Router & Full-Stack',
      },
      description: null,
    },
    {
      id: '1c7b1f6f-4551-4ccc-8a69-293517a6ca8b',
      label: {
        en: 'HTML, CSS & SCSS',
        fr: 'HTML, CSS & SCSS',
        de: 'HTML, CSS & SCSS',
        es: 'HTML, CSS & SCSS',
        it: 'HTML, CSS & SCSS',
      },
      description: null,
    },
    {
      id: 'b06787b2-3a37-4847-bdae-705b2e082c83',
      label: {
        en: 'Code Quality, Git & CI/CD',
        fr: 'Qualité du code, Git & CI/CD',
        de: 'Codequalität, Git & CI/CD',
        es: 'Calidad del código, Git & CI/CD',
        it: 'Qualità del codice, Git & CI/CD',
      },
      description: null,
    },
    {
      id: '16aa695b-1eeb-4722-9b6a-44a40c43ea3d',
      label: {
        en: 'Software Architecture',
        fr: 'Architecture logicielle',
        de: 'Softwarearchitektur',
        es: 'Arquitectura de software',
        it: 'Architettura software',
      },
      description: null,
    },
    {
      id: 'bd2b1a5b-ca29-4a93-90da-e378cf7d5173',
      label: {
        en: 'Job Interview & Coding Challenges',
        fr: 'Entretien technique & défis de code',
        de: 'Vorstellungsgespräch & Coding-Challenges',
        es: 'Entrevista técnica & retos de código',
        it: 'Colloquio tecnico & sfide di programmazione',
      },
      description: null,
    },
    {
      id: '18b0fa5c-a3c0-4d56-a2db-077b8de9dd00',
      label: {
        en: 'Human Resources Interview',
        fr: 'Entretien RH',
        de: 'HR-Vorstellungsgespräch',
        es: 'Entrevista de recursos humanos',
        it: 'Colloquio risorse umane',
      },
      description: null,
    },

    // ─── Angular ───
    {
      id: 'a1000000-0000-4000-8000-000000000001',
      label: {
        en: 'Standalone Components & the Angular CLI',
        fr: 'Composants standalone & Angular CLI',
        de: 'Standalone-Komponenten & die Angular CLI',
        es: 'Componentes standalone & Angular CLI',
        it: 'Componenti standalone & Angular CLI',
      },
      description: {
        en: 'Bootstrapless apps with standalone: true, the new application builder (esbuild), Angular CLI essentials and project structure in Angular 19.',
        fr: 'Applications sans bootstrap avec standalone: true, le nouveau builder (esbuild), les fondamentaux d\'Angular CLI et la structure de projet dans Angular 19.',
        de: 'Bootstrap-freie Apps mit standalone: true, der neue Application Builder (esbuild), Angular CLI-Grundlagen und Projektstruktur in Angular 19.',
        es: 'Aplicaciones sin bootstrap con standalone: true, el nuevo builder (esbuild), fundamentos de Angular CLI y estructura de proyecto en Angular 19.',
        it: 'Applicazioni senza bootstrap con standalone: true, il nuovo builder (esbuild), fondamenti di Angular CLI e struttura del progetto in Angular 19.',
      },
    },
    {
      id: 'a1000000-0000-4000-8000-000000000002',
      label: {
        en: 'Signals & Reactivity',
        fr: 'Signals & réactivité',
        de: 'Signals & Reaktivität',
        es: 'Signals & reactividad',
        it: 'Signals & reattività',
      },
      description: {
        en: 'signal(), computed(), effect(), input signals, model(), linkedSignal() and the resource() API introduced in Angular 19.',
        fr: 'signal(), computed(), effect(), input signals, model(), linkedSignal() et l\'API resource() introduite dans Angular 19.',
        de: 'signal(), computed(), effect(), input signals, model(), linkedSignal() und die resource()-API, eingeführt in Angular 19.',
        es: 'signal(), computed(), effect(), input signals, model(), linkedSignal() y la API resource() introducida en Angular 19.',
        it: 'signal(), computed(), effect(), input signals, model(), linkedSignal() e l\'API resource() introdotta in Angular 19.',
      },
    },
    {
      id: 'a1000000-0000-4000-8000-000000000003',
      label: {
        en: 'New Template Control Flow',
        fr: 'Nouveau flux de contrôle des templates',
        de: 'Neuer Template-Kontrollfluss',
        es: 'Nuevo flujo de control en templates',
        it: 'Nuovo flusso di controllo nei template',
      },
      description: {
        en: 'Built-in @if, @else, @for (with track), @switch and @defer blocks replacing *ngIf/*ngFor structural directives.',
        fr: 'Blocs natifs @if, @else, @for (avec track), @switch et @defer remplaçant les directives structurelles *ngIf/*ngFor.',
        de: 'Eingebaute @if-, @else-, @for- (mit track), @switch- und @defer-Blöcke als Ersatz für die Strukturdirektiven *ngIf/*ngFor.',
        es: 'Bloques nativos @if, @else, @for (con track), @switch y @defer que reemplazan las directivas estructurales *ngIf/*ngFor.',
        it: 'Blocchi nativi @if, @else, @for (con track), @switch e @defer che sostituiscono le direttive strutturali *ngIf/*ngFor.',
      },
    },
    {
      id: 'a1000000-0000-4000-8000-000000000004',
      label: {
        en: 'Deferrable Views & Performance',
        fr: 'Vues différées & performance',
        de: 'Verzögerte Ansichten & Performance',
        es: 'Vistas diferidas & rendimiento',
        it: 'Viste differite & prestazioni',
      },
      description: {
        en: '@defer, @placeholder, @loading and @error blocks for lazy rendering, plus incremental hydration strategies in Angular 19.',
        fr: 'Blocs @defer, @placeholder, @loading et @error pour le rendu paresseux, ainsi que les stratégies d\'hydratation incrémentale dans Angular 19.',
        de: '@defer-, @placeholder-, @loading- und @error-Blöcke für Lazy Rendering, plus inkrementelle Hydratationsstrategien in Angular 19.',
        es: 'Bloques @defer, @placeholder, @loading y @error para renderizado diferido, más estrategias de hidratación incremental en Angular 19.',
        it: 'Blocchi @defer, @placeholder, @loading e @error per il rendering differito, oltre alle strategie di idratazione incrementale in Angular 19.',
      },
    },
    {
      id: 'a1000000-0000-4000-8000-000000000005',
      label: {
        en: 'Dependency Injection & inject()',
        fr: 'Injection de dépendances & inject()',
        de: 'Dependency Injection & inject()',
        es: 'Inyección de dependencias & inject()',
        it: 'Iniezione delle dipendenze & inject()',
      },
      description: {
        en: 'inject() function, environment injectors, hierarchical DI, providedIn scopes and functional guards/interceptors.',
        fr: 'Fonction inject(), injecteurs d\'environnement, DI hiérarchique, portées providedIn et guards/intercepteurs fonctionnels.',
        de: 'inject()-Funktion, Umgebungs-Injektoren, hierarchische DI, providedIn-Scopes und funktionale Guards/Interceptors.',
        es: 'Función inject(), inyectores de entorno, DI jerárquica, ámbitos providedIn y guards/interceptors funcionales.',
        it: 'Funzione inject(), iniettori di ambiente, DI gerarchica, ambiti providedIn e guards/interceptor funzionali.',
      },
    },
    {
      id: 'a1000000-0000-4000-8000-000000000006',
      label: {
        en: 'Routing & Lazy Loading',
        fr: 'Routage & chargement paresseux',
        de: 'Routing & Lazy Loading',
        es: 'Enrutamiento & carga diferida',
        it: 'Routing & caricamento differito',
      },
      description: {
        en: 'Standalone router, functional route guards, lazy-loaded components, withComponentInputBinding() and router state signals.',
        fr: 'Routeur standalone, guards de route fonctionnels, composants à chargement différé, withComponentInputBinding() et signals d\'état du routeur.',
        de: 'Standalone-Router, funktionale Route Guards, lazy-loaded Komponenten, withComponentInputBinding() und Router-State-Signals.',
        es: 'Router standalone, guards de ruta funcionales, componentes con carga diferida, withComponentInputBinding() y signals de estado del router.',
        it: 'Router standalone, guards di rotta funzionali, componenti a caricamento differito, withComponentInputBinding() e signals di stato del router.',
      },
    },
    {
      id: 'a1000000-0000-4000-8000-000000000007',
      label: {
        en: 'Reactive Forms & Typed Forms',
        fr: 'Formulaires réactifs & formulaires typés',
        de: 'Reactive Forms & Typed Forms',
        es: 'Formularios reactivos & formularios tipados',
        it: 'Moduli reattivi & moduli tipizzati',
      },
      description: {
        en: 'Strictly typed FormControl/FormGroup/FormArray, form builder, validators, reactive patterns and signal-based form state.',
        fr: 'FormControl/FormGroup/FormArray strictement typés, form builder, validateurs, patterns réactifs et état de formulaire basé sur les signals.',
        de: 'Streng typisierte FormControl/FormGroup/FormArray, Form Builder, Validatoren, reaktive Patterns und signal-basierter Formular-State.',
        es: 'FormControl/FormGroup/FormArray estrictamente tipados, form builder, validadores, patrones reactivos y estado de formulario basado en signals.',
        it: 'FormControl/FormGroup/FormArray strettamente tipizzati, form builder, validatori, pattern reattivi e stato del modulo basato su signals.',
      },
    },
    {
      id: 'a1000000-0000-4000-8000-000000000008',
      label: {
        en: 'HttpClient & Server Communication',
        fr: 'HttpClient & communication serveur',
        de: 'HttpClient & Serverkommunikation',
        es: 'HttpClient & comunicación con el servidor',
        it: 'HttpClient & comunicazione con il server',
      },
      description: {
        en: 'provideHttpClient(), functional interceptors, withFetch(), typed responses and error handling with RxJS.',
        fr: 'provideHttpClient(), intercepteurs fonctionnels, withFetch(), réponses typées et gestion d\'erreurs avec RxJS.',
        de: 'provideHttpClient(), funktionale Interceptors, withFetch(), typisierte Antworten und Fehlerbehandlung mit RxJS.',
        es: 'provideHttpClient(), interceptores funcionales, withFetch(), respuestas tipadas y manejo de errores con RxJS.',
        it: 'provideHttpClient(), interceptor funzionali, withFetch(), risposte tipizzate e gestione degli errori con RxJS.',
      },
    },
    {
      id: 'a1000000-0000-4000-8000-000000000009',
      label: {
        en: 'Change Detection & Zoneless',
        fr: 'Détection de changements & mode sans Zone',
        de: 'Change Detection & Zoneless',
        es: 'Detección de cambios & modo sin Zone',
        it: 'Rilevamento delle modifiche & modalità senza Zone',
      },
      description: {
        en: 'OnPush strategy, markForCheck(), signal-driven updates and the experimental zoneless mode (provideExperimentalZonelessChangeDetection).',
        fr: 'Stratégie OnPush, markForCheck(), mises à jour pilotées par les signals et le mode expérimental sans Zone (provideExperimentalZonelessChangeDetection).',
        de: 'OnPush-Strategie, markForCheck(), signal-gesteuerte Updates und der experimentelle Zoneless-Modus (provideExperimentalZonelessChangeDetection).',
        es: 'Estrategia OnPush, markForCheck(), actualizaciones dirigidas por signals y el modo experimental sin Zone (provideExperimentalZonelessChangeDetection).',
        it: 'Strategia OnPush, markForCheck(), aggiornamenti guidati dai signals e la modalità sperimentale senza Zone (provideExperimentalZonelessChangeDetection).',
      },
    },
    {
      id: 'a1000000-0000-4000-8000-000000000010',
      label: {
        en: 'SSR, Hydration & Angular Universal',
        fr: 'SSR, hydratation & Angular Universal',
        de: 'SSR, Hydratation & Angular Universal',
        es: 'SSR, hidratación & Angular Universal',
        it: 'SSR, idratazione & Angular Universal',
      },
      description: {
        en: 'Server-side rendering with provideClientHydration(), incremental hydration, event replay and partial hydration in Angular 19.',
        fr: 'Rendu côté serveur avec provideClientHydration(), hydratation incrémentale, relecture d\'événements et hydratation partielle dans Angular 19.',
        de: 'Serverseitiges Rendering mit provideClientHydration(), inkrementelle Hydratation, Event-Replay und partielle Hydratation in Angular 19.',
        es: 'Renderizado del lado del servidor con provideClientHydration(), hidratación incremental, repetición de eventos e hidratación parcial en Angular 19.',
        it: 'Rendering lato server con provideClientHydration(), idratazione incrementale, riproduzione degli eventi e idratazione parziale in Angular 19.',
      },
    },
    {
      id: 'a1000000-0000-4000-8000-000000000011',
      label: {
        en: 'State Management with NgRx & Signals',
        fr: 'Gestion d\'état avec NgRx & Signals',
        de: 'State Management mit NgRx & Signals',
        es: 'Gestión de estado con NgRx & Signals',
        it: 'Gestione dello stato con NgRx & Signals',
      },
      description: {
        en: 'NgRx SignalStore, createFeature(), ComponentStore, actions, reducers, selectors and effects with Angular 19 patterns.',
        fr: 'NgRx SignalStore, createFeature(), ComponentStore, actions, reducers, selectors et effects avec les patterns Angular 19.',
        de: 'NgRx SignalStore, createFeature(), ComponentStore, Actions, Reducers, Selectors und Effects mit Angular 19-Patterns.',
        es: 'NgRx SignalStore, createFeature(), ComponentStore, actions, reducers, selectors y effects con patrones de Angular 19.',
        it: 'NgRx SignalStore, createFeature(), ComponentStore, actions, reducers, selectors ed effects con i pattern di Angular 19.',
      },
    },

    // ─── Algorithmes ───
    {
      id: 'b2000000-0000-4000-8000-000000000001',
      label: {
        en: 'Data Structures',
        fr: 'Structures de données',
        de: 'Datenstrukturen',
        es: 'Estructuras de datos',
        it: 'Strutture dati',
      },
      description: {
        en: 'Arrays, linked lists, stacks, queues, trees, graphs and hash maps.',
        fr: 'Tableaux, listes chaînées, piles, files, arbres, graphes et tables de hachage.',
        de: 'Arrays, verkettete Listen, Stacks, Queues, Bäume, Graphen und Hash Maps.',
        es: 'Arrays, listas enlazadas, pilas, colas, árboles, grafos y mapas hash.',
        it: 'Array, liste collegate, pile, code, alberi, grafi e mappe hash.',
      },
    },
    {
      id: 'b2000000-0000-4000-8000-000000000002',
      label: {
        en: 'Sorting & Searching',
        fr: 'Tri & recherche',
        de: 'Sortierung & Suche',
        es: 'Ordenamiento & búsqueda',
        it: 'Ordinamento & ricerca',
      },
      description: {
        en: 'Bubble, merge, quick sort, binary search and complexity analysis.',
        fr: 'Tri à bulles, tri fusion, tri rapide, recherche binaire et analyse de complexité.',
        de: 'Bubble Sort, Merge Sort, Quick Sort, binäre Suche und Komplexitätsanalyse.',
        es: 'Ordenamiento burbuja, merge sort, quick sort, búsqueda binaria y análisis de complejidad.',
        it: 'Bubble sort, merge sort, quick sort, ricerca binaria e analisi della complessità.',
      },
    },
    {
      id: 'b2000000-0000-4000-8000-000000000003',
      label: {
        en: 'Recursion & Backtracking',
        fr: 'Récursivité & backtracking',
        de: 'Rekursion & Backtracking',
        es: 'Recursión & backtracking',
        it: 'Ricorsione & backtracking',
      },
      description: {
        en: 'Recursive thinking, memoisation, backtracking patterns and call stack.',
        fr: 'Pensée récursive, mémoïsation, patterns de backtracking et pile d\'appels.',
        de: 'Rekursives Denken, Memoisierung, Backtracking-Patterns und Aufrufstapel.',
        es: 'Pensamiento recursivo, memoización, patrones de backtracking y pila de llamadas.',
        it: 'Pensiero ricorsivo, memoizzazione, pattern di backtracking e stack delle chiamate.',
      },
    },
    {
      id: 'b2000000-0000-4000-8000-000000000004',
      label: {
        en: 'Dynamic Programming',
        fr: 'Programmation dynamique',
        de: 'Dynamische Programmierung',
        es: 'Programación dinámica',
        it: 'Programmazione dinamica',
      },
      description: {
        en: 'Overlapping sub-problems, optimal substructure, tabulation vs memoisation.',
        fr: 'Sous-problèmes chevauchants, sous-structure optimale, tabulation vs mémoïsation.',
        de: 'Überlappende Teilprobleme, optimale Substruktur, Tabulation vs. Memoisierung.',
        es: 'Subproblemas superpuestos, subestructura óptima, tabulación vs memoización.',
        it: 'Sottoproblemi sovrapposti, sottostruttura ottimale, tabulazione vs memoizzazione.',
      },
    },
    {
      id: 'b2000000-0000-4000-8000-000000000005',
      label: {
        en: 'Graph Algorithms',
        fr: 'Algorithmes de graphes',
        de: 'Graphenalgorithmen',
        es: 'Algoritmos de grafos',
        it: 'Algoritmi sui grafi',
      },
      description: {
        en: 'BFS, DFS, Dijkstra, topological sort and union-find.',
        fr: 'BFS, DFS, Dijkstra, tri topologique et union-find.',
        de: 'BFS, DFS, Dijkstra, topologische Sortierung und Union-Find.',
        es: 'BFS, DFS, Dijkstra, ordenamiento topológico y union-find.',
        it: 'BFS, DFS, Dijkstra, ordinamento topologico e union-find.',
      },
    },

    // ─── React 19 ───
    {
      id: 'c3000000-0000-4000-8000-000000000001',
      label: {
        en: 'React 19 — What\'s New',
        fr: 'React 19 — Nouveautés',
        de: 'React 19 — Was ist neu',
        es: 'React 19 — Novedades',
        it: 'React 19 — Novità',
      },
      description: {
        en: 'Overview of React 19: the new compiler, automatic memoisation, removal of forwardRef, string refs and legacy context.',
        fr: 'Vue d\'ensemble de React 19 : le nouveau compilateur, la mémoïsation automatique, la suppression de forwardRef, les string refs et le contexte legacy.',
        de: 'Überblick über React 19: der neue Compiler, automatische Memoisierung, Entfernung von forwardRef, String Refs und Legacy Context.',
        es: 'Resumen de React 19: el nuevo compilador, memoización automática, eliminación de forwardRef, string refs y contexto legacy.',
        it: 'Panoramica di React 19: il nuovo compilatore, la memoizzazione automatica, la rimozione di forwardRef, le string refs e il contesto legacy.',
      },
    },
    {
      id: 'c3000000-0000-4000-8000-000000000002',
      label: {
        en: 'React Compiler & Auto-Memoisation',
        fr: 'React Compiler & mémoïsation automatique',
        de: 'React Compiler & automatische Memoisierung',
        es: 'React Compiler & memoización automática',
        it: 'React Compiler & memoizzazione automatica',
      },
      description: {
        en: 'How the React 19 compiler eliminates manual useMemo/useCallback, what it optimises, its limitations and opt-out escape hatches.',
        fr: 'Comment le compilateur React 19 élimine les useMemo/useCallback manuels, ce qu\'il optimise, ses limites et ses échappatoires.',
        de: 'Wie der React 19-Compiler manuelle useMemo/useCallback eliminiert, was er optimiert, seine Grenzen und Opt-out-Möglichkeiten.',
        es: 'Cómo el compilador de React 19 elimina useMemo/useCallback manuales, qué optimiza, sus limitaciones y vías de escape.',
        it: 'Come il compilatore React 19 elimina useMemo/useCallback manuali, cosa ottimizza, le sue limitazioni e le vie di fuga.',
      },
    },
    {
      id: 'c3000000-0000-4000-8000-000000000003',
      label: {
        en: 'Server Components & Server Actions',
        fr: 'Server Components & Server Actions',
        de: 'Server Components & Server Actions',
        es: 'Server Components & Server Actions',
        it: 'Server Components & Server Actions',
      },
      description: {
        en: 'React Server Components model, async components, "use server" / "use client" directives, Server Actions and progressive enhancement.',
        fr: 'Le modèle React Server Components, les composants asynchrones, les directives "use server" / "use client", les Server Actions et l\'amélioration progressive.',
        de: 'Das React Server Components-Modell, asynchrone Komponenten, "use server"- / "use client"-Direktiven, Server Actions und progressive Verbesserung.',
        es: 'El modelo React Server Components, componentes asíncronos, directivas "use server" / "use client", Server Actions y mejora progresiva.',
        it: 'Il modello React Server Components, componenti asincroni, direttive "use server" / "use client", Server Actions e miglioramento progressivo.',
      },
    },
    {
      id: 'c3000000-0000-4000-8000-000000000004',
      label: {
        en: 'useTransition & Concurrent Features',
        fr: 'useTransition & fonctionnalités concurrentes',
        de: 'useTransition & gleichzeitige Funktionen',
        es: 'useTransition & características concurrentes',
        it: 'useTransition & funzionalità concorrenti',
      },
      description: {
        en: 'startTransition, useTransition, useDeferredValue, Suspense boundaries and concurrent rendering in React 19.',
        fr: 'startTransition, useTransition, useDeferredValue, limites Suspense et rendu concurrent dans React 19.',
        de: 'startTransition, useTransition, useDeferredValue, Suspense-Boundaries und gleichzeitiges Rendering in React 19.',
        es: 'startTransition, useTransition, useDeferredValue, límites de Suspense y renderizado concurrente en React 19.',
        it: 'startTransition, useTransition, useDeferredValue, limiti Suspense e rendering concorrente in React 19.',
      },
    },
    {
      id: 'c3000000-0000-4000-8000-000000000005',
      label: {
        en: 'useActionState & useFormStatus',
        fr: 'useActionState & useFormStatus',
        de: 'useActionState & useFormStatus',
        es: 'useActionState & useFormStatus',
        it: 'useActionState & useFormStatus',
      },
      description: {
        en: 'New React 19 hooks for forms: useActionState (replaces useFormState), useFormStatus, optimistic updates and pending states.',
        fr: 'Nouveaux hooks React 19 pour les formulaires : useActionState (remplace useFormState), useFormStatus, mises à jour optimistes et états en attente.',
        de: 'Neue React 19-Hooks für Formulare: useActionState (ersetzt useFormState), useFormStatus, optimistische Updates und Pending-States.',
        es: 'Nuevos hooks de React 19 para formularios: useActionState (reemplaza useFormState), useFormStatus, actualizaciones optimistas y estados pendientes.',
        it: 'Nuovi hook React 19 per i moduli: useActionState (sostituisce useFormState), useFormStatus, aggiornamenti ottimistici e stati in attesa.',
      },
    },
    {
      id: 'c3000000-0000-4000-8000-000000000006',
      label: {
        en: 'useOptimistic',
        fr: 'useOptimistic',
        de: 'useOptimistic',
        es: 'useOptimistic',
        it: 'useOptimistic',
      },
      description: {
        en: 'Optimistic UI with useOptimistic — updating state before the server responds and rolling back on error.',
        fr: 'Interface optimiste avec useOptimistic — mise à jour de l\'état avant la réponse du serveur et retour en arrière en cas d\'erreur.',
        de: 'Optimistische Benutzeroberfläche mit useOptimistic — State-Update vor der Serverantwort und Rollback bei Fehlern.',
        es: 'Interfaz optimista con useOptimistic — actualización del estado antes de la respuesta del servidor y reversión en caso de error.',
        it: 'Interfaccia ottimistica con useOptimistic — aggiornamento dello stato prima della risposta del server e rollback in caso di errore.',
      },
    },
    {
      id: 'c3000000-0000-4000-8000-000000000007',
      label: {
        en: 'use() API & Resource Fetching',
        fr: 'API use() & récupération de ressources',
        de: 'use()-API & Ressourcenabruf',
        es: 'API use() & obtención de recursos',
        it: 'API use() & recupero risorse',
      },
      description: {
        en: 'The new use() hook for reading Promises and Context inside render, including integration with Suspense and error boundaries.',
        fr: 'Le nouveau hook use() pour lire les Promises et le Context dans le rendu, y compris l\'intégration avec Suspense et les error boundaries.',
        de: 'Der neue use()-Hook zum Lesen von Promises und Context im Render, einschließlich Integration mit Suspense und Error Boundaries.',
        es: 'El nuevo hook use() para leer Promises y Context en el renderizado, incluyendo integración con Suspense y error boundaries.',
        it: 'Il nuovo hook use() per leggere Promise e Context nel rendering, inclusa l\'integrazione con Suspense e gli error boundaries.',
      },
    },
    {
      id: 'c3000000-0000-4000-8000-000000000008',
      label: {
        en: 'ref as a Prop & cleanup',
        fr: 'ref comme prop & nettoyage',
        de: 'ref als Prop & Bereinigung',
        es: 'ref como prop & limpieza',
        it: 'ref come prop & pulizia',
      },
      description: {
        en: 'React 19 passes ref directly as a prop (no more forwardRef), ref callback cleanup functions and the new ref object shape.',
        fr: 'React 19 passe ref directement comme prop (plus de forwardRef), fonctions de nettoyage des callbacks ref et la nouvelle forme de l\'objet ref.',
        de: 'React 19 übergibt ref direkt als Prop (kein forwardRef mehr), Ref-Callback-Bereinigungsfunktionen und die neue Ref-Objektform.',
        es: 'React 19 pasa ref directamente como prop (sin más forwardRef), funciones de limpieza de callbacks ref y la nueva forma del objeto ref.',
        it: 'React 19 passa ref direttamente come prop (niente più forwardRef), funzioni di pulizia dei callback ref e la nuova forma dell\'oggetto ref.',
      },
    },
    {
      id: 'c3000000-0000-4000-8000-000000000009',
      label: {
        en: 'Document Metadata & Asset Loading',
        fr: 'Métadonnées du document & chargement des assets',
        de: 'Dokument-Metadaten & Asset-Loading',
        es: 'Metadatos del documento & carga de assets',
        it: 'Metadati del documento & caricamento degli asset',
      },
      description: {
        en: 'Built-in <title>, <meta> and <link> hoisting, preload/preinit APIs and stylesheet/script priority management in React 19.',
        fr: 'Hoisting natif de <title>, <meta> et <link>, APIs preload/preinit et gestion des priorités des feuilles de style/scripts dans React 19.',
        de: 'Eingebautes <title>-, <meta>- und <link>-Hoisting, preload/preinit-APIs und Stylesheet/Script-Prioritätsverwaltung in React 19.',
        es: 'Hoisting nativo de <title>, <meta> y <link>, APIs preload/preinit y gestión de prioridad de hojas de estilo/scripts en React 19.',
        it: 'Hoisting nativo di <title>, <meta> e <link>, API preload/preinit e gestione delle priorità di fogli di stile/script in React 19.',
      },
    },
    {
      id: 'c3000000-0000-4000-8000-000000000010',
      label: {
        en: 'Error Handling & Hydration Errors',
        fr: 'Gestion des erreurs & erreurs d\'hydratation',
        de: 'Fehlerbehandlung & Hydratationsfehler',
        es: 'Manejo de errores & errores de hidratación',
        it: 'Gestione degli errori & errori di idratazione',
      },
      description: {
        en: 'Improved error reporting, onCaughtError / onUncaughtError root options, hydration diff messages and error recovery.',
        fr: 'Rapports d\'erreurs améliorés, options racine onCaughtError / onUncaughtError, messages de diff d\'hydratation et récupération d\'erreurs.',
        de: 'Verbesserte Fehlerberichte, Root-Optionen onCaughtError / onUncaughtError, Hydratations-Diff-Meldungen und Fehlerbehebung.',
        es: 'Informes de errores mejorados, opciones de raíz onCaughtError / onUncaughtError, mensajes de diff de hidratación y recuperación de errores.',
        it: 'Segnalazione errori migliorata, opzioni root onCaughtError / onUncaughtError, messaggi di diff dell\'idratazione e recupero degli errori.',
      },
    },
    {
      id: 'c3000000-0000-4000-8000-000000000011',
      label: {
        en: 'Context, Portals & Fragments Updates',
        fr: 'Mises à jour de Context, Portals & Fragments',
        de: 'Context-, Portals- & Fragments-Updates',
        es: 'Actualizaciones de Context, Portals & Fragments',
        it: 'Aggiornamenti di Context, Portals & Fragments',
      },
      description: {
        en: '<Context> as a provider (replaces <Context.Provider>), portal improvements and key as a prop in React 19.',
        fr: '<Context> comme fournisseur (remplace <Context.Provider>), améliorations des portails et key comme prop dans React 19.',
        de: '<Context> als Provider (ersetzt <Context.Provider>), Portal-Verbesserungen und key als Prop in React 19.',
        es: '<Context> como proveedor (reemplaza <Context.Provider>), mejoras en portales y key como prop en React 19.',
        it: '<Context> come provider (sostituisce <Context.Provider>), miglioramenti ai portali e key come prop in React 19.',
      },
    },
    {
      id: 'c3100000-0000-4000-8000-000000000001',
      label: {
        en: 'React Definitions',
        fr: 'Définitions React',
        de: 'React-Definitionen',
        es: 'Definiciones de React',
        it: 'Definizioni di React',
      },
      description: {
        en: 'Core React vocabulary: what is React, JSX, components, props, state, hooks (useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer, useLayoutEffect), virtual DOM, reconciliation, Fiber, Context API, memoization, portals, Suspense, lazy loading, error boundaries, HOCs, controlled/uncontrolled components, custom hooks, hydration and React 19 additions.',
        fr: 'Vocabulaire essentiel de React : qu\'est-ce que React, JSX, composants, props, state, hooks (useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer, useLayoutEffect), DOM virtuel, réconciliation, Fiber, Context API, mémoïsation, portails, Suspense, chargement paresseux, error boundaries, HOCs, composants contrôlés/non contrôlés, hooks personnalisés, hydratation et nouveautés React 19.',
        de: 'React-Grundvokabular: was ist React, JSX, Komponenten, Props, State, Hooks (useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer, useLayoutEffect), virtuelles DOM, Reconciliation, Fiber, Context API, Memoisierung, Portale, Suspense, Lazy Loading, Error Boundaries, HOCs, kontrollierte/unkontrollierte Komponenten, Custom Hooks, Hydratation und React 19-Neuerungen.',
        es: 'Vocabulario esencial de React: qué es React, JSX, componentes, props, estado, hooks (useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer, useLayoutEffect), DOM virtual, reconciliación, Fiber, Context API, memoización, portales, Suspense, carga diferida, error boundaries, HOCs, componentes controlados/no controlados, hooks personalizados, hidratación y novedades de React 19.',
        it: 'Vocabolario essenziale di React: cos\'è React, JSX, componenti, props, stato, hooks (useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer, useLayoutEffect), DOM virtuale, riconciliazione, Fiber, Context API, memoizzazione, portali, Suspense, caricamento differito, error boundaries, HOC, componenti controllati/non controllati, hook personalizzati, idratazione e novità di React 19.',
      },
    },

    // ─── NodeJs ───
    {
      id: 'd4000000-0000-4000-8000-000000000001',
      label: {
        en: 'Node.js Core & Event Loop',
        fr: 'Node.js Core & boucle d\'événements',
        de: 'Node.js Core & Event Loop',
        es: 'Node.js Core & bucle de eventos',
        it: 'Node.js Core & ciclo degli eventi',
      },
      description: {
        en: 'How Node.js works: the V8 engine, libuv, the event loop phases (timers, I/O, poll, check), microtasks vs macrotasks and the call stack.',
        fr: 'Comment Node.js fonctionne : le moteur V8, libuv, les phases de la boucle d\'événements (timers, I/O, poll, check), microtâches vs macrotâches et la pile d\'appels.',
        de: 'Wie Node.js funktioniert: die V8-Engine, libuv, die Event-Loop-Phasen (Timers, I/O, Poll, Check), Microtasks vs. Macrotasks und der Aufrufstapel.',
        es: 'Cómo funciona Node.js: el motor V8, libuv, las fases del bucle de eventos (timers, I/O, poll, check), microtareas vs macrotareas y la pila de llamadas.',
        it: 'Come funziona Node.js: il motore V8, libuv, le fasi del ciclo degli eventi (timers, I/O, poll, check), microtask vs macrotask e lo stack delle chiamate.',
      },
    },
    {
      id: 'd4000000-0000-4000-8000-000000000002',
      label: {
        en: 'Modules: CommonJS & ESM',
        fr: 'Modules : CommonJS & ESM',
        de: 'Module: CommonJS & ESM',
        es: 'Módulos: CommonJS & ESM',
        it: 'Moduli: CommonJS & ESM',
      },
      description: {
        en: 'require() vs import/export, module resolution algorithm, circular dependencies, package.json "type" field and dual CJS/ESM packages.',
        fr: 'require() vs import/export, algorithme de résolution de modules, dépendances circulaires, champ "type" de package.json et paquets double CJS/ESM.',
        de: 'require() vs. import/export, Modulauflösungsalgorithmus, zirkuläre Abhängigkeiten, package.json-"type"-Feld und duale CJS/ESM-Pakete.',
        es: 'require() vs import/export, algoritmo de resolución de módulos, dependencias circulares, campo "type" de package.json y paquetes duales CJS/ESM.',
        it: 'require() vs import/export, algoritmo di risoluzione dei moduli, dipendenze circolari, campo "type" di package.json e pacchetti doppi CJS/ESM.',
      },
    },
    {
      id: 'd4000000-0000-4000-8000-000000000003',
      label: {
        en: 'File System & Streams',
        fr: 'Système de fichiers & flux',
        de: 'Dateisystem & Streams',
        es: 'Sistema de archivos & streams',
        it: 'File system & stream',
      },
      description: {
        en: 'fs/promises API, readable/writable/transform streams, piping, backpressure, Buffer vs Uint8Array and working with large files efficiently.',
        fr: 'API fs/promises, flux readable/writable/transform, piping, backpressure, Buffer vs Uint8Array et traitement efficace de fichiers volumineux.',
        de: 'fs/promises-API, readable/writable/transform Streams, Piping, Backpressure, Buffer vs. Uint8Array und effiziente Arbeit mit großen Dateien.',
        es: 'API fs/promises, streams readable/writable/transform, piping, backpressure, Buffer vs Uint8Array y trabajo eficiente con archivos grandes.',
        it: 'API fs/promises, stream readable/writable/transform, piping, backpressure, Buffer vs Uint8Array e lavorazione efficiente di file di grandi dimensioni.',
      },
    },
    {
      id: 'd4000000-0000-4000-8000-000000000004',
      label: {
        en: 'Async Patterns: Callbacks, Promises & async/await',
        fr: 'Patterns asynchrones : Callbacks, Promises & async/await',
        de: 'Asynchrone Patterns: Callbacks, Promises & async/await',
        es: 'Patrones asíncronos: Callbacks, Promises & async/await',
        it: 'Pattern asincroni: Callbacks, Promises & async/await',
      },
      description: {
        en: 'Error-first callbacks, promisify, Promise combinators (all, allSettled, race, any), async iterators and top-level await.',
        fr: 'Callbacks error-first, promisify, combinateurs de Promise (all, allSettled, race, any), itérateurs asynchrones et top-level await.',
        de: 'Error-first Callbacks, promisify, Promise-Kombinatoren (all, allSettled, race, any), asynchrone Iteratoren und Top-Level await.',
        es: 'Callbacks error-first, promisify, combinadores de Promise (all, allSettled, race, any), iteradores asíncronos y top-level await.',
        it: 'Callback error-first, promisify, combinatori di Promise (all, allSettled, race, any), iteratori asincroni e top-level await.',
      },
    },
    {
      id: 'd4000000-0000-4000-8000-000000000005',
      label: {
        en: 'HTTP & REST API with Express',
        fr: 'HTTP & API REST avec Express',
        de: 'HTTP & REST-API mit Express',
        es: 'HTTP & API REST con Express',
        it: 'HTTP & API REST con Express',
      },
      description: {
        en: 'http module internals, building REST APIs with Express, middleware, routing, error handling, request validation and static files.',
        fr: 'Fonctionnement interne du module http, création d\'API REST avec Express, middleware, routage, gestion des erreurs, validation des requêtes et fichiers statiques.',
        de: 'http-Modul-Interna, REST-API-Erstellung mit Express, Middleware, Routing, Fehlerbehandlung, Request-Validierung und statische Dateien.',
        es: 'Funcionamiento interno del módulo http, creación de API REST con Express, middleware, enrutamiento, manejo de errores, validación de solicitudes y archivos estáticos.',
        it: 'Funzionamento interno del modulo http, creazione di API REST con Express, middleware, routing, gestione degli errori, validazione delle richieste e file statici.',
      },
    },
    {
      id: 'd4000000-0000-4000-8000-000000000006',
      label: {
        en: 'Authentication & Security',
        fr: 'Authentification & sécurité',
        de: 'Authentifizierung & Sicherheit',
        es: 'Autenticación & seguridad',
        it: 'Autenticazione & sicurezza',
      },
      description: {
        en: 'JWT, session-based auth, bcrypt password hashing, CORS, helmet, rate limiting, CSRF protection and common Node.js security pitfalls.',
        fr: 'JWT, authentification par session, hachage de mots de passe avec bcrypt, CORS, helmet, limitation de débit, protection CSRF et pièges de sécurité courants de Node.js.',
        de: 'JWT, sitzungsbasierte Authentifizierung, bcrypt-Passwort-Hashing, CORS, Helmet, Rate Limiting, CSRF-Schutz und häufige Sicherheitsfallen in Node.js.',
        es: 'JWT, autenticación basada en sesiones, hashing de contraseñas con bcrypt, CORS, helmet, limitación de tasa, protección CSRF y errores de seguridad comunes en Node.js.',
        it: 'JWT, autenticazione basata su sessioni, hashing delle password con bcrypt, CORS, helmet, rate limiting, protezione CSRF e trappole di sicurezza comuni in Node.js.',
      },
    },
    {
      id: 'd4000000-0000-4000-8000-000000000007',
      label: {
        en: 'Databases: SQL & NoSQL',
        fr: 'Bases de données : SQL & NoSQL',
        de: 'Datenbanken: SQL & NoSQL',
        es: 'Bases de datos: SQL & NoSQL',
        it: 'Database: SQL & NoSQL',
      },
      description: {
        en: 'Connecting to PostgreSQL (pg, Prisma, TypeORM) and MongoDB (Mongoose), query patterns, transactions, indexing and connection pooling.',
        fr: 'Connexion à PostgreSQL (pg, Prisma, TypeORM) et MongoDB (Mongoose), patterns de requêtes, transactions, indexation et pool de connexions.',
        de: 'Verbindung zu PostgreSQL (pg, Prisma, TypeORM) und MongoDB (Mongoose), Abfragemuster, Transaktionen, Indizierung und Connection Pooling.',
        es: 'Conexión a PostgreSQL (pg, Prisma, TypeORM) y MongoDB (Mongoose), patrones de consulta, transacciones, indexación y pool de conexiones.',
        it: 'Connessione a PostgreSQL (pg, Prisma, TypeORM) e MongoDB (Mongoose), pattern di query, transazioni, indicizzazione e connection pooling.',
      },
    },
    {
      id: 'd4000000-0000-4000-8000-000000000008',
      label: {
        en: 'Testing Node.js Apps',
        fr: 'Tester les applications Node.js',
        de: 'Node.js-Apps testen',
        es: 'Testeo de aplicaciones Node.js',
        it: 'Testare le applicazioni Node.js',
      },
      description: {
        en: 'Unit and integration testing with Jest/Vitest, supertest for HTTP, mocking modules, code coverage and end-to-end API testing.',
        fr: 'Tests unitaires et d\'intégration avec Jest/Vitest, supertest pour HTTP, simulation de modules, couverture de code et tests API de bout en bout.',
        de: 'Unit- und Integrationstests mit Jest/Vitest, Supertest für HTTP, Modul-Mocking, Code Coverage und End-to-End-API-Tests.',
        es: 'Tests unitarios y de integración con Jest/Vitest, supertest para HTTP, simulación de módulos, cobertura de código y tests de API de extremo a extremo.',
        it: 'Test unitari e di integrazione con Jest/Vitest, supertest per HTTP, mocking dei moduli, copertura del codice e test API end-to-end.',
      },
    },
    {
      id: 'd4000000-0000-4000-8000-000000000009',
      label: {
        en: 'Performance & Clustering',
        fr: 'Performance & clustering',
        de: 'Performance & Clustering',
        es: 'Rendimiento & clustering',
        it: 'Prestazioni & clustering',
      },
      description: {
        en: 'Worker threads, the cluster module, child_process, profiling with --prof, memory leak detection and Node.js performance best practices.',
        fr: 'Worker threads, le module cluster, child_process, profilage avec --prof, détection de fuites mémoire et bonnes pratiques de performance Node.js.',
        de: 'Worker Threads, das Cluster-Modul, child_process, Profiling mit --prof, Speicherleckerkennung und Node.js-Performance-Best-Practices.',
        es: 'Worker threads, el módulo cluster, child_process, perfilado con --prof, detección de fugas de memoria y mejores prácticas de rendimiento en Node.js.',
        it: 'Worker threads, il modulo cluster, child_process, profilazione con --prof, rilevamento di memory leak e best practice di performance Node.js.',
      },
    },
    {
      id: 'd4000000-0000-4000-8000-000000000010',
      label: {
        en: 'WebSockets & Real-Time',
        fr: 'WebSockets & temps réel',
        de: 'WebSockets & Echtzeit',
        es: 'WebSockets & tiempo real',
        it: 'WebSockets & tempo reale',
      },
      description: {
        en: 'ws library, Socket.IO, Server-Sent Events, long polling, scaling real-time connections with Redis pub/sub and sticky sessions.',
        fr: 'Bibliothèque ws, Socket.IO, Server-Sent Events, long polling, mise à l\'échelle des connexions temps réel avec Redis pub/sub et sessions persistantes.',
        de: 'ws-Bibliothek, Socket.IO, Server-Sent Events, Long Polling, Skalierung von Echtzeitverbindungen mit Redis Pub/Sub und Sticky Sessions.',
        es: 'Biblioteca ws, Socket.IO, Server-Sent Events, long polling, escalado de conexiones en tiempo real con Redis pub/sub y sesiones persistentes.',
        it: 'Libreria ws, Socket.IO, Server-Sent Events, long polling, scalabilità delle connessioni in tempo reale con Redis pub/sub e sessioni persistenti.',
      },
    },
    {
      id: 'd4000000-0000-4000-8000-000000000011',
      label: {
        en: 'Deployment, Docker & CI/CD',
        fr: 'Déploiement, Docker & CI/CD',
        de: 'Deployment, Docker & CI/CD',
        es: 'Despliegue, Docker & CI/CD',
        it: 'Deployment, Docker & CI/CD',
      },
      description: {
        en: 'Dockerising Node.js apps, multi-stage builds, environment variables, PM2 process management, health checks and GitHub Actions pipelines.',
        fr: 'Dockerisation d\'applications Node.js, builds multi-étapes, variables d\'environnement, gestion de processus avec PM2, health checks et pipelines GitHub Actions.',
        de: 'Dockerisierung von Node.js-Apps, Multi-Stage-Builds, Umgebungsvariablen, PM2-Prozessmanagement, Health Checks und GitHub Actions-Pipelines.',
        es: 'Dockerización de aplicaciones Node.js, builds multi-etapa, variables de entorno, gestión de procesos con PM2, health checks y pipelines de GitHub Actions.',
        it: 'Dockerizzazione di applicazioni Node.js, build multi-stage, variabili d\'ambiente, gestione dei processi con PM2, health check e pipeline GitHub Actions.',
      },
    },
    {
      id: 'd4000000-0000-4000-8000-000000000012',
      label: {
        en: 'Node.js 22+ — Latest Features',
        fr: 'Node.js 22+ — Dernières fonctionnalités',
        de: 'Node.js 22+ — Neueste Funktionen',
        es: 'Node.js 22+ — Últimas características',
        it: 'Node.js 22+ — Ultime funzionalità',
      },
      description: {
        en: 'Built-in test runner (node:test), native fetch, --watch mode, WebStreams, experimental permission model, ESM improvements and the v22 LTS highlights.',
        fr: 'Lanceur de tests intégré (node:test), fetch natif, mode --watch, WebStreams, modèle de permissions expérimental, améliorations ESM et points forts de la v22 LTS.',
        de: 'Eingebauter Test-Runner (node:test), nativer Fetch, --watch-Modus, WebStreams, experimentelles Berechtigungsmodell, ESM-Verbesserungen und v22 LTS-Highlights.',
        es: 'Ejecutor de tests integrado (node:test), fetch nativo, modo --watch, WebStreams, modelo de permisos experimental, mejoras en ESM y novedades destacadas de la v22 LTS.',
        it: 'Test runner integrato (node:test), fetch nativo, modalità --watch, WebStreams, modello di permessi sperimentale, miglioramenti ESM e punti salienti della v22 LTS.',
      },
    },
    {
      id: 'd4100000-0000-4000-8000-000000000001',
      label: {
        en: 'NodeJS Definitions',
        fr: 'Définitions Node.js',
        de: 'Node.js-Definitionen',
        es: 'Definiciones de Node.js',
        it: 'Definizioni di Node.js',
      },
      description: {
        en: 'Core Node.js vocabulary: what is Node.js, event loop phases, V8, libuv, non-blocking I/O, CommonJS vs ESM, npm, package.json, process object, Buffer, streams, EventEmitter, child_process, cluster, worker threads, fs, http, path, env vars, async patterns, error handling and global objects.',
        fr: 'Vocabulaire essentiel de Node.js : qu\'est-ce que Node.js, phases de la boucle d\'événements, V8, libuv, I/O non bloquant, CommonJS vs ESM, npm, package.json, objet process, Buffer, streams, EventEmitter, child_process, cluster, worker threads, fs, http, path, variables d\'environnement, patterns asynchrones, gestion des erreurs et objets globaux.',
        de: 'Node.js-Grundvokabular: was ist Node.js, Event-Loop-Phasen, V8, libuv, nicht-blockierendes I/O, CommonJS vs. ESM, npm, package.json, process-Objekt, Buffer, Streams, EventEmitter, child_process, Cluster, Worker Threads, fs, http, path, Umgebungsvariablen, asynchrone Patterns, Fehlerbehandlung und globale Objekte.',
        es: 'Vocabulario esencial de Node.js: qué es Node.js, fases del bucle de eventos, V8, libuv, I/O no bloqueante, CommonJS vs ESM, npm, package.json, objeto process, Buffer, streams, EventEmitter, child_process, cluster, worker threads, fs, http, path, variables de entorno, patrones asíncronos, manejo de errores y objetos globales.',
        it: 'Vocabolario essenziale di Node.js: cos\'è Node.js, fasi del ciclo degli eventi, V8, libuv, I/O non bloccante, CommonJS vs ESM, npm, package.json, oggetto process, Buffer, stream, EventEmitter, child_process, cluster, worker threads, fs, http, path, variabili d\'ambiente, pattern asincroni, gestione degli errori e oggetti globali.',
      },
    },

    // ─── NestJS ───
    {
      id: 'e5000000-0000-4000-8000-000000000001',
      label: {
        en: 'NestJS Core Concepts',
        fr: 'Concepts fondamentaux de NestJS',
        de: 'NestJS-Kernkonzepte',
        es: 'Conceptos fundamentales de NestJS',
        it: 'Concetti fondamentali di NestJS',
      },
      description: {
        en: 'Modules, controllers, providers, decorators, the request lifecycle and how NestJS builds on top of Express/Fastify.',
        fr: 'Modules, contrôleurs, providers, décorateurs, le cycle de vie des requêtes et comment NestJS s\'appuie sur Express/Fastify.',
        de: 'Module, Controller, Provider, Decorators, der Request-Lebenszyklus und wie NestJS auf Express/Fastify aufbaut.',
        es: 'Módulos, controladores, providers, decoradores, el ciclo de vida de las peticiones y cómo NestJS se construye sobre Express/Fastify.',
        it: 'Moduli, controller, provider, decoratori, il ciclo di vita delle richieste e come NestJS si basa su Express/Fastify.',
      },
    },
    {
      id: 'e5000000-0000-4000-8000-000000000002',
      label: {
        en: 'Dependency Injection & Providers',
        fr: 'Injection de dépendances & providers',
        de: 'Dependency Injection & Provider',
        es: 'Inyección de dependencias & providers',
        it: 'Iniezione delle dipendenze & provider',
      },
      description: {
        en: 'Custom providers (useClass, useValue, useFactory, useExisting), injection scopes (DEFAULT, REQUEST, TRANSIENT) and circular dependency resolution.',
        fr: 'Providers personnalisés (useClass, useValue, useFactory, useExisting), portées d\'injection (DEFAULT, REQUEST, TRANSIENT) et résolution des dépendances circulaires.',
        de: 'Benutzerdefinierte Provider (useClass, useValue, useFactory, useExisting), Injection-Scopes (DEFAULT, REQUEST, TRANSIENT) und Auflösung zirkulärer Abhängigkeiten.',
        es: 'Providers personalizados (useClass, useValue, useFactory, useExisting), ámbitos de inyección (DEFAULT, REQUEST, TRANSIENT) y resolución de dependencias circulares.',
        it: 'Provider personalizzati (useClass, useValue, useFactory, useExisting), ambiti di iniezione (DEFAULT, REQUEST, TRANSIENT) e risoluzione delle dipendenze circolari.',
      },
    },
    {
      id: 'e5000000-0000-4000-8000-000000000003',
      label: {
        en: 'Pipes, Guards & Interceptors',
        fr: 'Pipes, guards & intercepteurs',
        de: 'Pipes, Guards & Interceptors',
        es: 'Pipes, guards & interceptores',
        it: 'Pipes, guards & interceptor',
      },
      description: {
        en: 'Validation pipes with class-validator/class-transformer, role-based guards, interceptors for logging/transformation and exception filters.',
        fr: 'Pipes de validation avec class-validator/class-transformer, guards basés sur les rôles, intercepteurs pour la journalisation/transformation et filtres d\'exceptions.',
        de: 'Validierungs-Pipes mit class-validator/class-transformer, rollenbasierte Guards, Interceptors für Logging/Transformation und Exception-Filter.',
        es: 'Pipes de validación con class-validator/class-transformer, guards basados en roles, interceptores para logging/transformación y filtros de excepciones.',
        it: 'Pipe di validazione con class-validator/class-transformer, guard basati sui ruoli, interceptor per logging/trasformazione e filtri per le eccezioni.',
      },
    },
    {
      id: 'e5000000-0000-4000-8000-000000000004',
      label: {
        en: 'Middleware & Exception Filters',
        fr: 'Middleware & filtres d\'exceptions',
        de: 'Middleware & Exception-Filter',
        es: 'Middleware & filtros de excepciones',
        it: 'Middleware & filtri per le eccezioni',
      },
      description: {
        en: 'Functional and class-based middleware, global vs scoped filters, built-in HttpException and creating custom exception hierarchies.',
        fr: 'Middleware fonctionnel et basé sur des classes, filtres globaux vs scopés, HttpException intégrée et création de hiérarchies d\'exceptions personnalisées.',
        de: 'Funktionales und klassenbasiertes Middleware, globale vs. scopierte Filter, eingebaute HttpException und Erstellung benutzerdefinierter Exception-Hierarchien.',
        es: 'Middleware funcional y basado en clases, filtros globales vs con ámbito, HttpException integrada y creación de jerarquías de excepciones personalizadas.',
        it: 'Middleware funzionale e basato su classi, filtri globali vs con ambito, HttpException integrata e creazione di gerarchie di eccezioni personalizzate.',
      },
    },
    {
      id: 'e5000000-0000-4000-8000-000000000005',
      label: {
        en: 'REST API Design with NestJS',
        fr: 'Conception d\'API REST avec NestJS',
        de: 'REST-API-Design mit NestJS',
        es: 'Diseño de API REST con NestJS',
        it: 'Progettazione di API REST con NestJS',
      },
      description: {
        en: 'Resource-based routing, DTOs, @Body/@Param/@Query decorators, Swagger/OpenAPI with @nestjs/swagger and API versioning.',
        fr: 'Routage basé sur les ressources, DTOs, décorateurs @Body/@Param/@Query, Swagger/OpenAPI avec @nestjs/swagger et versionnage d\'API.',
        de: 'Ressourcenbasiertes Routing, DTOs, @Body/@Param/@Query-Dekoratoren, Swagger/OpenAPI mit @nestjs/swagger und API-Versionierung.',
        es: 'Enrutamiento basado en recursos, DTOs, decoradores @Body/@Param/@Query, Swagger/OpenAPI con @nestjs/swagger y versionado de API.',
        it: 'Routing basato sulle risorse, DTO, decoratori @Body/@Param/@Query, Swagger/OpenAPI con @nestjs/swagger e versionamento delle API.',
      },
    },
    {
      id: 'e5000000-0000-4000-8000-000000000006',
      label: {
        en: 'GraphQL with NestJS',
        fr: 'GraphQL avec NestJS',
        de: 'GraphQL mit NestJS',
        es: 'GraphQL con NestJS',
        it: 'GraphQL con NestJS',
      },
      description: {
        en: 'Code-first and schema-first approaches, resolvers, @ObjectType/@InputType, DataLoader for N+1 prevention and subscriptions.',
        fr: 'Approches code-first et schema-first, resolvers, @ObjectType/@InputType, DataLoader pour la prévention du N+1 et subscriptions.',
        de: 'Code-first- und Schema-first-Ansätze, Resolver, @ObjectType/@InputType, DataLoader zur N+1-Prävention und Subscriptions.',
        es: 'Enfoques code-first y schema-first, resolvers, @ObjectType/@InputType, DataLoader para prevención del N+1 y subscriptions.',
        it: 'Approcci code-first e schema-first, resolver, @ObjectType/@InputType, DataLoader per la prevenzione dell\'N+1 e subscriptions.',
      },
    },
    {
      id: 'e5000000-0000-4000-8000-000000000007',
      label: {
        en: 'Authentication & Authorization',
        fr: 'Authentification & autorisation',
        de: 'Authentifizierung & Autorisierung',
        es: 'Autenticación & autorización',
        it: 'Autenticazione & autorizzazione',
      },
      description: {
        en: 'Passport.js strategies, JWT with @nestjs/jwt, refresh tokens, RBAC with custom guards and @nestjs/casl integration.',
        fr: 'Stratégies Passport.js, JWT avec @nestjs/jwt, tokens de rafraîchissement, RBAC avec des guards personnalisés et intégration de @nestjs/casl.',
        de: 'Passport.js-Strategien, JWT mit @nestjs/jwt, Refresh Tokens, RBAC mit benutzerdefinierten Guards und @nestjs/casl-Integration.',
        es: 'Estrategias Passport.js, JWT con @nestjs/jwt, tokens de actualización, RBAC con guards personalizados e integración de @nestjs/casl.',
        it: 'Strategie Passport.js, JWT con @nestjs/jwt, refresh token, RBAC con guard personalizzati e integrazione di @nestjs/casl.',
      },
    },
    {
      id: 'e5000000-0000-4000-8000-000000000008',
      label: {
        en: 'TypeORM & Database Integration',
        fr: 'TypeORM & intégration de base de données',
        de: 'TypeORM & Datenbankintegration',
        es: 'TypeORM & integración de base de datos',
        it: 'TypeORM & integrazione del database',
      },
      description: {
        en: 'TypeOrmModule setup, repositories, entities, migrations, transactions, query builder and relation handling in NestJS.',
        fr: 'Configuration de TypeOrmModule, repositories, entités, migrations, transactions, query builder et gestion des relations dans NestJS.',
        de: 'TypeOrmModule-Setup, Repositories, Entities, Migrations, Transaktionen, Query Builder und Beziehungsverwaltung in NestJS.',
        es: 'Configuración de TypeOrmModule, repositorios, entidades, migraciones, transacciones, query builder y manejo de relaciones en NestJS.',
        it: 'Configurazione di TypeOrmModule, repository, entità, migrazioni, transazioni, query builder e gestione delle relazioni in NestJS.',
      },
    },
    {
      id: 'e5000000-0000-4000-8000-000000000009',
      label: {
        en: 'Microservices & Message Queues',
        fr: 'Microservices & files de messages',
        de: 'Microservices & Message Queues',
        es: 'Microservicios & colas de mensajes',
        it: 'Microservizi & code di messaggi',
      },
      description: {
        en: 'NestJS microservice transports (TCP, Redis, RabbitMQ, Kafka), @MessagePattern/@EventPattern, hybrid apps and gRPC.',
        fr: 'Transports de microservices NestJS (TCP, Redis, RabbitMQ, Kafka), @MessagePattern/@EventPattern, applications hybrides et gRPC.',
        de: 'NestJS-Microservice-Transporte (TCP, Redis, RabbitMQ, Kafka), @MessagePattern/@EventPattern, hybride Apps und gRPC.',
        es: 'Transportes de microservicios NestJS (TCP, Redis, RabbitMQ, Kafka), @MessagePattern/@EventPattern, aplicaciones híbridas y gRPC.',
        it: 'Trasporti di microservizi NestJS (TCP, Redis, RabbitMQ, Kafka), @MessagePattern/@EventPattern, applicazioni ibride e gRPC.',
      },
    },
    {
      id: 'e5000000-0000-4000-8000-000000000010',
      label: {
        en: 'Testing NestJS Apps',
        fr: 'Tester les applications NestJS',
        de: 'NestJS-Apps testen',
        es: 'Testeo de aplicaciones NestJS',
        it: 'Testare le applicazioni NestJS',
      },
      description: {
        en: 'Unit testing with Jest, createTestingModule(), mocking providers, e2e testing with supertest and testing guards/interceptors.',
        fr: 'Tests unitaires avec Jest, createTestingModule(), simulation de providers, tests e2e avec supertest et tests de guards/intercepteurs.',
        de: 'Unit-Tests mit Jest, createTestingModule(), Provider-Mocking, E2E-Tests mit Supertest und Testen von Guards/Interceptors.',
        es: 'Tests unitarios con Jest, createTestingModule(), simulación de providers, tests e2e con supertest y testeo de guards/interceptores.',
        it: 'Test unitari con Jest, createTestingModule(), mocking dei provider, test e2e con supertest e test di guard/interceptor.',
      },
    },
    {
      id: 'e5000000-0000-4000-8000-000000000011',
      label: {
        en: 'Configuration, Caching & Task Scheduling',
        fr: 'Configuration, cache & planification de tâches',
        de: 'Konfiguration, Caching & Aufgabenplanung',
        es: 'Configuración, caché & planificación de tareas',
        it: 'Configurazione, cache & pianificazione dei task',
      },
      description: {
        en: '@nestjs/config with validation, CacheModule with Redis, @Cron/@Interval/@Timeout with @nestjs/schedule and Bull queues.',
        fr: '@nestjs/config avec validation, CacheModule avec Redis, @Cron/@Interval/@Timeout avec @nestjs/schedule et files Bull.',
        de: '@nestjs/config mit Validierung, CacheModule mit Redis, @Cron/@Interval/@Timeout mit @nestjs/schedule und Bull-Queues.',
        es: '@nestjs/config con validación, CacheModule con Redis, @Cron/@Interval/@Timeout con @nestjs/schedule y colas Bull.',
        it: '@nestjs/config con validazione, CacheModule con Redis, @Cron/@Interval/@Timeout con @nestjs/schedule e code Bull.',
      },
    },
    {
      id: 'e5100000-0000-4000-8000-000000000001',
      label: {
        en: 'NestJS Definitions',
        fr: 'Définitions NestJS',
        de: 'NestJS-Definitionen',
        es: 'Definiciones de NestJS',
        it: 'Definizioni di NestJS',
      },
      description: {
        en: 'Core NestJS vocabulary: modules, controllers, providers, services, dependency injection, decorators, DTOs, guards, interceptors, pipes, exception filters, middleware, execution context, request lifecycle, validation, dynamic modules, CQRS, microservices and WebSockets.',
        fr: 'Vocabulaire essentiel de NestJS : modules, contrôleurs, providers, services, injection de dépendances, décorateurs, DTOs, guards, intercepteurs, pipes, filtres d\'exceptions, middleware, contexte d\'exécution, cycle de vie des requêtes, validation, modules dynamiques, CQRS, microservices et WebSockets.',
        de: 'NestJS-Grundvokabular: Module, Controller, Provider, Services, Dependency Injection, Dekoratoren, DTOs, Guards, Interceptors, Pipes, Exception-Filter, Middleware, Ausführungskontext, Request-Lebenszyklus, Validierung, dynamische Module, CQRS, Microservices und WebSockets.',
        es: 'Vocabulario esencial de NestJS: módulos, controladores, providers, servicios, inyección de dependencias, decoradores, DTOs, guards, interceptores, pipes, filtros de excepciones, middleware, contexto de ejecución, ciclo de vida de las peticiones, validación, módulos dinámicos, CQRS, microservicios y WebSockets.',
        it: 'Vocabolario essenziale di NestJS: moduli, controller, provider, servizi, iniezione delle dipendenze, decoratori, DTO, guard, interceptor, pipe, filtri per le eccezioni, middleware, contesto di esecuzione, ciclo di vita delle richieste, validazione, moduli dinamici, CQRS, microservizi e WebSocket.',
      },
    },

    // ─── SQL ───
    {
      id: 'f6000000-0000-4000-8000-000000000001',
      label: {
        en: 'SQL Fundamentals',
        fr: 'Fondamentaux SQL',
        de: 'SQL-Grundlagen',
        es: 'Fundamentos de SQL',
        it: 'Fondamenti di SQL',
      },
      description: {
        en: 'Relational model basics, DDL (CREATE, ALTER, DROP), DML (SELECT, INSERT, UPDATE, DELETE) and data types in PostgreSQL.',
        fr: 'Bases du modèle relationnel, DDL (CREATE, ALTER, DROP), DML (SELECT, INSERT, UPDATE, DELETE) et types de données dans PostgreSQL.',
        de: 'Grundlagen des relationalen Modells, DDL (CREATE, ALTER, DROP), DML (SELECT, INSERT, UPDATE, DELETE) und Datentypen in PostgreSQL.',
        es: 'Fundamentos del modelo relacional, DDL (CREATE, ALTER, DROP), DML (SELECT, INSERT, UPDATE, DELETE) y tipos de datos en PostgreSQL.',
        it: 'Basi del modello relazionale, DDL (CREATE, ALTER, DROP), DML (SELECT, INSERT, UPDATE, DELETE) e tipi di dati in PostgreSQL.',
      },
    },
    {
      id: 'f6000000-0000-4000-8000-000000000002',
      label: {
        en: 'Filtering, Sorting & Aggregation',
        fr: 'Filtrage, tri & agrégation',
        de: 'Filtern, Sortieren & Aggregation',
        es: 'Filtrado, ordenamiento & agregación',
        it: 'Filtraggio, ordinamento & aggregazione',
      },
      description: {
        en: 'WHERE, ORDER BY, LIMIT/OFFSET, GROUP BY, HAVING, aggregate functions (COUNT, SUM, AVG, MIN, MAX) and DISTINCT.',
        fr: 'WHERE, ORDER BY, LIMIT/OFFSET, GROUP BY, HAVING, fonctions d\'agrégation (COUNT, SUM, AVG, MIN, MAX) et DISTINCT.',
        de: 'WHERE, ORDER BY, LIMIT/OFFSET, GROUP BY, HAVING, Aggregatfunktionen (COUNT, SUM, AVG, MIN, MAX) und DISTINCT.',
        es: 'WHERE, ORDER BY, LIMIT/OFFSET, GROUP BY, HAVING, funciones de agregación (COUNT, SUM, AVG, MIN, MAX) y DISTINCT.',
        it: 'WHERE, ORDER BY, LIMIT/OFFSET, GROUP BY, HAVING, funzioni di aggregazione (COUNT, SUM, AVG, MIN, MAX) e DISTINCT.',
      },
    },
    {
      id: 'f6000000-0000-4000-8000-000000000003',
      label: {
        en: 'Joins & Relationships',
        fr: 'Jointures & relations',
        de: 'Joins & Beziehungen',
        es: 'Joins & relaciones',
        it: 'Join & relazioni',
      },
      description: {
        en: 'INNER, LEFT, RIGHT, FULL OUTER and CROSS JOINs, self-joins, foreign keys, ON DELETE CASCADE and resolving N+1 with joins.',
        fr: 'INNER, LEFT, RIGHT, FULL OUTER et CROSS JOIN, auto-jointures, clés étrangères, ON DELETE CASCADE et résolution du N+1 avec les jointures.',
        de: 'INNER, LEFT, RIGHT, FULL OUTER und CROSS JOINs, Self-Joins, Fremdschlüssel, ON DELETE CASCADE und N+1-Auflösung mit Joins.',
        es: 'INNER, LEFT, RIGHT, FULL OUTER y CROSS JOINs, self-joins, claves foráneas, ON DELETE CASCADE y resolución del N+1 con joins.',
        it: 'INNER, LEFT, RIGHT, FULL OUTER e CROSS JOIN, self-join, chiavi esterne, ON DELETE CASCADE e risoluzione dell\'N+1 con i join.',
      },
    },
    {
      id: 'f6000000-0000-4000-8000-000000000004',
      label: {
        en: 'Subqueries & CTEs',
        fr: 'Sous-requêtes & CTEs',
        de: 'Unterabfragen & CTEs',
        es: 'Subconsultas & CTEs',
        it: 'Sottoquery & CTE',
      },
      description: {
        en: 'Correlated and non-correlated subqueries, EXISTS/IN/ANY/ALL, Common Table Expressions (WITH), recursive CTEs and readability trade-offs.',
        fr: 'Sous-requêtes corrélées et non corrélées, EXISTS/IN/ANY/ALL, expressions de table communes (WITH), CTEs récursives et compromis de lisibilité.',
        de: 'Korrelierte und nicht-korrelierte Unterabfragen, EXISTS/IN/ANY/ALL, Common Table Expressions (WITH), rekursive CTEs und Lesbarkeitskompromisse.',
        es: 'Subconsultas correlacionadas y no correlacionadas, EXISTS/IN/ANY/ALL, expresiones de tabla comunes (WITH), CTEs recursivas y compromisos de legibilidad.',
        it: 'Sottoquery correlate e non correlate, EXISTS/IN/ANY/ALL, Common Table Expressions (WITH), CTE ricorsive e compromessi di leggibilità.',
      },
    },
    {
      id: 'f6000000-0000-4000-8000-000000000005',
      label: {
        en: 'Window Functions',
        fr: 'Fonctions de fenêtrage',
        de: 'Fensterfunktionen',
        es: 'Funciones de ventana',
        it: 'Funzioni finestra',
      },
      description: {
        en: 'ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, FIRST_VALUE, LAST_VALUE, PARTITION BY / ORDER BY inside OVER() and frame clauses.',
        fr: 'ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, FIRST_VALUE, LAST_VALUE, PARTITION BY / ORDER BY dans OVER() et clauses de cadre.',
        de: 'ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, FIRST_VALUE, LAST_VALUE, PARTITION BY / ORDER BY in OVER() und Frame-Klauseln.',
        es: 'ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, FIRST_VALUE, LAST_VALUE, PARTITION BY / ORDER BY dentro de OVER() y cláusulas de marco.',
        it: 'ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, FIRST_VALUE, LAST_VALUE, PARTITION BY / ORDER BY dentro OVER() e clausole di frame.',
      },
    },
    {
      id: 'f6000000-0000-4000-8000-000000000006',
      label: {
        en: 'Indexes & Query Performance',
        fr: 'Index & performance des requêtes',
        de: 'Indizes & Abfrage-Performance',
        es: 'Índices & rendimiento de consultas',
        it: 'Indici & prestazioni delle query',
      },
      description: {
        en: 'B-tree, hash, GIN and GiST indexes, EXPLAIN ANALYZE, sequential vs index scans, composite indexes and covering indexes.',
        fr: 'Index B-tree, hash, GIN et GiST, EXPLAIN ANALYZE, parcours séquentiel vs parcours d\'index, index composites et index couvrants.',
        de: 'B-Tree-, Hash-, GIN- und GiST-Indizes, EXPLAIN ANALYZE, Sequential Scan vs. Index Scan, zusammengesetzte Indizes und Covering-Indizes.',
        es: 'Índices B-tree, hash, GIN y GiST, EXPLAIN ANALYZE, escaneo secuencial vs escaneo por índice, índices compuestos e índices de cobertura.',
        it: 'Indici B-tree, hash, GIN e GiST, EXPLAIN ANALYZE, scansione sequenziale vs scansione per indice, indici composti e indici di copertura.',
      },
    },
    {
      id: 'f6000000-0000-4000-8000-000000000007',
      label: {
        en: 'Transactions & Concurrency',
        fr: 'Transactions & concurrence',
        de: 'Transaktionen & Nebenläufigkeit',
        es: 'Transacciones & concurrencia',
        it: 'Transazioni & concorrenza',
      },
      description: {
        en: 'ACID properties, isolation levels (READ COMMITTED, REPEATABLE READ, SERIALIZABLE), deadlocks, MVCC and pessimistic vs optimistic locking.',
        fr: 'Propriétés ACID, niveaux d\'isolation (READ COMMITTED, REPEATABLE READ, SERIALIZABLE), interblocages, MVCC et verrouillage pessimiste vs optimiste.',
        de: 'ACID-Eigenschaften, Isolationsstufen (READ COMMITTED, REPEATABLE READ, SERIALIZABLE), Deadlocks, MVCC und pessimistisches vs. optimistisches Sperren.',
        es: 'Propiedades ACID, niveles de aislamiento (READ COMMITTED, REPEATABLE READ, SERIALIZABLE), deadlocks, MVCC y bloqueo pesimista vs optimista.',
        it: 'Proprietà ACID, livelli di isolamento (READ COMMITTED, REPEATABLE READ, SERIALIZABLE), deadlock, MVCC e blocco pessimistico vs ottimistico.',
      },
    },
    {
      id: 'f6000000-0000-4000-8000-000000000008',
      label: {
        en: 'Schema Design & Normalisation',
        fr: 'Conception de schéma & normalisation',
        de: 'Schemadesign & Normalisierung',
        es: 'Diseño de esquema & normalización',
        it: 'Progettazione dello schema & normalizzazione',
      },
      description: {
        en: '1NF through 3NF/BCNF, denormalisation trade-offs, entity-relationship modelling, many-to-many junction tables and UUID vs serial PKs.',
        fr: 'De la 1NF à la 3NF/BCNF, compromis de dénormalisation, modélisation entité-relation, tables de jonction many-to-many et UUID vs clés primaires séquentielles.',
        de: '1NF bis 3NF/BCNF, Denormalisierungskompromisse, Entity-Relationship-Modellierung, Many-to-Many-Verbindungstabellen und UUID vs. serielle Primärschlüssel.',
        es: 'De la 1NF a la 3NF/BCNF, compromisos de desnormalización, modelado entidad-relación, tablas de unión many-to-many y UUID vs claves primarias seriales.',
        it: 'Dalla 1NF alla 3NF/BCNF, compromessi di denormalizzazione, modellazione entità-relazione, tabelle di giunzione many-to-many e UUID vs chiavi primarie seriali.',
      },
    },
    {
      id: 'f6000000-0000-4000-8000-000000000009',
      label: {
        en: 'PostgreSQL Advanced Features',
        fr: 'Fonctionnalités avancées de PostgreSQL',
        de: 'Erweiterte PostgreSQL-Funktionen',
        es: 'Funcionalidades avanzadas de PostgreSQL',
        it: 'Funzionalità avanzate di PostgreSQL',
      },
      description: {
        en: 'JSONB columns, full-text search, array types, generated columns, partitioning, triggers, stored procedures and pg extensions.',
        fr: 'Colonnes JSONB, recherche plein texte, types tableau, colonnes générées, partitionnement, triggers, procédures stockées et extensions pg.',
        de: 'JSONB-Spalten, Volltextsuche, Array-Typen, generierte Spalten, Partitionierung, Trigger, gespeicherte Prozeduren und pg-Erweiterungen.',
        es: 'Columnas JSONB, búsqueda de texto completo, tipos array, columnas generadas, particionamiento, triggers, procedimientos almacenados y extensiones pg.',
        it: 'Colonne JSONB, ricerca full-text, tipi array, colonne generate, partizionamento, trigger, procedure memorizzate ed estensioni pg.',
      },
    },
    {
      id: 'f6000000-0000-4000-8000-000000000010',
      label: {
        en: 'Migrations & Database Versioning',
        fr: 'Migrations & versionnage de base de données',
        de: 'Migrationen & Datenbank-Versionierung',
        es: 'Migraciones & versionado de base de datos',
        it: 'Migrazioni & versionamento del database',
      },
      description: {
        en: 'Migration strategies, TypeORM and Prisma migration workflows, schema drift, zero-downtime migrations and rollback patterns.',
        fr: 'Stratégies de migration, workflows de migration TypeORM et Prisma, dérive de schéma, migrations sans interruption et patterns de rollback.',
        de: 'Migrationsstrategien, TypeORM- und Prisma-Migrationsworkflows, Schema-Drift, Zero-Downtime-Migrationen und Rollback-Patterns.',
        es: 'Estrategias de migración, flujos de trabajo de migración con TypeORM y Prisma, desfase de esquema, migraciones sin tiempo de inactividad y patrones de rollback.',
        it: 'Strategie di migrazione, flussi di lavoro di migrazione con TypeORM e Prisma, deriva dello schema, migrazioni senza downtime e pattern di rollback.',
      },
    },

    // ─── TypeScript ───
    {
      id: '07000000-0000-4000-8000-000000000001',
      label: {
        en: 'TypeScript Definitions',
        fr: 'Définitions TypeScript',
        de: 'TypeScript-Definitionen',
        es: 'Definiciones de TypeScript',
        it: 'Definizioni di TypeScript',
      },
      description: {
        en: 'Core TypeScript vocabulary: what is TypeScript, type aliases, interfaces, unions, intersections, generics, tuples, enums, utility types, type guards, never, unknown, mapped types, conditional types and discriminated unions.',
        fr: 'Vocabulaire essentiel de TypeScript : qu\'est-ce que TypeScript, alias de types, interfaces, unions, intersections, génériques, tuples, enums, types utilitaires, type guards, never, unknown, types mappés, types conditionnels et unions discriminées.',
        de: 'TypeScript-Grundvokabular: was ist TypeScript, Type Aliases, Interfaces, Unions, Intersections, Generics, Tuples, Enums, Utility Types, Type Guards, never, unknown, Mapped Types, Conditional Types und Discriminated Unions.',
        es: 'Vocabulario esencial de TypeScript: qué es TypeScript, alias de tipos, interfaces, uniones, intersecciones, genéricos, tuplas, enums, tipos utilitarios, type guards, never, unknown, tipos mapeados, tipos condicionales y uniones discriminadas.',
        it: 'Vocabolario essenziale di TypeScript: cos\'è TypeScript, alias di tipo, interfacce, unioni, intersezioni, generici, tuple, enum, tipi utilitari, type guards, never, unknown, tipi mappati, tipi condizionali e unioni discriminate.',
      },
    },

    // ─── Others ───
    {
      id: '08100000-0000-4000-8000-000000000001',
      label: {
        en: 'GraphQL Definitions',
        fr: 'Définitions GraphQL',
        de: 'GraphQL-Definitionen',
        es: 'Definiciones de GraphQL',
        it: 'Definizioni di GraphQL',
      },
      description: {
        en: 'Core GraphQL vocabulary: what is GraphQL, schema, queries, mutations, subscriptions, resolvers, type definitions, scalar/object/input/enum/interface/union types, fragments, variables, directives, N+1 problem, DataLoader, code-first vs schema-first, Apollo Server/Client, authentication, pagination, Federation and schema stitching.',
        fr: 'Vocabulaire essentiel de GraphQL : qu\'est-ce que GraphQL, schéma, queries, mutations, subscriptions, resolvers, définitions de types, types scalaire/objet/input/enum/interface/union, fragments, variables, directives, problème N+1, DataLoader, code-first vs schema-first, Apollo Server/Client, authentification, pagination, Federation et schema stitching.',
        de: 'GraphQL-Grundvokabular: was ist GraphQL, Schema, Queries, Mutations, Subscriptions, Resolver, Typdefinitionen, Scalar/Object/Input/Enum/Interface/Union-Typen, Fragments, Variablen, Direktiven, N+1-Problem, DataLoader, Code-first vs. Schema-first, Apollo Server/Client, Authentifizierung, Pagination, Federation und Schema Stitching.',
        es: 'Vocabulario esencial de GraphQL: qué es GraphQL, esquema, queries, mutations, subscriptions, resolvers, definiciones de tipos, tipos scalar/object/input/enum/interface/union, fragments, variables, directivas, problema N+1, DataLoader, code-first vs schema-first, Apollo Server/Client, autenticación, paginación, Federation y schema stitching.',
        it: 'Vocabolario essenziale di GraphQL: cos\'è GraphQL, schema, query, mutation, subscription, resolver, definizioni di tipo, tipi scalar/object/input/enum/interface/union, fragment, variabili, direttive, problema N+1, DataLoader, code-first vs schema-first, Apollo Server/Client, autenticazione, paginazione, Federation e schema stitching.',
      },
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const m of this.modules) {
      // Update label — handles both plain strings and objects with only 'en' key
      await queryRunner.query(
        `UPDATE "qcm_module"
         SET "label" = $1::jsonb
         WHERE "id" = $2`,
        [JSON.stringify(m.label), m.id]
      );

      // Update description
      if (m.description) {
        await queryRunner.query(
          `UPDATE "qcm_module"
           SET "description" = $1::jsonb
           WHERE "id" = $2
             AND "description" IS NOT NULL`,
          [JSON.stringify(m.description), m.id]
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert all i18n objects back to plain English strings
    for (const m of this.modules) {
      await queryRunner.query(
        `UPDATE "qcm_module"
         SET "label" = to_jsonb("label"->>'en')
         WHERE "id" = $1
           AND jsonb_typeof("label") = 'object'`,
        [m.id]
      );

      if (m.description) {
        await queryRunner.query(
          `UPDATE "qcm_module"
           SET "description" = to_jsonb("description"->>'en')
           WHERE "id" = $1
             AND "description" IS NOT NULL
             AND jsonb_typeof("description") = 'object'`,
          [m.id]
        );
      }
    }
  }
}
