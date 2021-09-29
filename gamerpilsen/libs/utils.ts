// Imports
import Discord from "discord.js";
import JSAsciiTable from "./js-ascii-table.js";

function getDeveloper(client: Discord.Client) {
  const developer = new Discord.User(client, {
    id: "152026317016137728",
    username: "Gabbeh",
    discriminator: "0547",
  });
  developer.fetch();
  return developer;
}

function sendErrorToDev(message: Discord.Message, error: Error, client: Discord.Client) {
  const developer = getDeveloper(client);

  let error_msg = [];
  error_msg.push(`Hey ${developer}!`);
  error_msg.push(
    `This bot has trouble: ${client.user.tag} (${client.user.id})`
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
    spreadsheet: false,
    header: true,
    align: true,
    padding: 1,
    theme: JSAsciiTable.JSAsciiTable.getThemes()[1].value,
    // theme: AsciiTable.getThemes()[0].value // // 0='MySQL' / 1='Unicode' / 2='Oracle'
  };
  if (title !== null) {
    tableOptions["title"] = title
  }
  var table = new JSAsciiTable.JSAsciiTable(tableData, tableOptions);
  var ascii = table.render();
  console.log("Table made");
  return ascii;
}

export { getDeveloper };
export { sendErrorToDev };
export { makeTable };