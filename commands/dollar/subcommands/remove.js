const { Database }= require("sqlite3")
const { Success } = require("../../../src/errors")
const Util = require("../../../src/util")

module.exports = {
    name: "remove",
    command: "dollar",
    aliases: ["clear"],
    permission: "admin",
    channelType: ["text"],
    usage: `remove <count> <@mention>`,
    requireArgs: true,
    description: `Retire *n* $ à *@mention*`,
    execute: (client, msg, args) => {
        
        const count = args.get("count")
        if (count < 0)
            return

        const db = new Database("main.db", err => {
            if (!err) {

                args.get("members").forEach(member => {
                    db.get(`SELECT dollars FROM Players WHERE userId = ? AND guildId = ?`, [member.id, member.guild.id], (err, player) => {
                        if (!err) {

                            var dollars = player.dollars - count
                            if (dollars < 0)
                                dollars = 0

                            db.run(`UPDATE Players SET dollars = ? WHERE userId = ? AND guildId = ?`, [dollars, member.id, member.guild.id], err => {
                                if (!err) {
                                    Util.Log.append("logs.md", `${dollars > 0 ? count : player.dollars} $ removed to player \`${member.id}\` from the guild \`${member.guild.id}\`, from the channel \`${msg.channel.id}\``)
                                    Util.report(msg, new Success(`${dollars > 0 ? count : player.dollars} $ ont bien été retirés à ${member.nickname || member.user.username}`))
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
