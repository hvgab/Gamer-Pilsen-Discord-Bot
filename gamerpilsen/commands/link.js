
const gpconfig = require('./gp.json');

module.exports = {
	name: 'link',
	description: 'GP relevant links.',
	args: true,
	arguments: Object.keys(gpconfig.links).join(', '),
	usage: "<link>",
	execute(message, args) {
		
		console.debug(`message: ${message}`);
		console.debug(`args: ${args}`);

		if (!args.length[0] === 'help') {
			response = '\nBruk " [arg]"\n Hvor er [arg] er en av:';
			for (key in gpconfig.links) {
				response += `\n - ${key}`;
			}
			message.reply(response);
		} else if (!(args[0] in gpconfig.links)) {
			response = `[${args[0]}] finnes ikke.`;
			response += `\n "!gp help" for mer info.`;
			message.reply(response);
		}
		for (key in gpconfig.links) {
			console.debug(`key: ${key}`);
			if (args[0] === key) {
				message.reply(gpconfig.links[key])
				break;
			}
		}
	},
};