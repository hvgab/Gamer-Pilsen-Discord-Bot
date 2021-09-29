"use strict";
const Axios = require("axios");
const Discord = require("discord.js");
const this_config = require("./commands/links.json");
const Path = require("path");
const Fs = require("fs");
const Imgbb = require("./libs/Imgbb.js");
class BaseCommand {
    constructor(message, args) {
        // Baseline for all commands
        this.message = message; // incoming message we're reacting to
        this.args = args;
        // For commands that keeps editing the message
        this.sent_message;
        this.interval;
        this.waitTime = 15 * 1000;
        // Regex for "auto-commands" reacting to normal chat without command prefix
        this.regex = /https:\/\/esportal.com\/gather\/(\d+)/;
        this.reply = "";
        this.embeds = [];
    }
    execute() {
        console.error('NotImplementedError');
        // interval example:
        this.interval = setInterval(() => {
            this.sent_message = this.main();
        }, this.waitTime);
    }
    stopInterval() {
        clearInterval(this.interval);
    }
    main() {
        console.error('NotImplementedError');
        doSomething();
        if (stop_the_interval) {
            this.stopInterval();
        }
    }
}
module.exports = {
    name: "",
    description: "",
    args: true,
    aliases: ["trigger"],
    usage: "<@user>",
    hidden: false,
    command: Command
};
