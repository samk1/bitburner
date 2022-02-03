class HackTarget {
    constructor(server, ns) {
        this.server = server;
        this.ns = ns;
    }
    get canHack() {
        return this.ns.getHackingLevel() > this.server.requiredHackingLevel;
    }
    execHackScript(script) {
        const hackScriptThreads = this.server.maxRam / this.ns.getScriptRam(script);
        this.ns.scp(script, 'home', this.server.name);
        this.ns.exec(script, this.server.name, hackScriptThreads);
    }
}
export {};
