'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const basename = path.basename(__filename)
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (process.env.USE_ENV_VARIABLE) {
  const connectionString = process.env[process.env.USE_ENV_VARIABLE];
  sequelize = new Sequelize(connectionString, {
    dialect: 'mysql', // or any other database dialect you are using
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false, // Required if using a MySQL database on Railway with SSL enabled
      },
    },
  });
} else {
  const config = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql', // or any other database dialect you are using
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false, // Required if using a MySQL database on Railway with SSL enabled
      },
    },
  };
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
