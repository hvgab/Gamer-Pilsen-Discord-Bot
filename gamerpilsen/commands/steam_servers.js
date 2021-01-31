const Discord = require("discord.js");
const Gamedig = require("gamedig");
const steam_servers_config = require("./steam_servers.json");
const mapsconfig = require("./maps.json");
const config = require("../config.json");
const utils = require("../libs/utils.js");

module.exports = {
	name: "server",
	aliases: ["server", "servers", "boot", "bootn", "booten"],
	description: "Information about the server provided.",
	args: true,
	arguments: [1, 2, 3],
	usage: "<1/2/3>",
	execute(message, args) {
		if (!args[0] in mapsconfig) return;

		let host = steam_servers_config[args[0]]["ip"];
		let port = steam_servers_config[args[0]]["port"];

		async function gamedig(host, port) {
			console.log(`start gamedig with ${host}:${port}`);
			server = await Gamedig.query({
				type: "csgo",
				host: host,
				port: port,
				debug: config["env"] == "dev" ? true : false,
			});
			console.log(`end gamedig with ${host}:${port}`);
			return server;
			// .then((server) => {
			// 	return server;
			// })
			// .catch((error) => {
			// 	console.error(error);
			// });
		}

		function makeServerEmbed(server) {
			console.log("makeServerEmbed");
			console.log("Server:", server);

			if (new Date().getDay() == 5) {
				title = ":beers: FREDAGSBOOTEN :beers:";
			} else {
				title = server["name"];
			}

			const embed = new Discord.MessageEmbed()
				.setColor(config.colors.gp_orange)
				.setTitle(title)
				.addField("Map", server["map"], true)
				.addField(
					"Players",
					`${server["players"].length} / ${server["maxplayers"]}`,
					true
				)
				.addField("Connect", `steam://connect/${server["connect"]}`)
				.setFooter("Last update")
				.setTimestamp();

			console.log("Embed:", embed);

			// Set image and thumbnail/icon
			mapconfig = mapsconfig.find((mapconfig) => mapconfig.name == server.map);
			embed.setThumbnail(mapconfig.icon);
			embed.setImage(mapconfig.img);
			return embed;
		}

		async function serverStatus() {
			console.log("serverstatus");
			let server = await gamedig(host, port);
			console.log(`server ${server.name}`);
			let embed = makeServerEmbed(server);
			let msg = await message.channel.send({ embed: embed });
			const waitTime = 5 * 60 * 1000;
			let updatesLeft = 12;

			if (new Date().getDay() == 5) {
				msg.react(":beer:");
				msg.react(":wine:");
				msg.react(":whisky:");
				msg.react(":beverage_box:");
				msg.react(":cup_with_straw:");
			}

			async function updateServerStatus(message) {
				let server = await gamedig(host, port);
				let embed = makeServerEmbed(server);
				await message.edit({ embed: embed });
				updatesLeft -= 1;
				if (updatesLeft < 1) stopInterval();
			}

			let interval = setInterval(() => {
				updateServerStatus(msg);
			}, waitTime);

			function stopInterval() {
				clearInterval(interval);
			}

			// setTimeout(() => {
			// 	console.log("first timeout");
			// 	while (updatesLeft > 0) {
			// 		console.log("inside while");
			// 		setTimeout(() => {
			// 			console.log(`${updatesLeft} updates left`);
			// 			console.log(`waiting ${waitTime}`);
			// 			let server = gamedig(host, port)
			// 				.then(() => {
			// 					let embed = makeServerEmbed(server);
			// 					msg.edit({ embed: embed });
			// 				})
			// 				.catch(console.log)
			// 				.then((updatesLeft -= 1));
			// 		}, waitTime);
			// 	}
			// }, waitTime);
		}
		console.log("starting with serverStatus");
		serverStatus();
	},
};
