const { MessageEmbed } = require("discord.js")
const { Database } = require("sqlite3")
const Util = require("../../../src/util")
const config = require("../../../config/default.json")

module.exports = {
    name: "see",
    command: "shop",
    aliases: ["show"],
    permission: "everyone",
    channelType: ["text"],
    usage: `see <itemname>`,
    requireArgs: false,
    description: `Affiche la liste des informations de tous les items du salon courent`,
    execute: (client, msg, args) => {
        const member = msg.member
        const db = new Database("main.db", err => {
            if (!err) {
                const msgEmbedTemplate = new MessageEmbed()
                    .setAuthor(client.user.username)
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(config.color)
                    .setTimestamp()

                var description = ""
                db.all(`SELECT name, price FROM Items WHERE guildId = ? AND channelId = ?`, [member.guild.id, msg.channel.id], (err, items) => {
                    if (!err) {
                        const buyableItems = items.filter(item => item.price >= 0).sort((next, previous) => previous.price - next.price)
                        if (buyableItems.length > 0) {
                            buyableItems.forEach((item) => {
                                let price
                                if (item.price == 0)
                                    price = `Gratuit`
                                else
                                    price = `${item.price} $`
                                description = description.concat(`\n- **${item.name}** : ${price}`)
                            })
                            msgEmbedTemplate.setDescription(description)
                        } else
                            msgEmbedTemplate.setDescription("Aucun item n'est en vente dans ce salon")
                        msg.channel.send({ embed: msgEmbedTemplate })
                    } else
                        Util.report(msg, err)
                })
            } else
                Util.report(msg, err)
        })
    }
}