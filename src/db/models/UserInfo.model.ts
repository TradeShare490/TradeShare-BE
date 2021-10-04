import mongoose, { Schema } from "mongoose";
import { ILoginUser } from "./LoginUser.model";

export interface IUserInfo extends mongoose.Document {
	firstname: string;
	lastname: string;
	email: ILoginUser["email"];
	portfolio: any[];
	id: ILoginUser["_id"];
}

const UserSchema: Schema = new Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
    email: {type: String, ref: 'LoginUser'},
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'LoginUser'}
});

export default mongoose.model<IUserInfo>("UserInfo", UserSchema);
