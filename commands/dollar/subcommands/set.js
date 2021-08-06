const { Database }= require("sqlite3")
const { Success } = require("../../../src/errors")
const Util = require("../../../src/util")

module.exports = {
    name: "set",
    command: "dollar",
    permission: "admin",
    channelType: ["text"],
    usage: `set <count> <@mention>`,
    requireArgs: true,
    description: `Place *n* $ à *@mention*`,
    execute: (client, msg, args) => {
        
        const count = args.get("count")
        if (count < 0)
            return

        const db = new Database("main.db", err => {
            if (!err) {
                args.get("members").forEach(member => {
                    db.run(`UPDATE Players SET dollars = ? WHERE userId = ? AND guildId = ?`, [count, member.id, member.guild.id], err => {
                        if (!err) {
                            Util.Log.append("logs.md", `Player \`${member.id}\` from the guild \`${member.guild.id}\`, from the channel \`${msg.channel.id}\`, has now ${count} $`)
                            Util.report(msg, new Success(`\`${member.nickname || member.user.username}\` possède désormais ${count} $`))
                        } else
                            Util.report(msg, err)
                    })
                })
            } else
                Util.report(msg, err)

            db.close()
        })
    }
}
