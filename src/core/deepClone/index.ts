import { toRawType } from '@utils/shared'
const enum types {
  Set,
  Map,
  WeakMap,
  WeakSet,
  RegExp,
  Date,
}
const stackMap = new WeakMap()
export function deepCloneWithStack(target: any) {
  const cloneObj = Object.create(Object.getPrototypeOf(target))
  stackMap.set(target, cloneObj)
  const stack = [{ target, cloneObj }]
  while (stack.length) {
    const { target, cloneObj } = stack.pop()!
    for (const key of Reflect.ownKeys(target)) {
      const descriptor = Object.getOwnPropertyDescriptor(target, key)!
      if (Object.hasOwnProperty.call(descriptor, 'value')) {
        if (typeof target[key] === 'object' && target[key] !== null) {
          if (stackMap.has(target[key])) {
            descriptor.value = stackMap.get(target[key])
          }
          else {
            descriptor.value = Object.create(Object.getPrototypeOf(target[key]))
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

const recursionMap = new WeakMap()
export function deepCloneWithRecursion(target: any) {
  if (recursionMap.has(target))
    return recursionMap.get(target)
  const cloneObj = Object.create(
    Object.getPrototypeOf(target),
    Object.getOwnPropertyDescriptors(target),
  )
  recursionMap.set(target, cloneObj)
  for (const key of Reflect.ownKeys(target)) {
    if (typeof target[key] === 'object')
      cloneObj[key] = deepCloneWithRecursion(target[key])
    else cloneObj[key] = target[key]
  }
  return cloneObj
}

export const deepClone = deepCloneWithStack
