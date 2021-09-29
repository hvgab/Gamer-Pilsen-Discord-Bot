module.exports = {
	name: "how-to",
	description: "GP relevant links.",
	arguments: arguments,
	aliases: ["howto", "hvordan", "tutorial"],
	usage: "[gptag]",
	execute(message, args) {
		if (!args.length) {
			return message.reply("How to <what>?");
		}
		// gptag
		if (args[0].toUpperCase() == "GPTAG") {
			message.reply(
				"1. Bli med i steamgruppa\n2. Velg tag i innstillinger inne på csgo."
			);
		}
	},
};
