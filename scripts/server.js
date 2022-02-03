class Server {
    constructor(player, nsServer) {
        this.player = player;
        this.nsServer = nsServer;
    }
    isHome() {
        return this.nsServer.hostname === 'home';
    }
    canRoot() {
        return this.player.canRoot(this);
        // return this.requiredHackingLevel <= this.ns.getHackingLevel() && this.ns.getServerNumPortsRequired(this.host) <= 1
    }
    async runScript(script, args) {
        this.root();
        await script.copyTo(this);
        script.killOn(this);
        script.executeOn(this, args);
    }
    get requiredPorts() {
        return this.nsServer.numOpenPortsRequired;
    }
    get name() {
        return this.nsServer.hostname;
    }
    get maxMoney() {
        return this.nsServer.moneyMax;
    }
    get securityLevel() {
        return this.nsServer.hackDifficulty;
    }
    get moneyAvailable() {
        return this.nsServer.moneyAvailable;
    }
    get requiredHackingLevel() {
        return this.nsServer.requiredHackingSkill;
    }
    get maxRam() {
        return this.nsServer.maxRam;
    }
    root() {
        this.player.getRootOn(this);
    }
}
export class ServerFactory {
    constructor(ns, player) {
        this.ns = ns;
        this.player = player;
    }
    home() {
        return this.fromName('home');
    }
    fromName(name) {
        if (!ServerFactory.serverMap.has(name)) {
            ServerFactory.serverMap.set(name, new Server(this.player, this.ns.getServer(name)));
        }
        // avoid bitburner's ram detection
        return ServerFactory.serverMap["get"](name);
    }
    neighborsFor(name) {
        return this.ns.scan(name).map(neighbor => this.fromName(neighbor));
    }
}
ServerFactory.serverMap = new Map();
