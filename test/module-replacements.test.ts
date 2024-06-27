import { describe, expect, it } from 'vitest'
import { microUtilsReplacements, nativeReplacements } from 'module-replacements'

import { defaultPolyfills } from '../src'

describe('module-replacements', () => {
  const judgementCalls = [
    'for-each',
    'hasown',
    'has-own-prop',
    'node.extend',
    'extend-shallow',
    'xtend',
    'defaults',
  ]
  it.each(nativeReplacements.moduleReplacements)('has native $moduleName', (replacement) => {
    if (judgementCalls.includes(replacement.moduleName)) {
      return
    }
    expect(defaultPolyfills).toHaveProperty(replacement.moduleName)
  })
  it.each(microUtilsReplacements.moduleReplacements)('has native $moduleName', (replacement) => {
    expect(defaultPolyfills).toHaveProperty(replacement.moduleName)
  })
})
