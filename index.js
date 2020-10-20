const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()
const Discord = require("discord.js")
const fs = require("fs")
const { JsonDataBase } = require("simple-database-json")

const config = require("./config/default.json")
const token = require("./config/token.json")

const client = new Discord.Client()
client.commands = new Discord.Collection()
client.subcommands = new Discord.Collection()
client.databases = new Discord.Collection()
client.getUsersFromMention = (mention, msg) => {
    if (!mention) return []

    let users = []

    if (mention.startsWith("<@") && mention.endsWith(">")) {
        mention = mention.slice(2, -1)

        if (mention.startsWith("!") || mention.startsWith("&"))
            mention = mention.slice(1)

        if (msg.guild.members.cache.has(mention)) {
            if (!msg.guild.members.cache.get(mention).user.bot)
                users.push(msg.guild.members.cache.get(mention))
        } else if (msg.guild.roles.cache.has(mention)) {
            users = users.concat(msg.guild.roles.cache.get(mention).members.array().filter((member => member.user.bot)))
        }
    } else if (mention === "@everyone") {
        users = users.concat(msg.guild.members.cache.array().filter((member => !!member.user.bot)))
    }
    return users
}


client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)

    const commandFiles = fs.readdirSync("./commands").filter((file) => !file.includes("."))

    for (const commandName of commandFiles) {
        const command = require(`./commands/${commandName}/${commandName}`)
        fs.access(`./commands/${commandName}/subcommands`, err => {
            if (err) return
            command.execute = (client, msg, args) => {
                const subcommands = client.subcommands.get(commandName)
        
                let subcommand = subcommands.find((subcommands) => subcommands.name === args[0])
                              || subcommands.find((subcommands) => subcommands.aliases && subcommands.aliases.includes(args[0]))
                if (subcommand) {
                    if (subcommand.permission === "admin" && !msg.member.hasPermission("ADMINISTRATOR"))
                        throw `Error: Vous devez avoir les droits administrateurs pour executer cette commande.`

                    if (subcommand.execute)
                        subcommand.execute(client, msg, args)
                } else {
                    const subcommands = client.subcommands.get(command.name)
    
                    const msgEmbedTemplate = new Discord.MessageEmbed() 
                        .setThumbnail(client.user.displayAvatarURL())
                        .setDescription(command.description)
                        .setTitle(`La commande ${command.name}`)
                        .setColor(config.color)
                        .setTimestamp()
    
                    subcommands.forEach((subcommand) => {
                        msgEmbedTemplate
                            .addField(`- La sous commande *${subcommand.name}*`, `
                                ${subcommand.aliases ? ` :white_small_square: __Autres noms__ : ${subcommand.aliases.join(", ")}` : ""}
                                :white_small_square: __Exemple__ : \`${config.prefix}${command.name !== "help" ? command.name : subcommand.name}${subcommand.usage ? " " + subcommand.usage : ""}\`
                                :white_small_square: __Description__ :
                                ${subcommand.description}${command.permission === "admin" ? ` (administrateur seulement)` : ""}
                            `.replace(/\n\t/, "").replace(/ +/g, " "))
                    })
    
                    if (command.name !== "help") {
                        msgEmbedTemplate
                            .addField(`- La sous commande *help*`, `
                                :white_small_square: __Exemple__ : \`${config.prefix}help\`
                                :white_small_square: __Description__ :
                                Affiche les informations concernant la commande !${command.name}.
                            `.replace(/\n\t/, "").replace(/ +/g, " "))
                    }
                    
                    msg.channel.send({ embed: msgEmbedTemplate })
                }
            }
            const subcommandsFiles = fs.readdirSync(`./commands/${commandName}/subcommands`).filter((file) => file.endsWith(".js"))
            if (!client.subcommands.has(commandName))
                client.subcommands.set(commandName, [])
            for (const subcommandName of subcommandsFiles) {
                const subcommand = require(`./commands/${commandName}/subcommands/${subcommandName}`)
                client.subcommands.get(commandName).push(subcommand)
            }
        })
        client.commands.set(command.name, command)
    }

    client.guilds.cache.each((guild, guildId) => {
        const db = new JsonDataBase(`databases/${guildId}.json`)

        client.databases.set(guildId, db)
    
        if (!db.tableExists("items")) {
            db.createTable("items", [
                {
                    name: "name",
                    type: "string"
                },
                {
                    name: "price",
                    type: "number",
                    default: -1
                }
            ])
        }
        if (!db.tableExists("players")) {
            db.createTable("players", [
                {
                    name: "userid",
                    type: "string"
                },
                {
                    name: "items",
                    type: "object",
                    default: []
                },
                {
                    name: "money",
                    type: "number",
                    default: 0
                }
            ])
        }
        guild.members.cache.each((member) => {
            if (!member.user.bot) {
                db.count("players", record => record["userid"] === member.id, (err, count) => {
                    if (err)
                        throw err
                    if (count === 0) {
                        db.insert("players", { userid: member.id }, err => {
                            if (err)
                                throw err
                        })
                    }
                })
            }
        })
    })
})

client.on("guildMemberAdd", member => {
    const db = client.databases.get(member.guild.id)

    if (!member.user.bot) {
        db.count("players", record => record.userid === member.id, (err, count) => {
            if (err)
                throw err
            if (count === 0) {
                db.insert("players", { userid: member.id }, err => {
                    if (err)
                        throw err
                })
            }
        })
    }
})

client.on("message", msg => {
    if (msg.channel.type === "mp") return
    if (msg.author.id === client.user.id) return

    msg.content.split("\n").forEach((line) => {
        if (!line.startsWith(config.prefix)) return

        const args = line.slice(config.prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()
    
        const command = client.commands.get(commandName)
                     || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

        if (!command) return

        try {
            if (command.permission === "admin") {
                if (!msg.member.hasPermission("ADMINISTRATOR")) {
                    throw `Error: Vous devez avoir les droits administrateurs pour executer cette commande.`
                }
            }
            command.execute(client, msg, args)
        } catch (error) {
            let successKeyword = "Success: ",
                errorKeyword = "Error: "
            if (!Boolean(error.message) && error.startsWith(successKeyword)) {
                msg.reply(`:white_check_mark: ${error.slice(successKeyword.length)}`)
            } else if (!Boolean(error.message) && error.startsWith(errorKeyword)) {
                console.error(error)
                msg.reply(`:warning: **Erreur de commande** : ${error.slice(errorKeyword.length)}`)
            } else {
                console.error(error)
                msg.reply(`:x: **Erreur interne** : \`${error.message}\``)
            }
        }
    })
})

client.login(token.id)