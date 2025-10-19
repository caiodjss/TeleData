const jwt = require("jsonwebtoken");
const config = require("../config/config"); // Importa o arquivo de configuração

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token não fornecido" });

    jwt.verify(token, config.jwtSecret, (err, user) => { // Usa a variável do config
        if (err) {
            console.log("Erro ao verificar token:", err);
            return res.status(403).json({ message: "Token inválido" });
        }

        req.user = user;
        console.log("Usuário autenticado:", user);
        next();
    });
}

module.exports = authenticateToken;