module.exports = {
	name: 'ping',
	description: 'Ping!',
	users: [''],
	execute(message, args) {
		message.channel.send('Pong.');
	},
};