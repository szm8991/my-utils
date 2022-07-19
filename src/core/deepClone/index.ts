import { toRawType } from '@utils/shared'
const stackMap = new WeakMap()
export function deepCloneWithStack(target: any) {
  const cloneObj = createObjFromClass(target)
  stackMap.set(target, cloneObj)
  const stack = [{ target, cloneObj }]
  while (stack.length) {
    const { target, cloneObj } = stack.pop()!
    // if (typeof target === 'function' || target === null) {
    //   continue;
    // }
    for (const key of Reflect.ownKeys(target)) {
      const descriptor = Object.getOwnPropertyDescriptor(target, key)!
      if (Object.hasOwnProperty.call(descriptor, 'value')) {
        if (
          typeof target[key] === 'function'
          || (typeof target[key] === 'object' && target[key] !== null)
        ) {
          if (stackMap.has(target[key])) {
            descriptor.value = stackMap.get(target[key])
          }
          else {
            descriptor.value = createObjFromClass(target[key])
            stackMap.set(target[key], descriptor.value)
            stack.push({ target: target[key], cloneObj: descriptor.value })
          }
        }
        else {
          descriptor.value = target[key]
        }
        Object.defineProperty(cloneObj, key, descriptor)
      }
      else {
        Object.defineProperty(cloneObj, key, descriptor)
      }
    }
  }
  if (Object.isFrozen(target))
    Object.freeze(cloneObj)
  if (Object.isSealed(target))
    Object.seal(cloneObj)
  if (!Object.isExtensible(target))
    Object.preventExtensions(cloneObj)
  return cloneObj
}
// for easier if...else
const typeStrategies = [
  {
    check(target, type, rawType, prototype) {
      return prototype === Array.prototype && rawType === 'Array'
    },
    create(target) {
      return target.slice()
    },
  },
  {
    check(target, type, rawType, prototype) {
      return prototype === String.prototype && rawType === 'String'
    },
    create(target) {
      return new String(target.valueOf())
    },
  },
  {
    check(target, type, rawType, prototype) {
      return type === 'function'
    },
    create(target) {
      return function (...args) {
        return target.call(this, ...args)
      }
    },
  },
  {
    check(target, type, rawType, prototype) {
      return rawType === 'Date'
    },
    create(target) {
      return new target.constructor(target.getTime())
    },
  },
  {
    check(target, type, rawType, prototype) {
      return rawType === 'RegExp'
    },
    create(target) {
      return new target.constructor(target.source, target.flags)
    },
  },
]
export function register(check, create) {
  typeStrategies.push({ check, create })
}
// create a new object with check constructor-rawType-typeof
function createObjFromClass(target: any) {
  const type = typeof target
  const rawType = toRawType(target)
  const prototype = Object.getPrototypeOf(target)
  for (const { check, create } of typeStrategies) {
    if (check(target, type, rawType, prototype))
      return create(target)
  }

  return Object.create(Object.getPrototypeOf(target))
}

/*
//with recursion
const recursionMap = new WeakMap()
export function deepCloneWithRecursion(target: any) {
  if (recursionMap.has(target)) return recursionMap.get(target)
  if (typeof target === 'function' || target === null) return target
  if (types.includes(target.constructor)) return new target.constructor(target)
  if (typeof target !== 'object') return target
  const cloneObj = Object.create(
    Object.getPrototypeOf(target),
    Object.getOwnPropertyDescriptors(target)
  )
  recursionMap.set(target, cloneObj)
  for (const key of Reflect.ownKeys(target)) {
    if (typeof target[key] === 'object') cloneObj[key] = deepCloneWithRecursion(target[key])
    else cloneObj[key] = target[key]
  }
  return cloneObj
}
*/

export const deepClone = deepCloneWithStack
