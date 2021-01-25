const config = require("../../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()

module.exports = {
    name: name,
    command: dirname,
    permission: "everyone",
    usage: `sell [itemname] [count=1]`,
    description: `Vend *n* item(s).`,
    execute: (client, msg, args) => {
        const subcommandName = args[0],
              itemname = args[1]
        var count = parseInt(args[2]) || 1
        let error = false

        if (itemname === undefined)
            throw `Error: Vous devez saisir un nom d'item.`

        if (count < 1)
            throw `Error: Vous devez saisir un nombre positif non nul.`
            
        const db = client.databases.get(msg.guild.id)
        var item
        db.select("items", record => record["name"] === itemname, (err, data) => {
            if (err)
                throw err
            if (data.length === 0) {
                error = `Error: Aucun item ne répond à ce nom.`
                return
            }
            item = data[0]
        })

        db.each("players", record => record["userid"] === msg.author.id, (err, player) => {
            if (err) 
                throw err
            if (item.price > 0) {
                let data = player.items
                if (player.items.some((item) => item.name === itemname)) {
                    if (data.find((item) => item.name === itemname).count >= count) {
                        data.find((item) => item.name === itemname).count -= count
                    } else {
                        error = `Error: Vous ne possédez pas asser de ${itemname}.`
                        return
                    }
                } else {
                    error = `Error: Vous ne possédez pas de ${itemname}.`
                    return
                }
                db.update("players", {
                    money: player.money + item.price * count,
                    items: data
                }, record => record["userid"] === player.userid, err => {
                    if (err)
                        throw err
                })
            } else {
                error = `Error: Cet item n'est pas en vente.`
                return
            }
        })
        if (error)
            throw error
        throw `Success: ${count > 1 ? "Vos" : "Votre"} item${count > 1 ? "s ont" : " a"} bien été vendu${count > 1 ? "s" : ""}.`
    }
}
