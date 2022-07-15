import { toRawType } from '@utils/shared'
const enum types {
  Set,
  Map,
  WeakMap,
  WeakSet,
  RegExp,
  Date,
}
const targetMap = new WeakMap()
export function deepClone(target: any) {
  if (targetMap.has(target))
    return targetMap.get(target)
  const cloneObj = {}
  targetMap.set(target, cloneObj)
  for (const key of Reflect.ownKeys(target)) {
    if (typeof target[key] === 'object')
      cloneObj[key] = deepClone(target[key])
    else cloneObj[key] = target[key]
  }
  return cloneObj
}
