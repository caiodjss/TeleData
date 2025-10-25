const express = require("express");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const User = require("../database/models/user");
const authenticateToken = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const config = require("../config/config");
const { Op } = require("sequelize");

const passport = require("passport");
require("../middleware/passport");

const router = express.Router();


// Ativar conta
router.get("/activate/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        activation_token: token,
        activation_token_expires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    user.is_active = true;
    user.activation_token = null;
    user.activation_token_expires = null;
    await user.save();

    res.json({ message: "Conta ativada com sucesso!" });
  } catch (err) {
    console.error("Erro ao ativar conta:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});


// Login normal (email/senha + JWT)
router.post("/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email e senha são obrigatórios");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).send("Credenciais inválidas");

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return res.status(401).send("Credenciais inválidas");

    if (user.two_factor_enabled) {
      return res.status(200).json({
        message: "2FA_REQUIRED",
        user_id: user.user_id,
      });
    }

    const accessToken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24" }
    );

    let refreshToken;
    if (rememberMe) {
      refreshToken = jwt.sign(
        { user_id: user.user_id, email: user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );
      user.refresh_token = refreshToken;
      await user.save();
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      token: accessToken,
      refreshToken: refreshToken || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro interno no servidor");
  }
});


// PROCEDIMENTO: Refresh token
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token é obrigatório" });

    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.status(401).json({ message: "Refresh token inválido" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Refresh token expirado ou inválido" });

      const newAccessToken = jwt.sign(
        { user_id: user.user_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token: newAccessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});


// Ativar 2FA
router.post("/enable-2fa", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    const secret = speakeasy.generateSecret({ name: `TeleData (${user.email})` });

    user.two_factor_secret = secret.base32;
    user.two_factor_enabled = true;
    await user.save();

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({
      message: "2FA ativado com sucesso",
      qrCodeUrl,
      secret: secret.base32, // debug
    });
  } catch (err) {
    console.error("Erro ao ativar 2FA:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});


// PROCEDIMENTO: Verificar 2FA
router.post("/verify-2fa", async (req, res) => {
  try {
    const { user_id, token } = req.body;
    if (!user_id || !token) return res.status(400).json({ message: "user_id e token são obrigatórios" });

    const user = await User.findByPk(user_id);
    if (!user || !user.two_factor_secret) {
      return res.status(404).json({ message: "Usuário não encontrado ou 2FA não configurado" });
    }

    const isVerified = speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: "base32",
      token,
    });

    if (!isVerified) return res.status(401).json({ message: "Código inválido ou expirado" });

    const jwtToken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "2FA validado com sucesso", token: jwtToken });
  } catch (err) {
    console.error("Erro na verificação do 2FA:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});


// PROCEDIMENTO: Esqueci a senha
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email é obrigatório" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1h

    user.reset_password_token = token;
    user.reset_password_expires = expires;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    const resetLink = `http://localhost:3001/auth/reset-password/${token}`;
    console.log("Link de recuperação:", resetLink);

    await transporter.sendMail({
      from: config.email.user,
      to: email,
      subject: "Recuperação de senha",
      html: `<p>Você solicitou redefinição de senha. Clique no link abaixo:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>O link expira em 1 hora.</p>`,
    });

    res.json({ message: "Link de recuperação enviado para seu e-mail" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao enviar e-mail" });
  }
});


// Resetar senha
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) return res.status(400).json({ message: "Nova senha é obrigatória" });

    const user = await User.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [Op.gt]: new Date() },
      },
    });

    if (!user) return res.status(400).json({ message: "Token inválido ou expirado" });

    user.password_hash = await bcrypt.hash(newPassword, 10);
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// PROCEDIMENTO: Login com Google (via JWT)
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const jwtToken = jwt.sign(
      { user_id: req.user.user_id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login com Google realizado com sucesso!",
      token: jwtToken
    });
  }
);

module.exports = router;