# TeleData Backend

## Descrição

Backend da plataforma TeleData, desenvolvido em **Node.js**, **Express**, **Sequelize** e **bcrypt**.
Permite cadastro de usuários, login com autenticação via **JWT** e proteção de rotas privadas.

## Tecnologias

* Node.js
* Express
* Sequelize (MySQL)
* bcrypt
* JSON Web Token (JWT)
* dotenv

## Scripts

* `node index.js` → inicia o servidor
* `node seedUser.js` → insere usuário de teste no banco

## Rotas

### Públicas

* **POST /login**

  * Body: `{ "email": "email@teste.com", "password": "senha" }`
  * Retorna token JWT e dados do usuário

### Privadas

* **GET /profile**

  * Header: `Authorization: Bearer <TOKEN>`
  * Retorna os dados do usuário autenticado

## Testes

* Pode ser testado via **Insomnia**, **Postman** ou **HTML/JS frontend**.

## Futuro

* Implementar login com Google usando OAuth 2.0.

---