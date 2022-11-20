import { Parser } from ".";
import fs from "fs";

~(async () => {
  let pa = new Parser(fs.readFileSync('example2.go', 'utf8'), {}, {
    myFn(a: string) {
      return +a + 1;
    }
  });

  let res = await pa.parse();
  console.log(res);

  return;
})();
