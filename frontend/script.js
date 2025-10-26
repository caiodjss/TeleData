
let distributionChart, coursesChart;

function initCharts() {
    // Gráfico de Distribuição de Perfis (Pizza)
    const ctxDistribution = document.getElementById('distributionChart').getContext('2d');
    distributionChart = new Chart(ctxDistribution, {
        type: 'pie',
        data: {
            labels: ['Estudantes', 'Docentes', 'Administradores'],
            datasets: [{
                data: [1234, 89, 12],
                backgroundColor: [
                    '#3b82f6',
                    '#ef4444',
                    '#f59e0b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 13,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.parsed || 0;
                            let total = context.dataset.data.reduce((a, b) => a + b, 0);
                            let percentage = ((value / total) * 100).toFixed(1);
                            return label + ': ' + value + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });

    // Gráfico de Quantidade de Cursos (Barras)
    const ctxCourses = document.getElementById('coursesChart').getContext('2d');
    coursesChart = new Chart(ctxCourses, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
            datasets: [{
                label: 'Cursos adquiridos por estudantes',
                data: [15, 22, 18, 28, 24, 32, 26, 35, 30, 38],
                backgroundColor: '#3b82f6',
                borderRadius: 6,
                barThickness: 35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 40,
                    ticks: {
                        stepSize: 20,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: '#f1f5f9'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

window.addEventListener('load', initCharts);

function toggleSubmenu(event) {
    event.stopPropagation();
    const submenu = document.getElementById('users-submenu');
    const parentItem = event.currentTarget;
    
    submenu.classList.toggle('active');
    parentItem.classList.toggle('open');
}

function showSection(section, event) {
    if (event) {
        event.stopPropagation();
    }

    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('students-section').style.display = 'none';
    document.getElementById('teachers-section').style.display = 'none';
    document.getElementById('admins-section').style.display = 'none';
    document.getElementById('settings-section').style.display = 'none';
    document.getElementById('called-section').style.display = 'none';

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const navSubitems = document.querySelectorAll('.nav-subitem');
    navSubitems.forEach(item => item.classList.remove('active'));

    if (event && event.currentTarget.classList.contains('nav-subitem')) {
        event.currentTarget.classList.add('active');
    } else if (!event || !event.currentTarget.classList.contains('nav-subitem')) {
        if (event) {
            event.currentTarget.classList.add('active');
        }
    }

    const titles = {
        'dashboard': 'Dashboard Geral',
        'students': 'Gerenciar Estudantes',
        'teachers': 'Gerenciar Docentes',
        'admins': 'Gerenciar Administradores',
        'reports': 'Relatórios',
        'called': 'Chamados',
        'settings': 'Configurações do Sistema'
    };

    document.getElementById('page-title').textContent = titles[section];

    if (section === 'dashboard') {
        document.getElementById('dashboard-section').style.display = 'block';
        const dashboardItem = document.querySelector('.nav-item');
        dashboardItem.classList.add('active');
        setTimeout(() => {
            if (distributionChart) distributionChart.resize();
            if (coursesChart) coursesChart.resize();
        }, 100);
    } else if (section === 'students') {
        document.getElementById('students-section').style.display = 'block';
    } else if (section === 'teachers') {
        document.getElementById('teachers-section').style.display = 'block';
    } else if (section === 'admins') {
        document.getElementById('admins-section').style.display = 'block';
    } else if (section === 'settings') {
        document.getElementById('settings-section').style.display = 'block';
    }
     else if (section === 'called') {
        document.getElementById('called-section').style.display = 'block';
    }
    
}

// Funções do Modal de Adicionar Administrador
function openAddAdminModal() {
    document.getElementById('add-admin-name').value = '';
    document.getElementById('add-admin-email').value = '';
    document.getElementById('add-admin-password').value = '';
    document.getElementById('add-admin-access').value = '';
    document.getElementById('addAdminModal').classList.add('active');
}

function closeAddAdminModal() {
    document.getElementById('addAdminModal').classList.remove('active');
}

function saveNewAdmin() {
    const name = document.getElementById('add-admin-name').value;
    const email = document.getElementById('add-admin-email').value;
    const password = document.getElementById('add-admin-password').value;
    const access = document.getElementById('add-admin-access').value;

    if (!name || !email || !password || !access) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    alert(`Administrador adicionado com sucesso!\n\nNome: ${name}\nEmail: ${email}\nNível: ${access}`);
    closeAddAdminModal();
}

// Funções do Modal de Configurações
function openConfigModal(type) {
    const modal = document.getElementById('configModal');
    const title = document.getElementById('config-modal-title');
    const body = document.getElementById('config-modal-body');
    
    let content = '';
    
    switch(type) {
        case 'general':
            title.innerHTML = '<i class="fas fa-sliders-h"></i> Configurações Gerais';
            content = `
                <div class="form-group">
                    <label>Nome do Sistema</label>
                    <input type="text" value="EduAdmin" placeholder="Nome do sistema">
                </div>
                <div class="form-group">
                    <label>Idioma</label>
                    <select>
                        <option>Português (BR)</option>
                        <option>English</option>
                        <option>Español</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Fuso Horário</label>
                    <select>
                        <option>GMT-3 (Brasília)</option>
                        <option>GMT-5 (Nova York)</option>
                        <option>GMT+0 (Londres)</option>
                    </select>
                </div>
            `;
            break;
        case 'notifications':
            title.innerHTML = '<i class="fas fa-bell"></i> Preferências de Notificação';
            content = `
                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" checked style="width: auto;">
                        <span>Notificações por Email</span>
                    </label>
                </div>
                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" checked style="width: auto;">
                        <span>Notificações no Sistema</span>
                    </label>
                </div>
                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" style="width: auto;">
                        <span>Notificações por SMS</span>
                    </label>
                </div>
                <div class="form-group">
                    <label>Frequência de Notificações</label>
                    <select>
                        <option>Imediato</option>
                        <option>Diário</option>
                        <option>Semanal</option>
                    </select>
                </div>
            `;
            break;
        case 'security':
            title.innerHTML = '<i class="fas fa-shield-alt"></i> Configurações de Segurança';
            content = `
                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" checked style="width: auto;">
                        <span>Autenticação de Dois Fatores (2FA)</span>
                    </label>
                </div>
                <div class="form-group">
                    <label>Tempo de Sessão (minutos)</label>
                    <input type="number" value="30" min="5" max="120">
                </div>
                <div class="form-group">
                    <label>Política de Senha</label>
                    <select>
                        <option>Forte (mínimo 8 caracteres)</option>
                        <option>Média (mínimo 6 caracteres)</option>
                        <option>Básica (mínimo 4 caracteres)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" checked style="width: auto;">
                        <span>Registrar Tentativas de Login</span>
                    </label>
                </div>
            `;
            break;
        case 'backup':
            title.innerHTML = '<i class="fas fa-database"></i> Backup Automático';
            content = `
                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" checked style="width: auto;">
                        <span>Ativar Backup Automático</span>
                    </label>
                </div>
                <div class="form-group">
                    <label>Frequência de Backup</label>
                    <select>
                        <option>Diário</option>
                        <option>Semanal</option>
                        <option>Mensal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Horário do Backup</label>
                    <input type="time" value="02:00">
                </div>
                <div class="form-group">
                    <label>Manter Backups por (dias)</label>
                    <input type="number" value="30" min="7" max="365">
                </div>
            `;
            break;
    }
    
    body.innerHTML = content;
    modal.classList.add('active');
}

function closeConfigModal() {
    document.getElementById('configModal').classList.remove('active');
}

function saveConfigChanges() {
    alert('Configurações salvas com sucesso!');
    closeConfigModal();
}

// Funções do Modal de Adicionar Estudante
function openAddStudentModal() {
    document.getElementById('add-student-name').value = '';
    document.getElementById('add-student-email').value = '';
    document.getElementById('add-student-password').value = '';
    document.getElementById('add-student-courses').value = '0';
    document.getElementById('addStudentModal').classList.add('active');
}

function closeAddStudentModal() {
    document.getElementById('addStudentModal').classList.remove('active');
}

function saveNewStudent() {
    const name = document.getElementById('add-student-name').value;
    const email = document.getElementById('add-student-email').value;
    const password = document.getElementById('add-student-password').value;
    const courses = document.getElementById('add-student-courses').value;

    if (!name || !email || !password) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    alert(`Estudante adicionado com sucesso!\n\nNome: ${name}\nEmail: ${email}\nCursos: ${courses}`);
    closeAddStudentModal();
}

// Funções do Modal de Adicionar Docente
function openAddTeacherModal() {
    document.getElementById('add-teacher-name').value = '';
    document.getElementById('add-teacher-email').value = '';
    document.getElementById('add-teacher-password').value = '';
    document.getElementById('add-teacher-courses').value = '0';
    document.getElementById('add-teacher-rating').value = '5.0';
    document.getElementById('addTeacherModal').classList.add('active');
}

function closeAddTeacherModal() {
    document.getElementById('addTeacherModal').classList.remove('active');
}

function saveNewTeacher() {
    const name = document.getElementById('add-teacher-name').value;
    const email = document.getElementById('add-teacher-email').value;
    const password = document.getElementById('add-teacher-password').value;
    const courses = document.getElementById('add-teacher-courses').value;
    const rating = document.getElementById('add-teacher-rating').value;

    if (!name || !email || !password) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    if (rating < 0 || rating > 5) {
        alert('A avaliação deve estar entre 0 e 5!');
        return;
    }

    alert(`Docente adicionado com sucesso!\n\nNome: ${name}\nEmail: ${email}\nCursos: ${courses}\nAvaliação: ${rating}`);
    closeAddTeacherModal();
}

// Funções do Modal
function openEditModal(name, email, access, status) {
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-access').value = access;
    document.getElementById('edit-status').value = status;
    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

function saveChanges() {
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const access = document.getElementById('edit-access').value;
    const status = document.getElementById('edit-status').value;

    if (!name || !email || !access || !status) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // Aqui você adicionaria a lógica para salvar no backend
    alert(`Dados salvos com sucesso!\n\nNome: ${name}\nEmail: ${email}\nNível: ${access}\nStatus: ${status}`);
    closeEditModal();
}

// Fechar modal ao clicar fora dele
document.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    const studentModal = document.getElementById('editStudentModal');
    const teacherModal = document.getElementById('editTeacherModal');
    const addAdminModal = document.getElementById('addAdminModal');
    const addStudentModal = document.getElementById('addStudentModal');
    const addTeacherModal = document.getElementById('addTeacherModal');
    const configModal = document.getElementById('configModal');
    
    if (event.target === modal) closeEditModal();
    if (event.target === studentModal) closeEditStudentModal();
    if (event.target === teacherModal) closeEditTeacherModal();
    if (event.target === addAdminModal) closeAddAdminModal();
    if (event.target === addStudentModal) closeAddStudentModal();
    if (event.target === addTeacherModal) closeAddTeacherModal();
    if (event.target === configModal) closeConfigModal();
});

// Fechar modal com a tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEditModal();
        closeEditStudentModal();
        closeEditTeacherModal();
        closeAddAdminModal();
        closeAddStudentModal();
        closeAddTeacherModal();
        closeConfigModal();
    }
});

// Funções do Modal de Estudante
function openEditStudentModal(name, email, courses, status) {
    document.getElementById('edit-student-name').value = name;
    document.getElementById('edit-student-email').value = email;
    document.getElementById('edit-student-courses').value = courses;
    document.getElementById('edit-student-status').value = status;
    document.getElementById('editStudentModal').classList.add('active');
}

function closeEditStudentModal() {
    document.getElementById('editStudentModal').classList.remove('active');
}

function saveStudentChanges() {
    const name = document.getElementById('edit-student-name').value;
    const email = document.getElementById('edit-student-email').value;
    const courses = document.getElementById('edit-student-courses').value;
    const status = document.getElementById('edit-student-status').value;

    if (!name || !email || !courses || !status) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // Aqui você adicionaria a lógica para salvar no backend
    alert(`Dados do estudante salvos com sucesso!\n\nNome: ${name}\nEmail: ${email}\nCursos: ${courses}\nStatus: ${status}`);
    closeEditStudentModal();
}

// Funções do Modal de Docente
function openEditTeacherModal(name, email, courses, rating, status) {
    document.getElementById('edit-teacher-name').value = name;
    document.getElementById('edit-teacher-email').value = email;
    document.getElementById('edit-teacher-courses').value = courses;
    document.getElementById('edit-teacher-rating').value = rating;
    document.getElementById('edit-teacher-status').value = status;
    document.getElementById('editTeacherModal').classList.add('active');
}

function closeEditTeacherModal() {
    document.getElementById('editTeacherModal').classList.remove('active');
}

function saveTeacherChanges() {
    const name = document.getElementById('edit-teacher-name').value;
    const email = document.getElementById('edit-teacher-email').value;
    const courses = document.getElementById('edit-teacher-courses').value;
    const rating = document.getElementById('edit-teacher-rating').value;
    const status = document.getElementById('edit-teacher-status').value;

    if (!name || !email || !courses || !rating || !status) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (rating < 0 || rating > 5) {
        alert('A avaliação deve estar entre 0 e 5!');
        return;
    }

    // Aqui você adicionaria a lógica para salvar no backend
    alert(`Dados do docente salvos com sucesso!\n\nNome: ${name}\nEmail: ${email}\nCursos Criados: ${courses}\nAvaliação: ${rating}\nStatus: ${status}`);
    closeEditTeacherModal();
}

// ==================== FUNCIONALIDADES COMPLETAS DE CHAMADOS ====================

// Dados mockados de chamados
let chamados = [
    {
        id: 1,
        codigo: '0821-00040',
        criacao: '15-10-2025',
        hora: '14:13',
        status: 'aberto',
        tipo: 'geral',
        assunto: 'ELETRÔNICA - RELOGIO - DIGITAL - RDP.RDP.SOD.ATR.DIS.DIS C E207',
        descricao: 'WEBHOOK Atendosamente, Adilan Santos Support Analyst (II)',
        pretensaoLancamento: '28-10-2025',
        pretensaoHora: '09:15',
        solicitante: 'Adilan Santos',
        solicitanteEmail: 'adilan.s.santos@docente.com',
        categoria: 'Eletroeletrônica',
        anexos: 0
    },
    {
        id: 2,
        codigo: '0821-00041',
        criacao: '16-10-2025',
        hora: '10:30',
        status: 'aberto',
        tipo: 'pedido_curso',
        assunto: 'Solicitação de Curso de Python Avançado',
        descricao: 'Gostaria de solicitar o curso de Python Avançado para melhorar minhas habilidades em programação',
        pretensaoLancamento: '20-10-2025',
        pretensaoHora: '14:00',
        solicitante: 'Maria Silva',
        solicitanteEmail: 'maria.silva@email.com',
        categoria: 'Pedido de Curso',
        anexos: 2,
        documentos: [
            {
                id: 1,
                nome: 'Plano_de_Aula_Python.pdf',
                tipo: 'PDF',
                tamanho: '2.5 MB',
                categoria: 'Plano de Aula',
                dataUpload: '16-10-2025 10:45',
                descricao: 'Plano detalhado das aulas do curso'
            },
            {
                id: 2,
                nome: 'Material_Didatico_Python.zip',
                tipo: 'ZIP',
                tamanho: '15.8 MB',
                categoria: 'Material Didático',
                dataUpload: '16-10-2025 11:00',
                descricao: 'Slides, exercícios e códigos de exemplo'
            }
        ]
    },
    {
        id: 3,
        codigo: '0821-00042',
        criacao: '17-10-2025',
        hora: '15:45',
        status: 'finalizado',
        tipo: 'geral',
        assunto: 'Solicitação de novo recurso no sistema',
        descricao: 'Implementar funcionalidade de exportação de relatórios em PDF',
        pretensaoLancamento: '25-10-2025',
        pretensaoHora: '16:00',
        solicitante: 'Pedro Oliveira',
        solicitanteEmail: 'pedro.oliveira@email.com',
        categoria: 'Desenvolvimento',
        anexos: 1
    },
    {
        id: 4,
        codigo: '0821-00043',
        criacao: '18-10-2025',
        hora: '09:20',
        status: 'cancelado',
        tipo: 'pedido_curso',
        assunto: 'Pedido de Curso de Data Science',
        descricao: 'Interessado no curso de Data Science com certificado',
        pretensaoLancamento: '22-10-2025',
        pretensaoHora: '10:30',
        solicitante: 'Ana Costa',
        solicitanteEmail: 'ana.costa@email.com',
        categoria: 'Pedido de Curso',
        anexos: 3,
        documentos: [
            {
                id: 1,
                nome: 'Cronograma_Data_Science.xlsx',
                tipo: 'XLSX',
                tamanho: '156 KB',
                categoria: 'Cronograma',
                dataUpload: '18-10-2025 09:30',
                descricao: 'Cronograma completo do curso'
            },
            {
                id: 2,
                nome: 'Datasets_Praticos.zip',
                tipo: 'ZIP',
                tamanho: '45.2 MB',
                categoria: 'Material Prático',
                dataUpload: '18-10-2025 09:45',
                descricao: 'Datasets para exercícios práticos'
            },
            {
                id: 3,
                nome: 'Certificacao_Modelo.pdf',
                tipo: 'PDF',
                tamanho: '890 KB',
                categoria: 'Certificado',
                dataUpload: '18-10-2025 10:00',
                descricao: 'Modelo de certificado a ser emitido'
            }
        ]
    },
    {
        id: 5,
        codigo: '0821-00044',
        criacao: '19-10-2025',
        hora: '11:15',
        status: 'aberto',
        tipo: 'pedido_curso',
        assunto: 'Curso de JavaScript e React',
        descricao: 'Solicitação de acesso ao curso completo de desenvolvimento web com React',
        pretensaoLancamento: '30-10-2025',
        pretensaoHora: '08:00',
        solicitante: 'Carlos Mendes',
        solicitanteEmail: 'carlos.mendes@email.com',
        categoria: 'Pedido de Curso',
        anexos: 4,
        documentos: [
            {
                id: 1,
                nome: 'Ementa_JavaScript_React.pdf',
                tipo: 'PDF',
                tamanho: '1.2 MB',
                categoria: 'Ementa',
                dataUpload: '19-10-2025 11:30',
                descricao: 'Ementa completa do curso'
            },
            {
                id: 2,
                nome: 'Videos_Aulas.mp4',
                tipo: 'MP4',
                tamanho: '320 MB',
                categoria: 'Vídeo Aula',
                dataUpload: '19-10-2025 11:45',
                descricao: 'Videoaulas introdutórias'
            },
            {
                id: 3,
                nome: 'Projetos_Praticos.zip',
                tipo: 'ZIP',
                tamanho: '8.5 MB',
                categoria: 'Projetos',
                dataUpload: '19-10-2025 12:00',
                descricao: 'Códigos dos projetos práticos'
            },
            {
                id: 4,
                nome: 'Bibliografia_Recomendada.docx',
                tipo: 'DOCX',
                tamanho: '245 KB',
                categoria: 'Bibliografia',
                dataUpload: '19-10-2025 12:15',
                descricao: 'Lista de livros e materiais recomendados'
            }
        ]
    },
    {
        id: 6,
        codigo: '0821-00045',
        criacao: '20-10-2025',
        hora: '14:20',
        status: 'aberto',
        tipo: 'reclamacao',
        assunto: 'Reclamação sobre atendimento no suporte',
        descricao: 'O atendimento foi muito demorado e não resolveu meu problema adequadamente',
        pretensaoLancamento: '23-10-2025',
        pretensaoHora: '10:00',
        solicitante: 'Roberto Silva',
        solicitanteEmail: 'roberto.silva@email.com',
        categoria: 'Reclamação',
        anexos: 1
    },
    {
        id: 7,
        codigo: '0821-00046',
        criacao: '21-10-2025',
        hora: '09:45',
        status: 'aberto',
        tipo: 'reclamacao',
        assunto: 'Problema com qualidade do curso adquirido',
        descricao: 'O curso que comprei não corresponde à descrição apresentada na plataforma',
        pretensaoLancamento: '25-10-2025',
        pretensaoHora: '11:30',
        solicitante: 'Juliana Costa',
        solicitanteEmail: 'juliana.costa@email.com',
        categoria: 'Reclamação',
        anexos: 2
    },
    {
        id: 8,
        codigo: '0821-00047',
        criacao: '22-10-2025',
        hora: '16:30',
        status: 'finalizado',
        tipo: 'reclamacao',
        assunto: 'Reclamação sobre cobrança indevida',
        descricao: 'Fui cobrado duas vezes pelo mesmo curso, solicito reembolso',
        pretensaoLancamento: '24-10-2025',
        pretensaoHora: '15:00',
        solicitante: 'Fernando Alves',
        solicitanteEmail: 'fernando.alves@email.com',
        categoria: 'Reclamação',
        anexos: 3
    }
];

let filtroAtualChamado = 'todos';
let pesquisaChamado = '';

// Função para renderizar a tabela de chamados
function renderizarChamados() {
    const tbody = document.getElementById('called-table-body');
    const noDataMessage = document.getElementById('no-called-message');
    
    if (!tbody) return;
    
    // Filtrar chamados
    let chamadosFiltrados = chamados.filter(chamado => {
        const matchPesquisa = chamado.codigo.toLowerCase().includes(pesquisaChamado.toLowerCase()) ||
                             chamado.assunto.toLowerCase().includes(pesquisaChamado.toLowerCase()) ||
                             chamado.solicitante.toLowerCase().includes(pesquisaChamado.toLowerCase()) ||
                             chamado.categoria.toLowerCase().includes(pesquisaChamado.toLowerCase());
        
        let matchFiltro = false;
        
        if (filtroAtualChamado === 'todos') {
            matchFiltro = true;
        } else if (filtroAtualChamado === 'pedido_curso') {
            matchFiltro = chamado.tipo === 'pedido_curso';
        } else if (filtroAtualChamado === 'reclamacao') {
            matchFiltro = chamado.tipo === 'reclamacao';
        } else {
            matchFiltro = chamado.status === filtroAtualChamado;
        }
        
        return matchPesquisa && matchFiltro;
    });

    // Limpar tabela
    tbody.innerHTML = '';

    if (chamadosFiltrados.length === 0) {
        tbody.style.display = 'none';
        if (noDataMessage) noDataMessage.style.display = 'block';
    } else {
        tbody.style.display = '';
        if (noDataMessage) noDataMessage.style.display = 'none';

        chamadosFiltrados.forEach(chamado => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #e2e8f0';
            tr.style.transition = 'background 0.2s ease';
            
            // Definir ícone de status
            let statusIcon = '';
            let statusColor = '';
            switch(chamado.status) {
                case 'aberto':
                    statusIcon = 'fa-spinner';
                    statusColor = '#3b82f6';
                    break;
                case 'finalizado':
                    statusIcon = 'fa-check-circle';
                    statusColor = '#10b981';
                    break;
                case 'cancelado':
                    statusIcon = 'fa-times-circle';
                    statusColor = '#ef4444';
                    break;
                default:
                    statusIcon = 'fa-clock';
                    statusColor = '#f59e0b';
            }

            tr.innerHTML = `
                <td style="padding: 15px; font-size: 14px; color: #1e293b; font-weight: 500;">${chamado.codigo}</td>
                <td style="padding: 15px; font-size: 13px; color: #64748b;">
                    ${chamado.criacao}<br>
                    <span style="color: #94a3b8; font-size: 12px;">${chamado.hora}</span>
                </td>
                <td style="padding: 15px;">
                    <i class="fas ${statusIcon}" style="color: ${statusColor};" title="${chamado.status}"></i>
                </td>
                <td style="padding: 15px; font-size: 13px; color: #1e293b; max-width: 300px;">
                    <div style="font-weight: 500; margin-bottom: 3px;">${chamado.assunto}</div>
                    <div style="color: #64748b; font-size: 12px;">${chamado.descricao.substring(0, 80)}${chamado.descricao.length > 80 ? '...' : ''}</div>
                </td>
                <td style="padding: 15px; font-size: 13px;">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <i class="fas fa-calendar-alt" style="color: #22c55e; font-size: 10px;"></i>
                        <span style="color: #1e293b; font-weight: 500;">${chamado.pretensaoLancamento}</span>
                    </div>
                    <div style="margin-top: 5px; font-size: 12px; color: #64748b;">
                        ${chamado.pretensaoHora}
                    </div>
                </td>
                <td style="padding: 15px; font-size: 13px;">
                    <div style="color: #1e293b; font-weight: 500;">${chamado.solicitante}</div>
                    <div style="color: #64748b; font-size: 12px;">${chamado.solicitanteEmail}</div>
                </td>
                <td style="padding: 15px; font-size: 13px; color: #64748b;">${chamado.categoria}</td>
                <td style="padding: 15px; text-align: center; font-weight: 500; color: #1e293b;">${chamado.anexos > 0 ? chamado.anexos : '-'}</td>
            `;
            
            // Adicionar evento de clique para visualizar detalhes
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', () => openViewCalledModal(chamado));
            tr.addEventListener('mouseenter', () => tr.style.background = '#f8fafc');
            tr.addEventListener('mouseleave', () => tr.style.background = 'transparent');
            
            tbody.appendChild(tr);
        });
    }
}

// Função para filtrar chamados por status/tipo
function filtrarChamadosStatus(filtro) {
    filtroAtualChamado = filtro;
    
    // Atualizar abas ativas
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        const tabStatus = tab.getAttribute('data-status');
        if (tabStatus === filtro) {
            tab.classList.add('active');
        }
    });
    
    renderizarChamados();
    
    // Log para debug
    console.log('Filtro aplicado:', filtro);
    console.log('Chamados filtrados:', chamados.filter(c => {
        if (filtro === 'todos') return true;
        if (filtro === 'pedido_curso') return c.tipo === 'pedido_curso';
        return c.status === filtro;
    }).length);
}

// Função de pesquisa
function pesquisarChamados(termo) {
    pesquisaChamado = termo;
    renderizarChamados();
}

// Função para abrir modal de novo chamado
function openNewCalledModal() {
    const modalHTML = `
        <div class="modal-overlay-custom active" id="newCalledModal">
            <div class="modal-content-custom" style="max-width: 700px;">
                <div class="modal-header-custom">
                    <div class="modal-title-custom">
                        <i class="fas fa-plus-circle"></i>
                        <h3>Novo Chamado</h3>
                    </div>
                    <button class="modal-close-custom" onclick="closeNewCalledModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body-custom">
                    <form id="newCalledForm">
                        <div class="form-row-custom">
                            <div class="form-group-custom">
                                <label for="new-called-tipo">
                                    <i class="fas fa-tag"></i> Tipo de Chamado *
                                </label>
                                <select id="new-called-tipo" required>
                                    <option value="">Selecione o tipo</option>
                                    <option value="geral">Chamado Geral</option>
                                    <option value="pedido_curso">Pedido de Curso</option>
                                    <option value="reclamacao">Reclamação</option>
                                </select>
                            </div>
                            <div class="form-group-custom">
                                <label for="new-called-categoria">
                                    <i class="fas fa-folder"></i> Categoria *
                                </label>
                                <select id="new-called-categoria" required>
                                    <option value="">Selecione uma categoria</option>
                                    <option value="Suporte Técnico">Suporte Técnico</option>
                                    <option value="Desenvolvimento">Desenvolvimento</option>
                                    <option value="Financeiro">Financeiro</option>
                                    <option value="Eletroeletrônica">Eletroeletrônica</option>
                                    <option value="Infraestrutura">Infraestrutura</option>
                                    <option value="Pedido de Curso">Pedido de Curso</option>
                                    <option value="Reclamação">Reclamação</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group-custom">
                            <label for="new-called-assunto">
                                <i class="fas fa-heading"></i> Assunto *
                            </label>
                            <input type="text" id="new-called-assunto" placeholder="Digite o assunto do chamado" required>
                        </div>

                        <div class="form-group-custom">
                            <label for="new-called-descricao">
                                <i class="fas fa-align-left"></i> Descrição *
                            </label>
                            <textarea id="new-called-descricao" placeholder="Descreva o problema ou solicitação detalhadamente" rows="4" required></textarea>
                        </div>

                        <div class="form-row-custom">
                            <div class="form-group-custom">
                                <label for="new-called-pretensao">
                                    <i class="fas fa-calendar"></i> Pretensão de Lançamento
                                </label>
                                <input type="date" id="new-called-pretensao">
                            </div>
                            <div class="form-group-custom">
                                <label for="new-called-hora">
                                    <i class="fas fa-clock"></i> Horário
                                </label>
                                <input type="time" id="new-called-hora">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer-custom">
                    <button class="btn-cancel-custom" onclick="closeNewCalledModal()">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button class="btn-save-custom" onclick="saveNewCalled()">
                        <i class="fas fa-paper-plane"></i> Criar Chamado
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente se houver
    const existingModal = document.getElementById('newCalledModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Definir data e hora atuais
    const hoje = new Date();
    const dataInput = document.getElementById('new-called-pretensao');
    const horaInput = document.getElementById('new-called-hora');
    
    if (dataInput) dataInput.valueAsDate = hoje;
    if (horaInput) horaInput.value = hoje.toTimeString().slice(0, 5);
}

// Função para fechar modal de novo chamado
function closeNewCalledModal() {
    const modal = document.getElementById('newCalledModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Função para salvar novo chamado
function saveNewCalled() {
    const tipo = document.getElementById('new-called-tipo').value;
    const assunto = document.getElementById('new-called-assunto').value;
    const descricao = document.getElementById('new-called-descricao').value;
    const categoria = document.getElementById('new-called-categoria').value;
    const pretensao = document.getElementById('new-called-pretensao').value;
    const hora = document.getElementById('new-called-hora').value;

    if (!tipo || !assunto || !descricao || !categoria) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    // Criar novo chamado
    const novoChamado = {
        id: chamados.length + 1,
        codigo: `0821-${String(40 + chamados.length).padStart(5, '0')}`,
        criacao: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'aberto',
        tipo: tipo,
        assunto: assunto,
        descricao: descricao,
        pretensaoLancamento: pretensao ? new Date(pretensao + 'T00:00:00').toLocaleDateString('pt-BR') : '-',
        pretensaoHora: hora || '-',
        solicitante: 'Admin User',
        solicitanteEmail: 'admin@email.com',
        categoria: categoria,
        anexos: 0
    };

    chamados.unshift(novoChamado);
    renderizarChamados();
    closeNewCalledModal();
    
    // Notificação de sucesso
    showNotification('Chamado criado com sucesso!', `Código: ${novoChamado.codigo}`, 'success');
}

// Função para visualizar detalhes do chamado
function openViewCalledModal(chamado) {
    let tipoLabel = 'Chamado Geral';
    let tipoBadgeColor = '#3b82f6';
    
    if (chamado.tipo === 'pedido_curso') {
        tipoLabel = 'Pedido de Curso';
        tipoBadgeColor = '#8b5cf6';
    } else if (chamado.tipo === 'reclamacao') {
        tipoLabel = 'Reclamação';
        tipoBadgeColor = '#ef4444';
    }
    
    const modalHTML = `
        <div class="modal-overlay-custom active" id="viewCalledModal">
            <div class="modal-content-custom" style="max-width: 900px;">
                <div class="modal-header-custom">
                    <div class="modal-title-custom">
                        <i class="fas fa-file-alt"></i>
                        <h3>Detalhes do Chamado</h3>
                    </div>
                    <button class="modal-close-custom" onclick="closeViewCalledModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body-custom" style="max-height: 70vh; overflow-y: auto;">
                    <!-- Cabeçalho do Chamado -->
                    <div class="chamado-header">
                        <div class="chamado-codigo">${chamado.codigo}</div>
                        <div class="chamado-badges">
                            <span class="badge-tipo" style="background: ${tipoBadgeColor}20; color: ${tipoBadgeColor};">
                                <i class="fas fa-tag"></i> ${tipoLabel}
                            </span>
                            <span class="badge-status badge-status-${chamado.status}">
                                <i class="fas fa-circle"></i> ${chamado.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <!-- Grid de Informações -->
                    <div class="info-grid">
                        <div class="info-item">
                            <i class="fas fa-calendar-plus"></i>
                            <div>
                                <span class="info-label">Data de Criação</span>
                                <span class="info-value">${chamado.criacao} às ${chamado.hora}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-calendar-check"></i>
                            <div>
                                <span class="info-label">Pretensão de Lançamento</span>
                                <span class="info-value">${chamado.pretensaoLancamento} às ${chamado.pretensaoHora}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-user"></i>
                            <div>
                                <span class="info-label">Solicitante</span>
                                <span class="info-value">${chamado.solicitante}</span>
                                <span class="info-subvalue">${chamado.solicitanteEmail}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-folder-open"></i>
                            <div>
                                <span class="info-label">Categoria</span>
                                <span class="info-value">${chamado.categoria}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Seção de Assunto -->
                    <div class="info-section">
                        <div class="section-title">
                            <i class="fas fa-heading"></i> Assunto
                        </div>
                        <div class="section-content">${chamado.assunto}</div>
                    </div>

                    <!-- Seção de Descrição -->
                    <div class="info-section">
                        <div class="section-title">
                            <i class="fas fa-align-left"></i> Descrição
                        </div>
                        <div class="section-content">${chamado.descricao}</div>
                    </div>

                    <!-- Seção de Anexos -->
                    <div class="info-section">
                        <div class="section-title">
                            <i class="fas fa-paperclip"></i> ${chamado.tipo === 'pedido_curso' ? 'Documentos do Curso' : 'Anexos'}
                        </div>
                        <div class="section-content" style="padding: 0; background: transparent; border: none;">
                            ${chamado.tipo === 'pedido_curso' && chamado.documentos && chamado.documentos.length > 0 ? `
                                <div class="documentos-list">
                                    ${chamado.documentos.map(doc => `
                                        <div class="documento-item">
                                            <div class="documento-icon">
                                                <i class="fas ${getDocumentoIcon(doc.tipo)}"></i>
                                            </div>
                                            <div class="documento-info">
                                                <div class="documento-nome">${doc.nome}</div>
                                                <div class="documento-meta">
                                                    <span class="documento-badge">${doc.categoria}</span>
                                                    <span class="documento-tipo">${doc.tipo}</span>
                                                    <span class="documento-tamanho">${doc.tamanho}</span>
                                                </div>
                                                <div class="documento-descricao">${doc.descricao}</div>
                                                <div class="documento-data">
                                                    <i class="fas fa-clock"></i> Enviado em ${doc.dataUpload}
                                                </div>
                                            </div>
                                            <div class="documento-actions">
                                                <button class="btn-documento-action" onclick="downloadDocumento(${chamado.id}, ${doc.id})" title="Baixar">
                                                    <i class="fas fa-download"></i>
                                                </button>
                                                <button class="btn-documento-action" onclick="visualizarDocumento(${chamado.id}, ${doc.id})" title="Visualizar">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                ${chamado.status === 'aberto' ? `
                                                    <button class="btn-documento-action btn-delete" onclick="removerDocumento(${chamado.id}, ${doc.id})" title="Remover">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                ${chamado.status === 'aberto' ? `
                                    <button class="btn-add-documento" onclick="adicionarDocumento(${chamado.id})">
                                        <i class="fas fa-plus"></i> Adicionar Novo Documento
                                    </button>
                                ` : ''}
                            ` : chamado.anexos > 0 ? `
                                <div style="padding: 16px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
                                    <i class="fas fa-file"></i> ${chamado.anexos} arquivo(s) anexado(s)
                                </div>
                            ` : `
                                <div style="padding: 16px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; color: #94a3b8;">
                                    <i class="fas fa-inbox"></i> Nenhum documento enviado ainda
                                </div>
                            `}
                        </div>
                    </div>
                </div>
                <div class="modal-footer-custom">
                    <button class="btn-cancel-custom" onclick="closeViewCalledModal()">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                    <button class="btn-edit-custom" onclick="editarChamado(${chamado.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    ${chamado.status === 'aberto' ? `
                        <button class="btn-success-custom" onclick="finalizarChamado(${chamado.id})">
                            <i class="fas fa-check"></i> Finalizar
                        </button>
                    ` : ''}
                    ${chamado.status !== 'cancelado' ? `
                        <button class="btn-danger-custom" onclick="cancelarChamado(${chamado.id})">
                            <i class="fas fa-ban"></i> Cancelar
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('viewCalledModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Função para fechar modal de visualização
function closeViewCalledModal() {
    const modal = document.getElementById('viewCalledModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Função auxiliar para obter ícone do documento baseado no tipo
function getDocumentoIcon(tipo) {
    const icons = {
        'PDF': 'fa-file-pdf',
        'ZIP': 'fa-file-archive',
        'XLSX': 'fa-file-excel',
        'DOCX': 'fa-file-word',
        'MP4': 'fa-file-video',
        'PPTX': 'fa-file-powerpoint',
        'TXT': 'fa-file-alt',
        'PNG': 'fa-file-image',
        'JPG': 'fa-file-image',
        'JPEG': 'fa-file-image'
    };
    return icons[tipo.toUpperCase()] || 'fa-file';
}

// Função para baixar documento
function downloadDocumento(chamadoId, documentoId) {
    const chamado = chamados.find(c => c.id === chamadoId);
    if (!chamado || !chamado.documentos) return;
    
    const documento = chamado.documentos.find(d => d.id === documentoId);
    if (!documento) return;
    
    showNotification('Download Iniciado', `Baixando ${documento.nome}...`, 'info');
    
    // Simular download
    setTimeout(() => {
        showNotification('Download Concluído', `${documento.nome} foi baixado com sucesso!`, 'success');
    }, 1500);
}

// Função para visualizar documento
function visualizarDocumento(chamadoId, documentoId) {
    const chamado = chamados.find(c => c.id === chamadoId);
    if (!chamado || !chamado.documentos) return;
    
    const documento = chamado.documentos.find(d => d.id === documentoId);
    if (!documento) return;
    
    showNotification('Abrindo Documento', `Visualizando ${documento.nome}...`, 'info');
    
    // Aqui você implementaria a visualização real do documento
    setTimeout(() => {
        alert(`Visualização de: ${documento.nome}\nTipo: ${documento.tipo}\nCategoria: ${documento.categoria}\n\nEsta é uma simulação. Em produção, o documento seria exibido.`);
    }, 500);
}

// Função para remover documento
function removerDocumento(chamadoId, documentoId) {
    const chamado = chamados.find(c => c.id === chamadoId);
    if (!chamado || !chamado.documentos) return;
    
    const documento = chamado.documentos.find(d => d.id === documentoId);
    if (!documento) return;
    
    if (confirm(`Deseja realmente remover o documento "${documento.nome}"?\n\nEsta ação não poderá ser desfeita.`)) {
        // Remover documento do array
        const index = chamado.documentos.findIndex(d => d.id === documentoId);
        if (index > -1) {
            chamado.documentos.splice(index, 1);
            chamado.anexos = chamado.documentos.length;
        }
        
        // Fechar e reabrir modal para atualizar
        closeViewCalledModal();
        setTimeout(() => {
            openViewCalledModal(chamado);
            showNotification('Documento Removido', `${documento.nome} foi removido com sucesso.`, 'success');
        }, 300);
    }
}

// Função para adicionar novo documento
function adicionarDocumento(chamadoId) {
    const chamado = chamados.find(c => c.id === chamadoId);
    if (!chamado) return;
    
    const modalHTML = `
        <div class="modal-overlay-custom active" id="addDocumentoModal" style="z-index: 10001;">
            <div class="modal-content-custom" style="max-width: 600px;">
                <div class="modal-header-custom">
                    <div class="modal-title-custom">
                        <i class="fas fa-upload"></i>
                        <h3>Adicionar Documento</h3>
                    </div>
                    <button class="modal-close-custom" onclick="closeAddDocumentoModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body-custom">
                    <form id="addDocumentoForm">
                        <div class="form-group-custom">
                            <label>
                                <i class="fas fa-file"></i> Selecionar Arquivo *
                            </label>
                            <input type="file" id="documento-file" required style="padding: 10px;">
                        </div>
                        
                        <div class="form-group-custom">
                            <label for="documento-categoria">
                                <i class="fas fa-tag"></i> Categoria do Documento *
                            </label>
                            <select id="documento-categoria" required>
                                <option value="">Selecione a categoria</option>
                                <option value="Plano de Aula">Plano de Aula</option>
                                <option value="Material Didático">Material Didático</option>
                                <option value="Ementa">Ementa</option>
                                <option value="Cronograma">Cronograma</option>
                                <option value="Vídeo Aula">Vídeo Aula</option>
                                <option value="Projetos">Projetos</option>
                                <option value="Bibliografia">Bibliografia</option>
                                <option value="Certificado">Certificado</option>
                                <option value="Material Prático">Material Prático</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                        
                        <div class="form-group-custom">
                            <label for="documento-descricao">
                                <i class="fas fa-align-left"></i> Descrição *
                            </label>
                            <textarea id="documento-descricao" placeholder="Descreva o conteúdo do documento" rows="3" required></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer-custom">
                    <button class="btn-cancel-custom" onclick="closeAddDocumentoModal()">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button class="btn-save-custom" onclick="salvarDocumento(${chamadoId})">
                        <i class="fas fa-upload"></i> Enviar Documento
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Função para fechar modal de adicionar documento
function closeAddDocumentoModal() {
    const modal = document.getElementById('addDocumentoModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Função para salvar novo documento
function salvarDocumento(chamadoId) {
    const chamado = chamados.find(c => c.id === chamadoId);
    if (!chamado) return;
    
    const fileInput = document.getElementById('documento-file');
    const categoria = document.getElementById('documento-categoria').value;
    const descricao = document.getElementById('documento-descricao').value;
    
    if (!fileInput.files[0] || !categoria || !descricao) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    const file = fileInput.files[0];
    const extensao = file.name.split('.').pop().toUpperCase();
    const tamanhoMB = (file.size / (1024 * 1024)).toFixed(1);
    
    // Criar array de documentos se não existir
    if (!chamado.documentos) {
        chamado.documentos = [];
    }
    
    // Adicionar novo documento
    const novoDocumento = {
        id: chamado.documentos.length + 1,
        nome: file.name,
        tipo: extensao,
        tamanho: `${tamanhoMB} MB`,
        categoria: categoria,
        dataUpload: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        descricao: descricao
    };
    
    chamado.documentos.push(novoDocumento);
    chamado.anexos = chamado.documentos.length;
    
    closeAddDocumentoModal();
    closeViewCalledModal();
    
    setTimeout(() => {
        openViewCalledModal(chamado);
        showNotification('Documento Enviado!', `${file.name} foi enviado com sucesso.`, 'success');
    }, 300);
}

// Função para editar chamado
function editarChamado(id) {
    const chamado = chamados.find(c => c.id === id);
    if (!chamado) return;
    
    closeViewCalledModal();
    
    showNotification('Edição de Chamado', 'Funcionalidade em desenvolvimento', 'info');
}

// Função para finalizar chamado
function finalizarChamado(id) {
    const chamado = chamados.find(c => c.id === id);
    if (!chamado) return;
    
    if (confirm(`Deseja finalizar o chamado ${chamado.codigo}?\n\nEsta ação não poderá ser desfeita.`)) {
        chamado.status = 'finalizado';
        renderizarChamados();
        closeViewCalledModal();
        showNotification('Chamado Finalizado!', `O chamado ${chamado.codigo} foi finalizado com sucesso.`, 'success');
    }
}

// Função para cancelar chamado
function cancelarChamado(id) {
    const chamado = chamados.find(c => c.id === id);
    if (!chamado) return;
    
    if (confirm(`Deseja cancelar o chamado ${chamado.codigo}?\n\nEsta ação não poderá ser desfeita.`)) {
        chamado.status = 'cancelado';
        renderizarChamados();
        closeViewCalledModal();
        showNotification('Chamado Cancelado', `O chamado ${chamado.codigo} foi cancelado.`, 'warning');
    }
}

// Função para atualizar lista
function atualizarListaChamados() {
    const btn = event.currentTarget;
    const icon = btn.querySelector('i');
    
    if (icon) {
        icon.style.transform = 'rotate(360deg)';
        icon.style.transition = 'transform 0.5s ease';
    }
    
    renderizarChamados();
    
    setTimeout(() => {
        if (icon) icon.style.transform = 'rotate(0deg)';
    }, 500);
    
    showNotification('Lista Atualizada', 'A lista de chamados foi atualizada com sucesso!', 'info');
}

// Função para mostrar notificações
function showNotification(title, message, type = 'info') {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 15px;
        min-width: 300px;
        max-width: 400px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid ${colors[type]};
    `;
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}" style="color: ${colors[type]}; font-size: 24px;"></i>
        <div style="flex: 1;">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px;">${title}</div>
            <div style="font-size: 13px; color: #64748b;">${message}</div>
        </div>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 20px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Inicializar eventos quando a seção de chamados for mostrada
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar evento de pesquisa
    const searchInput = document.getElementById('search-called');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            pesquisarChamados(e.target.value);
        });
    }
    
    // Adicionar eventos às abas - CORRIGIDO
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            const status = tab.getAttribute('data-status');
            
            // Se não tiver data-status, usar o texto do botão
            let filtro = status;
            
            // Verificar pelo texto se não tiver data-status correto
            const textoAba = tab.textContent.trim();
            if (textoAba === 'Pedidos de Curso') {
                filtro = 'pedido_curso';
            } else if (textoAba === 'Todos' && index === 0) {
                filtro = 'todos';
            } else if (textoAba === 'Em Aberto') {
                filtro = 'aberto';
            } else if (textoAba === 'Cancelado') {
                filtro = 'cancelado';
            } else if (textoAba === 'Finalizado') {
                filtro = 'finalizado';
            }
            
            console.log('Aba clicada:', textoAba, 'Filtro:', filtro);
            filtrarChamadosStatus(filtro);
        });
    });
    
    // Adicionar evento ao botão de atualizar
    const btnAtualizar = document.querySelector('[title="Atualizar"]');
    if (btnAtualizar) {
        btnAtualizar.addEventListener('click', atualizarListaChamados);
    }
    
    // Renderizar chamados iniciais
    setTimeout(() => {
        renderizarChamados();
    }, 100);
});

// Atualizar a função showSection para renderizar chamados quando a seção for exibida
const originalShowSection = typeof showSection !== 'undefined' ? showSection : null;

if (originalShowSection) {
    window.showSection = function(section, event) {
        originalShowSection(section, event);
        
        if (section === 'called') {
            setTimeout(() => {
                renderizarChamados();
                
                // Definir primeira aba como ativa
                const firstTab = document.querySelector('.tab-button[data-status="todos"]');
                if (firstTab && !document.querySelector('.tab-button.active')) {
                    firstTab.classList.add('active');
                }
            }, 100);
        }
    };
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);