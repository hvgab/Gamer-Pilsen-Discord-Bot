// Imports
const axios = require("axios");

/* Division and Turnament is the same thing ? */

// Constants
const SEASONS_URL = "https://www.telialigaen.no/api/seasons";
const TABLES_URL = "https://www.telialigaen.no/api/tables"; //params: division=x&season=8595
const MATCHES_URL = "https://www.telialigaen.no/api/matches";

async function getSeasons() {
	const seasons = await axios.get(SEASONS_URL);
	return seasons.data;
}

async function getTables(divisionId, seasonId) {
	const tables = await axios.get(TABLES_URL, {
		params: { division: divisionId, season: seasonId },
	});
	return tables.data;
}

async function getMatches(divisionId, seasonId) {
	const matches = await axios.get(MATCHES_URL, {
		params: {
			division: divisionId,
			season: seasonId,
			status: "unfinished",
			game: "csgo",
			limit: 100,
			offset: 0,
			order: "roundNumber",
		},
	});
	return matches.data;
}

exports.getSeasons = getSeasons;
exports.getTables = getTables;
exports.getMatches = getMatches;
