"use strict";
const Discord = require("discord.js");
const Gamedig = require("gamedig");
const steam_servers_config = require("./steam_servers.json");
const mapsconfig = require("./maps.json");
const config = require("../config.json");
const utils = require("../libs/utils.js");
class SteamServer {
    constructor(message, args) {
        // Baseline for all commands
        this.message = message; // incoming message we're reacting to
        this.args = args;
        // For commands that keeps editing the message
        this.sent_message = null;
        this.interval;
        this.waitTime = 60 * 1000; // How often to update in ms
        // Making embeds/replies
        // this.reply = "";
        // this.embeds = [];
        this.embed;
        // Custom in this class
        this.host;
        this.port;
        this.server; // gamedig server
    }
    execute() {
        console.log("Executing");
        console.log("Get server from config");
        if (!(this.args[0] in mapsconfig)) {
            msg = `${this.args[0]} ligger ikke i server config. @Gabbeh for å legge den til.`;
            console.log(msg);
            this.message.reply(msg);
            return;
        }
        ;
        this.host = steam_servers_config[this.args[0]]["ip"];
        this.port = steam_servers_config[this.args[0]]["port"];
        // Looping message, run main every 'waitTime' ms.
        this.interval = setInterval(() => {
            console.log("SteamServer.main() in interval loop");
            this.main();
        }, this.waitTime);
    }
    stopInterval() {
        clearInterval(this.interval);
    }
    async main() {
        console.log("Starting main");
        console.log("main.gamedig");
        try {
            await this.gamedig(this.host, this.port);
        }
        catch (error) {
            console.error(error);
            utils.sendErrorToDev(`Error on gamedig: \n${error}`);
            return message.reply("Kan ikke sjekke server status for øyeblikket, Serveren kan være offline, eller det kan være en brannmur mellom meg og serveren.");
        }
        console.log("main.makeEmbed");
        await this.makeEmbed();
        console.log("main.sendReply");
        console.log(`this.sent_message: ${this.sent_message}`);
        await this.sendReply();
        console.log(`this.sent_message: ${this.sent_message}`);
        // Stop refreshing if there are 1 or less players. (HLTV counts as 1)
        if (this.server !== null && this.server.players.length <= 1) {
            this.stopInterval();
        }
    }
    // Custom functions for this class:
    async gamedig(host, port) {
        console.log(`Starting gamedig with ${host}:${port}`);
        let server = await Gamedig.query({
            type: "csgo",
            host: host,
            port: port,
            debug: config["env"] == "dev" ? true : false,
        });
        console.log(`end gamedig with ${host}:${port}`);
        this.server = server;
        return this.server;
    }
    async makeEmbed() {
        console.log("Making embed");
        const embed = new Discord.MessageEmbed()
            .setColor(config.colors.gp_orange)
            .setFooter("Last update")
            .setTimestamp();
        // Title
        let title = this.server.name;
        // Hvis det er fredag, custom fredagsboot tittel
        if (new Date().getDay() == 5 && this.args[0] == 2) {
            title = ":beers: FREDAGSBOOTEN :beers:";
        }
        embed.setTitle(title);
        // Maps
        embed.addField("Map", this.server["map"], true);
        // Players
        embed.addField("Players", `${this.server["players"].length} / ${this.server["maxplayers"]}`, true);
        // Connect to server
        embed.addField("Connect", `steam://connect/${this.server["connect"]}`);
        // Set image and thumbnail/icon
        let mapconfig = mapsconfig.find((mapconfig) => mapconfig.name == this.server.map);
        if (mapconfig) {
            embed.setThumbnail(mapconfig.icon);
            embed.setImage(mapconfig.img);
        }
        // Return embed
        this.embed = embed;
        return this.embed;
    }
    async sendReply() {
        console.log("Send reply.");
        console.log(`this.sent_message: ${this.sent_message}`);
        console.log(`this.sent_message === null: `);
        console.log(this.sent_message === null);
        // First message
        if (this.sent_message === null) {
            this.sent_message = await this.message.channel.send({ embed: this.embed });
            if (new Date().getDay() == 5) {
                Promise.all([
                    msg.react("🍺"),
                    msg.react("🍹"),
                    msg.react("🥃"),
                    msg.react("🍾"),
                    msg.react("🍷"),
                    msg.react("☕"),
                    msg.react("🧃"),
                ]).catch(() => console.error("One Of The Emojis failed to react"));
            }
            return;
        }
        else {
            // Update/Edit/Refresh message
            let sent_message = await this.sent_message.edit({ embeds: [this.embed] });
            this.sent_message = sent_message;
        }
    }
}
module.exports = {
    name: "server",
    aliases: ["server", "servers", "boot", "bootn", "booten"],
    description: "Information about the server provided.",
    args: true,
    arguments: [1, 2, 3],
    usage: "<1/2/3>",
    execute(message, args) {
        myCommand = new SteamServer(message, args);
        myCommand.execute();
    }
};
