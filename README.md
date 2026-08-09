# Salon Booking API — Role-Based Access Control (RBAC)

A REST API for a salon booking system built with Node.js, Express, PostgreSQL, Sequelize, JWT authentication, and Zod validation.

This task adds role-based access control so different users can have different permissions.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- JWT
- bcrypt
- Zod
- Cloudinary
- Multer

## Task 8 — Roles and Permissions

The API now supports two user roles:

- `user`
- `admin`

New users are assigned the `user` role by default.

The role is stored in the database and included in the JWT after login.

## User Roles

The `User` model now contains a role field:

```js
role: {
    type: DataTypes.ENUM("user", "admin"),
    allowNull: false,
    defaultValue: "user"
}
````

This prevents users from having an empty role and automatically assigns new accounts the `user` role.

Users cannot assign themselves the `admin` role during signup.

## Authentication

When a user logs in, their role is included in the JWT.

Example:

```json
{
    "userId": 1,
    "email": "admin@example.com",
    "role": "admin"
}
```

The authentication middleware verifies the token and stores the decoded information in `req.user`.

## Role Authorization Middleware

A new middleware was added:

```text
middleware/authorize.js
```

It provides a reusable `authorizeRoles()` function.

Example:

```js
authorizeRoles("admin")
```

The middleware checks whether the authenticated user's role is allowed to perform the requested action.

If the user has the required role, the request continues.

If the user is authenticated but does not have the required role, the API returns:

```text
403 Forbidden
```

## Protected Endpoint

The following endpoint is restricted to administrators:

```http
DELETE /bookings/:id
```

The request passes through both authentication and authorization middleware:

```text
Request
   ↓
authenticateToken
   ↓
authorizeRoles("admin")
   ↓
Delete Booking
```

Only users with the `admin` role can delete bookings.

## 401 vs 403

The API distinguishes between authentication and authorization failures.

### 401 Unauthorized

Returned when the request does not contain a valid authentication token.

Example:

```json
{
    "message": "No token provided."
}
```

### 403 Forbidden

Returned when the user has successfully authenticated but does not have the required role.

Example:

```json
{
    "success": false,
    "data": null,
    "error": {
        "message": "You do not have permission to perform this action."
    }
}
```

## Testing

Three role and permission scenarios were tested.

### Test 1 — Admin User

An authenticated admin user attempted to delete a booking.

Result:

```text
200 OK
```

The booking was successfully deleted.

### Test 2 — Normal User

An authenticated normal user attempted to delete a booking.

Result:

```text
403 Forbidden
```

The booking was not deleted.

### Test 3 — No Authentication

A request was sent without a JWT token.

Result:

```text
401 Unauthorized
```

The request was rejected because no authentication token was provided.

## Test Users

Two accounts were used to test the role restrictions:

| Email                                           | Role  |
| ----------------------------------------------- | ----- |
| [ayesha@test.com](mailto:ayesha@test.com)       | admin |
| [testuser@gmail.com](mailto:testuser@gmail.com) | user  |

The admin role was assigned directly in the database for testing. Public signup does not allow users to choose their own role.

## Screenshots

### 1. Admin - Access Allowed

![Admin allowed](task-8-screenshots/admin-allowed.png)

The admin user was able to delete the booking successfully and received a `200 OK` response.

### 2. Normal User - Access Forbidden

![Normal user forbidden](task-8-screenshots/user-forbidden.png)

A valid normal user attempted the same admin-only action and received `403 Forbidden`.

### 3. No Authentication

![No token](task-8-screenshots/no-token.png)

A request without an authentication token received `401 Unauthorized`.

### 4. User Roles

![User roles](task-8-screenshots/user-roles.png)

The database contains separate admin and normal user roles.

### Database Roles

The database shows separate `admin` and `user` roles.

## Main API Endpoints

### Authentication

```text
POST /auth/signup
POST /auth/login
```

### Bookings

```text
GET    /bookings
POST   /bookings
PUT    /bookings/:id
DELETE /bookings/:id
```

### Reviews

```text
POST /services/:id/reviews
GET  /services/:id/reviews
```

### User

```text
GET  /users/profile
POST /users/profile-picture
```

### Role-Protected Endpoint

```text
DELETE /bookings/:id
```

Admin role required.

## Project Structure

```text
salon-booking-api/
│
├── config/
│   └── cloudinary.js
│
├── middleware/
│   ├── auth.js
│   ├── authorize.js
│   ├── errorHandler.js
│   ├── upload.js
│   └── validate.js
│
├── models/
│   ├── Booking.js
│   ├── Review.js
│   ├── Service.js
│   └── User.js
│
├── utils/
│   ├── AppError.js
│   ├── catchAsync.js
│   ├── cloudinaryUpload.js
│   └── response.js
│
├── validators/
│   ├── bookingValidator.js
│   ├── reviewValidator.js
│   └── userValidator.js
│
├── server.js
├── package.json
└── README.md
```

## Running the Project

Install dependencies:

```bash
npm install
```

Create a `.env` file with the required database, JWT, and Cloudinary configuration.

Start the development server:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:3000
```

## Result

Role-based access control has been added to the Salon Booking API.

The API now:

* Supports `user` and `admin` roles
* Assigns new users the `user` role by default
* Includes the user's role in the JWT
* Uses reusable authorization middleware
* Restricts admin-only actions
* Returns `403 Forbidden` for authenticated users without permission
* Returns `401 Unauthorized` for unauthenticated requests
* Has been tested with admin, normal user, and unauthenticated scenarios
**Don't merge it into `main` yet** unless your internship specifically asks you to. Keeping each task on its own branch is cleaner and gives you a clear record of your work.
