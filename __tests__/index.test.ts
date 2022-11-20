import { Parser } from "../src";

describe("test", () => {
  it("test", async () => {
    let pa = new Parser(
      `[
        - Добрый день, я хочу заказать пиццу
        - Добрый день, я хочу заказать шаверму
      ]`
    );
    expect(pa).not.toBeNull();
    let res = await pa.parse();
    expect(res).not.toBeNull();
    expect(typeof res).toBe("string");
    expect(res.startsWith("Добрый день")).toBeTruthy();
  });
});
