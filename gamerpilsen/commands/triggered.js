const Axios = require("axios");
const Discord = require("discord.js");
const this_config = require("./links.json");
const Path = require("path");
const Fs = require("fs");
const Imgbb = require("../libs/Imgbb.js");

module.exports = {
	name: "triggered",
	// description: "",
	args: true,
	aliases: ["trigger"],
	usage: "<@user>",
	hidden: true,
	async execute(message, args) {
		async function downloadImage(url, filename) {
			const path = Path.resolve("..", "resources", "images", filename);
			const writer = Fs.createWriteStream(path);

			const response = await Axios({
				url,
				method: "GET",
				responseType: "stream",
			});

			response.data.pipe(writer);

			let imageResponse = {
				filename: filename,
				path: path,
			};

			return imageResponse;
		}

		if (!args.length) {
			return message.reply("You need to tag a user!");
		} else {
			const user = message.mentions.users.first();
			const displayAvatarURL = user.displayAvatarURL({
				format: "png",
				size: 128,
			});
			console.log("displayAvatarURL", displayAvatarURL);

			const triggerImageUrl = `https://some-random-api.ml/canvas/triggered?avatar=${displayAvatarURL}`;
			const triggerImageFilename = `${user.username}-${user.discriminator}-Triggered.gif`;
			const triggerImage = await downloadImage(
				triggerImageUrl,
				triggerImageFilename
			);
			console.log(triggerImage);

			// upload to imgbb?

			// Attach gif directly
			console.log("attaching gif directly");
			let attachment = new Discord.MessageAttachment(
				triggerImage.path,
				triggerImage.filename
			);
			const sentMessage = await message.reply(attachment);

			console.log("sentMessage", sentMessage);
		}
	},
};
