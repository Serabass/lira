"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
describe("test", () => {
    it("test", () => __awaiter(void 0, void 0, void 0, function* () {
        let pa = new src_1.Parser(`[
        - Добрый день, я хочу заказать пиццу
        - Добрый день, я хочу заказать шаверму
      ]`);
        expect(pa).not.toBeNull();
        let res = yield pa.parse();
        expect(res).not.toBeNull();
        expect(typeof res).toBe("string");
    }));
});
//# sourceMappingURL=index.test.js.map