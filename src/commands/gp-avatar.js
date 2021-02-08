const Axios = require("axios");
const Discord = require("discord.js");
const this_config = require("./links.json");
const Path = require("path");
const Fs = require("fs");
const Imgbb = require("../libs/Imgbb.js");
const Canvas = require("canvas");
const { downloadImage } = require("../libs/utils.js");

module.exports = {
	name: "gp-avatar",
	hidden: true,
	async execute(message, args) {
		/*
		 * Hent avatar
		 */
		let user;
		if (!args.length) {
			user = message.author;
		} else {
			user = message.mentions.users.first();
		}

		// const displayAvatarURL = user.displayAvatarURL({
		// 	format: "png",
		// 	size: 256,
		// });
		// const avatarId = user.avatar;

		// Save image
		// const avatarImage = await downloadImage(
		// 	displayAvatarURL,
		// 	`${user.username}-${user.discriminator}-avatar-${user.avatar}`,
		// 	Path.resolve("..", "resources", "images", "avatar")
		// );
		// console.log("Saved triggerImage: ", avatarImage);

		/*
		 * Legg på GP-logoen
		 */
		const canvas = Canvas.createCanvas(256, 256);
		const ctx = canvas.getContext("2d");

		// draw a circle
		// ctx.beginPath();
		// ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width, 0, 2 * Math.PI);
		// ctx.closePath();
		// ctx.clip();

		// Add avatar
		const avatar = await Canvas.loadImage(
			// Path.resolve(avatarImage.path, avatarImage.filename)
			user.displayAvatarURL({
				format: "png",
				size: 256,
			})
		);
		ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);

		// Add Shadow
		ctx.shadowColor = "#000";
		ctx.shadowBlur = 5;
		// Add GP-Logo
		const gplogo = await Canvas.loadImage(
			Path.resolve("..", "resources", "gp-shield-logo.png")
		);
		ctx.drawImage(gplogo, 160, 160, 64, 64);

		const attatchment = new Discord.MessageAttachment(
			canvas.toBuffer(),
			`${user.username}-${user.discriminator}-${gplogo}.png`
		);

		message.reply("Here's your gp avatar!", attatchment);
		// Last opp til Imgbb
		// Steps for å lagre avatar i steam/discord
	},
};
