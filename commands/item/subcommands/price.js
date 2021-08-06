const { Database }= require("sqlite3")
const { CommandError, Success } = require("../../../src/errors")
const Util = require("../../../src/util")
      
module.exports = {
    name: "price",
    command: "item",
    permission: "admin",
    channelType: ["text"],
    usage: `price <itemname> <count>`,
    requireArgs: true,
    description: `Change le prix de l'item spécifié du salon courent`,
    execute: (client, msg, args) => {
        const db = new Database("main.db", err => {
            if (!err) {
                const itemname = args.get("itemname")
                const price = args.get("count")
                db.get(`SELECT rowid FROM Items WHERE name = ? AND channelId = ?`, [itemname, msg.channel.id], (err, item) => {
                    if (!err) {
                        if (item) { // Vérifie si l'item n'existe pas
                            db.run(`UPDATE Items SET price = ? WHERE rowid = ?`, [price, item.rowid], err => {
                                if (!err) {
                                    Util.Log.append("logs.md", `Item \`${itemname}\` costs now ${price} $`)
                                    Util.report(msg, new Success(`l'item ${itemname} coûte désormais ${price} $`))
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
