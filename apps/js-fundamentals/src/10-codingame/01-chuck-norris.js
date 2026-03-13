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

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  CodingGame — Chuck Norris (Easy)                                        ║
// ║  https://www.codingame.com/training/easy/chuck-norris                    ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
//
// Chuck Norris communicates using a primitive version of unary coding.
//
// HOW IT WORKS
// ────────────
// Step 1 — Convert the message to binary.
//   Each character → its 7-bit ASCII code (zero-padded on the left).
//   Concatenate all 7-bit strings.
//
//   Example: "CC"
//     'C' = 67 → 1000011
//     'C' = 67 → 1000011
//     binary = "10000111000011"
//
// Step 2 — Split into runs of consecutive identical bits.
//   "10000111000011" → ['1','0000','111','0000','11']
//
// Step 3 — Encode each run:
//   A run of 1-bits  → "0 "  followed by one '0' per bit in the run.
//   A run of 0-bits  → "00 " followed by one '0' per bit in the run.
//   Blocks are separated by a single space.
//
//   ['1','0000','111','0000','11'] →
//     "1"      → "0 0"
//     "0000"   → "00 0000"
//     "111"    → "0 000"
//     "0000"   → "00 0000"
//     "11"     → "0 00"
//   result = "0 0 00 0000 0 000 00 0000 0 00"
//
// ─────────────────────────────────────────────────────────────────────────────

// Exercise 1 — charToBinary(char)
// Convert a single character to its 7-bit binary string.
//
// charToBinary('A') → '1000001'
// charToBinary(' ') → '0100000'
function charToBinary(char) {
  // YOUR CODE HERE
}

console.log('\nStep 1 — charToBinary');
test("charToBinary('A') → '1000001'", () => assertEq(charToBinary('A'), '1000001'));
test("charToBinary('C') → '1000011'", () => assertEq(charToBinary('C'), '1000011'));
test("charToBinary(' ') → '0100000'", () => assertEq(charToBinary(' '), '0100000'));
test("charToBinary('%') → '0100101'", () => assertEq(charToBinary('%'), '0100101'));

// Exercise 2 — toBinary(message)
// Convert an entire string to its concatenated 7-bit binary representation.
//
// toBinary('CC') → '10000111000011'
function toBinary(message) {
  // YOUR CODE HERE
}

console.log('\nStep 1 — toBinary');
test("toBinary('CC') → '10000111000011'", () => assertEq(toBinary('CC'), '10000111000011'));
test("toBinary('A')  → '1000001'", () => assertEq(toBinary('A'), '1000001'));

// Exercise 3 — getRuns(binary)
// Split a binary string into an array of consecutive same-bit runs.
//
// getRuns('10000111000011') → ['1', '0000', '111', '0000', '11']
function getRuns(binary) {
  // YOUR CODE HERE
  // Hint: use a regex or iterate character by character, grouping identical
  //       consecutive characters together.
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

// Exercise 4 — chuckNorris(message)
// Full encoding: convert message → binary → runs → unary encoding.
//
// chuckNorris('CC') → '0 0 00 00000 0 00 00 000 0 00'
// chuckNorris('A')  → '0 0 00 0 0 000 00 00 00 0'
function chuckNorris(message) {
  // YOUR CODE HERE
}

console.log('\nFinal — chuckNorris');
test("chuckNorris('CC') → '0 0 00 0000 0 000 00 0000 0 00'", () =>
  assertEq(chuckNorris('CC'), '0 0 00 0000 0 000 00 0000 0 00'));
test("chuckNorris('A')  → '0 0 00 00000 0 0'", () =>
  assertEq(chuckNorris('A'), '0 0 00 00000 0 0'));
test("chuckNorris('%')  encodes 0100101", () => {
  // 0100101 → runs: 0, 1, 00, 1, 0, 1
  // 0→"00 0" 1→"0 0" 00→"00 00" 1→"0 0" 0→"00 0" 1→"0 0"
  assertEq(chuckNorris('%'), '00 0 0 0 00 00 0 0 00 0 0 0');
});
test("chuckNorris(' ')  encodes 0100000", () => assertEq(chuckNorris(' '), '00 0 0 0 00 00000'));
