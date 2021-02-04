const Axios = require("axios");
const Discord = require("discord.js");
const this_config = require("./links.json");
const Path = require("path");
const Fs = require("fs");
const Imgbb = require("../libs/Imgbb.js");

module.exports = {
	name: "wasted",
	// description: "",
	args: true,
	// aliases: [""],
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

			imageResponse = {
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

			const imageUrl = `https://some-random-api.ml/canvas/wasted?avatar=${displayAvatarURL}`;
			const imageFilename = `${user.username}-${user.discriminator}-Wasted.gif`;
			const image = await downloadImage(mageUrl, imageFilename);
			console.log(image);

			// upload to imgbb?

			// Attach gif directly
			console.log("attaching gif directly");
			attachment = new Discord.MessageAttachment(image.path, image.filename);
			const sentMessage = await message.reply(attachment);

			console.log("sentMessage", sentMessage);
		}
	},
};
