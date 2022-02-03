/** @param {NS} ns **/
function depthFirstTraversal(root, getChildren) {
    return {
        [Symbol.iterator]: function () {
            const nodes = [root];
            const knownNodes = new Set();
            return {
                next() {
                    if (nodes.length == 0) {
                        return { done: true, value: undefined };
                    }
                    const node = nodes.pop();
                    knownNodes.add(node);
                    getChildren(node).forEach((childNode) => {
                        if (!knownNodes.has(childNode)) {
                            nodes.push(childNode);
                        }
                    });
                    return { done: false, value: node };
                }
            };
        }
    };
}
export async function main(ns) {
    const hackScript = 'early-hack.js';
    class Server {
        constructor(host) {
            this.host = host;
        }
        get maxMoney() {
            return ns.getServerMaxMoney(this.host);
        }
        get securityLevel() {
            return ns.getServerSecurityLevel(this.host);
        }
        get moneyAvailable() {
            return ns.getServerMoneyAvailable(this.host);
        }
        get requiredHackingLevel() {
            return ns.getServerRequiredHackingLevel(this.host);
        }
        get maxRam() {
            return ns.getServerMaxRam(this.host);
        }
    }
    class HackTarget {
        constructor(server) {
            this.server = server;
            this.hackScriptThreads = this.server.maxRam / ns.getScriptRam(hackScript);
        }
        get canHack() {
            return ns.getHackingLevel() > this.server.requiredHackingLevel;
        }
        execHackScript() {
            ns.scp(hackScript, 'home', this.server.host);
            ns.exec(hackScript, this.server.host, this.hackScriptThreads);
        }
    }
    const servers = depthFirstTraversal('home', ns.scan);
    for (const server of servers) {
        ns.print(server);
    }
}
