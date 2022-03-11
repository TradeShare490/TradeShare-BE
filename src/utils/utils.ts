/**
 * Put the process in sleep for a number of seconds
 * @param second
 * @returns
 */
export const sleep = (second: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, 1000 * second)
	})
}

/**
 * Method for generate a random password
 * @returns
 */
export const generateRandomPassword = async () => {
	const crypto = await import('crypto')
	const buff = crypto.randomBytes(5) // Compliant for security-sensitive use cases
	return buff.toString('hex')
}
