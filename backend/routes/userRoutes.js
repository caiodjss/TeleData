const express = require("express");
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const userController = require("../controllers/userController");

const router = express.Router();

// ADMIN
// Adicionar novo admin
router.post( "/admin/add", authenticateToken, authorizeRoles("admin"), userController.adminAddUser);

// Editar admin por email
router.put("/admin/edit",authenticateToken,authorizeRoles("admin"),userController.adminEditUser);

// Deletar admin por email
router.delete("/admin/delete/:email",authenticateToken,authorizeRoles("admin"),userController.adminDeleteUser);

// Listar admins (com filtros: nível de acesso, status)
router.get("/admin/list",authenticateToken,authorizeRoles("admin"),userController.adminListUsers);

// INSTRUCTOR
// Adicionar docente
router.post("/instructor/add",authenticateToken,authorizeRoles("admin"),userController.instructorAddUser);

// Editar docente (instrutor pode editar a própria conta, admin pode editar qualquer)
router.put("/instructor/edit",authenticateToken,authorizeRoles("admin", "instructor"),userController.instructorEditAccount);

// Deletar docente (instrutor pode deletar a própria conta, admin pode deletar qualquer)
router.delete("/instructor/delete/:email",authenticateToken,authorizeRoles("admin", "instructor"),userController.instructorDeleteAccount);

// Listar docentes
router.get("/instructor/list",authenticateToken,authorizeRoles("admin"),userController.instructorListUsers);

// STUDENT
// Adicionar estudante
router.post("/student/add",authenticateToken,authorizeRoles("admin"),userController.studentAddUser);

// Editar estudante (aluno pode editar a própria conta, admin pode editar qualquer)
router.put("/student/edit",authenticateToken,authorizeRoles("admin", "student"),userController.studentEditAccount);

// Deletar estudante (aluno pode deletar a própria conta, admin pode deletar qualquer)
router.delete("/student/delete/:email",authenticateToken,authorizeRoles("admin", "student"),userController.studentDeleteAccount);

// Listar estudantes
router.get("/student/list",authenticateToken,authorizeRoles("admin"),userController.studentListUsers);

module.exports = router;