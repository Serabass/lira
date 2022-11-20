import fs from "fs";
import { Parser } from "../src";

describe("test", () => {
  it("test", async () => {
    let pa = new Parser(fs.readFileSync('example.go', 'utf8'), {}, {
      myFn(a: string) {
        return (+a + 1).toString();
      }
    });

    let res = await pa.parse();
    console.log(res);

    return;
    expect(pa).not.toBeNull();
    expect(res).not.toBeNull();
    expect(typeof res).toBe("string");
    expect(/Добрый (?:день|вечер), я хочу заказать (?:пиццу|суши|пирог|шаверму|бургер с картошкой)/.test(res)).toBeTruthy();
  });
});
