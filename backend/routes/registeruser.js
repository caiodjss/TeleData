const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../database/models/user");
const config = require("../config/config");

router.post("/registeruser", async (req, res) => {
  try {
    const { name, email, password, user_type } = req.body;

    if (!name || !email || !password || !user_type) {
      return res.status(400).send("Preencha todos os campos obrigatórios (nome, email, senha e tipo de usuário)");
    }

    // Valida o tipo de usuário
    if (!["student", "instructor"].includes(user_type)) {
      return res.status(400).json({ message: "Tipo de usuário inválido. Use 'student' ou 'instructor'." });
    }

    const hashed_password = await bcrypt.hash(password, 12);

    const activationToken = crypto.randomBytes(32).toString("hex");
    const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // expira em 24h

    const newUser = await User.create({
      full_name: name,
      email,
      password_hash: hashed_password,
      user_type,
      is_active: false,
      activation_token: activationToken,
      activation_token_expires: activationExpires
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    const activationLink = `http://localhost:3001/auth/activate/${activationToken}`;

    await transporter.sendMail({
      from: config.email.user,
      to: email,
      subject: "Ative sua conta TeleData",
      html: `
        <p>Olá ${name}, bem-vindo ao TeleData!</p>
        <p>Você se registrou como <strong>${user_type === "student" ? "Estudante" : "Professor"}</strong>.</p>
        <p>Clique no link abaixo para ativar sua conta:</p>
        <a href="${activationLink}">${activationLink}</a>
        <p>O link expira em 24 horas.</p>
      `,
    });

    console.log(`Usuário ${name} (${email}) cadastrado como ${user_type}. Token enviado para ativação.`);

    return res.status(201).json({ 
      message: "Usuário criado com sucesso! Verifique seu e-mail para ativar a conta." 
    });

  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    return res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

module.exports = router;