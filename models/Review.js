const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Review = sequelize.define("Review", {
    serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Review;