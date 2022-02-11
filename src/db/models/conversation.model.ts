import mongoose, { Schema } from "mongoose";
import { UserDocument } from "./user.model";

export interface Conversation extends mongoose.Document {
	members: UserDocument["username"][];
	createdAt: Date;
	updatedAt: Date;
}

const ConversationSchema: Schema = new Schema({
	members: [{ type: String, ref: "UserDocument", default: [] }],
});

export default mongoose.model<Conversation>("Conversation", ConversationSchema);
