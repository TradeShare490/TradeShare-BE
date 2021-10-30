import jwt from "jsonwebtoken";

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgFqZq4H0AknfiSuYj2aum+4FQrivP6Pizo2I+2MPpUonJo/57EN1
G0CrnLCFO6rJb0tquJ9pECd84yecMbPcUxkfoptUpygmap0DQ5C5dPlLNOsQIOmi
IEkDAqRiz496o9ty62Oj9PWtG4DlhKRJWDl9vhmWjXmv5tl2ipq2UNaxAgMBAAEC
gYAfmufXh5Wcy5wAV1H/Ef5XRAKIhqn+s8o2WYjIf9a7TXkIVLj0t09wee1JLtEn
vOlUN8B765y1Cb38PWKhScS63qHOkF66Yj3Dn4YtJc8wGviVid0r9AyvHd3P62Gh
jSyiWCkzLFnGPRpgJagTWRpvmevx+ww5AWFb4FVCPuumIQJBAJxQuyM+4iaLv1hf
ZM+OZnciehgOwaMF55Vmh796gEzpCu2njOznQ5n4/HCE3lPVwvwDfNy1416N/Zp3
n9vylbUCQQCUYJ7uaJ+R0ZZHjFousfIYkkSCa7eDkFLAzDggQgkIh3e265vjRgNW
VgjsrUIJsK3GMj+poC5GH32UQyVEgBqNAkAoXvlWCwGhbupGSqzgpih0kGT0HauJ
DRdYkJhyrZLBSlbWNjXBYaEl/RZFgStif4zSRZxT7G4Cl61t3YNd7PMZAkBf+EKz
533WXh56dqBZ9YSmOe0QAkX3VaEAzNY8nxmip6RZ7visPrun2wv4sXO2Os2bFSMy
PsXPW0zpWajALq99AkAhC6N+/Iruk+6+H1w7+tRytRoIB8EsXmnR6O9JowiG2RjM
+bHWtsvCfwBDCjBQUfwdY1z4hs+jVsIrHR/tfT4O 
-----END RSA PRIVATE KEY-----`;
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
