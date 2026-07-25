Salon Booking API
A REST API for managing salon bookings, built with Node.js and Express. Started as a simple in-memory CRUD app and has since been upgraded to use PostgreSQL for storage and JWT-based authentication for protected routes.

Tech Stack
Node.js / Express
PostgreSQL + Sequelize
bcrypt for password hashing
jsonwebtoken for auth
Postman for testing
Project Structure
salon-booking-api/
├── models/
│   ├── Service.js
│   ├── Booking.js
│   └── User.js
├── middleware/
│   └── auth.js
├── db.js
├── server.js
├── .env
├── .env.example
├── postman/
├── screenshots/
└── README.md
Setup
Clone the repo
git clone https://github.com/ayeshaacheema/salon_booking_api.git
cd salon_booking_api
Install dependencies
npm install
Set up PostgreSQL - create a database:
CREATE DATABASE salon_booking_db;
Create a .env file in the root (there's an .env.example you can copy from):
DB_HOST=localhost
DB_PORT=5432
DB_NAME=salon_booking_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_random_secret
JWT_EXPIRES_IN=1h
You can generate a random secret with:

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Run it
node server.js
Tables get created automatically on startup (Sequelize handles this). If the DB connection fails for any reason the server logs the error and exits instead of hanging or crashing silently.

Database
Two related tables:

Services - id, name
Bookings - id, date, time, name, phone, notes, serviceId (fk -> Services.id)
A booking belongs to a service, a service can have many bookings.

Endpoints
Method	Route	Description	Needs token?
POST	/auth/signup	create a new user	no
POST	/auth/login	log in, get back a token	no
GET	/bookings	list all bookings	no
GET	/bookings/:id	get one booking	no
POST	/bookings	create a booking	yes
PUT	/bookings/:id	update a booking	no
DELETE	/bookings/:id	delete a booking	yes
Sample: create a booking
POST /bookings
{
  "service": "Haircut",
  "date": "2026-07-28",
  "time": "3:00 PM",
  "name": "Ayesha Cheema",
  "phone": "03001234567",
  "notes": "First time client"
}
Auth
Signup/login flow, no plaintext passwords stored anywhere (bcrypt hash only).

Signup

POST /auth/signup
{ "email": "you@example.com", "password": "yourpassword" }
Login - returns a JWT

POST /auth/login
{ "email": "you@example.com", "password": "yourpassword" }
response:

{ "message": "Login successful!", "token": "eyJhbGciOi..." }
To hit a protected route, add this header:

Authorization: Bearer <token>
POST /bookings and DELETE /bookings/:id require this. The rest don't.

Token expires based on JWT_EXPIRES_IN in .env (currently 1h).

Error responses
Case	Status	Message
wrong email/password	401	Invalid email or password.
no token sent	401	No token provided.
token expired	401	Token has expired. Please log in again.
bad/tampered token	403	Invalid token.
email already taken	400	Email already in use.
(login gives the same message whether the email doesn't exist or the password's wrong - on purpose, so you can't use it to figure out which emails are registered)

Testing
Tested manually in Postman - all CRUD routes, validation errors, and now the auth flow (signup, login, hitting protected routes with/without/with-bad tokens). Collection is in postman/, some screenshots in screenshots/.

Also tested that data survives a server restart, since it's actually in Postgres now instead of a JS array.

Author
Ayesha Cheema github.com/ayeshaacheema