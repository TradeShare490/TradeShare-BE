import mongoose, { Schema } from "mongoose";
import { UserDocument } from "./user.model";
import { Conversation } from "./conversation.model";

export interface Message extends mongoose.Document {
	sender: UserDocument["username"];
	conversationId: Conversation["_id"];
	message: string;
	createdAt: Date;
	updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
	{
		sender: { type: String, ref: "UserDocument", required: true },
		conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
		message: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<Message>("Message", MessageSchema);
