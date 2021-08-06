const { Database }= require("sqlite3")
const { CommandError, Success } = require("../../../src/errors")
const Util = require("../../../src/util")

module.exports = {
    name: "create",
    command: "item",
    aliases: ["add"],
    permission: "admin",
    channelType: ["text"],
    usage: `create <itemname>`,
    requireArgs: true,
    description: `Crée un item avec le nom spécifié dans le salon courent`,
    execute: (client, msg, args) => {
        const db = new Database("main.db", err => {
            if (!err) {
                
                const itemname = args.get("itemname")
                const member = msg.member
                db.get(`SELECT rowid FROM Items WHERE name = ? AND channelId = ?`, [itemname], (err, item) => {

                    if (!err) {
                        if (!item) { // Vérifie si l'item existe déjà

                            db.run(`INSERT INTO Items (creatorId, guildId, channelId, name, createdAt, updatedAt) VALUES (?, ?, ?, ?, DATETIME("now"), DATETIME("now"))`, [member.id, member.guild.id, msg.channel.id, itemname], err => {
                                if (!err) {
                                    Util.Log.append("logs.md", `Item \`${itemname}\` created by \`${member.id}\` from the guild \`${member.guild.id}\`, from the channel \`${msg.channel.id}\``)
                                    Util.report(msg, new Success(`L'item ${itemname} a bien été créé`))
                                } else
                                    Util.report(msg, err)
                            })
                        } else
                            Util.report(msg, new CommandError(`Cet item existe déjà dans ce salon`))
                    } else
                        Util.report(msg, err)
                })
            } else
                Util.report(msg, err)
        })
        db.close()
    }
}
