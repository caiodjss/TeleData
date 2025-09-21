const { DataTypes } = require("sequelize");
const sequelize = require("../connection"); // Importa a instância da conexão do meu banco.


const User = sequelize.define("User", {

    user_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    profile_headline: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    biography: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    profile_image_url: {
        type: DataTypes.STRING(2048),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },

    // 2FA - TOTP com Google Autenticator
    two_factor_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    two_factor_secret: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    // fim 2FA - TOTP com Google Autenticator

    // Resetar senha
    reset_password_token: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    reset_password_expires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // fim Resetar senha

    // Lembrar-me
    refresh_token: {
        type: DataTypes.STRING(512),
        allowNull: true
    },
    // fim Lembrar-me

    // Ativação de conta
     is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
        },
        activation_token: {
        type: DataTypes.STRING(255),
        allowNull: true
        },
        activation_token_expires: {
        type: DataTypes.DATE,
        allowNull: true
        }
    // fim Ativação de conta

},
    {
    tableName: "Users",
    timestamps: false
    })


module.exports = User;