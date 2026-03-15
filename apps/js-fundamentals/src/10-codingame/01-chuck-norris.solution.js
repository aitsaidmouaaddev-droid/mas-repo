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

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  CodingGame — Chuck Norris (Easy)                                        ║
// ║  https://www.codingame.com/training/easy/chuck-norris                    ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

// ─── CONCEPT ─────────────────────────────────────────────────────────────────
// Run-length encoding over a binary string.
// This problem exercises three fundamental sub-skills at once:
//   1. Character encoding — charCodeAt + toString(2) + padStart
//   2. Run-length compression — split a flat string into "runs" of same chars
//   3. String/array construction — map + join to produce the output format
//
// WHY: Binary encoding questions appear everywhere: network protocols, data
//      compression, encoding schemes (UTF-8, Base64). Interviews test whether
//      you understand that characters are numbers and can transform between
//      representations.
//
// WHEN: Any time you need to process a string character by character and
//      group/transform its parts: tokenisation, lexing, run-length compression,
//      barcode/QR generation, etc.
//
// WHERE: Competitive programming, FAANG-style coding screens, system design
//        discussions around serialisation.
//
// MDN:
//   String.prototype.charCodeAt  → https://mdn.io/charCodeAt
//   Number.prototype.toString    → https://mdn.io/toString (radix param)
//   String.prototype.padStart    → https://mdn.io/padStart
//   Array.prototype.join         → https://mdn.io/join
//   String.prototype.match       → https://mdn.io/match  (regex capture groups)
// ─────────────────────────────────────────────────────────────────────────────

// ── Step 1 — charToBinary(char) ───────────────────────────────────────────────
//
// CONCEPT: charCodeAt(0) gives the Unicode code point (= ASCII for printable
// ASCII chars). toString(2) converts that integer to its base-2 string.
// padStart(7, '0') left-pads to exactly 7 digits because standard ASCII chars
// only need 7 bits (code points 0–127).
//
// Interview variation: "What if we needed 8 bits (extended ASCII / Latin-1)?"
//   → change padStart(7) to padStart(8). UTF-16 code units can need up to 16.
function charToBinary(char) {
  return char.charCodeAt(0).toString(2).padStart(7, '0');
}

console.log('\nStep 1 — charToBinary');
test("charToBinary('A') → '1000001'", () => assertEq(charToBinary('A'), '1000001'));
test("charToBinary('C') → '1000011'", () => assertEq(charToBinary('C'), '1000011'));
test("charToBinary(' ') → '0100000'", () => assertEq(charToBinary(' '), '0100000'));
test("charToBinary('%') → '0100101'", () => assertEq(charToBinary('%'), '0100101'));

// ── Step 1b — toBinary(message) ───────────────────────────────────────────────
//
// CONCEPT: split('') turns the string into an array of single-character
// strings, map converts each to a 7-bit binary string, join concatenates them.
// This is a clean functional pipeline: transform → collect.
function toBinary(message) {
  return message.split('').map(charToBinary).join('');
}

console.log('\nStep 1 — toBinary');
test("toBinary('CC') → '10000111000011'", () => assertEq(toBinary('CC'), '10000111000011'));
test("toBinary('A')  → '1000001'", () => assertEq(toBinary('A'), '1000001'));

// ── Step 2 — getRuns(binary) ──────────────────────────────────────────────────
//
// CONCEPT: A "run" is a maximal sequence of identical consecutive characters.
// We split the flat binary string into such runs using a regex.
//
// The regex /(.)\1*/g does exactly this:
//   (.)   — capture group: match any single character (the "current" bit)
//   \1*   — zero or more repetitions of the SAME character (backreference)
//   /g    — global flag: find ALL non-overlapping matches
//
// match() with /g returns an array of the matched substrings directly.
//
// Alternative iterative approach (same logic, explicit):
//   let runs = [], i = 0;
//   while (i < binary.length) {
//     let j = i;
//     while (j < binary.length && binary[j] === binary[i]) j++;
//     runs.push(binary.slice(i, j));
//     i = j;
//   }
//   return runs;
//
// Both are O(n). The regex version is idiomatic JavaScript for this shape of
// problem. The iterative version is clearer in interviews where you might need
// to explain each step.
function getRuns(binary) {
  return binary.match(/(.)\1*/g);
}

console.log('\nStep 2 — getRuns');
test("'10000111000011' → 5 runs", () => {
  const runs = getRuns('10000111000011');
  assertEq(runs.length, 5);
  assertEq(runs[0], '1');
  assertEq(runs[1], '0000');
  assertEq(runs[2], '111');
  assertEq(runs[3], '0000');
  assertEq(runs[4], '11');
});
test("single bit '0' → ['0']", () => {
  const runs = getRuns('0');
  assertEq(runs.length, 1);
  assertEq(runs[0], '0');
});

// ── Step 3 — chuckNorris(message) (full solution) ─────────────────────────────
//
// CONCEPT: Compose the three steps into a pipeline:
//   message → binary string → runs array → encoded blocks → final string
//
// Encoding rule per run:
//   bit === '1'  →  "0"  + " " + "0".repeat(run.length)
//   bit === '0'  →  "00" + " " + "0".repeat(run.length)
//
// The blocks are then joined with a single space.
//
// COMPLEXITY: O(n) time, O(n) space where n = message.length × 7.
// Every character expands to at most 7 bits; the encoding can only grow the
// representation (this is an expansion cipher, not a compression scheme).
//
// EDGE CASES to mention in an interview:
//   • Empty string          → empty string (no runs to encode)
//   • Single character      → 1–7 runs depending on its binary representation
//   • All same character    → single run
//   • Very long strings     → still O(n), no stack pressure, safe
function chuckNorris(message) {
  const binary = toBinary(message); // step 1
  const runs = getRuns(binary); // step 2
  return runs // step 3
    .map((run) => (run[0] === '1' ? '0' : '00') + ' ' + '0'.repeat(run.length))
    .join(' ');
}

console.log('\nFinal — chuckNorris');
test("chuckNorris('CC') → '0 0 00 0000 0 000 00 0000 0 00'", () =>
  assertEq(chuckNorris('CC'), '0 0 00 0000 0 000 00 0000 0 00'));
test("chuckNorris('A')  → '0 0 00 00000 0 0'", () =>
  assertEq(chuckNorris('A'), '0 0 00 00000 0 0'));
test("chuckNorris('%')  encodes 0100101", () =>
  assertEq(chuckNorris('%'), '00 0 0 0 00 00 0 0 00 0 0 0'));
test("chuckNorris(' ')  encodes 0100000", () => assertEq(chuckNorris(' '), '00 0 0 0 00 00000'));
