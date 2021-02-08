const GPBot = require("../GPBot.js");
const Message = require("../Message.js");
const ChatRoom = require("../ChatRoom.js");

jest.mock("../ChatRoom");

ChatRoom.mockImplementation(() => {
	return {
		sendMessage: jest.fn(),
	};
});

describe("GPBot", () => {
	let bot;
	let chatRoom;

	beforeEach(() => {
		ChatRoom.mockClear();
		bot = new GPBot();
		chatRoom = new ChatRoom();
	});

	test("ping message should respond with pong", () => {
		const messageContent = "!ping";
		const expectedResponse = "pong";

		const message = new Message(chatRoom, messageContent);

		bot.handleMessage(message);

		expect(chatRoom.sendMessage).toBeCalledTimes(1);
		expect(chatRoom.sendMessage).toBeCalledWith(expectedResponse);
	});

	test("bot should NOT send a response it msg is not valid command", () => {
		const messageContent = "squad down for some csgo";
		const message = new Message(chatRoom, messageContent);

		bot.handleMessage(message);

		expect(chatRoom.sendMessage).toBeCalledTimes(0);
	});
});
