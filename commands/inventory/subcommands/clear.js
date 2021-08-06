const { Database } = require("sqlite3")
const { CommandError, Success } = require("../../../src/errors")
const Util = require("../../../src/util")

module.exports = {
    name: "clear",
    command: "inventory",
    permission: "admin",
    channelType: ["text"],
    usage: `clear <@mention>`,
    requireArgs: true,
    description: `Retire tous les items de l'inventaire de *@mention*`,
    execute: (client, msg, args) => {
        const db = new Database("main.db", err => {
            if (!err) {
                args.get("members").forEach(member => {
                    db.run(`DELETE FROM Stacks WHERE userId = ? AND guildId = ?`, [member.id, member.guild.id], err => {
                        if (!err) {
                            Util.Log.append("logs.md", `Players \`${member.id}\` from the guild \`${member.guild.id}\`, from the channel \`${msg.channel.id}\`, has now the inventory cleared`)
                            Util.report(msg, new Success(`${member.nickname || member.user.username} a désormais l'inventaire vide`))
                        } else
                            Util.report(msg, err)
                    })
                })
            } else
                Util.report(msg, err)
        })
        db.close()
    }
}
