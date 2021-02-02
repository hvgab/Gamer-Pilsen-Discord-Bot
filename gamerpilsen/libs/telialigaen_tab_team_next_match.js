// Imports
const axios = require("axios");
const { DateTime } = require("luxon");
const { Message } = require("discord.js");
const { getSeasons, getTables, getMatches } = require("./telialigaenApi");
const { makeTable } = require("./utils.js");

async function getMatchesFor(team, firstMatchOnly = false) {
	const resultMatches = [];

	// Get seasons
	let seasons;
	try {
		seasons = await getSeasons();
	} catch (error) {
		const msg = "Failed to get seasons from tl api.";
		console.error(msg, error);
		return msg;
	}

	for (const season of seasons) {
		// filter
		if (!(season["active"] === true && season["product"]["id"] == 165431))
			continue;

		console.log(`Season (${season.name})`);

		await Promise.all(
			season.divisions.map(async (division) => {
				const matches = await getMatches(division.id, season.id);
				for (const match of matches) {
					if (
						match.homeTeam.name.toLowerCase().includes(team.toLowerCase()) ||
						match.awayTeam.name.toLowerCase().includes(team.toLowerCase())
					) {
						console.log(
							`Legger til kamp i lista. (${match.homeTeam.name} vs ${match.awayTeam.name})`
						);
						match.season = season;
						resultMatches.push(match);
						if (firstMatchOnly) break;
					}
				}
			})
		);
	}

	console.log(`${resultMatches.length} resultMatches`);

	const headers = [
		"Kamp ID",
		"Divisjon",
		"Runde",
		"Starter",
		"Start Dato",
		"Hjemmelag",
		"Bortelag",
	];
	const tableData = [];
	for (const match of resultMatches) {
		// Do datetime stuff
		datetimeStartTime = DateTime.fromFormat(match.startTime, "yyyy-MM-dd TT", {
			locale: "no",
		});
		relativeStartTime = datetimeStartTime.toRelative();

		// Add to match data
		matchData = [
			match.id.toString(),
			match.tournament.name,
			match.roundNumber.toString(),
			relativeStartTime,
			match.startTime, // parse til dato + klokkeslett?
			match.homeTeam.name,
			match.awayTeam.name,
		];
		tableData.push(matchData);
	}

	tableData.sort((a, b) => a[4].localeCompare(b[4]));
	// console.log(tableData);
	tableData.unshift(headers);

	return tableData;
}

async function main(team) {
	// Get data
	let matches = await getMatchesFor(team);
	if (matches.length > 9) {
		matches = matches.slice(0, 9);
	}
	// Make table
	const asciiTable = await makeTable(matches, `Kommende kamper for ${team}`);
	console.log(asciiTable);
	// Return to user
	return asciiTable;
}

// if main
if (require.main === module) {
	if (process.argv.length > 2) {
		main(process.argv[2]);
	} else {
		main("gamer-pilsen");
	}
}

exports.main = main;
