const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Service = require('./Service');

const Booking = sequelize.define('Booking', {
  date: { type: DataTypes.STRING, allowNull: false },
  time: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.STRING, allowNull: true },
});

Booking.belongsTo(Service, { foreignKey: 'serviceId' });
Service.hasMany(Booking, { foreignKey: 'serviceId' });

module.exports = Booking;