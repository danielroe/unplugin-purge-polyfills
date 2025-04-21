import type { UnpluginOptions } from 'unplugin'
import { defu } from 'defu'
import MagicString from 'magic-string'
import { findStaticImports, parseStaticImport } from 'mlly'
import { createUnplugin } from 'unplugin'

import { defaultPolyfills } from './replacements'

export { defaultPolyfills } from './replacements'

export interface PurgePolyfillsOptions {
  sourcemap?: boolean
  replacements?: Record<string, false | Record<string, string>>
  logLevel?: 'quiet' | 'verbose'
  mode?: 'load' | 'transform'
  /**
   * An array of patterns to match source files against when running in `transform` mode
   * @default [/\.[cm][tj]sx?$/]
   */
  include?: Array<string | RegExp>
  /** An array of patterns to exclude source files when running in `transform` mode  */
  exclude?: Array<string | RegExp>
}

const CJS_STATIC_IMPORT_RE = /(?<=\s|^|[;}])(const|var|let)((?<imports>[\p{L}\p{M}\w\t\n\r $*,/{}@.]+))=\s*require\(["']\s*(?<specifier>(?<=")[^"]*[^\s"](?=\s*")|(?<=')[^']*[^\s'](?=\s*'))\s*["']\)[\s;]*/gmu

const VIRTUAL_POLYFILL_PREFIX = 'virtual:purge-polyfills:'

export const purgePolyfills = createUnplugin<PurgePolyfillsOptions>((opts = {}) => {
  const _knownMods = defu(opts.replacements, defaultPolyfills)
  // Allow passing `false` to disable a polyfill
  for (const mod in _knownMods) {
    if (!_knownMods[mod]) {
      delete _knownMods[mod]
    }
  }
  const knownMods = _knownMods as Record<string, Record<string, string>>
  const specifiers = new Set(Object.keys(knownMods))

  const logs = new Set<string>()

  function load(id: string) {
    if (id.startsWith(VIRTUAL_POLYFILL_PREFIX)) {
      const polyfillId = id.slice(VIRTUAL_POLYFILL_PREFIX.length)
      let code = ''
      for (const exportName in knownMods[polyfillId]) {
        if (exportName === 'default') {
          code += `export default ${knownMods[polyfillId].default}\n`
          continue
        }
        code += `export const ${exportName} = ${knownMods[polyfillId][exportName]}\n`
      }
      logs.add(`Replaced import from ${polyfillId}.`)
      return code
    }
  }

  function resolveId(id: string) {
    if (specifiers.has(id)) {
      return VIRTUAL_POLYFILL_PREFIX + id
    }
  }

  function transform(code: string) {
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
        logs.add(`Inlined replacement from ${polyfillImport.specifier}.`)
      }

      s.overwrite(polyfillImport.start, polyfillImport.end, code)
    }

    if (s.hasChanged()) {
      return {
        code: s.toString(),
        map: opts.sourcemap ? s.generateMap(({ hires: true })) : null,
      }
    }
  }

  return {
    name: 'unplugin-purge-polyfills',
    ...(opts.mode === 'transform'
      ? {
          transform: {
            filter: {
              id: {
                include: opts.include || [/\.[cm][tj]sx?$/],
                exclude: opts.exclude,
              },
            },
            handler: transform,
          },
        }
      : {
          resolveId,
          load,
        }),
    buildEnd() {
      if (opts.logLevel === 'quiet') {
        return
      }
      if (opts.logLevel === 'verbose') {
        for (const log of logs) {
          // eslint-disable-next-line no-console
          console.log(log)
        }
        // eslint-disable-next-line no-console
        console.log(`Purged ${logs.size} polyfills.`)
      }
    },
  } satisfies UnpluginOptions
})
