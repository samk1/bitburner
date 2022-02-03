import { NS, Server as NSServer } from "../types/NetscriptDefinitions"
import { IPlayer, PlayerFactory } from "./player"
import { IScript } from "./script"

export interface IServer {
    requiredPorts: number
    maxMoney: number
    isHome(): boolean
    canRoot(): boolean
    runScript(script: IScript, args: (string | number | boolean)[]): Promise<void>
    maxRam: number
    requiredHackingLevel: number
    name: string
    root(): void
}

class Server implements IServer {
    constructor(
        private player: IPlayer,
        private nsServer: NSServer,
    ) {
    }

    isHome(): boolean {
        return this.nsServer.hostname === 'home'
    }

    canRoot(): boolean {
        return this.player.canRoot(this)
        // return this.requiredHackingLevel <= this.ns.getHackingLevel() && this.ns.getServerNumPortsRequired(this.host) <= 1
    }

    public async runScript(script: IScript, args: (string | number | boolean)[]) {
        this.root()
        await script.copyTo(this)
        script.killOn(this)
        script.executeOn(this, args)
    }
    
    public get requiredPorts() : number {
        return this.nsServer.numOpenPortsRequired
    }

    public get name() : string {
        return this.nsServer.hostname
    }

    public get maxMoney() : number {
        return this.nsServer.moneyMax
    }

    public get securityLevel() : number {
        return this.nsServer.hackDifficulty   
    }

    public get moneyAvailable() : number {
        return this.nsServer.moneyAvailable
    }

    public get requiredHackingLevel() : number {
        return this.nsServer.requiredHackingSkill
    }

    public get maxRam() : number {
        return this.nsServer.maxRam
    }

    public root() {
        this.player.getRootOn(this)
    }
}

export class ServerFactory {
    static serverMap: Map<string, IServer> = new Map()

    constructor(
        private ns: NS,
        private player: IPlayer,
    ) {
    }

    home(): IServer {
        return this.fromName('home');
    }

    fromName(name: string): IServer {
        if (!ServerFactory.serverMap.has(name)) {
            ServerFactory.serverMap.set(name, new Server(this.player, this.ns.getServer(name)))
        }

        // avoid bitburner's ram detection
        return ServerFactory.serverMap["get"](name)!
    }

    neighborsFor(name: string): IServer[] {
        return this.ns.scan(name).map(neighbor => this.fromName(neighbor))
    }
}