// Basic calculator: expression parsing, evaluation and keypad input rules.
// Pure functions only (no React, no eval) so everything is unit-testable.
//
// Expressions are strings of: digits, '.', '+', '−', '×', '÷', '%', '(', ')'
// (results may also contain 'e' exponents). Percentages behave like phone
// calculators: 50 + 10% = 55, 50 − 10% = 45, 50 × 10% = 5, 10% = 0.1.

import { groupIndian } from '../../utils/format';

export const OPERATORS = ['+', '−', '×', '÷'];
const MAX_LENGTH = 120;
const MAX_DIGITS = 15;
const SIGNIFICANT_DIGITS = 15;
const MAX_DECIMALS = 10;
export const HISTORY_LIMIT = 20;

export class CalculationError extends Error {}

// ---------- Tokenizer ----------

const NUMBER = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i;

export function tokenize(expression) {
  const tokens = [];
  let rest = expression;
  while (rest.length) {
    const number = NUMBER.exec(rest);
    if (number) {
      tokens.push({ type: 'number', value: Number(number[0]), raw: number[0] });
      rest = rest.slice(number[0].length);
    } else if ('+−×÷%()'.includes(rest[0])) {
      tokens.push({ type: rest[0] });
      rest = rest.slice(1);
    } else {
      throw new CalculationError('Invalid character');
    }
  }
  return tokens;
}

// ---------- Parser ----------
// expression := term (('+' | '−') term)*
// term       := unary (('×' | '÷') unary)*
// unary      := '−' unary | postfix
// postfix    := primary '%'*
// primary    := number | '(' expression ')'
// Each rule returns { value, percent } where `percent` marks a bare "n%" term,
// which + and − apply to the left-hand side.

function parse(tokens) {
  let position = 0;
  const peek = () => tokens[position];
  const take = (type) => {
    if (peek()?.type !== type) throw new CalculationError('Incomplete expression');
    position += 1;
  };

  function expression() {
    let left = term();
    while (peek()?.type === '+' || peek()?.type === '−') {
      const operator = peek().type;
      position += 1;
      const right = term();
      const amount = right.percent ? left.value * right.value : right.value;
      left = { value: operator === '+' ? left.value + amount : left.value - amount, percent: false };
    }
    return left;
  }

  function term() {
    let left = unary();
    while (peek()?.type === '×' || peek()?.type === '÷') {
      const operator = peek().type;
      position += 1;
      const right = unary();
      if (operator === '÷' && right.value === 0) throw new CalculationError("Can't divide by zero");
      left = { value: operator === '×' ? left.value * right.value : left.value / right.value, percent: false };
    }
    return left;
  }

  function unary() {
    if (peek()?.type === '−') {
      position += 1;
      const operand = unary();
      return { value: -operand.value, percent: operand.percent };
    }
    return postfix();
  }

  function postfix() {
    let result = primary();
    while (peek()?.type === '%') {
      position += 1;
      result = { value: result.value / 100, percent: true };
    }
    return result;
  }

  function primary() {
    const token = peek();
    if (token?.type === 'number') {
      position += 1;
      return { value: token.value, percent: false };
    }
    if (token?.type === '(') {
      position += 1;
      const inner = expression();
      take(')');
      return { value: inner.value, percent: false };
    }
    throw new CalculationError('Incomplete expression');
  }

  const result = expression();
  if (position !== tokens.length) throw new CalculationError('Incomplete expression');
  return result.value;
}

// Tidies an in-progress expression so it can be evaluated: drops trailing
// operators / open brackets / dots and closes any brackets left open.
export function completeExpression(expression) {
  const text = expression.replace(/[+−×÷(.]+$/, '');
  const open = (text.match(/\(/g) ?? []).length - (text.match(/\)/g) ?? []).length;
  return text + ')'.repeat(Math.max(0, open));
}

// After "=", the display shows a rounded result but the next calculation
// should use the exact value (1 ÷ 3 = × 3 = must give 1). `carry` holds
// { text, value } for the result; when the expression still starts with that
// text, its leading number is swapped for the exact value.
function applyCarry(tokens, completed, carry) {
  if (!carry || !completed.startsWith(carry.text)) return tokens;
  const following = completed[carry.text.length];
  if (following !== undefined && /[\d.e]/i.test(following)) return tokens;
  const index = tokens[0]?.type === '−' ? 1 : 0;
  if (tokens[index]?.type !== 'number') return tokens;
  const copy = [...tokens];
  copy[index] = { ...copy[index], value: Math.abs(carry.value) };
  return copy;
}

// Returns a number, or throws CalculationError.
export function evaluateExpression(expression, carry = null) {
  const completed = completeExpression(expression);
  if (!completed) throw new CalculationError('Empty expression');
  const value = parse(applyCarry(tokenize(completed), completed, carry));
  if (!Number.isFinite(value)) throw new CalculationError('Number too large');
  return value;
}

// True when the expression is just a number (nothing to calculate).
export const isPlainNumber = (expression) => /^−?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(expression);

// ---------- Number formatting ----------

// Rounds away binary floating-point noise (0.1 + 0.2 → 0.3).
const clean = (value) => (value === 0 ? 0 : Number(value.toPrecision(SIGNIFICANT_DIGITS)));

function exponential(value) {
  const [mantissa, exponent] = value.toExponential(9).split('e');
  const trimmed = mantissa.includes('.') ? mantissa.replace(/\.?0+$/, '') : mantissa;
  return `${trimmed}e${Number(exponent)}`;
}

// Plain-text number with no grouping, used as the expression after "=".
export function toRawNumber(value) {
  const number = clean(value);
  const abs = Math.abs(number);
  if (abs !== 0 && (abs >= 1e15 || abs < 1e-10)) return `${number < 0 ? '−' : ''}${exponential(abs)}`;
  const integerDigits = Math.max(1, Math.floor(Math.log10(abs || 1)) + 1);
  const decimals = Math.min(MAX_DECIMALS, Math.max(0, SIGNIFICANT_DIGITS - integerDigits));
  let text = abs.toFixed(decimals);
  if (text.includes('.')) text = text.replace(/\.?0+$/, '');
  return number < 0 && text !== '0' ? `−${text}` : text;
}

// Groups the integer part of every number in an expression for display:
// "1234567.5×2" → "12,34,567.5 × 2". Exponents show as "1.5E16".
export function formatExpression(expression) {
  return expression
    .replace(/(\d+)(\.\d*)?(e[+-]?\d+)?/gi, (match, integer, fraction = '', exponent = '') =>
      exponent ? `${integer}${fraction}E${exponent.slice(1).replace('+', '')}` : `${groupIndian(integer)}${fraction}`
    )
    .replace(/([+×÷])/g, ' $1 ')
    // Binary minus gets spaces; a negative sign (start, after an operator or "(") stays attached.
    .replace(/([\d)%.])−/g, '$1 − ');
}

export const formatResult = (value) => formatExpression(toRawNumber(value));

// ---------- Keypad input ----------

const lastChar = (text) => text.slice(-1);
const isDigit = (char) => char >= '0' && char <= '9';
const currentNumber = (text) => /(\d+\.?\d*|\.\d*)(e[+-]?\d+)?$/i.exec(text)?.[0] ?? '';
const openBrackets = (text) => (text.match(/\(/g) ?? []).length - (text.match(/\)/g) ?? []).length;
const endsWithValue = (text) => isDigit(lastChar(text)) || lastChar(text) === ')' || lastChar(text) === '%';

export const initialState = { expression: '', justEvaluated: false, error: null, history: [], carry: null };

// Applies one key press. Keys: '0'–'9', '.', '+', '−', '×', '÷', '%', '()',
// 'back', 'clear', '='.
export function pressKey(state, key) {
  const next = { ...state, error: null };
  let text = state.expression;

  if (key === 'clear') return { ...next, expression: '', justEvaluated: false, carry: null };

  if (key === 'back') {
    // After "=", backspace edits the result unless it is in exponent form.
    const base = state.justEvaluated && /e/i.test(text) ? '' : text;
    return { ...next, expression: base.slice(0, -1), justEvaluated: false, carry: null };
  }

  if (key === '=') {
    // Nothing to calculate (empty, a lone "−" or "(", a lone number, or "5 +").
    const completed = completeExpression(text);
    if (!completed || isPlainNumber(completed)) return { ...next, justEvaluated: state.justEvaluated };
    try {
      const value = evaluateExpression(text, state.carry);
      const entry = { expression: formatExpression(completed), result: formatResult(value) };
      return {
        ...next,
        expression: toRawNumber(value),
        carry: { text: toRawNumber(value), value },
        justEvaluated: true,
        history: [entry, ...state.history].slice(0, HISTORY_LIMIT),
      };
    } catch (error) {
      return { ...next, error: error instanceof CalculationError ? error.message : 'Error' };
    }
  }

  const growing = text.length >= MAX_LENGTH;

  if (isDigit(key)) {
    if (state.justEvaluated) return { ...next, expression: key, justEvaluated: false, carry: null };
    if (growing) return next;
    const number = currentNumber(text);
    if (/e/i.test(number)) return next;
    if (lastChar(text) === ')' || lastChar(text) === '%') text += '×';
    else if (number === '0') text = text.slice(0, -1);
    else if (number.replace('.', '').length >= MAX_DIGITS) return next;
    return { ...next, expression: text + key, justEvaluated: false };
  }

  if (key === '.') {
    if (state.justEvaluated) return { ...next, expression: '0.', justEvaluated: false, carry: null };
    if (growing) return next;
    const number = currentNumber(text);
    if (number.includes('.') || /e/i.test(number)) return next;
    if (lastChar(text) === ')' || lastChar(text) === '%') text += '×';
    return { ...next, expression: text + (isDigit(lastChar(text)) ? '.' : '0.'), justEvaluated: false };
  }

  if (OPERATORS.includes(key)) {
    if (growing) return next;
    if (lastChar(text) === '.') text = text.slice(0, -1);
    if (!text) return key === '−' ? { ...next, expression: '−', justEvaluated: false } : next;
    const last = lastChar(text);
    if (last === '(') return key === '−' ? { ...next, expression: `${text}−`, justEvaluated: false } : next;
    if (OPERATORS.includes(last)) {
      // A minus straight after × or ÷ starts a negative number: 5 × −3.
      if (key === '−' && (last === '×' || last === '÷')) return { ...next, expression: `${text}−`, justEvaluated: false };
      text = text.replace(/[+−×÷]+$/, '');
      if (!text || lastChar(text) === '(') return key === '−' ? { ...next, expression: `${text}−`, justEvaluated: false } : { ...next, expression: text };
    }
    return { ...next, expression: text + key, justEvaluated: false };
  }

  if (key === '%') {
    if (growing) return next;
    if (lastChar(text) === '.') text = text.slice(0, -1);
    if (!isDigit(lastChar(text)) && lastChar(text) !== ')') return next;
    return { ...next, expression: `${text}%`, justEvaluated: false };
  }

  if (key === '()') {
    if (state.justEvaluated) return { ...next, expression: '(', justEvaluated: false, carry: null };
    if (growing) return next;
    if (lastChar(text) === '.') text = text.slice(0, -1);
    if (openBrackets(text) > 0 && endsWithValue(text)) return { ...next, expression: `${text})` };
    if (endsWithValue(text)) return { ...next, expression: `${text}×(` };
    return { ...next, expression: `${text}(` };
  }

  return state;
}

// Live answer shown under the expression while typing (null when there is
// nothing to show yet, e.g. a single number or an incomplete expression).
export function previewResult(expression, carry = null) {
  if (!expression || isPlainNumber(expression) || isPlainNumber(completeExpression(expression))) return null;
  try {
    return formatResult(evaluateExpression(expression, carry));
  } catch {
    return null;
  }
}

// Tapping a history entry puts its result back on the display to keep calculating.
export function recallHistory(state, entry) {
  const expression = entry.result.replace(/[,\s]/g, '').replace('E', 'e');
  if (!isPlainNumber(expression)) return state;
  return { ...state, expression, justEvaluated: true, carry: null, error: null };
}

export const clearHistory = (state) => ({ ...state, history: [] });

// Validates state restored from storage; falls back to a fresh calculator.
export function restoreState(saved) {
  if (!saved || typeof saved !== 'object') return initialState;
  const expression =
    typeof saved.expression === 'string' && saved.expression.length <= MAX_LENGTH && /^[\d.+−×÷%()e-]*$/i.test(saved.expression)
      ? saved.expression
      : '';
  const history = Array.isArray(saved.history)
    ? saved.history
        .filter((entry) => typeof entry?.expression === 'string' && typeof entry?.result === 'string')
        .slice(0, HISTORY_LIMIT)
    : [];
  const carry =
    typeof saved.carry?.text === 'string' && Number.isFinite(saved.carry?.value) ? { text: saved.carry.text, value: saved.carry.value } : null;
  return { ...initialState, expression, history, carry, justEvaluated: Boolean(saved.justEvaluated) && isPlainNumber(expression) };
}
