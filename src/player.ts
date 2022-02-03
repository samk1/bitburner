import { NS, Player as NSPlayer } from "../types/NetscriptDefinitions";
import { IServer } from "./server";

export interface IPlayer {
    getRootOn(server: IServer): void;
    canRoot(server: IServer): boolean;
}

type Programs = {
    "BruteSSH.exe": "brutessh",
    "FTPCrack.exe": "ftpcrack",
    "relaySMTP.exe": "relaysmtp",
    "HTTPWorm.exe": "httpworm",
    "SQLInject.exe": "sqlinject",
}

class Player implements IPlayer {
    static programs: Programs = {
        "BruteSSH.exe": "brutessh",
        "FTPCrack.exe": "ftpcrack",
        "relaySMTP.exe": "relaysmtp",
        "HTTPWorm.exe": "httpworm",
        "SQLInject.exe": "sqlinject",
    }

    constructor(private nsPlayer: NSPlayer, private ns: NS) {
    }

    getRootOn(server: IServer): void {
        this.toolsInstalled().forEach(tool => {
            switch (tool) {
                case "BruteSSH.exe":
                    this.ns.brutessh(server.name)
                    break;
            
                case "FTPCrack.exe":
                    this.ns.ftpcrack(server.name)
                    break;
                
                case "HTTPWorm.exe":
                    this.ns.httpworm(server.name)
                    break;

                case "SQLInject.exe":
                    this.ns.sqlinject(server.name)
                    break;

                case "relaySMTP.exe":
                    this.ns.relaysmtp(server.name)
                default:
                    break;
            }
        })
    }

    canRoot(server: IServer): boolean {
        return server.requiredHackingLevel <= this.nsPlayer.hacking && server.requiredPorts <= this.toolsInstalled().length
    }

    private toolsInstalled(): (keyof Programs)[] {
        return <(keyof Programs)[]>this.ns.ls('home').filter(file => Object.keys(Player.programs).includes(file))
    }
}

export class PlayerFactory {
    static current(ns: NS): IPlayer {
        return new Player(ns.getPlayer(), ns)
    }
}