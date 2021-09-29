"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTable = exports.sendErrorToDev = exports.getDeveloper = void 0;
// Imports
const discord_js_1 = __importDefault(require("discord.js"));
const js_ascii_table_js_1 = __importDefault(require("./js-ascii-table.js"));
function getDeveloper(client) {
    const developer = new discord_js_1.default.User(client, {
        id: "152026317016137728",
        username: "Gabbeh",
        discriminator: "0547",
    });
    developer.fetch();
    return developer;
}
exports.getDeveloper = getDeveloper;
function sendErrorToDev(message, error, client) {
    const developer = getDeveloper(client);
    let error_msg = [];
    error_msg.push(`Hey ${developer}!`);
    error_msg.push(`This bot has trouble: ${client.user.tag} (${client.user.id})`);
    if (message.guild)
        error_msg.push(`Guild: ${message.guild.name}`);
    error_msg.push(`User: ${message.author.username}`);
    error_msg.push(`Channel: ${message.channel}`);
    error_msg.push(`Message: ${message}`);
    error_msg.push(`Error: ${error}`);
    developer.send(error_msg);
}
exports.sendErrorToDev = sendErrorToDev;
function makeTable(tableData, title = "Telialigaen") {
    console.log("Make table");
    // console.log(`tableData: \n ${tableData}`);
    var tableOptions = {
        spreadsheet: false,
        header: true,
        align: true,
        padding: 1,
        theme: js_ascii_table_js_1.default.JSAsciiTable.getThemes()[1].value,
        // theme: AsciiTable.getThemes()[0].value // // 0='MySQL' / 1='Unicode' / 2='Oracle'
    };
    if (title !== null) {
        tableOptions["title"] = title;
    }
    var table = new js_ascii_table_js_1.default.JSAsciiTable(tableData, tableOptions);
    var ascii = table.render();
    console.log("Table made");
    return ascii;
}
exports.makeTable = makeTable;
