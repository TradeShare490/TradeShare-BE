import { expect } from "chai";
import DefaultService from "../db/service/default.service";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// Setup MongoDB connection
before(async () => {
    const mongoUrl = process.env.TEST_DB_URI || "mongodb+srv://ken:5ta9cHYDPIRS6PMa@cluster0.wva5y.mongodb.net/TradeShareTestDB?retryWrites=true&w=majority";
    if (!mongoUrl) {
        console.log("ERROR: Please check if mongodb url exists in your .env file");
        throw new Error("MONGODB_URL not found. Please check if mongodb url exists in your .env file");
    } else {
        await mongoose
            .connect(mongoUrl)
            .then((res) => console.log("CONNECT TO TEST DB SUCCESSFULLY"))
            .catch((err) => {
                console.log(err.message);
                throw new Error(err.message);
            });
    }
});

after(async () => {
    await mongoose.disconnect();
});

describe('Default service can', () => {
    let service:DefaultService;

    it('be setup', () => {
        service = new DefaultService()
    })

    it('say hello', () => {
        const res = service.hello() 
        expect(res, 'to include hello').to.include('Hello')
    })

    it('say testing', () => {
        const res = service.apiCheck() 
        expect(res, 'to include running').to.include('RUNNING')
    })

    it('say not found', () => {
        const res = service.notFound() 
        expect(res, 'to include NOT-FOUND').to.include('NOT-FOUND')
    })

})