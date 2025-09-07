// Importa Sequelize
const { Sequelize } = require("sequelize");

// Importa dotenv para ler as variáveis do .env
require("dotenv").config();

// Cria a instância do Sequelize usando as variáveis de ambiente
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nome do banco
  process.env.DB_USER,      // Usuário
  process.env.DB_PASSWORD,  // Senha
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false, // opcional: desativa logs SQL
  }
);

// Exporta a instância para ser usada em outros arquivos
module.exports = sequelize;