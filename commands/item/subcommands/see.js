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
    usage: `see [@username] [itemname]`,
    description: `Affiche le nombre d'item de *@username*.`,
    execute: (client, msg, args) => {
        const subcommandName = args[0],
              member = client.getUsersFromMention(args[1],msg)[0],
              itemname = args[2]

        if (member === undefined)
            throw `Error: Vous devez mentionner un joueur puis un nom d'item.`
    
        if (itemname === undefined)
            throw `Error: Vous devez saisir un nom d'item.`
            
        const db = client.databases.get(msg.guild.id)
        var item
        db.each("items", record => record["name"] === itemname, (err, record) => {
            if (err)
                throw err
            item = record
            return
        })
        if (item === undefined)
            throw `Error: Aucun item ne répond à ce nom.`

        db.each("players", record => record["userid"] === member.id, (err, player) => {
            if (err)
                throw err
            let count = 0
            if (player.items.some((item) => item.name === itemname)) {
                count = player.items.find((item) => item.name === itemname).count
            }
            const msgEmbedTemplate = new MessageEmbed()
                .setAuthor(member.nickname || member.user.username)
                .setThumbnail(member.user.displayAvatarURL())
                .setTitle(`${player.money} :money_with_wings:`)
                .setDescription(`**${itemname}** : ${count}`)
                .setColor(config.color)
                .setTimestamp()
            msg.channel.send({ embed: msgEmbedTemplate })
            return
        })
    }
}
