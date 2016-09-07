function processToken(o1, operators) {
  const [o2, ...rest] = operators;

  if (o2 && compare(o1, o2)) {
    const [result, nextOps] = processToken(o1, rest);

    return [[o2].concat(result), nextOps];
  } else {
    return [[], [o1].concat(operators)];
  }
}

var opsDef = [['-', '+'], ['*', '/']];
function compare(o1, o2) {
  return findPriv(o1) <= findPriv(o2);
}

function findPriv(o) {
  return opsDef.findIndex(function (v, i) {
    return v.includes(o);
  });
}

function convert(input = [], operators = []) {
  const [token, ...rest] = input;

  if (token === undefined) {
    return operators;
  };

  if (/^\d+$/.test(token)) {
    return [parseInt(token)].concat(convert(rest, operators));
  } else {
    const [nextValues, nextOperators] = processToken(token, operators);

    return nextValues.concat(convert(rest, nextOperators));
  }
}

const fns = {
  '+': a => b => a + b,
  '-': a => b => a - b,
  '*': a => b => a * b,
  '/': a => b => a / b
};

function isOperator(i) {
  return '+-*/'.indexOf(i) !== -1;
}

function solveRPN(input) {
  return input.reduce((acc, v, i) => {
    // console.log(acc, v)
    if (isOperator(v)) {
      const a = acc[acc.length - 1],
            b = acc[acc.length - 2];
      return [...acc.slice(0, acc.length - 2), fns[v](b)(a)];
    } else {
      return [...acc, v];
    }
  }, []);
}

function solveRPN2(input, stack = []) {
  // console.log('in', input, stack)
  if (input.length === 0) return stack;

  const [a, ...rest] = input;

  if (isOperator(a)) {
    const [x, y, ...restStack] = stack;
    const fn = fns[a];
    return solveRPN2(rest, [fn(y)(x), ...restStack]);
  } else {
    return solveRPN2(rest, [a, ...stack]);
  }
}

const rpn = convert(["1", "+", "2", "*", "3", "-", "4", "*", "2"]);

console.log(rpn);
// console.log()
console.log('1', solveRPN(rpn));
console.log('2', solveRPN2(rpn));
