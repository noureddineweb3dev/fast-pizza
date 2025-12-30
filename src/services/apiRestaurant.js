const API_URL = import.meta.env.VITE_SAMURAI_PIZZA_API_URL;

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data.data;
}

export function getMenu() {
  return fetchJSON(`${API_URL}/menu`);
}

export function getOrder(id) {
  return fetchJSON(`${API_URL}/order/${id}`);
}

export function createOrder(newOrder) {
  return fetchJSON(`${API_URL}/order`, {
    method: 'POST',
    body: JSON.stringify(newOrder),
  });
}

export function updateOrder(id, updateObj) {
  return fetchJSON(`${API_URL}/order/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateObj),
  });
}
