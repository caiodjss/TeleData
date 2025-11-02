const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authenticateToken = require("../middleware/auth");

router.post("/create", authenticateToken, paymentController.createPayment);
router.post("/notify", paymentController.handleWebhook);

module.exports = router;
