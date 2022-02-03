import { Network } from "./network";
import { ScriptFactory } from "./script";
import { ServerFactory } from "./server";
import { PlayerFactory } from "./player";
export async function main(ns) {
    const player = PlayerFactory.current(ns);
    const serverFactory = new ServerFactory(ns, player);
    const scriptFactory = new ScriptFactory(ns);
    const network = new Network(serverFactory);
    const hackScript = scriptFactory.fromFilename('remote_hack.js');
    const target = Array.from(network.servers())
        .filter(server => server.canRoot())
        .sort((a, b) => a.maxMoney - b.maxMoney)
        .pop();
    for (const server of Array.from(network.servers()).sort((a, b) => a.requiredHackingLevel - b.requiredHackingLevel)) {
        ns.tprint(`${server.name},${server.requiredHackingLevel},${server.requiredPorts}`);
    }
    for (const server of network.servers()) {
        if (server.canRoot() && !server.isHome() && server.maxRam > 0) {
            ns.tprint(`running ${hackScript.filename} on ${server.name}`);
            await server.runScript(hackScript, [target.name]);
        }
    }
}
