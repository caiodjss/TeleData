// script.js

// Configuração base da API
const API_BASE_URL = 'http://localhost:3001';

// Headers para autenticação
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Função para tratar erros das requisições
const handleApiError = (error) => {
    console.error('Erro na requisição:', error);
    showNotification('Erro ao carregar dados', 'error');
};

// Função para mostrar notificações
const showNotification = (message, type = 'info') => {
    // Implementação básica de notificação - você pode usar uma biblioteca como Toastify
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Estilos básicos para notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
};

// ==================== DASHBOARD API ====================

// 1. Buscar Métricas Principais
async function fetchMetrics() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const metrics = await response.json();
        updateMetricsCards(metrics);
    } catch (error) {
        handleApiError(error);
    }
}

// 2. Buscar Usuários Recentes
async function fetchRecentuser() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/user/recent`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const recentuser = await response.json();
        updateRecentuserTable(recentuser);
    } catch (error) {
        handleApiError(error);
    }
}

// 3. Buscar Distribuição de Perfis
async function fetchProfilesDistribution() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/profiles-distribution`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const distribution = await response.json();
        updateDistributionChart(distribution);
    } catch (error) {
        handleApiError(error);
    }
}

// 4. Buscar Cursos Adquiridos
async function fetchCoursesAcquired() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/courses-acquired`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const coursesData = await response.json();
        updateCoursesChart(coursesData);
    } catch (error) {
        handleApiError(error);
    }
}

// 5. Buscar Atividades Recentes
async function fetchRecentActivities() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/activities`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const activities = await response.json();
        updateActivitiesTimeline(activities);
    } catch (error) {
        handleApiError(error);
    }
}

// ==================== USUÁRIOS API ====================

// Administradores
async function fetchAdmins() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/admin/list`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const admins = await response.json();
        updateAdminsTable(admins);
    } catch (error) {
        handleApiError(error);
    }
}

async function addAdmin(adminData) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/admin/add`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(adminData)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const result = await response.json();
        showNotification('Administrador adicionado com sucesso', 'success');
        fetchAdmins(); // Atualizar a lista
        return result;
    } catch (error) {
        handleApiError(error);
    }
}

async function editAdmin(id, adminData) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/admin/edit/`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(adminData)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const result = await response.json();
        showNotification('Administrador atualizado com sucesso', 'success');
        fetchAdmins(); // Atualizar a lista
        return result;
    } catch (error) {
        handleApiError(error);
    }
}

async function deleteAdmin(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/admin/delete/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        showNotification('Administrador excluído com sucesso', 'success');
        fetchAdmins(); // Atualizar a lista
    } catch (error) {
        handleApiError(error);
    }
}

// Docentes
async function fetchTeachers() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/instructor/list`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const teachers = await response.json();
        updateTeachersTable(teachers);
    } catch (error) {
        handleApiError(error);
    }
}

async function addTeacher(teacherData) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/instructor/add`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(teacherData)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const result = await response.json();
        showNotification('Docente adicionado com sucesso', 'success');
        fetchTeachers();
        return result;
    } catch (error) {
        handleApiError(error);
    }
}

async function editTeacher(id, teacherData) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/instructor/edit/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(teacherData)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const result = await response.json();
        showNotification('Docente atualizado com sucesso', 'success');
        fetchTeachers();
        return result;
    } catch (error) {
        handleApiError(error);
    }
}

async function deleteTeacher(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/instructor/delete/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        showNotification('Docente excluído com sucesso', 'success');
        fetchTeachers();
    } catch (error) {
        handleApiError(error);
    }
}

// Estudantes
async function fetchStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/student/list`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const students = await response.json();
        updateStudentsTable(students);
    } catch (error) {
        handleApiError(error);
    }
}

async function addStudent(studentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/student/add`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(studentData)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const result = await response.json();
        showNotification('Estudante adicionado com sucesso', 'success');
        fetchStudents();
        return result;
    } catch (error) {
        handleApiError(error);
    }
}

async function editStudent(id, studentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/student/edit/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(studentData)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const result = await response.json();
        showNotification('Estudante atualizado com sucesso', 'success');
        fetchStudents();
        return result;
    } catch (error) {
        handleApiError(error);
    }
}

async function deleteStudent(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/student/delete/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        showNotification('Estudante excluído com sucesso', 'success');
        fetchStudents();
    } catch (error) {
        handleApiError(error);
    }
}

// ==================== CHAMADOS API ====================

async function fetchTickets() {
    try {
        const response = await fetch(`${API_BASE_URL}/tickets/list`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const tickets = await response.json();
        updateTicketsTable(tickets);
    } catch (error) {
        handleApiError(error);
    }
}

async function addTicket(ticketData) {
    try {
        const response = await fetch(`${API_BASE_URL}/tickets/add`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(ticketData)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const result = await response.json();
        showNotification('Chamado aberto com sucesso', 'success');
        fetchTickets();
        return result;
    } catch (error) {
        handleApiError(error);
    }
}

async function updateTicket(id, ticketData) {
    try {
        const response = await fetch(`${API_BASE_URL}/tickets/update/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(ticketData)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const result = await response.json();
        showNotification('Chamado atualizado com sucesso', 'success');
        fetchTickets();
        return result;
    } catch (error) {
        handleApiError(error);
    }
}

async function deleteTicket(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tickets/delete/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        showNotification('Chamado excluído com sucesso', 'success');
        fetchTickets();
    } catch (error) {
        handleApiError(error);
    }
}

// ==================== CONFIGURAÇÕES API ====================

async function fetchGeneralSettings() {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/general`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
}

async function updateGeneralSettings(settings) {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/general`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(settings)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        showNotification('Configurações gerais atualizadas', 'success');
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
}

async function fetchNotificationSettings() {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/notifications`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
}

async function updateNotificationSettings(settings) {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/notifications`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(settings)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        showNotification('Configurações de notificação atualizadas', 'success');
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
}

// ==================== PERFIL API ====================

async function fetchProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/view`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const profile = await response.json();
        updateProfileSection(profile);
        return profile;
    } catch (error) {
        handleApiError(error);
    }
}

async function updateProfile(profileData) {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/edit`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        showNotification('Perfil atualizado com sucesso', 'success');
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
}

async function changePassword(passwordData) {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(passwordData)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        showNotification('Senha alterada com sucesso', 'success');
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
}

// ==================== RELATÓRIOS API ====================

async function exportCSV() {
    try {
        const response = await fetch(`${API_BASE_URL}/reports/export/csv`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        // Criar download do arquivo
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Relatório CSV exportado com sucesso', 'success');
    } catch (error) {
        handleApiError(error);
    }
}

async function exportPDF() {
    try {
        const response = await fetch(`${API_BASE_URL}/reports/export/pdf`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Relatório PDF exportado com sucesso', 'success');
    } catch (error) {
        handleApiError(error);
    }
}

// ==================== FUNÇÕES DE ATUALIZAÇÃO DA UI ====================

// Atualizar cards de métricas
function updateMetricsCards(metrics) {
    if (metrics.totaluser !== undefined) {
        const element = document.querySelector('.metric-card:nth-child(1) .metric-value');
        if (element) element.textContent = metrics.totaluser;
    }

    if (metrics.activeSessions !== undefined) {
        const element = document.querySelector('.metric-card:nth-child(2) .metric-value');
        if (element) element.textContent = metrics.activeSessions;
    }

    if (metrics.errorRate !== undefined) {
        const element = document.querySelector('.metric-card:nth-child(3) .metric-value');
        if (element) element.innerHTML = `${metrics.errorRate}<span class="unit">%</span>`;
    }

    if (metrics.responseTime !== undefined) {
        const element = document.querySelector('.metric-card:nth-child(4) .metric-value');
        if (element) element.innerHTML = `${metrics.responseTime}<span class="unit">ms</span>`;
    }

    if (metrics.useratisfaction !== undefined) {
        const element = document.querySelector('.metric-card:nth-child(5) .metric-value');
        if (element) element.innerHTML = `${metrics.useratisfaction}<span class="unit">/5</span>`;
    }
}

// Atualizar tabela de usuários recentes
function updateRecentuserTable(user) {
    const tbody = document.querySelector('.recent-user tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    user.forEach(user => {
        const row = document.createElement('tr');
        const statusClass = user.status === 'Ativo' ? 'status-active' : 'status-inactive';
        const statusText = user.status === 'Ativo' ? 'Ativo' : 'Inativo';

        row.innerHTML = `
            <td>${user.name || user.fullName}</td>
            <td>${user.email}</td>
            <td>${formatDate(user.registrationDate || user.createdAt)}</td>
            <td>${user.profileType || user.role}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

// Atualizar gráfico de distribuição de perfis
function updateDistributionChart(distribution) {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;

    // Destruir gráfico existente se houver
    if (window.distributionChartInstance) {
        window.distributionChartInstance.destroy();
    }

    window.distributionChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: distribution.labels,
            datasets: [{
                data: distribution.data,
                backgroundColor: distribution.colors || ['#3b82f6', '#8b5cf6', '#10b981'],
                borderWidth: 2,
                borderColor: '#ffffff'
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
                        usePointStyle: true
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Atualizar gráfico de cursos adquiridos
function updateCoursesChart(coursesData) {
    const ctx = document.getElementById('coursesChart');
    if (!ctx) return;

    // Destruir gráfico existente se houver
    if (window.coursesChartInstance) {
        window.coursesChartInstance.destroy();
    }

    window.coursesChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: coursesData.labels,
            datasets: [{
                label: 'Cursos Adquiridos',
                data: coursesData.data,
                backgroundColor: coursesData.color || '#3b82f6',
                borderColor: coursesData.color || '#3b82f6',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Atualizar timeline de atividades
function updateActivitiesTimeline(activities) {
    const timelineContainer = document.querySelector('.activity-timeline');
    if (!timelineContainer) return;

    timelineContainer.innerHTML = '';

    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';

        activityItem.innerHTML = `
            <div class="activity-icon" style="background: ${activity.color || '#3b82f6'};">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${formatRelativeTime(activity.timestamp)}</div>
            </div>
        `;

        timelineContainer.appendChild(activityItem);
    });
}

// Atualizar tabelas de usuários
function updateAdminsTable(admins) {
    const tbody = document.querySelector('#admins-section tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    admins.forEach(admin => {
        const row = document.createElement('tr');
        const statusClass = admin.status === 'Ativo' ? 'badge-active' : 'badge-inactive';
        
        row.innerHTML = `
            <td>${admin.name}</td>
            <td>${admin.email}</td>
            <td>${admin.accessLevel || admin.role}</td>
            <td><span class="badge-custom ${statusClass}">${admin.status}</span></td>
            <td>
                <button class="action-btn" onclick="openEditAdminModal('${admin.id}', '${admin.name}', '${admin.email}', '${admin.accessLevel || admin.role}', '${admin.status}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" title="Visualizar"><i class="fas fa-eye"></i></button>
                ${admin.role !== 'Super Admin' ? `<button class="action-btn" onclick="deleteAdmin('${admin.id}')" title="Excluir"><i class="fas fa-trash"></i></button>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateTeachersTable(teachers) {
    const tbody = document.querySelector('#teachers-section tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    teachers.forEach(teacher => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${teacher.name}</td>
            <td>${teacher.email}</td>
            <td>${teacher.coursesCreated || 0}</td>
            <td>⭐ ${teacher.rating || '4.5'}</td>
            <td>
                <button class="action-btn" onclick="openEditTeacherModal('${teacher.id}', '${teacher.name}', '${teacher.email}', '${teacher.coursesCreated || 0}', '${teacher.rating || '4.5'}', '${teacher.status || 'Ativo'}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" title="Visualizar"><i class="fas fa-eye"></i></button>
                <button class="action-btn" onclick="deleteTeacher('${teacher.id}')" title="Excluir"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateStudentsTable(students) {
    const tbody = document.querySelector('#students-section tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    students.forEach(student => {
        const row = document.createElement('tr');
        const statusClass = student.status === 'Ativo' ? 'badge-active' : 'badge-inactive';
        
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.enrolledCourses || 0}</td>
            <td><span class="badge-custom ${statusClass}">${student.status}</span></td>
            <td>
                <button class="action-btn" onclick="openEditStudentModal('${student.id}', '${student.name}', '${student.email}', '${student.enrolledCourses || 0}', '${student.status}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" title="Visualizar"><i class="fas fa-eye"></i></button>
                <button class="action-btn" onclick="deleteStudent('${student.id}')" title="Excluir"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Atualizar tabela de chamados
function updateTicketsTable(tickets) {
    const tbody = document.getElementById('called-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (tickets.length === 0) {
        document.getElementById('no-called-message').style.display = 'block';
        return;
    }

    document.getElementById('no-called-message').style.display = 'none';

    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 15px; font-size: 14px; color: #1e293b; font-weight: 500;">
                ${ticket.code}
            </td>
            <td style="padding: 15px; font-size: 13px; color: #64748b;">
                ${formatDate(ticket.createdAt)}<br>
                <span style="color: #94a3b8; font-size: 12px;">${formatTime(ticket.createdAt)}</span>
            </td>
            <td style="padding: 15px;">
                <i class="fas fa-solid fa-${getTicketStatusIcon(ticket.status)}" style="color: ${getTicketStatusColor(ticket.status)};" title="${ticket.status}"></i>
            </td>
            <td style="padding: 15px; font-size: 13px; color: #1e293b; max-width: 300px;">
                <div style="font-weight: 500; margin-bottom: 3px;">${ticket.subject}</div>
                <div style="color: #64748b; font-size: 12px;">${ticket.description}</div>
            </td>
            <td style="padding: 15px; font-size: 13px;">
                <div style="display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-play" style="color: #22c55e; font-size: 10px;"></i>
                    <span style="color: #1e293b; font-weight: 500;">${formatDate(ticket.expectedRelease)}</span>
                </div>
                <div style="margin-top: 5px; font-size: 12px; color: #64748b;">
                    ${formatTime(ticket.expectedRelease)}
                </div>
            </td>
            <td style="padding: 15px; font-size: 13px;">
                <div style="color: #1e293b; font-weight: 500;">${ticket.requesterName}</div>
                <div style="color: #64748b; font-size: 12px;">${ticket.requesterEmail}</div>
            </td>
            <td style="padding: 15px; font-size: 13px; color: #64748b;">${ticket.category}</td>
            <td style="padding: 15px; text-align: center;">${ticket.attachmentsCount || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Atualizar seção de perfil
function updateProfileSection(profile) {
    // Atualizar informações básicas
    const nameElement = document.querySelector('.profile-header-info h2');
    const emailElement = document.querySelector('.profile-header-info p');
    if (nameElement) nameElement.textContent = profile.name;
    if (emailElement) emailElement.textContent = profile.email;

    // Atualizar informações pessoais
    if (profile.phone) {
        const phoneElement = document.querySelector('.profile-info-item:nth-child(3) .info-value');
        if (phoneElement) phoneElement.textContent = profile.phone;
    }

    // Atualizar estatísticas se disponíveis
    if (profile.stats) {
        const stats = profile.stats;
        const statElements = document.querySelectorAll('.stat-value');
        if (statElements[0] && stats.actions) statElements[0].textContent = stats.actions;
        if (statElements[1] && stats.onlineTime) statElements[1].textContent = stats.onlineTime;
        if (statElements[2] && stats.userManaged) statElements[2].textContent = stats.userManaged;
        if (statElements[3] && stats.ticketsHandled) statElements[3].textContent = stats.ticketsHandled;
    }
}

// ==================== FUNÇÕES UTILITÁRIAS ====================

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatRelativeTime(timestamp) {
    if (!timestamp) return '';
    const now = new Date();
    const activityDate = new Date(timestamp);
    const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));

    if (diffInHours < 1) {
        return 'Há poucos minutos';
    } else if (diffInHours < 24) {
        return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
        return formatDate(timestamp);
    }
}

function getTicketStatusIcon(status) {
    const icons = {
        'aberto': 'spinner',
        'em_andamento': 'sync-alt',
        'finalizado': 'check',
        'cancelado': 'times'
    };
    return icons[status] || 'spinner';
}

function getTicketStatusColor(status) {
    const colors = {
        'aberto': '#3b82f6',
        'em_andamento': '#f59e0b',
        'finalizado': '#10b981',
        'cancelado': '#ef4444'
    };
    return colors[status] || '#64748b';
}

// ==================== FUNÇÃO PRINCIPAL DE CARREGAMENTO ====================

// Função principal para carregar todos os dados do dashboard
async function loadDashboardData() {
    try {
        await Promise.all([
            fetchMetrics(),
            fetchRecentuser(),
            fetchProfilesDistribution(),
            fetchCoursesAcquired(),
            fetchRecentActivities()
        ]);
    } catch (error) {
        handleApiError(error);
    }
}

// Carregar dados específicos por seção
async function loadSectionData(section) {
    switch (section) {
        case 'dashboard':
            await loadDashboardData();
            break;
        case 'admins':
            await fetchAdmins();
            break;
        case 'teachers':
            await fetchTeachers();
            break;
        case 'students':
            await fetchStudents();
            break;
        case 'called':
            await fetchTickets();
            break;
        case 'profile':
            await fetchProfile();
            break;
    }
}

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema administrativo inicializado');
    
    // Carregar dashboard por padrão
    loadDashboardData();
    
    // Adicionar listener para botão de atualização
    const refreshBtn = document.querySelector('.btn-icon[title="Atualizar"]');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const currentSection = document.querySelector('.main-content > div[style="display: block;"]').id.replace('-section', '');
            loadSectionData(currentSection);
            
            // Animação de rotação
            this.classList.add('rotating');
            setTimeout(() => {
                this.classList.remove('rotating');
            }, 1000);
        });
    }

    // Atualização automática a cada 5 minutos
    setInterval(() => {
        const currentSection = document.querySelector('.main-content > div[style="display: block;"]');
        if (currentSection && currentSection.id === 'dashboard-section') {
            loadDashboardData();
        }
    }, 5 * 60 * 1000);
});

// Função para forçar atualização (pode ser chamada de outros lugares)
function refreshCurrentSection() {
    const currentSection = document.querySelector('.main-content > div[style="display: block;"]').id.replace('-section', '');
    loadSectionData(currentSection);
}