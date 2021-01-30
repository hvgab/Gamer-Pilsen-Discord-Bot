
const Discord = require('discord.js');
const Gamedig = require('gamedig');
const steam_servers_config = require('./steam_servers.json');
const mapsconfig = require('./maps.json');
const config = require('../config.json');
const utils = require('../libs/utils.js');

module.exports = {
	name: 'server',
    aliases: ['server', 'servers', 'boot', 'bootn', 'booten'],
    description: 'Information about the server provided.',
    args: true,
    arguments: [1,2,3],
    usage: '<1/2/3>',
	execute(message, args) {

		if (args[0] in mapsconfig) {

            let host = steam_servers_config[args[0]]["ip"];
            let port = steam_servers_config[args[0]]["port"]

            Gamedig.query({
                type: 'csgo',
                host: host,
                port: port,
                debug: ((config['env'] == 'dev') ? true : false),
            }).then((server) => {
                
                console.log('Server:');
                console.log(server);

                const embed = new Discord.MessageEmbed()
                    .setColor(config.colors.gp_orange)
                    .setTitle(server["name"])
                    .addField('Map', server["map"], true)
                    .addField('Players', `${server["players"].length} / ${server["maxplayers"]}`, true)
                    .addField('Connect', `steam://connect/${server["connect"]}`)
                    .setTimestamp()

                console.log('Embed:');
                console.log(embed);
                
                mapconfig = mapsconfig.find( mapconfig => mapconfig.name == server.map );
                embed.setThumbnail(mapconfig.icon);
                embed.setImage(mapconfig.img);
                
                return message.reply({ embed: embed });

            }).catch((error) => {
                // TODO: Use this as a standard error handler?
                console.error(error);
                utils.sendErrorToDev(message, error, client);
                message.reply('Something went wrong.');
            })
		}
	},
};