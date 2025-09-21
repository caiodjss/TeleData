## Implementação do 2FA (TOTP)

Foi implementado um fluxo completo de Autenticação de Dois Fatores (2FA) usando o padrão TOTP (Google Authenticator) no backend.

**1. Modelo de Usuário (User.js):**
*   Foram adicionados dois novos campos à tabela `Users` no banco de dados:
    *   `two_factor_enabled`: Um campo booleano para armazenar se o usuário ativou o 2FA.
    *   `two_factor_secret`: Um campo string para armazenar de forma segura o segredo único utilizado para gerar os códigos.

**2. Rotas de Autenticação (authRoutes.js):**
O arquivo de rotas foi expandido com novas funcionalidades:
*   **Rota `POST /enable-2fa`:** Esta rota protegida por token JWT:
    *   Gera um segredo único para o usuário.
    *   Atualiza o banco de dados, definindo `two_factor_enabled` como `true` e salvando o segredo.
    *   Gera um QR Code (em formato de URL de dados base64) a partir desse segredo. Este QR Code é o que o usuário escaneia no app autenticador (ex: Google Authenticator) para vincular a conta.
    *   Retorna o QR Code e o segredo em texto puro (apenas para debug) para o cliente.
*   **Rota `POST /login` (Modificada):** A rota de login existente foi modificada para incorporar o fluxo de 2FA:
    *   Continua validando e-mail e senha normalmente.
    *   Se as credenciais estiverem corretas **e** o usuário tiver o 2FA ativado (`two_factor_enabled = true`), a rota **não** retorna mais o token JWT imediatamente. Em vez disso, retorna uma mensagem (`"2FA_REQUIRED"`) e o `user_id`, indicando que uma segunda etapa de autenticação é necessária.
    *   Se o 2FA não estiver ativado, o comportamento permanece o mesmo, retornando o token JWT diretamente.
*   **Nova Rota `POST /verify-2fa`:** Esta rota é a segunda etapa do login:
    *   Recebe o `user_id` (obtido na resposta do login) e o `token` (código de 6 dígitos digitado pelo usuário a partir do app autenticador).
    *   Recupera o segredo do usuário no banco de dados.
    *   Utiliza a biblioteca speakeasy para verificar se o código fornecido é válido e está dentro da janela de tempo esperada, comparando-o com o código gerado pelo segredo armazenado.
    *   Se a verificação for bem-sucedida, então gera e retorna o token JWT final, concedendo acesso ao usuário.
    *   Se falhar, retorna um erro.

#### Fluxo de Teste no Insomnia

Para testar a implementação, o fluxo a ser seguido no Insomnia é:

1.  **Cadastrar um usuário** (`POST /registeruser`).
2.  **Fazer login** (`POST /auth/login`). Se for o primeiro login, receberá o token JWT.
3.  **Ativar o 2FA** (`POST /auth/enable-2fa`), usando o token JWT recebido no passo anterior no Header `Authorization: Bearer <token>`. Esta chamada retornará um QR Code.
4.  **Configurar o App Autenticador** escaneando o QR Code retornado.
5.  **Fazer login novamente** (`POST /auth/login`). Agora, como o 2FA está ativo, a resposta será `"2FA_REQUIRED"` junto com o `user_id`.
6.  **Verificar o Código 2FA** (`POST /auth/verify-2fa`), enviando o `user_id` e o `token` de 6 dígitos gerado pelo app autenticador. Se correto, esta chamada retornará o token JWT final que deve ser usado para acessar rotas protegidas.

---

## Implementação da recuperação de senha (gmail pessoal)

Foi implementado um fluxo para recuperação de senha utilizando o email cadastrado pelo usuário. 
No momento estamos utilizando o email pessoal do Dev

#### **1. Modelo de Usuário (`User.js`)**

* Foram adicionados campos para recuperação de senha:

  * `reset_password_token`: Armazena o token temporário gerado para redefinição de senha.
  * `reset_password_expires`: Data de expiração do token, garantindo que o link de reset seja válido apenas por um período limitado.
* Esses campos permitem gerenciar de forma segura o fluxo de reset de senha sem interferir nos dados existentes do usuário.

#### **2. Rotas de Autenticação (`authRoutes.js`)**

Novas rotas e ajustes foram adicionados para suportar o fluxo de recuperação de senha:

* **Rota `POST /forgot-password`:**

  * Recebe o e-mail do usuário e verifica se está cadastrado.
  * Gera um token único e temporário (`reset_password_token`) com expiração de 1 hora (`reset_password_expires`).
  * Envia o link de recuperação para o e-mail do usuário (atualmente utilizando Gmail pessoal do desenvolvedor para teste).
  * Para testes locais, o link também é logado no console para não depender do envio de e-mail real.

* **Rota `POST /reset-password/:token`:**

  * Recebe o token e a nova senha do usuário.
  * Valida se o token existe e não expirou.
  * Atualiza a senha do usuário no banco (hash com bcrypt) e remove o token, garantindo que ele não possa ser reutilizado.
  * Retorna mensagem de sucesso ao usuário.


#### **3. Configuração de E-mail**

* O backend agora utiliza o Gmail para envio de e-mails de recuperação de senha.
* Para permitir o envio, foi configurada a senha de app do Gmail, garantindo que o Nodemailer consiga autenticar e enviar os e-mails sem bloqueios do servidor SMTP.
* O fluxo de envio de e-mail inclui medidas de segurança, como link temporário e expiração de token.

### **Fluxo de Teste no Insomnia / Postman**

Para testar a recuperação de senha usando o Gmail pessoal (ou link logado no console), siga os passos abaixo:


#### 1. Solicitar recuperação de senha

Rota:

```
POST /auth/forgot-password
```

Body (JSON):

```json
{
  "email": "usuario@example.com"
}
```

**O que acontece:**

* O backend gera um token único (`reset_password_token`) com expiração de 1 hora.
* Um link de recuperação é enviado para o e-mail cadastrado.
* Para testes locais, o link também é logado no console, ex.:

```
http://localhost:3001/auth/reset-password/<TOKEN>
```

---

#### **2. Redefinir a senha**

**Rota:**

```
POST /auth/reset-password/:token
```

**Body (JSON):**

```json
{
  "newPassword": "novaSenha123"
}
```

**O que acontece:**

* O backend verifica se o token é válido e não expirou.
* Se válido, a senha do usuário é atualizada e o token é removido do banco.
* Retorna mensagem de sucesso:

```json
{ "message": "Senha redefinida com sucesso" }
```

---

#### **3. Testar login com nova senha**

**Rota:**

```
POST /auth/login
```

**Body (JSON):**

```json
{
  "email": "usuario@example.com",
  "password": "novaSenha123"
}
```

**O que acontece:**

* Se a senha estiver correta, retorna o **token JWT** para acessar rotas protegidas.
* Se o 2FA estiver ativado, segue o fluxo de verificação de token 2FA como descrito anteriormente.


Perfeito! Agora vou continuar o README com a **opção “Lembrar-me” e refresh token**, mantendo o mesmo estilo e incluindo o fluxo de teste no Insomnia:

---

## Implementação da opção “Lembrar-me” (Refresh Token)

Foi implementada uma opção de **sessão prolongada**, permitindo que o usuário permaneça logado por mais tempo sem precisar autenticar novamente.

### **1. Modelo de Usuário (`User.js`)**

* Adicionado o campo `refresh_token`:

```js
refresh_token: {
  type: DataTypes.STRING(512),
  allowNull: true,
}
```

* Este campo armazena o token de atualização gerado quando o usuário marca “Lembrar-me”.
* Garante que a sessão possa ser renovada de forma segura.

---

### **2. Ajustes na rota de login (`POST /auth/login`)**

* Se o usuário marcar `rememberMe: true`:

  1. É gerado um **refresh token** com expiração maior (ex.: 7 dias).
  2. O token é salvo no banco no campo `refresh_token`.
  3. O refresh token também pode ser enviado no cookie HttpOnly e Secure (opcional).
  4. O **access token** padrão continua sendo gerado com expiração curta (ex.: 1 hora).

* Exemplo de resposta do login:

```json
{
  "message": "Login realizado com sucesso",
  "token": "<ACCESS_TOKEN>",
  "refreshToken": "<REFRESH_TOKEN>"
}
```

---

### **3. Rota para renovar o token (`POST /auth/refresh-token`)**

* Recebe o `refreshToken` no corpo da requisição.
* Valida se o token é válido e corresponde ao usuário no banco.
* Se válido, gera um **novo access token**.
* Retorna o novo access token no corpo da resposta.

---

### **Fluxo de Teste no Insomnia / Postman**

#### **1. Login com “Lembrar-me”**

**Rota:**

```
POST /auth/login
```

**Body (JSON):**

```json
{
  "email": "usuario@example.com",
  "password": "senhaDoUsuario",
  "rememberMe": true
}
```

**O que acontece:**

* Retorna `token` (access token) e `refreshToken`.
* O access token é usado para acessar rotas protegidas.
* O refresh token é usado para renovar a sessão sem precisar do login novamente.

---

#### **2. Renovar sessão com refresh token**

**Rota:**

```
POST /auth/refresh-token
```

**Body (JSON):**

```json
{
  "refreshToken": "<REFRESH_TOKEN_RECEBIDO>"
}
```

**O que acontece:**

* Se o token for válido, retorna um **novo access token**:

```json
{
  "token": "<NOVO_ACCESS_TOKEN>"
}
```

* Este novo token pode ser usado para acessar rotas protegidas normalmente.

#### **3. Testar token expirado**

* Tente acessar uma rota protegida com o **access token expirado** → deverá falhar (401 Unauthorized).
* Use o **refresh token** para obter um novo access token e testar novamente → deve funcionar.

## Implementação da ativação de conta por e-mail

Foi implementado um fluxo de ativação de conta utilizando e-mail, garantindo que apenas usuários com e-mail válido possam acessar o sistema.

### 1. Modelo de Usuário (`User.js`)

* Adicionados campos para ativação de conta:

```js
is_active: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
activation_token: {
  type: DataTypes.STRING(255),
  allowNull: true,
},
activation_token_expires: {
  type: DataTypes.DATE,
  allowNull: true,
}
```

* `is_active` indica se a conta está ativada.
* `activation_token` armazena o token enviado por e-mail.
* `activation_token_expires` define o prazo de validade do token.

---

### 2. Ajustes na rota de cadastro (`POST /registeruser`)

* Ao criar um novo usuário:

  1. Gera-se um token único para ativação (`activation_token`) e define-se a expiração (ex.: 24h).
  2. Salva o usuário com `is_active` como `false`.
  3. Envia e-mail contendo link de ativação com o token:

```text
http://localhost:3001/auth/activate/<TOKEN>
```

* O link deve ser acessado pelo usuário para ativar a conta.

---

### 3. Rota de ativação de conta (`GET /auth/activate/:token`)

* Recebe o token como parâmetro.
* Valida se o token existe e não expirou.
* Se válido:

  * Define `is_active = true`.
  * Limpa o `activation_token` e `activation_token_expires`.
* Retorna mensagem de sucesso ou erro se o token for inválido ou expirado.

---

### Fluxo de Teste no Insomnia / Postman

#### 1. Cadastro de usuário

**Rota:**

```
POST /registeruser
```

**Body (JSON):**

```json
{
  "name": "Usuario Teste",
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**O que acontece:**

* Usuário é criado com `is_active = false`.
* Token de ativação é gerado e salvo no banco.
* Link de ativação é enviado por e-mail ou exibido no console para testes locais:

```
http://localhost:3001/auth/activate/<TOKEN>
```

---

#### 2. Ativação da conta

**Rota:**

```
GET /auth/activate/<TOKEN>
```

**O que acontece:**

* Backend valida o token.
* Se válido, `is_active` é atualizado para `true`.
* Usuário pode agora realizar login normalmente.
* Se o token estiver expirado ou inválido, retorna mensagem de erro.