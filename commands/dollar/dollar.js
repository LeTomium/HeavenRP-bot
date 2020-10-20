const config = require("../../config/default.json")
const path = require("path")
const name = path.basename(__filename).slice(0, path.basename(__filename).lastIndexOf(".")),
      dirname = path.dirname(name).split(path.sep).pop()

module.exports = {
    name: name,
    permission: "admin",
    usage: ``,
    description: `Gère les dollars dans le RP.`,
}