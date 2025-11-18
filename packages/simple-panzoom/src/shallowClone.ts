export default function shallowClone(obj: any) {
  const clone: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) clone[key] = obj[key]
  }
  return clone
}