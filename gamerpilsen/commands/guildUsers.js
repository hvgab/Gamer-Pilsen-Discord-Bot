module.exports = {
	name: "dev",
	description: "Developer tools",
	args: true,
	arguments: ["maps"],
	usage: "[maps]",
	users: ["Gabbeh#0547"],

	execute(message, args) {
		let guild = message.guild;
		let memberManager = guild.members;
		let members = memberManager.fetch().then(console.log()).catch(console.log);
	},
};
