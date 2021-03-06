import mongoose, { Schema } from 'mongoose'
import { UserDocument } from './user.model'
export interface Conversation extends mongoose.Document {
	members: UserDocument['username'][];
	membersNames: Array<string>;
	latestMessage: Object;
	createdAt: Date;
	updatedAt: Date;
}

const ConversationSchema: Schema = new Schema({
	members: [{ type: String, ref: 'UserDocument', default: [] }],
	membersNames: [{ type: String, default: [] }],
	latestMessage: [{ type: Object, ref: 'MessageDocument' }]
})

export default mongoose.model<Conversation>('Conversation', ConversationSchema)
