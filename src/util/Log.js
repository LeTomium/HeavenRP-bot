const fs = require("fs")

class Log {
    /**
     * Clear the log file
     * @param {string} filename File name
     */
    static clear(filename) {
        fs.writeFileSync(filename, "")
    }
    static createFile(filename) {
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, [
                `| Date | Time | Author | Message |`,
                `| :-: | :-: | :-: | --- |\n`
            ].join("\n"))
        }
    }
    /**
     * Append log into the log file
     * @param {string} filename File name
     * @param {string} message Message's log
     * @return {string} Log
     */
    static append(filename, message, author) {
        Log.createFile(filename)
        const dateTime = Log.getDateTime()
        const string = `| ${dateTime[0]} | ${dateTime[1]} | ${author || "Bot"} | ${message} |\n`
        fs.appendFileSync(filename, string)
        console.log(`${dateTime[0]} ${dateTime[1]} - ${author ? author + ": " : ""}${message}`)
        return string
    }
    /**
     * Erase and write log into the log file
     * @param {string} filename File name
     * @param {string} message Message's log
     * @return {string} Log
     */
    static write(filename, message, author) {
        Log.clear()
        return Log.append(filename, message, author)
    }

    /**
     * Returns the actual datetime
     * @returns {string[]} Datetime string
     */
    static getDateTime() {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const date = new Date()
        return [
            `${date.getFullYear()} ${monthNames[date.getMonth()]} ${("0" + date.getDate()).slice(-2)}`,
            `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`
        ]
    }
}
module.exports = Log