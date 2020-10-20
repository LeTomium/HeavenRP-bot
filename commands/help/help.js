const config = require("../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()

const { MessageEmbed } = require("discord.js")


module.exports = {
    name: name,
    permission: "everyone",
    usage: ``,
    description: `Affiche les informations des commandes dans le RP.`,
    execute: (client, msg, args) => {
        const msgEmbedTemplate = new MessageEmbed() 
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`Affiche les informations des commandes dans le RP.`)
            .setTitle(`La commande help`)
            .setColor(config.color)
            .setTimestamp()

        client.commands.forEach((command) => {
        
            msgEmbedTemplate
                .addField(`- La commande *${command.name}*`, `
                    ${command.aliases ? ` :white_small_square: __Autres noms__ : ${command.aliases.join(", ")}` : ""}
                    :white_small_square: __Exemple__ : \`${config.prefix}${command.name !== "help" ? command.name : command.name}${command.usage ? " " + !command.usage : ""}\`
                    :white_small_square: __Description__ :
                    ${command.description}${command.permission === "admin" ? ` (administrateur seulement)` : ""}
                `.replace(/\n\t/, "").replace(/ +/g, " "))

        })
        msg.channel.send({ embed: msgEmbedTemplate })
    }
}
