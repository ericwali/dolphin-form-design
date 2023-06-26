
/** Is it a virtual dom node */
export function isVNode (node: object) {
  const hasOwnProperty = Object.prototype.hasOwnProperty
  return node !== null && typeof node === 'object' && hasOwnProperty.call(node, 'componentOptions')
}

/** Is it a real dom node */
export function isDom (obj: any) {
  // The first thing is to type check the HTMLElement, because even in browsers that support HTMLElement
  // in browsers that support HTMLElement, the type is different, in Chrome, Opera, HTMLElement
  // type is function, so you can't use it to determine
  return typeof HTMLElement === 'object'
    ? (function () {
        return obj instanceof HTMLElement
      })()
    : (function () {
        return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
      })()
}
