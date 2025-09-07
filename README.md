# TeleData

## Descrição

O TeleData é um **marketplace de educação online** que oferece **aprendizagem acessível e personalizada** para milhões de usuários.
O sistema disponibiliza **aulas assíncronas**, permitindo que os alunos estudem no seu próprio ritmo.

O projeto inclui funcionalidades para **alunos, instrutores e administradores**, com foco em cursos, seções, aulas, matrículas e avaliações.

## Tecnologias

* **Frontend:** HTML, CSS e JavaScript puro
* **Backend:** Node.js, Express, Sequelize
* **Banco de dados:** MySQL
* **Segurança:** bcrypt para hash de senhas, JWT para autenticação

## Funcionalidades Principais

* Cadastro e login de usuários (alunos e instrutores)
* Criação, categorização e publicação de cursos
* Matrículas e acompanhamento de progresso dos alunos
* Avaliações e feedback de cursos
* Geração de certificados digitais
* Rotas protegidas com autenticação JWT

## Estrutura do Banco de Dados

* **Users:** armazena informações de alunos e instrutores
* **Categories:** organiza cursos por hierarquia
* **Courses:** informações detalhadas de cada curso
* **Sections e Lectures:** organização de módulos e aulas
* **Enrollments:** matrícula dos alunos nos cursos
* **Reviews:** avaliações dos cursos pelos alunos
* **Payments:** rastreamento de transações
* **Certificates:** armazenamento de certificados emitidos

## Futuro

* Implementação de login social (Google, Facebook)
* Sistema de recomendações de cursos baseado em interesses do usuário
* Painel administrativo avançado

---
