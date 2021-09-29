"use strict";
const this_config = require("./links.json");
let temp_args = [];
for (const link of this_config) {
    temp_args.push(link["title"]);
}
const available_arguments = temp_args.join(", ");
module.exports = {
    name: "link",
    description: "GP relevant links.",
    arguments: available_arguments,
    aliases: ["links", "lenke", "lenker"],
    usage: "[link]",
    execute(message, args) {
        if (!args.length) {
            // link (all)
            let msg_response = ["GP Lenker"];
            for (const link of this_config) {
                msg_response.push(`${link.title}\n<${link.url}>`);
            }
            return message.reply(msg_response);
        }
        else {
            // link <title>
            for (const link of this_config) {
                if (args[0].toUpperCase() === link.title.toUpperCase()) {
                    return message.reply(`**${link.title}**\n${link.description}\n${link.url}`);
                }
            }
            // link <non-existant>
            console.log(`message: ${message}`);
            console.log(`args: ${args}`);
            console.log(`this.name: ${this.name}`);
            return message.client.commands.get("help").execute(message, [this.name]);
        }
    },
};
