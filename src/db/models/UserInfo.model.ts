import mongoose, { Schema } from "mongoose";
import { LoginUser } from "./LoginUser.model";

export interface UserInfo extends mongoose.Document {
	firstname: string;
	lastname: string;
	email: LoginUser["email"];
	portfolio: any[];
	id: LoginUser["_id"];
	followers: LoginUser["_id"][];
	following: LoginUser["_id"][];
}

const UserSchema: Schema = new Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
    email: {type: String, ref: 'LoginUser'},
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'LoginUser'},
	followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'LoginUser', default: []} ],
	following: [{type: mongoose.Schema.Types.ObjectId, ref: 'LoginUser', default: []} ]
});

export default mongoose.model<UserInfo>("UserInfo", UserSchema);
