export const defaultPolyfills: Record<string, Record<string, string>> = {
  // Micro-utilities
  'is-number': {
    default: `v => typeof v === 'number'`,
  },
  'is-plain-object': {
    default: 'v => typeof v === \"object\" && v !== null && v.constructor === Object',
  },
  'is-primitve': {
    default: 'v => v === null || (typeof v !== \"function\" && typeof v !== \"object\")',
  },
  'is-regexp': {
    default: 'v => v instanceof RegExp',
  },
  'is-travis': {
    default: '() => \"TRAVIS\" in process.env',
  },
  'is-npm': {
    default: '() => process.env.npm_config_user_agent?.startsWith(\"npm\")',
  },
  'clone-regexp': {
    default: 'v => new RegExp(v)',
  },
  'split-lines': {
    default: 'str => str.split(/\\r?\\n/)',
  },
  'is-windows': {
    default: '() => process.platform === \"win32\"',
  },
  'is-whitespace': {
    default: 'str => str.trim() === \"\"',
  },
  'is-string': {
    default: `v => typeof v === 'string'`,
  },
  'is-odd': {
    default: 'n => (n % 2) === 1',
  },
  'is-even': {
    default: 'n => (n % 2) === 0',
  },
  // native replacements
  'object.entries': {
    default: 'Object.entries',
  },
  'date': {
    default: 'Date',
  },
  'array.of': {
    default: 'Array.of',
  },
  'number.isnan': {
    default: 'Number.isNaN',
  },
  'array.prototype.findindex': {
    default: 'Array.prototype.findIndex',
  },
  'array.from': {
    default: 'Array.from',
  },
  'object-is': {
    default: 'Object.is',
  },
  'hasown': {
    default: '(obj, prop) => obj.hasOwnProperty(prop)',
  },
  'has-own-prop': {
    default: 'Object.hasOwn ?? ((o, p) => Object.prototype.hasOwnProperty.call(o, p))',
  },
  'array-map': {
    default: 'Array.prototype.map',
  },
  'is-nan': {
    default: 'Number.isNaN',
  },
  'function-bind': {
    default: 'Function.prototype.bind',
  },
  'regexp.prototype.flags': {
    default: 'RegExp.prototype.flags',
  },
  'array.prototype.find': {
    default: 'Array.prototype.find',
  },
  'object-keys': {
    default: 'Object.keys',
  },
  'define-properties': {
    default: 'Object.defineProperties',
  },
  'left-pad': {
    default: 'String.prototype.padStart',
  },
  'pad-left': {
    default: 'String.prototype.padStart',
  },
  'filter-array': {
    default: 'Array.prototype.filter',
  },
  'array-every': {
    default: 'Array.prototype.every',
  },
  'index-of': {
    default: 'Array.prototype.indexOf',
  },
  'last-index-of': {
    default: 'Array.prototype.lastIndexOf',
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
    default: '(obj, prop) => obj.hasOwnProperty(prop)',
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
}
