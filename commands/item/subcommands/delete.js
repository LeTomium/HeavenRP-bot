const config = require("../../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()

module.exports = {
    name: name,
    command: dirname,
    permission: "admin",
    usage: `delete [itemname]`,
    description: `Supprime un item.`,
    execute: (client, msg, args) => {
        const subcommandName = args[0],
              itemname = args[1]

        if (itemname === undefined)
            throw `Error: Vous devez saisir un nom d'item.`

        const db = client.databases.get(msg.guild.id)

        db.count("items", record => record.name === itemname, (err, count) => {
            if (err)
                throw err
            if (count < 1)
                throw `Error: Aucun item ne répond à ce nom.`
        })
            
        db.each("players", record => true, (err, player) => {
            if (err)
                throw err
            let items = player["items"]
            if (items.some((item) => item.name === itemname)) {
                items.splice(items.findIndex((item) => item.name === itemname), 1)
            }
            db.update("players", { items: items }, record => record["userid"] == player["userid"], err => {
                if (err)
                    throw err
            })
        })

        db.delete("items", record => record["name"] === itemname, err => {
            if (err)
                throw err
            throw `Success: Item supprimé avec succès.`
        })
    }
}
