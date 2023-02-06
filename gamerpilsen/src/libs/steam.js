const axios = require("axios");
const cheerio = require("cheerio");

async function getImageFromWorkshopMap(workshopId) {
	const workshopUrl = "https://steamcommunity.com/sharedfiles/filedetails/";
	const params = { id: workshopId };

	const response = await axios.get(url);
}
