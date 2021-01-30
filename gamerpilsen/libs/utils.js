// Imports
const Discord = require("discord.js");

// Constant utils
function getDeveloper(client) {
	const developer = new Discord.User(client, {
		id: "152026317016137728",
		username: "Gabbeh",
		discriminator: "0547",
	});
	developer.fetch();
	return developer;
}

function sendErrorToDev(message, error, client) {
	const developer = getDeveloper(client);

	error_msg = [];
	error_msg.push(`Hey ${developer}!`);
	error_msg.push(
		`This bot has trouble: ${client.user.username} (${client.user.id})`
	);
	if (message.guild) error_msg.push(`Guild: ${message.guild.name}`);
	error_msg.push(`User: ${message.author.username}`);
	error_msg.push(`Channel: ${message.channel}`);
	error_msg.push(`Message: ${message}`);
	error_msg.push(`Error: ${error}`);

	developer.send(error_msg);
}

exports.getDeveloper = getDeveloper;
exports.sendErrorToDev = sendErrorToDev;
