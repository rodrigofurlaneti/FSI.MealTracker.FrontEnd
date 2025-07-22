<<<<<<< HEAD
  const form = document.getElementById('loginForm');
  const message = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.style.color = 'black';
      message.textContent = 'Verificando...';

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
=======
function isAuthenticated() {
    const user = JSON.parse(localStorage.getItem("mealtracker:user") || "{}");
    return user.expiration && new Date(user.expiration) > new Date();
}

function loadContent(model, page) {
    const content = document.getElementById('main-content');
    const route = `pages/${model}/${page}.html`;

    // 🔐 Proteção de rotas: se não estiver logado, redireciona para login
    if (!isAuthenticated() && !(model === 'auth' && page === 'login')) {
        return loadContent('auth', 'login');
    }

    // ✅ Mostra ou oculta o menu lateral dinamicamente
    showSidebar(isAuthenticated());

    fetch(route)
        .then(response => {
            if (!response.ok) throw new Error('Página não encontrada');
            return response.text();
        })
        .then(html => {
            content.innerHTML = html;
>>>>>>> e781e1d8d4826fa7a2818727dadeb87982e0881f

      const payload = { username, password };

<<<<<<< HEAD
      try {
        const response = await fetch(`https://localhost:7123/api/authentications/async`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
          },
          body: JSON.stringify(payload)
=======
            // ✅ Remove script anterior
            document.querySelectorAll(`script[src="${scriptPath}"]`).forEach(s => s.remove());

            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = () => handlePageLoad(model, page);
            script.onerror = () => {
                content.innerHTML = `<h2>Erro</h2><p>Script ${scriptPath} não encontrado.</p>`;
            };
            document.body.appendChild(script);

            window.location.hash = `${model}/${page}`;
        })
        .catch(error => {
            content.innerHTML = `<h2>Erro</h2><p>${error.message}</p>`;
>>>>>>> e781e1d8d4826fa7a2818727dadeb87982e0881f
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('user', JSON.stringify(data));
          message.style.color = 'green';
          message.textContent = 'Login realizado com sucesso!';

          setTimeout(() => {
            window.location.href = 'home.html'; // Altere para sua próxima página
          }, 1000);
        } else {
          message.style.color = 'red';
          message.textContent = data.errorMessage || 'Erro ao autenticar.';
        }
      } catch (err) {
        console.error(err);
        message.style.color = 'red';
        message.textContent = 'Erro ao conectar com o servidor.';
      }
    });

    // Alternar visibilidade da senha
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

<<<<<<< HEAD
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });
=======
    const btn = document.getElementById("languageDropdown");
    btn.innerHTML = `<img src="assets/img/flags/${langMap[lang].flag}" width="20"> ${langMap[lang].label}`;
}

window.addEventListener("load", () => {
    const hash = window.location.hash.replace("#", "");
    const [model, page] = hash.split("/");
    loadContent(model || 'auth', page || 'login'); // abre login por padrão
});

window.addEventListener("hashchange", () => {
    const [model, page] = window.location.hash.replace("#", "").split("/");
    loadContent(model, page);
});

function logout() {
    localStorage.removeItem("mealtracker:user");
    window.location.hash = "auth/login";
}

function showSidebar(show) {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;
    sidebar.style.display = show ? "block" : "none";
}
>>>>>>> e781e1d8d4826fa7a2818727dadeb87982e0881f
