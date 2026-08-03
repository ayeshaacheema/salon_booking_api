const { sequelize, connectDB } = require("./db");
const Booking = require("./models/Booking");
const Service = require("./models/Service");

async function seed() {
    await connectDB();
    await sequelize.sync();

    const services = [
        "Haircut",
        "Facial",
        "Pedicure",
        "Manicure",
        "Massage"
    ];

    for (let i = 1; i <= 40; i++) {

        const randomService =
            services[Math.floor(Math.random() * services.length)];

        const [service] = await Service.findOrCreate({
            where: {
                name: randomService
            }
        });

        await Booking.create({
            serviceId: service.id,
            date: `2026-08-${String((i % 28) + 1).padStart(2, "0")}`,
            time: "3:00 PM",
            name: `Customer ${i}`,
            phone: `03001234${String(i).padStart(3, "0")}`,
            notes: `Sample booking ${i}`
        });
    }

    console.log("✅ 40 bookings inserted!");

    process.exit();
}

seed();