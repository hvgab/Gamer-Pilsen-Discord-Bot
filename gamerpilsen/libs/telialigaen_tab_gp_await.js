// Imports
const axios = require("axios");
const { getSeasons, getTables } = require("./telialigaenApi");
const { makeTable } = require("./utils.js");

// Constants
const SEASONS_URL = "https://www.telialigaen.no/api/seasons";
const TABLES_URL = "https://www.telialigaen.no/api/tables"; //params: division=x&season=8595

const headers = [
	"Divisjon",
	"#",
	"Lag",
	"Spilt",
	"Vunnet",
	"Uavgjort",
	"Tapt",
	"+/-",
	"Straff",
	"Bonus",
	"Poeng",
];

async function getTabellerGP() {
	const tableData = [];

	// Get seasons
	const seasons = await getSeasons();

	for (const season of seasons) {
		// filter
		if (!(season["active"] === true && season["product"]["id"] == 165431))
			continue;

		console.log(season);

		await Promise.all(
			season.divisions.map(async (division) => {
				const tables = await getTables(division.id, season.id);
				for (const table of tables) {
					for (const signup of table["signups"]) {
						if (signup["participant"]["shortname"] == "❡p") {
							signupData = [
								division["name"],
								signup["placement"].toString(),
								signup["participant"]["name"],
								signup["played"].toString(),
								signup["wins"].toString(),
								signup["draws"].toString(),
								signup["losses"].toString(),
								`${signup["scoreFor"]}/${signup["scoreAgainst"]}`,
								signup["penalty"].toString(),
								signup["bonus"].toString(),
								signup["points"].toString(),
							];
							tableData.push(signupData);
						}
					}
				}
			})
		);
	}

	console.log(`tableData is now:`);
	console.log(tableData);
	tableData.sort((a, b) => a[0].localeCompare(b[0]));
	console.log(tableData);
	tableData.unshift(headers);

	return tableData;
}

async function main() {
	// Get data
	const tableData = await getTabellerGP();
	console.log(`tableData. \n${tableData}`);
	// Make table
	const asciiTable = await makeTable(tableData);
	console.log(`asciiTable:\n ${asciiTable}`);
	// Return to user
	return asciiTable;
}

// main();

exports.main = main;
