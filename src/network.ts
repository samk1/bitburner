import { IServer, ServerFactory } from "./server";

function depthFirstTraversal<T>(root: T, getChildren: (node: T) => T[]): Iterable<T> {
  return {
    [Symbol.iterator]: function() {
      const nodes = [root]
      const knownNodes = new Set<T>()

      return {
        next() {
          if (nodes.length == 0) {
            return { done: true, value: undefined }
          }

          const node = nodes.pop()!;
          knownNodes.add(node);

          getChildren(node).forEach((childNode) => {
            if (!knownNodes.has(childNode)) {
              nodes.push(childNode)
            }
          })

          return { done: false, value: node }
        }
      }
    }
  }
}

export class Network {
  constructor(private serverFactory: ServerFactory) {}

  servers() : Iterable<IServer> {
    return depthFirstTraversal(this.serverFactory.home(), server => this.serverFactory.neighborsFor(server.name))
  }
}