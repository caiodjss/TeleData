const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/connection");
const passport = require("passport"); // necessário para Google OAuth

// Inicialização do app
const app = express();
const port = 3001;

// Middlewares para tratar JSON e formulários
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializo o Passport (sem sessões, só JWT depois)
app.use(passport.initialize());

// Importando rotas
const home = require("./routes/home"); 
const profileRouter = require("./routes/profileRoutes"); 
const authRouter = require("./routes/authRoutes"); 
const registeruser = require("./routes/registeruser"); 
const userRoutes = require("./routes/userRoutes");

// Sincronizando banco
connection.sync({ alter: true })
  .then(() => console.log("Banco sincronizado"))
  .catch(console.error);

// Usando rotas
app.use("/", home);
app.use("/profile", profileRouter);
app.use("/auth", authRouter);
app.use("/", registeruser);
app.use("/", userRoutes);

// Log do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
