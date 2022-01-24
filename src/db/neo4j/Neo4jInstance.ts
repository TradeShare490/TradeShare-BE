import neo4j, { Driver, Record } from "neo4j-driver";
import { sleep } from "../../utils/utils";
import dotenv from "dotenv";
dotenv.config();

interface Neo4jInstanceInput {
	numbRetry: number;
	url: string;
	username: string;
	password: string;
	timeInterval: number;
}

export interface Neo4jCustomQueryResponse {
	success: boolean;
	data?: any;
	message: string;
}

export enum QueryMode {
	write = "write",
	read = "read",
}

class Neo4jInstance {
	private driver!: Driver;
	private isConnected = false;
	private url!: string;
	private username!: string;
	private password!: string;
	private numbRetry!: number;
	private timeInterval!: number;

	constructor({ url, username, password, numbRetry, timeInterval }: Neo4jInstanceInput) {
		this.url = url;
		this.username = username;
		this.password = password;
		this.numbRetry = numbRetry;
		this.timeInterval = timeInterval;
	}

	/**
	 * Setup connectivity to Neo4j, re-try for a number of time
	 */
	async connect() {
		// try connecting to Neo4j db
		for (let count = 0; count < this.numbRetry && !this.isConnected; count++) {
			await this.connectOnce();
		}

		if (!this.isConnected) {
			// terminate, cannot connect to neo4j
			console.log(`Failed to connect to Neo4j after ${this.numbRetry} attemps`);
			process.exit(-1);
		}
	}

	/**
	 * Setup connectivity to Neo4j and test the connectivity
	 */
	async connectOnce() {
		try {
			console.log("Connecting Neo4j...");
			this.driver = neo4j.driver(this.url, neo4j.auth.basic(this.username, this.password));
			await this.driver.verifyConnectivity();
			console.log("Neo4j connectivity has been establishd!");
			this.isConnected = true;
		} catch (error: any) {
			console.log("Error when connecting to Neo4j...");
			console.log(error.message);
			console.log(`Retrying after ${this.timeInterval} seconds...`);
			await sleep(this.timeInterval);
		}
	}

	/**
	 * Closes all open sessions
	 */
	async disconnect() {
		console.log("Neo4j is closing..");
		await this.driver.close();
		console.log("Neo4j has been closed");
	}

	async testConnectivity() {
		// call verify
		try {
			await this.driver.verifyConnectivity();
		} catch (error) {
			console.log("Neo4j connectivity lost...");
			// re-connect
			await this.connect();
		}
	}

	/**
	 * For general query when the user is not sure if it is for read or write
	 * @param query
	 * @param params
	 * @returns
	 */
	async runQuery<T = { [key: string]: any }>(query: string, params: T) {
		await this.testConnectivity();

		// once here, a connectivity is secured
		const session = this.driver.session();
		let response: Neo4jCustomQueryResponse;
		try {
			const result = await session.run(query, params);
			response = { success: true, data: result.records, message: "Done" };
		} catch (error: any) {
			console.log(error.message);
			response = { success: false, message: error.message };
		} finally {
			await session.close();
		}
		return response;
	}

	// Ref: https://medium.com/neo4j/querying-neo4j-clusters-7d6fde75b5b4
	/**
	 * Run a query in a transaction
	 * @param query the query string
	 * @param params the object for params defined from the query
	 * @param mode either read/write
	 * @returns
	 */
	async runQueryInTransaction<T>(query: string, params: T, mode: string) {
		await this.testConnectivity();

		// once here, a connectivity is secured
		const session = this.driver.session();
		let response: Neo4jCustomQueryResponse;
		// TODO:  what if there is an error ?
		try {
			let data: Record[];
			if (mode === QueryMode.write) {
				data = await session.writeTransaction(async (txc) => {
					let tempResult = await txc.run(query, params);
					return tempResult.records;
				});
			} else if (mode === QueryMode.read) {
				data = await session.readTransaction(async (txc) => {
					let tempResult = await txc.run(query, params);
					return tempResult.records;
				});
			} else {
				// unknown value passed for mode
				throw new Error("Unexpected mode passed");
			}

			response = { success: true, message: "Done", data: data };
		} catch (error: any) {
			console.log(error.message);
			response = { success: false, message: error.message };
		} finally {
			await session.close();
		}

		return response;
	}
}

// input declarations
const parsedInterval =
	process.env.NEO4J_NTERVAL !== undefined ? Number.parseInt(process.env.NEO4J_NTERVAL) : 10;

const parsedNumRetry =
	process.env.NEO4J_NUMB_RETRY !== undefined ? Number.parseInt(process.env.NEO4J_NUMB_RETRY) : 5;

const input: Neo4jInstanceInput = {
	url: process.env.NEO4J_URI || "",
	username: process.env.NEO4J_USERNAME || "",
	password: process.env.NEO4J_PASSWORD || "",
	numbRetry: Number.isInteger(parsedNumRetry) ? parsedNumRetry : 5,
	timeInterval: Number.isInteger(parsedInterval) ? parsedInterval : 10,
};

const neo4jInstance = new Neo4jInstance(input);
export default neo4jInstance;
