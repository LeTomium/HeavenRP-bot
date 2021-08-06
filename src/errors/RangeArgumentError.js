const ArgumentError = require("./ArgumentError")

class RangeArgumentError extends ArgumentError {
    constructor(...params) {
        super(...params)

        this.name = "RangeArgumentError"
        this.description = "Erreur de plage d'argument"
    }
}

module.exports = RangeArgumentError
