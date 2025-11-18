export default function isAttached(node: Node) {
  let currentNode: Node | null = node
  while (currentNode && (currentNode as any).parentNode) {
    if ((currentNode as any).parentNode === document) return true
    currentNode = (currentNode as any).parentNode instanceof ShadowRoot ? (currentNode as any).parentNode.host : (currentNode as any).parentNode
  }
  return false
}