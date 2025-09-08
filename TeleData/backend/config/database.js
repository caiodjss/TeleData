const { Sequelize } = require("sequelize");

// Para ler as variáveis do .env
require("dotenv").config();

// Instância do Sequelize usando as variáveis de ambiente
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false, // Desativa logs SQL
  }
);

module.exports = sequelize;
