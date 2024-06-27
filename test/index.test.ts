import { describe, expect, it } from 'vitest'
import { rollup } from 'rollup'
import type { PurgePolyfillsOptions } from '../src'
import { purgePolyfills } from '../src'

describe('unplugin-purge-polyfills', () => {
  it('transforms raw code that uses polyfills', async () => {
    expect(await transform('const isString = isString("am I?")')).toMatchInlineSnapshot(`undefined`)
    expect(await transform(`
      const isString = require("is-string");
      isString("am I?")
    `)).toMatchInlineSnapshot(`undefined`)
    expect(await transform(`
      import isString from "is-string";
      isString("am I?");
    `)).toMatchInlineSnapshot(`undefined`)
  })

  it('resolves polyfill imports', async () => {
    const code = await load('is-string')
    expect(code).toMatchInlineSnapshot(`
      "export default v => typeof v === 'string'
      "
    `)
  })

  it('does not duplicate polyfills', async () => {
    const bundle = await rollup({
      input: 'entry.js',
      plugins: [
        {
          name: 'entry',
          load: id => id === 'entry.js' ? 'import "other.js"; import isString from "is-string"; console.log(isString(""));' : undefined,
          resolveId: id => id === 'entry.js' ? id : undefined,
        },
        {
          name: 'other',
          load: id => id === 'other.js' ? 'import isString from "is-string"; console.log(isString(""));' : undefined,
          resolveId: id => id === 'other.js' ? id : undefined,
        },
        purgePolyfills.rollup({}),
      ],
    })
    const { output } = await bundle.generate({ format: 'es' })
    expect(output[0].code).toMatchFileSnapshot('__snapshots__/e2e.output.js')
  })
})

function transform(code: string, opts: PurgePolyfillsOptions = {}): Promise<string | undefined> {
  const plugin = purgePolyfills.raw(opts, { mode: 'transform' } as any)
  // @ts-expect-error untyped
  const res = plugin.transform(code)
  return (res?.code ?? res ?? undefined)?.trim()
}

async function load(polyfillId: string, opts: PurgePolyfillsOptions = {}): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    rollup({
      input: 'entry.js',
      plugins: [
        {
          name: 'entry',
          load: id => id === 'entry.js' ? id : undefined,
          resolveId: id => id === 'entry.js' ? id : undefined,
        },
        {
          name: 'test-load',
          async transform(_code, id) {
            if (id === 'entry.js') {
              let error
              try {
                const res = await this.resolve(polyfillId)
                if (res) {
                  const imp = await this.load(res)
                  if (imp.code) {
                    resolve(imp.code)
                    return
                  }
                }
              }
              catch (e) {
                error = e
              }
              reject(error || new Error(`Did not resolve polyfill import ${polyfillId}`))
            }
          },
        },
        purgePolyfills.rollup(opts),
      ],
    })
  })
}
