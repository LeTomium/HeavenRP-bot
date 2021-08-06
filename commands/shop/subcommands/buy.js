const { Database } = require("sqlite3")
const { CommandError, Success } = require("../../../src/errors")
const Util = require("../../../src/util")

module.exports = {
    name: "buy",
    command: "shop",
    permission: "everyone",
    channelType: ["text"],
    usage: `buy <count> <itemname>`,
    requireArgs: true,
    description: `Achète *n* items spécifiés du salon courent`,
    execute: (client, msg, args) => {

        const count = args.get("count")
        if (count <= 0)
            return

        const db = new Database("main.db", err => {
            if (!err) {

                const itemname = args.get("itemname")
                const member = msg.member
                db.get(`SELECT rowid, price FROM Items WHERE name = ? AND channelId = ?`, [itemname, msg.channel.id], (err, item) => {
                    if (!err) {
                        if (item) { // Vérifie si l'item existe déjà
                            if (item.price >= 0) {// Vérifie si l'item est en vente

                                db.get(`SELECT * FROM Players WHERE userId = ? AND guildId = ?`, [member.id, member.guild.id], (err, player) => {

                                    if (!err) {
                                        if (player) { // Vérifie si l'utilisateur est un joueur

                                            const total = player.dollars - item.price * count
                                            if (player.dollars >= item.price * count) {

                                                db.run(`UPDATE Players SET dollars = ? WHERE userId = ? AND guildId = ?`, [total, member.id, member.guild.id], err => {
                                                    if (!err) {
                                                        const itemId = item.rowid
                                                        db.get(`SELECT rowid, count FROM Stacks WHERE userId = ? AND guildId = ? AND itemId = ?`, [member.id, member.guild.id, itemId], (err, stack) => {
                            
                                                            if (!err) {
                                                                
                                                                if (stack) {
                                                                    db.run(`UPDATE Stacks SET count = ?, updatedAt = DATETIME("now") WHERE userId = ? AND guildId = ? AND itemId = ?`, [stack.count + count, member.id, member.guild.id, itemId], err => {
                                                                        if (!err) {
                                                                            Util.Log.append("logs.md", `${count} \`${itemname}\` has been bought by player \`${member.id}\` from the guild \`${member.guild.id}\`, from the channel \`${msg.channel.id}\``)
                                                                            Util.report(msg, new Success(`${count} ${itemname} ont été achetés par ${member.nickname || member.user.username}`))
                                                                        } else
                                                                            Util.report(msg, err)
                                                                    })
                                                                } else {
                                                                    db.run(`INSERT INTO Stacks (userId, guildId, itemId, count, updatedAt) VALUES (?, ?, ?, ?, DATETIME("now"))`, [member.id, member.guild.id, itemId, count], err => {
                                                                        if (!err) {
                                                                            Util.Log.append("logs.md", `${count} \`${itemname}\` has been bought by player \`${member.id}\` from the guild \`${member.guild.id}\`, from the channel \`${msg.channel.id}\``)
                                                                            Util.report(msg, new Success(`${count} ${itemname} ont été achetés par ${member.nickname || member.user.username}`))
                                                                        } else
                                                                            Util.report(msg, err)
                                                                    })
                                                                }
                                                            } else
                                                                Util.report(msg, err) 
                                                        })
                                                    } else
                                                        Util.report(msg, err)
                                                })
                                            } else
                                                Util.report(msg, new CommandError(`Il vous manque ${Math.abs(total)} $ pour acheter ${count} ${itemname}\n(${itemname} vaut ${item.price} $ actuellement)`))
                                        } else
                                            Util.report(msg, new CommandError(`Vous devez faire partie du jeu pour executer cette commande`))
                                    } else
                                        Util.report(msg, err)
                                })
                            } else
                                Util.report(msg, new CommandError(`Cet item n'est pas en vente`))
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
