const CommandError = require("./CommandError")

class PermissionSubcommandError extends CommandError {
    constructor(...params) {
        super(...params)

        this.name = "PermissionSubcommandError"
        this.description = "Erreur de permission de sous-commande"
    }
}

module.exports = PermissionSubcommandError
