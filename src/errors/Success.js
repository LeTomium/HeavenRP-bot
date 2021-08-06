class Success extends Error { // philosophical statement
    constructor(...params) {
        super(...params)

        this.name = "Success"
        this.emote = ":white_check_mark:"
        this.description = "Succès"
    }
}

module.exports = Success
