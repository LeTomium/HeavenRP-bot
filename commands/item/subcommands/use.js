const config = require("../../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()

module.exports = {
    name: name,
    command: dirname,
    permission: "everyone",
    usage: `use [itemname] [count=1]`,
    description: `Utilise *n* item(s).`,
    execute: (client, msg, args) => {
        const subcommandName = args[0],
              itemname = args[1]
        var count = parseInt(args[2]) || 1

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
                
            db.each("players", record => record["userid"] === msg.author.id, (err, player) => {
                if (err)
                    throw err
                let data = player.items
                if (data.some((item) => item.name === itemname)) {
                    let totalCount = data.find((item) => item.name === itemname).count
                    console.log(totalCount - count, totalCount, count)
                    if (totalCount - count >= 0)
                        totalCount -= count
                    else
                        throw `Error: Vous ne possédez pas assez de ${itemname}.`

                    if (totalCount === 0)
                        data.splice(data.findIndex((item) => item.name === itemname), 1)
                    else
                        data.find((item) => item.name === itemname).count = totalCount  
                }
                db.update("players", { items: data }, record => record["userid"] === player["userid"], err => {
                    if (err)
                        throw err
                    throw `Success: Item utilisé avec succès.`
                })
            })
        })

    }
}
