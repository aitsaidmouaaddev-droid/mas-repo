// ─── Runner ───────────────────────────────────────────────────────────────────
function test(label, fn) {
  try {
    fn();
    console.log(`  ✅  ${label}`);
  } catch (e) {
    console.log(`  ❌  ${label}\n       → ${e.message}`);
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assert(condition, msg) {
  if (!condition) throw new Error(msg ?? 'assertion failed');
}
function assertEq(a, b) {
  if (a !== b) throw new Error(`expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertDeepEq(a, b) {
  const s = JSON.stringify;
  if (s(a) !== s(b)) throw new Error(`expected ${s(b)}, got ${s(a)}`);
}

// ─── Exercise 1 — isPalindrome ───────────────────────────────────────────────
//
// CONCEPT: String reversal and comparison
// WHY:     Strings in JS are immutable sequences. split('') converts a string
//          to an array of characters, which can be reversed and rejoined.
//          This is the idiomatic JS idiom for string reversal.
// WHEN:    Palindrome checks appear in interviews and in data validation (e.g.,
//          checking symmetric identifiers). The pattern of split→transform→join
//          applies broadly (e.g., sentence word reversal).
// WHERE:   Interview prep, input validation, text processing utilities.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split

function isPalindrome(str) {
  const normalized = str.toLowerCase();
  return normalized === normalized.split('').reverse().join('');
}

console.log('\nLevel 1 — isPalindrome');
test('"racecar" is palindrome', () => assert(isPalindrome('racecar')));
test('"hello" is not palindrome', () => assert(!isPalindrome('hello')));
test('single char is palindrome', () => assert(isPalindrome('a')));
test('empty string is palindrome', () => assert(isPalindrome('')));
test('case-insensitive "Racecar"', () => assert(isPalindrome('Racecar')));
test('"A" is palindrome', () => assert(isPalindrome('A')));
test('"ab" is not palindrome', () => assert(!isPalindrome('ab')));

// ─── Exercise 2 — Title Case ─────────────────────────────────────────────────
//
// CONCEPT: String splitting, mapping, and joining; slice/charAt for indexing
// WHY:     JS strings have no built-in titleCase method. The pattern is:
//          split on delimiter → transform each token → rejoin. charAt(0)
//          and slice(1) give you head and tail without mutating.
// WHEN:    Text display normalization — user names, headings, labels.
//          Frequently asked in interviews as a warm-up string problem.
// WHERE:   UI rendering layers, form normalization, CMS content pipelines.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice

function titleCase(str) {
  if (str === '') return '';
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

console.log('\nLevel 2 — Title Case');
test('"hello world" → "Hello World"', () => assertEq(titleCase('hello world'), 'Hello World'));
test('"the quick brown fox"', () =>
  assertEq(titleCase('the quick brown fox'), 'The Quick Brown Fox'));
test('already capitalized stays correct', () => assertEq(titleCase('HELLO WORLD'), 'Hello World'));
test('single word', () => assertEq(titleCase('javascript'), 'Javascript'));
test('empty string', () => assertEq(titleCase(''), ''));

// ─── Exercise 3 — Count Character Occurrences ────────────────────────────────
//
// CONCEPT: Linear scan of a string with a counter accumulator
// WHY:     Strings are zero-indexed and support bracket notation for character
//          access (str[i]). A simple for loop scan is O(n) and avoids regex
//          overhead. This pattern is the basis for frequency maps.
// WHEN:    Character frequency analysis, input validation (e.g., counting
//          required fields), anagram detection pre-step.
// WHERE:   Compression algorithms (Huffman coding frequency table),
//          anagram checkers, word-game solvers.
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

function countChar(str, char) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) count++;
  }
  return count;
}

console.log('\nLevel 3 — Count Character Occurrences');
test('"banana", "a" → 3', () => assertEq(countChar('banana', 'a'), 3));
test('"hello", "l" → 2', () => assertEq(countChar('hello', 'l'), 2));
test('"hello", "z" → 0', () => assertEq(countChar('hello', 'z'), 0));
test('empty string → 0', () => assertEq(countChar('', 'a'), 0));
test('"aaa", "a" → 3', () => assertEq(countChar('aaa', 'a'), 3));
test('case sensitive', () => assertEq(countChar('Hello', 'h'), 0));

// ─── Exercise 4 — Simple Template Engine ─────────────────────────────────────
//
// CONCEPT: String.prototype.replace with a regex and a replacer function
// WHY:     The global flag /g on a regex makes .replace() substitute ALL
//          occurrences. Passing a function as the second argument gives you
//          the matched text and capture groups, enabling dynamic lookup in data.
//          This is exactly how template literals, Mustache, and Handlebars work
//          under the hood.
// WHEN:    Generating dynamic text content — emails, HTML snippets, SQL
//          templates, i18n message formatting.
// WHERE:   Handlebars.js, Mustache, i18next interpolation, email templating
//          systems (Mailchimp templates, etc.).
// MDN:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace

function fill(template, data) {
  // Regex: {{ captures the literal braces, (\w+) captures the key name, }}
  // The replacer receives the full match and capture group 1 (the key).
  // If the key isn't in data, return the original match unchanged.
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return key in data ? String(data[key]) : match;
  });
}

console.log('\nLevel 4 — Simple Template Engine');
test('basic substitution', () => assertEq(fill('Hello {{name}}', { name: 'Ali' }), 'Hello Ali'));
test('multiple placeholders', () => assertEq(fill('{{a}} + {{b}}', { a: '1', b: '2' }), '1 + 2'));
test('unknown key left as-is', () => assertEq(fill('Hi {{name}}', {}), 'Hi {{name}}'));
test('no placeholders unchanged', () =>
  assertEq(fill('no placeholders', { x: '1' }), 'no placeholders'));
test('repeated placeholder', () => assertEq(fill('{{x}} and {{x}}', { x: 'yes' }), 'yes and yes'));
test('numeric values', () => assertEq(fill('Age: {{age}}', { age: 30 }), 'Age: 30'));
