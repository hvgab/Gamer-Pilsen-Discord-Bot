// Imports
const Discord = require("discord.js");
const JSAsciiTable = require("./js-ascii-table.js");

function getDeveloper(client) {
	const developer = new Discord.User(client, {
		id: "152026317016137728",
		username: "Gabbeh",
		discriminator: "0547",
	});
	developer.fetch();
	return developer;
}

function sendErrorToDev(message, error, client) {
	const developer = getDeveloper(client);

	let error_msg = [];
	error_msg.push(`Hey ${developer}!`);
	error_msg.push(
		`This bot has trouble: ${client.user.username} (${client.user.id})`
	);
	if (message.guild) error_msg.push(`Guild: ${message.guild.name}`);
	error_msg.push(`User: ${message.author.username}`);
	error_msg.push(`Channel: ${message.channel}`);
	error_msg.push(`Message: ${message}`);
	error_msg.push(`Error: ${error}`);

	developer.send(error_msg);
}

function makeTable(tableData, title = "Telialigaen") {
	console.log("Make table");
	// console.log(`tableData: \n ${tableData}`);
	var tableOptions = {
		title: title,
		spreadsheet: false,
		header: true,
		align: true,
		padding: 1,
		theme: JSAsciiTable.JSAsciiTable.getThemes()[1].value,
		// theme: AsciiTable.getThemes()[0].value // // 0='MySQL' / 1='Unicode' / 2='Oracle'
	};
	var table = new JSAsciiTable.JSAsciiTable(tableData, tableOptions);
	var ascii = table.render();
	console.log("Table made");
	return ascii;
}

exports.getDeveloper = getDeveloper;
exports.sendErrorToDev = sendErrorToDev;
exports.makeTable = makeTable;
