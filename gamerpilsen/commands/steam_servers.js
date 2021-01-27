
const Discord = require('discord.js');
const Gamedig = require('gamedig');
const steam_servers_config = require('./steam_servers.json');
const mapsconfig = require('./maps.json');
const config = require('../config.json');

module.exports = {
	name: 'server',
    aliases: ['server', 'servers', 'boot', 'bootn', 'booten'],
    description: 'Information about the server provided.',
    args: true,
    arguments: [1,2,3],
    usage: '<1/2/3>',
	execute(message, args) {

		if (args[0] in mapsconfig) {

            console.log(`args: ${args}`);

            let server_state = "";
            console.log(steam_servers_config);
            console.log(steam_servers_config[args[0]]);
            console.log(steam_servers_config[args[0]]["ip"]);
            console.log(steam_servers_config[args[0]]["port"]);

            let host = steam_servers_config[args[0]]["ip"];
            let port = steam_servers_config[args[0]]["port"]

            console.log(host);
            console.log(port);

            Gamedig.query({
                type: 'csgo',
                host: host,
                port: port,
                debug: true
            }).then((state) => {

                console.log('JA GAMEDIG FUNKER');

                server_state = state;
                console.log('state:');
                console.log(state);

                const embed = new Discord.MessageEmbed()
                    .setColor(config.colors.gp_orange)
                    .setTitle(state["name"])
                    // .setThumbnail('https://raw.githubusercontent.com/vgalisson/csgo-map-icons/master/80x80/collection_icon_de_dust2.png')
                    .addField('Map', state["map"], true)
                    .addField('Players', `${state["players"].length} / ${state["maxplayers"]}`, true)
                    .addField('Connect', `steam://connect/${state["connect"]}`)
                    .setTimestamp()

                console.log(embed);
                
                console.log(`server state map: ${server_state['map']}`);
                for (const mapconfig of mapsconfig) {
                    console.log(`mapconfig map: ${mapconfig['name']}`);
                    if (mapconfig['name'] == state["map"]){
                        console.log(mapconfig);
                        embed.setImage(mapconfig['img']);
                        embed.setThumbnail(mapconfig['icon']);
                        break;
                    }
                }
                
                return message.channel.send({ embed: embed });
            }).catch((error) => {

                console.log('GAMEDIG FEILER');
                // console.log(message);
                console.log(error);
                return message.channel.send(`${message}\n${error}`);
            })
		}
	},
};