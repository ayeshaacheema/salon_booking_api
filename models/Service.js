const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Service = sequelize.define('Service', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

module.exports = Service;