  const form = document.getElementById('loginForm');
  const message = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.style.color = 'black';
      message.textContent = 'Verificando...';

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      const payload = { username, password };

      try {
        const response = await fetch(`https://localhost:7123/api/authentications/async`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
          },
          body: JSON.stringify(payload)
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

    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });