
const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Oversikt over alle kommandoer',
    aliases:  ['hjelp'],
    usage: '<kommando>',
    cooldown: 5,
    execute(message, args) {

        console.log('help');
        console.log(message.content);
        console.log(args);
        
        const data = [];
        const { commands } = message.client;

        // HELP
        if (!args.length) {
            data.push('Her er alle kommandoer:');

            for (const [_, command] of commands) {
                console.log('command');
                console.log(command);

                // check for user perms
                if (command.users && command.users.length && !(command.users.includes(message.author.tag))) {
                    continue;
                };

                if (command.hidden) continue;

                data.push(`\`${command.name}\`: ${command.description}`);
            };
            
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            return message.reply(data, { split: true});
                // .then(() => {
                //     if (message.channel.type === 'dm') return;
                //     message.reply('I\'ve sent you a DM with all my commands!');
                // })
                // .catch(error => {
                //     console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                //     message.reply('It seems like I can\'t DM you! Do you have DMs disabled?');
                // });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply("That's not a valid command!");
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.arguments) data.push(`**Arguments:** ${command.arguments}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true});
    }
}