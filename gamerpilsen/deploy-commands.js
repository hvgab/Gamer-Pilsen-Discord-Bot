"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const config_json_1 = require("./config.json");
const commands = [
    new builders_1.SlashCommandBuilder().setName('ping').setDescription('Replies with pong'),
    new builders_1.SlashCommandBuilder().setName('server').setDescription('Replies with server info'),
    new builders_1.SlashCommandBuilder().setName('user').setDescription('Replies with user info')
]
    .map(command => command.toJSON());
const rest = new rest_1.REST({ version: '9' }).setToken(config_json_1.token);
(async () => {
    console.log('Deploying commands...');
    try {
        console.log('Trying');
        await rest.put(v9_1.Routes.applicationGuildCommands(config_json_1.clientId, config_json_1.guildId), { body: commands });
        console.log('✅ Registered application commands');
    }
    catch (error) {
        console.error('🟥', error);
    }
    console.log('Done deploying...?');
});
