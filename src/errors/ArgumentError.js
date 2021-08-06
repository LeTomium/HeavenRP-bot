const CommandError = require("./CommandError")

class ArgumentError extends CommandError {
    constructor(...params) {
        super(...params)

        this.name = "ArgumentError"
        this.description = "Erreur d'argument"
    }
}

module.exports = ArgumentError
