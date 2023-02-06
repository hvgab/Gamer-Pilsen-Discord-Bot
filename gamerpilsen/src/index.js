// Library Imports
const fs = require("fs");
const Discord = require("discord.js");

// My Imports
const config = require("./config.json");
const secrets = require("./secrets.json");
const { prefix } = require("./config.json");
const utils = require("./libs/utils");

// Setup
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Bot
client.once("ready", () => {
	console.log(`\n\n\nLogged in as ${client.user.tag}!\n\n\n`);
});

// Message command handler
client.on("message", (message) => {
	// Commands must start with prefix, and not be sent by bot.
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// get commmandName and args from message
	// TODO: Dont split args like -> "this has double quotes around it"
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Find command
	const command =
		client.commands.get(commandName) ||
		client.commands.find(
			(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
		);

	if (!command)
		return message.reply("That doesn't look like one of my commands.");

	if (command.args && !args.length) {
		let reply = `This command requires arguments. See \`${prefix}help ${commandName}\` for more info.`;
		return message.reply(reply);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		utils.sendErrorToDev(message, error, client);
		// console.error(error);
		// error_msg = [];
		// error_msg.push(`This bot has trouble: ${client.user.username} (${client.user.id})`);
		// if (message.guild) error_msg.push(`Guild: ${message.guild.name}`);
		// error_msg.push(`User: ${message.author.username}`);
		// error_msg.push(`Channel: ${message.channel}`);
		// error_msg.push(`Message: ${message}`);
		// error_msg.push(`Error: ${error}`);
		// console.debug(error_msg);
		// utils.getDeveloper(client).send(error_msg);
	}
});

if (process.argv.length > 2) {
	if (process.argv[2].toLowerCase() == "dev") {
		client.login(secrets.token_dev);
	}
} else {
	client.login(secrets.token);
}
