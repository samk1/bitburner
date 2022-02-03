import { NS } from "../types/NetscriptDefinitions";
import { IServer } from "./server";

export interface IScript {
    killOn(server: IServer): void;
    filename: string;
    memUsage: number
    copyTo(server: IServer): Promise<void>
    executeOn(server: IServer, args: (string | number | boolean)[]): void
}

class Script implements IScript {
    constructor(
        private ns: NS,
        public filename: string
    ) {}

    public get memUsage(): number {
        return this.ns.getScriptRam(this.filename)
    }

    killOn(server: IServer) {
        this.ns.ps(server.name)
            .filter(process => process.filename === this.filename)
            .map(process => process.pid)
            .forEach(pid => this.ns.kill(pid))
    }

    async copyTo(server: IServer): Promise<void> {
        await this.ns.scp(this.filename, server.name)
    }

    executeOn(server: IServer, args: (string | number | boolean)[]): void {
        this.ns.tprint(`server: ${server.name}, maxram: ${server.maxRam}, memusage: ${this.memUsage}`)
        this.ns.exec(this.filename, server.name, server.maxRam / this.memUsage, ...args);
    }

}

export class ScriptFactory {
    constructor(
        private ns: NS,
    ) {}

    fromFilename(filename: string): IScript {
        return new Script(this.ns, filename)
    }
}