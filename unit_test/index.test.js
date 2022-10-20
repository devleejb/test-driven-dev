const { faker } = require("@faker-js/faker");
const sut = require("."); // System Under Test

// Version 1
test('sut transforms "hello  world" to "hello world', () => {
  const actual = sut("hello  world");
  expect(actual).toBe("hello world");
});

test('sut transforms "hello    world" to "hello world', () => {
  const actual = sut("hello    world");
  expect(actual).toBe("hello world");
});

test('sut transforms "hello   world" to "hello world', () => {
  const actual = sut("hello   world");
  expect(actual).toBe("hello world");
});

// Version 2
test("sut correctly works", () => {
  for (const source of ["hello  world", "hello   world", "hello    world"]) {
    const actual = sut(source);

    expect(actual).toBe("hello world");
  }
});
// 코드 작성의 비용 감소
// 피드백 품질 저하 : 어떠한 인풋에서 테스트가 실패했는지 알 수 없음
// 하나의 테스트 케이스에서 실패하면 이후의 케이스를 실행하지 않음

// Version 3
test.each`
  source                 | expected
  ${"hello  world"}      | ${"hello world"}
  ${"hello   world"}     | ${"hello world"}
  ${"hello    world"}    | ${"hello world"}
  ${"hello     world"}   | ${"hello world"}
  ${"hello      world"}  | ${"hello world"}
  ${"hello       world"} | ${"hello world"}
`('sut transforms "$source" to "$expected"', ({ source, expected }) => {
  const actual = sut(source);

  expect(actual).toBe(expected);
});
// Parameterized Test

test.each`
  source             | expected
  ${"hello\t world"} | ${"hello world"}
  ${"hello \tworld"} | ${"hello world"}
`(
  'sut transforms "$source" that contains tab character to "$expected"',
  ({ source, expected }) => {
    const actual = sut(source);

    expect(actual).toBe(expected);
  }
);

test.each`
  source             | bannedWords              | expected
  ${"hello mockist"} | ${["mockist", "purist"]} | ${"hello *******"}
  ${"hello purist"}  | ${["mockist", "purist"]} | ${"hello ******"}
`(
  'sut transforms "$source" to "$expected',
  ({ source, expected, bannedWords }) => {
    const actual = sut(source, { bannedWords: [bannedWords] });

    expect(actual).toBe(expected);
  }
);

describe("given banned word", () => {
  const bannedWord = faker.lorem.word();
  const source = "hello " + bannedWord;
  const expected = "hello " + "*".repeat(bannedWord.length);

  test(`${bannedWord} when invoke sut then it returns ${expected}`, () => {
    const actual = sut(source, { bannedWords: [bannedWord] });

    expect(actual).toBe(expected);
  });
});
