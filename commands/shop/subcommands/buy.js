const config = require("../../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()

module.exports = {
    name: name,
    command: dirname,
    permission: "everyone",
    usage: `buy [itemname] [count=1]`,
    description: `Achète *n* item(s).`,
    execute: (client, msg, args) => {
        const subcommandName = args[0],
              itemname = args[1]
        var count = parseInt(args[2]) || 1

        if (itemname === undefined)
            throw `Error: Vous devez saisir un nom d'item.`

        if (count < 1)
            throw `Error: Vous devez saisir un nombre positif non nul.`
            
        const db = client.databases.get(msg.guild.id)
        var item
        db.select("items", record => record["name"] === itemname, (err, data) => {
            if (err)
                throw err
            if (data.length === 0)
                throw `Error: Aucun item ne répond à ce nom.`
            else
                item = data[0]
        })

        db.each("players", record => record["userid"] === msg.author.id, (err, player) => {
            if (err) 
                throw err
            if (item.price > 0) {
                if (player.money >= item.price * count) {
                    let data = player.items
                    if (player.items.some((item) => item.name === itemname)) {
                        data.find((item) => item.name === itemname).count += count
                    } else {
                        data.push({ name: itemname, count: count })
                    }
                    db.update("players", { money: player.money - item.price * count, items: data }, record => record["userid"] === player.userid, err => {
                        if (err)
                            throw err
                        throw `Success: Item acheté avec succès.`
                    })
                } else
                    throw `Error: Vous ne possédez pas assez d'argent pour acheter cet item.`
            } else
                throw `Error: Cet item n'est pas en vente.`
        })
    }
}
