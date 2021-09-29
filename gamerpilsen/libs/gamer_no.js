"use strict";
// Scrape teams siden til gamer.no
// For hver user på team:
// hvis user har discord tag
// hvis discordUser i guild
// set guildrolle til gamer.no lag
const { default: axios } = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
module.exports = {
    GamerNo: class GamerNo {
        urlToHtml() {
            url = "https://www.gamer.no/klubber/gamer-pilsen/158063/lag/158064";
            axios
                .get(url)
                .then((response) => {
                return response.data;
            })
                .catch((error) => {
                console.log("error", error);
            });
        }
        getClubMembers() { }
        getTeamMembers() {
            let players = [];
            const html = fs.readFileSync("./gamerNoGabbeh.html", "utf-8");
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
            // })
            // .catch((error) => {
            // 	console.log(error);
            // });
        }
        getUser() {
            console.log("getUser()");
            // const url = "https://www.gamer.no/brukere/gabbeh/105547";
            // axios
            // 	.get(url)
            // 	.then((response) => {
            // 		const html = response.data;
            const html = fs.readFile("gamerNoGabbeh.html", (response) => {
                const userHeaderImg = getUserHeaderImg(html);
                const discordTag = getDiscordTag(html);
                const twitchTag = getTwitchTag(html);
                const epicTag = getEpicTag(html);
            });
            // })
            // .catch((error) => {
            // 	console.log("error", error);
            // });
        }
        /* Utils */
        /* getUser utils */
        // Get User Header Img
        getUserHeaderImg(html) {
            $ = cheerio.load(html);
            const userHeaderImgText = $(".user-header-image").attr("style");
            console.log("userHeaderImgText", userHeaderImgText);
            // style="background-image: url(//img.gfx.no/2649/2649869/cover.1000x412.png);background-position-y: 412px;"
            const imgReg = new RegExp("background-image: url\\(//(img.gfx.no/.*\\..*)\\)");
            const regArr = imgReg.exec(userHeaderImgText);
            console.log("regArr", regArr);
            const userHeaderImg = regArr[1].replace(/^/, "https://");
            console.log("userHeaderImg", userHeaderImg);
            return userHeaderImg;
        }
        // Get Discord Tag
        getDiscordTag(html) {
            const discordTag = $(".discord").find("span").text();
            console.log("discordTag", discordTag);
            return discordTag;
        }
        // Get Twitch Tag
        getTwitchTag(html) {
            const twitchRegEx = new RegExp('<a href="https://www.gamer.no/tv/.*">(.*)</a>');
            const twitch = twitchRegEx.exec(html)[1];
            console.log("twitch", twitch);
            return twitch;
        }
        // Get Epic Tag
        getEpicTag(html) {
            const thisRegEx = new RegExp('<img title="Epic Games" src="https://static.gfx.no/images/gamer/epic.png" /> <span>(.*)</span>');
            const epicTag = thisRegEx.exec(html)[1];
            console.log("epicTag", epicTag);
            return epicTag;
        }
    },
    // write html to file
    // fs.writeFile("gamerNoGabbeh.html", html, (error) => {
    // 	if (error) throw err;
    // });
};
