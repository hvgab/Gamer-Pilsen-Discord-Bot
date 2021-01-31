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
			console.log("mentions", message.mentions.users);
			console.log("mentions", message.mentions.users.first());
			console.log("mentions", message.mentions.users.first().defaultAvatarURL);

			const user = message.mentions.users.first();
			const displayAvatarURL = message.mentions.users
				.first()
				.displayAvatarURL({ format: "png", size: 128 });
			console.log("displayAvatarURL", displayAvatarURL);

			const triggerImageUrl = `https://some-random-api.ml/canvas/triggered?avatar=${displayAvatarURL}`;
			const triggerImage = await downloadImage(
				triggerImageUrl,
				`${user.username}-${user.discriminator}-Triggered.gif`
			);
			console.log(triggerImage);

			// upload to imgbb
			console.log("upload to imgbb");
			const imgbbResponse = Imgbb.upload();
			console.log("uploaded to imgbb");
			console.log(imgbbResponse);

			embed = new Discord.MessageEmbed()
				.attachFiles([triggerImage.path])
				.setTitle("**TRIGGERED**")
				.setThumbnail(displayAvatarURL)
				.setImage(`attachment://${triggerImage.filename}`);
			console.log("embed", embed);
			message.reply({ embed });

			// return message.client.commands.get("help").execute(message, [this.name]);
		}
	},
};
