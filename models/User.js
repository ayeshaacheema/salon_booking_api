const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const User = sequelize.define("User", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
    },
});

module.exports = User;