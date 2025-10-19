require("dotenv").config();

module.exports = {
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "usuarios",
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
  },
  jwtSecret: process.env.JWT_SECRET || "producao",
  email: {
    user: process.env.EMAIL_USER || "caio.moomo@gmail.com",
    pass: process.env.EMAIL_PASS || "tbgc kcud tpjo wqeq",
  },
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "producao_refresh",
};