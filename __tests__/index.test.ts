import { Parser } from "../src";
import { Random, nodeCrypto } from 'random-js';

// class MyEngine implements Engine {
//   next(): number {
//     nodeCrypto.next();
//     return Date.now() % Number.MAX_SAFE_INTEGER;
//   }
// }

// let my = new MyEngine();

export const random = new Random(nodeCrypto); //  new Random(nodeCrypto); or uses the nativeMath engine

describe("test", () => {
  it("test 1", async () => {
    let pa = new Parser(random,
      `
    [
      - Добрый <день|вечер>, я хочу заказать :food, :myFn[1] {
        :food = [
          - пиццу
          - суши
          - пирог
          - шаверму
          - бургер :burger {
            :burger = [
              - с картошкой
            ]
          }
        ]
      }
    ]
    `,
      {},
      {
        myFn(a: string) {
          return (+a + 1).toString();
        },
      }
    );

    let res = await pa.parse();
    expect(pa).not.toBeNull();
    expect(res).not.toBeNull();
    expect(typeof res).toBe("string");
    let rgx =
      /^Добрый (?:день|вечер), я хочу заказать (?:пиццу|суши|пирог|шаверму|бургер с картошкой ), 2 $/;
    expect(res).toMatch(rgx);
  });

  it("test 2", async () => {
    let pa = new Parser(random,
      `
    [
      - :myFn[111]
      - :myFn[112]
    ]
    `,
      {},
      {
        myFn(a: string) {
          return (+a + 1).toString();
        },
      }
    );

    let res = await pa.parse();
    expect(pa).not.toBeNull();
    expect(res).not.toBeNull();
    expect(typeof res).toBe("string");
    expect(/^11[23]$/.test(res)).toBeTruthy();
  });

  it("test 3", async () => {
    let pa = new Parser(random,
      `
    [
      - :myFn[111] :v {
        :v = [
          - 1
          - 2
          - 3
        ]
      }
    ]
    `,
      {},
      {
        myFn(a: string) {
          return (+a + 1).toString();
        },
      }
    );

    let res = await pa.parse();
    expect(pa).not.toBeNull();
    expect(res).not.toBeNull();
    expect(typeof res).toBe("string");
    console.log(`"${res}"`);
    expect(/^112 [123] $/.test(res)).toBeTruthy();
  });

  it("comment", async () => {
    let pa = new Parser(random,
      `
      // comment
    [
      - :v 1 {
        :v = [
          - 11
          - 22
          - 33
        ]
      }
    ]
    `,
      {},
    );

    let res = await pa.parse();
    expect(pa).not.toBeNull();
    expect(res).not.toBeNull();
    expect(typeof res).toBe("string");
    expect(/^[123]+ 1 $/.test(res)).toBeTruthy();
  });

  it("comment", async () => {
    let pa = new Parser(random,
      `
    [
      // comment
      - :v 1 {
        :v = [
          - 11
          - 22
          - 33
        ]
      }
    ]
    `,
      {},
    );

    let res = await pa.parse();
    expect(pa).not.toBeNull();
    expect(res).not.toBeNull();
    expect(typeof res).toBe("string");
    expect(/^[123]+ 1 $/.test(res)).toBeTruthy();
  });

  it("comment", async () => {
    let pa = new Parser(random,
      `
    [
      - :v 1 {
        // comment
        :v = [
          - 11
          - 22
          - 33
        ]
      }
    ]
    `,
      {},
    );

    let res = await pa.parse();
    expect(pa).not.toBeNull();
    expect(res).not.toBeNull();
    expect(typeof res).toBe("string");
    expect(/^[123]+ 1 $/.test(res)).toBeTruthy();
  });

  it("comment", async () => {
    let pa = new Parser(random,
      `
    [
      - :v 1 {
        :v = [
          // comment
          - 11
          - 22
          - 33
        ]
      }
    ]
    `,
      {},
    );

    let res = await pa.parse();
    expect(pa).not.toBeNull();
    expect(res).not.toBeNull();
    expect(typeof res).toBe("string");
    expect(/^[123]+ 1 $/.test(res)).toBeTruthy();
  });
});
