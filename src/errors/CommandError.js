class CommandError extends Error {
    constructor(...params) {
        super(...params)

        this.name = "CommandError"
        this.emote = ":warning:"
        this.description = "Erreur de commande"
    }
}

module.exports = CommandError
