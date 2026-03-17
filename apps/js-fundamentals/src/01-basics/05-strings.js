// ─── Runner ───────────────────────────────────────────────────────────────────
function test(label, fn) {
  try {
    fn();
    console.log(`  ✅  ${label}`);
  } catch (e) {
    console.log(`  ❌  ${label}\n       → ${e.message}`);
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg ?? 'assertion failed');
}
function assertEq(a, b) {
  if (a !== b) throw new Error(`expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

function assertDeepEq(a, b) {
  const s = JSON.stringify;
  if (s(a) !== s(b)) throw new Error(`expected ${s(b)}, got ${s(a)}`);
}

// ═══ LEVEL 1 — Rookie ════════════════════════════════════════════════════════
// Exercise 1 — isPalindrome
// Return true if the string reads the same forwards and backwards.
// Ignore case. Assume input contains only letters and digits.
// Input: str — string
// Output: boolean
function isPalindrome(str) {
  // YOUR CODE HERE
}

console.log('\nLevel 1 — isPalindrome');
test('"racecar" is palindrome', () => assert(isPalindrome('racecar')));
test('"hello" is not palindrome', () => assert(!isPalindrome('hello')));
test('single char is palindrome', () => assert(isPalindrome('a')));
test('empty string is palindrome', () => assert(isPalindrome('')));
test('case-insensitive "Racecar"', () => assert(isPalindrome('Racecar')));
test('"A" is palindrome', () => assert(isPalindrome('A')));
test('"ab" is not palindrome', () => assert(!isPalindrome('ab')));

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 2 — Apprentice ════════════════════════════════════════════════════
// Exercise 2 — Title Case
// Capitalize the first letter of each word, lowercase the rest.
// Words are separated by a single space.
// Input: str — string
// Output: string
function titleCase(str) {
  // YOUR CODE HERE
}

console.log('\nLevel 2 — Title Case');
test('"hello world" → "Hello World"', () => assertEq(titleCase('hello world'), 'Hello World'));
test('"the quick brown fox"', () =>
  assertEq(titleCase('the quick brown fox'), 'The Quick Brown Fox'));
test('already capitalized stays correct', () => assertEq(titleCase('HELLO WORLD'), 'Hello World'));
test('single word', () => assertEq(titleCase('javascript'), 'Javascript'));
test('empty string', () => assertEq(titleCase(''), ''));

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 3 — Journeyman ════════════════════════════════════════════════════
// Exercise 3 — Count Character Occurrences
// Count how many times a character appears in a string.
// No regex allowed — use a loop.
// Input: str — string, char — single character
// Output: number
function countChar(str, char) {
  // YOUR CODE HERE
}

console.log('\nLevel 3 — Count Character Occurrences');
test('"banana", "a" → 3', () => assertEq(countChar('banana', 'a'), 3));
test('"hello", "l" → 2', () => assertEq(countChar('hello', 'l'), 2));
test('"hello", "z" → 0', () => assertEq(countChar('hello', 'z'), 0));
test('empty string → 0', () => assertEq(countChar('', 'a'), 0));
test('"aaa", "a" → 3', () => assertEq(countChar('aaa', 'a'), 3));
test('case sensitive', () => assertEq(countChar('Hello', 'h'), 0));

// ─────────────────────────────────────────────────────────────────────────────

// ═══ LEVEL 4 — Expert ════════════════════════════════════════════════════════
// Exercise 4 — Simple Template Engine
// Replace all {{key}} placeholders in a template string with values from data.
// Unknown keys should be left as-is (do not remove them).
// Input: template — string with {{key}} placeholders, data — plain object
// Output: string with placeholders replaced
function fill(template, data) {
  // YOUR CODE HERE
}

console.log('\nLevel 4 — Simple Template Engine');
test('basic substitution', () => assertEq(fill('Hello {{name}}', { name: 'Ali' }), 'Hello Ali'));
test('multiple placeholders', () => assertEq(fill('{{a}} + {{b}}', { a: '1', b: '2' }), '1 + 2'));
test('unknown key left as-is', () => assertEq(fill('Hi {{name}}', {}), 'Hi {{name}}'));
test('no placeholders unchanged', () =>
  assertEq(fill('no placeholders', { x: '1' }), 'no placeholders'));
test('repeated placeholder', () => assertEq(fill('{{x}} and {{x}}', { x: 'yes' }), 'yes and yes'));
test('numeric values', () => assertEq(fill('Age: {{age}}', { age: 30 }), 'Age: 30'));
