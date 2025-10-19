const express = require("express");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const User = require("../database/models/user");

const router = express.Router();

/* 
===========================================
🔒 BLOCO DE ROTAS DE USUÁRIO
Objetivo: permitir que admin, instrutor e aluno
atualizem ou excluam suas contas (soft delete)
===========================================
*/

// 🧱 Função auxiliar: define quais campos podem ser editados
const editableFields = ["full_name", "email", "profile_image_url", "biography", "password_hash"];

/*
-----------------------------------------------------
1️⃣ ROTA DE ADMIN — pode editar ou excluir QUALQUER conta
-----------------------------------------------------
*/
router.put("/admin/edit/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    // Se for mudar a senha, criptografar
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 12);
      delete updates.password;
    }

    for (const key in updates) {
      if (editableFields.includes(key)) {
        user[key] = updates[key];
      }
    }

    await user.save();
    res.json({ message: "Usuário atualizado com sucesso (admin)", user });
  } catch (err) {
    console.error("Erro ao editar usuário (admin):", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Soft delete (admin)
router.delete("/admin/delete/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    user.deleted_at = new Date();
    await user.save();

    res.json({ message: "Usuário excluído (soft delete) com sucesso pelo admin" });
  } catch (err) {
    console.error("Erro ao excluir usuário (admin):", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});


/*
-----------------------------------------------------
2️⃣ ROTA DE PROFESSOR — pode editar/excluir apenas a própria conta
-----------------------------------------------------
*/
router.put("/instructor/edit", authenticateToken, authorizeRoles("instructor"), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    const updates = req.body;

    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 12);
      delete updates.password;
    }

    for (const key in updates) {
      if (editableFields.includes(key)) {
        user[key] = updates[key];
      }
    }

    await user.save();
    res.json({ message: "Conta atualizada com sucesso (instrutor)", user });
  } catch (err) {
    console.error("Erro ao editar conta (instrutor):", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Soft delete (instrutor)
router.delete("/instructor/delete", authenticateToken, authorizeRoles("instructor"), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    user.deleted_at = new Date();
    await user.save();

    res.json({ message: "Conta excluída (soft delete) com sucesso (instrutor)" });
  } catch (err) {
    console.error("Erro ao excluir conta (instrutor):", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});


/*
-----------------------------------------------------
3️⃣ ROTA DE ALUNO — pode editar/excluir apenas a própria conta
-----------------------------------------------------
*/
router.put("/student/edit", authenticateToken, authorizeRoles("student"), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    const updates = req.body;

    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 12);
      delete updates.password;
    }

    for (const key in updates) {
      if (editableFields.includes(key)) {
        user[key] = updates[key];
      }
    }

    await user.save();
    res.json({ message: "Conta atualizada com sucesso (estudante)", user });
  } catch (err) {
    console.error("Erro ao editar conta (estudante):", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Soft delete (estudante)
router.delete("/student/delete", authenticateToken, authorizeRoles("student"), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    user.deleted_at = new Date();
    await user.save();

    res.json({ message: "Conta excluída (soft delete) com sucesso (estudante)" });
  } catch (err) {
    console.error("Erro ao excluir conta (estudante):", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

module.exports = router;
