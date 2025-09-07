const bcrypt = require("bcrypt");
const User = require("./models/User");
const sequelize = require("./config/database");

async function seedUser() {
  try {
    // Conecta ao banco
    await sequelize.authenticate();
    console.log("Conexão com o banco bem-sucedida!");

    // Dados do usuário
    const full_name = "Caio Teste";
    const email = "caio@teste.com";
    const password = "123456";

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco
    const user = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
    });

    console.log("Usuário criado com sucesso:", user.toJSON());
    process.exit(0); // encerra o script
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    process.exit(1);
  }
}

seedUser();
