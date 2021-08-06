const config = require("../../../config/default.json")

const { MessageEmbed, Collection, ChannelManager } = require("discord.js")
const { Database } = require("sqlite3")
const Util = require("../../../src/util")
const { CommandError, PermissionCommandError } = require("../../../src/errors/")

module.exports = {
    name: "see",
    command: "inventory",
    aliases: ["show"],
    permission: "everyone",
    channelType: ["text"],
    usage: `see <@mention?>`,
    requireArgs: false,
    description: `Affiche l'inventaire de *@mention* si spécifié, son propre inventaire sinon`,
    execute: (client, msg, args) => {
            
        // Affiche les items du joueur mentionné
        var member
        if (args.get("members")) {
            member = Array.from(args.get("members"))[0]
            if (msg.member != member && !msg.member.hasPermission("ADMINISTRATOR"))
                throw new PermissionCommandError(`Vous devez avoir les droits administrateurs pour voir l'inventaires des autres joueurs`)
        } else
            member = msg.member
        const db = new Database("main.db", err => {
            if (!err) {
                db.run(`DELETE FROM Stacks WHERE count = 0`, err => {
                    if (!err) {
                        db.get(`SELECT dollars FROM Players WHERE userId = ? AND guildId = ?`, [member.id, member.guild.id], (err, player) => {
                            if (!err) {
                                if (player) {
                                    const inventory = new Collection()
                                    var description = ""
                                    const msgEmbedTemplate = new MessageEmbed()
                                        .setThumbnail(member.user.displayAvatarURL())
                                        .setTitle(`${member.nickname || member.user.username} : ${player.dollars} $`)
                                        .setColor(config.color)
                                        .setTimestamp()
                                    db.all(`SELECT itemId, count FROM Stacks WHERE userId = ? AND guildId = ?`, [member.id, member.guild.id], (err, stacks) => {
                                        if (!err) {
                                            if (stacks.length > 0) {
                                                stacks.forEach((stack, i) => {
                                                    if (stack.count > 0) {
                                                        db.get(`SELECT channelId, name, price FROM Items WHERE rowid = ?`, [stack.itemId], (err, item) => {
                                                            if (!err) {
                                                                if (!inventory.has(item.channelId))
                                                                    inventory.set(item.channelId, [item])
                                                                else
                                                                    inventory.get(item.channelId).push(item)
                                                                if (i >= stacks.length - 1) { // Vérifie si on s'occupe du dernier stack
                                                                    var j = 0
                                                                    if (inventory.size > 0) {
                                                                        inventory.each((items, channelId) => {
                                                                            // const channel = client.channels.cache.get(channelId) // Doesn't work :/
                                                                            const channel = client.channels.cache.map(ch => ch).find(ch => ch == channelId)
                                                                            const channelName = channel.name[0].toUpperCase().concat(channel.name.replace(/_|-/, " ").slice(1))
                                                                            description = description.concat(`\n**${channelName}**`)
                                                                            items.forEach(item => {
                                                                                j++
                                                                                description = description.concat(`\n- ${stack.count} ${item.name} (${item.price > 0 ? `${item.price} $ l'unité` : item.price == 0 ? "Gratuit" : "Inaccessible"})`)
                                                                            })
                                                                            if (j >= stacks.length - 1) { // Vérifie si on s'occupe du dernier item
                                                                                msgEmbedTemplate.setDescription(description)
                                                                                msg.channel.send({ embed: msgEmbedTemplate })
                                                                            }
                                                                        })
                                                                    } else {
                                                                        msgEmbedTemplate.setDescription("Aucun item en possession")
                                                                        msg.channel.send({ embed: msgEmbedTemplate })   
                                                                    }
                                                                }
                                                            } else
                                                                Util.report(msg, err)
                                                        })
                                                    }
                                                })
                                            } else {
                                                msgEmbedTemplate.setDescription("Aucun item en possession")
                                                msg.channel.send({ embed: msgEmbedTemplate })   
                                            }
                                        } else
                                            Util.report(msg, err)
                                    })
                                } else
                                    Util.report(msg, new CommandError(`Vous ou le joueur mentionné devez faire partie du jeu`))
                            } else
                                Util.report(msg, err)
                        })
                    } else
                        Util.report(msg, err)
                })
            } else
                Util.report(msg, err)
        })
    }
}
