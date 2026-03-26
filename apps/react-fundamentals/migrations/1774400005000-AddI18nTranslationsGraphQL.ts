import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddI18nTranslationsGraphQL1774400005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE qcm_module SET label = label || $1::jsonb, description = description || $2::jsonb WHERE id = $3`,
      [
        JSON.stringify({
          fr: 'Définitions GraphQL',
          de: 'GraphQL-Definitionen',
          es: 'Definiciones de GraphQL',
          it: 'Definizioni GraphQL',
        }),
        JSON.stringify({
          fr: 'Vocabulaire de base GraphQL : ce que GraphQL est, schema, queries, mutations, subscriptions, resolvers, type definitions, scalar/object/input/enum/interface/union types, fragments, variables, directives, N+1 problem, DataLoader, approche code-first vs schema-first, Apollo Server/Client, authentication, pagination, Federation et schema stitching.',
          de: 'Zentrales GraphQL-Vokabular: was GraphQL ist, schema, queries, mutations, subscriptions, resolvers, type definitions, scalar/object/input/enum/interface/union types, fragments, variables, directives, N+1 problem, DataLoader, Code-first vs Schema-first, Apollo Server/Client, authentication, pagination, Federation und schema stitching.',
          es: 'Vocabulario básico de GraphQL: qué es GraphQL, schema, queries, mutations, subscriptions, resolvers, type definitions, scalar/object/input/enum/interface/union types, fragments, variables, directives, N+1 problem, DataLoader, enfoque code-first vs schema-first, Apollo Server/Client, authentication, pagination, Federation y schema stitching.',
          it: "Vocabolario base di GraphQL: che cos'è GraphQL, schema, queries, mutations, subscriptions, resolvers, type definitions, scalar/object/input/enum/interface/union types, fragments, variables, directives, N+1 problem, DataLoader, approccio code-first vs schema-first, Apollo Server/Client, authentication, pagination, Federation e schema stitching.",
        }),
        '08100000-0000-4000-8000-000000000001',
      ]
    );

    // 08100001-0000-4000-8001-000000000001 - What is GraphQL?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que GraphQL ?",
          de: 'Was ist GraphQL?',
          es: '¿Qué es GraphQL?',
          it: "Che cos'è GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Un langage de requête de base de données orienté graphes similaire à Cypher',
            'Un langage de requête pour des APIs et un runtime qui exécute ces queries et permet aux clients de demander exactement les données dont ils ont besoin',
            'Un format de sérialisation JSON développé par Meta',
            "Un framework REST avec génération automatique d'endpoints basés sur un graphe",
          ],
          de: [
            'Eine graphorientierte Datenbankabfragesprache ähnlich wie Cypher',
            'Eine Abfragesprache für APIs und ein Runtime, das diese queries ausführt und Clients erlaubt, genau die Daten anzufordern, die sie brauchen',
            'Ein JSON-Serialisierungsformat, das von Meta entwickelt wurde',
            'Ein REST-Framework mit automatischer, graphbasierter Endpoint-Generierung',
          ],
          es: [
            'Un lenguaje de consultas de base de datos orientado a grafos similar a Cypher',
            'Un lenguaje de consulta para APIs y un runtime que ejecuta esas queries y permite a los clientes pedir exactamente los datos que necesitan',
            'Un formato de serialización JSON desarrollado por Meta',
            'Un framework REST con generación automática de endpoints basados en grafos',
          ],
          it: [
            'Un linguaggio di query per database a grafi simile a Cypher',
            'Un linguaggio di query per API e un runtime che esegue queste queries permettendo ai client di richiedere esattamente i dati di cui hanno bisogno',
            'Un formato di serializzazione JSON sviluppato da Meta',
            'Un framework REST con generazione automatica di endpoint basati su grafi',
          ],
        }),
        JSON.stringify({
          fr: "GraphQL est un langage de requête pour des APIs (et non pour des bases de données) et un runtime côté serveur créé par Meta. Au lieu d'avoir de nombreux endpoints REST figés, une seule query GraphQL permet au client de décrire précisément les champs dont il a besoin, ce qui évite l'over-fetching et l'under-fetching.",
          de: 'GraphQL ist eine Abfragesprache für APIs (nicht für Datenbanken) und ein serverseitiges Runtime von Meta. Anstatt vieler fester REST-Endpunkte definiert eine einzige GraphQL-query, welche Felder der Client genau benötigt, was Over-Fetching und Under-Fetching reduziert.',
          es: 'GraphQL es un lenguaje de consultas para APIs (no para bases de datos) y un runtime del lado del servidor creado por Meta. En lugar de muchos endpoints REST rígidos, una sola query de GraphQL permite al cliente describir exactamente los campos que necesita, evitando over-fetching y under-fetching.',
          it: 'GraphQL è un linguaggio di query per API (non per database) e un runtime lato server creato da Meta. Invece di molti endpoint REST rigidi, una singola query GraphQL permette al client di descrivere in modo preciso i campi di cui ha bisogno, evitando over-fetching e under-fetching.',
        }),
        '08100001-0000-4000-8001-000000000001',
      ]
    );

    // 08100001-0000-4000-8001-000000000002 - What is a GraphQL Schema?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un schema GraphQL ?",
          de: 'Was ist ein GraphQL-Schema?',
          es: '¿Qué es un schema de GraphQL?',
          it: "Che cos'è uno schema GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Un fichier JSON qui décrit des endpoints REST',
            'Une description fortement typée du graphe de données qui définit tous les types, queries, mutations et subscriptions disponibles dans une API GraphQL',
            'Un schema de base de données généré à partir des queries GraphQL',
            'Un fichier de configuration pour Apollo Client',
          ],
          de: [
            'Eine JSON-Datei, die REST-Endpunkte beschreibt',
            'Eine stark typisierte Beschreibung des Datengraphen, die alle Typen, queries, mutations und subscriptions einer GraphQL-API definiert',
            'Ein Datenbankschema, das aus GraphQL-queries generiert wird',
            'Eine Konfigurationsdatei für Apollo Client',
          ],
          es: [
            'Un archivo JSON que describe endpoints REST',
            'Una descripción fuertemente tipada del grafo de datos que define todos los tipos, queries, mutations y subscriptions disponibles en una API de GraphQL',
            'Un schema de base de datos generado a partir de queries de GraphQL',
            'Un archivo de configuración para Apollo Client',
          ],
          it: [
            'Un file JSON che descrive endpoint REST',
            'Una descrizione fortemente tipizzata del grafo di dati che definisce tutti i tipi, queries, mutations e subscriptions disponibili in una API GraphQL',
            'Uno schema di database generato a partire dalle query GraphQL',
            'Un file di configurazione per Apollo Client',
          ],
        }),
        JSON.stringify({
          fr: 'Le schema GraphQL est le contrat entre client et serveur. Il est écrit en SDL (Schema Definition Language) et décrit les types, leurs champs et les types racines Query, Mutation et Subscription auxquels toute query valide doit se conformer.',
          de: 'Das GraphQL-Schema ist der Vertrag zwischen Client und Server. Es wird in SDL (Schema Definition Language) geschrieben und beschreibt alle Typen, deren Felder sowie die Root-Typen Query, Mutation und Subscription, gegen die jede gültige query geprüft wird.',
          es: 'El schema de GraphQL es el contrato entre el cliente y el servidor. Se escribe en SDL (Schema Definition Language) y describe los tipos, sus campos y los tipos raíz Query, Mutation y Subscription a los que debe ajustarse cualquier query válida.',
          it: 'Lo schema GraphQL è il contratto tra client e server. È scritto in SDL (Schema Definition Language) e descrive i tipi, i loro campi e i tipi radice Query, Mutation e Subscription a cui deve conformarsi qualsiasi query valida.',
        }),
        '08100001-0000-4000-8001-000000000002',
      ]
    );

    // 08100001-0000-4000-8001-000000000003 - What is a GraphQL Query?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'une query GraphQL ?",
          de: 'Was ist eine GraphQL-Query?',
          es: '¿Qué es una query de GraphQL?',
          it: "Che cos'è una query GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Une mutation qui lit et écrit les données en même temps',
            'Une opération en lecture seule dans GraphQL qui récupère des données du serveur, analogue à une requête GET en REST',
            "Une chaîne envoyée dans le corps d'une requête REST",
            'Un type défini dans le schema GraphQL',
          ],
          de: [
            'Eine mutation, die Daten gleichzeitig liest und schreibt',
            'Eine schreibgeschützte Operation in GraphQL, die Daten vom Server holt und grob einer GET-Anfrage in REST entspricht',
            'Ein String im Body einer REST-Anfrage',
            'Ein im GraphQL-Schema definierter Typ',
          ],
          es: [
            'Una mutation que lee y escribe datos al mismo tiempo',
            'Una operación de solo lectura en GraphQL que obtiene datos del servidor, análoga a una petición GET en REST',
            'Una cadena enviada en el cuerpo de una petición REST',
            'Un tipo definido en el schema de GraphQL',
          ],
          it: [
            'Una mutation che legge e scrive dati contemporaneamente',
            "Un'operazione di sola lettura in GraphQL che recupera dati dal server, analoga a una richiesta GET in REST",
            'Una stringa inviata nel body di una richiesta REST',
            'Un tipo definito nello schema GraphQL',
          ],
        }),
        JSON.stringify({
          fr: "Une query est l'un des trois types d'opérations GraphQL, avec mutation et subscription. Elle est utilisée pour lire des données, le client listant précisément les champs dont il a besoin et le serveur ne renvoyant que ces champs.",
          de: 'Eine query ist einer der drei Operationstypen in GraphQL neben mutation und subscription. Sie dient zum Lesen von Daten; der Client gibt genau die Felder an, die er benötigt, und der Server liefert nur diese Felder zurück.',
          es: 'Una query es uno de los tres tipos de operaciones en GraphQL junto con mutation y subscription. Se utiliza para leer datos; el cliente especifica exactamente los campos que necesita y el servidor devuelve solo esos campos.',
          it: 'Una query è uno dei tre tipi di operazioni in GraphQL insieme a mutation e subscription. Si usa per leggere dati; il client specifica esattamente i campi di cui ha bisogno e il server restituisce solo quei campi.',
        }),
        '08100001-0000-4000-8001-000000000003',
      ]
    );

    // 08100001-0000-4000-8001-000000000004 - What is a GraphQL Mutation?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'une mutation GraphQL ?",
          de: 'Was ist eine GraphQL-Mutation?',
          es: '¿Qué es una mutation de GraphQL?',
          it: "Che cos'è una mutation GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Une opération qui ne lit que les données et met à jour le cache local',
            "Un type d'opération utilisé pour écrire des données (création, mise à jour, suppression) sur le serveur, analogue aux verbes POST/PUT/DELETE en REST",
            'Une subscription qui met les données à jour en temps réel',
            'Une directive de schema qui modifie des types à la compilation',
          ],
          de: [
            'Eine Operation, die nur Daten liest und den lokalen Cache aktualisiert',
            'Ein Operationstyp zum Schreiben von Daten (Erstellen, Aktualisieren, Löschen) auf dem Server, analog zu POST/PUT/DELETE in REST',
            'Eine subscription, die Daten in Echtzeit aktualisiert',
            'Eine Schema-Direktive, die Typen zur Build-Zeit verändert',
          ],
          es: [
            'Una operación que solo lee datos y actualiza la caché local',
            'Un tipo de operación usado para escribir datos (crear, actualizar, eliminar) en el servidor, análogo a POST/PUT/DELETE en REST',
            'Una subscription que actualiza datos en tiempo real',
            'Una directive del schema que modifica tipos en tiempo de compilación',
          ],
          it: [
            "Un'operazione che legge soltanto i dati e aggiorna la cache locale",
            'Un tipo di operazione usato per scrivere dati (creare, aggiornare, eliminare) sul server, analogo a POST/PUT/DELETE in REST',
            'Una subscription che aggiorna i dati in tempo reale',
            'Una directive dello schema che modifica i tipi in fase di build',
          ],
        }),
        JSON.stringify({
          fr: "Une mutation est l'opération GraphQL qui modifie les données côté serveur (création, mise à jour, suppression). Comme une query, elle renvoie des données et vous choisissez quels champs récupérer après l'écriture.",
          de: 'Eine mutation ist die GraphQL-Operation zum Ändern von Daten auf dem Server (Erstellen, Aktualisieren, Löschen). Wie eine query liefert sie Daten zurück und Sie wählen, welche Felder Sie nach der Änderung erhalten wollen.',
          es: 'Una mutation es la operación de GraphQL que modifica datos en el servidor (crear, actualizar, eliminar). Igual que una query, devuelve datos y tú eliges qué campos quieres recibir después de la escritura.',
          it: "Una mutation è l'operazione GraphQL che modifica i dati sul server (creazione, aggiornamento, eliminazione). Come una query restituisce dati e puoi scegliere quali campi ottenere dopo l'operazione.",
        }),
        '08100001-0000-4000-8001-000000000004',
      ]
    );

    // 08100001-0000-4000-8001-000000000005 - What is a GraphQL Subscription?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'une subscription GraphQL ?",
          de: 'Was ist eine GraphQL-Subscription?',
          es: '¿Qué es una subscription de GraphQL?',
          it: "Che cos'è una subscription GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Un mécanisme de polling HTTP intégré à GraphQL',
            'Une opération longue durée qui envoie des mises à jour temps réel du serveur vers le client quand certains événements se produisent, généralement via WebSockets',
            "Un moyen de s'abonner à une API REST depuis un client GraphQL",
            'Un type de schema qui rend des champs optionnels',
          ],
          de: [
            'Ein in GraphQL eingebauter HTTP-Polling-Mechanismus',
            'Eine langlebige Operation, die bei bestimmten Ereignissen Echtzeit-Updates vom Server an den Client sendet, meist über WebSockets',
            'Eine Möglichkeit, sich von einem GraphQL-Client an eine REST-API zu abonnieren',
            'Ein Schema-Typ, der Felder optional macht',
          ],
          es: [
            'Un mecanismo de polling HTTP integrado en GraphQL',
            'Una operación de larga duración que envía actualizaciones en tiempo real del servidor al cliente cuando ocurren ciertos eventos, normalmente sobre WebSockets',
            'Una forma de suscribirse a una API REST desde un cliente de GraphQL',
            'Un tipo del schema que hace que los campos sean opcionales',
          ],
          it: [
            'Un meccanismo di HTTP polling integrato in GraphQL',
            "Un'operazione di lunga durata che invia aggiornamenti in tempo reale dal server al client quando si verificano determinati eventi, di solito tramite WebSocket",
            'Un modo per sottoscrivere una API REST da un client GraphQL',
            'Un tipo dello schema che rende opzionali alcuni campi',
          ],
        }),
        JSON.stringify({
          fr: "Les subscriptions sont le troisième type d'opération GraphQL. Elles gardent une connexion persistante (souvent WebSocket) entre client et serveur pour pousser des événements en temps réel comme des messages de chat ou des notifications.",
          de: 'Subscriptions sind der dritte Operationstyp in GraphQL. Sie halten eine dauerhafte Verbindung (häufig WebSocket) zwischen Client und Server aufrecht, um Echtzeitereignisse wie Chat-Nachrichten oder Benachrichtigungen zu senden.',
          es: 'Las subscriptions son el tercer tipo de operación en GraphQL. Mantienen una conexión persistente (normalmente un WebSocket) entre cliente y servidor para enviar eventos en tiempo real como mensajes de chat o notificaciones.',
          it: 'Le subscriptions sono il terzo tipo di operazione in GraphQL. Mantengono una connessione persistente (spesso un WebSocket) tra client e server per inviare eventi in tempo reale come messaggi di chat o notifiche.',
        }),
        '08100001-0000-4000-8001-000000000005',
      ]
    );

    // 08100001-0000-4000-8001-000000000006 - What is a Resolver in GraphQL?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un resolver en GraphQL ?",
          de: 'Was ist ein Resolver in GraphQL?',
          es: '¿Qué es un resolver en GraphQL?',
          it: "Che cos'è un resolver in GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Une fonction qui valide le schema GraphQL au démarrage',
            'Une fonction qui implémente comment récupérer les données pour un champ ou un type particulier du schema',
            'Un middleware qui résout les conflits de nom entre types du schema',
            'Une fonction intégrée qui résout automatiquement les scalar',
          ],
          de: [
            'Eine Funktion, die das GraphQL-Schema beim Start validiert',
            'Eine Funktion, die implementiert, wie Daten für ein bestimmtes Feld oder einen bestimmten Typ im schema geladen werden',
            'Ein Middleware-Element, das Namenskonflikte zwischen Schematypen löst',
            'Eine eingebaute Funktion, die scalar automatisch auflöst',
          ],
          es: [
            'Una función que valida el schema de GraphQL al arrancar',
            'Una función que implementa cómo obtener los datos para un campo o tipo concreto del schema',
            'Un middleware que resuelve conflictos de nombres entre tipos del schema',
            'Una función incorporada que resuelve automáticamente los scalar',
          ],
          it: [
            "Una funzione che valida lo schema GraphQL all'avvio",
            'Una funzione che implementa come recuperare i dati per un campo o un tipo specifico dello schema',
            'Un middleware che risolve conflitti di nome tra i tipi dello schema',
            'Una funzione integrata che risolve automaticamente gli scalar',
          ],
        }),
        JSON.stringify({
          fr: "Les resolvers sont les fonctions qui récupèrent réellement les données pour chaque champ du schema. Chaque champ peut avoir un resolver de la forme (parent, args, context, info) => valeur ; si aucun resolver n'est défini, GraphQL utilise un resolver par défaut qui lit parent[fieldName].",
          de: 'Resolver sind die Funktionen, die die Daten für jedes Feld im schema tatsächlich laden. Jedes Feld kann einen Resolver der Form (parent, args, context, info) => value haben; ohne expliziten Resolver verwendet GraphQL einen Standardresolver, der parent[fieldName] zurückgibt.',
          es: 'Los resolvers son las funciones que realmente obtienen los datos de cada campo del schema. Cada campo puede tener un resolver de la forma (parent, args, context, info) => valor; si no hay resolver explícito, GraphQL usa uno por defecto que devuelve parent[fieldName].',
          it: 'I resolver sono le funzioni che recuperano effettivamente i dati per ogni campo dello schema. Ogni campo può avere un resolver della forma (parent, args, context, info) => valore; se non è definito alcun resolver, GraphQL ne usa uno di default che restituisce parent[fieldName].',
        }),
        '08100001-0000-4000-8001-000000000006',
      ]
    );

    // 08100001-0000-4000-8001-000000000007 - What are scalar types in GraphQL?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Que sont les scalar types en GraphQL ?',
          de: 'Was sind Scalar Types in GraphQL?',
          es: '¿Qué son los scalar types en GraphQL?',
          it: 'Che cosa sono gli scalar types in GraphQL?',
        }),
        JSON.stringify({
          fr: [
            'Des types complexes composés de plusieurs champs',
            'Des types primitifs feuille qui se résolvent en une seule valeur ; les built-in sont String, Int, Float, Boolean et ID',
            "Des types qui ne peuvent être utilisés qu'en entrée de mutation",
            'Des types qui mappent directement aux colonnes de base de données',
          ],
          de: [
            'Komplexe Typen, die aus mehreren Feldern bestehen',
            'Primitive Blatt-Typen, die auf einen einzelnen Wert ausgewertet werden; die eingebauten sind String, Int, Float, Boolean und ID',
            'Typen, die nur als Input für mutations verwendet werden können',
            'Typen, die direkt auf Datenbankspalten gemappt werden',
          ],
          es: [
            'Tipos complejos compuestos por varios campos',
            'Tipos primitivos hoja que se resuelven en un único valor; los incorporados son String, Int, Float, Boolean e ID',
            'Tipos que solo se pueden usar como entrada de mutations',
            'Tipos que se mapean directamente a columnas de base de datos',
          ],
          it: [
            'Tipi complessi composti da più campi',
            'Tipi primitivi foglia che si risolvono in un singolo valore; i built-in sono String, Int, Float, Boolean e ID',
            'Tipi che possono essere usati solo come input delle mutation',
            'Tipi che mappano direttamente sulle colonne del database',
          ],
        }),
        JSON.stringify({
          fr: "GraphQL fournit cinq scalar par défaut : String, Int, Float, Boolean et ID. Ce sont les feuilles de l'arbre de la query et ils renvoient une valeur concrète plutôt qu'un autre objet.",
          de: 'GraphQL stellt fünf eingebaute scalar zur Verfügung: String, Int, Float, Boolean und ID. Sie sind die Blätter des query-Baums und liefern einen konkreten Wert statt eines weiteren Objekts.',
          es: 'GraphQL incluye cinco scalar incorporados: String, Int, Float, Boolean e ID. Son las hojas del árbol de la query y devuelven un valor concreto en lugar de otro objeto.',
          it: "GraphQL fornisce cinque scalar integrati: String, Int, Float, Boolean e ID. Sono le foglie dell'albero della query e restituiscono un valore concreto invece di un altro oggetto.",
        }),
        '08100001-0000-4000-8001-000000000007',
      ]
    );

    // 08100001-0000-4000-8001-000000000008 - What is an Object Type in GraphQL?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un Object Type en GraphQL ?",
          de: 'Was ist ein Object Type in GraphQL?',
          es: '¿Qué es un Object Type en GraphQL?',
          it: "Che cos'è un Object Type in GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Une classe JavaScript qui se mappe à un resolver GraphQL',
            "Un type nommé du schema avec un ensemble de champs, chacun ayant son propre type ; le bloc de construction principal d'un schema GraphQL",
            'Un type qui ne peut être utilisé que comme entrée de mutation',
            'Une union de scalar',
          ],
          de: [
            'Eine JavaScript-Klasse, die auf einen GraphQL-Resolver gemappt wird',
            'Ein benannter Typ im schema mit einer Menge von Feldern, von denen jedes einen eigenen Typ hat; der wichtigste Baustein eines GraphQL-Schemas',
            'Ein Typ, der nur als Eingabe einer mutation verwendet werden kann',
            'Eine Union von scalar',
          ],
          es: [
            'Una clase de JavaScript que se mapea a un resolver de GraphQL',
            'Un tipo con nombre en el schema con un conjunto de campos, cada uno con su propio tipo; el bloque de construcción principal de un schema de GraphQL',
            'Un tipo que solo puede usarse como entrada de una mutation',
            'Una unión de scalar',
          ],
          it: [
            'Una classe JavaScript che si mappa a un resolver GraphQL',
            'Un tipo con nome nello schema con un insieme di campi, ognuno con il proprio tipo; il principale blocco di costruzione di uno schema GraphQL',
            'Un tipo che può essere usato solo come input di una mutation',
            'Una union di scalar',
          ],
        }),
        JSON.stringify({
          fr: 'Un Object Type se définit en SDL par quelque chose comme `type User { id: ID! name: String! }`. Chaque champ a un nom et un type, et les types Object forment les nœuds du graphe de données, y compris les types racines Query, Mutation et Subscription.',
          de: 'Ein Object Type wird in SDL etwa so definiert: `type User { id: ID! name: String! }`. Jedes Feld hat einen Namen und einen Typ, und Object Types bilden die Knoten des Datengraphen, einschließlich der Root-Typen Query, Mutation und Subscription.',
          es: 'Un Object Type se define en SDL con algo como `type User { id: ID! name: String! }`. Cada campo tiene un nombre y un tipo, y los Object Types forman los nodos del grafo de datos, incluidos los tipos raíz Query, Mutation y Subscription.',
          it: 'Un Object Type si definisce in SDL con qualcosa come `type User { id: ID! name: String! }`. Ogni campo ha un nome e un tipo, e gli Object Types formano i nodi del grafo dei dati, compresi i tipi radice Query, Mutation e Subscription.',
        }),
        '08100001-0000-4000-8001-000000000008',
      ]
    );

    // 08100001-0000-4000-8001-000000000009 - What is an Input Type in GraphQL?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un Input Type en GraphQL ?",
          de: 'Was ist ein Input Type in GraphQL?',
          es: '¿Qué es un Input Type en GraphQL?',
          it: "Che cos'è un Input Type in GraphQL?",
        }),
        JSON.stringify({
          fr: [
            "N'importe quel type utilisé comme argument d'un champ",
            'Un Object Type spécial utilisé uniquement comme arguments de mutations et de queries, défini avec le mot-clé `input`',
            'Un type qui se mappe à un élément de formulaire HTML',
            'Un Object Type qui accepte uniquement des valeurs primitives',
          ],
          de: [
            'Jeder Typ, der als Argument eines Feldes verwendet wird',
            'Ein spezieller Object Type, der ausschließlich als Argument von mutations und queries verwendet wird und mit dem Schlüsselwort `input` definiert ist',
            'Ein Typ, der auf ein HTML-Formularelement gemappt wird',
            'Ein Object Type, der nur primitive Werte akzeptiert',
          ],
          es: [
            'Cualquier tipo usado como argumento de un campo',
            'Un Object Type especial usado exclusivamente como argumentos de mutations y queries, definido con la palabra clave `input`',
            'Un tipo que se mapea a un elemento de formulario HTML',
            'Un Object Type que solo acepta valores primitivos',
          ],
          it: [
            'Qualsiasi tipo usato come argomento di un campo',
            'Uno speciale Object Type usato esclusivamente come argomento di mutations e queries, definito con la parola chiave `input`',
            'Un tipo che si mappa a un elemento di form HTML',
            'Un Object Type che accetta solo valori primitivi',
          ],
        }),
        JSON.stringify({
          fr: "Les Input Type sont définis avec le mot-clé `input` et servent à typer les arguments des queries et des mutations, par exemple `input CreateUserInput { name: String! }`. Ils ne peuvent contenir que des scalar et d'autres Input Type, pas des Object Type normaux.",
          de: 'Input Types werden mit dem Schlüsselwort `input` definiert und typisieren die Argumente von queries und mutations, zum Beispiel `input CreateUserInput { name: String! }`. Sie können nur scalar und andere Input Types enthalten, aber keine normalen Object Types.',
          es: 'Los Input Type se definen con la palabra clave `input` y se usan para tipar los argumentos de queries y mutations, por ejemplo `input CreateUserInput { name: String! }`. Solo pueden contener scalar y otros Input Type, no Object Types normales.',
          it: 'Gli Input Type si definiscono con la parola chiave `input` e servono a tipizzare gli argomenti di queries e mutations, ad esempio `input CreateUserInput { name: String! }`. Possono contenere solo scalar e altri Input Type, non Object Types normali.',
        }),
        '08100001-0000-4000-8001-000000000009',
      ]
    );

    // 08100001-0000-4000-8001-000000000010 - What is a GraphQL Enum type?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un type Enum en GraphQL ?",
          de: 'Was ist ein Enum-Typ in GraphQL?',
          es: '¿Qué es un tipo Enum en GraphQL?',
          it: "Che cos'è un tipo Enum in GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Une liste de constantes numériques avec valeurs séquentielles automatiques',
            'Un scalar spécial limité à un ensemble de valeurs de chaîne autorisées définies dans le schema',
            'Un type qui énumère toutes les queries disponibles dans le schema',
            'Un enum TypeScript compilé dans le schema GraphQL',
          ],
          de: [
            'Eine Liste numerischer Konstanten mit automatisch hochzählenden Werten',
            'Ein spezieller scalar, der auf eine Menge erlaubter String-Werte beschränkt ist, die im schema definiert sind',
            'Ein Typ, der alle queries im schema aufzählt',
            'Ein TypeScript-Enum, das in das GraphQL-Schema kompiliert wird',
          ],
          es: [
            'Una lista de constantes numéricas con valores secuenciales automáticos',
            'Un scalar especial restringido a un conjunto de valores de tipo string definidos en el schema',
            'Un tipo que enumera todas las queries disponibles en el schema',
            'Un enum de TypeScript compilado en el schema de GraphQL',
          ],
          it: [
            'Un elenco di costanti numeriche con valori assegnati in sequenza automatica',
            'Uno scalar speciale limitato a un insieme di stringhe consentite definite nello schema',
            'Un tipo che elenca tutte le queries disponibili nello schema',
            'Un enum TypeScript compilato dentro lo schema GraphQL',
          ],
        }),
        JSON.stringify({
          fr: "Un Enum type définit un ensemble fini de valeurs possibles pour un champ, par exemple `enum Status { ACTIVE INACTIVE PENDING }`. Le champ n'accepte alors que ces valeurs, ce qui rend l'API plus sûre et plus explicite.",
          de: 'Ein Enum-Typ definiert eine endliche Menge möglicher Werte für ein Feld, zum Beispiel `enum Status { ACTIVE INACTIVE PENDING }`. Das Feld akzeptiert dann nur noch diese Werte, was die API sicherer und ausdrücklicher macht.',
          es: 'Un tipo Enum define un conjunto finito de valores posibles para un campo, por ejemplo `enum Status { ACTIVE INACTIVE PENDING }`. El campo solo acepta esos valores, lo que hace que la API sea más segura y explícita.',
          it: "Un tipo Enum definisce un insieme finito di valori ammessi per un campo, ad esempio `enum Status { ACTIVE INACTIVE PENDING }`. Il campo accetta solo questi valori, rendendo l'API più sicura ed esplicita.",
        }),
        '08100001-0000-4000-8001-000000000010',
      ]
    );

    // 08100001-0000-4000-8001-000000000011 - What is a GraphQL Fragment?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un fragment GraphQL ?",
          de: 'Was ist ein GraphQL-Fragment?',
          es: '¿Qué es un fragment de GraphQL?',
          it: "Che cos'è un fragment GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Une partie du schema GraphQL chargée dynamiquement',
            'Un ensemble réutilisable de champs sur un type donné qui peut être inclus dans plusieurs queries pour éviter de répéter les sélections de champs',
            "Une query partielle envoyée en batch avec d'autres queries",
            'Une directive qui rend un champ optionnel',
          ],
          de: [
            'Ein Teil des GraphQL-Schemas, der dynamisch geladen wird',
            'Eine wiederverwendbare Menge von Feldern auf einem bestimmten Typ, die in mehrere queries eingefügt werden kann, um Feldselektionen nicht zu duplizieren',
            'Eine Partial-query, die gemeinsam mit anderen queries gesendet wird',
            'Eine Direktive, die ein Feld optional macht',
          ],
          es: [
            'Una parte del schema de GraphQL que se carga dinámicamente',
            'Un conjunto reutilizable de campos sobre un tipo que se puede incluir en varias queries para evitar repetir selecciones de campos',
            'Una query parcial enviada en lote junto con otras queries',
            'Una directive que marca un campo como opcional',
          ],
          it: [
            'Una parte dello schema GraphQL caricata dinamicamente',
            'Un insieme riutilizzabile di campi su un certo tipo che può essere incluso in più queries per evitare di ripetere le selezioni di campo',
            'Una query parziale inviata in batch insieme ad altre queries',
            'Una directive che rende un campo opzionale',
          ],
        }),
        JSON.stringify({
          fr: "Les fragments permettent de définir des sélections de champs réutilisables, par exemple `fragment UserFields on User { id name email }` que l'on peut ensuite inclure dans plusieurs queries. Ils réduisent la duplication et garantissent que les mêmes champs sont demandés de manière cohérente.",
          de: 'Fragmente ermöglichen wiederverwendbare Feldauswahlen, zum Beispiel `fragment UserFields on User { id name email }`, die in mehreren queries verwendet werden können. Sie reduzieren Duplikate und stellen sicher, dass dieselben Felder konsistent abgefragt werden.',
          es: 'Los fragments permiten definir selecciones de campos reutilizables, por ejemplo `fragment UserFields on User { id name email }`, que luego se pueden incluir en varias queries. Reducen la duplicación y aseguran que se pidan los mismos campos de forma coherente.',
          it: 'I fragment permettono di definire selezioni di campi riutilizzabili, ad esempio `fragment UserFields on User { id name email }`, che poi possono essere incluse in più queries. Riducendo la duplicazione garantiscono che gli stessi campi vengano richiesti in modo coerente.',
        }),
        '08100001-0000-4000-8001-000000000011',
      ]
    );

    // 08100001-0000-4000-8001-000000000012 - What are GraphQL Variables?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Que sont les variables GraphQL ?',
          de: 'Was sind GraphQL-Variablen?',
          es: '¿Qué son las variables de GraphQL?',
          it: 'Che cosa sono le variabili GraphQL?',
        }),
        JSON.stringify({
          fr: [
            'Des variables JavaScript utilisées dans les resolvers',
            'Des valeurs dynamiques passées à une opération GraphQL séparément de la query string, ce qui permet de paramétrer et de réutiliser des queries',
            "Des variables d'environnement côté serveur exposées dans le schema",
            'Des fragments nommés stockés dans le cache GraphQL',
          ],
          de: [
            'JavaScript-Variablen, die in resolvern verwendet werden',
            'Dynamische Werte, die separat vom query-String an eine GraphQL-Operation übergeben werden und queries parametrisierbar und wiederverwendbar machen',
            'Serverseitige Umgebungsvariablen, die im schema exponiert werden',
            'Benannte Fragmente, die im GraphQL-Cache gespeichert werden',
          ],
          es: [
            'Variables de JavaScript usadas dentro de los resolvers',
            'Valores dinámicos que se pasan a una operación de GraphQL por separado de la query string, permitiendo queries parametrizadas y reutilizables',
            'Variables de entorno del servidor expuestas en el schema',
            'Fragments con nombre almacenados en la caché de GraphQL',
          ],
          it: [
            "Variabili JavaScript usate all'interno dei resolver",
            "Valori dinamici passati a un'operazione GraphQL separatamente dalla query string, che permettono di parametrizzare e riutilizzare le queries",
            "Variabili d'ambiente lato server esposte nello schema",
            'Fragment con nome memorizzati nella cache GraphQL',
          ],
        }),
        JSON.stringify({
          fr: "Les variables extraient les valeurs dynamiques du texte d'une query : on déclare par exemple `query GetUser($id: ID!)` puis on envoie `{ \"id\": \"123\" }` comme objet de variables JSON. Cela permet de réutiliser le même document, de le whitelister et de limiter les risques d'injection.",
          de: 'Variablen ziehen dynamische Werte aus dem Text einer query heraus: man schreibt zum Beispiel `query GetUser($id: ID!)` und sendet `{ "id": "123" }` als Variablenobjekt. So kann dasselbe Dokument wiederverwendet, gewhitelistet und besser gegen Injection-Angriffe geschützt werden.',
          es: 'Las variables extraen los valores dinámicos del texto de una query: por ejemplo `query GetUser($id: ID!)` y se envía `{ "id": "123" }` como objeto JSON de variables. Esto permite reutilizar el mismo documento, hacer whitelisting y reducir el riesgo de inyección.',
          it: 'Le variabili estraggono i valori dinamici dal testo di una query: ad esempio si scrive `query GetUser($id: ID!)` e si invia `{ "id": "123" }` come oggetto JSON di variabili. In questo modo si può riutilizzare lo stesso documento, metterlo in whitelist e ridurre il rischio di injection.',
        }),
        '08100001-0000-4000-8001-000000000012',
      ]
    );

    // 08100001-0000-4000-8001-000000000013 - What are GraphQL Directives?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Que sont les directives GraphQL ?',
          de: 'Was sind GraphQL-Directives?',
          es: '¿Qué son las directives de GraphQL?',
          it: 'Che cosa sono le directives in GraphQL?',
        }),
        JSON.stringify({
          fr: [
            'Des instructions du compilateur qui modifient uniquement la génération du schema',
            "Des annotations spéciales (préfixées par @) qui peuvent modifier le comportement d'exécution des queries ou la manière dont le schema est interprété",
            'Des en-têtes HTTP requis pour les requêtes GraphQL',
            'Des decorators utilisés dans les approches code-first',
          ],
          de: [
            'Compiler-Anweisungen, die nur die Schemagenerierung beeinflussen',
            'Spezielle Annotationen (mit @), die das Ausführungsverhalten von queries oder die Interpretation des schemas verändern können',
            'HTTP-Header, die für GraphQL-Anfragen erforderlich sind',
            'Decorators, die in Code-first-Ansätzen verwendet werden',
          ],
          es: [
            'Instrucciones del compilador que solo modifican la generación del schema',
            'Anotaciones especiales (prefijadas con @) que pueden modificar el comportamiento de ejecución de las queries o cómo se interpreta el schema',
            'Cabeceras HTTP requeridas para las peticiones de GraphQL',
            'Decorators usados en enfoques code-first',
          ],
          it: [
            'Istruzioni del compilatore che modificano solo la generazione dello schema',
            'Annotazioni speciali (prefissate da @) che possono modificare il comportamento di esecuzione delle queries o il modo in cui viene interpretato lo schema',
            'Header HTTP richiesti per le richieste GraphQL',
            'Decorators usati negli approcci code-first',
          ],
        }),
        JSON.stringify({
          fr: "Les directives comme `@skip(if: Boolean)` ou `@include(if: Boolean)` permettent d'activer ou non un champ au moment de l'exécution, et `@deprecated(reason: String)` marque un champ du schema comme obsolète. On peut aussi définir des directives personnalisées comme `@auth` ou `@cacheControl` pour adapter l'exécution.",
          de: 'Directives wie `@skip(if: Boolean)` oder `@include(if: Boolean)` steuern, ob ein Feld zur Laufzeit ausgewertet wird, und `@deprecated(reason: String)` markiert ein Feld im schema als veraltet. Eigene Directives wie `@auth` oder `@cacheControl` ermöglichen benutzerdefiniertes Verhalten.',
          es: 'Directives como `@skip(if: Boolean)` o `@include(if: Boolean)` controlan si un campo se evalúa o no en tiempo de ejecución, y `@deprecated(reason: String)` marca un campo del schema como obsoleto. También se pueden definir directives personalizadas como `@auth` o `@cacheControl` para ajustar la ejecución.',
          it: "Directive come `@skip(if: Boolean)` o `@include(if: Boolean)` controllano se un campo viene valutato o meno a runtime, e `@deprecated(reason: String)` marca un campo dello schema come deprecato. Si possono definire anche directive personalizzate come `@auth` o `@cacheControl` per adattare l'esecuzione.",
        }),
        '08100001-0000-4000-8001-000000000013',
      ]
    );

    // 08100001-0000-4000-8001-000000000014 - What is the N+1 problem in GraphQL?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le N+1 problem en GraphQL ?",
          de: 'Was ist das N+1-Problem in GraphQL?',
          es: '¿Qué es el problema N+1 en GraphQL?',
          it: "Che cos'è il problema N+1 in GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Une erreur de validation du schema lorsque plus de N types se référencent mutuellement',
            "Un problème de performance où la récupération d'une liste de N éléments déclenche N requêtes supplémentaires (une par élément) pour un champ imbriqué au lieu d'une requête groupée",
            'Un problème de versionning entre N clients et un seul schema',
            "Le fait d'avoir plus de N resolvers pour un type donné",
          ],
          de: [
            'Ein Schema-Validierungsfehler, wenn sich mehr als N Typen gegenseitig referenzieren',
            'Ein Performanceproblem, bei dem das Laden einer Liste von N Elementen N zusätzliche Datenbankabfragen (eine pro Element) für ein verschachteltes Feld auslöst, statt einer gebatchten Abfrage',
            'Ein Versionsproblem, wenn N Clients verschiedene Schemas verwenden',
            'Die Tatsache, mehr als N Resolver für einen bestimmten Typ zu haben',
          ],
          es: [
            'Un error de validación del schema cuando más de N tipos se referencian entre sí',
            'Un problema de rendimiento en el que al obtener una lista de N elementos se disparan N consultas adicionales (una por elemento) para un campo anidado, en lugar de una consulta en lote',
            'Un problema de versionado cuando N clientes usan distintos schemas',
            'El hecho de tener más de N resolvers para un mismo tipo',
          ],
          it: [
            'Un errore di validazione dello schema quando più di N tipi si referenziano a vicenda',
            'Un problema di performance in cui il recupero di una lista di N elementi scatena N query aggiuntive (una per elemento) per un campo annidato invece di una query raggruppata',
            'Un problema di versioning quando N client usano versioni diverse dello schema',
            'Il fatto di avere più di N resolver per un determinato tipo',
          ],
        }),
        JSON.stringify({
          fr: "Le N+1 problem apparaît par exemple quand on charge 10 posts et que chaque resolver d'auteur déclenche une requête séparée : 1 query pour les posts + 10 pour les auteurs. On le résout en général avec DataLoader, qui batch les `load(id)` en une seule requête vers la base.",
          de: 'Das N+1-Problem tritt z. B. auf, wenn man 10 Posts lädt und jeder Author-Resolver eine eigene Datenbankabfrage macht: 1 query für die Posts + 10 für die Autoren. Typischerweise löst man das mit DataLoader, das viele `load(id)`-Aufrufe zu einer einzigen Datenbankabfrage bündelt.',
          es: 'El problema N+1 aparece, por ejemplo, cuando se cargan 10 posts y cada resolver de author hace una consulta separada: 1 query para los posts y 10 para los autores. Normalmente se soluciona con DataLoader, que agrupa todas las llamadas `load(id)` en una sola consulta a la base de datos.',
          it: "Il problema N+1 si presenta ad esempio quando si caricano 10 post e ogni resolver di author esegue una query separata: 1 query per i post + 10 per gli autori. In genere si risolve con DataLoader, che raggruppa le chiamate `load(id)` in un'unica query verso il database.",
        }),
        '08100001-0000-4000-8001-000000000014',
      ]
    );

    // 08100001-0000-4000-8001-000000000015 - What is DataLoader in GraphQL?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que DataLoader en GraphQL ?",
          de: 'Was ist DataLoader in GraphQL?',
          es: '¿Qué es DataLoader en GraphQL?',
          it: "Che cos'è DataLoader in GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Un outil qui charge le schema GraphQL depuis un fichier',
            "Un utilitaire de batching et de cache qui regroupe les appels de chargement de données d'une même tick en une requête groupée, pour résoudre le N+1 problem",
            'Un helper de pagination pour charger des données par pages',
            "Une fonctionnalité d'Apollo Client qui précharge les données avant le rendu",
          ],
          de: [
            'Ein Tool, das das GraphQL-Schema aus einer Datei lädt',
            'Ein Batching- und Caching-Utility, das Datenladeaufrufe innerhalb eines Event-Loop-Ticks zu einer gebündelten Abfrage zusammenfasst und so das N+1-Problem löst',
            'Ein Paginierungshelfer zum Laden von Daten seitenweise',
            'Ein Feature von Apollo Client, das Daten vor dem Rendern vorlädt',
          ],
          es: [
            'Una herramienta que carga el schema de GraphQL desde un archivo',
            'Una utilidad de batching y caché que agrupa las llamadas de carga de datos dentro de un mismo tick en una sola consulta en lote, resolviendo el problema N+1',
            'Un helper de paginación para cargar datos en páginas',
            'Una funcionalidad de Apollo Client que precarga datos antes del renderizado',
          ],
          it: [
            'Uno strumento che carica lo schema GraphQL da un file',
            "Una utility di batching e caching che raggruppa le chiamate di caricamento dati nello stesso tick dell'event loop in un'unica query batch, risolvendo il problema N+1",
            'Un helper di paginazione per caricare i dati a pagine',
            'Una funzionalità di Apollo Client che precarica i dati prima del render',
          ],
        }),
        JSON.stringify({
          fr: "DataLoader (de Meta) collecte plusieurs appels `load(id)` effectués pendant le même tour de boucle d'événements et les transforme en une seule fonction `batchLoadFn([id1, id2, ...])`. Il met aussi en cache les résultats pendant la requête pour éviter de recharger la même entité plusieurs fois.",
          de: 'DataLoader (von Meta) sammelt viele `load(id)`-Aufrufe, die im selben Event-Loop-Tick passieren, und fasst sie zu einem einzigen `batchLoadFn([id1, id2, ...])`-Aufruf zusammen. Innerhalb einer Anfrage werden die Ergebnisse außerdem gecacht, sodass dieselbe Entität nicht mehrfach geladen wird.',
          es: 'DataLoader (de Meta) recoge múltiples llamadas `load(id)` realizadas en el mismo tick del event loop y las agrupa en una sola llamada `batchLoadFn([id1, id2, ...])`. También almacena los resultados en caché durante la petición para no cargar la misma entidad varias veces.',
          it: "DataLoader (di Meta) raccoglie le chiamate `load(id)` effettuate nello stesso tick dell'event loop e le raggruppa in un'unica chiamata `batchLoadFn([id1, id2, ...])`. Inoltre mette in cache i risultati all'interno della richiesta per evitare di caricare più volte la stessa entità.",
        }),
        '08100001-0000-4000-8001-000000000015',
      ]
    );

    // 08100001-0000-4000-8001-000000000016 - Difference between code-first and schema-first approaches
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Quelle est la différence entre les approches code-first et schema-first en GraphQL ?',
          de: 'Was ist der Unterschied zwischen Code-first- und Schema-first-Ansatz in GraphQL?',
          es: '¿Cuál es la diferencia entre los enfoques code-first y schema-first en GraphQL?',
          it: 'Qual è la differenza tra gli approcci code-first e schema-first in GraphQL?',
        }),
        JSON.stringify({
          fr: [
            "Code-first génère d'abord des endpoints REST, schema-first génère d'abord GraphQL",
            'Schema-first : on écrit le schema en SDL puis on implémente les resolvers ; code-first : les classes TypeScript et leurs decorators génèrent automatiquement le schema',
            'Code-first utilise JavaScript et schema-first utilise TypeScript',
            'Ils produisent des schemas différents en termes de performances',
          ],
          de: [
            'Code-first erzeugt zuerst REST-Endpunkte, schema-first erzeugt zuerst GraphQL',
            'Schema-first: man schreibt das schema in SDL und implementiert dann die Resolver; Code-first: TypeScript-Klassen und Decorators generieren das schema automatisch',
            'Code-first verwendet JavaScript und schema-first TypeScript',
            'Sie erzeugen grundlegend unterschiedliche Schemas in Bezug auf Performance',
          ],
          es: [
            'Code-first genera primero endpoints REST y schema-first genera primero GraphQL',
            'Schema-first: se escribe el schema en SDL y luego se implementan los resolvers; code-first: clases de TypeScript y sus decorators generan automáticamente el schema',
            'Code-first usa JavaScript y schema-first usa TypeScript',
            'Producen schemas distintos en términos de rendimiento',
          ],
          it: [
            'Code-first genera prima endpoint REST, schema-first genera prima GraphQL',
            'Schema-first: si scrive lo schema in SDL e poi si implementano i resolver; code-first: le classi TypeScript e i loro decorators generano automaticamente lo schema',
            'Code-first usa JavaScript e schema-first usa TypeScript',
            'Producono schemi diversi per quanto riguarda le prestazioni',
          ],
        }),
        JSON.stringify({
          fr: "En schema-first, l'équipe commence par écrire le schema en SDL (`type Query { ... }`) qui devient la source de vérité, puis ajoute des resolvers pour chaque champ. En code-first, on décrit les types à l'aide de classes et de decorators TypeScript et une librairie génère le schema, ce qui s'intègre bien avec le typage de TypeScript.",
          de: 'Beim Schema-first-Ansatz schreibt das Team zuerst das schema in SDL (`type Query { ... }`), das als Single Source of Truth dient, und implementiert dann Resolver. Beim Code-first-Ansatz beschreibt man die Typen mit TypeScript-Klassen und Decorators und eine Bibliothek generiert daraus das schema, was eng mit dem TypeScript-Typensystem verzahnt ist.',
          es: 'En schema-first el equipo escribe primero el schema en SDL (`type Query { ... }`), que actúa como fuente de verdad, y luego implementa los resolvers. En code-first se describen los tipos con clases y decorators de TypeScript y una librería genera el schema, integrándose muy bien con el sistema de tipos de TypeScript.',
          it: "Con l'approccio schema-first il team scrive prima lo schema in SDL (`type Query { ... }`), che diventa la fonte di verità, e poi implementa i resolver. Con il code-first si descrivono i tipi con classi e decorators TypeScript e una libreria genera lo schema, integrandosi bene con il sistema di tipi di TypeScript.",
        }),
        '08100001-0000-4000-8001-000000000016',
      ]
    );

    // 08100001-0000-4000-8001-000000000017 - What is a GraphQL Interface type?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un Interface type en GraphQL ?",
          de: 'Was ist ein Interface Type in GraphQL?',
          es: '¿Qué es un Interface type en GraphQL?',
          it: "Che cos'è un Interface type in GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Une interface TypeScript compilée dans le schema GraphQL',
            'Un type abstrait qui définit un ensemble de champs que plusieurs Object Types doivent implémenter, ce qui permet des queries polymorphes',
            'Un type utilisé pour décrire la forme des arguments des resolvers',
            'Un Object Type qui sert de classe de base à tous les autres types',
          ],
          de: [
            'Ein TypeScript-Interface, das ins GraphQL-Schema kompiliert wird',
            'Ein abstrakter Typ, der einen Satz Felder definiert, den mehrere Object Types implementieren müssen und der polymorphe queries ermöglicht',
            'Ein Typ zur Beschreibung der Struktur von Resolver-Argumenten',
            'Ein Object Type, der als Basisklasse für alle anderen Typen dient',
          ],
          es: [
            'Una interfaz de TypeScript compilada en el schema de GraphQL',
            'Un tipo abstracto que define un conjunto de campos que varios Object Types deben implementar, permitiendo queries polimórficas',
            'Un tipo usado para describir la forma de los argumentos de los resolvers',
            'Un Object Type que actúa como clase base de todos los demás tipos',
          ],
          it: [
            'Una interfaccia TypeScript compilata nello schema GraphQL',
            'Un tipo astratto che definisce un insieme di campi che diversi Object Types devono implementare, abilitando queries polimorfe',
            'Un tipo usato per descrivere la forma degli argomenti dei resolver',
            'Un Object Type che funge da classe base per tutti gli altri tipi',
          ],
        }),
        JSON.stringify({
          fr: 'Un Interface type définit des champs que les Object Types implémentants doivent avoir, par exemple `interface Node { id: ID! }`. On peut ensuite faire des queries polymorphes sur cette interface et utiliser des fragments inline pour sélectionner des champs spécifiques par type.',
          de: 'Ein Interface Type definiert Felder, die alle implementierenden Object Types besitzen müssen, zum Beispiel `interface Node { id: ID! }`. Man kann dann polymorphe queries auf diese Schnittstelle schreiben und mit Inline-Fragmente typ-spezifische Felder auswählen.',
          es: 'Un Interface type define campos que todos los Object Types que lo implementan deben tener, por ejemplo `interface Node { id: ID! }`. Después se pueden hacer queries polimórficas sobre esta interfaz y usar fragments inline para seleccionar campos específicos según el tipo.',
          it: 'Un Interface type definisce campi che tutti gli Object Types che lo implementano devono avere, ad esempio `interface Node { id: ID! }`. Si possono poi scrivere queries polimorfe su questa interfaccia e usare fragment inline per selezionare campi specifici per tipo.',
        }),
        '08100001-0000-4000-8001-000000000017',
      ]
    );

    // 08100001-0000-4000-8001-000000000018 - What is a GraphQL Union type?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un Union type en GraphQL ?",
          de: 'Was ist ein Union Type in GraphQL?',
          es: '¿Qué es un Union type en GraphQL?',
          it: "Che cos'è un Union type in GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Un type qui combine deux scalar dans un champ',
            "Un type qui représente une valeur pouvant être l'un de plusieurs Object Types sans champs partagés obligatoires",
            'Un type créé en fusionnant deux schemas ayant les mêmes noms de type',
            "Un modificateur qui indique qu'un champ peut être null ou d'un type particulier",
          ],
          de: [
            'Ein Typ, der zwei scalar in einem Feld kombiniert',
            'Ein Typ, der einen Wert repräsentiert, der einer von mehreren Object Types sein kann, ohne dass gemeinsame Pflichtfelder nötig sind',
            'Ein Typ, der durch das Mergen zweier Schemas mit denselben Typnamen entsteht',
            'Ein Feldmodifikator, der erlaubt, dass ein Feld null oder ein bestimmter Typ ist',
          ],
          es: [
            'Un tipo que combina dos scalar en un mismo campo',
            'Un tipo que representa un valor que puede ser uno de varios Object Types, sin exigir campos compartidos',
            'Un tipo creado al fusionar dos schemas con los mismos nombres de tipo',
            'Un modificador que indica que un campo puede ser null o de un tipo concreto',
          ],
          it: [
            'Un tipo che combina due scalar in un unico campo',
            'Un tipo che rappresenta un valore che può essere uno tra diversi Object Types, senza richiedere campi condivisi obbligatori',
            'Un tipo creato unendo due schemi con gli stessi nomi di tipo',
            'Un modificatore che indica che un campo può essere null o di un certo tipo',
          ],
        }),
        JSON.stringify({
          fr: 'Un Union type permet par exemple de définir `union SearchResult = User | Post | Comment`. Le resolver doit ensuite renvoyer le bon type concret et GraphQL utilise `__resolveType` pour savoir quel Object Type appliquer.',
          de: 'Ein Union Type erlaubt es zum Beispiel, `union SearchResult = User | Post | Comment` zu definieren. Der Resolver gibt dann den passenden konkreten Typ zurück und GraphQL verwendet `__resolveType`, um zu bestimmen, welcher Object Type verwendet wird.',
          es: 'Un Union type permite, por ejemplo, definir `union SearchResult = User | Post | Comment`. El resolver devuelve el tipo concreto adecuado y GraphQL usa `__resolveType` para saber qué Object Type aplicar.',
          it: 'Un Union type permette ad esempio di definire `union SearchResult = User | Post | Comment`. Il resolver restituisce poi il tipo concreto corretto e GraphQL usa `__resolveType` per capire quale Object Type applicare.',
        }),
        '08100001-0000-4000-8001-000000000018',
      ]
    );

    // 08100001-0000-4000-8001-000000000019 - What is the context object in a GraphQL resolver?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que l'objet context dans un resolver GraphQL ?",
          de: 'Was ist das context-Objekt in einem GraphQL-Resolver?',
          es: '¿Qué es el objeto context en un resolver de GraphQL?',
          it: "Che cos'è l'oggetto context in un resolver GraphQL?",
        }),
        JSON.stringify({
          fr: [
            "L'objet parent transmis depuis le resolver racine",
            "Un objet partagé passé à chaque resolver d'une opération, utilisé pour stocker des données par requête comme l'utilisateur authentifié, la connexion à la base et les instances de DataLoader",
            'Un objet GraphQL intégré qui gère le contexte du schema',
            "Le quatrième argument `info` d'un resolver",
          ],
          de: [
            'Das parent-Objekt, das vom Root-Resolver weitergegeben wird',
            'Ein geteiltes Objekt, das an jeden Resolver einer Operation übergeben wird und pro Anfrage Daten wie den authentifizierten Benutzer, die Datenbankverbindung und DataLoader-Instanzen enthält',
            'Ein eingebautes GraphQL-Objekt, das den Schema-Kontext verwaltet',
            'Das vierte Argument `info` eines Resolvers',
          ],
          es: [
            'El objeto parent pasado desde el resolver raíz',
            'Un objeto compartido que se pasa a cada resolver de una operación y se usa para guardar datos por petición como el usuario autenticado, la conexión a la base de datos y las instancias de DataLoader',
            'Un objeto incorporado de GraphQL que gestiona el contexto del schema',
            'El cuarto argumento `info` de un resolver',
          ],
          it: [
            "L'oggetto parent passato dal resolver radice",
            "Un oggetto condiviso passato a ogni resolver di un'operazione, usato per memorizzare dati per richiesta come l'utente autenticato, la connessione al database e le istanze di DataLoader",
            'Un oggetto integrato di GraphQL che gestisce il contesto dello schema',
            'Il quarto argomento `info` di un resolver',
          ],
        }),
        JSON.stringify({
          fr: "L'objet context est le troisième argument des resolvers `(parent, args, context, info)` et est créé une fois par requête. On y place typiquement `user`, les clients de base de données et les DataLoader pour que tous les resolvers partagent le même contexte.",
          de: 'Das context-Objekt ist das dritte Argument der Resolver `(parent, args, context, info)` und wird einmal pro Anfrage erzeugt. Typischerweise enthält es den authentifizierten Benutzer, Datenbank-Clients und DataLoader, sodass alle Resolver denselben Kontext teilen.',
          es: 'El objeto context es el tercer argumento de los resolvers `(parent, args, context, info)` y se crea una vez por petición. Normalmente incluye el usuario autenticado, clientes de base de datos y DataLoader para que todos los resolvers compartan el mismo contexto.',
          it: "L'oggetto context è il terzo argomento dei resolver `(parent, args, context, info)` e viene creato una volta per richiesta. Contiene tipicamente l'utente autenticato, i client del database e i DataLoader in modo che tutti i resolver condividano lo stesso contesto.",
        }),
        '08100001-0000-4000-8001-000000000019',
      ]
    );

    // 08100001-0000-4000-8001-000000000020 - What is GraphQL Introspection?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que l'introspection GraphQL ?",
          de: 'Was ist GraphQL-Introspection?',
          es: '¿Qué es la introspection de GraphQL?',
          it: "Che cos'è la introspection in GraphQL?",
        }),
        JSON.stringify({
          fr: [
            "La capacité d'un client GraphQL à inspecter le trafic réseau du serveur",
            "Une fonctionnalité intégrée qui permet aux clients d'interroger le schema lui-même pour découvrir les types, champs, queries et mutations disponibles",
            'Un mode de debug qui journalise tous les appels de resolvers',
            'Une fonctionnalité de sécurité qui audite toutes les queries entrantes',
          ],
          de: [
            'Die Fähigkeit eines GraphQL-Clients, den Netzwerkverkehr des Servers zu inspizieren',
            'Eine eingebaute Fähigkeit, bei der Clients das schema selbst abfragen können, um Typen, Felder, queries und mutations zu entdecken',
            'Ein Debug-Modus, der alle Resolver-Aufrufe loggt',
            'Ein Sicherheitsfeature, das alle eingehenden queries auditiert',
          ],
          es: [
            'La capacidad de un cliente de GraphQL para inspeccionar el tráfico de red del servidor',
            'Una capacidad integrada que permite a los clientes consultar el propio schema para descubrir los tipos, campos, queries y mutations disponibles',
            'Un modo de depuración que registra todas las llamadas a resolvers',
            'Una característica de seguridad que audita todas las queries entrantes',
          ],
          it: [
            'La capacità di un client GraphQL di ispezionare il traffico di rete del server',
            'Una capacità integrata che permette ai client di interrogare lo schema stesso per scoprire tipi, campi, queries e mutations disponibili',
            'Una modalità di debug che logga tutte le chiamate ai resolver',
            'Una funzionalità di sicurezza che analizza tutte le queries in ingresso',
          ],
        }),
        JSON.stringify({
          fr: "L'introspection utilise des champs spéciaux comme `__schema` et `__type(name: \"User\")` pour interroger la structure du schema. Elle alimente des outils comme GraphiQL ou les générateurs de code, mais on peut la désactiver en production pour limiter l'exposition du schema.",
          de: 'Introspection nutzt spezielle Felder wie `__schema` und `__type(name: "User")`, um die Struktur des Schemas abzufragen. Sie treibt Tools wie GraphiQL oder Codegeneratoren an, wird aber in Produktion oft deaktiviert, um das Schema nicht offenzulegen.',
          es: 'La introspection usa campos especiales como `__schema` y `__type(name: "User")` para consultar la estructura del schema. Alimenta herramientas como GraphiQL o los generadores de código, pero suele desactivarse en producción para no exponer el schema.',
          it: 'La introspection usa campi speciali come `__schema` e `__type(name: "User")` per interrogare la struttura dello schema. Alimenta strumenti come GraphiQL e i generatori di codice, ma spesso viene disattivata in produzione per non esporre lo schema.',
        }),
        '08100001-0000-4000-8001-000000000020',
      ]
    );

    // 08100001-0000-4000-8001-000000000021 - What is Apollo Server?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'Apollo Server ?",
          de: 'Was ist Apollo Server?',
          es: '¿Qué es Apollo Server?',
          it: "Che cos'è Apollo Server?",
        }),
        JSON.stringify({
          fr: [
            'Une librairie cliente pour envoyer des queries GraphQL depuis des applications React',
            "Un serveur GraphQL open source conforme à la spec qui fonctionne avec n'importe quel framework Node.js et fournit un écosystème de plugins",
            'Un IDE GraphQL pour tester les queries dans le navigateur',
            'Un service de planification de queries pour des schemas distribués',
          ],
          de: [
            'Eine Clientbibliothek, um GraphQL-queries aus React-Anwendungen zu senden',
            'Ein Open-Source-GraphQL-Server, der der Spezifikation entspricht, mit jedem Node.js-Framework funktioniert und ein Plugin-Ökosystem bietet',
            'Eine GraphQL-IDE zum Testen von queries im Browser',
            'Ein Dienst zur Query-Planung für verteilte Schemas',
          ],
          es: [
            'Una librería cliente para enviar queries de GraphQL desde aplicaciones React',
            'Un servidor de GraphQL open source y conforme a la spec que funciona con cualquier framework de Node.js y ofrece un ecosistema de plugins',
            'Un IDE de GraphQL para probar queries en el navegador',
            'Un servicio de planificación de queries para schemas distribuidos',
          ],
          it: [
            'Una libreria client per inviare queries GraphQL da applicazioni React',
            'Un server GraphQL open source e conforme alla spec che funziona con qualsiasi framework Node.js e offre un ecosistema di plugin',
            'Un IDE GraphQL per testare le queries nel browser',
            'Un servizio di pianificazione delle queries per schemi distribuiti',
          ],
        }),
        JSON.stringify({
          fr: "Apollo Server est un serveur GraphQL populaire pour Node.js qui prend un schema (typeDefs + resolvers), valide et exécute les opérations et gère les erreurs. Il s'intègre avec Express, Fastify ou Lambda et propose des fonctionnalités comme les datasources REST, le tracing et les persisted queries.",
          de: 'Apollo Server ist ein weit verbreiteter GraphQL-Server für Node.js, der ein schema (typeDefs + resolver) annimmt, Operationen validiert und ausführt und Fehler formatiert. Er integriert sich in Express, Fastify oder Lambda und bietet Features wie REST-Datasources, Tracing und Persisted Queries.',
          es: 'Apollo Server es un servidor de GraphQL muy utilizado para Node.js que recibe un schema (typeDefs + resolvers), valida y ejecuta las operaciones y gestiona los errores. Se integra con Express, Fastify o Lambda y ofrece funcionalidades como REST datasources, tracing y persisted queries.',
          it: 'Apollo Server è un server GraphQL molto usato per Node.js che prende uno schema (typeDefs + resolver), valida ed esegue le operazioni e gestisce gli errori. Si integra con Express, Fastify o Lambda e offre funzionalità come REST datasources, tracing e persisted queries.',
        }),
        '08100001-0000-4000-8001-000000000021',
      ]
    );

    // 08100001-0000-4000-8001-000000000022 - What is Apollo Client?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'Apollo Client ?",
          de: 'Was ist Apollo Client?',
          es: '¿Qué es Apollo Client?',
          it: "Che cos'è Apollo Client?",
        }),
        JSON.stringify({
          fr: [
            "Un serveur GraphQL construit au-dessus d'Express",
            "Une librairie de gestion d'état et de data-fetching pour JavaScript qui envoie les queries GraphQL et met leurs résultats en cache",
            'Un CLI pour générer du code client GraphQL',
            'Une extension de navigateur pour tester des APIs GraphQL',
          ],
          de: [
            'Ein GraphQL-Server auf Basis von Express',
            'Eine State-Management- und Data-Fetching-Bibliothek für JavaScript, die GraphQL-queries sendet und deren Ergebnisse cached',
            'Ein CLI-Tool zur Erzeugung von GraphQL-Clientcode',
            'Eine Browsererweiterung zum Testen von GraphQL-APIs',
          ],
          es: [
            'Un servidor de GraphQL construido sobre Express',
            'Una librería de gestión de estado y data-fetching para JavaScript que envía queries de GraphQL y cachea sus resultados',
            'Una CLI para generar código cliente de GraphQL',
            'Una extensión de navegador para probar APIs de GraphQL',
          ],
          it: [
            'Un server GraphQL costruito sopra Express',
            'Una libreria di gestione dello stato e data-fetching per JavaScript che invia queries GraphQL e mette in cache i risultati',
            'Una CLI per generare codice client GraphQL',
            "Un'estensione del browser per testare API GraphQL",
          ],
        }),
        JSON.stringify({
          fr: 'Apollo Client envoie des queries, mutations et subscriptions GraphQL, normalise les réponses dans un InMemoryCache et expose des hooks comme `useQuery` ou `useMutation` pour les frameworks front-end. Le cache est indexé par `__typename` + `id`, ce qui permet de partager les mêmes entités entre plusieurs queries.',
          de: 'Apollo Client sendet GraphQL-queries, mutations und subscriptions, normalisiert die Antworten in einem InMemoryCache und stellt Hooks wie `useQuery` oder `useMutation` für Frontend-Frameworks bereit. Der Cache wird über `__typename` + `id` indiziert, sodass dieselben Entitäten über mehrere queries hinweg geteilt werden.',
          es: 'Apollo Client envía queries, mutations y subscriptions de GraphQL, normaliza las respuestas en un InMemoryCache y expone hooks como `useQuery` o `useMutation` para frameworks de frontend. La caché se indexa por `__typename` + `id`, de modo que las mismas entidades se comparten entre varias queries.',
          it: 'Apollo Client invia queries, mutations e subscriptions GraphQL, normalizza le risposte in un InMemoryCache ed espone hook come `useQuery` o `useMutation` per i framework frontend. La cache è indicizzata da `__typename` + `id`, così la stessa entità viene condivisa tra più queries.',
        }),
        '08100001-0000-4000-8001-000000000022',
      ]
    );

    // 08100001-0000-4000-8001-000000000023 - What is cursor-based pagination in GraphQL?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que la pagination basée sur un cursor en GraphQL ?",
          de: 'Was ist Cursor-based Pagination in GraphQL?',
          es: '¿Qué es la cursor-based pagination en GraphQL?',
          it: "Che cos'è la cursor-based pagination in GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Une pagination qui expose directement LIMIT/OFFSET SQL dans GraphQL',
            'Un modèle de pagination qui utilise un cursor opaque (marqueur de position) pour récupérer la page suivante ou précédente et qui reste stable même quand des éléments sont ajoutés ou supprimés',
            'Un modèle qui charge tous les éléments puis pagine côté client',
            'Un mécanisme de server-sent events pour diffuser des résultats paginés',
          ],
          de: [
            'Eine Paginierung, die LIMIT/OFFSET-SQL direkt in GraphQL spiegelt',
            'Ein Paginierungsmuster, das einen undurchsichtigen Cursor (Positionsmarker) verwendet, um die nächste/vorherige Seite abzurufen und stabil bleibt, wenn Elemente eingefügt oder gelöscht werden',
            'Ein Muster, bei dem alle Daten geladen und nur clientseitig paginiert werden',
            'Ein Mechanismus von Server-Sent Events zum Streamen paginierter Ergebnisse',
          ],
          es: [
            'Una paginación que expone directamente LIMIT/OFFSET de SQL en GraphQL',
            'Un patrón de paginación que usa un cursor opaco (marcador de posición) para obtener la siguiente o la anterior página y que se mantiene estable aunque se añadan o eliminen elementos',
            'Un patrón que carga todos los datos y pagina solo en el cliente',
            'Un mecanismo de server-sent events para transmitir resultados paginados',
          ],
          it: [
            'Una paginazione che espone direttamente LIMIT/OFFSET SQL in GraphQL',
            'Un pattern di paginazione che usa un cursor opaco (marcatore di posizione) per recuperare la pagina successiva o precedente e che rimane stabile anche se vengono aggiunti o rimossi elementi',
            'Un pattern che carica tutti i dati e pagina solo lato client',
            'Un meccanismo di server-sent events per inviare risultati paginati',
          ],
        }),
        JSON.stringify({
          fr: "La cursor-based pagination (souvent via la spec Relay Connections) encode la position dans un cursor et renvoie `edges { node cursor }` ainsi que `pageInfo { hasNextPage endCursor }`. Pour la page suivante, le client renvoie le cursor dans un argument comme `after` au lieu d'un numéro de page.",
          de: 'Bei der Cursor-based Pagination (oft gemäß Relay-Connection-Spec) wird die Position in einem Cursor kodiert und zusammen mit `edges { node cursor }` sowie `pageInfo { hasNextPage endCursor }` zurückgegeben. Für die nächste Seite sendet der Client den Cursor in einem Argument wie `after` statt einer Seitenzahl.',
          es: 'La cursor-based pagination (a menudo siguiendo la especificación Relay Connections) codifica la posición en un cursor y devuelve `edges { node cursor }` junto con `pageInfo { hasNextPage endCursor }`. Para la siguiente página el cliente envía el cursor en un argumento como `after` en lugar de un número de página.',
          it: 'La cursor-based pagination (spesso con la Relay Connections spec) codifica la posizione in un cursor e restituisce `edges { node cursor }` e `pageInfo { hasNextPage endCursor }`. Per la pagina successiva il client rimanda il cursor in un argomento come `after` invece di un numero di pagina.',
        }),
        '08100001-0000-4000-8001-000000000023',
      ]
    );

    // 08100001-0000-4000-8001-000000000024 - What is GraphQL Federation?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que GraphQL Federation ?",
          de: 'Was ist GraphQL Federation?',
          es: '¿Qué es GraphQL Federation?',
          it: "Che cos'è GraphQL Federation?",
        }),
        JSON.stringify({
          fr: [
            "Une façon de fédérer l'authentification entre plusieurs clients GraphQL",
            'Une architecture pour découper un schema GraphQL en plusieurs sous-graphes déployables indépendamment, composés en un supergraph unifié par un gateway',
            'Une méthode pour fédérer des subscriptions GraphQL entre data centers',
            'Un plugin pour Apollo Server qui active le schema stitching',
          ],
          de: [
            'Eine Möglichkeit, Authentifizierung zwischen mehreren GraphQL-Clients zu föderieren',
            'Eine Architektur, bei der ein GraphQL-Schema in mehrere unabhängig deploybare Subgraphs aufgeteilt wird, die von einem Gateway zu einem einheitlichen Supergraph zusammengesetzt werden',
            'Eine Methode zum Föderieren von GraphQL-subscriptions über Rechenzentren hinweg',
            'Ein Plugin für Apollo Server, das schema stitching aktiviert',
          ],
          es: [
            'Una forma de federar la autenticación entre múltiples clientes de GraphQL',
            'Una arquitectura para dividir un schema de GraphQL en varios subgraphs desplegables de forma independiente y componerlos en un supergraph unificado mediante un gateway',
            'Un método para federar subscriptions de GraphQL entre centros de datos',
            'Un plugin para Apollo Server que habilita schema stitching',
          ],
          it: [
            "Un modo per federare l'autenticazione tra più client GraphQL",
            "Un'architettura per suddividere uno schema GraphQL in più subgraph distribuiti e distribuibili indipendentemente, composti in un supergraph unificato da un gateway",
            'Un metodo per federare le subscriptions GraphQL tra data center',
            'Un plugin per Apollo Server che abilita lo schema stitching',
          ],
        }),
        JSON.stringify({
          fr: 'Avec Apollo Federation, chaque équipe possède un sous-graph (Users, Products, etc.) et un router compose ces sous-graphes en un supergraph unique. Les directives comme `@key`, `@external` et `@shareable` décrivent comment les types sont étendus à travers les services.',
          de: 'Mit Apollo Federation besitzt jedes Team einen eigenen Subgraph (Users, Products usw.) und ein Router setzt diese Subgraphs zu einem einzigen Supergraph zusammen. Directives wie `@key`, `@external` und `@shareable` beschreiben, wie Typen über Dienste hinweg erweitert werden.',
          es: 'Con Apollo Federation cada equipo posee un subgraph (Users, Products, etc.) y un router compone todos ellos en un único supergraph. Directives como `@key`, `@external` y `@shareable` describen cómo se extienden los tipos entre servicios.',
          it: 'Con Apollo Federation ogni team possiede un proprio subgraph (Users, Products, ecc.) e un router compone questi subgraph in un unico supergraph. Directive come `@key`, `@external` e `@shareable` descrivono come i tipi vengono estesi tra i vari servizi.',
        }),
        '08100001-0000-4000-8001-000000000024',
      ]
    );

    // 08100001-0000-4000-8001-000000000025 - What is schema stitching in GraphQL?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que le schema stitching en GraphQL ?",
          de: 'Was ist Schema Stitching in GraphQL?',
          es: '¿Qué es el schema stitching en GraphQL?',
          it: "Che cos'è lo schema stitching in GraphQL?",
        }),
        JSON.stringify({
          fr: [
            "Le processus de fusion d'eSDL au moment du build",
            'Une technique qui combine plusieurs schemas GraphQL séparés en un seul schema fusionné côté gateway, avec délégation vers les schemas distants',
            'Un pattern code-first pour construire des schemas de manière programmatique',
            "Une façon d'agréger des réponses REST dans une réponse GraphQL",
          ],
          de: [
            'Der Prozess, bei dem SDL-Dateien zur Build-Zeit zusammengeführt werden',
            'Eine Technik, bei der mehrere separate GraphQL-Schemas in einem Gateway zu einem einzigen Schema zusammengefügt und Anfragen an die entfernten Schemas delegiert werden',
            'Ein Code-first-Pattern zum programmatischen Aufbau von Schemas',
            'Eine Methode, um REST-Antworten in eine GraphQL-Antwort zu aggregieren',
          ],
          es: [
            'El proceso de fusionar archivos SDL en tiempo de build',
            'Una técnica que combina varios schemas de GraphQL separados en un único schema fusionado en el gateway y delega las queries a los schemas remotos',
            'Un patrón code-first para construir schemas de forma programática',
            'Una forma de unir respuestas REST dentro de una respuesta de GraphQL',
          ],
          it: [
            'Il processo di unire file SDL in fase di build',
            'Una tecnica che combina più schemi GraphQL separati in un unico schema fuso a livello di gateway con delega verso gli schemi remoti',
            'Un pattern code-first per costruire schemi in modo programmatico',
            'Un modo per unire risposte REST in una risposta GraphQL',
          ],
        }),
        JSON.stringify({
          fr: "Le schema stitching (par exemple via `@graphql-tools/stitch`) enveloppe plusieurs schemas distants et permet au gateway de déléguer des parties de query à chaque service. Même si Federation l'a remplacé dans de nouveaux projets, il reste utile pour intégrer des APIs GraphQL existantes ou tierces.",
          de: 'Beim Schema Stitching (z. B. mit `@graphql-tools/stitch`) umhüllt ein Gateway mehrere entfernte Schemas und delegiert Teile einer query an jeden Dienst. Auch wenn Federation für neue Projekte üblicher ist, ist Stitching weiterhin nützlich, um bestehende oder externe GraphQL-APIs zu integrieren.',
          es: 'El schema stitching (por ejemplo con `@graphql-tools/stitch`) envuelve varios schemas remotos y permite que el gateway delegue partes de la query a cada servicio. Aunque Federation se usa más en proyectos nuevos, el stitching sigue siendo útil para integrar APIs de GraphQL existentes o de terceros.',
          it: 'Lo schema stitching (ad esempio con `@graphql-tools/stitch`) avvolge più schemi remoti e permette al gateway di delegare parti della query a ogni servizio. Anche se Federation è più usato nei progetti nuovi, lo stitching resta utile per integrare API GraphQL esistenti o di terze parti.',
        }),
        '08100001-0000-4000-8001-000000000025',
      ]
    );

    // 08100001-0000-4000-8001-000000000026 - What are Persisted Queries in GraphQL?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Que sont les Persisted Queries en GraphQL ?',
          de: 'Was sind Persisted Queries in GraphQL?',
          es: '¿Qué son las Persisted Queries en GraphQL?',
          it: 'Che cosa sono le Persisted Queries in GraphQL?',
        }),
        JSON.stringify({
          fr: [
            "Des queries stockées en base de données pour l'audit",
            "Une technique où le client envoie uniquement un hash d'une query pré-enregistrée au lieu de la query complète, ce qui réduit la taille des requêtes et empêche l'exécution de queries arbitraires",
            'Des queries mises en cache indéfiniment dans Apollo Client',
            'Un cache côté serveur qui persiste entre les déploiements',
          ],
          de: [
            'Queries, die in der Datenbank zu Audit-Zwecken gespeichert werden',
            'Eine Technik, bei der der Client nur einen Hash einer vorab registrierten query sendet statt des kompletten query-Strings, was Payload reduziert und beliebige queries verhindert',
            'Queries, die im Apollo-Client-Cache unbegrenzt gespeichert werden',
            'Ein serverseitiger Cache, der Deployments überdauert',
          ],
          es: [
            'Queries almacenadas en la base de datos para auditoría',
            'Una técnica en la que el cliente envía solo un hash de una query pre-registrada en lugar de la query completa, reduciendo la carga útil y evitando la ejecución de queries arbitrarias',
            'Queries cacheadas indefinidamente en Apollo Client',
            'Una caché en el servidor que persiste entre despliegues',
          ],
          it: [
            'Query memorizzate nel database per finalità di audit',
            "Una tecnica in cui il client invia solo un hash di una query preregistrata invece dell'intera query, riducendo la dimensione della richiesta ed evitando l'esecuzione di queries arbitrarie",
            'Query messe in cache indefinitamente in Apollo Client',
            'Una cache lato server che persiste tra i deploy',
          ],
        }),
        JSON.stringify({
          fr: "Avec les Automatic Persisted Queries, le client envoie d'abord un hash ; si le serveur le connaît, il exécute la query, sinon le client renvoie la query complète pour l'enregistrer. Cela permet d'utiliser des requêtes GET courtes, d'améliorer la mise en cache HTTP/CDN et de restreindre les queries autorisées en production.",
          de: 'Bei Automatic Persisted Queries sendet der Client zunächst nur einen Hash; kennt der Server ihn, führt er die query aus, andernfalls sendet der Client die vollständige query und registriert sie. So lassen sich kurze GET-Requests nutzen, HTTP/CDN-Caching verbessern und zulässige queries in Produktion einschränken.',
          es: 'Con Automatic Persisted Queries el cliente envía primero un hash; si el servidor lo reconoce, ejecuta la query, y si no, el cliente reenvía la query completa para registrarla. Esto permite usar peticiones GET cortas, mejorar el caché HTTP/CDN y restringir qué queries se permiten en producción.',
          it: 'Con le Automatic Persisted Queries il client invia inizialmente solo un hash; se il server lo riconosce esegue la query, altrimenti il client invia la query completa per registrarla. Questo consente di usare richieste GET corte, migliorare il caching HTTP/CDN e limitare le queries consentite in produzione.',
        }),
        '08100001-0000-4000-8001-000000000026',
      ]
    );

    // 08100001-0000-4000-8001-000000000027 - How is authentication typically implemented in a GraphQL API?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Comment l'authentication est-elle généralement implémentée dans une API GraphQL ?",
          de: 'Wie wird authentication typischerweise in einer GraphQL-API implementiert?',
          es: '¿Cómo se suele implementar la authentication en una API de GraphQL?',
          it: "Come viene in genere implementata l'authentication in una API GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'En ajoutant la directive @auth sur chaque champ du schema',
            "En vérifiant les tokens dans un middleware HTTP avant GraphQL, en attachant l'utilisateur au context, puis en vérifiant context.user dans les resolvers ou via une directive @auth",
            'En utilisant la directive intégrée @authenticated de GraphQL',
            'En enveloppant chaque resolver dans un try/catch qui valide le JWT',
          ],
          de: [
            'Indem man die Directive @auth auf jedes Feld im schema setzt',
            'Indem man Tokens in HTTP-Middleware vor GraphQL prüft, den Benutzer an context hängt und danach context.user in resolvern oder über eine @auth-Directive prüft',
            'Indem man die eingebaute GraphQL-Directive @authenticated verwendet',
            'Indem man jeden Resolver in ein try/catch packt, das das JWT validiert',
          ],
          es: [
            'Añadiendo la directive @auth a cada campo del schema',
            'Verificando tokens en un middleware HTTP antes de llegar a GraphQL, adjuntando el usuario al context y comprobando después context.user en los resolvers o mediante una directive @auth',
            'Usando la directive integrada @authenticated de GraphQL',
            'Envolviendo cada resolver en un try/catch que valide el JWT',
          ],
          it: [
            'Aggiungendo la directive @auth a ogni campo dello schema',
            "Verificando i token in un middleware HTTP prima di GraphQL, aggiungendo l'utente al context e poi controllando context.user nei resolver o tramite una directive @auth",
            'Usando la directive integrata @authenticated di GraphQL',
            'Avvolgendo ogni resolver in un try/catch che valida il JWT',
          ],
        }),
        JSON.stringify({
          fr: "Le schéma courant consiste à vérifier le JWT dans un middleware HTTP, à placer l'utilisateur sur la requête puis dans le context GraphQL, puis à appliquer des contrôles d'accès dans les resolvers ou via des directives comme @auth. Cela centralise la logique d'authentication au lieu de la dupliquer dans chaque resolver.",
          de: 'Typischerweise wird das JWT in HTTP-Middleware geprüft, der Benutzer auf die Anfrage und dann in den GraphQL-context gesetzt und Berechtigungslogik in resolvern oder Directives wie @auth umgesetzt. So bleibt die authentication zentralisiert statt in jedem Resolver dupliziert.',
          es: 'El patrón típico es validar el JWT en un middleware HTTP, colocar el usuario en la request y en el context de GraphQL y aplicar la lógica de autorización en los resolvers o mediante directives como @auth. Así la authentication se centraliza en lugar de duplicarse en cada resolver.',
          it: "Lo schema tipico è validare il JWT in un middleware HTTP, mettere l'utente sulla request e poi nel context di GraphQL e applicare la logica di autorizzazione nei resolver o tramite directive come @auth. In questo modo l'authentication resta centralizzata invece di essere duplicata in ogni resolver.",
        }),
        '08100001-0000-4000-8001-000000000027',
      ]
    );

    // 08100001-0000-4000-8001-000000000028 - What is the Apollo Client InMemoryCache normalization strategy?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Quelle est la stratégie de normalisation de InMemoryCache dans Apollo Client ?',
          de: 'Wie funktioniert die Normalisierungsstrategie des InMemoryCache in Apollo Client?',
          es: '¿Cuál es la estrategia de normalización de InMemoryCache en Apollo Client?',
          it: 'Qual è la strategia di normalizzazione di InMemoryCache in Apollo Client?',
        }),
        JSON.stringify({
          fr: [
            'Apollo Client stocke toutes les réponses comme JSON brut indexé par la query complète',
            "Apollo Client normalise chaque objet par `__typename` + `id`, en le stockant une seule fois dans une table plate de sorte que toute mise à jour via n'importe quelle query se propage automatiquement",
            'Apollo Client utilise un cache LRU indexé par nom de resolver',
            'Apollo Client ne stocke que la réponse la plus récente pour chaque opération',
          ],
          de: [
            'Apollo Client speichert alle Antworten als rohes JSON, das mit dem kompletten query-String indiziert wird',
            'Apollo Client normalisiert jedes Objekt über `__typename` + `id` und speichert es genau einmal in einer flachen Tabelle, sodass Updates durch jede query automatisch überall sichtbar sind',
            'Apollo Client verwendet einen LRU-Cache, der nach Resolvernamen indiziert ist',
            'Apollo Client speichert nur die letzte Antwort pro Operation',
          ],
          es: [
            'Apollo Client guarda todas las respuestas como JSON en bruto indexado por la query completa',
            'Apollo Client normaliza cada objeto por `__typename` + `id`, almacenándolo una sola vez en una tabla plana para que las actualizaciones a través de cualquier query se propaguen automáticamente',
            'Apollo Client usa una caché LRU indexada por nombre de resolver',
            'Apollo Client solo almacena la última respuesta de cada operación',
          ],
          it: [
            'Apollo Client memorizza tutte le risposte come JSON grezzo indicizzato dalla query completa',
            'Apollo Client normalizza ogni oggetto tramite `__typename` + `id`, salvandolo una sola volta in una tabella piatta così che gli aggiornamenti tramite qualsiasi query si propaghino automaticamente',
            'Apollo Client usa una cache LRU indicizzata per nome del resolver',
            "Apollo Client memorizza solo l'ultima risposta per ogni operazione",
          ],
        }),
        JSON.stringify({
          fr: "InMemoryCache transforme les réponses en un store normalisé indexé par `TypeName:id`, ce qui évite les duplications d'objet. Quand une mutation renvoie un objet déjà présent, toutes les vues qui le lisent via d'autres queries voient la mise à jour.",
          de: 'Der InMemoryCache wandelt Antworten in einen normalisierten Store um, der über `TypeName:id` indiziert ist und Objektdubletten vermeidet. Gibt eine mutation ein bereits gespeichertes Objekt zurück, sehen alle Views, die es über andere queries lesen, automatisch die aktualisierten Daten.',
          es: 'InMemoryCache transforma las respuestas en un almacén normalizado indexado por `TypeName:id`, evitando duplicar objetos. Cuando una mutation devuelve un objeto que ya estaba en la caché, todas las vistas que lo leen a través de otras queries ven la actualización automáticamente.',
          it: "InMemoryCache trasforma le risposte in uno store normalizzato indicizzato da `TypeName:id`, evitando duplicati di oggetti. Quando una mutation restituisce un oggetto già presente, tutte le viste che lo leggono tramite altre queries vedono automaticamente l'aggiornamento.",
        }),
        '08100001-0000-4000-8001-000000000028',
      ]
    );

    // 08100001-0000-4000-8001-000000000029 - What is a custom scalar type in GraphQL?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un custom scalar type en GraphQL ?",
          de: 'Was ist ein Custom Scalar Type in GraphQL?',
          es: '¿Qué es un custom scalar type en GraphQL?',
          it: "Che cos'è un custom scalar type in GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Un scalar défini en étendant le scalar String intégré',
            "Un scalar défini par l'utilisateur qui précise comment un type personnalisé (par exemple Date, JSON, URL) est sérialisé, parsé et validé",
            'Un scalar résolu par un resolver personnalisé',
            'Un scalar fourni automatiquement par les librairies GraphQL tierces',
          ],
          de: [
            'Ein scalar, der durch Erweiterung des eingebauten String-scalars entsteht',
            'Ein benutzerdefinierter scalar, der beschreibt, wie ein spezieller Wert (z. B. Date, JSON, URL) serialisiert, geparst und validiert wird',
            'Ein scalar, der von einem eigenen Resolver aufgelöst wird',
            'Ein scalar, der automatisch von Drittanbieter-Bibliotheken bereitgestellt wird',
          ],
          es: [
            'Un scalar definido extendiendo el scalar String incorporado',
            'Un scalar definido por el usuario que especifica cómo se serializa, parsea y valida un valor personalizado (por ejemplo Date, JSON, URL)',
            'Un scalar resuelto por un resolver personalizado',
            'Un scalar proporcionado automáticamente por librerías de GraphQL de terceros',
          ],
          it: [
            'Uno scalar definito estendendo lo scalar String integrato',
            'Uno scalar definito dallo sviluppatore che specifica come serializzare, fare parse e validare un valore personalizzato (per esempio Date, JSON, URL)',
            'Uno scalar risolto da un resolver personalizzato',
            'Uno scalar fornito automaticamente da librerie GraphQL di terze parti',
          ],
        }),
        JSON.stringify({
          fr: "Les custom scalar comme `scalar Date` nécessitent d'implémenter `serialize`, `parseValue` et `parseLiteral` pour contrôler la conversion entre les valeurs JavaScript et la représentation GraphQL. Des librairies comme `graphql-scalars` fournissent des implémentations prêtes pour DateTime, JSON ou URL.",
          de: 'Custom scalar wie `scalar Date` erfordern die Implementierung von `serialize`, `parseValue` und `parseLiteral`, um die Umwandlung zwischen JavaScript-Werten und der GraphQL-Repräsentation zu steuern. Bibliotheken wie `graphql-scalars` liefern fertige Implementierungen für DateTime, JSON oder URL.',
          es: 'Los custom scalar como `scalar Date` requieren implementar `serialize`, `parseValue` y `parseLiteral` para controlar la conversión entre valores de JavaScript y su representación en GraphQL. Librerías como `graphql-scalars` proporcionan implementaciones listas para DateTime, JSON o URL.',
          it: 'I custom scalar come `scalar Date` richiedono di implementare `serialize`, `parseValue` e `parseLiteral` per controllare la conversione tra i valori JavaScript e la rappresentazione GraphQL. Librerie come `graphql-scalars` forniscono implementazioni pronte per DateTime, JSON o URL.',
        }),
        '08100001-0000-4000-8001-000000000029',
      ]
    );

    // 08100001-0000-4000-8001-000000000030 - What is the `info` argument in a GraphQL resolver?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que l'argument `info` dans un resolver GraphQL ?",
          de: 'Was ist das Argument `info` in einem GraphQL-Resolver?',
          es: '¿Qué es el argumento `info` en un resolver de GraphQL?',
          it: "Che cos'è l'argomento `info` in un resolver GraphQL?",
        }),
        JSON.stringify({
          fr: [
            'Un objet de métadonnées qui expose les en-têtes HTTP courants',
            "Le quatrième argument d'un resolver qui contient des informations sur l'exécution : nom du champ, type retourné, type parent, schema et AST de la query",
            'Un objet de logging injecté automatiquement par Apollo Server',
            "Un objet qui contient les variables passées à l'opération courante",
          ],
          de: [
            'Ein Metadatenobjekt mit den aktuellen HTTP-Headern',
            'Das vierte Argument eines Resolvers, das Informationen über den Ausführungszustand enthält: Feldname, Rückgabetyp, Parent-Typ, schema und AST der query',
            'Ein Logging-Objekt, das automatisch von Apollo Server injiziert wird',
            'Ein Objekt, das die Variablen der aktuellen Operation enthält',
          ],
          es: [
            'Un objeto de metadatos que expone las cabeceras HTTP de la petición',
            'El cuarto argumento de un resolver que contiene información sobre el estado de ejecución: nombre del campo, tipo de retorno, tipo padre, schema y AST de la query',
            'Un objeto de logging inyectado automáticamente por Apollo Server',
            'Un objeto que contiene las variables pasadas a la operación actual',
          ],
          it: [
            'Un oggetto di metadati che espone gli header HTTP della richiesta',
            'Il quarto argomento di un resolver che contiene informazioni sullo stato di esecuzione: nome del campo, tipo di ritorno, tipo padre, schema e AST della query',
            'Un oggetto di logging iniettato automaticamente da Apollo Server',
            "Un oggetto che contiene le variabili passate all'operazione corrente",
          ],
        }),
        JSON.stringify({
          fr: "`info` regroupe des détails comme `fieldName`, `parentType`, `returnType`, `schema` ou encore `fieldNodes`. On peut s'en servir pour du look-ahead (lire les sous-selections de champs) et optimiser les accès aux données.",
          de: '`info` enthält Details wie `fieldName`, `parentType`, `returnType`, `schema` und `fieldNodes`. Es kann für Look-ahead genutzt werden, also um aus der Feldauswahl abzuleiten, welche Daten wirklich geladen werden müssen.',
          es: '`info` incluye detalles como `fieldName`, `parentType`, `returnType`, `schema` y `fieldNodes`. Se puede usar para look-ahead, leyendo las subselecciones de campos y optimizando así el acceso a datos.',
          it: '`info` contiene dettagli come `fieldName`, `parentType`, `returnType`, `schema` e `fieldNodes`. Si può usare per il look-ahead, leggendo le sotto-selezioni di campi e ottimizzando così gli accessi ai dati.',
        }),
        '08100001-0000-4000-8001-000000000030',
      ]
    );

    // 08100001-0000-4000-8001-000000000031 - What is query complexity / depth limiting in GraphQL and why is it important?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'||$1::jsonb)),'{choices}',(data->'choices'||$2::jsonb)),'{explanation}',(data->'explanation'||$3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce que la query complexity / depth limiting en GraphQL et pourquoi est-ce important ?",
          de: 'Was sind Query Complexity bzw. Depth Limiting in GraphQL und warum sind sie wichtig?',
          es: '¿Qué es la query complexity / depth limiting en GraphQL y por qué es importante?',
          it: 'Che cosa sono query complexity e depth limiting in GraphQL e perché sono importanti?',
        }),
        JSON.stringify({
          fr: [
            'Une technique pour mesurer la performance des resolvers et signaler les queries lentes',
            "Un mécanisme de sécurité qui assigne un coût aux champs ou limite la profondeur des queries afin d'empêcher des requêtes trop coûteuses d'épuiser les ressources du serveur",
            'Une stratégie de cache qui limite le nombre de queries mises en cache',
            "Une directive de schema qui empêche d'utiliser des champs dépréciés",
          ],
          de: [
            'Eine Technik, um die Performance von Resolvern zu messen und langsame queries zu markieren',
            'Ein Sicherheitsmechanismus, der Feldern Kosten zuweist oder die Tiefe von queries begrenzt, um extrem teure verschachtelte Anfragen zu verhindern',
            'Eine Caching-Strategie, die die Anzahl gecachter queries begrenzt',
            'Eine Schema-Directive, die die Abfrage veralteter Felder verhindert',
          ],
          es: [
            'Una técnica para medir el rendimiento de los resolvers y marcar queries lentas',
            'Un mecanismo de seguridad que asigna un coste a los campos o limita la profundidad de las queries para evitar consultas demasiado costosas que agoten los recursos del servidor',
            'Una estrategia de caché que limita el número de queries almacenadas',
            'Una directive del schema que impide usar campos obsoletos',
          ],
          it: [
            'Una tecnica per misurare le prestazioni dei resolver e segnalare le queries lente',
            'Un meccanismo di sicurezza che assegna un costo ai campi o limita la profondità delle queries per evitare richieste annidate troppo costose che esauriscono le risorse del server',
            'Una strategia di cache che limita il numero di queries memorizzate',
            'Una directive dello schema che impedisce di usare campi deprecati',
          ],
        }),
        JSON.stringify({
          fr: "Grâce à la depth limiting et à la query complexity, un serveur GraphQL peut rejeter des queries trop profondes ou trop coûteuses avant de toucher la base de données. C'est essentiel pour se protéger contre les attaques de déni de service basées sur des queries très imbriquées.",
          de: 'Durch Depth Limiting und Query Complexity kann ein GraphQL-Server zu tiefe oder zu teure queries ablehnen, noch bevor sie die Datenbank erreichen. Das ist entscheidend, um sich gegen DoS-Angriffe mit extrem verschachtelten queries zu schützen.',
          es: 'Con depth limiting y query complexity un servidor de GraphQL puede rechazar queries demasiado profundas o costosas antes de llegar a la base de datos. Esto es clave para protegerse de ataques de denegación de servicio basados en queries muy anidadas.',
          it: 'Con depth limiting e query complexity un server GraphQL può rifiutare queries troppo profonde o costose prima ancora di toccare il database. Questo è fondamentale per proteggersi da attacchi di denial of service basati su queries molto annidate.',
        }),
        '08100001-0000-4000-8001-000000000031',
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE qcm_module SET label=label-'fr'-'de'-'es'-'it',description=description-'fr'-'de'-'es'-'it' WHERE id=$1`,['08100000-0000-4000-8000-000000000001']);
    await queryRunner.query(`UPDATE qcm_question SET data=jsonb_set(jsonb_set(jsonb_set(data,'{question}',(data->'question'-'fr'-'de'-'es'-'it')),'{choices}',(data->'choices'-'fr'-'de'-'es'-'it')),'{explanation}',(data->'explanation'-'fr'-'de'-'es'-'it')) WHERE moduleId=$1`,['08100000-0000-4000-8000-000000000001']);
  }
}
