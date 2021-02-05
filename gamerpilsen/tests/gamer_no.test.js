const GamerNo = require("../libs/gamer_no.js");
const fs = require("fs");

test("Gamer.no User Twitch", () => {
	let html;
	fs.readFileSync("gamerNoGabbeh.html", (html) => {
		tag = GamerNo.getTwitchTag(html);
		expect(tag).toBe("GabbehGG");
	});
});

test("Gamer.no User Discord", () => {
	let html;
	fs.readFileSync("gamerNoGabbeh.html", (html) => {
		tag = GamerNo.getDiscordTag(html);
		expect(tag).toBe("GabbehGG");
	});
});
