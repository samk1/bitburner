class Player {
    constructor(nsPlayer, ns) {
        this.nsPlayer = nsPlayer;
        this.ns = ns;
    }
    getRootOn(server) {
        this.toolsInstalled().forEach(tool => {
            switch (tool) {
                case "BruteSSH.exe":
                    this.ns.brutessh(server.name);
                    break;
                case "FTPCrack.exe":
                    this.ns.ftpcrack(server.name);
                    break;
                case "HTTPWorm.exe":
                    this.ns.httpworm(server.name);
                    break;
                case "SQLInject.exe":
                    this.ns.sqlinject(server.name);
                    break;
                case "relaySMTP.exe":
                    this.ns.relaysmtp(server.name);
                default:
                    break;
            }
        });
    }
    canRoot(server) {
        return server.requiredHackingLevel <= this.nsPlayer.hacking && server.requiredPorts <= this.toolsInstalled().length;
    }
    toolsInstalled() {
        return this.ns.ls('home').filter(file => Object.keys(Player.programs).includes(file));
    }
}
Player.programs = {
    "BruteSSH.exe": "brutessh",
    "FTPCrack.exe": "ftpcrack",
    "relaySMTP.exe": "relaysmtp",
    "HTTPWorm.exe": "httpworm",
    "SQLInject.exe": "sqlinject",
};
export class PlayerFactory {
    static current(ns) {
        return new Player(ns.getPlayer(), ns);
    }
}
