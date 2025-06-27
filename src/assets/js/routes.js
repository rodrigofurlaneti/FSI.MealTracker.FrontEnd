// Arquivo: assets/js/routes.js

const API_BASE_URL = "https://localhost:7124/api";

const API_ROUTES = {

    // Foods
    FOODS_ASYNC: `${API_BASE_URL}/foods/async`,
    FOODS_ORDERED_ASYNC: (orderBy, direction = 'asc') => `${API_BASE_URL}/foods/async/ordered?orderBy=${orderBy}&direction=${direction}`,
    FOODS_ORDERED_SYNC: (orderBy, direction = 'asc') => `${API_BASE_URL}/foods/sync/ordered?orderBy=${orderBy}&direction=${direction}`,
    FOODS_FILTERED_ASYNC: (filterBy, value) => `${API_BASE_URL}/foods/async/filtered?filterBy=${filterBy}&value=${encodeURIComponent(value)}`,
    FOODS_SYNC: `${API_BASE_URL}/foods/sync`,
    FOODS_GETBYID_ASYNC: `${API_BASE_URL}/foods/async/{id}`,
    FOODS_GETBYID_SYNC: `${API_BASE_URL}/foods/sync/{id}`,
    FOODS_UPDATE_ASYNC: `${API_BASE_URL}/foods/async/{id}`,
    FOODS_UPDATE_SYNC: `${API_BASE_URL}/foods/sync/{id}`,

    // Foods - Event Driven via Messaging
    FOODS_EVENT_CREATE: `${API_BASE_URL}/foods/async/event/create`,
    FOODS_EVENT_GETALL: `${API_BASE_URL}/foods/async/event/getall`,
    FOODS_EVENT_GETBYID: (id) => `${API_BASE_URL}/foods/async/event/getbyid/${id}`,
    FOODS_EVENT_UPDATE: (id) => `${API_BASE_URL}/foods/async/event/update/${id}`,
    FOODS_EVENT_DELETE: (id) => `${API_BASE_URL}/foods/async/event/delete/${id}`,
    FOODS_EVENT_RESULT: (messagingId) => `${API_BASE_URL}/foods/async/event/result/${messagingId}`,
};