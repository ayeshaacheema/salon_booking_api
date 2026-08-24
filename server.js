require("dotenv").config();

const { sequelize, connectDB } = require("./db");
const app = require("./app");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 3000;

process.on("uncaughtException", (error) => {
    logger.fatal({ err: error }, "Uncaught exception");
    process.exit(1);
});

process.on("unhandledRejection", (error) => {
    logger.fatal({ err: error }, "Unhandled rejection");
    process.exit(1);
});

let server;

async function startServer() {
    try {
        await connectDB();

        // Only auto-sync in local dev; production relies on migrations
        if (process.env.NODE_ENV !== "production") {
            await sequelize.sync({ alter: true });
        }

        server = app.listen(PORT, () => {
            logger.info({ port: PORT }, "Server started");
        });
    } catch (error) {
        logger.fatal({ err: error }, "Failed to start server");
        process.exit(1);
    }
}

async function shutdown(signal) {
    logger.info({ signal }, "Shutdown signal received");

    if (server) {
        server.close(async () => {
            await sequelize.close();
            logger.info("Server and DB connections closed");
            process.exit(0);
        });

        // Force exit if shutdown hangs
        setTimeout(() => process.exit(1), 10000).unref();
    } else {
        process.exit(0);
    }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();