🧠 Como testar no Insomnia:
Função	Método	Rota	Body (JSON)	Header
Editar qualquer usuário (admin)	PUT	/users/admin/edit/:id	{ "full_name": "Novo Nome" }	Authorization: Bearer <token_admin>
Excluir qualquer usuário (admin)	DELETE	/users/admin/delete/:id	—	Authorization: Bearer <token_admin>
Editar conta (instrutor)	PUT	/users/instructor/edit	{ "biography": "Nova bio" }	Authorization: Bearer <token_instructor>
Excluir conta (instrutor)	DELETE	/users/instructor/delete	—	Authorization: Bearer <token_instructor>
Editar conta (estudante)	PUT	/users/student/edit	{ "profile_image_url": "link.jpg" }	Authorization: Bearer <token_student>
Excluir conta (estudante)	DELETE	/users/student/delete	—	Authorization: Bearer <token_student>