import jwt from "jsonwebtoken";

const privateKey = ``; //Hidden, add the key from the confluence page
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgFqZq4H0AknfiSuYj2aum+4FQriv
P6Pizo2I+2MPpUonJo/57EN1G0CrnLCFO6rJb0tquJ9pECd84yecMbPcUxkfoptU
pygmap0DQ5C5dPlLNOsQIOmiIEkDAqRiz496o9ty62Oj9PWtG4DlhKRJWDl9vhmW
jXmv5tl2ipq2UNaxAgMBAAE= 
-----END PUBLIC KEY-----`;

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
