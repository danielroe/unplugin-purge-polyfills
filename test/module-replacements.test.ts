import { describe, expect, it } from 'vitest'
import { microUtilsReplacements, nativeReplacements } from 'module-replacements'

import { defaultPolyfills } from '../src'

describe('module-replacements', () => {
  it.todo.each(nativeReplacements.moduleReplacements)('has native $moduleName', (replacement) => {
    expect(defaultPolyfills).toHaveProperty(replacement.moduleName)
  })
  it.each(microUtilsReplacements.moduleReplacements)('has native $moduleName', (replacement) => {
    expect(defaultPolyfills).toHaveProperty(replacement.moduleName)
  })
})
