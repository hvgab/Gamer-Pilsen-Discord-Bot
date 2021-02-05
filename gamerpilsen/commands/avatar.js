const Axios = require("axios");
const Discord = require("discord.js");
const this_config = require("./links.json");
const Path = require("path");
const Fs = require("fs");
const Imgbb = require("../libs/Imgbb.js");

module.exports = {
	name: "avatar",
	// description: "",
	args: true,
	// aliases: ["trigger"],
	usage: "<@user>",
	hidden: true,
	execute(message, args) {
		let user;
		if (!args.length) {
			user = message.author;
		}
		user = message.mentions.users.first();
		const displayAvatarURL = user.displayAvatarURL({
			format: "png",
			size: 128,
		});
		console.log(
			"displayAvatarURL",
			user.displayAvatarURL({
				format: "png",
				size: 512,
			})
		);
	},
};
