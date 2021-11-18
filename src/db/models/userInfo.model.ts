import mongoose, { Schema } from "mongoose";
import { UserDocument } from "./user.model";

export interface UserInfo extends mongoose.Document {
	firstname: string;
	lastname: string;
	email: UserDocument["email"];
	portfolio: any[];
	userId: UserDocument["_id"];
}

const UserSchema: Schema = new Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	email: { type: String, ref: "UserDocument" },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserDocument" },
});

export default mongoose.model<UserInfo>("UserInfo", UserSchema);
