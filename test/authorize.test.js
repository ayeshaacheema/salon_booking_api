const authorizeRoles = require("../middleware/authorize");

describe("Role Authorization", () => {

    test("should allow a user with an allowed role", () => {
        const req = {
            user: {
                role: "admin"
            }
        };

        const res = {};
        const next = jest.fn();

        const middleware = authorizeRoles("admin");

        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });


    test("should reject a user with an unauthorized role", () => {
        const req = {
            user: {
                role: "user"
            }
        };

        const res = {};
        const next = jest.fn();

        const middleware = authorizeRoles("admin");

        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);

        const error = next.mock.calls[0][0];

        expect(error.statusCode).toBe(403);
        expect(error.message).toBe(
            "You do not have permission to perform this action."
        );
    });


    test("should reject a request without authentication", () => {
        const req = {};

        const res = {};
        const next = jest.fn();

        const middleware = authorizeRoles("admin");

        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);

        const error = next.mock.calls[0][0];

        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Authentication required.");
    });

});