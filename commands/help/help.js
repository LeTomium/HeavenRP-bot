const config = require("../../config/default.json")
const { MessageEmbed } = require("discord.js")
const { SubcommandError } = require("../../src/errors")

module.exports = {
    name: "help",
    permission: "everyone",
    channelType: ["text", "dm"],
    aliases: ["info"],
    usage: `help <commandname?>`,
    requireArgs: false,
    description: `Affiche les informations concernant la commande *commandname* si spécifié, ou les informations de toutes les commandes sinon`,
    execute: (client, msg, args) => {
        const commandName = args[0]
        if (!commandName) {
            const msgEmbedTemplate = new MessageEmbed() 
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`Affiche les informations des commandes dans le RP.`)
            .setTitle(`La commande help`)
            .setColor(config.color)
            .setTimestamp()

            client.commands.forEach((command) => {
            
                msgEmbedTemplate
                    .addField(`La commande \`${command.name}\`${command.aliases ? ` ou \`${command.aliases.join(" ou ")}\`` : ""}`, `
                        ${command.description}${command.permission === "admin" ? ` (administrateur seulement)` : ""}
                    `.replace(/\n\t/, "").replace(/ +/g, " "))
            })
            msg.channel.send({ embed: msgEmbedTemplate })
        } else {
            const command = client.commands.get(commandName)
                         || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))
            if (!command)
                throw new SubcommandError(`Cette commande n'existe pas`)
            // Affichage de la fiche d'aide de la commande
            const subcommands = client.subcommands.get(command.name)
            
            const msgEmbedTemplate = new MessageEmbed() 
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(command.description)
                .setTitle(`La commande ${command.name}`)
                .setColor(config.color)
                .setTimestamp()
    
            subcommands.forEach((subcommand) => {
                msgEmbedTemplate
                    .addField(`La sous commande \`${subcommand.name}\``, `
                        ${subcommand.aliases ? `Autres noms : ${subcommand.aliases.join(", ")}` : ""}
                        Usage : \`${config.prefix}${command.name !== "help" ? command.name : subcommand.name}${subcommand.usage ? " " + subcommand.usage : ""}\`
                        Description : ${subcommand.description}
                        ${command.permission === "admin" ? ` (administrateur seulement)` : ""}
                    `.replace(/\n\t/, "").replace(/ +/g, " "))
            })
            
            msg.channel.send({ embed: msgEmbedTemplate })
        }
    }
}
