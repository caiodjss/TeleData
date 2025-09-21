const express = require("express"); 
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const connection = require("./database/connection");

// Importando rotas
const home = require("./routes/home"); // rota principal
const profileRouter = require("./routes/profileRoutes"); // rota privada
const authRouter = require("./routes/authRoutes"); // rota de login
const registeruser = require ("./routes/registeruser"); // rota de cadastro

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sincronizando banco
connection.sync({ alter: true })
  .then(() => console.log("Banco sincronizado"))
  .catch(console.error);

// Usando rotas
app.use("/", home); // rota principal
app.use("/profile", profileRouter); // rota privada
app.use("/auth", authRouter); // rota de login
app.use("/", registeruser); // rota de cadastro

// Log do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});