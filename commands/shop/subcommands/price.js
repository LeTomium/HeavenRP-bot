const config = require("../../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()
      
module.exports = {
    name: name,
    command: dirname,
    permission: "admin",
    usage: `price [itemname] [count]`,
    description: `Change le prix de l'item.`,
    execute: (client, msg, args) => {
        const subcommandName = args[0],
              itemname = args[1]
        var price = parseInt(args[2])

        if (itemname === undefined)
            throw `Error: Vous devez saisir un nom d'item.`
        if (isNaN(price))
            throw `Error: Vous devez saisir un prix (nombre).`
        if (price < 0)
            price = -1

        const db = client.databases.get(msg.guild.id)

        db.count("items", record => record.name === itemname, (err, count) => {
            if (err)
                throw err
            if (count < 1)
                throw `Error: Aucun item ne répond à ce nom.`
        })
        db.update("items", { price: price }, record => record["name"] === itemname, err => {
            if (err)
                throw err
            throw `Success: Le prix de l'item à bien été changé.`
        })
    }
}
