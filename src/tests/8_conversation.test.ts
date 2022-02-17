import { expect } from "chai";
import { Conversation } from "../db/models/conversation.model";
import ConversationService from "../db/service/ConversationService";

describe("Conversation service can", () => {
	let conversationService: ConversationService;
	let mockedConversation: Conversation;
	it("be setup", () => {
		conversationService = new ConversationService();
		expect(conversationService).not.equal(undefined);
	});

	it("create a new converation", async () => {
		let response: any;
		response = await conversationService.createConversation(["user1", "user2"]);
		expect(response).to.have.property("conversation");
		expect(response.status).equals(200);
		expect(response.success).equals(true);
		expect(response.message).equals("Conversation is created");
		mockedConversation = response.conversation;
	});

	it("get the conversation by username", async () => {
		const response = await conversationService.getConversations("user1");
        expect(response).to.have.property("conversations");
		expect(response.status).equals(200);
		expect(response.success).equals(true);
		expect(response.message).equals("Conversations are found");
	});

	it("delete conversation by id", async () => {
		const response = await conversationService.deleteConversation(mockedConversation._id);
        expect(response.status).equals(200);
		expect(response.success).equals(true);
		expect(response.message).equals("Conversation deleted");
	});
});
