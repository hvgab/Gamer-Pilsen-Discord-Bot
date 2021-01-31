module.exports = {
	name: "dev",
	description: "Developer tools",
	args: true,
	arguments: ["maps"],
	usage: "[maps]",
	users: ["Gabbeh#0547"],

	execute(message, args) {
		guild = message.guild;
		memberManager = guild.members;
		members = memberManager.fetch().then(console.log()).catch(console.log);
	},
};
