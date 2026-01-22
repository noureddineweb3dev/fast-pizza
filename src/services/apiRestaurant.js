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
  console.log('API Response:', data);

  return data.data;
}

export async function getMenu() {
  const menu = await fetchJSON(`${API_URL}/menu`);
  // Map 'price' from API to 'unitPrice' used by app
  return menu.map(item => ({ ...item, unitPrice: item.price }));
}

export function getOrder(id) {
  return fetchJSON(`${API_URL}/orders/${id}`);
}

export function createOrder(newOrder) {
  return fetchJSON(`${API_URL}/orders`, {
    method: 'POST',
    body: JSON.stringify(newOrder),
  });
}

export function updateOrder(id, updateObj) {
  return fetchJSON(`${API_URL}/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateObj),
  });
}
