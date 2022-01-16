import mongoose, { Schema } from "mongoose";
import { UserDocument } from "./user.model";

export interface UserInfo extends mongoose.Document {
	firstname: string;
	lastname: string;
	email: UserDocument["email"];
	portfolio: any[];
	userId: UserDocument["_id"];
	alpacaToken: string;
	username: UserDocument["username"];
}

const UserSchema: Schema = new Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	username: {type: String, ref: "UserDocument"},
	email: { type: String, ref: "UserDocument" },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserDocument" },
	alpacaToken: { type: String },
});

export default mongoose.model<UserInfo>("UserInfo", UserSchema);
