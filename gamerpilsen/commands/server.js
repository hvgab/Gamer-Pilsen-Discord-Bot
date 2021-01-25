
const Discord = require('discord.js');
const Gamedig = require('gamedig');
const gpconfig = require('./gp.json');
const mapsconfig = require('./maps.json');
const config = require('../config.json');

module.exports = {
	name: 'server',
    aliases: ['boot', 'bootn', 'booten'],
    description: 'Information about the server provided.',
    args: true,
    arguments: [1,2,3],
    usage: '<1/2/3>',
	execute(message, args) {

		if (args[0] in gpconfig.servers) {

            let server_state = "";
            console.log(gpconfig.servers);
            console.log(gpconfig.servers[args[0]]);
            console.log(gpconfig.servers[args[0]]["ip"]);
            console.log(gpconfig.servers[args[0]]["port"]);
            Gamedig.query({
                type: 'csgo',
                host: gpconfig.servers[args[0]]["ip"],
                port: gpconfig.servers[args[0]]["port"],
                debug: false
            }).then((state) => {
                server_state = state;
                console.log('state:');
                console.log(state);

                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(state["name"])
                    // .setURL(`steam://connect/${state["connect"]}`)
                    // .setAuthor('Gabbeh#0547', 'https://i.imgur.com/haAgtfq.png', 'https://gabbeh.no/')
                    // .setDescription('Some description here')
                    .setThumbnail('https://raw.githubusercontent.com/vgalisson/csgo-map-icons/master/80x80/collection_icon_de_dust2.png')
                    // .addFields(
                    //     { name: 'Regular field title', value: 'Some value here' },
                    //     { name: '\u200B', value: '\u200B' },
                    //     { name: 'Inline field title', value: 'Some value here', inline: true },
                    //     { name: 'Inline field title', value: 'Some value here', inline: true },
                    // )
                    .addField('Map', state["map"], true)
                    .addField('Players', `${state["players"].length} / ${state["maxplayers"]}`, true)
                    .addField('Connect', `steam://connect/${state["connect"]}`)
                    // .setImage('https://i.imgur.com/wSTFkRM.png')
                    .setTimestamp()
                    // .setFooter('https://gabbeh.no/', 'https://i.imgur.com/haAgtfq.png');

                console.log(embed);
                
                console.log(`server state map: ${server_state['map']}`);
                for (const mapconfig of mapsconfig) {
                    console.log(`mapconfig map: ${mapconfig['name']}`);
                    if (mapconfig['name'] == state["map"]){
                        console.log(mapconfig);
                        embed.setImage(mapconfig['img']);
                        break;
                    }
                }
                
                return message.channel.send({ embed: embed });
            }).catch((error) => {
                console.log(message);
                console.log(error);
                return message.channel.send(`${message}\n${error}`);
            })
		}
	},
};