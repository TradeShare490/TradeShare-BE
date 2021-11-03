import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import userInfoModel from "./userInfo.model";
export interface UserDocument extends mongoose.Document {
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema: Schema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
	let user = this as UserDocument;

	if (!user.isModified("password")) {
		return next();
	}

	const salt = await bcrypt.genSalt(12);

	const hash = await bcrypt.hashSync(user.password, salt);

	user.password = hash;

	return next();
});

userSchema.pre("delete", async function (next) {
	let user = this as unknown as UserDocument;
	userInfoModel.remove({ userId: user._id });
	return next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	const user = this as UserDocument;

	return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
