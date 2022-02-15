import { expect } from "chai";
import { Conversation } from "../db/models/conversation.model";
import ConversationService from "../db/service/ConversationService";
import MesssageService from "../db/service/MessageService";

describe("Message service can", () => {
	let conversationService: ConversationService;
	let mockedConversation: Conversation;
	let messageService: MesssageService;
	it("be setup", async () => {
		conversationService = new ConversationService();
		messageService = new MesssageService();
		expect(messageService).not.equal(undefined);
		let response: any;
		try {
			response = await conversationService.createConversation(["user1", "user2"]);
		} catch (error) {
			console.log(error);
		}
		mockedConversation = response.conversation;
	});

	it("create a new message", async () => {
		let response: any;
		try {
			response = await messageService.createMessage("user1", "abcdef", mockedConversation._id);
		} catch (error) {
			console.log(error);
		}
		expect(response).to.have.property("message");
		expect(response.status).equals(200);
		expect(response.success).equals(true);
		expect(response.message.conversationId).equals(mockedConversation._id);
		expect(response.message.message).equals("abcdef");
	});

	it("get messages by conversationId", async () => {
		const response = await messageService.getMessage(mockedConversation._id);
		expect(response.status).equals(201);
		expect(response.success).equals(true);
	});
});
