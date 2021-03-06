const { Database }= require("sqlite3")
const { CommandError, Success } = require("../../../src/errors")
const Util = require("../../../src/util")

module.exports = {
    name: "give",
    command: "item",
    permission: "admin",
    channelType: ["text"],
    usage: `give <count> <itemname> <@mention>`,
    requireArgs: true,
    description: `Donne *n* items spécifiés du salon courent à *@mention*`,
    execute: (client, msg, args) => {
        
        const count = args.get("count")
        if (count < 0)
            return

        const db = new Database("main.db", err => {
            if (!err) {

                const itemname = args.get("itemname")
                db.get(`SELECT rowid FROM Items WHERE name = ? AND channelId = ?`, [itemname, msg.channel.id], (err, item) => {
                    if (!err) {
                        if (item) { // Vérifie si l'item existe déjà
                            const itemId = item.rowid
                            args.get("members").forEach(member => { // Parcours tous les membres mentionés
                                db.get(`SELECT rowid, count FROM Stacks WHERE userId = ? AND guildId = ? AND itemId = ?`, [member.id, member.guild.id, itemId], (err, stack) => {

                                    if (!err) {
                                        if (stack) {
                                            
                                            db.run(`UPDATE Stacks SET count = ?, updatedAt = DATETIME("now") WHERE userId = ? AND guildId = ? AND itemId = ?`, [stack.count + count, member.id, member.guild.id, itemId], err => {
                                                if (!err) {
                                                    Util.Log.append("logs.md", `${count} \`${itemname}\` given to player \`${member.id}\` from the guild \`${member.guild.id}\`, from the channel \`${msg.channel.id}\``)
                                                    Util.report(msg, new Success(`${count} ${itemname} ont bien été donnés à ${member.nickname || member.user.username}`))
                                                } else
                                                    Util.report(msg, err)
                                            })
                                        } else {
                                            db.run(`INSERT INTO Stacks (userId, guildId, itemId, count, updatedAt) VALUES (?, ?, ?, ?, DATETIME("now"))`, [member.id, member.guild.id, itemId, count], err => {
                                                if (!err) {
                                                    Util.Log.append("logs.md", `${count} \`${itemname}\` given to player \`${member.id}\` from the guild \`${member.guild.id}\`, from the channel \`${msg.channel.id}\``)
                                                    Util.report(msg, new Success(`${count} ${itemname} ont bien été donnés à ${member.nickname || member.user.username}`))
                                                } else
                                                    Util.report(msg, err)
                                            })
                                        }
                                    } else
                                        Util.report(msg, err)  
                                })
                            })
                        } else
                            Util.report(msg, new CommandError(`Cet item n'existe pas dans ce salon`))
                    } else
                        Util.report(msg, err)
                })
            } else
                Util.report(msg, err)                
        })
        db.close()
    }
}
