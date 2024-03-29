
export type DocVariables = { [name: string]: any };
export type DocPredefinedFunctions = { [name: string]: (...args: string[]) => any };

export interface IRandom {
  bool(): boolean;
  integer(min: number, max: number): number;
  pick<T>(source: T[]): T;
  shuffle<T>(source: T[]): T[];
}

export class Parser<V extends DocVariables, F extends DocPredefinedFunctions> {
  public static instance = <V extends DocVariables, F extends DocPredefinedFunctions>(
    random: IRandom,
    input: string,
    variables: V,
    funcs: F
  ) => new Parser<V, F>(random, input, variables, funcs);

  private document: any;
  private parser: any;

  public constructor(
    public random: IRandom,
    public input: string,
    public variables?: V,
    public funcs?: F
  ) {
    this.parser = require("./grammar.js");
    this.document = this.parser.parse(this.input);
  }

  public pick<T>(source: T[]): T {
    let n = this.random.integer(0, 20);
    for (let i = 0; i < n; i++) {
      source = this.random.shuffle(source);
    }
    let a = this.random.shuffle(source);
    return this.random.pick(a);
  }

  public parse() {
    try {
      return this.parseDocument();
    } catch (err: any) {
      console.log(err);
    }
  }

  public async parseDocument() {
    let el: any = this.pick(this.document.elements);

    switch (el.type) {
      case "Block":
        return this.parseBlock(el);
    }

    throw new Error(`Unknown element type: ${el.type}`);
  }

  public async parseBlock(block: any) {
    switch (block.type) {
      case "Block":
        return (
          await Promise.all(
            block.statements.map((s: any) => this.parseBlockStatement(s, block))
          )
        ).join("");

      case "ArrayBlock":
        // Было так:
        let els = await Promise.all(
          block.elements.map((s: any) => this.parseBlock(s))
        );
        return this.pick(els);

      // Второй вариант:
      // let el = this.pick(block.elements);
      // return this.parseBlock(el);

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
        let count = this.random.integer(block.count.min, block.count.max);
        return this.pick<string>(block.list).repeat(count);

      case "InlineList":
        let e = this.pick<any>(block.value);

        if (!e) {
          return "";
        }

        return e.value;

      case "Variable":
        let varName = block.name.name;
        if (block.optional) {
          let b = this.random.bool();
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