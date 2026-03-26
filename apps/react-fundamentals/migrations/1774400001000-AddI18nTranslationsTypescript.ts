import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddI18nTranslationsTypescript1774400001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Module: TypeScript Definitions ──────────────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_module
      SET
        label = label || $1::jsonb,
        description = description || $2::jsonb
      WHERE id = $3
    `, [
      JSON.stringify({
        fr: 'Définitions TypeScript',
        de: 'TypeScript-Grundbegriffe',
        es: 'Definiciones de TypeScript',
        it: 'Definizioni TypeScript',
      }),
      JSON.stringify({
        fr: "Vocabulaire fondamental de TypeScript : qu'est-ce que TypeScript, alias de types, interfaces, unions, intersections, génériques, tuples, enums, types utilitaires, gardes de types, never, unknown, types mappés, types conditionnels et unions discriminées.",
        de: 'Grundlegendes TypeScript-Vokabular: Was ist TypeScript, Typ-Aliase, Interfaces, Unions, Intersections, Generics, Tupel, Enums, Utility-Typen, Type Guards, never, unknown, Mapped Types, Conditional Types und Discriminated Unions.',
        es: 'Vocabulario fundamental de TypeScript: qué es TypeScript, alias de tipos, interfaces, uniones, intersecciones, genéricos, tuplas, enums, tipos utilitarios, guardas de tipos, never, unknown, tipos mapeados, tipos condicionales y uniones discriminadas.',
        it: "Vocabolario fondamentale di TypeScript: cos'è TypeScript, alias di tipo, interfacce, unioni, intersezioni, generici, tuple, enum, tipi utilitari, guardie di tipo, never, unknown, tipi mappati, tipi condizionali e unioni discriminate.",
      }),
      '07000000-0000-4000-8000-000000000001',
    ]);

    // ── Q1: What is TypeScript? ────────────────────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce que TypeScript ?",
        de: 'Was ist TypeScript?',
        es: '¿Qué es TypeScript?',
        it: "Cos'è TypeScript?",
      }),
      JSON.stringify({
        fr: [
          'Un sur-ensemble de JavaScript qui ajoute un typage statique optionnel et se compile en JavaScript',
          "Un environnement d'exécution JavaScript basé sur V8",
          'Un préprocesseur CSS pour les feuilles de style typées',
          'Un framework JavaScript pour construire des interfaces utilisateur',
        ],
        de: [
          'Eine Obermenge von JavaScript mit optionaler statischer Typisierung, die zu JavaScript kompiliert wird',
          'Eine auf V8 basierende JavaScript-Laufzeitumgebung',
          'Ein CSS-Präprozessor für typisierte Stylesheets',
          'Ein JavaScript-Framework zum Erstellen von Benutzeroberflächen',
        ],
        es: [
          'Un superconjunto de JavaScript que añade tipado estático opcional y se compila a JavaScript',
          'Un entorno de ejecución de JavaScript basado en V8',
          'Un preprocesador CSS para hojas de estilo tipadas',
          'Un framework de JavaScript para construir interfaces de usuario',
        ],
        it: [
          'Un sovrainsieme di JavaScript che aggiunge la tipizzazione statica opzionale e si compila in JavaScript',
          'Un runtime JavaScript basato su V8',
          'Un preprocessore CSS per fogli di stile tipizzati',
          'Un framework JavaScript per costruire interfacce utente',
        ],
      }),
      JSON.stringify({
        fr: "TypeScript est un sur-ensemble de JavaScript à typage statique développé par Microsoft. Il ajoute des annotations de types optionnelles, des interfaces, des génériques et d'autres fonctionnalités qui se compilent en JavaScript simple, détectant les erreurs à la compilation plutôt qu'à l'exécution.",
        de: 'TypeScript ist eine statisch typisierte Obermenge von JavaScript, entwickelt von Microsoft. Es fügt optionale Typ-Annotationen, Interfaces, Generics und weitere Funktionen hinzu, die zu einfachem JavaScript kompiliert werden und Fehler zur Kompilierzeit statt zur Laufzeit erkennen.',
        es: 'TypeScript es un superconjunto de JavaScript con tipado estático desarrollado por Microsoft. Añade anotaciones de tipos opcionales, interfaces, genéricos y otras características que se compilan a JavaScript estándar, detectando errores en tiempo de compilación en lugar de en tiempo de ejecución.',
        it: 'TypeScript è un sovrainsieme di JavaScript a tipizzazione statica sviluppato da Microsoft. Aggiunge annotazioni di tipo opzionali, interfacce, generici e altre funzionalità che vengono compilate in JavaScript semplice, rilevando gli errori in fase di compilazione anziché a runtime.',
      }),
      '07000001-0000-4000-8001-000000000001',
    ]);

    // ── Q2: What is a type alias in TypeScript? ────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce qu'un alias de type en TypeScript ?",
        de: 'Was ist ein Typ-Alias in TypeScript?',
        es: '¿Qué es un alias de tipo en TypeScript?',
        it: "Cos'è un alias di tipo in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          "Un moyen de renommer une variable existante à l'exécution",
          "Un nom donné à n'importe quel type à l'aide du mot-clé `type`",
          'Un décorateur de classe TypeScript',
          'Un alias pour un prototype JavaScript',
        ],
        de: [
          'Eine Möglichkeit, eine bestehende Variable zur Laufzeit umzubenennen',
          'Ein Name, der einem beliebigen Typ mit dem Schlüsselwort `type` gegeben wird',
          'Ein TypeScript-Klassen-Dekorator',
          'Ein Alias für einen JavaScript-Prototyp',
        ],
        es: [
          'Una forma de renombrar una variable existente en tiempo de ejecución',
          'Un nombre asignado a cualquier tipo mediante la palabra clave `type`',
          'Un decorador de clase de TypeScript',
          'Un alias para un prototipo de JavaScript',
        ],
        it: [
          'Un modo per rinominare una variabile esistente a runtime',
          'Un nome assegnato a qualsiasi tipo tramite la parola chiave `type`',
          'Un decoratore di classe TypeScript',
          'Un alias per un prototipo JavaScript',
        ],
      }),
      JSON.stringify({
        fr: "Un alias de type crée un nouveau nom pour n'importe quel type à l'aide du mot-clé `type`. Exemple : `type StringOrNumber = string | number`. Contrairement aux interfaces, les alias de types peuvent représenter des primitifs, des unions, des intersections, des tuples et tout autre type.",
        de: 'Ein Typ-Alias erstellt einen neuen Namen für einen beliebigen Typ mit dem Schlüsselwort `type`. Beispiel: `type StringOrNumber = string | number`. Im Gegensatz zu Interfaces können Typ-Aliase Primitive, Unions, Intersections, Tupel und jeden anderen Typ darstellen.',
        es: 'Un alias de tipo crea un nuevo nombre para cualquier tipo mediante la palabra clave `type`. Ejemplo: `type StringOrNumber = string | number`. A diferencia de las interfaces, los alias de tipo pueden representar primitivos, uniones, intersecciones, tuplas y cualquier otro tipo.',
        it: 'Un alias di tipo crea un nuovo nome per qualsiasi tipo tramite la parola chiave `type`. Esempio: `type StringOrNumber = string | number`. A differenza delle interfacce, gli alias di tipo possono rappresentare primitivi, unioni, intersezioni, tuple e qualsiasi altro tipo.',
      }),
      '07000001-0000-4000-8001-000000000002',
    ]);

    // ── Q3: What is an interface in TypeScript? ────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce qu'une interface en TypeScript ?",
        de: 'Was ist ein Interface in TypeScript?',
        es: '¿Qué es una interfaz en TypeScript?',
        it: "Cos'è un'interfaccia in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          'Une classe TypeScript contenant uniquement des méthodes abstraites',
          "Une description nommée de la forme (structure) d'un objet",
          'Une déclaration de fonction sans implémentation',
          'Une limite de module',
        ],
        de: [
          'Eine TypeScript-Klasse mit ausschließlich abstrakten Methoden',
          'Eine benannte Beschreibung der Form (Struktur) eines Objekts',
          'Eine Funktionsdeklaration ohne Implementierung',
          'Eine Modulgrenze',
        ],
        es: [
          'Una clase TypeScript con solo métodos abstractos',
          'Una descripción con nombre de la forma (estructura) de un objeto',
          'Una declaración de función sin implementación',
          'Un límite de módulo',
        ],
        it: [
          'Una classe TypeScript con solo metodi astratti',
          'Una descrizione con nome della forma (struttura) di un oggetto',
          'Una dichiarazione di funzione senza implementazione',
          'Un confine di modulo',
        ],
      }),
      JSON.stringify({
        fr: "Une interface définit la forme d'un objet — ses propriétés requises et leurs types. Les interfaces supportent l'extension (`extends`), la fusion de déclarations et sont supprimées à l'exécution. Elles sont idéales pour décrire les contrats d'objets.",
        de: 'Ein Interface definiert die Form eines Objekts — seine erforderlichen Eigenschaften und deren Typen. Interfaces unterstützen Vererbung (`extends`), Declaration Merging und werden zur Laufzeit entfernt. Sie eignen sich ideal zur Beschreibung von Objekt-Verträgen.',
        es: 'Una interfaz define la forma de un objeto — sus propiedades requeridas y sus tipos. Las interfaces soportan extensión (`extends`), fusión de declaraciones y se eliminan en tiempo de ejecución. Son ideales para describir contratos de objetos.',
        it: "Un'interfaccia definisce la forma di un oggetto — le sue proprietà richieste e i relativi tipi. Le interfacce supportano l'estensione (`extends`), la fusione delle dichiarazioni e vengono eliminate a runtime. Sono ideali per descrivere i contratti degli oggetti.",
      }),
      '07000001-0000-4000-8001-000000000003',
    ]);

    // ── Q4: What is a union type in TypeScript? ────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce qu'un type union en TypeScript ?",
        de: 'Was ist ein Union-Typ in TypeScript?',
        es: '¿Qué es un tipo unión en TypeScript?',
        it: "Cos'è un tipo unione in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          'Un type qui exige tous les types spécifiés à la fois',
          "Un type qui permet à une valeur d'être l'un des types spécifiés",
          'Une déclaration de classe combinée',
          'Un moyen de fusionner deux modules',
        ],
        de: [
          'Ein Typ, der alle angegebenen Typen gleichzeitig erfordert',
          'Ein Typ, der es einem Wert erlaubt, einer von mehreren angegebenen Typen zu sein',
          'Eine kombinierte Klassendeklaration',
          'Eine Möglichkeit, zwei Module zusammenzuführen',
        ],
        es: [
          'Un tipo que requiere todos los tipos especificados a la vez',
          'Un tipo que permite que un valor sea uno de varios tipos especificados',
          'Una declaración de clase combinada',
          'Una forma de fusionar dos módulos',
        ],
        it: [
          'Un tipo che richiede tutti i tipi specificati contemporaneamente',
          'Un tipo che permette a un valore di essere uno dei tipi specificati',
          'Una dichiarazione di classe combinata',
          'Un modo per unire due moduli',
        ],
      }),
      JSON.stringify({
        fr: "Un type union (écrit avec `|`) signifie qu'une valeur peut être de type A OU de type B. Exemple : `string | number` accepte les chaînes de caractères et les nombres. TypeScript utilise les gardes de types pour affiner le type dans les blocs conditionnels.",
        de: 'Ein Union-Typ (geschrieben mit `|`) bedeutet, dass ein Wert vom Typ A ODER Typ B sein kann. Beispiel: `string | number` akzeptiert sowohl Strings als auch Zahlen. TypeScript verwendet Type Guards, um den Typ innerhalb bedingter Blöcke einzugrenzen.',
        es: 'Un tipo unión (escrito con `|`) significa que un valor puede ser de tipo A O de tipo B. Ejemplo: `string | number` acepta tanto cadenas como números. TypeScript utiliza guardas de tipos para estrechar el tipo dentro de bloques condicionales.',
        it: "Un tipo unione (scritto con `|`) significa che un valore può essere di tipo A O di tipo B. Esempio: `string | number` accetta sia stringhe che numeri. TypeScript utilizza le guardie di tipo per restringere il tipo all'interno dei blocchi condizionali.",
      }),
      '07000001-0000-4000-8001-000000000004',
    ]);

    // ── Q5: What is a tuple in TypeScript? ─────────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce qu'un tuple en TypeScript ?",
        de: 'Was ist ein Tupel in TypeScript?',
        es: '¿Qué es una tupla en TypeScript?',
        it: "Cos'è una tupla in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          "Un tableau d'un nombre quelconque d'éléments du même type",
          'Un tableau de taille fixe où chaque position a un type connu et spécifique',
          'Une structure de paires clé-valeur',
          'Une union de types tableau',
        ],
        de: [
          'Ein Array mit beliebig vielen Elementen desselben Typs',
          'Ein Array fester Länge, bei dem jede Position einen bekannten, spezifischen Typ hat',
          'Eine Schlüssel-Wert-Paar-Struktur',
          'Eine Union von Array-Typen',
        ],
        es: [
          'Un arreglo de cualquier cantidad de elementos del mismo tipo',
          'Un arreglo de longitud fija donde cada posición tiene un tipo conocido y específico',
          'Una estructura de pares clave-valor',
          'Una unión de tipos de arreglo',
        ],
        it: [
          'Un array con un numero qualsiasi di elementi dello stesso tipo',
          'Un array a lunghezza fissa dove ogni posizione ha un tipo noto e specifico',
          'Una struttura di coppie chiave-valore',
          "Un'unione di tipi array",
        ],
      }),
      JSON.stringify({
        fr: "Un tuple est un tableau avec un nombre fixe d'éléments dont les types sont connus à chaque position. Exemple : `[string, number]` signifie que le premier élément doit être une chaîne et le second un nombre. La longueur et les types sont vérifiés à la compilation.",
        de: 'Ein Tupel ist ein Array mit einer festen Anzahl von Elementen, deren Typen an jeder Position bekannt sind. Beispiel: `[string, number]` bedeutet, dass das erste Element ein String und das zweite eine Zahl sein muss. Länge und Typen werden zur Kompilierzeit überprüft.',
        es: 'Una tupla es un arreglo con un número fijo de elementos cuyos tipos son conocidos en cada posición. Ejemplo: `[string, number]` significa que el primer elemento debe ser una cadena y el segundo un número. La longitud y los tipos se verifican en tiempo de compilación.',
        it: 'Una tupla è un array con un numero fisso di elementi i cui tipi sono noti in ogni posizione. Esempio: `[string, number]` significa che il primo elemento deve essere una stringa e il secondo un numero. Lunghezza e tipi vengono verificati in fase di compilazione.',
      }),
      '07000001-0000-4000-8001-000000000005',
    ]);

    // ── Q6: What is an enum in TypeScript? ─────────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce qu'un enum en TypeScript ?",
        de: 'Was ist ein Enum in TypeScript?',
        es: '¿Qué es un enum en TypeScript?',
        it: "Cos'è un enum in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          'Une fonction qui retourne une valeur numérique',
          'Un ensemble de constantes nommées regroupées sous un même nom',
          "Un type qui n'accepte que des valeurs de type chaîne",
          'Une collection de propriétés optionnelles',
        ],
        de: [
          'Eine Funktion, die einen numerischen Wert zurückgibt',
          'Eine Gruppe benannter Konstanten unter einem gemeinsamen Namen',
          'Ein Typ, der nur String-Werte akzeptiert',
          'Eine Sammlung optionaler Eigenschaften',
        ],
        es: [
          'Una función que devuelve un valor numérico',
          'Un conjunto de constantes con nombre agrupadas bajo un mismo nombre',
          'Un tipo que solo acepta valores de cadena',
          'Una colección de propiedades opcionales',
        ],
        it: [
          'Una funzione che restituisce un valore numerico',
          'Un insieme di costanti con nome raggruppate sotto un unico nome',
          'Un tipo che accetta solo valori stringa',
          'Una collezione di proprietà opzionali',
        ],
      }),
      JSON.stringify({
        fr: "Un enum définit un ensemble de constantes numériques ou de chaînes nommées. Exemple : `enum Direction { Up, Down, Left, Right }`. Les enums améliorent la lisibilité et clarifient l'intention lorsqu'on travaille avec un ensemble fixe de valeurs liées. Ils existent à l'exécution (contrairement à la plupart des types TypeScript).",
        de: 'Ein Enum definiert eine Gruppe benannter numerischer oder String-Konstanten. Beispiel: `enum Direction { Up, Down, Left, Right }`. Enums verbessern die Lesbarkeit und verdeutlichen die Absicht bei der Arbeit mit einer festen Menge verwandter Werte. Sie existieren zur Laufzeit (anders als die meisten TypeScript-Typen).',
        es: 'Un enum define un conjunto de constantes numéricas o de cadena con nombre. Ejemplo: `enum Direction { Up, Down, Left, Right }`. Los enums mejoran la legibilidad y aclaran la intención al trabajar con un conjunto fijo de valores relacionados. Existen en tiempo de ejecución (a diferencia de la mayoría de los tipos de TypeScript).',
        it: "Un enum definisce un insieme di costanti numeriche o stringa con nome. Esempio: `enum Direction { Up, Down, Left, Right }`. Gli enum migliorano la leggibilità e rendono più chiara l'intenzione quando si lavora con un insieme fisso di valori correlati. Esistono a runtime (a differenza della maggior parte dei tipi TypeScript).",
      }),
      '07000001-0000-4000-8001-000000000006',
    ]);

    // ── Q7: What is a generic in TypeScript? ───────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce qu'un générique en TypeScript ?",
        de: 'Was ist ein Generic in TypeScript?',
        es: '¿Qué es un genérico en TypeScript?',
        it: "Cos'è un generico in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          "Un type qui s'applique uniquement aux valeurs primitives",
          "Un espace réservé de type réutilisable permettant d'écrire du code type-safe fonctionnant avec plusieurs types",
          "Un mot-clé d'assertion de type",
          'Un type utilitaire intégré',
        ],
        de: [
          'Ein Typ, der nur für primitive Werte gilt',
          'Ein wiederverwendbarer Typ-Platzhalter, der es ermöglicht, typsicheren Code für mehrere Typen zu schreiben',
          'Ein Schlüsselwort für Typ-Assertions',
          'Ein eingebauter Utility-Typ',
        ],
        es: [
          'Un tipo que se aplica solo a valores primitivos',
          'Un marcador de tipo reutilizable que permite escribir código con seguridad de tipos para múltiples tipos',
          'Una palabra clave de aserción de tipo',
          'Un tipo utilitario integrado',
        ],
        it: [
          'Un tipo che si applica solo ai valori primitivi',
          'Un segnaposto di tipo riutilizzabile che permette di scrivere codice type-safe per più tipi',
          'Una parola chiave di asserzione di tipo',
          'Un tipo utilitario integrato',
        ],
      }),
      JSON.stringify({
        fr: "Les génériques permettent d'écrire des fonctions, des classes et des interfaces qui fonctionnent avec n'importe quel type tout en préservant la sécurité des types. Exemple : `function identity<T>(x: T): T` fonctionne avec n'importe quel type T. Le type concret est inféré ou fourni au site d'appel.",
        de: 'Generics ermöglichen es, Funktionen, Klassen und Interfaces zu schreiben, die mit jedem Typ funktionieren und gleichzeitig die Typsicherheit gewährleisten. Beispiel: `function identity<T>(x: T): T` funktioniert mit jedem Typ T. Der konkrete Typ wird an der Aufrufstelle abgeleitet oder angegeben.',
        es: 'Los genéricos permiten escribir funciones, clases e interfaces que funcionan con cualquier tipo manteniendo la seguridad de tipos. Ejemplo: `function identity<T>(x: T): T` funciona con cualquier tipo T. El tipo concreto se infiere o se proporciona en el sitio de llamada.',
        it: 'I generici permettono di scrivere funzioni, classi e interfacce che funzionano con qualsiasi tipo preservando la sicurezza dei tipi. Esempio: `function identity<T>(x: T): T` funziona con qualsiasi tipo T. Il tipo concreto viene inferito o fornito nel punto di chiamata.',
      }),
      '07000001-0000-4000-8001-000000000007',
    ]);

    // ── Q8: What is an intersection type in TypeScript? ────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce qu'un type intersection en TypeScript ?",
        de: 'Was ist ein Intersection-Typ in TypeScript?',
        es: '¿Qué es un tipo intersección en TypeScript?',
        it: "Cos'è un tipo intersezione in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          'Un type qui peut être soit A soit B',
          'Un type qui combine plusieurs types en un seul, exigeant toutes les propriétés de chaque type simultanément',
          'Un type utilisé uniquement dans les déclarations de classe',
          'Le résultat du rétrécissement de type',
        ],
        de: [
          'Ein Typ, der entweder A oder B sein kann',
          'Ein Typ, der mehrere Typen zu einem kombiniert und alle Eigenschaften jedes Typs gleichzeitig erfordert',
          'Ein Typ, der nur in Klassendeklarationen verwendet wird',
          'Das Ergebnis einer Typverengung',
        ],
        es: [
          'Un tipo que puede ser A o B',
          'Un tipo que combina múltiples tipos en uno, requiriendo todas las propiedades de cada tipo simultáneamente',
          'Un tipo usado solo dentro de declaraciones de clase',
          'El resultado del estrechamiento de tipos',
        ],
        it: [
          'Un tipo che può essere A o B',
          'Un tipo che combina più tipi in uno, richiedendo tutte le proprietà di ogni tipo contemporaneamente',
          "Un tipo usato solo all'interno delle dichiarazioni di classe",
          'Il risultato del restringimento di tipo',
        ],
      }),
      JSON.stringify({
        fr: "Un type intersection (écrit avec `&`) combine plusieurs types en un seul. Une valeur d'un type intersection doit satisfaire TOUS les types combinés à la fois. Exemple : `type AB = A & B` — une valeur doit posséder toutes les propriétés de A et de B.",
        de: 'Ein Intersection-Typ (geschrieben mit `&`) kombiniert mehrere Typen zu einem. Ein Wert eines Intersection-Typs muss ALLE kombinierten Typen gleichzeitig erfüllen. Beispiel: `type AB = A & B` — ein Wert muss alle Eigenschaften von sowohl A als auch B besitzen.',
        es: 'Un tipo intersección (escrito con `&`) combina múltiples tipos en uno. Un valor de un tipo intersección debe satisfacer TODOS los tipos combinados a la vez. Ejemplo: `type AB = A & B` — un valor debe tener todas las propiedades de A y de B.',
        it: 'Un tipo intersezione (scritto con `&`) combina più tipi in uno solo. Un valore di un tipo intersezione deve soddisfare TUTTI i tipi combinati contemporaneamente. Esempio: `type AB = A & B` — un valore deve avere tutte le proprietà sia di A che di B.',
      }),
      '07000001-0000-4000-8001-000000000008',
    ]);

    // ── Q9: What is Record<K, V> in TypeScript? ────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce que `Record<K, V>` en TypeScript ?",
        de: 'Was ist `Record<K, V>` in TypeScript?',
        es: '¿Qué es `Record<K, V>` en TypeScript?',
        it: "Cos'è `Record<K, V>` in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          "Une classe pour stocker des paires clé-valeur à l'exécution",
          'Un type utilitaire qui construit un type objet avec des clés de type K et des valeurs de type V',
          'Un décorateur pour enregistrer les appels de méthodes',
          'Un alias de type pour Map<K, V>',
        ],
        de: [
          'Eine Klasse zum Speichern von Schlüssel-Wert-Paaren zur Laufzeit',
          'Ein Utility-Typ, der einen Objekttyp mit Schlüsseln vom Typ K und Werten vom Typ V erstellt',
          'Ein Dekorator zum Aufzeichnen von Methodenaufrufen',
          'Ein Typ-Alias für Map<K, V>',
        ],
        es: [
          'Una clase para almacenar pares clave-valor en tiempo de ejecución',
          'Un tipo utilitario que construye un tipo de objeto con claves de tipo K y valores de tipo V',
          'Un decorador para registrar llamadas a métodos',
          'Un alias de tipo para Map<K, V>',
        ],
        it: [
          'Una classe per memorizzare coppie chiave-valore a runtime',
          'Un tipo utilitario che costruisce un tipo oggetto con chiavi di tipo K e valori di tipo V',
          'Un decoratore per registrare le chiamate ai metodi',
          'Un alias di tipo per Map<K, V>',
        ],
      }),
      JSON.stringify({
        fr: '`Record<K, V>` est un type utilitaire intégré qui crée un type objet où toutes les clés sont de type K et toutes les valeurs de type V. Exemple : `Record<string, number>` est équivalent à `{ [key: string]: number }`. Il est souvent utilisé pour typer les dictionnaires et les tables de correspondance.',
        de: '`Record<K, V>` ist ein eingebauter Utility-Typ, der einen Objekttyp erstellt, bei dem alle Schlüssel vom Typ K und alle Werte vom Typ V sind. Beispiel: `Record<string, number>` entspricht `{ [key: string]: number }`. Er wird häufig für die Typisierung von Wörterbüchern und Nachschlagetabellen verwendet.',
        es: '`Record<K, V>` es un tipo utilitario integrado que crea un tipo de objeto donde todas las claves son de tipo K y todos los valores de tipo V. Ejemplo: `Record<string, number>` es equivalente a `{ [key: string]: number }`. Se usa frecuentemente para tipar diccionarios y tablas de búsqueda.',
        it: '`Record<K, V>` è un tipo utilitario integrato che crea un tipo oggetto in cui tutte le chiavi sono di tipo K e tutti i valori di tipo V. Esempio: `Record<string, number>` è equivalente a `{ [key: string]: number }`. Viene spesso usato per tipizzare dizionari e tabelle di ricerca.',
      }),
      '07000001-0000-4000-8001-000000000009',
    ]);

    // ── Q10: What is Partial<T> in TypeScript? ─────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce que `Partial<T>` en TypeScript ?",
        de: 'Was ist `Partial<T>` in TypeScript?',
        es: '¿Qué es `Partial<T>` en TypeScript?',
        it: "Cos'è `Partial<T>` in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          'Un type qui rend toutes les propriétés de T obligatoires',
          'Un type utilitaire qui rend toutes les propriétés de T optionnelles',
          'Un type qui supprime toutes les méthodes de T',
          'Un type qui sélectionne uniquement les propriétés primitives de T',
        ],
        de: [
          'Ein Typ, der alle Eigenschaften von T erforderlich macht',
          'Ein Utility-Typ, der alle Eigenschaften von T optional macht',
          'Ein Typ, der alle Methoden aus T entfernt',
          'Ein Typ, der nur primitive Eigenschaften aus T auswählt',
        ],
        es: [
          'Un tipo que hace obligatorias todas las propiedades de T',
          'Un tipo utilitario que hace opcionales todas las propiedades de T',
          'Un tipo que elimina todos los métodos de T',
          'Un tipo que selecciona solo las propiedades primitivas de T',
        ],
        it: [
          'Un tipo che rende obbligatorie tutte le proprietà di T',
          'Un tipo utilitario che rende opzionali tutte le proprietà di T',
          'Un tipo che rimuove tutti i metodi da T',
          'Un tipo che seleziona solo le proprietà primitive di T',
        ],
      }),
      JSON.stringify({
        fr: '`Partial<T>` construit un type avec toutes les propriétés de T rendues optionnelles en ajoutant `?` à chaque propriété. Il est utile pour les fonctions de mise à jour ou de patch où seuls certains champs doivent être fournis.',
        de: '`Partial<T>` erstellt einen Typ, bei dem alle Eigenschaften von T durch Hinzufügen von `?` optional gemacht werden. Er ist nützlich für Update-/Patch-Funktionen, bei denen nur einige Felder übergeben werden müssen.',
        es: '`Partial<T>` construye un tipo con todas las propiedades de T como opcionales añadiendo `?` a cada propiedad. Es útil para funciones de actualización o parche donde solo algunos campos necesitan ser proporcionados.',
        it: '`Partial<T>` costruisce un tipo con tutte le proprietà di T rese opzionali aggiungendo `?` a ogni proprietà. È utile per le funzioni di aggiornamento o patch dove solo alcuni campi devono essere forniti.',
      }),
      '07000001-0000-4000-8001-000000000010',
    ]);

    // ── Q11: What is Readonly<T> in TypeScript? ────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce que `Readonly<T>` en TypeScript ?",
        de: 'Was ist `Readonly<T>` in TypeScript?',
        es: '¿Qué es `Readonly<T>` en TypeScript?',
        it: "Cos'è `Readonly<T>` in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          'Un type qui empêche la réaffectation de la variable elle-même',
          "Un type utilitaire qui rend toutes les propriétés de T en lecture seule afin qu'elles ne puissent pas être réaffectées",
          'Un décorateur qui verrouille une classe pour empêcher son extension',
          "Un type qui remplace les tableaux mutables par des tableaux gelés à l'exécution",
        ],
        de: [
          'Ein Typ, der die Neuzuweisung der Variable selbst verhindert',
          'Ein Utility-Typ, der alle Eigenschaften von T schreibgeschützt macht, sodass sie nicht neu zugewiesen werden können',
          'Ein Dekorator, der eine Klasse gegen Vererbung sperrt',
          'Ein Typ, der veränderbare Arrays zur Laufzeit durch eingefrorene ersetzt',
        ],
        es: [
          'Un tipo que impide la reasignación de la variable en sí',
          'Un tipo utilitario que hace todas las propiedades de T de solo lectura para que no puedan ser reasignadas',
          'Un decorador que bloquea una clase para que no pueda ser extendida',
          'Un tipo que reemplaza los arreglos mutables por congelados en tiempo de ejecución',
        ],
        it: [
          'Un tipo che impedisce la riassegnazione della variabile stessa',
          'Un tipo utilitario che rende tutte le proprietà di T in sola lettura in modo che non possano essere riassegnate',
          "Un decoratore che blocca una classe dall'essere estesa",
          'Un tipo che sostituisce gli array mutabili con array congelati a runtime',
        ],
      }),
      JSON.stringify({
        fr: "`Readonly<T>` construit un type où toutes les propriétés de T sont marquées `readonly`, empêchant leur réaffectation après l'initialisation. Cette contrainte est appliquée uniquement à la compilation — elle ne gèle pas l'objet à l'exécution.",
        de: '`Readonly<T>` erstellt einen Typ, bei dem alle Eigenschaften von T als `readonly` markiert sind und nach der Initialisierung nicht neu zugewiesen werden können. Diese Einschränkung wird nur zur Kompilierzeit durchgesetzt — das Objekt wird zur Laufzeit nicht eingefroren.',
        es: '`Readonly<T>` construye un tipo donde todas las propiedades de T están marcadas como `readonly`, impidiendo que sean reasignadas después de la inicialización. Esta restricción se aplica solo en tiempo de compilación — no congela el objeto en tiempo de ejecución.',
        it: "`Readonly<T>` costruisce un tipo in cui tutte le proprietà di T sono contrassegnate come `readonly`, impedendo la loro riassegnazione dopo l'inizializzazione. Questo vincolo viene applicato solo in fase di compilazione — non congela l'oggetto a runtime.",
      }),
      '07000001-0000-4000-8001-000000000011',
    ]);

    // ── Q12: What is Pick<T, K> in TypeScript? ─────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce que `Pick<T, K>` en TypeScript ?",
        de: 'Was ist `Pick<T, K>` in TypeScript?',
        es: '¿Qué es `Pick<T, K>` en TypeScript?',
        it: "Cos'è `Pick<T, K>` in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          'Un type utilitaire qui supprime les propriétés K du type T',
          'Un type utilitaire qui construit un type en sélectionnant uniquement les propriétés K du type T',
          "Une fonction d'exécution pour extraire des propriétés d'un objet",
          "Un moyen de choisir entre les membres d'un type union",
        ],
        de: [
          'Ein Utility-Typ, der Eigenschaften K aus dem Typ T entfernt',
          'Ein Utility-Typ, der einen Typ erstellt, indem nur die Eigenschaften K aus dem Typ T ausgewählt werden',
          'Eine Laufzeitfunktion zum Extrahieren von Eigenschaften aus einem Objekt',
          'Eine Möglichkeit, zwischen Union-Typ-Mitgliedern zu wählen',
        ],
        es: [
          'Un tipo utilitario que elimina las propiedades K del tipo T',
          'Un tipo utilitario que construye un tipo seleccionando solo las propiedades K del tipo T',
          'Una función en tiempo de ejecución para extraer propiedades de un objeto',
          'Una forma de elegir entre miembros de un tipo unión',
        ],
        it: [
          'Un tipo utilitario che rimuove le proprietà K dal tipo T',
          'Un tipo utilitario che costruisce un tipo selezionando solo le proprietà K dal tipo T',
          'Una funzione a runtime per estrarre proprietà da un oggetto',
          'Un modo per scegliere tra i membri di un tipo unione',
        ],
      }),
      JSON.stringify({
        fr: '`Pick<T, K>` crée un nouveau type en incluant uniquement les propriétés dont les clés sont dans K (une union de littéraux de chaîne). Exemple : `Pick<User, "id" | "name">` crée un type avec uniquement les propriétés `id` et `name` de User.',
        de: '`Pick<T, K>` erstellt einen neuen Typ, der nur die Eigenschaften enthält, deren Schlüssel in K sind (eine Union von String-Literalen). Beispiel: `Pick<User, "id" | "name">` erstellt einen Typ mit nur den Eigenschaften `id` und `name` von User.',
        es: '`Pick<T, K>` crea un nuevo tipo incluyendo solo las propiedades cuyas claves están en K (una unión de literales de cadena). Ejemplo: `Pick<User, "id" | "name">` crea un tipo con solo las propiedades `id` y `name` de User.',
        it: "`Pick<T, K>` crea un nuovo tipo includendo solo le proprietà le cui chiavi sono in K (un'unione di stringhe letterali). Esempio: `Pick<User, \"id\" | \"name\">` crea un tipo con solo le proprietà `id` e `name` di User.",
      }),
      '07000001-0000-4000-8001-000000000012',
    ]);

    // ── Q13: What is Omit<T, K> in TypeScript? ─────────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce que `Omit<T, K>` en TypeScript ?",
        de: 'Was ist `Omit<T, K>` in TypeScript?',
        es: '¿Qué es `Omit<T, K>` en TypeScript?',
        it: "Cos'è `Omit<T, K>` in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          'Un type utilitaire qui inclut uniquement les propriétés K de T',
          'Un type utilitaire qui construit un type en supprimant les propriétés K du type T',
          "Un moyen d'ignorer la vérification de type sur certaines propriétés",
          'Un utilitaire qui supprime les modificateurs optionnels de T',
        ],
        de: [
          'Ein Utility-Typ, der nur die Eigenschaften K aus T einschließt',
          'Ein Utility-Typ, der einen Typ erstellt, indem die Eigenschaften K aus dem Typ T entfernt werden',
          'Eine Möglichkeit, die Typprüfung bei bestimmten Eigenschaften zu überspringen',
          'Ein Utility, das optionale Modifikatoren aus T entfernt',
        ],
        es: [
          'Un tipo utilitario que incluye solo las propiedades K de T',
          'Un tipo utilitario que construye un tipo eliminando las propiedades K del tipo T',
          'Una forma de omitir la verificación de tipos en ciertas propiedades',
          'Un utilitario que elimina los modificadores opcionales de T',
        ],
        it: [
          'Un tipo utilitario che include solo le proprietà K da T',
          'Un tipo utilitario che costruisce un tipo rimuovendo le proprietà K dal tipo T',
          'Un modo per saltare il controllo dei tipi su certe proprietà',
          'Un utilitario che rimuove i modificatori opzionali da T',
        ],
      }),
      JSON.stringify({
        fr: "`Omit<T, K>` est l'opposé de `Pick`. Il crée un nouveau type à partir de T en excluant les propriétés dont les clés sont dans K. Exemple : `Omit<User, \"password\">` donne toutes les propriétés de User sauf `password`. En interne, il est implémenté comme `Pick<T, Exclude<keyof T, K>>`.",
        de: '`Omit<T, K>` ist das Gegenteil von `Pick`. Es erstellt einen neuen Typ aus T ohne die Eigenschaften, deren Schlüssel in K sind. Beispiel: `Omit<User, "password">` liefert alle Eigenschaften von User außer `password`. Intern ist es als `Pick<T, Exclude<keyof T, K>>` implementiert.',
        es: '`Omit<T, K>` es lo opuesto a `Pick`. Crea un nuevo tipo a partir de T excluyendo las propiedades cuyas claves están en K. Ejemplo: `Omit<User, "password">` devuelve todas las propiedades de User excepto `password`. Internamente se implementa como `Pick<T, Exclude<keyof T, K>>`.',
        it: "`Omit<T, K>` è l'opposto di `Pick`. Crea un nuovo tipo da T escludendo le proprietà le cui chiavi sono in K. Esempio: `Omit<User, \"password\">` restituisce tutte le proprietà di User tranne `password`. Internamente è implementato come `Pick<T, Exclude<keyof T, K>>`.",
      }),
      '07000001-0000-4000-8001-000000000013',
    ]);

    // ── Q14: What is a type guard in TypeScript? ───────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce qu'une garde de type en TypeScript ?",
        de: 'Was ist ein Type Guard in TypeScript?',
        es: '¿Qué es una guarda de tipo en TypeScript?',
        it: "Cos'è una guardia di tipo in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          "Un mot-clé qui protège les membres d'une classe de l'accès externe",
          "Une vérification à l'exécution qui restreint le type d'une valeur à un type plus spécifique dans un bloc conditionnel",
          'Une option du compilateur qui applique les vérifications strictes de null',
          "Un décorateur qui valide les arguments de fonction à l'exécution",
        ],
        de: [
          'Ein Schlüsselwort, das Klassenmitglieder vor externem Zugriff schützt',
          'Eine Laufzeitprüfung, die den Typ eines Werts innerhalb eines bedingten Blocks auf einen spezifischeren Typ eingrenzt',
          'Eine Compiler-Option, die strenge Null-Prüfungen erzwingt',
          'Ein Dekorator, der Funktionsargumente zur Laufzeit validiert',
        ],
        es: [
          'Una palabra clave que protege los miembros de una clase del acceso externo',
          'Una verificación en tiempo de ejecución que estrecha el tipo de un valor a un tipo más específico dentro de un bloque condicional',
          'Una opción del compilador que aplica verificaciones estrictas de null',
          'Un decorador que valida los argumentos de una función en tiempo de ejecución',
        ],
        it: [
          "Una parola chiave che protegge i membri di una classe dall'accesso esterno",
          "Un controllo a runtime che restringe il tipo di un valore a un tipo più specifico all'interno di un blocco condizionale",
          "Un'opzione del compilatore che impone controlli rigorosi su null",
          'Un decoratore che valida gli argomenti delle funzioni a runtime',
        ],
      }),
      JSON.stringify({
        fr: "Une garde de type est une expression qui effectue une vérification à l'exécution et restreint un type union dans une branche conditionnelle. Motifs courants : `typeof x === \"string\"`, `x instanceof Date`, `\"key\" in obj` et les prédicats définis par l'utilisateur utilisant la syntaxe de type retour `value is Type`.",
        de: 'Ein Type Guard ist ein Ausdruck, der eine Laufzeitprüfung durchführt und einen Union-Typ innerhalb eines bedingten Zweigs eingrenzt. Übliche Muster: `typeof x === "string"`, `x instanceof Date`, `"key" in obj` und benutzerdefinierte Prädikate mit der Rückgabetyp-Syntax `value is Type`.',
        es: 'Una guarda de tipo es una expresión que realiza una verificación en tiempo de ejecución y estrecha un tipo unión dentro de una rama condicional. Patrones comunes: `typeof x === "string"`, `x instanceof Date`, `"key" in obj` y predicados definidos por el usuario con la sintaxis de tipo de retorno `value is Type`.',
        it: "Una guardia di tipo è un'espressione che esegue un controllo a runtime e restringe un tipo unione all'interno di un ramo condizionale. Pattern comuni: `typeof x === \"string\"`, `x instanceof Date`, `\"key\" in obj` e predicati definiti dall'utente con la sintassi del tipo di ritorno `value is Type`.",
      }),
      '07000001-0000-4000-8001-000000000014',
    ]);

    // ── Q15: What is the never type in TypeScript? ─────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce que le type `never` en TypeScript ?",
        de: 'Was ist der `never`-Typ in TypeScript?',
        es: '¿Qué es el tipo `never` en TypeScript?',
        it: "Cos'è il tipo `never` in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          "Le type des variables qui n'ont pas été initialisées",
          'Le type bottom — un type sans aucune valeur, utilisé pour les vérifications exhaustives et les fonctions qui ne retournent jamais',
          "Un alias pour `void` indiquant l'absence de valeur de retour",
          'Le type combiné de `null` et `undefined`',
        ],
        de: [
          'Der Typ von Variablen, die nicht initialisiert wurden',
          'Der Bottom-Typ — ein Typ ohne Werte, verwendet für erschöpfende Prüfungen und Funktionen, die nie zurückkehren',
          'Ein Alias für `void`, der keinen Rückgabewert anzeigt',
          'Der Typ von `null` und `undefined` zusammen',
        ],
        es: [
          'El tipo de las variables que no han sido inicializadas',
          'El tipo bottom — un tipo sin valores, usado para verificaciones exhaustivas y funciones que nunca retornan',
          'Un alias de `void` que indica que no hay valor de retorno',
          'El tipo combinado de `null` y `undefined`',
        ],
        it: [
          'Il tipo delle variabili che non sono state inizializzate',
          'Il tipo bottom — un tipo senza valori, usato per controlli esaustivi e funzioni che non ritornano mai',
          'Un alias per `void` che indica nessun valore di ritorno',
          'Il tipo combinato di `null` e `undefined`',
        ],
      }),
      JSON.stringify({
        fr: "`never` est le type bottom en TypeScript — aucune valeur ne peut être de type `never`. Une fonction qui lance toujours une erreur ou boucle indéfiniment retourne `never`. Il est également utilisé pour les vérifications exhaustives : si une variable de type union a le type `never` dans une branche, TypeScript s'assure que tous les cas ont été traités.",
        de: '`never` ist der Bottom-Typ in TypeScript — kein Wert kann vom Typ `never` sein. Eine Funktion, die immer einen Fehler wirft oder endlos läuft, gibt `never` zurück. Er wird auch für erschöpfende Prüfungen verwendet: Wenn eine Union-Variable in einem Zweig den Typ `never` hat, stellt TypeScript sicher, dass alle Fälle behandelt wurden.',
        es: '`never` es el tipo bottom en TypeScript — ningún valor puede ser de tipo `never`. Una función que siempre lanza un error o entra en un bucle infinito retorna `never`. También se usa para verificaciones exhaustivas: si una variable de tipo unión tiene tipo `never` en una rama, TypeScript asegura que todos los casos fueron manejados.',
        it: '`never` è il tipo bottom in TypeScript — nessun valore può essere di tipo `never`. Una funzione che lancia sempre un errore o esegue un ciclo infinito restituisce `never`. Viene anche usato per controlli esaustivi: se una variabile di tipo unione ha tipo `never` in un ramo, TypeScript assicura che tutti i casi siano stati gestiti.',
      }),
      '07000001-0000-4000-8001-000000000015',
    ]);

    // ── Q16: What is the unknown type in TypeScript? ───────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce que le type `unknown` en TypeScript ?",
        de: 'Was ist der `unknown`-Typ in TypeScript?',
        es: '¿Qué es el tipo `unknown` en TypeScript?',
        it: "Cos'è il tipo `unknown` in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          "Un alias de type pour `any` avec des règles d'affectation plus strictes",
          "L'équivalent type-safe de `any` — vous devez restreindre son type avant d'effectuer des opérations dessus",
          "Un type représentant les variables qui n'ont pas encore été déclarées",
          'Un type espace réservé utilisé uniquement dans les contraintes génériques',
        ],
        de: [
          'Ein Typ-Alias für `any` mit strengeren Zuweisungsregeln',
          'Das typsichere Gegenstück zu `any` — der Typ muss eingeschränkt werden, bevor Operationen darauf ausgeführt werden können',
          'Ein Typ für Variablen, die noch nicht deklariert wurden',
          'Ein Platzhalter-Typ, der nur in generischen Einschränkungen verwendet wird',
        ],
        es: [
          'Un alias de tipo para `any` con reglas de asignación más estrictas',
          'La contraparte con seguridad de tipos de `any` — se debe estrechar su tipo antes de realizar operaciones sobre él',
          'Un tipo que representa variables que aún no han sido declaradas',
          'Un tipo marcador de posición usado solo dentro de restricciones genéricas',
        ],
        it: [
          'Un alias di tipo per `any` con regole di assegnazione più rigide',
          'La controparte type-safe di `any` — è necessario restringere il suo tipo prima di eseguire operazioni su di esso',
          'Un tipo che rappresenta variabili non ancora dichiarate',
          "Un tipo segnaposto usato solo all'interno di vincoli generici",
        ],
      }),
      JSON.stringify({
        fr: "`unknown` est l'alternative type-safe à `any`. N'importe quelle valeur peut être assignée à `unknown`, mais vous ne pouvez pas l'utiliser tant que vous n'avez pas restreint son type (par ex. avec `typeof`, `instanceof` ou une garde de type). Cela impose une vérification explicite des types et empêche les opérations non sûres.",
        de: '`unknown` ist die typsichere Alternative zu `any`. Jeder Wert kann `unknown` zugewiesen werden, aber er kann nicht verwendet werden, bis sein Typ eingeschränkt wird (z. B. mit `typeof`, `instanceof` oder einem Type Guard). Dies erzwingt explizite Typprüfung und verhindert unsichere Operationen.',
        es: '`unknown` es la alternativa con seguridad de tipos a `any`. Cualquier valor puede ser asignado a `unknown`, pero no se puede usar hasta estrechar su tipo (por ej. con `typeof`, `instanceof` o una guarda de tipo). Esto obliga a una verificación explícita de tipos y previene operaciones inseguras.',
        it: "`unknown` è l'alternativa type-safe a `any`. Qualsiasi valore può essere assegnato a `unknown`, ma non può essere utilizzato finché non se ne restringe il tipo (ad es. con `typeof`, `instanceof` o una guardia di tipo). Questo impone un controllo esplicito dei tipi e previene operazioni non sicure.",
      }),
      '07000001-0000-4000-8001-000000000016',
    ]);

    // ── Q17: What is a mapped type in TypeScript? ──────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce qu'un type mappé en TypeScript ?",
        de: 'Was ist ein Mapped Type in TypeScript?',
        es: '¿Qué es un tipo mapeado en TypeScript?',
        it: "Cos'è un tipo mappato in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          'Un type qui transforme les tableaux avec `.map()`',
          "Un type créé en itérant sur les clés d'un type existant pour produire un nouveau type",
          "Un type qui associe les membres d'une union à des indices numériques",
          "Un objet d'exécution qui stocke les métadonnées de type",
        ],
        de: [
          'Ein Typ, der Arrays mit `.map()` transformiert',
          'Ein Typ, der durch Iteration über die Schlüssel eines bestehenden Typs erstellt wird, um einen neuen Typ zu erzeugen',
          'Ein Typ, der Union-Mitglieder auf numerische Indizes abbildet',
          'Ein Laufzeitobjekt, das Typ-Metadaten speichert',
        ],
        es: [
          'Un tipo que transforma arreglos usando `.map()`',
          'Un tipo creado iterando sobre las claves de un tipo existente para producir un nuevo tipo',
          'Un tipo que mapea miembros de una unión a índices numéricos',
          'Un objeto en tiempo de ejecución que almacena metadatos de tipo',
        ],
        it: [
          'Un tipo che trasforma array usando `.map()`',
          'Un tipo creato iterando sulle chiavi di un tipo esistente per produrre un nuovo tipo',
          "Un tipo che mappa i membri di un'unione a indici numerici",
          'Un oggetto a runtime che memorizza metadati di tipo',
        ],
      }),
      JSON.stringify({
        fr: "Un type mappé transforme chaque propriété d'un type existant avec la syntaxe `{ [K in keyof T]: ... }`. Vous pouvez ajouter/supprimer les modificateurs `readonly` et `?`. Les types utilitaires intégrés comme `Partial<T>`, `Readonly<T>` et `Record<K, V>` sont tous implémentés en interne comme des types mappés.",
        de: 'Ein Mapped Type transformiert jede Eigenschaft eines bestehenden Typs mit der Syntax `{ [K in keyof T]: ... }`. Sie können `readonly`- und `?`-Modifikatoren hinzufügen/entfernen. Eingebaute Utility-Typen wie `Partial<T>`, `Readonly<T>` und `Record<K, V>` sind intern alle als Mapped Types implementiert.',
        es: 'Un tipo mapeado transforma cada propiedad de un tipo existente usando la sintaxis `{ [K in keyof T]: ... }`. Se pueden añadir/eliminar los modificadores `readonly` y `?`. Los tipos utilitarios integrados como `Partial<T>`, `Readonly<T>` y `Record<K, V>` están todos implementados internamente como tipos mapeados.',
        it: 'Un tipo mappato trasforma ogni proprietà di un tipo esistente usando la sintassi `{ [K in keyof T]: ... }`. Si possono aggiungere/rimuovere i modificatori `readonly` e `?`. I tipi utilitari integrati come `Partial<T>`, `Readonly<T>` e `Record<K, V>` sono tutti implementati internamente come tipi mappati.',
      }),
      '07000001-0000-4000-8001-000000000017',
    ]);

    // ── Q18: What is a conditional type in TypeScript? ─────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce qu'un type conditionnel en TypeScript ?",
        de: 'Was ist ein Conditional Type in TypeScript?',
        es: '¿Qué es un tipo condicional en TypeScript?',
        it: "Cos'è un tipo condizionale in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          "Un type qui change en fonction des valeurs à l'exécution",
          "Une expression de type évaluée à la compilation qui sélectionne l'un des deux types selon qu'une condition de type est satisfaite",
          'Une syntaxe spéciale pour le chaînage optionnel dans les types',
          'Un type évalué uniquement dans les blocs if/else',
        ],
        de: [
          'Ein Typ, der sich basierend auf Laufzeitwerten ändert',
          'Ein zur Kompilierzeit ausgewerteter Typausdruck, der einen von zwei Typen auswählt, je nachdem ob eine Typbedingung erfüllt ist',
          'Eine spezielle Syntax für optionales Chaining in Typen',
          'Ein Typ, der nur in if/else-Blöcken ausgewertet wird',
        ],
        es: [
          'Un tipo que cambia según los valores en tiempo de ejecución',
          'Una expresión de tipo en tiempo de compilación que selecciona uno de dos tipos según si se cumple una condición de tipo',
          'Una sintaxis especial para encadenamiento opcional en tipos',
          'Un tipo que solo se evalúa dentro de bloques if/else',
        ],
        it: [
          'Un tipo che cambia in base ai valori a runtime',
          "Un'espressione di tipo a tempo di compilazione che seleziona uno dei due tipi in base al soddisfacimento di una condizione di tipo",
          "Una sintassi speciale per l'optional chaining nei tipi",
          "Un tipo che viene valutato solo all'interno di blocchi if/else",
        ],
      }),
      JSON.stringify({
        fr: 'Les types conditionnels utilisent la syntaxe `T extends U ? X : Y`. Si T est assignable à U à la compilation, le type résout en X ; sinon Y. Ils alimentent les types utilitaires comme `NonNullable<T>` (`T extends null | undefined ? never : T`) et `Exclude<T, U>`.',
        de: 'Conditional Types verwenden die Syntax `T extends U ? X : Y`. Wenn T zur Kompilierzeit U zuweisbar ist, wird der Typ zu X aufgelöst; andernfalls zu Y. Sie bilden die Grundlage für Utility-Typen wie `NonNullable<T>` (`T extends null | undefined ? never : T`) und `Exclude<T, U>`.',
        es: 'Los tipos condicionales usan la sintaxis `T extends U ? X : Y`. Si T es asignable a U en tiempo de compilación, el tipo resuelve a X; de lo contrario a Y. Potencian tipos utilitarios como `NonNullable<T>` (`T extends null | undefined ? never : T`) y `Exclude<T, U>`.',
        it: 'I tipi condizionali usano la sintassi `T extends U ? X : Y`. Se T è assegnabile a U in fase di compilazione, il tipo si risolve in X; altrimenti in Y. Sono alla base di tipi utilitari come `NonNullable<T>` (`T extends null | undefined ? never : T`) e `Exclude<T, U>`.',
      }),
      '07000001-0000-4000-8001-000000000018',
    ]);

    // ── Q19: What is ReturnType<T> in TypeScript? ──────────────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce que `ReturnType<T>` en TypeScript ?",
        de: 'Was ist `ReturnType<T>` in TypeScript?',
        es: '¿Qué es `ReturnType<T>` en TypeScript?',
        it: "Cos'è `ReturnType<T>` in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          "Un décorateur qui infère la valeur de retour d'une fonction à l'exécution",
          "Un type utilitaire qui extrait le type de retour d'un type de fonction T",
          "Un type qui encapsule la valeur de retour d'une fonction dans une Promise",
          "Une fonction d'exécution qui retourne le nom du type sous forme de chaîne",
        ],
        de: [
          'Ein Dekorator, der den Rückgabewert einer Funktion zur Laufzeit ableitet',
          'Ein Utility-Typ, der den Rückgabetyp eines Funktionstyps T extrahiert',
          'Ein Typ, der den Rückgabewert einer Funktion in ein Promise einwickelt',
          'Eine Laufzeitfunktion, die den Typnamen als String zurückgibt',
        ],
        es: [
          'Un decorador que infiere el valor de retorno de una función en tiempo de ejecución',
          'Un tipo utilitario que extrae el tipo de retorno de un tipo de función T',
          'Un tipo que envuelve el valor de retorno de una función en una Promise',
          'Una función en tiempo de ejecución que devuelve el nombre del tipo como cadena',
        ],
        it: [
          'Un decoratore che inferisce il valore di ritorno di una funzione a runtime',
          'Un tipo utilitario che estrae il tipo di ritorno di un tipo di funzione T',
          'Un tipo che avvolge il valore di ritorno di una funzione in una Promise',
          'Una funzione a runtime che restituisce il nome del tipo come stringa',
        ],
      }),
      JSON.stringify({
        fr: "`ReturnType<T>` est un type utilitaire intégré qui extrait le type que retourne une fonction. Exemple : si `T = () => string`, alors `ReturnType<T>` est `string`. Il est utile lorsque vous devez référencer le type de retour d'une fonction sans le dupliquer. En interne, il utilise les types conditionnels.",
        de: '`ReturnType<T>` ist ein eingebauter Utility-Typ, der den Rückgabetyp einer Funktion extrahiert. Beispiel: Wenn `T = () => string`, dann ist `ReturnType<T>` gleich `string`. Er ist nützlich, wenn man den Rückgabetyp einer Funktion referenzieren möchte, ohne ihn zu duplizieren. Intern werden Conditional Types verwendet.',
        es: '`ReturnType<T>` es un tipo utilitario integrado que extrae el tipo que retorna una función. Ejemplo: si `T = () => string`, entonces `ReturnType<T>` es `string`. Es útil cuando necesitas referenciar el tipo de retorno de una función sin duplicarlo. Internamente usa tipos condicionales.',
        it: '`ReturnType<T>` è un tipo utilitario integrato che estrae il tipo restituito da una funzione. Esempio: se `T = () => string`, allora `ReturnType<T>` è `string`. È utile quando si deve fare riferimento al tipo di ritorno di una funzione senza duplicarlo. Internamente utilizza i tipi condizionali.',
      }),
      '07000001-0000-4000-8001-000000000019',
    ]);

    // ── Q20: What is a discriminated union in TypeScript? ──────────────────
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' || $1::jsonb)
          ),
          '{choices}', (data->'choices' || $2::jsonb)
        ),
        '{explanation}', (data->'explanation' || $3::jsonb)
      )
      WHERE id = $4
    `, [
      JSON.stringify({
        fr: "Qu'est-ce qu'une union discriminée en TypeScript ?",
        de: 'Was ist eine Discriminated Union in TypeScript?',
        es: '¿Qué es una unión discriminada en TypeScript?',
        it: "Cos'è un'unione discriminata in TypeScript?",
      }),
      JSON.stringify({
        fr: [
          'Une union de types primitifs tels que `string | number`',
          'Une union de types objets partageant une propriété littérale commune (le discriminant) utilisée pour restreindre le type en toute sécurité',
          'Un type union qui exclut automatiquement `null` et `undefined`',
          "Une union créée à l'aide du type utilitaire `Exclude`",
        ],
        de: [
          'Eine Union primitiver Typen wie `string | number`',
          'Eine Union von Objekttypen, die eine gemeinsame literale Eigenschaft (den Diskriminator) teilen, um den Typ sicher einzugrenzen',
          'Ein Union-Typ, der `null` und `undefined` automatisch ausschließt',
          'Eine Union, die mit dem Utility-Typ `Exclude` erstellt wird',
        ],
        es: [
          'Una unión de tipos primitivos como `string | number`',
          'Una unión de tipos de objeto que comparten una propiedad literal común (el discriminante) usada para estrechar el tipo de forma segura',
          'Un tipo unión que excluye automáticamente `null` y `undefined`',
          'Una unión creada usando el tipo utilitario `Exclude`',
        ],
        it: [
          "Un'unione di tipi primitivi come `string | number`",
          "Un'unione di tipi oggetto che condividono una proprietà letterale comune (il discriminante) usata per restringere il tipo in modo sicuro",
          'Un tipo unione che esclude automaticamente `null` e `undefined`',
          "Un'unione creata usando il tipo utilitario `Exclude`",
        ],
      }),
      JSON.stringify({
        fr: 'Une union discriminée (aussi appelée union étiquetée) est une union de types objets ayant chacun un champ commun avec une valeur littérale unique (le discriminant). TypeScript utilise ce champ pour restreindre le type dans les instructions switch/if. Exemple : `type Shape = { kind: "circle"; radius: number } | { kind: "square"; side: number }` — vérifier `shape.kind` restreint au bon variant.',
        de: 'Eine Discriminated Union (auch Tagged Union genannt) ist eine Union von Objekttypen, die jeweils ein gemeinsames Feld mit einem eindeutigen Literalwert (dem Diskriminator) besitzen. TypeScript verwendet dieses Feld, um den Typ in switch-/if-Anweisungen einzugrenzen. Beispiel: `type Shape = { kind: "circle"; radius: number } | { kind: "square"; side: number }` — die Prüfung von `shape.kind` grenzt auf die richtige Variante ein.',
        es: 'Una unión discriminada (también llamada unión etiquetada) es una unión de tipos de objeto que comparten un campo común con un valor literal único (el discriminante). TypeScript usa este campo para estrechar el tipo en sentencias switch/if. Ejemplo: `type Shape = { kind: "circle"; radius: number } | { kind: "square"; side: number }` — verificar `shape.kind` estrecha al variante correcto.',
        it: "Un'unione discriminata (detta anche unione etichettata) è un'unione di tipi oggetto che hanno ciascuno un campo comune con un valore letterale unico (il discriminante). TypeScript usa questo campo per restringere il tipo nelle istruzioni switch/if. Esempio: `type Shape = { kind: \"circle\"; radius: number } | { kind: \"square\"; side: number }` — controllare `shape.kind` restringe alla variante corretta.",
      }),
      '07000001-0000-4000-8001-000000000020',
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove language keys from module
    await queryRunner.query(`
      UPDATE qcm_module
      SET
        label = label - 'fr' - 'de' - 'es' - 'it',
        description = description - 'fr' - 'de' - 'es' - 'it'
      WHERE id = $1
    `, ['07000000-0000-4000-8000-000000000001']);

    // Remove language keys from all questions in this module
    await queryRunner.query(`
      UPDATE qcm_question
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(data,
            '{question}', (data->'question' - 'fr' - 'de' - 'es' - 'it')
          ),
          '{choices}', (data->'choices' - 'fr' - 'de' - 'es' - 'it')
        ),
        '{explanation}', (data->'explanation' - 'fr' - 'de' - 'es' - 'it')
      )
      WHERE "moduleId" = $1
    `, ['07000000-0000-4000-8000-000000000001']);
  }
}
