import mongoose, { Schema } from "mongoose";

export interface LoginUser extends mongoose.Document {
	email: string;
	password: string;
}

const UserSchema: Schema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

export default mongoose.model<LoginUser>("LoginUser", UserSchema);
