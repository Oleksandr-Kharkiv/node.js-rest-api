import mongoose from "mongoose";
import request from "supertest";
import "dotenv/config";

import app from "../../app.js";

const {PORT, DB_HOST_TEST} = process.env;

describe("test login route", ()=>{
    let server = null;
    beforeAll(async()=>{
        await mongoose.connect(DB_HOST_TEST);
        server = app.listen(PORT);
    })

    afterAll(async()=>{
        await mongoose.connection.close();
        server.close();
    })

    test("test login with correct data", async()=>{
        const loginData = {
            "email": "test@ukr.net",
            "password": "1234567"
        }
        const {statusCode, body} = await request(app).post("/users/auth/login").send(loginData);
       
        expect(statusCode).toBe(200);
        expect(body.email).toBe(loginData.email);
    })
})