import mongoose, { Schema } from "mongoose";
import { UserDocument } from "./user.model";
import { Message } from "./message.model";
export interface Conversation extends mongoose.Document {
	members: UserDocument["username"][];
	latestMessage: Object;
	createdAt: Date;
	updatedAt: Date;
}

const ConversationSchema: Schema = new Schema({
	members: [{ type: String, ref: "UserDocument", default: [] }],
	latestMessage: [{ type: Object, ref: "MessageDocument"}]
});

export default mongoose.model<Conversation>("Conversation", ConversationSchema);
