// operator table
var ops = {
  "+": {
    op: "+",
    precedence: 10,
    assoc: "L",
    exec: function (l, r) {
      return l + r;
    },
  },
  "-": {
    op: "-",
    precedence: 10,
    assoc: "L",
    exec: function (l, r) {
      return l - r;
    },
  },
  "*": {
    op: "*",
    precedence: 20,
    assoc: "L",
    exec: function (l, r) {
      return l * r;
    },
  },
  "/": {
    op: "/",
    precedence: 20,
    assoc: "L",
    exec: function (l, r) {
      return l / r;
    },
  },
  "**": {
    op: "**",
    precedence: 30,
    assoc: "R",
    exec: function (l, r) {
      return Math.pow(l, r);
    },
  },
};

// constants or variables
var vars = { e: Math.exp(1), pi: Math.atan2(1, 1) * 4 };

// input for parsing
// var r = { string: '123.45+33*8', offset: 0 };
// r is passed by reference: any change in r.offset is returned to the caller
// functions return the parsed/calculated value
function parseVal(r) {
  console.log(r)
  var startOffset = r.offset;
  var value;
  var m;
  // floating point number
  // example of parsing ("lexing") without aid of regular expressions
  value = 0;
  while (
    "0123456789".indexOf(r.string.substr(r.offset, 1)) >= 0 &&
    r.offset < r.string.length
  )
    r.offset++;
  if (r.string.substr(r.offset, 1) == ".") {
    r.offset++;
    while (
      "0123456789".indexOf(r.string.substr(r.offset, 1)) >= 0 &&
      r.offset < r.string.length
    )
      r.offset++;
  }
  if (r.offset > startOffset) {
    // did that work?
    // OK, so I'm lazy...
    return parseFloat(r.string.substr(startOffset, r.offset - startOffset));
  } else if (r.string.substr(r.offset, 1) == "+") {
    // unary plus
    r.offset++;
    return parseVal(r);
  } else if (r.string.substr(r.offset, 1) == "-") {
    // unary minus
    r.offset++;
    return negate(parseVal(r));
  } else if (r.string.substr(r.offset, 1) == "(") {
    // expression in parens
    r.offset++; // eat "("
    value = parseExpr(r);
    if (r.string.substr(r.offset, 1) == ")") {
      r.offset++;
      return value;
    }
    r.error = "Parsing error: ')' expected";
    throw "parseError";
  } else if ((m = /^[a-z_][a-z0-9_]*/i.exec(r.string.substr(r.offset)))) {
    // variable/constant name
    // sorry for the regular expression, but I'm too lazy to manually build a varname lexer
    var name = m[0]; // matched string
    r.offset += name.length;
    if (name in vars) return vars[name]; // I know that thing!
    r.error = "Semantic error: unknown variable '" + name + "'";
    throw "unknownVar";
  } else {
    if (r.string.length == r.offset) {
      r.error = "Parsing error at end of string: value expected";
      throw "valueMissing";
    } else {
      r.error = "Parsing error: unrecognized value";
      throw "valueNotParsed";
    }
  }
}

function negate(value) {
  return -value;
}

function parseOp(r) {
  if (r.string.substr(r.offset, 2) == "**") {
    r.offset += 2;
    return ops["**"];
  }
  if ("+-*/".indexOf(r.string.substr(r.offset, 1)) >= 0)
    return ops[r.string.substr(r.offset++, 1)];
  return null;
}

function parseExpr(r) {
  console.log(r)
  var stack = [{ precedence: 0, assoc: "L" }];
  var op;
  var value = parseVal(r); // first value on the left
  for (;;) {
    op = parseOp(r) || { precedence: 0, assoc: "L" };
    while (
      op.precedence < stack[stack.length - 1].precedence ||
      (op.precedence == stack[stack.length - 1].precedence && op.assoc == "L")
    ) {
      // precedence op is too low, calculate with what we've got on the left, first
      var tos = stack.pop();
      if (!tos.exec) return value; // end  reached
      // do the calculation ("reduce"), producing a new value
      value = tos.exec(tos.value, value);
    }
    // store on stack and continue parsing ("shift")
    stack.push({
      op: op.op,
      precedence: op.precedence,
      assoc: op.assoc,
      exec: op.exec,
      value: value,
    });
    console.log(stack)
    value = parseVal(r); // value on the right
  }
}

function parse(string) {
  // wrapper
  var r = { string: string, offset: 0 };
  try {
    var value = parseExpr(r);
    if (r.offset < r.string.length) {
      r.error = "Syntax error: junk found at offset " + r.offset;
      throw "trailingJunk";
    }
    return value;
  } catch (e) {
    console.log(e)
    alert(
      r.error +
        " (" +
        e +
        "):\n" +
        r.string.substr(0, r.offset) +
        "<*>" +
        r.string.substr(r.offset)
    );
    return;
  }
}


console.log(parse("1+1*(5-7)"))