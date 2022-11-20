import { Parser } from "../src";

describe("test", () => {
  it("test 1", async () => {
    let pa = new Parser(
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
      /^Добрый (?:день|вечер), я хочу заказать (?:пиццу|суши|пирог|шаверму|бургер с картошкой), 2$/;
    expect(rgx.test(res.trim())).toBeTruthy();
  });

  it("test 2", async () => {
    let pa = new Parser(
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
    let pa = new Parser(
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
    expect(/^112 [123]$/.test(res)).toBeTruthy();
  });
});
