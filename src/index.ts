import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { findStaticImports, parseStaticImport } from 'mlly'

export interface PurgePolyfillsOptions {
  sourcemap?: boolean
  replacements?: Record<string, Record<string, string>>
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
}

const CJS_STATIC_IMPORT_RE = /(?<=\s|^|[;}])(const|var|let)((?<imports>[\p{L}\p{M}\w\t\n\r $*,/{}@.]+))=\s*require\(["']\s*(?<specifier>(?<=")[^"]*[^\s"](?=\s*")|(?<=')[^']*[^\s'](?=\s*'))\s*["']\)[\s;]*/gmu

const VIRTUAL_POLYFILL_PREFIX = 'virtual:purge-polyfills:'

export const purgePolyfills = createUnplugin<PurgePolyfillsOptions>((opts) => {
  const knownMods = opts.replacements || defaultPolyfills
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
