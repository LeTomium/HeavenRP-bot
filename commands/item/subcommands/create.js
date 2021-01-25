const config = require("../../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()

module.exports = {
    name: name,
    command: dirname,
    aliases: ["add"],
    permission: "admin",
    usage: `create [itemname]`,
    description: `Crée un item.`,
    execute: (client, msg, args) => {
        const subcommandName = args[0],
              itemname = args[1]

        if (itemname === undefined)
            throw `Error: Vous devez saisir un nom d'item.`

        const db = client.databases.get(msg.guild.id)
        let error = `Success: Item créé avec succès.`
        db.count("items", record => record.name === itemname, (err, count) => {
            if (err)
                throw err
            if (count > 0)
                error = `Error: Nom d'item déjà utilisé.`
            
            db.insert("items", {
                name: itemname,
                price: -1
            }, err => {
                if (err)
                    throw err
            })
        })
        throw error
    }
}
