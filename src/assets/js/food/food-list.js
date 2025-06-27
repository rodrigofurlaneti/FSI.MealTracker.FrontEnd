if (!window.foodScriptLoaded) {

    window.foodScriptLoaded = true;

    async function loadFoods() {

        const tbody = document.getElementById('food-table-body');

        if (!tbody) return;

        tbody.innerHTML = `<tr><td colspan="7">⌛ Sending request via queue...</td></tr>`;

        try {

            console.log(API_ROUTES.FOODS_EVENT_GETALL);

            const response = await fetch(API_ROUTES.FOODS_EVENT_GETALL, {
                method: 'POST'
            });

            if (!response.ok) throw new Error("Failed to send request to queue");

            const result = await response.json();
            const messageId = result.id;

            const pollResult = await pollMessagingResult(messageId);

            renderAllFoodViews(pollResult, API_ROUTES.FOODS_EVENT_GETALL);

        } catch (error) {
            console.error("Error loading expenses via messaging:", error);
            tbody.innerHTML = `<tr><td colspan="7">❌ Erro: ${error.message}</td></tr>`;
        }
    }

    async function pollMessagingResult(messageId, retries = 15, delay = 1000) {
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

    function renderFoods(foods, reloadUrl) {
        const tbody = document.getElementById('food-table-body');
        tbody.innerHTML = '';

        if (!foods || foods.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No expenses found.</td></tr>';
            return;
        }

        foods.forEach(food => {

            const name = food.name || '';
            const caloriesPerPortion = food.caloriesPerPortion || '';
            const standardPortion = food.standardPortion || '';

            tbody.innerHTML += `
                <tr>
                    <td class="text-center font-size">${name}</td>
                    <td class="text-center font-size">${caloriesPerPortion}</td>
                    <td class="text-center font-size">${standardPortion}</td>
                    <td class="text-center font-size">
                        <button class="btn btn-warning btn-sm btn-food-edit" 
                                title="Editar"
                                data-id="${food.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-food-delete" 
                                title="Excluir"
                                data-id="${food.id}" 
                                data-name="${name}"
                                data-reload="${reloadUrl}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        document.querySelectorAll('.btn-food-delete').forEach(button => {
            button.addEventListener('click', async function () {
                const foodId = this.getAttribute('data-id');
                const foodName = this.getAttribute('data-name');
                const reloadUrl = this.getAttribute('data-reload');

                const result = await Swal.fire({
                    title: `You want to delete the food "${foodName}"?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Não',
                });

                if (result.isConfirmed) {
                    try {
                        const deleteUrl = API_ROUTES.FOODS_EVENT_DELETE(foodId);
                        const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });

                        if (!deleteResponse.ok) throw new Error('Error deleting comida');

                        const responseJson = await deleteResponse.json();
                        const messageId = responseJson.id;

                        const pollResult = await pollMessagingResult(messageId);

                        Swal.fire({
                            icon: 'success',
                            title: 'Food successfully deleted!',
                            timer: 3000,
                            showConfirmButton: false
                        });

                        loadFoods();

                    } catch (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: `Failed to delete food: ${error.message}`,
                            timer: 4000
                        });
                    }
                }
            });
        });

        document.querySelectorAll('.btn-food-edit').forEach(button => {
            button.addEventListener('click', function () {
                const foodId = this.getAttribute('data-id');
                localStorage.setItem('editingFoodId', foodId);
                loadContent('food', 'food-update');
            });
        });

        document.getElementById('food-table-body').classList.add('loaded');
    }

    // 🆕 Função com ordenação: recebe a URL da rota ordenada
    async function loadFoodsOrdered(apiUrl) {
        const tbody = document.getElementById('food-table-body');
        if (!tbody) {
            console.error('Food table not found');
            return;
        }

        tbody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) throw new Error('Error fetching sorted data from API');

            const foods = await response.json();

            renderAllFoodViews(foods, API_ROUTES.FOODS_ASYNC);

        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="6">Erro: ${error.message}</td></tr>`;
            console.error('Error loading ordered foods:', error);
        }

        document.getElementById('food-table-body').classList.add('loaded');
    }

    function renderAllFoodViews(foods, reloadUrl) {

        // ✅ Chama a função para renderizar as despesas ← agora sim, com as cores certas
        renderFoods(foods, reloadUrl);
    }

    // Coloque isso DENTRO do if, ao final:
    window.loadFoods = loadFoods;

    document.addEventListener('DOMContentLoaded', () => {

        loadFoods();

    });
}

