import mongoose, { Schema } from "mongoose";
import { UserDocument } from "./user.model";

export interface UserInfo extends mongoose.Document {
	firstname: string;
	lastname: string;
	username: string;
	email: UserDocument["email"];
	portfolio: any[];
	id: UserDocument["_id"];
	followers: UserDocument["_id"][];
	following: UserDocument["_id"][];
}

const UserSchema: Schema = new Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	username: {type: String },
	email: { type: String, ref: "UserDocument" },
	id: { type: mongoose.Schema.Types.ObjectId, ref: "UserDocument" },
	followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDocument", default: [] }],
	following: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDocument", default: [] }],
});

export default mongoose.model<UserInfo>("UserInfo", UserSchema);
