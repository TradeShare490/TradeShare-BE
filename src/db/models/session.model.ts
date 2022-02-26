import mongoose from 'mongoose'
import { UserDocument } from './user.model'

export interface SessionDocument extends mongoose.Document {
	userId: UserDocument['_id'];
	valid: boolean;
	createdAt?: Date;
	updatedAt?: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const sessionSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		valid: { type: Boolean, default: true },
		userAgent: { type: String }
	},
	{
		timestamps: true
	}
)

const SessionModel = mongoose.model<SessionDocument>('Session', sessionSchema)

export default SessionModel
