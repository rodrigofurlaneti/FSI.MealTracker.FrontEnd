function loadContent(model, page) {

    const content = document.getElementById('main-content');
    
    const route = `pages/${model}/${page}.html`;

    fetch(route)
        .then(response => {
            if (!response.ok) throw new Error('Página não encontrada');
            return response.text();
        })
        .then(html => {
            content.innerHTML = html;

            // Carrega JS específico
            const scriptPath = `assets/js/${model}/${page}.js`;

            // ✅ Remove script anterior se já estiver carregado
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
        });
}

function handlePageLoad(model, page) {
    switch (`${model}/${page}`) {
        case 'food/food-list':
            loadFoods(); // Essa função deve estar no arquivo JS da página
            break;
        case 'food/food-insert':
            setupFoodForm();
            break;
        case 'food/food-update':
            loadFoodDataToForm();
            setupFoodEditSubmit();
            break;
        default:
            console.warn(`No action defined for ${model}/${page}`);
            break;
    }
}

function switchLanguage() {
    const lang = document.getElementById("language-select").value;
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

function setLanguage(lang) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Atualiza o botão para mostrar o idioma atual
    const langMap = {
        en: { label: "English", flag: "en.png" },
        es: { label: "Español", flag: "es.png" },
        pt: { label: "Português", flag: "pt.png" }
    };

    const btn = document.getElementById("languageDropdown");
    btn.innerHTML = `<img src="assets/img/flags/${langMap[lang].flag}" width="20"> ${langMap[lang].label}`;
}