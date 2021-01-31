const fs = require("fs");

module.exports = {
	name: "dev",
	description: "Developer tools",
	args: true,
	arguments: ["maps"],
	usage: "[maps]",
	users: ["Gabbeh#0547"],

	execute(message, args) {
		// Get maps info from steam workshop
		if (args[0] === "maps") {
			const axios = require("axios");
			const cheerio = require("cheerio");

			const getMapImages = async () => {
				const maps = [];
				emptyPage = false;
				i = 46;
				while (!emptyPage) {
					console.log(`Getting page ${i}`);
					try {
						const { data } = await axios.get(
							`https://steamcommunity.com/profiles/76561198082857351/myworkshopfiles/?appid=730&p=${i}`
							// `https://steamcommunity.com/profiles/76561198082857351/myworkshopfiles/?appid=730&p=53`
						);

						i++;

						const $ = cheerio.load(data);

						// console.log(`item: ${$('div.workshopItem')}`);
						// console.log(`items length: ${$('div.workshopItem').length}`);

						if ($("div.workshopItem").length == 0) {
							console.log("No more items on this page");
							emptyPage = true;
							break;
						}

						$("div.workshopItem").each((_idx, el) => {
							const title = $(el).find(".workshopItemTitle").text();
							if (!title.includes("Compatibility Version")) {
								// console.log(`map title: ${title} - not comp, pushing`);
								const img = $(el)
									.find("img.workshopItemPreviewImage")
									.attr("src");
								maps.push({ title: title, img: img });
							}
						});
					} catch (error) {
						throw error;
					}

					console.log(`maps.length: ${maps.length}`);
				}

				return maps;
			};

			getMapImages().then((maps) => {
				console.log(`maps: ${maps}`);

				// Save
				console.log("saving to file");
				const saveJson = JSON.stringify(maps, null, 4);
				console.log(saveJson);

				fs.writeFile("./commands/maps_auto.json", saveJson, (err) => {
					if (err) {
						console.log(err);
						return message.reply(`Could not save maps. ${error}`);
					} else {
						message.reply(`Found ${maps.length} maps and saved them to file.`);
					}
				});
			});
		}

		if (args[0] === "guildmembers") {
			const guild = message.guild;
			const memberManager = guild.members;
			const members = memberManager.cache;
			console.log(members);
			members
				.filter((user) => !user.user.bot)
				.each((user) => console.log(user.user.username));

			// memberManager
			// 	.fetch()
			// 	.then(function (members) {
			// 		for (const member of members) {
			// 			// console.log(member.guild.presences);
			// 			console.log(member.guild.voiceStates);
			// 			console.log(member.guild.available);
			// 			console.log(member.joinedTimestamp);
			// 			console.log(member.nickname);
			// 			console.log(member.user);
			// 		}
			// 	})
			// 	.catch(console.log());
		}
	},
};
