export const defaultPolyfills: Record<string, Record<string, string>> = {
  // Micro-utilities
  'call-bind': {
    default: 'v => Function.call.bind(v)',
  },
  'clone-regexp': {
    default: 'v => new RegExp(v)',
  },
  'es-get-iterator': {
    default: 'v => v[Symbol.iterator]?.()',
  },
  'es-set-tostringtag': {
    default: '(target, value) => Object.defineProperty(target, Symbol.toStringTag, { value, configurable: true })',
  },
  'is-array-buffer': {
    default: 'v => Object.prototype.toString.call(v) === "[object ArrayBuffer]"',
  },
  'is-boolean-object': {
    default: 'v => Object.prototype.toString.call(v) === "[object Boolean]"',
  },
  'is-date-object': {
    default: 'v => Object.prototype.toString.call(v) === "[object Date]"',
  },
  'is-even': {
    default: 'n => (n % 2) === 0',
  },
  'is-negative-zero': {
    default: 'v => Object.is(v, -0)',
  },
  'is-npm': {
    default: '() => process.env.npm_config_user_agent?.startsWith("npm")',
  },
  'is-number': {
    default: 'v => typeof v === "number"',
  },
  'is-number-object': {
    default: 'v => Object.prototype.toString.call(v) === "[object Number]"',
  },
  'is-odd': {
    default: 'n => (n % 2) === 1',
  },
  'is-plain-object': {
    default: 'v => typeof v === "object" && v !== null && v.constructor === Object',
  },
  'is-primitive': {
    default: 'v => v === null || (typeof v !== "function" && typeof v !== "object")',
  },
  'is-primitve': {
    default: 'v => v === null || (typeof v !== "function" && typeof v !== "object")',
  },
  'is-regexp': {
    default: 'v => Object.prototype.toString.call(v) === "[object RegExp]"',
  },
  'is-string': {
    default: 'v => typeof v === "string"',
  },
  'is-travis': {
    default: '() => "TRAVIS" in process.env',
  },
  'is-whitespace': {
    default: 'str => str.trim() === ""',
  },
  'is-windows': {
    default: '() => process.platform === "win32"',
  },
  'split-lines': {
    default: 'str => str.split(/\\r?\\n/)',
  },
  // native replacements
  'array-every': {
    default: 'Array.prototype.every',
  },
  'array-map': {
    default: 'Array.prototype.map',
  },
  'array.from': {
    default: 'Array.from',
  },
  'array.of': {
    default: 'Array.of',
  },
  'array.prototype.find': {
    default: 'Array.prototype.find',
  },
  'array.prototype.findindex': {
    default: 'Array.prototype.findIndex',
  },
  'date': {
    default: 'Date',
  },
  'define-properties': {
    default: 'Object.defineProperties',
  },
  'filter-array': {
    default: 'Array.prototype.filter',
  },
  'function-bind': {
    default: 'Function.prototype.bind',
  },
  'has-own-prop': {
    default: 'Object.hasOwn ?? ((o, p) => Object.prototype.hasOwnProperty.call(o, p))',
  },
  'hasown': {
    default: '(obj, prop) => obj.hasOwnProperty(prop)',
  },
  'index-of': {
    default: 'Array.prototype.indexOf',
  },
  'is-nan': {
    default: 'Number.isNaN',
  },
  'last-index-of': {
    default: 'Array.prototype.lastIndexOf',
  },
  'left-pad': {
    default: 'String.prototype.padStart',
  },
  'number.isnan': {
    default: 'Number.isNaN',
  },
  'object-is': {
    default: 'Object.is',
  },
  'object-keys': {
    default: 'Object.keys',
  },
  'object.entries': {
    default: 'Object.entries',
  },
  'pad-left': {
    default: 'String.prototype.padStart',
  },
  'regexp.prototype.flags': {
    default: 'RegExp.prototype.flags',
  },
  // https://github.com/esm-dev/esm.sh/blob/main/server/embed/polyfills
  'abort-controller': {
    AbortSignal: 'AbortSignal',
    AbortController: 'AbortController',
    default: 'AbortController',
  },
  'array-flatten': {
    default: '(a, d) => a.flat(typeof d < "u" ? d : Infinity)',
  },
  'array-includes': {
    default: '(a, p, i) => a.includes(p, i)',
  },
  'has-own': {
    default: 'Object.hasOwn',
  },
  'has-proto': {
    default: '() => { const foo = { bar: {} }; return ({ __proto__: foo }).bar === foo.bar && !({ __proto__: null } instanceof Object) }',
  },
  'has-symbols': {
    default: '() => true',
  },
  'object-assign': {
    default: 'Object.assign',
  },
  // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore/blob/master/lib/rules/rules.json
  'lodash.capitalize': {
    default: 'string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()',
  },
  'lodash.castArray': {
    default: 'Array.isArray(arr) ? arr : [arr]',
  },
  'lodash.cloneDeep': {
    default: 'structuredClone()',
  },
  'lodash.concat': {
    default: 'Array.prototype.concat',
  },
  'lodash.defaults': {
    default: 'Object.assign({}, defaultValues, newValues)',
  },
  'lodash.detect': {
    default: 'Array.prototype.find',
  },
  'lodash.drop': {
    default: '(arr, n = 1) => arr.slice(n)',
  },
  'lodash.dropRight': {
    default: '(arr, n = 1) => arr.slice(0, -n || arr.length)',
  },
  'lodash.endsWith': {
    default: 'String.prototype.endsWith',
  },
  'lodash.fill': {
    default: 'Array.prototype.fill',
  },
  'lodash.first': {
    default: 'arr => arr.at(0) || arr[0]',
  },
  'lodash.flatten': {
    default: 'Array.prototype.reduce((a, b) => a.concat(b), [])',
  },
  'lodash.head': {
    default: 'Array.prototype.at(0)',
  },
  'lodash.isArrayBuffer': {
    default: 'value instanceof ArrayBuffer',
  },
  'lodash.isDate': {
    default: 'String.prototype.toString.call()',
  },
  'lodash.isFunction': {
    default: 'typeof func === "function"',
  },
  'lodash.isString': {
    default: 'str != null && typeof str.valueOf() === "string"',
  },
  'lodash.join': {
    default: 'Array.prototype.join',
  },
  'lodash.last': {
    default: 'arr => arr.at(-1) || arr[arr.length - 1]',
  },
  'lodash.omit': {
    default: '{a, b, c, ...notOmittedValues}',
  },
  'lodash.padEnd': {
    default: 'String.prototype.padEnd',
  },
  'lodash.repeat': {
    default: 'String.prototype.repeat',
  },
  'lodash.replace': {
    default: 'String.prototype.replace',
  },
  'lodash.reverse': {
    default: 'Array.prototype.reverse',
  },
  'lodash.split': {
    default: 'String.prototype.split',
  },
  'lodash.startsWith': {
    default: 'String.prototype.startsWith',
  },
  'lodash.toLower': {
    default: 'String.prototype.toLowerCase',
  },
  'lodash.toUpper': {
    default: 'String.prototype.toUpperCase',
  },
  'lodash.trim': {
    default: 'String.prototype.trim',
  },
  'lodash.uniq': {
    default: '[... new Set(arr)]',
  },
}
