module.exports = {
    Success: require("./Success"),
    // Command errors
    CommandError: require("./CommandError"),
    SyntaxCommandError: require("./SyntaxCommandError"),
    PermissionCommandError: require("./PermissionCommandError"),
    // Subcommand errors
    SubcommandError: require("./SubcommandError"),
    PermissionSubcommandError: require("./PermissionSubcommandError"),
    // Argument errors
    ArgumentError: require("./ArgumentError"),
    TypeArgumentError: require("./TypeArgumentError"),
    RangeArgumentError: require("./RangeArgumentError")
}
