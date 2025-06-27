// 🔥 Utilitários reutilizáveis
function maskMoney(input) {
    let value = input.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2) + '';
    value = value.replace('.', ',');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    input.value = 'R$ ' + value;
}

function parseCurrency(value) {
    return parseFloat(value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) || 0;
}

function getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
}

function getCheckboxChecked(id) {
    const element = document.getElementById(id);
    return element ? element.checked : false;
}

function toIsoDate(value) {
    return value ? new Date(value).toISOString() : null;
}

function nowIso() {
    return new Date().toISOString();
}

// 🔥 Define a validação de todos os campos
function validateFoodFormFields() {
    const requiredFields = [
        { id: 'name', label: 'Nome' },
        { id: 'description', label: 'Descrição' },
        { id: 'amount', label: 'Valor' },
        { id: 'dueDate', label: 'Vencimento' },
        { id: 'paidAt', label: 'Pagamento' },
        { id: 'foodCategory', label: 'Categoria' }
    ];

    for (const field of requiredFields) {
        const value = getInputValue(field.id);
        if (!value || value.trim() === '') {
            Swal.fire({
                timer: 4000,
                icon: 'warning',
                title: 'Campo obrigatório!',
                text: `O campo "${field.label}" deve ser preenchido.`,
            });
            return false;
        }
    }

    return true;
}

// 🔥 Define a data de hoje nos campos de data
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];

    const dueDateInput = document.getElementById('dueDate');
    const paidAtInput = document.getElementById('paidAt');

    if (dueDateInput) dueDateInput.value = today;
    if (paidAtInput) paidAtInput.value = today;
}

// 🔥 Carrega categorias no select
async function loadFoodCategories() {
    const select = document.getElementById('foodCategory');
    if (!select) return;

    try {
        select.innerHTML = `<option value="">⌛ Carregando categorias...</option>`;

        const response = await fetch(API_ROUTES.FOOD_CATEGORIES_EVENT_GETALL, {
            method: 'POST'
        });

        if (!response.ok) throw new Error('Erro ao solicitar categorias via fila');

        const { id: messageId } = await response.json();
        const categories = await pollFoodCategoryResult(messageId);

        select.innerHTML = '<option value="">Selecione uma categoria</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });

        return categories; // útil para uso no carregamento da despesa

    } catch (error) {
        console.error('Erro ao carregar categorias via fila:', error);
        select.innerHTML = '<option value="">❌ Erro ao carregar</option>';
        return [];
    }
}

// 🔥 Função que configura o formulário de cadastro
function setupFoodForm() {
    const form = document.getElementById('foodForm');
    if (!form) {
        console.error('Formulário não encontrado');
        return;
    }

    setTodayDate();
    loadFoodCategories();

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Valida os campos obrigatórios
        if (!validateFoodFormFields()) return;

        const data = {
            id: 0,
            name: getInputValue('name'),
            description: getInputValue('description'),
            amount: parseCurrency(getInputValue('amount')),
            dueDate: toIsoDate(getInputValue('dueDate')),
            paidAt: toIsoDate(getInputValue('paidAt')),
            foodCategoryId: parseInt(getInputValue('foodCategory')) || 0,
            isActive: getCheckboxChecked('isActive'),
            createdAt: nowIso(),
            updatedAt: nowIso(),
        };

        console.log('Enviando dados para API:', data);

        try {
            const response = await fetch(API_ROUTES.FOODS_ASYNC, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`Erro ao salvar despesa. Detalhe: ${errorDetail}`);
            }

            Swal.fire({
                timer: 4000,
                title: `A despesa ${data.name} foi cadastrada com sucesso!`,
                icon: "success",
                draggable: true
            });

            loadContent('food', 'food-list'); // Volta para a lista de despesas

        } catch (error) {
            console.error('Erro:', error);
            Swal.fire({
                timer: 4000,
                icon: "error",
                title: "Oops...",
                text: `Erro ao cadastrar a despesa ${data.name}!`,
                footer: `<a href="#">${error.message}</a>`
            });
        }
    });
}

// 🔥 Função que configura o formulário de edição
async function loadFoodDataToForm() {
    const id = localStorage.getItem('editingFoodId');
    if (!id) {
        alert('ID da despesa não encontrado.');
        return;
    }

    try {
        // Solicita os dados via fila
        const response = await fetch(API_ROUTES.FOODS_EVENT_GETBYID(id), {
            method: 'POST'
        });

        if (!response.ok) throw new Error('Erro ao buscar despesa via fila');

        const { id: messageId } = await response.json();
        const food = await pollFoodResult(messageId);
        console.log('🚨 Dados recebidos da fila:', food);

        // Carrega categorias e marca a correta
        const categories = await loadFoodCategories();

        const categorySelect = document.getElementById('foodCategory');
        categorySelect.value = food.foodCategoryId;

        // Preenche campos
        document.getElementById('name').value = food.name;
        document.getElementById('description').value = food.description;
        document.getElementById('amount').value = parseFloat(food.amount).toFixed(2).replace('.', ',');
        document.getElementById('dueDate').value = food.dueDate ? food.dueDate.split('T')[0] : '';
        document.getElementById('paidAt').value = food.paidAt ? food.paidAt.split('T')[0] : '';
        document.getElementById('isActive').checked = food.isActive;

        // Armazena dados para manter consistência na edição
        localStorage.setItem('editingFoodCreatedAt', food.createdAt);

    } catch (error) {
        console.error('Erro ao carregar despesa via fila:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: `Erro ao carregar dados para edição: ${error.message}`
        });
    }
}

function setupFoodEditSubmit() {
    const form = document.getElementById('foodFormUpdate');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const id = localStorage.getItem('editingFoodId');
        const createdAt = localStorage.getItem('editingFoodCreatedAt') || new Date().toISOString();

        if (!id || !validateFoodFormFields()) return;

        const updatedFood = {
            id: parseInt(id),
            name: getInputValue('name'),
            description: getInputValue('description'),
            amount: parseCurrency(getInputValue('amount')),
            dueDate: toIsoDate(getInputValue('dueDate')),
            paidAt: toIsoDate(getInputValue('paidAt')),
            foodCategoryId: parseInt(getInputValue('foodCategory')) || 0,
            isActive: getCheckboxChecked('isActive'),
            createdAt,
            updatedAt: nowIso()
        };

        try {
            const response = await fetch(API_ROUTES.FOODS_EVENT_UPDATE(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFood)
            });

            if (!response.ok) throw new Error('Erro ao enviar atualização para a fila');

            const responseJson = await response.json();
            const messageId = responseJson.id;

            const result = await pollFoodResult(messageId);
            console.log('🚨 Resultado do update:', result);
            
            Swal.fire({
                icon: 'success',
                title: `A despesa "${getInputValue('name')}" foi atualizada com sucesso!`,
                timer: 3000,
                showConfirmButton: false
            });

            localStorage.removeItem('editingFoodId');
            localStorage.removeItem('editingFoodCreatedAt');
            loadContent('food', 'food-list');

        } catch (error) {
            console.error('Erro ao atualizar via fila:', error);
            Swal.fire({
                timer: 4000,
                icon: 'error',
                title: 'Erro ao atualizar despesa',
                text: error.message
            });
        }
    });
}
async function pollFoodResult(messageId, retries = 15, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        const res = await fetch(API_ROUTES.FOODS_EVENT_RESULT(messageId));
        const data = await res.json();

        if (res.status === 200 && data.processed) {
            return data.response;
        }

        await new Promise(resolve => setTimeout(resolve, delay));
    }

    throw new Error("Tempo de espera excedido para resposta da fila.");
}

async function pollFoodCategoryResult(messageId, retries = 15, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        const res = await fetch(API_ROUTES.FOOD_CATEGORIES_EVENT_RESULT(messageId));
        const data = await res.json();

        if (res.status === 200 && data.processed) {
            return data.response;
        }

        await new Promise(resolve => setTimeout(resolve, delay));
    }

    throw new Error("Tempo de espera excedido para resposta da fila.");
}