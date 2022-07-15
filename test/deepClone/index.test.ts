import { describe, expect, it } from 'vitest'
import { deepClone } from '../../src'

describe('should', () => {
  it('exported', () => {
    deepClone(new Map())
  })
})
