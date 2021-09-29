
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9";
import { clientId, guildId, token } from "./config.json"

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with pong'),
  new SlashCommandBuilder().setName('server').setDescription('Replies with server info'),
  new SlashCommandBuilder().setName('user').setDescription('Replies with user info')
]
  .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  console.log('Deploying commands...');
  try {
    console.log('Trying');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
    console.log('✅ Registered application commands');
  } catch (error) {
    console.error('🟥', error);
  }
  console.log('Done deploying...?');
});