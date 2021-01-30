module.exports = {
	name: "ping",
	description: "Ping!",
	hidden: true,
	execute(message, args) {
		message.reply("Reply Pong");
		message.author.send("Author Pong");
		message.channel.send("Channel Pong");
	},
};
