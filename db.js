require("dotenv").config({
    path: process.env.NODE_ENV === "test"
        ? ".env.test"
        : ".env"
});

const { Sequelize } = require("sequelize");
const logger = require("./utils/logger");

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,

        ...(isProduction && {
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        })
    }
);

async function connectDB() {
    try {
        await sequelize.authenticate();
        logger.info("Database connected");
    } catch (err) {
        logger.fatal(
            { err },
            "Unable to connect to the database"
        );
        process.exit(1);
    }
}

module.exports = {
    sequelize,
    connectDB
};