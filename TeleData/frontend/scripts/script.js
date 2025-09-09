document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const remember = document.getElementById('remember').checked;
            
            if (!email || !password) {
                showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Por favor, insira um email válido.', 'error');
                return;
            }

            const submitButton = loginForm.querySelector('.btn-entrar');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Entrando...';
            submitButton.disabled = true;
            
            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                let data;
                try {
                    data = await response.json();
                } catch {
                    data = { message: await response.text() };
                }
                
                if (response.ok) {
                    showMessage('Login realizado com sucesso!', 'success');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    if (remember) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                    
                    setTimeout(() => {
                        window.location.href = 'pages/dashboard.html';
                    }, 1000);
                } else {
                    showMessage(data.message || 'Erro ao fazer login. Tente novamente.', 'error');
                }
                
            } catch (error) {
                console.error('Erro:', error);
                showMessage('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    checkAuthentication();
    setupSocialButtons();
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) existingMessage.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        padding: 15px 20px; border-radius: 8px;
        color: white; font-weight: bold; z-index: 1000;
        animation: slideIn 0.3s ease; max-width: 300px;
    `;
    
    messageDiv.style.backgroundColor = type === 'success' ? '#10B981' :
                                      type === 'error' ? '#EF4444' : '#3B82F6';

    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

function checkAuthentication() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user && window.location.pathname.includes('login.html')) {
        window.location.href = 'pages/dashboard.html';
    }
    updateAuthUI(!!token);
}

function updateAuthUI(isLoggedIn) {
    const loginButton = document.querySelector('.btn-login');
    const registerButton = document.querySelector('.btn-cadastro');
    
    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (loginButton) {
            loginButton.textContent = user.full_name || 'Minha Conta';
            loginButton.onclick = () => window.location.href = 'pages/profile.html';
        }
        if (registerButton) {
            registerButton.textContent = 'Sair';
            registerButton.onclick = logout;
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    window.location.href = 'index.html';
}

function setupSocialButtons() {
    const googleBtn = document.querySelector('.social-btn.google');
    const facebookBtn = document.querySelector('.social-btn.facebook');
    
    if (googleBtn) googleBtn.addEventListener('click', () => showMessage('Login com Google em desenvolvimento.', 'info'));
    if (facebookBtn) facebookBtn.addEventListener('click', () => showMessage('Login com Facebook em desenvolvimento.', 'info'));
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    .btn-entrar:disabled { opacity: 0.7; cursor: not-allowed; }
`;
document.head.appendChild(style);
