const ArgumentError = require("./ArgumentError")

class TypeArgumentError extends ArgumentError {
    constructor(...params) {
        super(...params)

        this.name = "TypeArgumentError"
        this.description = "Erreur de type d'argument"
    }
}

module.exports = TypeArgumentError
