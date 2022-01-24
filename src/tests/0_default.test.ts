import { expect } from "chai";
import DefaultService from "../db/service/default.service";
import mongoose from "mongoose";
import dotenv from "dotenv";
import neo4jInstance from "../db/neo4j/Neo4jInstance";

dotenv.config();

// Setup MongoDB connection
before(async () => {
	const mongoUrl = process.env.TEST_DB_URI;
	if (!mongoUrl) {
		console.log("ERROR: Please check if mongodb url exists in your .env file");
		throw new Error(
			"TEST_DB_URI was not found. Please check if mongodb url exists in your .env file"
		);
	} else {
		await mongoose
			.connect(mongoUrl)
			.then((res) => console.log("CONNECT TO TEST DB SUCCESSFULLY"))
			.catch((err) => {
				console.log(err.message);
				throw new Error(err.message);
			});
	}

	await neo4jInstance.connect();
});

after(async () => {
	await mongoose.disconnect();
	await neo4jInstance.disconnect();
});

describe("Default service can", () => {
	let service: DefaultService;

	it("be setup", () => {
		service = new DefaultService();
	});

	it("say hello", () => {
		const res = service.hello();
		expect(res, "to include hello").to.include("Hello");
	});

	it("say testing", () => {
		const res = service.apiCheck();
		expect(res, "to include running").to.include("RUNNING");
	});

	it("say not found", () => {
		const res = service.notFound();
		expect(res, "to include NOT-FOUND").to.include("NOT-FOUND");
	});
});
