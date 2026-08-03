# Week 3 - Input Validation & Error Handling

Up to this point the API would happily accept whatever got sent to it. This update is about not trusting that anymore - validating incoming data, catching failures before they turn into crashes, and making sure every response (success or error) comes back in the same shape.

## What changed

- Request validation using Zod
- One centralized error handling middleware instead of scattered try/catch blocks
- A single, consistent response format across every endpoint
- Validation added to the auth and booking routes
- Malformed JSON no longer crashes the server, it just returns a proper error
- Bad IDs, empty bodies, and wrong input formats all get handled instead of ignored

## Response format

Every response looks the same now, whether it worked or not.

**Success**
```json
{
  "success": true,
  "data": { "..." },
  "error": null
}
```

**Error**
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Description of the error"
  }
}
```

Doesn't matter which endpoint you hit or what went wrong - the shape is always the same. Makes it a lot easier to handle on the frontend without special-casing every route.

## Validation

Added to any endpoint that takes user input. Covers:

- required fields actually being present
- correct data types
- phone number format (11 digits)
- empty strings
- password requirements
- the request body actually having the shape it's supposed to

All of it runs through Zod schemas before the request even reaches the controller logic, so a bad request gets rejected early instead of failing halfway through a database call.

## Examples

### Empty request body

```
POST /bookings
{}
```

`400 Bad Request`
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Required booking fields are missing"
  }
}
```

### Invalid phone number

```
POST /bookings
{
  "service": "Hair Cut",
  "date": "2026-08-15",
  "time": "14:00",
  "name": "Ayesha",
  "phone": "123"
}
```

`400 Bad Request`
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Phone number must contain exactly 11 digits"
  }
}
```

### Duplicate email on signup

```
POST /auth/signup
{
  "email": "ayesha@test.com",
  "password": "mypassword123"
}
```
(email already exists)

`400 Bad Request`
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Email already in use"
  }
}
```

### Wrong login credentials

```
POST /auth/login
{
  "email": "ayesha@test.com",
  "password": "wrongpassword"
}
```

`401 Unauthorized`
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Invalid email or password"
  }
}
```

### Malformed JSON

```
POST /bookings
{
  "service": "Hair Cut",
  "date": "2026-08-15",
```
(request cuts off, invalid JSON)

`400 Bad Request`
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Malformed JSON in request body"
  }
}
```

## Other edge cases covered

- invalid booking or service IDs
- missing auth tokens
- invalid or tampered JWTs
- hitting a route that doesn't exist
- empty update requests
- update requests with the wrong fields

None of these crash the server anymore - they all come back as a proper error response.

## Testing

All of this was tested manually in Postman. Screenshots below.

### Empty request body validation
POST `/bookings`

[![Empty booking body validation](screenshots/booking_validation_empty_body.png)](screenshots/booking_validation_empty_body.png)

### Invalid phone number validation
POST `/bookings`

[![Invalid phone validation](screenshots/booking_validation_invalid_phone.png)](screenshots/booking_validation_invalid_phone.png)

### Update booking with empty body
PUT `/bookings/:id`

[![Update booking empty body](screenshots/booking_update_empty_body.png)](screenshots/booking_update_empty_body.png)

### Update booking with invalid phone number
PUT `/bookings/:id`

[![Update booking invalid phone](screenshots/booking_update_invalid_phone.png)](screenshots/booking_update_invalid_phone.png)

### Malformed JSON handling
POST `/bookings`

[![Malformed JSON error](screenshots/malformed_json.png)](screenshots/malformed_json.png)

### Invalid route handling
Hitting a route that doesn't exist:

[![Invalid route error](screenshots/invalid_route.png)](screenshots/invalid_route.png)

### Auth error handling
Request with an invalid token:

[![Invalid token error](screenshots/auth_invalid_token.png)](screenshots/auth_invalid_token.png)

## Author

Ayesha Cheema
github.com/ayeshaacheema
