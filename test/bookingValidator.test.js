const { bookingSchema } = require("../validators/bookingValidator");

describe("Booking Validation", () => {

    test("should accept valid booking data", () => {

        const validBooking = {
            service: "Haircut",
            date: "2026-08-20",
            time: "14:00",
            name: "Ayesha",
            phone: "03001234567",
            notes: "Regular haircut"
        };

        const result = bookingSchema.safeParse(validBooking);

        expect(result.success).toBe(true);
    });


    test("should reject booking with invalid data", () => {

        const invalidBooking = {
            service: "",
            date: "invalid-date",
            time: "",
            name: "",
            phone: ""
        };

        const result = bookingSchema.safeParse(invalidBooking);

        expect(result.success).toBe(false);
    });

});