import { describe, expect, it } from 'vitest'
import { deepClone, deepCloneWithRecursion, deepCloneWithStack } from '../../src'

describe('should', () => {
  it('clone a object', () => {
    const o1: any = { a: 1, b: { x: 2 } }
    const o2: any = deepClone(o1)
    expect(JSON.stringify(o1)).toEqual(JSON.stringify(o2))
    expect(o2).not.toBe(o1)
    expect(o2.b).not.toBe(o1.b)
  })
  it('clone a object with circular reference', () => {
    const o1: any = { a: 1, b: { x: 2 }, c: null }
    o1.c = o1
    const o2: any = deepClone(o1)
    // expect(JSON.stringify(o1)).toEqual(JSON.stringify(o2))
    expect(o2).not.toBe(o1)
    expect(o2.c).toBe(o2)
    expect(o2.b).not.toBe(o1.b)
  })
  it('clone a object with prototype ', () => {
    function Cls() {
      this.a = 1
    }
    Cls.prototype.b = 2
    const o1: any = new Cls()
    const o2: any = deepClone(o1)
    expect(o1.a).toBe(o2.a)
    expect(o1.b).toBe(o2.b)
    expect(Object.prototype.hasOwnProperty.call(o1, 'b')).toBe(false)
  })
  it('clone a object with property Descriptors ', () => {
    const o1: any = {}
    Object.defineProperty(o1, 'a', {
      value: 1,
      enumerable: false,
      writable: true,
      configurable: true,
    })
    const o2: any = deepClone(o1)
    let enumerable = false
    for (const key in o2) enumerable = true
    expect(o1.a).toBe(o2.a)
    expect(enumerable).toBe(false)
  })
  it('clone a object with frozen', () => {
    const o1: any = { a: 1, b: { x: 2 }, c: null }
    Object.freeze(o1)
    const o2: any = deepClone(o1)
    expect(Object.isFrozen(o2)).toBe(true)
  })
  it('clone a object with seal', () => {
    const o1: any = { a: 1, b: { x: 2 }, c: null }
    Object.seal(o1)
    const o2: any = deepClone(o1)
    expect(Object.isSealed(o2)).toBe(true)
  })
  it('clone a object with unextensible', () => {
    const o1: any = { a: 1, b: { x: 2 }, c: null }
    Object.preventExtensions(o1)
    const o2: any = deepClone(o1)
    expect(Object.isExtensible(o2)).toBe(false)
  })
})
