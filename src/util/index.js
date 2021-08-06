const Util = {
    getMembersFromMention: (mention, msg) => {
        if (!mention) return []

        let members = []

        if (mention.startsWith("<@") && mention.endsWith(">")) {
            mention = mention.slice(2, -1)

            if (mention.startsWith("!") || mention.startsWith("&"))
                mention = mention.slice(1)

            if (msg.guild.members.cache.has(mention)) {
                members.push(msg.guild.members.cache.get(mention))
            } else if (msg.guild.roles.cache.has(mention)) {
                members = msg.guild.roles.cache.get(mention).members.array()
            }
        } else if (mention === "@everyone") {
            members = members.concat(msg.guild.members.cache.array().filter((member => !member.user.bot)))
        }
        return members.filter(member => !member.user.bot)
    },
    report: (msg, data) => {
        if (data instanceof Error)
            return msg.channel.send(`${data.emote || ":x:"} **${data.description || "Erreur interne"} :** ${data.message}`)
        return msg.channel.send(data)
    },
    Log: require("./Log")
}

module.exports = Util