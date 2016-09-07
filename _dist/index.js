/*
* 只考虑四则运算的简化版逆波兰计算器
* 运算符转换规则: https://en.wikipedia.org/wiki/Shunting-yard_algorithm
* */
(function (global) {
  const OPERATOR_PRECEDENCE = [['-', '+'], ['*', '/']]; //定义运算符与优先级, 优先级相同的运算符在同一数组内

  const operatorFuncs = {
    '+': a => b => a + b,
    '-': a => b => a - b,
    '*': a => b => a * b,
    '/': a => b => a / b
  };

  const OPERATORS = OPERATOR_PRECEDENCE.reduce((acc, group) => acc.concat(group), []);

  function processToken(o1, operators) {
    const [o2, ...rest] = operators;

    if (o2 && isPrecedenceLessThan(o1, o2)) {
      const [result, nextOps] = processToken(o1, rest);

      return [[o2].concat(result), nextOps];
    } else {
      return [[], [o1].concat(operators)];
    }
  }

  function isPrecedenceLessThan(o1, o2) {
    return findPrecedence(o1) <= findPrecedence(o2);
  }

  function findPrecedence(o) {
    return OPERATOR_PRECEDENCE.findIndex(function (v, i) {
      return v.includes(o);
    });
  }

  function convertToRPN(input = [], operators = []) {
    const [token, ...rest] = input;

    if (token === undefined) {
      return operators;
    };

    if (/^\d+$/.test(token)) {
      return [parseInt(token)].concat(convertToRPN(rest, operators));
    } else {
      const [nextValues, nextOperators] = processToken(token, operators);

      return nextValues.concat(convertToRPN(rest, nextOperators));
    }
  }

  function isOperator(i) {
    return OPERATORS.includes(i);
  }

  function solveRPN(input, stack = []) {
    if (input.length === 0) return stack;

    const [a, ...rest] = input;

    if (isOperator(a)) {
      const [x, y, ...restStack] = stack;
      const fn = operatorFuncs[a];
      return solveRPN(rest, [fn(y)(x), ...restStack]);
    } else {
      return solveRPN(rest, [a, ...stack]);
    }
  }

  const operatorsRegExp = new RegExp(`([${ OPERATORS.join('\\') }])`);

  function splitInputStr(str) {
    return str.split(operatorsRegExp);
  }

  function calculate(inputStr) {
    if (!inputStr) return 0;

    const inputArray = splitInputStr(operatorsRegExp.test(inputStr[inputStr.length - 1]) ? inputStr.slice(0, inputStr.length - 1) : inputStr);

    return solveRPN(convertToRPN(inputArray))[0];
  }

  global.calculate = calculate;
})(window);
