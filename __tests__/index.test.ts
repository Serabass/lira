import fs from "fs";
import { Parser } from "../src";

describe("test", () => {
  it("test", async () => {
    let pa = new Parser(fs.readFileSync('example.go', 'utf8'));
    expect(pa).not.toBeNull();
    let res = await pa.parse();
    expect(res).not.toBeNull();
    expect(typeof res).toBe("string");
    console.log(res);
    expect(/Добрый (?:день|вечер), я хочу заказать (?:пиццу|суши|пирог|шаверму|бургер с картошкой)/.test(res)).toBeTruthy();
  });
});
