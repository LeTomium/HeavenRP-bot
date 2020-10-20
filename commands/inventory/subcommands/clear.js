const config = require("../../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()

module.exports = {
    name: name,
    command: dirname,
    permission: "admin",
    usage: `clear [@username]`,
    description: `Retire tous les items de l'inventaire de *@username*.`,
    execute: (client, msg, args) => {
        const members = client.getUsersFromMention(args[1], msg)

        if (members.length === 0)
            throw `Error: Vous devez mentionner un joueur/role (avec au moins un membre) puis un nom d'item.`
            
        const db = client.databases.get(msg.guild.id)
        members.forEach((member) => {
            db.update("players", { items: [] }, record => record["userid"] === member.id, err => {
                if (err)
                    throw err
            })
        })
        throw `Success: Inventaire vidé avec succès.`
    }
}
