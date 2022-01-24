/**
 * Put the process in sleep for a number of seconds
 * @param second
 * @returns
 */
export const sleep = (second: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, 1000 * second);
	});
};
