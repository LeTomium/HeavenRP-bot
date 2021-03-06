const { Database } = require("sqlite3")
const { CommandError, Success } = require("../../../src/errors")
const Util = require("../../../src/util")


module.exports = {
    name: "delete",
    command: "item",
    permission: "admin",
    channelType: ["text"],
    usage: `delete <itemname>`,
    requireArgs: true,
    description: `Supprime l'item spécifié dans le salon courent`,
    execute: (client, msg, args) => {
        const db = new Database("main.db", err => {
            if (!err) {
                
                const itemname = args.get("itemname")
                const member = msg.member
                db.get(`SELECT rowid FROM Items WHERE name = ? AND channelId = ?`, [itemname, msg.channel.id], (err, item) => {

                    if (!err) {
                        if (item) { // Vérifie si l'item existe déjà

                            db.run(`DELETE FROM Stacks WHERE itemId = ?`, [item.rowid], err => {
                                if (!err) {
                                    db.run(`DELETE FROM Items WHERE rowid = ?`, [item.rowid], err => {
                                        if (!err) {
                                            Util.Log.append("logs.md", `Item \`${itemname}\` deleted by \`${member.id}\` from the guild \`${member.guild.id}\`, from the channel \`${msg.channel.id}\``)
                                            Util.report(msg, new Success(`Item ${itemname} a bien été supprimé`))
                                        } else
                                            Util.report(msg, err)
                                    })
                                } else
                                    Util.report(msg, err)
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
