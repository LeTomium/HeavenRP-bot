const config = require("../../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()

module.exports = {
    name: name,
    command: dirname,
    permission: "admin",
    usage: `give [@username] [count=1]`,
    description: `Donne *n* :money_with_wings: à *@username*.`,
    execute: (client, msg, args) => {
        const members = client.getUsersFromMention(args[1], msg)
        var count = parseInt(args[2])

        if (members.length === 0)
            throw `Error: Vous devez mentionner un joueur/role (avec au moins un membre) puis un nom d'item.`

        if (isNaN(count) || count < 0)
            throw `Error: Vous devez saisir un nombre positif.`
            
        const db = client.databases.get(msg.guild.id)

        members.forEach((member) => {
            db.each("players", record => record["userid"] === member.id, (err, player) => {
                if (err)
                    throw err
                db.update("players", { money: player.money + count }, record => record["userid"] === player.userid, err => {
                    if (err)
                        throw err
                })
            })
        })
        throw `Success: :money_with_wings: placés avec succès.`
    }
}
