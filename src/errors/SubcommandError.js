const CommandError = require("./CommandError")

class SubcommandError extends CommandError {
    constructor(...params) {
        super(...params)

        this.name = "SubcommandError"
        this.description = "Erreur de sous-commande"
    }
}

module.exports = SubcommandError
