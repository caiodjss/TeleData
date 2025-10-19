const express = require("express");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Rota privada
router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Acesso à rota privada permitido",
    user: req.user,
  });
});

module.exports = router;