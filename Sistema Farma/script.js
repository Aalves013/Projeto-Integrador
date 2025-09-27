// Configuração da API - ALTERE AQUI PARA SUA URL
const API_BASE = "http://185.137.122.137:3011"; // ou sua URL do projeto
let currentUser = null;

// Função para mostrar alertas
function showAlert(containerId, message, type = "error") {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        container.innerHTML = "";
    }, 5000);
}

// Função para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Erro na requisição");
        }
        return data;
    } catch (error) {
        console.error("Erro na API:", error);
        throw error;
    }
}

// Navegação entre telas
function showLogin() {
    document.getElementById("loginForm").classList.add("active");
    document.getElementById("registerForm").classList.remove("active");
    document.getElementById("dashboard").classList.remove("active");
}

function showRegister() {
    document.getElementById("loginForm").classList.remove("active");
    document.getElementById("registerForm").classList.add("active");
    document.getElementById("dashboard").classList.remove("active");
}

function showDashboard() {
    document.getElementById("loginForm").classList.remove("active");
    document.getElementById("registerForm").classList.remove("active");
    document.getElementById("dashboard").classList.add("active");
    loadUsers();
}

// Login
document.getElementById("loginFormElement").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    try {
        const response = await apiRequest("/api/login", {
            method: "POST",
            body: JSON.stringify({ email, senha }),
        });

        currentUser = response.user;
        showDashboard();
    } catch (error) {
        showAlert("loginAlert", "Erro ao realizar login. Verifique suas credenciais.");
    }
});

// Função para carregar usuários (exemplo de como carregar dados)
async function loadUsers() {
    try {
        const users = await apiRequest("/api/users");
        const usersList = document.getElementById("usersList");
        usersList.innerHTML = users.map(user => `<div class="user-item">${user.name}</div>`).join("");
    } catch (error) {
        showAlert("dashboardAlert", "Erro ao carregar usuários.");
    }
}
