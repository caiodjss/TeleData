# TeleData - Backend de Autenticação

Este projeto corresponde ao backend do sistema **TeleData**, focado nas funcionalidades de autenticação e gerenciamento de usuários. Ele foi desenvolvido em **Node.js** com **Express**, utilizando **MySQL** como banco de dados e **Sequelize** como ORM.

O backend implementa fluxos completos de login, autenticação de dois fatores (2FA), recuperação de senha, sessão prolongada via refresh token e ativação de conta por e-mail.

## Estrutura do backend

* `authRoutes.js`: rotas de login, 2FA, refresh token, recuperação de senha e ativação de conta.
* `registeruser.js`: rota de cadastro de usuários.
* `auth.js`: middleware para validação de tokens JWT.

## Fluxo de uma Requisição

* Uma requisição chega ao `server.js`.
* O Express roteia para o arquivo correto em `routes/` (ex.: `/auth/login` → `authRoutes.js` ou `/registeruser` → `registeruser.js`).
* Se a rota for protegida, o middleware `auth.js` é executado para validar o token JWT.
* O controlador (em `authRoutes.js` ou `registeruser.js`) processa a lógica da requisição:

  * Interage com o modelo `user.js` para operações no banco de dados.
  * Gera tokens JWT ou refresh token, códigos de 2FA, ou envia e-mails de ativação/recuperação conforme necessário.
* A resposta é enviada de volta ao cliente com status apropriado e, se aplicável, dados como token JWT, refresh token, ou links de ativação/redefinição de senha.


---

## Tecnologias utilizadas

* Node.js
* Express
* Sequelize
* MySQL
* bcrypt (hash de senhas)
* jsonwebtoken (JWT)
* speakeasy (2FA TOTP)
* nodemailer (envio de e-mails)
* crypto (geração de tokens únicos)

---

## Funcionalidades implementadas

### Cadastro de Usuário

* Criação de usuário com e-mail, senha e nome.
* Senha armazenada de forma segura utilizando bcrypt.
* Geração de token de ativação de conta enviado por e-mail.
* Usuário só pode logar após ativar a conta.

### Login

* Validação de e-mail e senha.
* Integração com autenticação de dois fatores (2FA) via TOTP.
* Suporte à opção "Lembrar-me" com refresh token para sessões prolongadas.

### Autenticação de Dois Fatores (2FA)

* Ativação de 2FA com QR Code gerado pelo backend.
* Verificação do código gerado no app autenticador.
* Geração de token JWT somente após a validação do 2FA.

### Recuperação de Senha

* Solicitação de redefinição de senha via e-mail.
* Geração de token único e temporário para reset de senha.
* Atualização segura da senha com hash e invalidação do token.

### Sessão prolongada com Refresh Token

* Geração de refresh token ao marcar a opção "Lembrar-me".
* Refresh token armazenado no banco e utilizado para renovar o access token.
* Permite ao usuário continuar logado sem precisar inserir credenciais novamente.

### Ativação de Conta por E-mail

* Envio de e-mail de ativação com token único no momento do cadastro.
* Validação do token pelo backend para ativar a conta.
* Impede login de usuários não ativados.

---

## Como testar

1. Instale dependências:

```
npm install
```

2. Configure variáveis de ambiente no arquivo `.env` (JWT\_SECRET, JWT\_REFRESH\_SECRET, credenciais de e-mail, etc.).

3. Inicie o servidor:

```
npm run dev
```

4. Utilize ferramentas como **Insomnia** ou **Postman** para testar as rotas:

* `POST /registeruser` → criar usuário e gerar token de ativação.
* `GET /auth/activate/:token` → ativar a conta.
* `POST /auth/login` → login com opção de 2FA e "Lembrar-me".
* `POST /auth/enable-2fa` → ativar 2FA.
* `POST /auth/verify-2fa` → validar código 2FA e receber token JWT.
* `POST /auth/forgot-password` → solicitar link de redefinição de senha.
* `POST /auth/reset-password/:token` → redefinir senha.
* `POST /auth/refresh-token` → renovar access token usando refresh token.