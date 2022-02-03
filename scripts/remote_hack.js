export async function main(ns) {
    async function stealMoneyFrom(target) {
        const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
        const securityThresh = ns.getServerMinSecurityLevel(target) + 5;
        if (ns.fileExists("BruteSSH.exe", "home")) {
            ns.brutessh(target);
        }
        ns.nuke(target);
        while (true) {
            const serverSecurityLevel = ns.getServerSecurityLevel(target);
            const serverMoneyAvailable = ns.getServerMoneyAvailable(target);
            ns.print("server security difference from threshold: ");
            ns.print(serverSecurityLevel - securityThresh);
            ns.print("money available difference from threshold: ");
            ns.print(serverMoneyAvailable - moneyThresh);
            if (ns.getServerSecurityLevel(target) > securityThresh) {
                await ns.weaken(target);
            }
            else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
                await ns.grow(target);
            }
            else {
                await ns.hack(target);
            }
        }
    }
    await stealMoneyFrom(ns.args[0]);
}
