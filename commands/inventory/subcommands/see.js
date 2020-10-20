const config = require("../../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()

const { MessageEmbed } = require("discord.js")

module.exports = {
    name: name,
    command: dirname,
    aliases: ["show"],
    permission: "everyone",
    usage: `see`,
    description: `Affiche l'inventaire de *@username*.`,
    execute: (client, msg, args) => {
        var member = client.getUsersFromMention(args[1],msg)[0]

        if (member === undefined)
            member = msg.guild.members.cache.get(msg.author.id)
            
        const db = client.databases.get(msg.guild.id)

        db.each("players", record => record["userid"] === member.id, (err, player) => {
            if (err)
                throw err
            var description = ""
            const msgEmbedTemplate = new MessageEmbed()
                .setAuthor(member.nickname || member.user.username)
                .setThumbnail(member.user.displayAvatarURL())
                .setTitle(`${player.money} :money_with_wings:`)
                .setColor(config.color)
                .setTimestamp()
            
            player.items.forEach((item) => {
                if (item.count > 0) {
                    description = description.concat(`\n- **${item.name}** : ${item.count}`)
                }
            })
            if (description == "")
                description = "*Aucun item en possession.*"
            msgEmbedTemplate.setDescription(description)
            msg.channel.send({ embed: msgEmbedTemplate })
            return
        })
    }
}
