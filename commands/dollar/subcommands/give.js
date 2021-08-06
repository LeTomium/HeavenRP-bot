const Util = require("../../../src/util")
const { Database }= require("sqlite3")
const { Success } = require("../../../src/errors")

module.exports = {
    name: "give",
    command: "dollar",
    aliases: ["add"],
    permission: "admin",
    channelType: ["text"],
    usage: `give <count> <@mention>`,
    requireArgs: true,
    description: `Donne *n* $ à *@mention*`,
    execute: (client, msg, args) => {
        
        const count = args.get("count")
        if (count < 0)
            return

        const db = new Database("main.db", err => {
            if (!err) {
                
                args.get("members").forEach(member => {
                    db.get(`SELECT dollars FROM Players WHERE userId = ? AND guildId = ?`, [member.id, member.guild.id], (err, player) => {
                        if (!err) {
                            
                            var dollars = player.dollars + count
                            db.run(`UPDATE Players SET dollars = ? WHERE userId = ? AND guildId = ?`, [dollars, member.id, member.guild.id], err => {
                                if (!err) {
                                    Util.Log.append("logs.md", `${count} $ given to player \`${member.id}\` from the guild \`${member.guild.id}\`, from the channel \`${msg.channel.id}\``)
                                    Util.report(msg, new Success(`${count} $ ont bien été donnés à ${member.nickname || member.user.username}`))
                                } else
                                    Util.report(msg, err)
                            })
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
