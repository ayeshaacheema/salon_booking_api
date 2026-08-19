# Task 9 — Testing and API Documentation

## Overview

This task covers automated testing and API documentation for the project. The requirements were:

- Unit tests for at least 2 core pieces of logic
- Integration tests for at least 5 API endpoints
- A happy path and at least one failure case for each integration endpoint
- API documentation
- A summary of what is and isn't covered by the tests

## Changes Made in This Task

### 1. Automated Testing Setup

The project uses Jest for testing and Supertest for sending HTTP requests to the Express application.

Run tests with:

npm test


### 2. Test Database Setup — `test/setup.js`

A separate test environment is used for automated tests.

Before testing:

```js
beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
});
```

After testing:

```js
afterAll(async () => {
    await sequelize.close();
});
```

Using `sync({ force: true })` gives the tests a clean database before each run.

### 3. Unit Tests

**Booking Validation — `test/bookingValidator.test.js`**
- Valid booking data → accepted
- Invalid booking data → rejected

**Authorization — `test/authorize.test.js`**
- User with the required role → allowed
- User without the required role → 403 Forbidden

These verify the core validation and authorization logic independently.

### 4. Integration Tests

Integration tests verify that routes, middleware, validation, authentication, database, and responses work together.

| Endpoint | Happy Path | Failure Path |
|---|---|---|
| `POST /auth/signup` | Valid signup → 201 | Invalid data → 400 |
| `POST /auth/login` | Valid credentials → 200 | Wrong password → 401 |
| `GET /services/:id/reviews` | Existing service → 200 | Missing service → 404 |
| `POST /bookings` | Authenticated request → 201 | No token → 401 |
| `GET /users/profile` | Authenticated user → 200 | No token → 401 |

### 5. Final Test Results

Test Suites: 3 passed, 3 total
Tests: 15 passed, 15 total
Snapshots: 0 total


**Result:** 15/15 tests passed.

## What Is Covered

**Unit Tests**
- Booking validation
- Role-based authorization

**Integration Tests**
- User signup
- User login
- JWT authentication
- Service review retrieval
- Booking creation
- User profile retrieval
- Authentication failure
- Validation failure
- Invalid credentials
- Missing resources

## What Is Not Covered

The following are currently outside the automated test suite:

- `PUT /bookings/:id`
- `DELETE /bookings/:id`
- `POST /services/:id/reviews`
- `POST /users/profile-picture`
- Cloudinary upload/failure scenarios
- Every possible filtering, sorting, and pagination combination
- All possible database failure scenarios

These features may have been tested manually, but they are not included in the current automated test coverage.

## API Documentation

### Authentication

POST /auth/signup
POST /auth/login


### Bookings

GET /bookings
POST /bookings
PUT /bookings/:id
DELETE /bookings/:id


### Reviews

POST /services/:id/reviews
GET /services/:id/reviews


### User

GET /users/profile
POST /users/profile-picture


### Health Check

GET /


Protected endpoints require:

Authorization: Bearer <JWT_TOKEN>


`DELETE /bookings/:id` additionally requires the admin role.

### Testing Coverage Note

The automated tests focus on the core functionality required for this task. The 15/15 passing result confirms that the tested scenarios are working correctly, but it does not represent complete automated coverage of the entire API. The uncovered areas are listed above so the scope of the test suite is clear.

## Files Changed in Task 9

**Added**
- `test/setup.js`
- `test/auth.test.js`
- `test/authorize.test.js`
- `test/bookingValidator.test.js`
- `.env.test`
- `screenshots/testing-all-tests-passed.png`

**Modified**
- `package.json`
- `README.md`

## Screenshot

The final test run:

![All tests passed](screenshots/testing-all-tests-passed.png)

```
Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
```


## Running the Tests

npm test


Expected result:

Test Suites: 3 passed, 3 total
Tests: 15 passed, 15 total


## Running the Project

npm install
node server.js


The API runs on `http://localhost:3000`.
