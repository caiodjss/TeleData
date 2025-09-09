
# TeleData Frontend

## Descrição

Frontend da plataforma **TeleData**, desenvolvido em **HTML, CSS e JavaScript puro**.
Permite aos usuários interagir com o sistema, realizar login, cadastro, navegar pelos cursos e acessar funcionalidades básicas da plataforma.

## Tecnologias

* HTML
* CSS
* JavaScript

## Estrutura de Páginas

* **index.html** → Página inicial da plataforma
* **login.html** → Tela de login de usuários
* **cadastro.html** → Tela de cadastro de novos usuários
* **planos.html** → Página de planos e assinaturas
* **dashboard.html** → Painel de usuário (requer login)
* **recuperar-senha.html** → Tela de recuperação de senha

## Funcionalidades

* Navegação entre páginas e menus responsivos
* Formulários de login e cadastro com validação básica
* Armazenamento de token JWT no `localStorage` após login
* Botões de login social (Google e Facebook) em desenvolvimento
* Redirecionamento automático de usuários logados
* Feedback visual para ações (mensagens de erro ou sucesso)

## Futuro

* Integração completa com API backend
* Implementação de login social (OAuth)
* Dashboard interativo com progresso do usuário