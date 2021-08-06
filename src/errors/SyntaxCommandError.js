const CommandError = require("./CommandError")

class SyntaxCommandError extends CommandError {
    constructor(...params) {
        super(...params)

        this.name = "SyntaxCommandError"
        this.description = "Erreur de syntax de commande"
    }
}

module.exports = SyntaxCommandError
