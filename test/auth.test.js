const request = require("supertest");
const app = require("../app");
const Service = require("../models/Service");

describe("POST /auth/signup", () => {

    test("should create a new user with valid data", async () => {

        const response = await request(app)
            .post("/auth/signup")
            .send({
                email: "testuser@example.com",
                password: "TestPassword123"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty("data");

        expect(response.body.data).toHaveProperty("message");
        expect(response.body.data.message).toBe("User created successfully!");

        expect(response.body.data).toHaveProperty("user");
        expect(response.body.data.user).toHaveProperty(
            "email",
            "testuser@example.com"
        );
    });


    test("should reject signup with invalid data", async () => {

        const response = await request(app)
            .post("/auth/signup")
            .send({
                email: "not-an-email",
                password: ""
            });

        expect(response.statusCode).toBe(400);
    });

});


describe("POST /auth/login", () => {

    test("should login successfully with valid credentials", async () => {

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "testuser@example.com",
                password: "TestPassword123"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("data");

        expect(response.body.data).toHaveProperty(
            "message",
            "Login successful!"
        );

        expect(response.body.data).toHaveProperty("token");

        expect(typeof response.body.data.token).toBe("string");
    });


    test("should reject login with incorrect password", async () => {

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "testuser@example.com",
                password: "WrongPassword123"
            });

        expect(response.statusCode).toBe(401);
    });

});
describe("GET /services/:id/reviews", () => {

    test("should return reviews for an existing service", async () => {

        const service = await Service.create({
            name: "Haircut"
        });

        const response = await request(app)
            .get(`/services/${service.id}/reviews`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("data");

        expect(Array.isArray(response.body.data)).toBe(true);
    });


    test("should return 404 for a non-existing service", async () => {

        const response = await request(app)
            .get("/services/999999/reviews");

        expect(response.statusCode).toBe(404);
    });

});
describe("POST /bookings", () => {

    test("should create a booking for an authenticated user", async () => {

        // First create a user
        await request(app)
            .post("/auth/signup")
            .send({
                email: "bookinguser@example.com",
                password: "TestPassword123"
            });

        // Login to get JWT
        const loginResponse = await request(app)
            .post("/auth/login")
            .send({
                email: "bookinguser@example.com",
                password: "TestPassword123"
            });

        const token = loginResponse.body.data.token;

        // Create booking
        const response = await request(app)
            .post("/bookings")
            .set("Authorization", `Bearer ${token}`)
            .send({
                service: "Haircut",
                date: "2026-08-20",
                time: "14:00",
                name: "Test Customer",
                phone: "03001234567",
                notes: "Test booking"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty("data");

        expect(response.body.data).toHaveProperty(
            "message",
            "Booking created successfully!"
        );

        expect(response.body.data).toHaveProperty("booking");

        expect(response.body.data.booking).toHaveProperty(
            "service",
            "Haircut"
        );

        expect(response.body.data.booking).toHaveProperty(
            "name",
            "Test Customer"
        );
    });


    test("should reject booking without authentication", async () => {

        const response = await request(app)
            .post("/bookings")
            .send({
                service: "Haircut",
                date: "2026-08-20",
                time: "14:00",
                name: "Test Customer",
                phone: "03001234567",
                notes: "Test booking"
            });

        expect(response.statusCode).toBe(401);
    });

});
describe("GET /users/profile", () => {

    test("should return the profile of an authenticated user", async () => {

        // Create user
        await request(app)
            .post("/auth/signup")
            .send({
                email: "profileuser@example.com",
                password: "TestPassword123"
            });

        // Login to get JWT
        const loginResponse = await request(app)
            .post("/auth/login")
            .send({
                email: "profileuser@example.com",
                password: "TestPassword123"
            });

        const token = loginResponse.body.data.token;

        // Get profile
        const response = await request(app)
            .get("/users/profile")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("data");

        expect(response.body.data).toHaveProperty("user");

        expect(response.body.data.user).toHaveProperty(
            "email",
            "profileuser@example.com"
        );

        expect(response.body.data.user).toHaveProperty("id");

        expect(response.body.data.user).toHaveProperty("role");
    });


    test("should reject profile request without authentication", async () => {

        const response = await request(app)
            .get("/users/profile");

        expect(response.statusCode).toBe(401);
    });

});