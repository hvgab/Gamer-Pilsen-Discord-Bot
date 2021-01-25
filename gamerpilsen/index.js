
const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const config = require('./config.json');
const secrets = require('./secrets.json');
const { prefix } = require('./config.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// gamerpilsen.lenker
client.on('message', message => {

    // console.debug(message.author);
    // console.debug(message.author.id);

    const gabbeh = new Discord.User(client, {
        id:"152026317016137728",
        username: "Gabbeh",
        discriminator: "0547",
        avatar: "4a6046c7fa45946b856667e4e697c801"
    });
    // console.log("gabbeh");
    // console.log(gabbeh);
    // console.log(gabbeh.fetch());


    // Commands must start with prefix, and not be sent by bot.
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // get commmandName and args from message
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // find command
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.args && !args.length) {
        let reply = `You didn't provice any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(`${gabbeh} Error: ${error}`);
    }
});


client.login(secrets.token);