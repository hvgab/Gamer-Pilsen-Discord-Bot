module.exports = class GPBot {
	constructor() {}
	handleMessage(message) {
		const { chatRoom, content } = message;
		if (content === "!ping") {
			chatRoom.sendMessage("pong");
		}
	}
};
