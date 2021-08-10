const Discord = require("discord.js")
const fs = require("fs")
const { Database }= require("sqlite3")

const { PermissionCommandError, TypeArgumentError, RangeArgumentError, SubcommandError, CommandError } = require("./src/errors")
const Util = require("./src/util")

const config = require("./config/default.json")

const client = new Discord.Client()
client.commands = new Discord.Collection()
client.subcommands = new Discord.Collection()

client.once("ready", () => {
    Util.Log.append("logs.md", `Logged in as ${client.user.tag}`)
    // Ouverture de la BDD
    const db = new Database("main.db", err => {
        if (err) 
            throw err

        // Création la table "Players"
        db.run(`
            CREATE TABLE IF NOT EXISTS Players (
                userId INT NOT NULL,
                guildId INT NOT NULL,
                dollars INT NOT NULL DEFAULT 0,
                createdAt DATETIME
            )
        `, err => {
            if (err)
                throw err

            // Ajout tous les joueurs qui ne sont pas dans la table "Players"
            client.guilds.cache.each(guild => {
                guild.members.cache.each((member) => {
                    if (!member.user.bot) {
                        // Vérifie si le joueur appartient déjà à la table "Players"
                        db.get(`SELECT rowid FROM Players WHERE userId = ? AND guildId = ?`, [member.id, member.guild.id], (err, row) => {
                            if (err)
                                throw err
                                
                            if (!row) { // Insert le joueur dans la table
                                db.run(`INSERT INTO Players (userId, guildId, createdAt) VALUES (?, ?, DATETIME("now"))`, [member.id, member.guild.id], err => {
                                    if (err)
                                        throw err
                                    else
                                        Util.Log.append("logs.md", `Player \`${member.id}\` from the guild \`${member.guild.id}\`, has been registered in the table 'Players'`)
                                })
                            }
                        })
                    }
                })
            })
        })
        // Création de la table "Items"
        db.run(`
            CREATE TABLE IF NOT EXISTS Items (
                creatorId INT NOT NULL,
                guildId INT NOT NULL,
                channelId INT NOT NULL,
                name VARCHAR(63) NOT NULL,
                description VARCHAR(511) NULL,
                price INT NOT NULL DEFAULT -1,
                createdAt DATETIME,
                updatedAt DATETIME
            )
        `, err => {
            if (err)
                throw err
        })
        // Création de la table "Stacks"
        db.run(`
            CREATE TABLE IF NOT EXISTS Stacks (
                userId INT NOT NULL,
                guildId INT NOT NULL,
                itemId INT NOT NULL,
                count INT NOT NULL DEFAULT 0,
                updatedAt DATETIME
            )
        `, err => {
            if (err)
                throw err
        })
        // Fermeture de la BDD
        db.close()
    })

    // Initialise les commandes
    const commandFiles = fs.readdirSync("./commands").filter((file) => !file.includes("."))

    for (const commandName of commandFiles) {
        const command = require(`./commands/${commandName}/${commandName}`)
        if (fs.existsSync(`./commands/${commandName}/subcommands`)) {
            if (!command.execute) {
                command.execute = (client, msg, args) => {

                    if (args.length === 0 && command.requireArgs) 
                        throw new CommandError(`Cette commande requiert des arguments ou une sous-commande\n(Tapez \`${config.prefix}help ${commandName}\` pour plus d'informations)`)
                        
                    const subcommands = client.subcommands.get(commandName)
                    const subcommand = subcommands.find((subcommands) => subcommands.name === args[0])
                                    || subcommands.find((subcommands) => subcommands.aliases && subcommands.aliases.includes(args[0]))

                    if (!subcommand && command.requireArgs)
                        throw new SubcommandError(`Cette sous-commande n'existe pas`)
                        
                    if (subcommand.channelType && !subcommand.channelType.some(value => value === msg.channel.type)) // Vérifie si la commande permet d'être utilisée dans ce salon
                        throw new PermissionCommandError(`Vous ne pouvez pas exécuter cette commande dans ce salon`)
                    
                    if (msg.channel.type !== "dm") { // Vérifie si le message est envoyé dans le salon d'un serveur
                        if (subcommand.permission === "admin" && !msg.member.hasPermission("ADMINISTRATOR")) // Vérifie si la commande permet d'être seulement utilisée par les admin et si l'utilisateur est un admin
                            throw new PermissionCommandError(`Vous devez avoir les droits administrateurs pour exécuter cette commande`)
                    }
                    if (args.slice(1).length === 0 && subcommand.requireArgs) 
                        throw new CommandError(`Cette commande requiert des arguments ou une sous-commande\n(Utilisation de la commande : \`${config.prefix}${commandName} ${subcommand.usage}\`, tapez \`${config.prefix}help ${commandName}\` pour plus d'informations)`)

                    const params = subcommand.usage.split(" ")
                    params.shift()
                    const arguments = new Discord.Collection()
                    
                    args.shift()
                    params.forEach((p, i) => {
                        if (p.startsWith("<") && p.endsWith(">"))
                            params[i] = p.slice(1, -1)
                        
                        var [param, defaultValue] = params[i].split("=")
                        var optional = param.endsWith("?")
                        if (optional)
                            param = param.slice(0, -1)

                        if (args[i] !== undefined && !optional) {
                            switch (param) {
                                case "count":
                                        const count = parseInt(args[i])
                                        if (isNaN(count)) { // Vérifie si le joueur a saisi un nombre
                                            if (defaultValue !== undefined) // Vérifie si il y a une valeur par défaut associé à ce paramètre
                                                arguments.set("count", parseInt(defaultValue))
                                            else
                                                throw new TypeArgumentError(`Vous devez saisir un nombre positif\n(Utilisation de la commande : \`${config.prefix}${command.name} ${subcommand.usage}\`)`)
                                        } else if (count < -1) // Vérifie si le joueur a saisit un nombre positif
                                            throw new RangeArgumentError(`Vous devez saisir un nombre positif\n(Utilisation de la commande : \`${config.prefix}${command.name} ${subcommand.usage}\`)`)
                                        else 
                                            arguments.set("count", count)
                                    break
                                case "itemname":
                                    const itemname = args[i]
                                    if (itemname === undefined) { // Vérifie si le joueur a saisi un nom d'item
                                        if (defaultValue === undefined) { // Vérifie si il y a une valeur de par défaut associé à ce paramètre
                                            arguments.set("itemname", defaultValue)
                                        } else
                                            throw new TypeArgumentError(`Vous devez saisir un nom d'item\n(Utilisation de la commande : \`${config.prefix}${command.name} ${subcommand.usage}\`)`)
                                    } else
                                        arguments.set("itemname", itemname)
                                    break
                                case "@mention":
                                    const mentions = args.slice(i)
                                    const members = new Set()
                                    mentions.forEach(mention => { // Parcours toutes les mentions
                                        Util.getMembersFromMention(mention, msg).forEach(member => members.add(member))
                                    })
                                    if (members.size === 0) // Vérifie si il y a au moins un joueur mentionné
                                        throw new TypeArgumentError(`Vous devez mentionner un joueur ou un rôle (avec au moins un membre)\n(Utilisation de la commande : \`${config.prefix}${command.name} ${subcommand.usage}\`)`)
                                    arguments.set("members", members)
                                    break
                            }
                        }
                    })
                    if (subcommand.execute)
                        subcommand.execute(client, msg, arguments)
                }
            } else {
                if (args[0] === undefined)
                    throw new CommandError(`Cette commande ne peut pas être exécutée sans sous-commande\nTapez \`${config.prefix}help ${commandName}\` pour en savoir plus`)
            }
            const subcommandsFiles = fs.readdirSync(`./commands/${commandName}/subcommands`).filter((file) => file.endsWith(".js"))
            if (!client.subcommands.has(commandName))
                client.subcommands.set(commandName, [])
            for (const subcommandName of subcommandsFiles) {
                const subcommand = require(`./commands/${commandName}/subcommands/${subcommandName}`)
                client.subcommands.get(commandName).push(subcommand)
            }
        }
        client.commands.set(command.name, command)
    }
})

client.on("guildMemberAdd", member => {
    if (!member.user.bot) {
        // Ajout d'un nouveau joueur 
        const db = new Database("main.db", err => {
            if (err)
                throw err
            // Vérifie si le joueur appartient déjà à la table "Players"
            db.get(`SELECT rowid FROM Players WHERE userId = ? AND guildId = ?`, [member.id, member.guild.id], (err, row) => {
                if (err)
                    throw err

                if (!row) { // Insert le joueur dans la table
                    db.run(`INSERT INTO Players (userId, guildId, createdAt) VALUES (?, ?, DATETIME("now"))`, [member.id, member.guild.id], err => {
                        if (err)
                            throw err
                        
                        Util.Log.append("logs.md", `Player \`${member.id}\` from the guild \`${member.guild.id}\`, has been registered in the table 'Players'`)
                    })
                }
            })
        })
    }
})

client.on("message", msg => {
    if (msg.author.id === client.user.id) return

    msg.content.split("\n").forEach((line) => { // Prend en compte chaque ligne comme une éventuelle commande
        if (!line.trim().startsWith(config.prefix)) return

        const args = line.slice(config.prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()
    
        const command = client.commands.get(commandName)
                     || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

        if (!command) return

        try {
            if (command.channelType && !command.channelType.some(value => value === msg.channel.type)) // Vérifie si la commande permet d'être utilisée dans ce salon
                throw new PermissionCommandError(`Vous ne pouvez pas exécuter cette commande dans ce salon`)
            
            if (msg.channel.type !== "dm") { // Vérifie si le message est envoyé dans le salon d'un serveur
                if (command.permission === "admin" && !msg.member.hasPermission("ADMINISTRATOR")) // Vérifie si la commande permet d'être seulement utilisée par les admin et si l'utilisateur est un admin
                    throw new PermissionCommandError(`Vous devez avoir les droits administrateurs pour exécuter cette commande`)
            }

            if (command.execute)
                command.execute(client, msg, args)
        } catch (err) {
            Util.report(msg, err)
        }
    })
})

client.login(process.env.TOKEN)