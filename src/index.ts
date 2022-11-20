import peggy from "peggy";
import fs from "fs";
import path from "path";
import { random, pick } from "./random";

function coin() {
  return random.bool();
}

type DocVariables = { [name: string]: any };
type DocPredefinedFunctions = { [name: string]: any };

export class Parser {
  public static instance(
    id: string,
    variables: DocVariables,
    funcs: DocPredefinedFunctions
  ) {
    return new Parser(id, variables, funcs);
  }

  private document: any;
  private parser: any;

  public constructor(
    public id: string,
    public variables: DocVariables,
    public funcs: DocPredefinedFunctions
  ) {
    let p = path.join("data/grammars", `${id}.go`);
    this.parser = peggy.generate(fs.readFileSync("grammar2.peggy", "utf8"));
    this.document = this.parser.parse(fs.readFileSync(p, "utf8"));
  }

  public parse() {
    try {
      return this.parseDocument();
    } catch (err: any) {
      console.log(err);
    }
  }

  public async parseDocument() {
    let el: any = pick(this.document.elements);

    switch (el.type) {
      case "Block":
        return this.parseBlock(el);
    }

    throw new Error(`Unknown element type: ${el.type}`);
  }

  public async parseBlock(block: any) {
    switch (block.type) {
      case "Block":
        return (await Promise.all(
          block.statements
            .map((s: any) => this.parseBlockStatement(s, block))
        )).join("");

      case "ArrayBlock":
        let els = await Promise.all(
          block.elements.map((s: any) => this.parseBlock(s))
        );
        return pick(els);

      case "Text":
        return block.value;
    }

    throw new Error(`Unknown block type: ${block.type}`);
  }

  public async parseBlockStatement(block: any, el: any) {
    switch (block.type) {
      case "Text":
        return block.value;

      case "CharList":
        let count = random.integer(block.count.min, block.count.max);
        return pick<string>(block.list).repeat(count);

      case "InlineList":
        let e = pick<any>(block.value);

        if (!e) {
          return "";
        }

        return e.value;

      case "Variable":
        let varName = block.name.name;
        if (block.optional) {
          let b = coin();
          if (!b) {
            return "";
          }
        }

        let found = el.body?.variables
          ?.filter((v: any) => v.type === "VariableAssignment")
          ?.find((v: any) => v.variable.name.name === varName)?.value;

        if (!found) {
          if (!this.variables[varName]) {
            throw new Error(`Variable ${varName} not found`);
          }
          return this.variables[varName];
        }

        if (!found) {
          throw new Error(`Variable ${varName} not found`);
        }

        return this.parseBlock(found);

      case "Function":
        let name: string = block.name.name;
        let args = await Promise.all(
          block.arguments.map((a: any) => this.parseBlock(a))
        );

        if (!this.funcs[name]) {
          throw new Error(`Function ${name} not found`);
        }

        let fn = this.funcs[name];

        return fn(...args);
    }

    throw new Error(`Unknown block type: ${block.type}`);
  }
}

export function parse(id: string, vars: any, preserve: boolean = false) {
  if (preserve) {
    id = "random";
  }

  return Parser.instance(id, vars, {
    async randomInt(from: string, to: string) {
      return random.integer(+from, +to);
    },
    async randomFloat(from: string, to: string) {
      return random.real(+from, +to);
    },
  }).parse();
}
