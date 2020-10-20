const config = require("../../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()

const { MessageEmbed } = require("discord.js")

module.exports = {
    name: name,
    aliases: ["show"],
    command: dirname,
    permission: "everyone",
    usage: `see [itemname]`,
    description: `Affiche les informations de l'item (prix).`,
    execute: (client, msg, args) => {
        const subcommandName = args[0],
              itemname = args[1]

        const db = client.databases.get(msg.guild.id)
        const msgEmbedTemplate = new MessageEmbed()
            .setAuthor(client.user.username)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(config.color)
            .setTimestamp()
        if (itemname === undefined) {
            var description = ""
            db.select("items", record => true, (err, data) => {
                if (err)
                    throw err
                data.sort((next, previous) => previous.price - next.price).forEach((item) => {
                    let price
                    if (item.price < 0) return
                    if (item.price == 0) {
                        price = `*Gratuit*`
                    } else {
                        price = `${item.price} :money_with_wings:`
                    }
                    description = description.concat(`\n- **${item.name}** : ${price}`)
                    msgEmbedTemplate.setDescription(description)
                })
                return
            })
            if (description == "")
                description = "*Aucun item n'est en vente.*"
        } else {
            var item
            db.select("items", record => record["name"] === itemname, (err, data) => {
                if (err)
                    throw err
                if (data.length === 0)
                    throw `Error: Aucun item ne répond à ce nom.`
                else
                    item = data[0]
            })
            db.each("items", record => record["name"] === itemname, (err, item) => {
                if (err)
                    throw err
                let price
                if (item.price > 0) {
                    price = `${item.price} $`
                } else if (item.price < 0) {
                    price = `*Inaccessible* `
                } else {
                    price = `*Gratuit*`
                }
                msgEmbedTemplate.setTitle(`**${item.name}** : ${price}`)  
            })
        }

        msg.channel.send({ embed: msgEmbedTemplate })
    }
}
