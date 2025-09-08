const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const sequelize = require("./config/database");
require("dotenv").config();

const app = express();

// Middleware para receber JSON do body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = user; // adiciona dados do JWT à requisição
    next();
  });
}

// Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// Rota de login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email e senha são obrigatórios");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).send("Credenciais inválidas");

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return res.status(401).send("Credenciais inválidas");

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login realizado com sucesso!",
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro interno no servidor");
  }
});

// Rota privada
app.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Acesso à rota privada permitido",
    user: req.user,
  });
});

// Testa conexão com o banco
sequelize.authenticate()
  .then(() => console.log("Conexão com o banco bem-sucedida!"))
  .catch(err => console.error("Erro ao conectar ao banco:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
