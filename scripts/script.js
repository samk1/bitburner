class Script {
    constructor(ns, filename) {
        this.ns = ns;
        this.filename = filename;
    }
    get memUsage() {
        return this.ns.getScriptRam(this.filename);
    }
    killOn(server) {
        this.ns.ps(server.name)
            .filter(process => process.filename === this.filename)
            .map(process => process.pid)
            .forEach(pid => this.ns.kill(pid));
    }
    async copyTo(server) {
        await this.ns.scp(this.filename, server.name);
    }
    executeOn(server, args) {
        this.ns.tprint(`server: ${server.name}, maxram: ${server.maxRam}, memusage: ${this.memUsage}`);
        this.ns.exec(this.filename, server.name, server.maxRam / this.memUsage, ...args);
    }
}
export class ScriptFactory {
    constructor(ns) {
        this.ns = ns;
    }
    fromFilename(filename) {
        return new Script(this.ns, filename);
    }
}
