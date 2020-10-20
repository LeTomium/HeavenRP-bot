const config = require("../../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()

module.exports = {
    name: name,
    command: dirname,
    aliases: ["remove"],
    permission: "admin",
    usage: `clear [@username] [itemname] [count=1]`,
    description: `Retire *n* item(s) à *@username*.`,
    execute: (client, msg, args) => {
        const subcommandName = args[0],
              members = client.getUsersFromMention(args[1],msg),
              itemname = args[2]
        var count = parseInt(args[3]) || 1

        if (members.length === 0)
            throw `Error: Vous devez mentionner un joueur/role (avec au moins un membre) puis un nom d'item.`

        if (itemname === undefined)
            throw `Error: Vous devez saisir un nom d'item.`

        if (count < 1)
            throw `Error: Vous devez saisir un nombre positif non nul.`
            
        const db = client.databases.get(msg.guild.id)

        db.count("items", record => record["name"] === itemname, (err, count) => {
            if (err)
                throw err
            if (count === 0)
                throw `Error: Aucun item ne répond à ce nom.`

            members.forEach((member) => {
                db.each("players", record => record["userid"] === member.id, (err, player) => {
                    if (err)
                        throw err
                    let data = player.items
                    if (player.items.some((item) => item.name === itemname)) {
                        let totalCount = data.find((item) => item.name === itemname).count
                        if (totalCount - count > 0) {
                            totalCount -= count
                            data.find((item) => item.name === itemname).count = totalCount  
                        } else {
                            totalCount = 0
                            data.splice(data.findIndex((item) => item.name === itemname), 1)
                        }
                    }
                    db.update("players", { items: data }, record => record["userid"] === player["userid"], err => {
                        if (err)
                            throw err
                    })
                })
            })
        })
        throw `Success: Items retirés avec succès.`
    }
}
