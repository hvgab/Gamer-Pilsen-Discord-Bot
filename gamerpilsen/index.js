"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Library Imports
const fs_1 = __importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const discord_js_2 = __importDefault(require("discord.js"));
// My Imports
const config_json_1 = __importDefault(require("./config.json"));
const secrets_json_1 = __importDefault(require("./secrets.json"));
const config_json_2 = require("./config.json");
// Setup
// Create client instance
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
client.commands = new discord_js_2.default.Collection();
const commandFiles = fs_1.default
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js") && !file.startsWith("_"));
for (const file of commandFiles) {
    import command from `./commands/${file}`;
    client.commands.set(module_1.default.name, module_1.default);
}
client.auto_commands = new discord_js_2.default.Collection();
const autoCommandFiles = fs_1.default
    .readdirSync("./auto_commands")
    .filter((file) => file.endsWith(".js"));
for (const auto_command_file of autoCommandFiles) {
    import command from `./auto_commands/${auto_command_file}`;
    client.auto_commands.set(module_1.default.name, module_1.default);
}
// When client is ready, run this once.
client.once("ready", () => {
    console.log(`\n\n\nBot ${client.user.tag} reporting for duty!\n\n\n`);
    console.log(`\n\n\nBot ${client.user.tag} reporting for duty!\n\n\n`);
});
// New interaction event
client.on("interactionCreate", (interaction) => {
    console.log("interaction start");
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
    console.log(interaction);
    console.log("interaction end");
});
// Message command handler
client.on("message", (message) => {
    // Don't parse bot messages
    if (message.author.bot)
        return;
    console.log("\n");
    console.log("#####");
    console.log(`New Message: ${message.content}`);
    console.log("message author: " + message.author);
    let is_command = false;
    let is_auto_command = false;
    let chosen_command;
    let args;
    // Check if command
    // Commands must start with prefix, and not be sent by bot.
    if (message.content.startsWith(config_json_2.prefix)) {
        is_command = true;
    }
    // Check if auto-command
    client.auto_commands.some((command) => {
        console.log(`command: ${command.name}`);
        let regex = new RegExp(command.regex);
        console.log(`regex: ${regex}`);
        console.log(`re test: ${regex.test(message.content)}`);
        if (regex.test(message.content)) {
            chosen_command = command;
            is_auto_command = true;
        }
    });
    console.log(`is_command: ${is_command}`);
    console.log(`is_auto_command: ${is_auto_command}`);
    if (is_command == false && is_auto_command == false) {
        console.log("Not command, not auto-command. Doing nothing");
        return;
    }
    // get commmandName and args from message
    // TODO: Dont split args like -> "this has double quotes around it"
    if (is_command == true) {
        console.log("is command.");
        let commandName;
        if (message.content.startsWith(config_json_2.prefix)) {
            args = message.content.slice(config_json_2.prefix.length).trim().split(/ +/);
            commandName = args.shift().toLowerCase();
            console.log(`commandName: ${commandName}`);
            console.log(`args: ${args}`);
        }
        // Find command
        console.log(`client.commands: ${client.commands}`);
        chosen_command =
            client.commands.get(commandName) ||
                client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
        if (!chosen_command)
            return message.reply("That doesn't look like one of my commands.");
        if (chosen_command.args && !args.length) {
            let reply = `This command requires arguments. See \`${config_json_2.prefix}help ${commandName}\` for more info.`;
            return message.reply(reply);
        }
        console.log(`chosen_command: ${chosen_command}`);
    }
    // Auto Commands
    if (is_auto_command === true) {
        client.auto_commands.forEach((command) => {
            console.log(command);
            let re = command.regex;
            if (re.test(message.content)) {
                chosen_command = command;
            }
        });
    }
    console.log("Executing command");
    console.log(`command: ${chosen_command.name}`);
    try {
        chosen_command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        utils.sendErrorToDev(message, error, client);
    }
});
// Login client
if (process.argv.length > 2) {
    if (process.argv[2].toLowerCase() == "dev") {
        client.login(secrets_json_1.default.token_dev);
    }
}
else if (config_json_1.default.env == "dev") {
    client.login(secrets_json_1.default.token_dev);
}
else {
    client.login(secrets_json_1.default.token);
}
