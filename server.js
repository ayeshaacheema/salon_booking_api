require("dotenv").config();

const { sequelize, connectDB } = require("./db");
const app = require("./app");

const PORT = 3000;

connectDB().then(async () => {
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});