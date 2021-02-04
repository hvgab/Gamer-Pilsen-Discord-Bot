// Scrape teams siden til gamer.no
// For hver user på team:
// hvis user har discord tag
// hvis discordUser i guild
// set guildrolle til gamer.no lag

const { default: axios } = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

function getClubMembers() {}

function getTeamMembers() {
	let players = [];

	url = "https://www.gamer.no/klubber/gamer-pilsen/158063/lag/158064";
	axios
		.get(url)
		.then((response) => {
			const html = response.data;
			// console.log(html);
			const $ = cheerio.load(html);
			// const playerDiv = $(".squadMembers");
			// console.log(playerDiv);
			// console.log(playerDiv.length);
			$(".squad-member").each(function (i, squadmember) {
				console.log("iteration ", i);
				// console.log($(squadmember));
				$(squadmember)
					.find(".user-name")
					.each(function (i, username) {
						console.log("username ", i);
						let userChildren = $(username).children("a");

						const gamerNoUrl = userChildren[0].attribs.href;
						const gamerNoUsername = userChildren[0].children[0].data;
						const steamUrl = userChildren[1].attribs.href;
						const steamId = userChildren[1].children[0].data;

						player = {
							gamerNoUsername: gamerNoUsername,
							gamerNoUrl: gamerNoUrl,
							steamId: steamId,
							steamUrl: steamUrl,
						};
						console.log(player);
						players.push(player);
					});
			});
			// console.log(playerDiv.children(".squad-member").contents());
		})
		.catch((error) => {
			console.log(error);
		});
}

function getUser() {
	const url = "https://www.gamer.no/brukere/gabbeh/105547";
	axios
		.get(url)
		.then((response) => {
			const html = response.data;
			const $ = cheerio.load(html);

			// write html to file
			// fs.writeFile("gamerNoGabbeh.html", html, (error) => {
			// 	if (error) throw err;
			// });

			// Get header img
			const userHeaderImg = $(".user-header-image")
				.attr("style")
				.slice(24, -31)
				.replace(/^/, "https://");

			// Get Discord
			const discordTag = $(".discord").find("span").text();
		})
		.catch((error) => {});
}

getUser();
