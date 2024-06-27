import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { findStaticImports, parseStaticImport } from 'mlly'
import { defu } from 'defu'

export interface PurgePolyfillsOptions {
  sourcemap?: boolean
  replacements?: Record<string, false | Record<string, string>>
}

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
    default: '(obj, prop) => obj.hasOwnProperty(prop)',
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
}

const CJS_STATIC_IMPORT_RE = /(?<=\s|^|[;}])(const|var|let)((?<imports>[\p{L}\p{M}\w\t\n\r $*,/{}@.]+))=\s*require\(["']\s*(?<specifier>(?<=")[^"]*[^\s"](?=\s*")|(?<=')[^']*[^\s'](?=\s*'))\s*["']\)[\s;]*/gmu

const VIRTUAL_POLYFILL_PREFIX = 'virtual:purge-polyfills:'

export const purgePolyfills = createUnplugin<PurgePolyfillsOptions>((opts) => {
  const _knownMods = defu(opts.replacements, defaultPolyfills)
  // Allow passing `false` to disable a polyfill
  for (const mod in _knownMods) {
    if (!_knownMods[mod]) {
      delete _knownMods[mod]
    }
  }
  const knownMods = _knownMods as Record<string, Record<string, string>>
  const specifiers = new Set(Object.keys(knownMods))

  return {
    name: 'unplugin-purge-polyfills',
    resolveId(id) {
      if (specifiers.has(id)) {
        return VIRTUAL_POLYFILL_PREFIX + id
      }
    },
    load(id) {
      if (id.startsWith(VIRTUAL_POLYFILL_PREFIX)) {
        const polyfillId = id.slice(VIRTUAL_POLYFILL_PREFIX.length)
        let code = ''
        for (const exportName in knownMods[polyfillId]) {
          if (exportName === 'default') {
            code += `export default ${knownMods[polyfillId].default}\n`
            continue
          }
          code += `export const ${exportName} = ${knownMods[polyfillId][exportName]}`
        }
        return code
      }
    },
    transform(code) {
      const staticImports = findStaticImports(code)
      for (const match of code.matchAll(CJS_STATIC_IMPORT_RE)) {
        staticImports.push({
          type: 'static',
          ...match.groups as { imports: string, specifier: string },
          code: match[0],
          start: match.index,
          end: (match.index || 0) + match[0].length,
        })
      }

      if (!staticImports.length)
        return

      const polyfillImports = staticImports.filter(i => specifiers.has(i.specifier))
      if (!polyfillImports.length)
        return

      const s = new MagicString(code)
      for (const polyfillImport of polyfillImports) {
        const parsed = parseStaticImport(polyfillImport)
        let code = ''
        const names = parsed.namedImports || {}
        if (parsed.defaultImport) {
          names.default = parsed.defaultImport
        }

        for (const p in names) {
          const replacement = knownMods[polyfillImport.specifier]?.[p]
          if (replacement) {
            code += `const ${names[p]} = ${replacement};\n`
          }
        }

        s.overwrite(polyfillImport.start, polyfillImport.end, code)
      }

      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: opts.sourcemap ? s.generateMap(({ hires: true })) : null,
        }
      }
    },
  }
})
