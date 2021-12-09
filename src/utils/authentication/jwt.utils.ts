import jwt from "jsonwebtoken";

if(!process.env.JWT_PRIVATE_KEY || !process.env.JWT_PUBLIC_KEY){
	throw new Error("JWT keys are not detected")
}

const privateKey = `${process.env.JWT_PRIVATE_KEY}`.trim();
const publicKey = `${process.env.JWT_PUBLIC_KEY}`.trim();

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
	return jwt.sign(object, privateKey, {
		...(options && options),
		algorithm: "RS256",
	});
}

export function verifyJwt(token: string) {
	try {
		const decoded = jwt.verify(token, publicKey);
		return {
			valid: true,
			expired: false,
			decoded,
		};
	} catch (e: any) {
		console.error(e);
		return {
			valid: false,
			expired: e.message === "jwt expired",
			decoded: null,
		};
	}
}
