import neo4j, { Driver } from "neo4j-driver";
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

const instance = new Neo4jInstance(input);
export default instance;
