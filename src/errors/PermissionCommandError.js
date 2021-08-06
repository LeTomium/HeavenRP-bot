const CommandError = require("./CommandError")

class PermissionCommandError extends CommandError {
    constructor(...params) {
        super(...params)

        this.name = "PermissionCommandError"
        this.description = "Erreur de permission de commande"
    }
}

module.exports = PermissionCommandError
