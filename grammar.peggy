{
  function filledArray(count, value) {
    return Array.apply(null, new Array(count))
      .map(function() { return value; });
  }

  function extractOptional(optional, index) {
    return optional ? optional[index] : null;
  }

  function extractList(list, index) {
    return list.map(function(element) { return element[index]; });
  }

  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index));
  }

  function buildBinaryExpression(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        type: "BinaryExpression",
        operator: element[1],
        left: result,
        right: element[3]
      };
    }, head);
  }

  function buildLogicalExpression(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        type: "LogicalExpression",
        operator: element[1],
        left: result,
        right: element[3]
      };
    }, head);
  }

  function optionalList(value) {
    return value !== null ? value : [];
  }
}

Document
  = _ array: ArrayBlock _ {
    return array;
  }

Expression 'expression'
  = ArrayBlock
  / Block

ArrayBlock
  = ArrayBlockNumberRange
  / ArrayBlockMultiline

ArrayBlockNumberRange 'array block number range'
  = '[[' _ start:ArrayElement _ '..' _ end:ArrayElement _ ']]' {
    return {
      type: "ArrayBlock",
      start: start,
      end: end
    };
  }

ArrayBlockMultiline 'array block'
  = _ '[' _ elements: ArrayElement* _ ']' {
    return {
      type: "ArrayBlock",
      elements: elements
    };
  }

  ArrayElement
    = _ "-" __ element:Block {
      return element;
    }

Block 'block'
  = statements: Statement+ body: BlockBody? _ {
    return {
      type: "Block",
      statements: statements,
      body: body,
    };
  }

  BlockBody 'block body'
    = '{' _ vars: VariableAssignmentList _ stmts: Statement* _ '}' {
      return {
        type: "BlockBody",
        variables: vars,
        statements: stmts
      };
    }

  BlockDelimiter = _ NL+ _

VariableAssignmentList
  = head: VariableAssignment tail: (_ VariableAssignment)* {
    return buildList(head, tail, 1);
  }

VariableAssignment 'variable assignment'
  = variable: Variable _ '=' _ value:Expression {
    return {
      type: "VariableAssignment",
      variable: variable,
      value: value
    };
  }

Statement 'statement'
  = CharList
  / Function
  / Variable
  / InlineList
  / Text

Variable 'variable'
  = ":" optional:QuestionMark? name: Identifier {
    return {
      type: "Variable",
      optional: !!optional,
      name: name
    };
  }

Function 'function'
  = ":" name: Identifier "[" args: FunctionArguments "]" {
    return {
      type: "Function",
      name: name,
      arguments: args
    };
  }

  FunctionArguments
    = head: Text tail: (";" Text)* {
      return buildList(head, tail, 1);
    }

QuestionMark = "?"

InlineList 'inline list'
  = "<" head:Statement? tail:("|" Statement?)* ">" {
    return {
      type: "InlineList",
      value: buildList(head, tail, 1),
    };
  }

CharList 'char list'
  = "[" head:Char tail: Char* count: CharListCount? "]" {
    return {
      type: "CharList",
      list: buildList(head, tail, 0),
      count: count ?? {
        type: "CharListCount",
        min: 1,
        max: 1
      }
    };
  }

CharListCount
  = ":" min:Integer "-" max:Integer {
    return {
      type: "CharListCount",
      min: min,
      max: max
    };
  }
  / ":" max: Integer {
    return {
      type: "CharListCount",
      min: 0,
      max: max
    };
  }

Identifier 'identifier'
  = [a-zA-Z_][a-zA-Z0-9_]* {
    return {
      type: "Identifier",
      name: text()
    };
  }

Text 'text'
  = chars: Char+ {
    return {
      type: "Text",
      value: chars.join("")
    };
  }

Char 'char'
  = [^:\[\]{}\|\r\n<>;#]

Integer
  = [0-9]+ {
    return parseInt(text(), 10);
  }

_ = Whitespace*
__ = Whitespace+

Whitespace = [ \t\r\n]+
    / Comment

NL 'newline'
  = "\r\n"
  / "\r"
  / "\n"

EOF 'end of file'
  = !.

//////////////////////////////////////////////////////////

Comment "comment"
  = MultiLineComment
  / SingleLineComment

SingleLineComment
  = "//" (!LineTerminator Char)*

MultiLineComment
  = "/*" (!"*/" Char)* "*/"

MultiLineCommentNoLineTerminator
  = "/*" (!("*/" / LineTerminator) Char)* "*/"

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"
