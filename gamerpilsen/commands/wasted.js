const Axios = require("axios");
const Discord = require("discord.js");
const this_config = require("./links.json");
const Path = require("path");
const Fs = require("fs");
const Imgbb = require("../libs/Imgbb.js");
const { SSL_OP_EPHEMERAL_RSA } = require("constants");

async function downloadImage(url, filename, folderPath) {
	// const path = Path.resolve("..", "resources", "images", filename);
	const imgPath = Path.resolve(folderPath, filename);
	const writer = Fs.createWriteStream(imgPath);

	const response = await Axios({
		url,
		method: "GET",
		responseType: "stream",
	});

	response.data.pipe(writer);

	let imageResponse = {
		filename: filename,
		path: imgPath,
	};

	console.log("DownloadImage return: ", imageResponse);

	return imageResponse;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
	name: "wasted",
	// description: "",
	args: true,
	aliases: ["waste"],
	usage: "<@user>",
	async execute(message, args) {
		if (!args.length) return message.reply("You need to tag a user!");
		// consts
		const triggerImageFolder = Path.resolve(
			"..",
			"resources",
			"images",
			"avatars"
		);

		// get avatar
		const user = message.mentions.users.first();
		const displayAvatarURL = user.displayAvatarURL({
			format: "png",
			size: 128,
		});
		console.log("displayAvatarURL", displayAvatarURL);

		// get api image
		const triggerImageUrl = `https://some-random-api.ml/canvas/wasted?avatar=${displayAvatarURL}`;
		const triggerImageFilename = `${user.username}-${user.discriminator}-Triggered.gif`;

		// save image
		const triggerImage = await downloadImage(
			triggerImageUrl,
			triggerImageFilename,
			triggerImageFolder
		);
		console.log("Saved triggerImage: ", triggerImage);

		// Something is iffy with uploading right after save, added a sleep to bypass this.
		console.log("Sleeping for 1 sec before upload.");
		await sleep(1000);

		// upload to imgbb
		const imgbbData = await Imgbb.upload(
			Path.resolve(triggerImageFolder, triggerImageFilename),
			triggerImageFilename
		);
		console.log("Imgbb id: ", imgbbData.data.id);

		// Respond
		console.log("attaching gif with imgbb");
		console.log("imgbbData: ", imgbbData.success, imgbbData.status);
		const msg = [];
		msg.push(`**${imgbbData.data.title}**`);
		msg.push(imgbbData.data.image.url);
		const sentMessage = await message.reply(msg);
		console.log("sentMessage", sentMessage.content);
		return;
	},
};
