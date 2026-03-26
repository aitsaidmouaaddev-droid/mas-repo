import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddI18nTranslationsNestJs1774400003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE qcm_module SET label = label || $1::jsonb, description = description || $2::jsonb WHERE id = $3`,
      [
        JSON.stringify({
          fr: 'Définitions NestJS',
          de: 'NestJS-Begriffe',
          es: 'Definiciones de NestJS',
          it: 'Definizioni NestJS',
        }),
        JSON.stringify({
          fr: 'Vocabulaire de base NestJS : modules, controllers, providers, services, dependency injection, decorators, DTOs, guards, interceptors, pipes, exception filters, middleware, execution context, request lifecycle, validation, dynamic modules, CQRS, microservices et WebSockets.',
          de: 'Zentraler NestJS-Wortschatz: modules, controllers, providers, services, dependency injection, decorators, DTOs, guards, interceptors, pipes, exception filters, middleware, execution context, request lifecycle, validation, dynamic modules, CQRS, microservices und WebSockets.',
          es: 'Vocabulario básico de NestJS: modules, controllers, providers, services, dependency injection, decorators, DTOs, guards, interceptors, pipes, exception filters, middleware, execution context, request lifecycle, validation, dynamic modules, CQRS, microservices y WebSockets.',
          it: 'Vocabolario di base NestJS: modules, controllers, providers, services, dependency injection, decorators, DTOs, guards, interceptors, pipes, exception filters, middleware, execution context, request lifecycle, validation, dynamic modules, CQRS, microservices e WebSockets.',
        }),
        'e5100000-0000-4000-8000-000000000001',
      ]
    );

    // e5100001-0000-4000-8001-000000000001 - What is NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu\u2019est-ce que NestJS ?',
          de: 'Was ist NestJS?',
          es: '¿Qué es NestJS?',
          it: 'Che cos\u2019è NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un framework front-end bas\u00e9 sur Angular pour construire des SPA',
            'Un framework Node.js progressif pour cr\u00e9er des applications c\u00f4t\u00e9 serveur efficaces et scalables avec TypeScript',
            'Un ORM de base de donn\u00e9es pour Node.js construit au-dessus de Sequelize',
            'Un framework de tests pour les applications Node.js',
          ],
          de: [
            'Ein Frontend-Framework auf Basis von Angular zum Erstellen von SPAs',
            'Ein progressives Node.js-Framework zum Erstellen effizienter, skalierbarer Serveranwendungen mit TypeScript',
            'Ein Datenbank-ORM f\u00fcr Node.js, das auf Sequelize aufbaut',
            'Ein Test-Framework f\u00fcr Node.js-Anwendungen',
          ],
          es: [
            'Un framework de front-end basado en Angular para crear SPA',
            'Un framework progresivo de Node.js para crear aplicaciones del lado del servidor eficientes y escalables con TypeScript',
            'Un ORM de base de datos para Node.js construido sobre Sequelize',
            'Un framework de pruebas para aplicaciones de Node.js',
          ],
          it: [
            'Un framework front-end basato su Angular per creare SPA',
            'Un framework Node.js progressivo per creare applicazioni lato server efficienti e scalabili con TypeScript',
            'Un ORM di database per Node.js costruito sopra Sequelize',
            'Un framework di test per applicazioni Node.js',
          ],
        }),
        JSON.stringify({
          fr: 'NestJS est un framework pour construire des applications Node.js c\u00f4t\u00e9 serveur en TypeScript. Il s\u2019inspire fortement de l\u2019architecture d\u2019Angular en utilisant des modules, des decorators et la dependency injection. Il s\u2019ex\u00e9cute au-dessus d\u2019Express (ou Fastify) et ajoute des conventions fortes, un conteneur DI et un support de premier plan pour REST, GraphQL, WebSockets, microservices et plus encore.',
          de: 'NestJS ist ein Framework zum Erstellen von serverseitigen Node.js-Anwendungen in TypeScript. Es ist stark von der Architektur von Angular inspiriert und verwendet modules, decorators und dependency injection. Es l\u00e4uft auf Express (oder Fastify) und f\u00fcgt starke Konventionen, einen DI-Container sowie erstklassige Unterst\u00fctzung f\u00fcr REST, GraphQL, WebSockets, microservices und mehr hinzu.',
          es: 'NestJS es un framework para crear aplicaciones de Node.js del lado del servidor en TypeScript. Est\u00e1 fuertemente inspirado en la arquitectura de Angular y utiliza modules, decorators y dependency injection. Se ejecuta sobre Express (o Fastify) y a\u00f1ade fuertes convenciones, un contenedor DI y soporte de primera clase para REST, GraphQL, WebSockets, microservices y mucho m\u00e1s.',
          it: 'NestJS \u00e8 un framework per creare applicazioni Node.js lato server in TypeScript. \u00c8 fortemente ispirato all\u2019architettura di Angular e usa modules, decorators e dependency injection. Si appoggia a Express (o Fastify) e aggiunge convenzioni forti, un contenitore DI e supporto di prima classe per REST, GraphQL, WebSockets, microservices e molto altro.',
        }),
        'e5100001-0000-4000-8001-000000000001',
      ]
    );

    // e5100001-0000-4000-8001-000000000002 - What is a Module in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu\u2019est-ce qu\u2019un Module dans NestJS ?',
          de: 'Was ist ein Module in NestJS?',
          es: '¿Qué es un Module en NestJS?',
          it: 'Che cos\u2019\u00e8 un Module in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un fichier TypeScript unique contenant toute la logique m\u00e9tier',
            'Une classe d\u00e9cor\u00e9e avec @Module() qui organise des controllers, des providers et des imports li\u00e9s en une unit\u00e9 de fonctionnalit\u00e9 coh\u00e9rente',
            'Un router Express enregistr\u00e9 sur l\u2019application',
            'Un objet de configuration pass\u00e9 \u00e0 NestFactory',
          ],
          de: [
            'Eine einzelne TypeScript-Datei, die die gesamte Business-Logik enth\u00e4lt',
            'Eine Klasse mit @Module(), die zusammengeh\u00f6rige controllers, providers und imports zu einer koh\u00e4renten Feature-Einheit organisiert',
            'Ein in der App registrierter Express-Router',
            'Ein Konfigurationsobjekt, das an NestFactory \u00fcbergeben wird',
          ],
          es: [
            'Un \u00fanico archivo TypeScript que contiene toda la l\u00f3gica de negocio',
            'Una clase decorada con @Module() que organiza controllers, providers e imports relacionados en una unidad de funcionalidad cohesiva',
            'Un router de Express registrado en la aplicaci\u00f3n',
            'Un objeto de configuraci\u00f3n que se pasa a NestFactory',
          ],
          it: [
            'Un singolo file TypeScript che contiene tutta la logica di business',
            'Una classe decorata con @Module() che organizza controllers, providers e imports correlati in un\u2019unit\u00e0 di funzionalit\u00e0 coerente',
            'Un router Express registrato sull\u2019applicazione',
            'Un oggetto di configurazione passato a NestFactory',
          ],
        }),
        JSON.stringify({
          fr: 'Un module NestJS est une classe annot\u00e9e avec @Module(). Il regroupe les fonctionnalit\u00e9s li\u00e9es : controllers (g\u00e8rent les requ\u00eates), providers (services, repositories), imports (autres modules) et exports (providers partag\u00e9s avec d\u2019autres modules). Chaque application a au moins un AppModule racine.',
          de: 'Ein NestJS-Module ist eine Klasse mit dem Decorator @Module(). Es fasst verwandte Funktionalit\u00e4ten zusammen: controllers (bearbeiten Anfragen), providers (Services, Repositories), imports (andere Module) und exports (providers, die mit anderen Modulen geteilt werden). Jedes Projekt besitzt mindestens ein zentrales AppModule.',
          es: 'Un Module de NestJS es una clase anotada con @Module(). Agrupa funcionalidad relacionada: controllers (manejan las peticiones), providers (services, repositories), imports (otros modules) y exports (providers compartidos con otros modules). Cada aplicaci\u00f3n tiene al menos un AppModule ra\u00edz.',
          it: 'Un Module NestJS \u00e8 una classe annotata con @Module(). Raggruppa funzionalit\u00e0 correlate: controllers (gestiscono le richieste), providers (services, repositories), imports (altri modules) ed exports (providers condivisi con altri modules). Ogni applicazione ha almeno un AppModule radice.',
        }),
        'e5100001-0000-4000-8001-000000000002',
      ]
    );

    // e5100001-0000-4000-8001-000000000003 - What is a Controller in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu\u2019est-ce qu\u2019un Controller dans NestJS ?',
          de: 'Was ist ein Controller in NestJS?',
          es: '¿Qué es un Controller en NestJS?',
          it: 'Che cos\u2019\u00e8 un Controller in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Une classe qui contient la logique m\u00e9tier et l\u2019acc\u00e8s aux donn\u00e9es',
            'Une classe d\u00e9cor\u00e9e avec @Controller() qui g\u00e8re les requ\u00eates HTTP entrantes et renvoie les r\u00e9ponses',
            'Un middleware qui intercepte toutes les requ\u00eates',
            'Une classe qui g\u00e8re la dependency injection',
          ],
          de: [
            'Eine Klasse, die die Business-Logik und den Datenzugriff enth\u00e4lt',
            'Eine mit @Controller() dekorierte Klasse, die eingehende HTTP-Anfragen verarbeitet und Antworten zur\u00fcckgibt',
            'Ein Middleware-Element, das alle Anfragen abf\u00e4ngt',
            'Eine Klasse, die die dependency injection verwaltet',
          ],
          es: [
            'Una clase que contiene la l\u00f3gica de negocio y el acceso a datos',
            'Una clase decorada con @Controller() que maneja las peticiones HTTP entrantes y devuelve respuestas',
            'Un middleware que intercepta todas las peticiones',
            'Una clase que gestiona la dependency injection',
          ],
          it: [
            'Una classe che contiene la logica di business e l\u2019accesso ai dati',
            'Una classe decorata con @Controller() che gestisce le richieste HTTP in arrivo e restituisce le risposte',
            'Un middleware che intercetta tutte le richieste',
            'Una classe che gestisce la dependency injection',
          ],
        }),
        JSON.stringify({
          fr: "Un controller est une classe d\u00e9cor\u00e9e avec @Controller('path'). Elle g\u00e8re les requ\u00eates HTTP entrantes via des decorators de m\u00e9thode comme @Get(), @Post(), @Put(), @Delete(). Les controllers sont responsables du routage et d\u00e9l\u00e8guent la logique m\u00e9tier r\u00e9elle aux services (providers).",
          de: "Ein Controller ist eine Klasse mit dem Decorator @Controller('path'). Er verarbeitet eingehende HTTP-Anfragen \u00fcber Methodendekoratoren wie @Get(), @Post(), @Put(), @Delete(). Controller sind f\u00fcr das Routing zust\u00e4ndig und delegieren die eigentliche Business-Logik an services (providers).",
          es: "Un controller es una clase decorada con @Controller('path'). Maneja las peticiones HTTP entrantes mediante decoradores de m\u00e9todo como @Get(), @Post(), @Put(), @Delete(). Los controllers se encargan del enrutamiento y delegan la l\u00f3gica de negocio real a los services (providers).",
          it: "Un controller \u00e8 una classe decorata con @Controller('path'). Gestisce le richieste HTTP in arrivo tramite decorators di metodo come @Get(), @Post(), @Put(), @Delete(). I controller sono responsabili del routing e delegano la vera logica di business ai services (providers).",
        }),
        'e5100001-0000-4000-8001-000000000003',
      ]
    );

    // e5100001-0000-4000-8001-000000000004 - What is a Provider in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu\u2019est-ce qu\u2019un Provider dans NestJS ?',
          de: 'Was ist ein Provider in NestJS?',
          es: '¿Qué es un Provider en NestJS?',
          it: 'Che cos\u2019\u00e8 un Provider in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Une biblioth\u00e8que tierce install\u00e9e via npm',
            'Une classe ou une valeur qui peut \u00eatre inject\u00e9e comme d\u00e9pendance ; le type le plus courant est un Service',
            'Un middleware HTTP enregistr\u00e9 sur l\u2019application Express',
            'Un objet de configuration pass\u00e9 \u00e0 @Module()',
          ],
          de: [
            'Eine Drittanbieter-Bibliothek, die \u00fcber npm installiert wird',
            'Eine Klasse oder ein Wert, der als Abh\u00e4ngigkeit injiziert werden kann; der h\u00e4ufigste Typ ist ein Service',
            'Ein HTTP-Middleware-Element, das auf der Express-App registriert ist',
            'Ein Konfigurationsobjekt, das an @Module() \u00fcbergeben wird',
          ],
          es: [
            'Una biblioteca de terceros instalada con npm',
            'Una clase o un valor que se puede inyectar como dependencia; el tipo m\u00e1s com\u00fan es un Service',
            'Un middleware HTTP registrado en la aplicaci\u00f3n Express',
            'Un objeto de configuraci\u00f3n que se pasa a @Module()',
          ],
          it: [
            'Una libreria di terze parti installata tramite npm',
            'Una classe o un valore che pu\u00f2 essere iniettato come dipendenza; il tipo pi\u00f9 comune \u00e8 un Service',
            'Un middleware HTTP registrato sull\u2019app Express',
            'Un oggetto di configurazione passato a @Module()',
          ],
        }),
        JSON.stringify({
          fr: 'Les providers sont le bloc de base de la dependency injection dans NestJS. Ce sont des classes (souvent d\u00e9cor\u00e9es avec @Injectable()) ou des valeurs enregistr\u00e9es dans le tableau providers d\u2019un module. Le conteneur DI de NestJS les instancie et les injecte partout o\u00f9 ils sont requis : services, repositories, factories et helpers sont tous des providers.',
          de: 'Providers sind der grundlegende Baustein der dependency injection in NestJS. Es handelt sich um Klassen (meist mit @Injectable()) oder Werte, die im providers-Array eines modules registriert werden. Der DI-Container von NestJS erstellt ihre Instanzen und injiziert sie dort, wo sie ben\u00f6tigt werden; services, repositories, factories und helpers sind alles providers.',
          es: 'Los providers son el bloque fundamental de la dependency injection en NestJS. Son clases (normalmente decoradas con @Injectable()) o valores registrados en el array providers de un module. El contenedor de DI de NestJS los instancia y los inyecta donde se necesitan; services, repositories, factories y helpers son todos providers.',
          it: 'I providers sono il blocco fondamentale della dependency injection in NestJS. Sono classi (di solito decorate con @Injectable()) o valori registrati nell\u2019array providers di un module. Il contenitore DI di NestJS li istanzia e li inietta ovunque servano: services, repositories, factories e helpers sono tutti providers.',
        }),
        'e5100001-0000-4000-8001-000000000004',
      ]
    );

    // e5100001-0000-4000-8001-000000000005 - What does the @Injectable() decorator do in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Que fait le decorator @Injectable() dans NestJS ?',
          de: 'Was macht der Decorator @Injectable() in NestJS?',
          es: '¿Qué hace el decorador @Injectable() en NestJS?',
          it: 'Che cosa fa il decorator @Injectable() in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Marque une classe comme endpoint REST',
            'Marque une classe comme provider pouvant \u00eatre g\u00e9r\u00e9e et inject\u00e9e par le conteneur de dependency injection de NestJS',
            'Rend une classe disponible globalement sans importer son module',
            'Active l\u2019int\u00e9gration TypeORM sur une classe de service',
          ],
          de: [
            'Markiert eine Klasse als REST-Endpoint',
            'Markiert eine Klasse als Provider, der vom NestJS-DI-Container verwaltet und injiziert werden kann',
            'Macht eine Klasse global verf\u00fcgbar, ohne ihr Module zu importieren',
            'Aktiviert die TypeORM-Integration auf einer Service-Klasse',
          ],
          es: [
            'Marca una clase como endpoint REST',
            'Marca una clase como provider que puede ser gestionado e inyectado por el contenedor de dependency injection de NestJS',
            'Hace que una clase est\u00e9 disponible globalmente sin importar su module',
            'Activa la integraci\u00f3n de TypeORM en una clase de service',
          ],
          it: [
            'Contrassegna una classe come endpoint REST',
            'Contrassegna una classe come provider che pu\u00f2 essere gestito e iniettato dal contenitore di dependency injection di NestJS',
            'Rende una classe disponibile globalmente senza importare il suo module',
            'Abilita l\u2019integrazione con TypeORM su una classe service',
          ],
        }),
        JSON.stringify({
          fr: '@Injectable() marque une classe comme provider g\u00e9r\u00e9 par NestJS. Il indique au conteneur DI que cette classe peut \u00eatre instanci\u00e9e et que ses d\u00e9pendances peuvent \u00eatre r\u00e9solues automatiquement. Sans ce decorator, une classe ne peut pas \u00eatre inject\u00e9e ni recevoir ses propres d\u00e9pendances via NestJS.',
          de: '@Injectable() markiert eine Klasse als von NestJS verwalteten Provider. Der DI-Container wei\u00df dadurch, dass er diese Klasse instanzieren und ihre Abh\u00e4ngigkeiten automatisch aufl\u00f6sen darf. Ohne diesen Decorator kann eine Klasse nicht injiziert werden und keine eigenen Abh\u00e4ngigkeiten von NestJS erhalten.',
          es: '@Injectable() marca una clase como provider gestionado por NestJS. Indica al contenedor de DI que puede instanciar esa clase y resolver sus dependencias de forma autom\u00e1tica. Sin este decorador, una clase no se puede inyectar ni recibir sus propias dependencias a trav\u00e9s de NestJS.',
          it: '@Injectable() contrassegna una classe come provider gestito da NestJS. Indica al contenitore DI che pu\u00f2 istanziare la classe e risolvere automaticamente le sue dipendenze. Senza questo decorator una classe non pu\u00f2 essere iniettata n\u00e9 ricevere le proprie dipendenze tramite NestJS.',
        }),
        'e5100001-0000-4000-8001-000000000005',
      ]
    );

    // e5100001-0000-4000-8001-000000000006 - What is a DTO in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu\u2019est-ce qu\u2019un DTO dans NestJS ?',
          de: 'Was ist ein DTO in NestJS?',
          es: '¿Qué es un DTO en NestJS?',
          it: 'Che cos\u2019\u00e8 un DTO in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un objet de table de base de donn\u00e9es g\u00e9n\u00e9r\u00e9 par TypeORM',
            'Un Data Transfer Object, une classe qui d\u00e9finit la forme et les r\u00e8gles de validation des donn\u00e9es entre les couches',
            'Un decorator qui transforme le corps de la r\u00e9ponse HTTP',
            'Un service qui transf\u00e8re les donn\u00e9es entre microservices',
          ],
          de: [
            'Ein von TypeORM generiertes Datenbank-Tabellenobjekt',
            'Ein Data Transfer Object \u2014 eine Klasse, die Form und Validierungsregeln von Daten zwischen Schichten definiert',
            'Ein Decorator, der den HTTP-Response-Body transformiert',
            'Ein Service, der Daten zwischen microservices \u00fcbertr\u00e4gt',
          ],
          es: [
            'Un objeto de tabla de base de datos generado por TypeORM',
            'Un Data Transfer Object, una clase que define la forma y las reglas de validaci\u00f3n de los datos que fluyen entre capas',
            'Un decorador que transforma el cuerpo de la respuesta HTTP',
            'Un service que transfiere datos entre microservices',
          ],
          it: [
            'Un oggetto tabella di database generato da TypeORM',
            'Un Data Transfer Object, una classe che definisce la forma e le regole di validazione dei dati tra i vari livelli',
            'Un decorator che trasforma il body della risposta HTTP',
            'Un service che trasferisce dati tra microservices',
          ],
        }),
        JSON.stringify({
          fr: 'Un DTO (Data Transfer Object) est une classe simple qui d\u00e9crit la forme des donn\u00e9es qui arrivent dans un endpoint. Combin\u00e9 avec les decorators class-validator et ValidationPipe, un DTO impose que le corps des requ\u00eates corresponde \u00e0 la structure et aux contraintes attendues avant d\u2019atteindre le handler du controller.',
          de: 'Ein DTO (Data Transfer Object) ist eine einfache Klasse, die die Form der Daten beschreibt, die in ein endpoint gelangen. In Kombination mit class-validator-Decorators und ValidationPipe stellt ein DTO sicher, dass Request-Bodies der erwarteten Struktur und den Constraints entsprechen, bevor der Controller-Handler ausgef\u00fchrt wird.',
          es: 'Un DTO (Data Transfer Object) es una clase sencilla que describe la forma de los datos que llegan a un endpoint. Combinado con los decoradores de class-validator y con ValidationPipe, un DTO garantiza que el cuerpo de la petici\u00f3n cumpla la estructura y las restricciones esperadas antes de llegar al handler del controller.',
          it: 'Un DTO (Data Transfer Object) \u00e8 una semplice classe che descrive la forma dei dati in ingresso a un endpoint. Insieme ai decorators di class-validator e a ValidationPipe, un DTO assicura che il body della richiesta rispetti la struttura e i vincoli attesi prima che venga eseguito l\u2019handler del controller.',
        }),
        'e5100001-0000-4000-8001-000000000006',
      ]
    );

    // e5100001-0000-4000-8001-000000000007 - What is NestFactory in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu\u2019est-ce que NestFactory dans NestJS ?',
          de: 'Was ist NestFactory in NestJS?',
          es: '¿Qué es NestFactory en NestJS?',
          it: 'Che cos\u2019\u00e8 NestFactory in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Une utilit\u00e9 de pattern factory pour cr\u00e9er des instances de services',
            'Une classe centrale utilis\u00e9e pour booter une application NestJS en cr\u00e9ant l\u2019instance de l\u2019application',
            'Un decorator qui enregistre une classe comme module racine',
            'Un helper pour cr\u00e9er des providers mock dans les tests',
          ],
          de: [
            'Ein Factory-Hilfswerkzeug zum Erstellen von Service-Instanzen',
            'Eine zentrale Klasse zum Bootstrapen einer NestJS-Anwendung, die die Application-Instanz erstellt',
            'Ein Decorator, der eine Klasse als Root-Module registriert',
            'Ein Helfer zum Erzeugen von Mock-Providern in Tests',
          ],
          es: [
            'Una utilidad de tipo factory para crear instancias de services',
            'Una clase central que se usa para arrancar una aplicaci\u00f3n NestJS creando la instancia de la aplicaci\u00f3n',
            'Un decorador que registra una clase como module ra\u00edz',
            'Un helper para crear providers de prueba en los tests',
          ],
          it: [
            'Una utility basata sul pattern factory per creare istanze di service',
            'Una classe centrale usata per fare il bootstrap di un\u2019applicazione NestJS creando l\u2019istanza dell\u2019app',
            'Un decorator che registra una classe come module radice',
            'Un helper per creare providers finti nei test',
          ],
        }),
        JSON.stringify({
          fr: 'NestFactory est utilis\u00e9 dans main.ts pour cr\u00e9er l\u2019instance de l\u2019application. L\u2019utilisation la plus courante est NestFactory.create(AppModule), qui renvoie un INestApplication. Vous pouvez ensuite configurer globalement middleware, pipes, guards, interceptors et appeler app.listen(port) pour d\u00e9marrer le serveur.',
          de: 'NestFactory wird in main.ts verwendet, um die Application-Instanz zu erzeugen. Der h\u00e4ufigste Aufruf ist NestFactory.create(AppModule), der ein INestApplication-Objekt zur\u00fcckgibt. Danach k\u00f6nnen Sie global middleware, pipes, guards und interceptors konfigurieren und mit app.listen(port) den Server starten.',
          es: 'NestFactory se utiliza en main.ts para crear la instancia de la aplicaci\u00f3n. El uso m\u00e1s habitual es NestFactory.create(AppModule), que devuelve un INestApplication. Despu\u00e9s se pueden configurar globalmente middleware, pipes, guards, interceptors y llamar a app.listen(port) para iniciar el servidor.',
          it: 'NestFactory viene usato in main.ts per creare l\u2019istanza dell\u2019applicazione. L\u2019uso pi\u00f9 comune \u00e8 NestFactory.create(AppModule), che restituisce un INestApplication. Poi si possono configurare globalmente middleware, pipes, guards, interceptors e chiamare app.listen(port) per avviare il server.',
        }),
        'e5100001-0000-4000-8001-000000000007',
      ]
    );

    // e5100001-0000-4000-8001-000000000008 - What is the purpose of @Param() in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Quel est le but de @Param() dans NestJS ?',
          de: 'Wozu dient @Param() in NestJS?',
          es: '¿Para qué sirve @Param() en NestJS?',
          it: 'A cosa serve @Param() in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Injecte les param\u00e8tres de requ\u00eate (query string) depuis l\u2019URL',
            'Injecte un param\u00e8tre de route nomm\u00e9 depuis le chemin de l\u2019URL (par exemple /users/:id)',
            'Injecte l\u2019int\u00e9gralit\u00e9 du corps de la requ\u00eate',
            'Injecte les en-t\u00eates de la requ\u00eate',
          ],
          de: [
            'Injiziert Query-Parameter aus der URL',
            'Injiziert einen benannten Routenparameter aus dem URL-Pfad (z.\u00a0B. /users/:id)',
            'Injiziert den gesamten Request-Body',
            'Injiziert die Request-Header',
          ],
          es: [
            'Inyecta los par\u00e1metros de consulta (query string) de la URL',
            'Inyecta un par\u00e1metro de ruta con nombre desde la ruta de la URL (por ejemplo /users/:id)',
            'Inyecta todo el cuerpo de la petici\u00f3n',
            'Inyecta las cabeceras de la petici\u00f3n',
          ],
          it: [
            'Inietta i parametri di query dalla URL',
            'Inietta un parametro di route con nome dal percorso della URL (ad esempio /users/:id)',
            'Inietta l\u2019intero body della richiesta',
            'Inietta gli header della richiesta',
          ],
        }),
        JSON.stringify({
          fr: "@Param('id') extrait un segment nomm\u00e9 du chemin de l\u2019URL. Par exemple, sur une route @Get(':id'), utiliser @Param('id') id: string donne la partie :id de l\u2019URL. Sans argument, @Param() renvoie l\u2019objet complet des params.",
          de: "@Param('id') liest ein benanntes Segment aus dem URL-Pfad. Bei einer Route wie @Get(':id') erh\u00e4lt man mit @Param('id') id: string den :id-Teil der URL. Ohne Argument liefert @Param() das gesamte params-Objekt.",
          es: "@Param('id') extrae un segmento con nombre de la ruta de la URL. Por ejemplo, en una ruta @Get(':id'), usar @Param('id') id: string obtiene la parte :id de la URL. Sin argumento, @Param() devuelve el objeto completo de params.",
          it: "@Param('id') estrae un segmento con nome dal percorso della URL. Per esempio, su una route @Get(':id'), usare @Param('id') id: string restituisce la parte :id della URL. Senza argomento, @Param() restituisce l\u2019intero oggetto params.",
        }),
        'e5100001-0000-4000-8001-000000000008',
      ]
    );

    // e5100001-0000-4000-8001-000000000009 - What is the purpose of @Body() in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Quel est le but de @Body() dans NestJS ?',
          de: 'Wozu dient @Body() in NestJS?',
          es: '¿Para qué sirve @Body() en NestJS?',
          it: 'A cosa serve @Body() in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Injecte un param\u00e8tre de chemin depuis la requ\u00eate',
            'Injecte le corps de la requ\u00eate pars\u00e9 (payload JSON) dans un param\u00e8tre de m\u00e9thode du controller',
            'Injecte les en-t\u00eates de la r\u00e9ponse dans le handler',
            'Injecte les valeurs de query string depuis l\u2019URL',
          ],
          de: [
            'Injiziert einen Pfadparameter aus der Request-URL',
            'Injiziert den geparsten Request-Body (JSON-Payload) in einen Parameter der Controller-Methode',
            'Injiziert die Response-Header in den Handler',
            'Injiziert die Query-String-Werte aus der URL',
          ],
          es: [
            'Inyecta un par\u00e1metro de ruta desde la petici\u00f3n',
            'Inyecta el cuerpo de la petici\u00f3n ya parseado (payload JSON) en un par\u00e1metro del m\u00e9todo del controller',
            'Inyecta las cabeceras de la respuesta en el handler',
            'Inyecta los valores de query string de la URL',
          ],
          it: [
            'Inietta un parametro di percorso dalla richiesta',
            'Inietta il body della richiesta (payload JSON gi\u00e0 parsato) in un parametro del metodo del controller',
            'Inietta gli header della risposta nel handler',
            'Inietta i valori della query string dalla URL',
          ],
        }),
        JSON.stringify({
          fr: "@Body() extrait l\u2019int\u00e9gralit\u00e9 du corps de la requ\u00eate et l\u2019injecte dans un param\u00e8tre. Vous pouvez passer une cl\u00e9 pour extraire un seul champ : @Body('name'). Utilis\u00e9 avec une classe DTO et ValidationPipe, NestJS valide et transforme automatiquement le corps avant l\u2019ex\u00e9cution du handler.",
          de: "@Body() extrahiert den gesamten Request-Body und injiziert ihn in einen Parameter. Mit einem Schl\u00fcssel wie @Body('name') kann ein einzelnes Feld ausgelesen werden. In Kombination mit einer DTO-Klasse und ValidationPipe validiert und transformiert NestJS den Body automatisch, bevor der Handler ausgef\u00fchrt wird.",
          es: "@Body() extrae todo el cuerpo de la petici\u00f3n y lo inyecta en un par\u00e1metro. Puede pasarse una clave para extraer un solo campo: @Body('name'). Usado con una clase DTO y con ValidationPipe, NestJS valida y transforma el cuerpo de forma autom\u00e1tica antes de ejecutar el handler.",
          it: "@Body() estrae l\u2019intero body della richiesta e lo inietta in un parametro. Si pu\u00f2 passare una chiave per estrarre un campo singolo: @Body('name'). Usato con una classe DTO e con ValidationPipe, NestJS valida e trasforma automaticamente il body prima che venga eseguito l\u2019handler.",
        }),
        'e5100001-0000-4000-8001-000000000009',
      ]
    );

    // e5100001-0000-4000-8001-000000000010 - What is the purpose of @Query() in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Quel est le but de @Query() dans NestJS ?',
          de: 'Wozu dient @Query() in NestJS?',
          es: '¿Para qué sirve @Query() en NestJS?',
          it: 'A cosa serve @Query() in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Extrait une requ\u00eate GraphQL depuis la requ\u00eate HTTP',
            'Injecte les param\u00e8tres de query string depuis l\u2019URL (par exemple ?page=1&limit=10)',
            'Ex\u00e9cute une requ\u00eate de base de donn\u00e9es dans le controller',
            'Injecte l\u2019objet Request brut d\u2019Express',
          ],
          de: [
            'Liest eine GraphQL-Query aus der HTTP-Anfrage',
            'Injiziert die Query-String-Parameter aus der URL (z.\u00a0B. ?page=1&limit=10)',
            'F\u00fchrt im Controller eine Datenbankabfrage aus',
            'Injiziert das rohe Express-Request-Objekt',
          ],
          es: [
            'Extrae una consulta GraphQL desde la petici\u00f3n',
            'Inyecta los par\u00e1metros de query string de la URL (por ejemplo ?page=1&limit=10)',
            'Ejecuta una consulta de base de datos dentro del controller',
            'Inyecta el objeto Request crudo de Express',
          ],
          it: [
            'Estrae una query GraphQL dalla richiesta',
            'Inietta i parametri della query string dalla URL (ad esempio ?page=1&limit=10)',
            'Esegue una query di database dentro il controller',
            'Inietta l\u2019oggetto Request grezzo di Express',
          ],
        }),
        JSON.stringify({
          fr: "@Query() extrait les param\u00e8tres de query string depuis l\u2019URL. Par exemple, pour une requ\u00eate sur /items?page=2&limit=10, @Query('page') page: string injecte \"2\". Sans cl\u00e9, il renvoie l\u2019objet complet de query ; combin\u00e9 avec ParseIntPipe, il permet de convertir les cha\u00eenes en nombres.",
          de: "@Query() liest die Query-String-Parameter aus der URL. Bei einem Aufruf auf /items?page=2&limit=10 injiziert @Query('page') page: string den Wert \"2\". Ohne Schl\u00fcssel gibt es das gesamte Query-Objekt zur\u00fcck; in Kombination mit ParseIntPipe lassen sich Strings in Zahlen umwandeln.",
          es: "@Query() extrae los par\u00e1metros de query string de la URL. Por ejemplo, para una petici\u00f3n a /items?page=2&limit=10, @Query('page') page: string inyecta \"2\". Sin clave devuelve el objeto completo de query; combinado con ParseIntPipe permite convertir las cadenas en n\u00fameros.",
          it: "@Query() estrae i parametri della query string dalla URL. Per esempio, per una richiesta a /items?page=2&limit=10, @Query('page') page: string inietta \"2\". Senza chiave restituisce l\u2019intero oggetto query; insieme a ParseIntPipe consente di convertire le stringhe in numeri.",
        }),
        'e5100001-0000-4000-8001-000000000010',
      ]
    );

    // Remaining questions (medium and hard)
    // e5100001-0000-4000-8001-000000000011 - Dependency Injection in NestJS
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu\u2019est-ce que la dependency injection dans NestJS ?',
          de: 'Was ist dependency injection in NestJS?',
          es: '¿Qué es la dependency injection en NestJS?',
          it: 'Che cos\u2019\u00e8 la dependency injection in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un pattern o\u00f9 les classes importent directement leurs d\u00e9pendances avec require()',
            'Un pattern de conception o\u00f9 le conteneur IoC de NestJS cr\u00e9e et fournit les d\u00e9pendances aux classes au lieu qu\u2019elles les cr\u00e9ent elles-m\u00eames',
            'Une fa\u00e7on d\u2019injecter des variables d\u2019environnement dans les services',
            'Une m\u00e9thode pour passer des props entre composants React (utilis\u00e9e dans le frontend NestJS)',
          ],
          de: [
            'Ein Muster, bei dem Klassen ihre Abh\u00e4ngigkeiten direkt mit require() importieren',
            'Ein Entwurfsmuster, bei dem der NestJS-IoC-Container Abh\u00e4ngigkeiten erstellt und bereitstellt, statt dass Klassen sie selbst erzeugen',
            'Eine M\u00f6glichkeit, Umgebungsvariablen in Services zu injizieren',
            'Eine Methode, um Props zwischen React-Komponenten zu \u00fcbergeben (im NestJS-Frontend)',
          ],
          es: [
            'Un patr\u00f3n donde las clases importan directamente sus dependencias usando require()',
            'Un patr\u00f3n de dise\u00f1o en el que el contenedor IoC de NestJS crea y suministra las dependencias a las clases en lugar de que ellas las creen',
            'Una forma de inyectar variables de entorno en los services',
            'Un m\u00e9todo para pasar props entre componentes de React (utilizado en el frontend de NestJS)',
          ],
          it: [
            'Un pattern in cui le classi importano direttamente le dipendenze usando require()',
            'Un pattern di progettazione in cui il contenitore IoC di NestJS crea e fornisce le dipendenze alle classi invece che siano loro a crearle',
            'Un modo per iniettare variabili di ambiente nei services',
            'Un metodo per passare props tra componenti React (usato nel frontend NestJS)',
          ],
        }),
        JSON.stringify({
          fr: 'La dependency injection (DI) dans NestJS signifie qu\u2019une classe d\u00e9clare ses d\u00e9pendances dans le constructeur et que le conteneur IoC de NestJS les instancie et les fournit automatiquement. Cela d\u00e9couple les classes de leurs d\u00e9pendances et rend le code plus testable et maintenable. Le conteneur g\u00e8re le cycle de vie de tous les providers (singleton par d\u00e9faut).',
          de: 'Dependency injection (DI) in NestJS bedeutet, dass eine Klasse ihre Abh\u00e4ngigkeiten im Konstruktor deklariert und der NestJS-IoC-Container diese automatisch instanziiert und bereitstellt. Dadurch werden Klassen von ihren Abh\u00e4ngigkeiten entkoppelt und der Code wird besser testbar und wartbar. Der Container verwaltet den Lebenszyklus aller providers (standardm\u00e4\u00dfig singleton).',
          es: 'La dependency injection (DI) en NestJS significa que una clase declara sus dependencias en el constructor y el contenedor IoC de NestJS las instancia y las proporciona de forma autom\u00e1tica. Esto desacopla las clases de sus dependencias y hace que el c\u00f3digo sea m\u00e1s testeable y mantenible. El contenedor gestiona el ciclo de vida de todos los providers (por defecto singleton).',
          it: 'La dependency injection (DI) in NestJS significa che una classe dichiara le proprie dipendenze nel costruttore e il contenitore IoC di NestJS le istanzia e le fornisce automaticamente. Questo disaccoppia le classi dalle loro dipendenze e rende il codice pi\u00f9 testabile e manutenibile. Il contenitore gestisce il ciclo di vita di tutti i providers (singleton per impostazione predefinita).',
        }),
        'e5100001-0000-4000-8001-000000000011',
      ]
    );

    // e5100001-0000-4000-8001-000000000012 - What is a Guard in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: "Qu'est-ce qu'un Guard dans NestJS ?",
          de: 'Was ist ein Guard in NestJS?',
          es: '¿Qué es un Guard en NestJS?',
          it: "Che cos'è un Guard in NestJS?",
        }),
        JSON.stringify({
          fr: [
            'Un middleware qui journalise les requêtes entrantes',
            'Une classe décorée avec @Injectable() qui implémente CanActivate et décide si une requête doit être traitée par le handler de route',
            'Un type guard TypeScript utilisé pour la vérification de type à l’exécution',
            'Une classe qui valide les DTO avant qu’ils n’atteignent le service',
          ],
          de: [
            'Eine Middleware, die eingehende Anfragen protokolliert',
            'Eine mit @Injectable() dekorierte Klasse, die CanActivate implementiert und entscheidet, ob eine Anfrage vom Routen-Handler verarbeitet werden darf',
            'Ein TypeScript-Type-Guard, der zur Laufzeit-Typprüfung verwendet wird',
            'Eine Klasse, die DTOs validiert, bevor sie den Service erreichen',
          ],
          es: [
            'Un middleware que registra las peticiones entrantes',
            'Una clase decorada con @Injectable() que implementa CanActivate y determina si una petición debe ser atendida por el handler de la ruta',
            'Un type guard de TypeScript usado para la comprobación de tipos en tiempo de ejecución',
            'Una clase que valida los DTO antes de que lleguen al service',
          ],
          it: [
            'Un middleware che registra le richieste in ingresso',
            'Una classe decorata con @Injectable() che implementa CanActivate e decide se una richiesta deve essere gestita dal route handler',
            'Un type guard TypeScript usato per il controllo dei tipi a runtime',
            'Una classe che valida i DTO prima che raggiungano il service',
          ],
        }),
        JSON.stringify({
          fr: 'Un Guard implémente l’interface CanActivate. Sa méthode canActivate() renvoie true (autoriser) ou false/une exception pour refuser l’accès. Les Guards s’exécutent après le middleware mais avant les interceptors et les pipes et sont l’endroit standard pour la logique d’authentification et d’autorisation par rôles.',
          de: 'Ein Guard implementiert das Interface CanActivate. Seine Methode canActivate() gibt true (erlauben) oder false bzw. eine Exception zurück, um den Zugriff zu verweigern. Guards laufen nach dem middleware, aber vor interceptors und pipes und sind der Standardplatz für Authentifizierungs- und rollenbasierte Autorisierungslogik.',
          es: 'Un Guard implementa la interfaz CanActivate. Su método canActivate() devuelve true (permitir) o false/una excepción para denegar el acceso. Los Guards se ejecutan después del middleware pero antes de los interceptors y pipes y son el lugar estándar para la lógica de autenticación y autorización basada en roles.',
          it: 'Un Guard implementa l’interfaccia CanActivate. Il suo metodo canActivate() restituisce true (consenti) oppure false/un’eccezione per negare l’accesso. I Guard vengono eseguiti dopo il middleware ma prima di interceptors e pipes e sono il punto standard per la logica di autenticazione e autorizzazione basata sui ruoli.',
        }),
        'e5100001-0000-4000-8001-000000000012',
      ]
    );

    // e5100001-0000-4000-8001-000000000013 - What is an Interceptor in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce qu’un Interceptor dans NestJS ?',
          de: 'Was ist ein Interceptor in NestJS?',
          es: '¿Qué es un Interceptor en NestJS?',
          it: 'Che cos’è un Interceptor in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un Interceptor HTTP inspiré d’Angular utilisé côté frontend',
            'Une classe décorée avec @Injectable() qui implémente NestInterceptor et peut transformer les requêtes/réponses, ajouter du logging ou gérer le cache',
            'Un middleware qui n’intercepte que les requêtes POST',
            'Un service qui intercepte les requêtes de base de données avant leur exécution',
          ],
          de: [
            'Ein von Angular inspiriertes HTTP-Interceptor-Konzept für das Frontend',
            'Eine mit @Injectable() dekorierte Klasse, die NestInterceptor implementiert und Requests/Responses transformieren, Logging hinzufügen oder Caching übernehmen kann',
            'Eine Middleware, die nur POST-Anfragen abfängt',
            'Ein Service, der Datenbankabfragen abfängt, bevor sie ausgeführt werden',
          ],
          es: [
            'Un Interceptor HTTP al estilo de Angular usado en el frontend',
            'Una clase decorada con @Injectable() que implementa NestInterceptor y puede transformar peticiones/respuestas, añadir logging o gestionar caché',
            'Un middleware que solo intercepta peticiones POST',
            'Un service que intercepta consultas de base de datos antes de ejecutarlas',
          ],
          it: [
            'Un Interceptor HTTP in stile Angular usato lato frontend',
            'Una classe decorata con @Injectable() che implementa NestInterceptor e può trasformare richieste/risposte, aggiungere logging o gestire la cache',
            'Un middleware che intercetta solo le richieste POST',
            'Un service che intercetta le query al database prima dell’esecuzione',
          ],
        }),
        JSON.stringify({
          fr: 'Un Interceptor implémente NestInterceptor et sa méthode intercept(context, next). Il enveloppe l’exécution du handler de route à l’aide d’Observables RxJS, ce qui permet de transformer la réponse, mesurer la durée, gérer les erreurs, mettre en cache ou ajouter des en-têtes. Les Interceptors s’exécutent après les Guards et les Pipes mais avant que la réponse ne soit envoyée.',
          de: 'Ein Interceptor implementiert NestInterceptor und dessen Methode intercept(context, next). Er umschließt die Ausführung des Route-Handlers mit RxJS-Observables und kann so Antworten transformieren, Laufzeiten messen, Fehler behandeln, Caching umsetzen oder Header hinzufügen. Interceptors laufen nach Guards und Pipes, aber bevor die Response gesendet wird.',
          es: 'Un Interceptor implementa NestInterceptor y su método intercept(context, next). Envuelve la ejecución del handler de la ruta usando Observables de RxJS, lo que permite transformar la respuesta, medir tiempos, manejar errores, aplicar caché o añadir cabeceras. Los Interceptors se ejecutan después de los Guards y de los Pipes pero antes de que se envíe la respuesta.',
          it: 'Un Interceptor implementa NestInterceptor e il suo metodo intercept(context, next). Incapsula l’esecuzione del route handler usando gli Observable di RxJS e permette di trasformare la risposta, misurare i tempi, gestire gli errori, fare caching o aggiungere header. Gli Interceptors vengono eseguiti dopo Guards e Pipes ma prima dell’invio della risposta.',
        }),
        'e5100001-0000-4000-8001-000000000013',
      ]
    );

    // e5100001-0000-4000-8001-000000000014 - What is a Pipe in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce qu’un Pipe dans NestJS ?',
          de: 'Was ist ein Pipe in NestJS?',
          es: '¿Qué es un Pipe en NestJS?',
          it: 'Che cos’è un Pipe in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un stream Node.js utilisé pour transformer des données',
            'Une classe qui implémente PipeTransform et qui transforme ou valide les données d’entrée avant qu’elles n’atteignent le handler de route',
            'Un middleware qui envoie les données vers une file de messages',
            'Une commande CLI pour générer des fichiers boilerplate',
          ],
          de: [
            'Ein Node.js-Stream, der zur Daten­transformation dient',
            'Eine Klasse, die PipeTransform implementiert und Eingabedaten transformiert oder validiert, bevor sie den Route-Handler erreichen',
            'Eine Middleware, die Request-Daten in eine Queue schreibt',
            'Ein CLI-Befehl zum Erzeugen von Boilerplate-Dateien',
          ],
          es: [
            'Un stream de Node.js usado para transformar datos',
            'Una clase que implementa PipeTransform y transforma o valida los datos de entrada antes de que lleguen al handler de la ruta',
            'Un middleware que envía los datos de la petición a una cola',
            'Un comando de la CLI para generar archivos de boilerplate',
          ],
          it: [
            'Uno stream di Node.js usato per trasformare i dati',
            'Una classe che implementa PipeTransform e trasforma o valida i dati in ingresso prima che raggiungano il route handler',
            'Un middleware che inoltra i dati della richiesta a una coda',
            'Un comando CLI per generare file di boilerplate',
          ],
        }),
        JSON.stringify({
          fr: 'Les Pipes implémentent PipeTransform. Ils servent en général soit à transformer les données (par exemple ParseIntPipe convertit "42" en 42) soit à les valider et à lancer une BadRequestException si elles ne respectent pas les contraintes (par exemple ValidationPipe avec class-validator). Les Pipes s’exécutent juste avant le handler de route.',
          de: 'Pipes implementieren PipeTransform. Typische Einsatzzwecke sind (1) **Transformation** — z. B. wandelt ParseIntPipe "42" in 42 um, und (2) **Validierung** — wirft eine BadRequestException, wenn die Eingaben die Constraints nicht erfüllen (z. B. ValidationPipe mit class-validator). Pipes laufen direkt vor dem Route-Handler.',
          es: 'Los Pipes implementan PipeTransform. Sus usos típicos son (1) **transformación** — por ejemplo ParseIntPipe convierte "42" en 42, y (2) **validación** — lanza una BadRequestException si los datos no cumplen las restricciones (por ejemplo ValidationPipe con class-validator). Los Pipes se ejecutan justo antes del handler de la ruta.',
          it: 'I Pipes implementano PipeTransform. I casi d’uso tipici sono (1) **trasformazione** — ad esempio ParseIntPipe converte "42" in 42, e (2) **validazione** — lancia una BadRequestException se i dati non rispettano i vincoli (per esempio ValidationPipe con class-validator). I Pipes vengono eseguiti immediatamente prima del route handler.',
        }),
        'e5100001-0000-4000-8001-000000000014',
      ]
    );

    // e5100001-0000-4000-8001-000000000015 - What is an Exception Filter in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce qu’un Exception Filter dans NestJS ?',
          de: 'Was ist ein Exception Filter in NestJS?',
          es: '¿Qué es un Exception Filter en NestJS?',
          it: 'Che cos’è un Exception Filter in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un bloc try/catch ajouté automatiquement à chaque méthode de controller',
            'Une classe qui implémente ExceptionFilter et intercepte les exceptions levées pour les transformer en réponses HTTP',
            'Un middleware qui filtre les requêtes mal formées avant qu’elles n’atteignent les controllers',
            'Un type TypeScript qui spécialise les sous-types d’erreurs',
          ],
          de: [
            'Ein try/catch-Block, der automatisch zu jeder Controller-Methode hinzugefügt wird',
            'Eine Klasse, die ExceptionFilter implementiert und geworfene Exceptions abfängt, um sie in HTTP-Antworten umzuwandeln',
            'Eine Middleware, die fehlerhafte Requests herausfiltert, bevor sie Controller erreichen',
            'Ein TypeScript-Typ, der Error-Untertypen einschränkt',
          ],
          es: [
            'Un bloque try/catch añadido automáticamente a cada método del controller',
            'Una clase que implementa ExceptionFilter y captura las excepciones lanzadas para transformarlas en respuestas HTTP',
            'Un middleware que filtra peticiones mal formadas antes de que lleguen a los controllers',
            'Un tipo de TypeScript que acota subtipos de Error',
          ],
          it: [
            'Un blocco try/catch aggiunto automaticamente a ogni metodo del controller',
            'Una classe che implementa ExceptionFilter e intercetta le eccezioni lanciate trasformandole in risposte HTTP',
            'Un middleware che filtra le richieste non valide prima che arrivino ai controller',
            'Un tipo TypeScript che restringe i sottotipi di Error',
          ],
        }),
        JSON.stringify({
          fr: 'Les Exception Filters implémentent ExceptionFilter et sa méthode catch(exception, host). Ils interceptent les exceptions non gérées et renvoient une réponse HTTP personnalisée. NestJS fournit un filtre global par défaut pour HttpException et les erreurs inconnues, mais des filtres personnalisés permettent de contrôler le format des erreurs ou de gérer des types d’exception métier.',
          de: 'Exception Filters implementieren ExceptionFilter und dessen Methode catch(exception, host). Sie fangen unbehandelte Exceptions ab und senden eine maßgeschneiderte HTTP-Response. NestJS hat einen globalen Standardfilter für HttpException und unbekannte Fehler; benutzerdefinierte Filter erlauben es, das Fehlerformat zu steuern oder domänenspezifische Exceptions zu behandeln.',
          es: 'Los Exception Filters implementan ExceptionFilter y su método catch(exception, host). Interceptan las excepciones no controladas y envían una respuesta HTTP personalizada. NestJS incluye un filtro global por defecto para HttpException y errores desconocidos, pero los filtros personalizados permiten controlar el formato de los errores o manejar tipos de excepción de dominio.',
          it: 'Gli Exception Filter implementano ExceptionFilter e il suo metodo catch(exception, host). Intercettano le eccezioni non gestite e inviano una risposta HTTP personalizzata. NestJS fornisce un filtro globale predefinito per HttpException e per gli errori sconosciuti, ma i filtri personalizzati permettono di controllare il formato degli errori o di gestire eccezioni di dominio specifiche.',
        }),
        'e5100001-0000-4000-8001-000000000015',
      ]
    );

    // e5100001-0000-4000-8001-000000000016 - What is Middleware in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce que le Middleware dans NestJS ?',
          de: 'Was ist Middleware in NestJS?',
          es: '¿Qué es el Middleware en NestJS?',
          it: 'Che cos’è il Middleware in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un decorator appliqué directement aux méthodes de controller',
            'Une fonction qui s’exécute avant le handler de route et qui a accès aux objets request et response ainsi qu’à next()',
            'Une classe qui intercepte et transforme les requêtes de base de données',
            'Un objet de configuration global enregistré sur AppModule',
          ],
          de: [
            'Ein Decorator, der direkt auf Controller-Methoden angewendet wird',
            'Eine Funktion, die vor dem Route-Handler läuft und Zugriff auf Request, Response und next() hat',
            'Eine Klasse, die Datenbank-Anfragen abfängt und transformiert',
            'Ein globales Konfigurationsobjekt, das auf AppModule registriert ist',
          ],
          es: [
            'Un decorador que se aplica directamente a los métodos del controller',
            'Una función que se ejecuta antes del handler de la ruta y tiene acceso a los objetos request y response y a next()',
            'Una clase que intercepta y transforma las consultas a base de datos',
            'Un objeto de configuración global registrado en AppModule',
          ],
          it: [
            'Un decorator applicato direttamente ai metodi del controller',
            'Una funzione che viene eseguita prima del route handler e che ha accesso a request, response e next()',
            'Una classe che intercetta e trasforma le query al database',
            'Un oggetto di configurazione globale registrato su AppModule',
          ],
        }),
        JSON.stringify({
          fr: 'Le Middleware NestJS est équivalent au middleware Express. C’est une fonction (ou une classe qui implémente NestMiddleware) qui reçoit req, res et next. Le middleware s’exécute avant les Guards, les Pipes et les Interceptors et sert souvent pour le logging, le parsing de requêtes, la mise en place d’en-têtes ou le rate limiting. Il se déclare via configure() dans un module qui implémente NestModule.',
          de: 'NestJS-Middleware entspricht dem Express-Middleware-Konzept. Es ist eine Funktion (oder eine Klasse, die NestMiddleware implementiert) mit Zugriff auf req, res und next. Middleware läuft vor Guards, Pipes und Interceptors und wird typischerweise für Logging, Request-Parsing, Header-Setzung oder Rate-Limiting verwendet. Registriert wird sie über configure() in einem Modul, das NestModule implementiert.',
          es: 'El Middleware de NestJS es equivalente al middleware de Express. Es una función (o clase que implementa NestMiddleware) que recibe req, res y next. Se ejecuta antes de los Guards, Pipes e Interceptors y se usa habitualmente para logging, parseo de peticiones, establecimiento de cabeceras o rate limiting. Se registra mediante configure() en un módulo que implementa NestModule.',
          it: 'Il Middleware di NestJS è equivalente al middleware di Express. È una funzione (o una classe che implementa NestMiddleware) che riceve req, res e next. Viene eseguito prima di Guards, Pipes e Interceptors ed è usato tipicamente per logging, parsing delle richieste, impostazione degli header o rate limiting. Si registra tramite configure() in un modulo che implementa NestModule.',
        }),
        'e5100001-0000-4000-8001-000000000016',
      ]
    );

    // e5100001-0000-4000-8001-000000000017 - What is the NestJS request lifecycle order?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Quel est l’ordre du cycle de vie d’une requête dans NestJS ?',
          de: 'Wie lautet die Reihenfolge des Request-Lifecycles in NestJS?',
          es: '¿Cuál es el orden del ciclo de vida de una petición en NestJS?',
          it: 'Qual è l’ordine del ciclo di vita di una richiesta in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Guards → Interceptors → Pipes → Controller → Interceptors → Exception Filters',
            'Middleware → Guards → Interceptors → Pipes → Controller → Interceptors (réponse) → Exception Filters',
            'Middleware → Pipes → Guards → Controller → Interceptors → Exception Filters',
            'Interceptors → Guards → Middleware → Pipes → Controller',
          ],
          de: [
            'Guards → Interceptors → Pipes → Controller → Interceptors → Exception Filters',
            'Middleware → Guards → Interceptors → Pipes → Controller → Interceptors (Response) → Exception Filters',
            'Middleware → Pipes → Guards → Controller → Interceptors → Exception Filters',
            'Interceptors → Guards → Middleware → Pipes → Controller',
          ],
          es: [
            'Guards → Interceptors → Pipes → Controller → Interceptors → Exception Filters',
            'Middleware → Guards → Interceptors → Pipes → Controller → Interceptors (respuesta) → Exception Filters',
            'Middleware → Pipes → Guards → Controller → Interceptors → Exception Filters',
            'Interceptors → Guards → Middleware → Pipes → Controller',
          ],
          it: [
            'Guards → Interceptors → Pipes → Controller → Interceptors → Exception Filters',
            'Middleware → Guards → Interceptors → Pipes → Controller → Interceptors (risposta) → Exception Filters',
            'Middleware → Pipes → Guards → Controller → Interceptors → Exception Filters',
            'Interceptors → Guards → Middleware → Pipes → Controller',
          ],
        }),
        JSON.stringify({
          fr: 'Le cycle de vie complet d’une requête NestJS est : Middleware → Guards → Interceptors (avant) → Pipes → Controller/handler → Interceptors (après) → Exception Filters (en cas d’erreur). Comprendre cet ordre est essentiel pour savoir pourquoi un Guard ne voit pas une valeur transformée par un Pipe ou pourquoi une exception n’est pas interceptée là où on s’y attend.',
          de: 'Der vollständige Request-Lifecycle in NestJS lautet: Middleware → Guards → Interceptors (vorher) → Pipes → Controller/Handler → Interceptors (nachher) → Exception Filters (bei Fehlern). Dieses Wissen ist entscheidend, um zu verstehen, warum ein Guard eine von einem Pipe transformierte Eingabe nicht sieht oder warum eine Exception nicht an der erwarteten Stelle abgefangen wird.',
          es: 'El ciclo de vida completo de una petición en NestJS es: Middleware → Guards → Interceptors (antes) → Pipes → Controller/handler → Interceptors (después) → Exception Filters (si hay error). Entender este orden es clave para saber por qué un Guard no ve un valor transformado por un Pipe o por qué una excepción no se captura donde se esperaba.',
          it: 'Il ciclo di vita completo di una richiesta in NestJS è: Middleware → Guards → Interceptors (prima) → Pipes → Controller/handler → Interceptors (dopo) → Exception Filters (in caso di errore). Capire quest’ordine è fondamentale per spiegarsi perché un Guard non vede un valore trasformato da un Pipe o perché un’eccezione non viene intercettata dove ci si aspetta.',
        }),
        'e5100001-0000-4000-8001-000000000017',
      ]
    );

    // e5100001-0000-4000-8001-000000000018 - What is ValidationPipe in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce que ValidationPipe dans NestJS ?',
          de: 'Was ist ValidationPipe in NestJS?',
          es: '¿Qué es ValidationPipe en NestJS?',
          it: 'Che cos’è ValidationPipe in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un Pipe qui valide les requêtes SQL avant exécution',
            'Un Pipe intégré qui valide automatiquement les corps de requêtes entrants par rapport aux règles class-validator d’un DTO et rejette les requêtes invalides',
            'Un Guard qui vérifie si un utilisateur a accès à une route',
            'Un middleware qui supprime le HTML dangereux des corps de requête',
          ],
          de: [
            'Ein Pipe, der SQL-Queries vor der Ausführung validiert',
            'Ein eingebauter Pipe, der eingehende Request-Bodies automatisch anhand der class-validator-Regeln eines DTO validiert und ungültige Requests ablehnt',
            'Ein Guard, der prüft, ob ein Benutzer Zugriff auf eine Route hat',
            'Eine Middleware, die gefährliches HTML aus Request-Bodies entfernt',
          ],
          es: [
            'Un Pipe que valida consultas SQL antes de ejecutarlas',
            'Un Pipe integrado que valida automáticamente los cuerpos de las peticiones entrantes contra las reglas de class-validator definidas en un DTO y rechaza las peticiones no válidas',
            'Un Guard que comprueba si un usuario tiene acceso a una ruta',
            'Un middleware que limpia HTML peligroso de los cuerpos de las peticiones',
          ],
          it: [
            'Un Pipe che valida le query SQL prima dell’esecuzione',
            'Un Pipe integrato che valida automaticamente i body delle richieste in ingresso rispetto alle regole di class-validator definite su un DTO e rifiuta le richieste non valide',
            'Un Guard che verifica se un utente ha accesso a una route',
            'Un middleware che rimuove l’HTML pericoloso dai body delle richieste',
          ],
        }),
        JSON.stringify({
          fr: 'ValidationPipe fonctionne avec class-validator et class-transformer. Lorsqu’il est appliqué globalement ou sur une route, il convertit le corps de la requête en instance de la classe DTO puis valide chaque propriété selon les decorators (@IsString(), @IsInt(), @IsEmail(), etc.). Les requêtes invalides reçoivent une réponse 400 Bad Request avec le détail des contraintes non respectées.',
          de: 'ValidationPipe arbeitet mit class-validator und class-transformer. Wird er global oder auf einer Route eingesetzt, wandelt er den Request-Body in eine DTO-Instanz um und validiert jede Eigenschaft anhand der Decorators (@IsString(), @IsInt(), @IsEmail() usw.). Ungültige Requests erhalten eine 400 Bad Request mit Details zu den verletzten Constraints.',
          es: 'ValidationPipe funciona junto con class-validator y class-transformer. Aplicado globalmente o en una ruta, transforma el cuerpo de la petición en una instancia del DTO y valida cada propiedad según los decoradores (@IsString(), @IsInt(), @IsEmail(), etc.). Las peticiones no válidas reciben un 400 Bad Request con el detalle de las restricciones incumplidas.',
          it: 'ValidationPipe lavora insieme a class-validator e class-transformer. Quando è applicato globalmente o su una singola route, trasforma il body della richiesta in un’istanza del DTO e valida ogni proprietà in base ai decorators (@IsString(), @IsInt(), @IsEmail(), ecc.). Le richieste non valide ricevono una risposta 400 Bad Request con il dettaglio dei vincoli violati.',
        }),
        'e5100001-0000-4000-8001-000000000018',
      ]
    );

    // e5100001-0000-4000-8001-000000000019 - What is the ExecutionContext in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce que l’ExecutionContext dans NestJS ?',
          de: 'Was ist der ExecutionContext in NestJS?',
          es: '¿Qué es el ExecutionContext en NestJS?',
          it: 'Che cos’è l’ExecutionContext in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un objet de contexte injecté automatiquement dans chaque méthode de service',
            'Une abstraction qui donne accès au contexte courant (HTTP, WebSocket, RPC) pour les Guards, Interceptors et Filters',
            'Une interface TypeScript pour typer les objets Request Express',
            'Une classe qui exécute des transactions de base de données',
          ],
          de: [
            'Ein Kontextobjekt, das automatisch in jede Service-Methode injiziert wird',
            'Eine Abstraktion, die Guards, Interceptors und Filters Zugriff auf den aktuellen Kontext (HTTP, WebSocket, RPC) gibt',
            'Ein TypeScript-Interface, um Express-Request-Objekte zu typisieren',
            'Eine Klasse, die Datenbank-Transaktionen ausführt',
          ],
          es: [
            'Un objeto de contexto inyectado automáticamente en cada método de service',
            'Una abstracción que da acceso al contexto actual (HTTP, WebSocket, RPC) para Guards, Interceptors y Filters',
            'Una interfaz de TypeScript para tipar objetos Request de Express',
            'Una clase que ejecuta transacciones de base de datos',
          ],
          it: [
            'Un oggetto di contesto iniettato automaticamente in ogni metodo del service',
            'Un’astrazione che fornisce a Guards, Interceptors e Filters l’accesso al contesto corrente (HTTP, WebSocket, RPC)',
            'Una interfaccia TypeScript per tipizzare gli oggetti Request di Express',
            'Una classe che esegue transazioni di database',
          ],
        }),
        JSON.stringify({
          fr: 'ExecutionContext étend ArgumentsHost et est passé aux Guards et Interceptors. Il fournit getClass() (la classe du controller), getHandler() (la méthode handler) et switchToHttp()/switchToWs()/switchToRpc() pour obtenir les objets spécifiques au transport. Il est essentiel pour lire les métadonnées et accéder à la requête courante dans la logique de sécurité.',
          de: 'ExecutionContext erweitert ArgumentsHost und wird an Guards und Interceptors übergeben. Er stellt getClass() (Controller-Klasse), getHandler() (Handler-Methode) sowie switchToHttp()/switchToWs()/switchToRpc() bereit, um transportspezifische Objekte zu erhalten. Er ist entscheidend, um Metadaten auszulesen und im Sicherheits­code auf die aktuelle Request zuzugreifen.',
          es: 'ExecutionContext extiende ArgumentsHost y se pasa a Guards e Interceptors. Proporciona getClass() (la clase del controller), getHandler() (el método handler) y switchToHttp()/switchToWs()/switchToRpc() para obtener los objetos específicos del transporte. Es clave para leer metadatos y acceder a la petición actual en la lógica de seguridad.',
          it: 'ExecutionContext estende ArgumentsHost ed è passato a Guards e Interceptors. Espone getClass() (la classe del controller), getHandler() (il metodo handler) e switchToHttp()/switchToWs()/switchToRpc() per ottenere gli oggetti specifici del trasporto. È fondamentale per leggere i metadati e accedere alla richiesta corrente nella logica di sicurezza.',
        }),
        'e5100001-0000-4000-8001-000000000019',
      ]
    );

    // e5100001-0000-4000-8001-000000000020 - What is a Dynamic Module in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce qu’un Dynamic Module dans NestJS ?',
          de: 'Was ist ein Dynamic Module in NestJS?',
          es: '¿Qué es un Dynamic Module en NestJS?',
          it: 'Che cos’è un Dynamic Module in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un module qui charge paresseusement ses providers lors de la première requête',
            'Un module qui renvoie un objet DynamicModule depuis une méthode statique (par exemple forRoot(), forFeature()) permettant de passer une configuration au moment de l’import',
            'Un module qui enregistre dynamiquement des routes HTTP à l’exécution',
            'Un module créé automatiquement par la CLI NestJS',
          ],
          de: [
            'Ein Module, das seine Provider lazy lädt, sobald die erste Anfrage kommt',
            'Ein Module, das aus einer statischen Methode (z. B. forRoot(), forFeature()) ein DynamicModule-Objekt zurückgibt, um Konfiguration beim Import zu übergeben',
            'Ein Module, das HTTP-Routen zur Laufzeit dynamisch registriert',
            'Ein Module, das automatisch von der NestJS-CLI erzeugt wird',
          ],
          es: [
            'Un module que carga sus providers de forma perezosa en la primera petición',
            'Un module que devuelve un objeto DynamicModule desde un método estático (por ejemplo forRoot(), forFeature()) y permite pasar configuración en el momento del import',
            'Un module que registra rutas HTTP de forma dinámica en tiempo de ejecución',
            'Un module creado automáticamente por la CLI de NestJS',
          ],
          it: [
            'Un module che carica i propri provider in lazy loading alla prima richiesta',
            'Un module che restituisce un oggetto DynamicModule da un metodo statico (per esempio forRoot(), forFeature()) consentendo di passare la configurazione al momento dell’import',
            'Un module che registra dinamicamente le route HTTP a runtime',
            'Un module creato automaticamente dalla CLI di NestJS',
          ],
        }),
        JSON.stringify({
          fr: 'Les Dynamic Modules exposent des méthodes statiques comme forRoot(config) ou forFeature(entity) qui renvoient un objet DynamicModule avec une propriété module et les mêmes propriétés que @Module(). Cela permet de configurer le module au moment de l’import. Ce pattern est largement utilisé par TypeOrmModule, ConfigModule et JwtModule.',
          de: 'Dynamic Modules stellen statische Methoden wie forRoot(config) oder forFeature(entity) bereit, die ein DynamicModule-Objekt mit einer module-Eigenschaft und den üblichen @Module()-Eigenschaften zurückgeben. Dadurch kann ein Module zur Importzeit konfiguriert werden. Dieses Muster wird z. B. von TypeOrmModule, ConfigModule und JwtModule verwendet.',
          es: 'Los Dynamic Modules exponen métodos estáticos como forRoot(config) o forFeature(entity) que devuelven un objeto DynamicModule con una propiedad module y las mismas propiedades que @Module(). Esto permite configurar el módulo en el momento del import. Este patrón lo usan ampliamente TypeOrmModule, ConfigModule y JwtModule.',
          it: 'I Dynamic Modules espongono metodi statici come forRoot(config) o forFeature(entity) che restituiscono un oggetto DynamicModule con una proprietà module e le stesse proprietà di @Module(). In questo modo il module può essere configurato al momento dell’import. Questo pattern è usato estensivamente da TypeOrmModule, ConfigModule e JwtModule.',
        }),
        'e5100001-0000-4000-8001-000000000020',
      ]
    );

    // e5100001-0000-4000-8001-000000000021 - What is the @Global() decorator in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce que le decorator @Global() dans NestJS ?',
          de: 'Was macht der Decorator @Global() in NestJS?',
          es: '¿Qué es el decorador @Global() en NestJS?',
          it: 'Che cosa fa il decorator @Global() in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Rend un module disponible pour tous les autres modules sans avoir à l’importer dans chacun',
            'Rend un provider disponible automatiquement dans tous les scopes de requête',
            'Enregistre un Guard pour qu’il s’exécute sur toutes les routes globalement',
            'Rend une classe disponible comme singleton sur tous les processus Node.js',
          ],
          de: [
            'Macht ein Module für alle anderen Module verfügbar, ohne es überall importieren zu müssen',
            'Macht einen Provider automatisch in jedem Request-Scope verfügbar',
            'Registriert einen Guard, der global auf allen Routen ausgeführt wird',
            'Macht eine Klasse als Singleton über alle Node.js-Prozesse hinweg verfügbar',
          ],
          es: [
            'Hace que un module esté disponible para todos los demás modules sin necesidad de importarlo en cada uno',
            'Hace que un provider esté disponible automáticamente en todos los scopes de petición',
            'Registra un Guard para que se ejecute de forma global en todas las rutas',
            'Hace que una clase esté disponible como singleton en todos los procesos de Node.js',
          ],
          it: [
            'Rende un module disponibile a tutti gli altri modules senza doverlo importare in ognuno',
            'Rende un provider disponibile automaticamente in tutti i request scope',
            'Registra un Guard perché venga eseguito globalmente su tutte le route',
            'Rende una classe disponibile come singleton su tutti i processi Node.js',
          ],
        }),
        JSON.stringify({
          fr: 'Décorer un module avec @Global() rend tous ses providers exportés disponibles partout dans l’application sans avoir à importer explicitement le module dans chaque feature module. C’est utile pour des modules utilitaires comme ConfigModule ou LoggerModule. Un usage excessif de @Global() nuit cependant à la modularité.',
          de: 'Ein mit @Global() dekoriertes Module macht alle exportierten Provider in der gesamten Anwendung verfügbar, ohne dass das Module in jedem Feature-Modul importiert werden muss. Das ist nützlich für Utility-Module wie ConfigModule oder LoggerModule. Zu viel Einsatz von @Global() kann allerdings die Modularität beeinträchtigen.',
          es: 'Decorar un module con @Global() hace que todos sus providers exportados estén disponibles en toda la aplicación sin tener que importar explícitamente el module en cada módulo de funcionalidad. Es útil para módulos utilitarios como ConfigModule o LoggerModule. Sin embargo, abusar de @Global() reduce la modularidad.',
          it: 'Decorare un module con @Global() rende tutti i suoi providers esportati disponibili ovunque nell’applicazione senza dover importare esplicitamente il module in ogni feature module. È utile per moduli di utilità come ConfigModule o LoggerModule, ma un uso eccessivo di @Global() riduce la modularità.',
        }),
        'e5100001-0000-4000-8001-000000000021',
      ]
    );

    // e5100001-0000-4000-8001-000000000022 - What is the Reflector in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce que le Reflector dans NestJS ?',
          de: 'Was ist der Reflector in NestJS?',
          es: '¿Qué es el Reflector en NestJS?',
          it: 'Che cos’è il Reflector in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un utilitaire de débogage qui reflète le graphe de dépendances des modules',
            'Un service helper utilisé dans les Guards et Interceptors pour lire les métadonnées personnalisées définies par des decorators sur les routes ou les controllers',
            'Une classe qui reflète les types TypeScript à l’exécution',
            'Un Interceptor qui renvoie la réponse telle quelle au client',
          ],
          de: [
            'Ein Debugging-Werkzeug, das den Modul-Abhängigkeitsgraphen visualisiert',
            'Ein Hilfsservice, der in Guards und Interceptors verwendet wird, um benutzerdefinierte Metadaten zu lesen, die durch Decorators auf Routen oder Controllern gesetzt wurden',
            'Eine Klasse, die TypeScript-Typen zur Laufzeit reflektiert',
            'Ein Interceptor, der die Response unverändert an den Client zurückspielt',
          ],
          es: [
            'Una utilidad de depuración que refleja el grafo de dependencias de los modules',
            'Un servicio helper que se usa en Guards e Interceptors para leer metadatos personalizados definidos por decorators en rutas o controllers',
            'Una clase que refleja tipos de TypeScript en tiempo de ejecución',
            'Un Interceptor que devuelve la respuesta tal cual al cliente',
          ],
          it: [
            'Uno strumento di debug che riflette il grafo delle dipendenze dei modules',
            'Un service helper usato dentro Guards e Interceptors per leggere le metadati personalizzate impostate da decorators su route o controller',
            'Una classe che riflette i tipi TypeScript a runtime',
            'Un Interceptor che rimanda la risposta al client così com’è',
          ],
        }),
        JSON.stringify({
          fr: 'Reflector est une classe utilitaire fournie par NestJS pour lire les métadonnées attachées aux classes ou méthodes via @SetMetadata() ou des decorators personnalisés. Dans un Guard, on appelle par exemple reflector.get("roles", context.getHandler()) pour lire les rôles requis d’une route et les comparer aux rôles de l’utilisateur authentifié.',
          de: 'Der Reflector ist eine von NestJS bereitgestellte Hilfsklasse, um Metadaten auszulesen, die über @SetMetadata() oder benutzerdefinierte Decorators an Klassen oder Methoden angebracht wurden. In einem Guard ruft man etwa reflector.get("roles", context.getHandler()) auf, um die für eine Route erforderlichen Rollen zu lesen und mit den Rollen des authentifizierten Benutzers zu vergleichen.',
          es: 'Reflector es una clase de ayuda que proporciona NestJS para leer metadatos adjuntos a clases o métodos mediante @SetMetadata() o decoradores personalizados. En un Guard se suele llamar a reflector.get("roles", context.getHandler()) para leer los roles requeridos de una ruta y compararlos con los roles del usuario autenticado.',
          it: 'Reflector è una classe di utilità fornita da NestJS per leggere le metadati associate a classi o metodi tramite @SetMetadata() o decorators personalizzati. In un Guard si chiama ad esempio reflector.get("roles", context.getHandler()) per leggere i ruoli richiesti da una route e confrontarli con i ruoli dell’utente autenticato.',
        }),
        'e5100001-0000-4000-8001-000000000022',
      ]
    );

    // e5100001-0000-4000-8001-000000000023 - Difference between singleton, request, and transient scope in NestJS providers
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Quelle est la différence entre les scopes singleton, request et transient pour les providers NestJS ?',
          de: 'Was ist der Unterschied zwischen singleton-, request- und transient-Scope bei NestJS-Providern?',
          es: '¿Cuál es la diferencia entre los scopes singleton, request y transient en los providers de NestJS?',
          it: 'Qual è la differenza tra gli scope singleton, request e transient nei provider di NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Ils diffèrent uniquement par le module dans lequel le provider est enregistré (module, global, feature)',
            'Singleton : une instance partagée dans toute l’appli ; Request : une nouvelle instance par requête HTTP ; Transient : une nouvelle instance à chaque injection',
            'Singleton s’exécute une fois ; Request s’exécute par paramètre de query ; Transient s’exécute à chaque milliseconde',
            'Ils contrôlent si un provider est chargé en lazy, en eager ou en streaming',
          ],
          de: [
            'Sie unterscheiden sich nur darin, in welchem Module der Provider registriert ist (module, global, feature)',
            'Singleton: eine Instanz für die gesamte App; Request: eine neue Instanz pro HTTP-Request; Transient: eine neue Instanz bei jeder Injection',
            'Singleton läuft einmal; Request läuft pro Query-Parameter; Transient läuft jede Millisekunde',
            'Sie steuern, ob ein Provider lazy, eager oder gestreamt geladen wird',
          ],
          es: [
            'Solo se diferencian en el module donde se registra el provider (module, global, feature)',
            'Singleton: una instancia compartida en toda la app; Request: una instancia nueva por petición HTTP; Transient: una instancia nueva cada vez que se inyecta',
            'Singleton se ejecuta una vez; Request se ejecuta por parámetro de query; Transient se ejecuta cada milisegundo',
            'Controlan si un provider se carga en lazy, eager o en streaming',
          ],
          it: [
            'Differiscono solo per il module in cui il provider è registrato (module, global, feature)',
            'Singleton: un’istanza condivisa in tutta l’app; Request: una nuova istanza per ogni richiesta HTTP; Transient: una nuova istanza a ogni injection',
            'Singleton viene eseguito una volta; Request per ogni parametro di query; Transient ogni millisecondo',
            'Controllano se un provider è caricato in lazy, eager o in streaming',
          ],
        }),
        JSON.stringify({
          fr: 'Les providers NestJS disposent de trois scopes : DEFAULT (singleton) — une seule instance pour toute la durée de vie de l’application ; REQUEST — une nouvelle instance créée pour chaque requête HTTP ; TRANSIENT — une nouvelle instance créée à chaque fois qu’elle est injectée. Le singleton est le plus courant et le plus performant. Les scopes non singletons « remontent » : si un singleton injecte un provider request-scoped, il devient lui-même request-scoped.',
          de: 'NestJS-Provider haben drei Scopes: DEFAULT (singleton) — eine Instanz für die gesamte Lebensdauer der Anwendung; REQUEST — eine neue Instanz pro HTTP-Request; TRANSIENT — eine neue Instanz bei jeder Injection. Singleton ist der Standard und in der Regel am performantesten. Nicht-Singleton-Scopes „blasen sich nach oben“: Wenn ein Singleton einen request-scoped Provider injiziert, wird auch er request-scoped.',
          es: 'Los providers de NestJS tienen tres scopes: DEFAULT (singleton): una sola instancia para todo el ciclo de vida de la aplicación; REQUEST: una nueva instancia por cada petición HTTP; TRANSIENT: una nueva instancia cada vez que se inyecta. Singleton es el valor por defecto y suele ser el más eficiente. Los scopes no singleton se “propagan”: si un singleton inyecta un provider con scope request, él mismo pasa a ser request-scoped.',
          it: 'I provider di NestJS hanno tre scope: DEFAULT (singleton) — un’unica istanza per tutta la vita dell’applicazione; REQUEST — una nuova istanza per ogni richiesta HTTP; TRANSIENT — una nuova istanza ogni volta che viene iniettata. Lo scope singleton è quello predefinito e in genere il più performante. Gli scope non singleton si propagano: se un singleton inietta un provider con scope request, diventa a sua volta request-scoped.',
        }),
        'e5100001-0000-4000-8001-000000000023',
      ]
    );

    // e5100001-0000-4000-8001-000000000024 - What is ConfigModule in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce que ConfigModule dans NestJS ?',
          de: 'Was ist ConfigModule in NestJS?',
          es: '¿Qué es ConfigModule en NestJS?',
          it: 'Che cos’è ConfigModule in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un module intégré qui génère automatiquement le fichier de configuration de l’application',
            'Un module officiel @nestjs/config qui charge les variables d’environnement depuis les fichiers .env et les rend injectables via ConfigService',
            'Un module qui valide la configuration des controllers au démarrage',
            'Un outil CLI pour gérer la configuration d’un projet NestJS',
          ],
          de: [
            'Ein eingebautes Module, das automatisch die Konfigurationsdatei der Anwendung erzeugt',
            'Ein offizielles @nestjs/config-Module, das Umgebungsvariablen aus .env-Dateien lädt und sie über ConfigService injizierbar macht',
            'Ein Module, das Controller-Konfigurationen beim Start validiert',
            'Ein CLI-Tool zur Verwaltung der Konfiguration eines NestJS-Projekts',
          ],
          es: [
            'Un module integrado que genera automáticamente el archivo de configuración de la aplicación',
            'Un module oficial @nestjs/config que carga variables de entorno desde archivos .env y las hace inyectables mediante ConfigService',
            'Un module que valida la configuración de los controllers en el arranque',
            'Una herramienta de CLI para gestionar la configuración de un proyecto NestJS',
          ],
          it: [
            'Un module integrato che genera automaticamente il file di configurazione dell’applicazione',
            'Un module ufficiale @nestjs/config che carica le variabili di ambiente dai file .env e le rende iniettabili tramite ConfigService',
            'Un module che valida la configurazione dei controller all’avvio',
            'Uno strumento CLI per gestire la configurazione di un progetto NestJS',
          ],
        }),
        JSON.stringify({
          fr: '@nestjs/config fournit ConfigModule.forRoot() qui charge les fichiers .env via dotenv et enregistre ConfigService. Vous pouvez injecter ConfigService dans vos providers et appeler configService.get("DATABASE_URL") pour accéder à des variables d’environnement typées. Il prend aussi en charge la validation de schéma via Joi ou class-validator pour échouer rapidement au démarrage si des variables requises manquent.',
          de: '@nestjs/config stellt ConfigModule.forRoot() bereit, das .env-Dateien mit dotenv lädt und ConfigService registriert. Sie injizieren ConfigService in Provider und rufen configService.get("DATABASE_URL") auf, um typisierte Umgebungsvariablen zu lesen. Zudem unterstützt es Schema-Validierung mit Joi oder class-validator, um beim Start fehlende Pflichtvariablen frühzeitig zu erkennen.',
          es: '@nestjs/config proporciona ConfigModule.forRoot(), que carga archivos .env mediante dotenv y registra ConfigService. Puedes inyectar ConfigService en tus providers y llamar a configService.get("DATABASE_URL") para acceder a variables de entorno tipadas. También admite validación de esquema con Joi o class-validator para fallar pronto al arrancar si faltan variables obligatorias.',
          it: '@nestjs/config fornisce ConfigModule.forRoot(), che carica i file .env tramite dotenv e registra ConfigService. Puoi iniettare ConfigService nei provider e chiamare configService.get("DATABASE_URL") per accedere alle variabili di ambiente tipizzate. Supporta inoltre la validazione dello schema con Joi o class-validator per far fallire l’avvio in modo esplicito se mancano variabili richieste.',
        }),
        'e5100001-0000-4000-8001-000000000024',
      ]
    );

    // e5100001-0000-4000-8001-000000000025 - What is a custom decorator in NestJS and how do you create one?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce qu’un custom decorator dans NestJS et comment en créer un ?',
          de: 'Was ist ein custom decorator in NestJS und wie erstellt man ihn?',
          es: '¿Qué es un custom decorator en NestJS y cómo se crea?',
          it: 'Che cos’è un custom decorator in NestJS e come se ne crea uno?',
        }),
        JSON.stringify({
          fr: [
            'Un type utilitaire TypeScript créé avec le mot-clé type',
            'Une fonction créée avec createParamDecorator() ou SetMetadata() qui peut extraire des données de requête ou attacher des métadonnées aux routes et controllers',
            'Un class decorator généré par la CLI NestJS',
            'Un decorator issu de @angular/core réutilisé côté backend',
          ],
          de: [
            'Ein TypeScript-Utility-Typ, der mit dem Schlüsselwort type erstellt wird',
            'Eine Funktion, die mit createParamDecorator() oder SetMetadata() erstellt wird und Request-Daten extrahieren oder Metadaten an Routen und Controller anhängen kann',
            'Ein von der NestJS-CLI generierter Klassen-Decorator',
            'Ein Decorator aus @angular/core, der im Backend wiederverwendet wird',
          ],
          es: [
            'Un tipo utilitario de TypeScript creado con la palabra clave type',
            'Una función creada con createParamDecorator() o SetMetadata() que puede extraer datos de la petición o adjuntar metadatos a rutas y controllers',
            'Un class decorator generado por la CLI de NestJS',
            'Un decorador de @angular/core reutilizado en el backend',
          ],
          it: [
            'Un tipo di utilità TypeScript creato con la parola chiave type',
            'Una funzione creata con createParamDecorator() o SetMetadata() che può estrarre dati dalla richiesta o aggiungere metadati a route e controller',
            'Un class decorator generato dalla CLI di NestJS',
            'Un decorator di @angular/core riutilizzato sul backend',
          ],
        }),
        JSON.stringify({
          fr: 'Les custom decorators de paramètre utilisent createParamDecorator((data, ctx) => { ... }) pour extraire des données de la requête (par exemple @CurrentUser() qui lit req.user). Les decorators de métadonnées utilisent SetMetadata("key", value) encapsulé dans une fonction (par exemple @Roles("admin")). Le Reflector lit ensuite ces métadonnées dans les Guards ou Interceptors.',
          de: 'Custom Decorators für Parameter verwenden createParamDecorator((data, ctx) => { ... }), um Daten aus der Request zu extrahieren (z. B. @CurrentUser(), das req.user liest). Metadaten-Decorators nutzen SetMetadata("key", value) in einer Wrapper-Funktion (z. B. @Roles("admin")). Der Reflector liest diese Metadaten dann in Guards oder Interceptors aus.',
          es: 'Los custom decorators de parámetro usan createParamDecorator((data, ctx) => { ... }) para extraer datos de la petición (por ejemplo @CurrentUser() que lee req.user). Los decoradores de metadatos usan SetMetadata("key", value) envuelto en una función (por ejemplo @Roles("admin")). El Reflector lee después esos metadatos en Guards o Interceptors.',
          it: 'I custom decorator di parametro usano createParamDecorator((data, ctx) => { ... }) per estrarre dati dalla richiesta (per esempio @CurrentUser() che legge req.user). I decorator di metadati usano SetMetadata("key", value) incapsulato in una funzione (ad esempio @Roles("admin")). Il Reflector legge poi queste metadati nei Guards o negli Interceptors.',
        }),
        'e5100001-0000-4000-8001-000000000025',
      ]
    );

    // e5100001-0000-4000-8001-000000000026 - How do you handle circular dependencies between NestJS modules?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Comment gérer les circular dependencies entre modules NestJS ?',
          de: 'Wie behandelt man circular dependencies zwischen NestJS-Modulen?',
          es: '¿Cómo manejar las circular dependencies entre módulos de NestJS?',
          it: 'Come si gestiscono le circular dependencies tra moduli NestJS?',
        }),
        JSON.stringify({
          fr: [
            'En ajoutant un decorator @NoCircular() sur les deux modules',
            'En utilisant forwardRef() dans le tableau imports de chaque module et dans l’injection de constructeur via @Inject(forwardRef(() => ServiceB))',
            'En convertissant l’un des modules en module global avec @Global()',
            'En fusionnant les deux modules en un seul module',
          ],
          de: [
            'Durch Hinzufügen eines @NoCircular()-Decorators auf beide Module',
            'Durch die Verwendung von forwardRef() im imports-Array beider Module und in der Konstruktorinjektion über @Inject(forwardRef(() => ServiceB))',
            'Durch Umwandeln eines Moduls in ein globales Module mit @Global()',
            'Durch Zusammenführen beider Module zu einem einzigen Module',
          ],
          es: [
            'Añadiendo un decorador @NoCircular() a ambos módulos',
            'Usando forwardRef() en el array imports de cada módulo y en la inyección de constructor mediante @Inject(forwardRef(() => ServiceB))',
            'Convirtiendo uno de los módulos en un módulo global con @Global()',
            'Uniendo ambos módulos en un solo módulo',
          ],
          it: [
            'Aggiungendo un decorator @NoCircular() ad entrambi i moduli',
            'Usando forwardRef() nell’array imports di ciascun module e nell’iniezione del costruttore tramite @Inject(forwardRef(() => ServiceB))',
            'Convertendo uno dei moduli in un module globale con @Global()',
            'Fondendo i due moduli in un unico module',
          ],
        }),
        JSON.stringify({
          fr: 'Lorsque le module A importe le module B et que le module B importe le module A, NestJS rencontre une circular dependency. La solution consiste à utiliser forwardRef(() => ModuleB) dans imports de chaque module. Au niveau des services, l’injection par constructeur requiert aussi @Inject(forwardRef(() => ServiceB)) private serviceB: ServiceB. Les circular dependencies sont un code smell — idéalement, extraire la logique partagée dans un troisième module.',
          de: 'Wenn Module A Module B importiert und Module B wiederum Module A importiert, entsteht in NestJS eine circular dependency. Die Lösung ist forwardRef(() => ModuleB) im imports-Array beider Module zu verwenden. Auf Service-Ebene benötigt die Konstruktorinjektion ebenfalls @Inject(forwardRef(() => ServiceB)) private serviceB: ServiceB. Circular dependencies sind ein Code-Smell – besser ist es, die gemeinsame Logik in ein drittes Module auszulagern.',
          es: 'Cuando el módulo A importa el módulo B y el módulo B importa el módulo A, NestJS se encuentra con una circular dependency. La solución es usar forwardRef(() => ModuleB) en el array imports de cada módulo. A nivel de servicios, la inyección por constructor también requiere @Inject(forwardRef(() => ServiceB)) private serviceB: ServiceB. Las circular dependencies son un code smell; idealmente hay que extraer la lógica compartida a un tercer módulo.',
          it: 'Quando il module A importa il module B e il module B importa il module A, NestJS ha una circular dependency. La soluzione è usare forwardRef(() => ModuleB) nell’array imports di entrambi i modules. A livello di service, anche l’iniezione nel costruttore richiede @Inject(forwardRef(() => ServiceB)) private serviceB: ServiceB. Le circular dependencies sono un code smell: in genere conviene estrarre la logica condivisa in un terzo module.',
        }),
        'e5100001-0000-4000-8001-000000000026',
      ]
    );

    // e5100001-0000-4000-8001-000000000027 - What are async providers in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Que sont les async providers dans NestJS ?',
          de: 'Was sind async providers in NestJS?',
          es: '¿Qué son los async providers en NestJS?',
          it: 'Cosa sono gli async providers in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Des providers qui enveloppent automatiquement leurs méthodes dans des fonctions async',
            'Des providers enregistrés avec useFactory et une fonction de factory async, ce qui permet au conteneur DI d’attendre les opérations asynchrones (par exemple une connexion BD) avant de démarrer l’application',
            'Des providers qui s’exécutent dans un worker thread séparé',
            'Des providers initialisés en lazy uniquement lors de la première utilisation',
          ],
          de: [
            'Provider, deren Methoden automatisch in async-Funktionen verpackt werden',
            'Provider, die mit useFactory und einer async-Factory-Funktion registriert werden, sodass der DI-Container asynchrone Operationen (z. B. DB-Verbindung) abwartet, bevor die App startet',
            'Provider, die in einem separaten Worker-Thread laufen',
            'Provider, die erst beim ersten Zugriff lazy initialisiert werden',
          ],
          es: [
            'Providers que envuelven automáticamente sus métodos en funciones async',
            'Providers registrados con useFactory y una función de fábrica async, lo que permite que el contenedor de DI espere a operaciones asíncronas (por ejemplo la conexión a la BD) antes de arrancar la aplicación',
            'Providers que se ejecutan en un worker thread separado',
            'Providers que se inicializan en lazy solo en el primer uso',
          ],
          it: [
            'Provider che incapsulano automaticamente i loro metodi in funzioni async',
            'Provider registrati con useFactory e una funzione di factory async, così che il contenitore DI possa attendere le operazioni asincrone (ad esempio la connessione al DB) prima di avviare l’applicazione',
            'Provider che girano in un worker thread separato',
            'Provider inizializzati in lazy solo al primo utilizzo',
          ],
        }),
        JSON.stringify({
          fr: 'Les async providers utilisent useFactory: async (...deps) => { ... } dans leur définition. La factory peut être async et NestJS attend sa résolution avant de démarrer l’application. C’est utile pour les providers qui dépendent d’une opération asynchrone d’initialisation (connexion à une base de données, lecture d’un secret dans un vault, etc.).',
          de: 'Async Provider verwenden useFactory: async (...deps) => { ... } in ihrer Definition. Die Factory-Funktion kann async sein und NestJS wartet ihre Ausführung ab, bevor die Anwendung startet. Das ist nützlich für Provider, die eine asynchrone Initialisierung benötigen (z. B. Aufbau einer Datenbankverbindung oder Laden eines Secrets aus einem Vault).',
          es: 'Los async providers usan useFactory: async (...deps) => { ... } en su definición. La función de fábrica puede ser async y NestJS espera a que termine antes de arrancar la aplicación. Es útil para providers que dependen de una operación de inicialización asíncrona (conexión a una base de datos, lectura de un secreto de un vault, etc.).',
          it: 'Gli async providers usano useFactory: async (...deps) => { ... } nella loro definizione. La factory può essere async e NestJS ne attende il completamento prima di avviare l’applicazione. È utile per provider che dipendono da un’operazione asincrona di inizializzazione (connessione al database, lettura di un secret da un vault, ecc.).',
        }),
        'e5100001-0000-4000-8001-000000000027',
      ]
    );

    // e5100001-0000-4000-8001-000000000028 - What is CQRS in the context of NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce que CQRS dans le contexte de NestJS ?',
          de: 'Was ist CQRS im Kontext von NestJS?',
          es: '¿Qué es CQRS en el contexto de NestJS?',
          it: 'Che cos’è CQRS nel contesto di NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Une stratégie de résolution de sélecteurs CSS utilisée dans les apps frontend NestJS',
            'Un pattern qui sépare les opérations de lecture (Query) des opérations d’écriture (Command), implémenté dans NestJS via le package @nestjs/cqrs avec des handlers de commandes/requêtes et un event bus',
            'Un pattern de base de données qui utilise deux réplicas (une pour les lectures, une pour les écritures)',
            'Une stratégie de cache HTTP NestJS (Cache Query Result Strategy)',
          ],
          de: [
            'Eine Strategie zur Auflösung von CSS-Selektoren in NestJS-Frontend-Apps',
            'Ein Pattern, das Leseoperationen (Query) von Schreiboperationen (Command) trennt und in NestJS über das Package @nestjs/cqrs mit Command-/Query-Handlern und EventBus umgesetzt wird',
            'Ein Datenbank-Pattern mit zwei Replikaten (eines für Reads, eines für Writes)',
            'Eine HTTP-Caching-Strategie in NestJS (Cache Query Result Strategy)',
          ],
          es: [
            'Una estrategia de resolución de selectores CSS usada en apps frontend de NestJS',
            'Un patrón que separa las operaciones de lectura (Query) de las de escritura (Command), implementado en NestJS mediante el paquete @nestjs/cqrs con handlers de comandos/consultas y un event bus',
            'Un patrón de base de datos con dos réplicas (una para lecturas y otra para escrituras)',
            'Una estrategia de caché HTTP de NestJS (Cache Query Result Strategy)',
          ],
          it: [
            'Una strategia di risoluzione dei selettori CSS usata nelle app frontend NestJS',
            'Un pattern che separa le operazioni di lettura (Query) da quelle di scrittura (Command), implementato in NestJS tramite il package @nestjs/cqrs con command/query handler e un event bus',
            'Un pattern di database con due repliche (una per le letture e una per le scritture)',
            'Una strategia di cache HTTP di NestJS (Cache Query Result Strategy)',
          ],
        }),
        JSON.stringify({
          fr: 'CQRS (Command Query Responsibility Segregation) sépare le modèle de lecture (Queries) du modèle d’écriture (Commands). @nestjs/cqrs fournit CommandBus, QueryBus, EventBus ainsi que les decorators @CommandHandler, @QueryHandler et @EventsHandler. Ce pattern facilite l’évolution de domaines complexes en gardant des modèles de lecture et d’écriture indépendants.',
          de: 'CQRS (Command Query Responsibility Segregation) trennt das Modell zum Lesen von Daten (Queries) vom Modell zum Schreiben von Daten (Commands). @nestjs/cqrs stellt CommandBus, QueryBus, EventBus sowie die Decorators @CommandHandler, @QueryHandler und @EventsHandler bereit. Dieses Pattern unterstützt komplexe Domänen, indem es Lese- und Schreibmodelle unabhängig hält.',
          es: 'CQRS (Command Query Responsibility Segregation) separa el modelo de lectura de datos (Queries) del modelo de escritura (Commands). @nestjs/cqrs proporciona CommandBus, QueryBus, EventBus y los decoradores @CommandHandler, @QueryHandler y @EventsHandler. Este patrón ayuda a escalar dominios complejos manteniendo separados los modelos de lectura y escritura.',
          it: 'CQRS (Command Query Responsibility Segregation) separa il modello di lettura dei dati (Queries) da quello di scrittura (Commands). @nestjs/cqrs mette a disposizione CommandBus, QueryBus, EventBus e i decorator @CommandHandler, @QueryHandler e @EventsHandler. Questo pattern aiuta a scalare domini complessi mantenendo indipendenti i modelli di lettura e scrittura.',
        }),
        'e5100001-0000-4000-8001-000000000028',
      ]
    );

    // e5100001-0000-4000-8001-000000000029 - What are microservices in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Que sont les microservices dans NestJS ?',
          de: 'Was sind microservices in NestJS?',
          es: '¿Qué son los microservices en NestJS?',
          it: 'Cosa sono i microservices in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'De petites classes utilitaires qui gèrent une seule préoccupation métier',
            'Des applications NestJS déployables indépendamment qui communiquent via une couche de transport (TCP, Redis, NATS, Kafka, RabbitMQ, gRPC) en utilisant @nestjs/microservices',
            'Des modules NestJS contenant moins de cinq providers',
            'Un pattern pour scinder un seul module en plusieurs controllers',
          ],
          de: [
            'Kleine Utility-Klassen, die genau ein Business-Problem lösen',
            'Unabhängig deploybare NestJS-Anwendungen, die über eine Transportebene (TCP, Redis, NATS, Kafka, RabbitMQ, gRPC) mit @nestjs/microservices kommunizieren',
            'NestJS-Module mit weniger als fünf Providern',
            'Ein Pattern, um ein einzelnes Module in mehrere Controller aufzuteilen',
          ],
          es: [
            'Pequeñas clases utilitarias que manejan una sola preocupación de negocio',
            'Aplicaciones NestJS desplegables de forma independiente que se comunican a través de una capa de transporte (TCP, Redis, NATS, Kafka, RabbitMQ, gRPC) usando @nestjs/microservices',
            'Módulos de NestJS con menos de cinco providers',
            'Un patrón para dividir un único módulo en varios controllers',
          ],
          it: [
            'Piccole classi di utilità che gestiscono un solo aspetto di business',
            'Applicazioni NestJS distribuite in modo indipendente che comunicano tramite un livello di trasporto (TCP, Redis, NATS, Kafka, RabbitMQ, gRPC) usando @nestjs/microservices',
            'Moduli NestJS con meno di cinque provider',
            'Un pattern per dividere un singolo module in più controller',
          ],
        }),
        JSON.stringify({
          fr: 'Les microservices NestJS utilisent le package @nestjs/microservices avec des transports comme TCP, Redis, NATS, Kafka ou gRPC. Un microservice se crée avec NestFactory.createMicroservice(AppModule, options). La communication repose sur des message patterns (@MessagePattern) et des event patterns (@EventPattern), et les services clients utilisent ClientProxy (via ClientsModule) pour envoyer des messages entre services.',
          de: 'Microservices in NestJS verwenden das Package @nestjs/microservices mit Transporten wie TCP, Redis, NATS, Kafka oder gRPC. Ein Microservice wird mit NestFactory.createMicroservice(AppModule, options) erstellt. Die Kommunikation basiert auf Message-Patterns (@MessagePattern) und Event-Patterns (@EventPattern), während Clients über ClientProxy (via ClientsModule) Nachrichten zwischen Services senden.',
          es: 'Los microservices de NestJS usan el paquete @nestjs/microservices con transportes como TCP, Redis, NATS, Kafka o gRPC. Un microservicio se crea con NestFactory.createMicroservice(AppModule, options). La comunicación se basa en message patterns (@MessagePattern) y event patterns (@EventPattern), y los servicios clientes usan ClientProxy (a través de ClientsModule) para enviar mensajes entre servicios.',
          it: 'I microservices in NestJS usano il package @nestjs/microservices con trasporti come TCP, Redis, NATS, Kafka o gRPC. Un microservice si crea con NestFactory.createMicroservice(AppModule, options). La comunicazione si basa su message pattern (@MessagePattern) ed event pattern (@EventPattern), mentre i client usano ClientProxy (tramite ClientsModule) per inviare messaggi tra servizi.',
        }),
        'e5100001-0000-4000-8001-000000000029',
      ]
    );

    // e5100001-0000-4000-8001-000000000030 - What is a Hybrid Application in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce qu’une Hybrid Application dans NestJS ?',
          de: 'Was ist eine Hybrid Application in NestJS?',
          es: '¿Qué es una Hybrid Application en NestJS?',
          it: 'Che cos’è una Hybrid Application in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Une application qui s’exécute à la fois dans le navigateur et sur le serveur',
            'Une application NestJS qui agit à la fois comme serveur HTTP et comme listener microservice en même temps',
            'Une application construite à la fois avec NestJS et Express brut',
            'Un serveur qui expose à la fois des endpoints REST et GraphQL depuis le même module',
          ],
          de: [
            'Eine Anwendung, die sowohl im Browser als auch auf dem Server läuft',
            'Eine NestJS-Anwendung, die gleichzeitig als HTTP-Server und als Microservice-Listener fungiert',
            'Eine Anwendung, die sowohl mit NestJS als auch mit purem Express gebaut wurde',
            'Ein Server, der sowohl REST- als auch GraphQL-Endpunkte aus demselben Module bereitstellt',
          ],
          es: [
            'Una aplicación que se ejecuta tanto en el navegador como en el servidor',
            'Una aplicación de NestJS que actúa simultáneamente como servidor HTTP y como listener de microservice',
            'Una aplicación construida tanto con NestJS como con Express puro',
            'Un servidor que expone endpoints REST y GraphQL desde el mismo módulo',
          ],
          it: [
            'Un’applicazione che gira sia nel browser che sul server',
            'Un’applicazione NestJS che funge contemporaneamente da server HTTP e listener microservice',
            'Un’applicazione costruita sia con NestJS sia con Express puro',
            'Un server che espone endpoint REST e GraphQL dallo stesso module',
          ],
        }),
        JSON.stringify({
          fr: 'Une Hybrid Application utilise app.connectMicroservice(options) pour ajouter un ou plusieurs transports microservices en plus du serveur HTTP principal. Après avoir appelé await app.startAllMicroservices() puis await app.listen(3000), la même application gère à la fois les requêtes HTTP et les messages microservices.',
          de: 'Eine Hybrid Application nutzt app.connectMicroservice(options), um einen oder mehrere Microservice-Transporte zusätzlich zum HTTP-Server hinzuzufügen. Nach await app.startAllMicroservices() und await app.listen(3000) verarbeitet dieselbe Anwendung sowohl HTTP-Requests als auch Microservice-Nachrichten.',
          es: 'Una Hybrid Application usa app.connectMicroservice(options) para añadir uno o varios transportes de microservices además del servidor HTTP principal. Tras llamar a await app.startAllMicroservices() y luego await app.listen(3000), la misma aplicación maneja tanto peticiones HTTP como mensajes de microservices.',
          it: 'Una Hybrid Application usa app.connectMicroservice(options) per aggiungere uno o più trasporti microservices oltre al server HTTP principale. Dopo await app.startAllMicroservices() e await app.listen(3000), la stessa applicazione gestisce sia le richieste HTTP sia i messaggi microservices.',
        }),
        'e5100001-0000-4000-8001-000000000030',
      ]
    );

    // e5100001-0000-4000-8001-000000000031 - What is the onModuleInit lifecycle hook in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce que le lifecycle hook onModuleInit dans NestJS ?',
          de: 'Was ist der Lifecycle-Hook onModuleInit in NestJS?',
          es: '¿Qué es el lifecycle hook onModuleInit en NestJS?',
          it: 'Che cos’è il lifecycle hook onModuleInit in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un hook appelé lorsqu’un module est chargé en lazy',
            'Une interface dont la méthode onModuleInit() est appelée par NestJS après la résolution des dépendances du module hôte',
            'Un hook qui s’exécute après le démarrage du serveur HTTP',
            'Un lifecycle hook TypeORM pour l’initialisation d’entités',
          ],
          de: [
            'Ein Hook, der aufgerufen wird, wenn ein Module lazy geladen wird',
            'Ein Interface, dessen Methode onModuleInit() von NestJS aufgerufen wird, nachdem die Abhängigkeiten des Host-Moduls aufgelöst wurden',
            'Ein Hook, der nach dem Start des HTTP-Servers läuft',
            'Ein TypeORM-Lifecycle-Hook zur Initialisierung von Entities',
          ],
          es: [
            'Un hook que se llama cuando un módulo se carga en lazy',
            'Una interfaz cuya función onModuleInit() es llamada por NestJS después de resolver las dependencias del módulo anfitrión',
            'Un hook que se ejecuta después de que el servidor HTTP empieza a escuchar',
            'Un lifecycle hook de TypeORM para la inicialización de entidades',
          ],
          it: [
            'Un hook chiamato quando un module viene caricato in lazy',
            'Un’interfaccia la cui funzione onModuleInit() viene chiamata da NestJS dopo che le dipendenze del module host sono state risolte',
            'Un hook che viene eseguito dopo l’avvio del server HTTP',
            'Un lifecycle hook di TypeORM per l’inizializzazione delle entità',
          ],
        }),
        JSON.stringify({
          fr: 'En implémentant OnModuleInit et en définissant onModuleInit(), un provider peut exécuter une logique d’initialisation après que le conteneur DI a résolu toutes les dépendances du module, mais avant que l’application ne commence à traiter des requêtes. De la même façon, OnApplicationBootstrap s’exécute après l’initialisation de tous les modules et OnModuleDestroy/BeforeApplicationShutdown/OnApplicationShutdown gèrent le nettoyage.',
          de: 'Indem ein Provider OnModuleInit implementiert und onModuleInit() definiert, kann er Initialisierungslogik ausführen, nachdem der DI-Container alle Abhängigkeiten des Moduls gelöst hat, aber bevor die Anwendung Requests verarbeitet. Entsprechend läuft OnApplicationBootstrap nach der Initialisierung aller Module und OnModuleDestroy/BeforeApplicationShutdown/OnApplicationShutdown kümmern sich um das Aufräumen.',
          es: 'Al implementar OnModuleInit y definir onModuleInit(), un provider puede ejecutar lógica de inicialización después de que el contenedor de DI haya resuelto todas las dependencias del módulo, pero antes de que la aplicación empiece a procesar peticiones. De forma similar, OnApplicationBootstrap se ejecuta tras inicializar todos los módulos y OnModuleDestroy/BeforeApplicationShutdown/OnApplicationShutdown se encargan de la limpieza.',
          it: 'Implementando OnModuleInit e definendo onModuleInit(), un provider può eseguire logica di inizializzazione dopo che il contenitore DI ha risolto tutte le dipendenze del module, ma prima che l’applicazione inizi a gestire le richieste. Allo stesso modo, OnApplicationBootstrap viene eseguito dopo l’inizializzazione di tutti i modules e OnModuleDestroy/BeforeApplicationShutdown/OnApplicationShutdown gestiscono la fase di cleanup.',
        }),
        'e5100001-0000-4000-8001-000000000031',
      ]
    );

    // e5100001-0000-4000-8001-000000000032 - What is useFactory in NestJS custom providers?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce que useFactory dans les custom providers NestJS ?',
          de: 'Was ist useFactory bei NestJS-Custom-Providern?',
          es: '¿Qué es useFactory en los custom providers de NestJS?',
          it: 'Che cos’è useFactory nei custom provider di NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Une méthode sur NestFactory pour créer des applications avec une configuration personnalisée',
            'Une option d’enregistrement de provider qui utilise une fonction de factory pour produire la valeur fournie, avec éventuellement des dépendances injectées',
            'Un hook qui remplace useClass uniquement pour les async providers',
            'Une clé de configuration dans le decorator @Module()',
          ],
          de: [
            'Eine Methode auf NestFactory, um Anwendungen mit benutzerdefinierter Konfiguration zu erstellen',
            'Eine Provider-Registrierungsoption, die eine Factory-Funktion nutzt, um den Wert des Providers zu erzeugen, optional mit injizierten Abhängigkeiten',
            'Ein Hook, der useClass nur für async Provider ersetzt',
            'Ein Konfigurationsschlüssel im @Module()-Decorator',
          ],
          es: [
            'Un método de NestFactory para crear aplicaciones con configuración personalizada',
            'Una opción de registro de providers que utiliza una función de fábrica para producir el valor del provider, con dependencias inyectadas opcionales',
            'Un hook que sustituye a useClass solo para async providers',
            'Una clave de configuración en el decorador @Module()',
          ],
          it: [
            'Un metodo di NestFactory per creare applicazioni con configurazione personalizzata',
            'Un’opzione di registrazione dei provider che usa una funzione di factory per produrre il valore del provider, con eventuali dipendenze iniettate',
            'Un hook che sostituisce useClass solo per gli async providers',
            'Una chiave di configurazione nel decorator @Module()',
          ],
        }),
        JSON.stringify({
          fr: 'useFactory est une option de custom provider qui crée la valeur fournie via une fonction. Vous pouvez injecter d’autres providers en arguments : { provide: TOKEN, useFactory: (config: ConfigService) => new Client(config.get("URL")), inject: [ConfigService] }. La factory peut être async, ce qui offre plus de flexibilité que useClass quand la logique de construction est complexe.',
          de: 'useFactory ist eine Option für Custom Provider, bei der der bereitgestellte Wert über eine Funktion erzeugt wird. Andere Provider können als Argumente injiziert werden: { provide: TOKEN, useFactory: (config: ConfigService) => new Client(config.get("URL")), inject: [ConfigService] }. Die Factory kann async sein und ist flexibler als useClass, wenn die Konstruktionslogik komplex ist.',
          es: 'useFactory es una opción de custom provider que crea el valor proporcionado mediante una función. Puedes inyectar otros providers como argumentos: { provide: TOKEN, useFactory: (config: ConfigService) => new Client(config.get("URL")), inject: [ConfigService] }. La función puede ser async, lo que la hace más flexible que useClass cuando la lógica de construcción es compleja.',
          it: 'useFactory è un’opzione per i custom provider che crea il valore fornito tramite una funzione. È possibile iniettare altri provider come argomenti: { provide: TOKEN, useFactory: (config: ConfigService) => new Client(config.get("URL")), inject: [ConfigService] }. La factory può essere async ed è più flessibile di useClass quando la logica di costruzione è complessa.',
        }),
        'e5100001-0000-4000-8001-000000000032',
      ]
    );

    // e5100001-0000-4000-8001-000000000033 - How does NestJS integrate with TypeORM?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Comment NestJS s’intègre-t-il avec TypeORM ?',
          de: 'Wie integriert sich NestJS mit TypeORM?',
          es: '¿Cómo se integra NestJS con TypeORM?',
          it: 'Come si integra NestJS con TypeORM?',
        }),
        JSON.stringify({
          fr: [
            'En étendant la classe DataSource de TypeORM avec des decorators NestJS',
            'Via TypeOrmModule.forRoot() pour la configuration globale de la base de données et TypeOrmModule.forFeature([Entity]) pour enregistrer les entités et leurs repositories par module',
            'En générant les entités à partir du decorator @InjectEntity()',
            'En remplaçant le QueryRunner de TypeORM par un adaptateur spécifique NestJS',
          ],
          de: [
            'Durch Erweitern der TypeORM-DataSource-Klasse mit NestJS-Decorators',
            'Über TypeOrmModule.forRoot() für die globale DB-Konfiguration und TypeOrmModule.forFeature([Entity]) zur Registrierung von Entities und deren Repositories pro Module',
            'Durch Generieren von Entities aus dem Decorator @InjectEntity()',
            'Durch Ersetzen des TypeORM-QueryRunner durch einen NestJS-spezifischen Adapter',
          ],
          es: [
            'Extendiendo la clase DataSource de TypeORM con decoradores de NestJS',
            'A través de TypeOrmModule.forRoot() para la configuración global de BD y TypeOrmModule.forFeature([Entity]) para registrar entidades y sus repositories por módulo',
            'Generando las entidades a partir del decorador @InjectEntity()',
            'Reemplazando el QueryRunner de TypeORM por un adaptador específico de NestJS',
          ],
          it: [
            'Estendendo la classe DataSource di TypeORM con decorators NestJS',
            'Tramite TypeOrmModule.forRoot() per la configurazione globale del database e TypeOrmModule.forFeature([Entity]) per registrare le entità e i rispettivi repository per module',
            'Generando le entità a partire dal decorator @InjectEntity()',
            'Sostituendo il QueryRunner di TypeORM con un adattatore specifico NestJS',
          ],
        }),
        JSON.stringify({
          fr: 'TypeOrmModule.forRoot(config) dans AppModule établit la connexion à la base de données. Les feature modules utilisent TypeOrmModule.forFeature([User, Post]) pour enregistrer les entités, ce qui permet d’injecter @InjectRepository(User) private repo: Repository<User> dans les services. Le repository est un Repository<Entity> TypeORM qui fournit toutes les méthodes CRUD.',
          de: 'TypeOrmModule.forRoot(config) im AppModule stellt die Datenbankverbindung her. Feature-Module verwenden TypeOrmModule.forFeature([User, Post]), um Entities zu registrieren, sodass @InjectRepository(User) private repo: Repository<User> in Services injiziert werden kann. Das Repository ist ein TypeORM-Repository<Entity> mit allen CRUD-Methoden.',
          es: 'TypeOrmModule.forRoot(config) en AppModule establece la conexión con la base de datos. Los feature modules usan TypeOrmModule.forFeature([User, Post]) para registrar entidades, lo que permite inyectar @InjectRepository(User) private repo: Repository<User> en los servicios. El repository es un Repository<Entity> de TypeORM que ofrece todos los métodos CRUD.',
          it: 'TypeOrmModule.forRoot(config) in AppModule apre la connessione al database. I feature module usano TypeOrmModule.forFeature([User, Post]) per registrare le entità, permettendo di iniettare @InjectRepository(User) private repo: Repository<User> nei servizi. Il repository è un Repository<Entity> di TypeORM che fornisce tutti i metodi CRUD.',
        }),
        'e5100001-0000-4000-8001-000000000033',
      ]
    );

    // e5100001-0000-4000-8001-000000000034 - Difference between app.use() and NestJS middleware in terms of scope
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Quelle est la différence de scope entre app.use() et le middleware NestJS ?',
          de: 'Was ist der Unterschied im Scope zwischen app.use() und NestJS-Middleware?',
          es: '¿Cuál es la diferencia de scope entre app.use() y el middleware de NestJS?',
          it: 'Qual è la differenza di scope tra app.use() e il middleware NestJS?',
        }),
        JSON.stringify({
          fr: [
            'app.use() s’applique globalement à toutes les routes ; le middleware NestJS est toujours spécifique à une route',
            'app.use() applique un middleware Express globalement (en contournant la DI NestJS) ; le middleware NestJS via configure() est scoped par module et peut utiliser la DI',
            'Ils sont identiques — le middleware NestJS se compile en appels app.use()',
            'app.use() ne s’applique qu’aux requêtes GET ; le middleware NestJS s’applique à toutes les méthodes HTTP',
          ],
          de: [
            'app.use() gilt global für alle Routen; NestJS-Middleware ist immer routenspezifisch',
            'app.use() registriert eine Express-Middleware global (umgeht die NestJS-DI); NestJS-Middleware über configure() ist modulbezogen und kann DI nutzen',
            'Sie sind identisch – NestJS-Middleware kompiliert zu app.use()-Aufrufen',
            'app.use() wirkt nur auf GET-Requests; NestJS-Middleware wirkt auf alle HTTP-Methoden',
          ],
          es: [
            'app.use() se aplica globalmente a todas las rutas; el middleware de NestJS siempre es específico de ruta',
            'app.use() aplica un middleware de Express globalmente (saltándose la DI de NestJS); el middleware de NestJS registrado con configure() está scopeado por módulo y puede usar DI',
            'Son idénticos: el middleware de NestJS se compila en llamadas app.use()',
            'app.use() solo se aplica a peticiones GET; el middleware de NestJS se aplica a todos los métodos HTTP',
          ],
          it: [
            'app.use() si applica globalmente a tutte le route; il middleware NestJS è sempre specifico della route',
            'app.use() registra un middleware Express a livello globale (bypassando la DI di NestJS); il middleware NestJS tramite configure() è limitato al singolo module e può usare la DI',
            'Sono identici: il middleware NestJS viene compilato in chiamate app.use()',
            'app.use() si applica solo alle richieste GET; il middleware NestJS si applica a tutti i metodi HTTP',
          ],
        }),
        JSON.stringify({
          fr: 'Un appel direct à app.use(fn) sur l’instance d’application NestJS ajoute un middleware Express/Fastify brut globalement, en contournant le conteneur DI de NestJS. Enregistrer un middleware via configure(consumer: MiddlewareConsumer) dans un module qui implémente NestModule permet au middleware de profiter de la DI NestJS et de cibler des routes spécifiques avec forRoutes().',
          de: 'Ein direkter Aufruf von app.use(fn) auf der NestJS-Anwendung fügt eine rohe Express/Fastify-Middleware global hinzu und umgeht den NestJS-DI-Container. Die Registrierung von Middleware über configure(consumer: MiddlewareConsumer) in einem Modul, das NestModule implementiert, erlaubt es, die DI von NestJS zu nutzen und Middleware mit forRoutes() auf bestimmte Routen zu beschränken.',
          es: 'Una llamada directa a app.use(fn) sobre la instancia de aplicación de NestJS añade un middleware de Express/Fastify en bruto de forma global, saltándose el contenedor de DI de NestJS. Registrar middleware mediante configure(consumer: MiddlewareConsumer) en un módulo que implemente NestModule permite que ese middleware use la DI de NestJS y se limite a rutas concretas mediante forRoutes().',
          it: 'Una chiamata diretta a app.use(fn) sull’istanza di applicazione NestJS aggiunge un middleware Express/Fastify grezzo in modo globale, aggirando il contenitore DI di NestJS. Registrare il middleware tramite configure(consumer: MiddlewareConsumer) in un modulo che implementa NestModule permette al middleware di usare la DI di NestJS e di essere limitato a specifiche route tramite forRoutes().',
        }),
        'e5100001-0000-4000-8001-000000000034',
      ]
    );

    // e5100001-0000-4000-8001-000000000035 - What is WebSockets support in NestJS?
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' || $1::jsonb)), '{choices}', (data->'choices' || $2::jsonb)), '{explanation}', (data->'explanation' || $3::jsonb)) WHERE id = $4`,
      [
        JSON.stringify({
          fr: 'Qu’est-ce que le support WebSockets dans NestJS ?',
          de: 'Was bedeutet WebSockets-Support in NestJS?',
          es: '¿Qué es el soporte de WebSockets en NestJS?',
          it: 'Che cos’è il supporto WebSockets in NestJS?',
        }),
        JSON.stringify({
          fr: [
            'Un mécanisme HTTP upgrade intégré pour diffuser des réponses REST en streaming',
            'Un package @nestjs/websockets qui permet la communication bidirectionnelle temps réel via des classes @WebSocketGateway() gérant des événements @SubscribeMessage()',
            'Un polyfill WebSockets pour les environnements qui utilisent gRPC',
            'Un pattern pour partager l’état entre microservices au-dessus de connexions WebSocket',
          ],
          de: [
            'Ein integrierter HTTP-Upgrade-Mechanismus für gestreamte REST-Antworten',
            'Ein Package @nestjs/websockets, das bidirektionale Echtzeitkommunikation über @WebSocketGateway()-Klassen mit @SubscribeMessage()-Events ermöglicht',
            'Ein WebSocket-Polyfill für Umgebungen, die gRPC verwenden',
            'Ein Pattern, um Zustand zwischen microservices über WebSocket-Verbindungen zu teilen',
          ],
          es: [
            'Un mecanismo de HTTP upgrade integrado para enviar respuestas REST en streaming',
            'Un paquete @nestjs/websockets que habilita la comunicación bidireccional en tiempo real mediante clases @WebSocketGateway() que manejan eventos @SubscribeMessage()',
            'Un polyfill de WebSockets para entornos que utilizan gRPC',
            'Un patrón para compartir estado entre microservices a través de conexiones WebSocket',
          ],
          it: [
            'Un meccanismo di HTTP upgrade integrato per fare streaming delle risposte REST',
            'Un package @nestjs/websockets che abilita la comunicazione bidirezionale in tempo reale tramite classi @WebSocketGateway() che gestiscono eventi @SubscribeMessage()',
            'Un polyfill WebSockets per ambienti che usano gRPC',
            'Un pattern per condividere stato tra microservices su connessioni WebSocket',
          ],
        }),
        JSON.stringify({
          fr: 'NestJS prend en charge WebSockets via @WebSocketGateway(port?, options?). Une classe gateway gère les événements avec @SubscribeMessage("eventName") et peut émettre des messages en utilisant l’instance de serveur injectée par @WebSocketServer() ou via la valeur de retour. Les gateways s’intègrent au cycle de vie NestJS (les Guards, Interceptors et Pipes fonctionnent aussi avec les gateways) et peuvent être basés sur socket.io ou la librairie ws native.',
          de: 'NestJS unterstützt WebSockets über @WebSocketGateway(port?, options?). Eine Gateway-Klasse verarbeitet Events mit @SubscribeMessage("eventName") und kann Nachrichten über die per @WebSocketServer() injizierte Serverinstanz oder über den Rückgabewert senden. Gateways integrieren sich in den NestJS-Lifecycle (Guards, Interceptors und Pipes funktionieren auch dort) und können auf socket.io oder der nativen ws-Bibliothek basieren.',
          es: 'NestJS soporta WebSockets mediante @WebSocketGateway(port?, options?). Una clase gateway maneja eventos con @SubscribeMessage("eventName") y puede emitir mensajes usando la instancia de servidor inyectada con @WebSocketServer() o a través del valor devuelto. Los gateways se integran con el ciclo de vida de NestJS (Guards, Interceptors y Pipes también funcionan allí) y pueden basarse en socket.io o en la librería nativa ws.',
          it: 'NestJS supporta i WebSockets tramite @WebSocketGateway(port?, options?). Una classe gateway gestisce gli eventi con @SubscribeMessage("eventName") e può emettere messaggi usando l’istanza di server iniettata con @WebSocketServer() o tramite il valore restituito. I gateway si integrano con il ciclo di vita di NestJS (Guards, Interceptors e Pipes funzionano anche lì) e possono basarsi su socket.io o sulla libreria ws nativa.',
        }),
        'e5100001-0000-4000-8001-000000000035',
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE qcm_module SET label = label - 'fr' - 'de' - 'es' - 'it', description = description - 'fr' - 'de' - 'es' - 'it' WHERE id = $1`,
      ['e5100000-0000-4000-8000-000000000001']
    );
    await queryRunner.query(
      `UPDATE qcm_question SET data = jsonb_set(jsonb_set(jsonb_set(data, '{question}', (data->'question' - 'fr' - 'de' - 'es' - 'it')), '{choices}', (data->'choices' - 'fr' - 'de' - 'es' - 'it')), '{explanation}', (data->'explanation' - 'fr' - 'de' - 'es' - 'it')) WHERE moduleId = $1`,
      ['e5100000-0000-4000-8000-000000000001']
    );
  }
}
