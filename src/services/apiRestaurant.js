const API_URL = import.meta.env.VITE_SAMURAI_PIZZA_API_URL;

async function fetchJSON(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': (options.body && options.body instanceof FormData) ? undefined : 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Remove Content-Type if undefined (fetch handles boundary for FormData)
  if (headers['Content-Type'] === undefined) {
    delete headers['Content-Type'];
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminData');
      window.location.href = '/admin/login'; // Force redirect to login
    }
    throw new Error(data.message || 'Something went wrong');
  }
  // console.log('API Response:', data);

  return data.data;
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function signup(fullName, email, password) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Signup failed');
  return data;
}

export async function createAdminUser(fullName, email, password, role) {
  const res = await fetch(`${API_URL}/api/auth/create-admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ fullName, email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create user');
  return data;
}

export async function getMenu() {
  const menu = await fetchJSON(`${API_URL}/api/menu`);
  // Map 'price' from API to 'unitPrice' used by app
  return menu.map(item => ({ ...item, unitPrice: item.price }));
}

export function getOrder(id) {
  return fetchJSON(`${API_URL}/api/orders/${id}`);
}

export function createOrder(newOrder) {
  return fetchJSON(`${API_URL}/api/orders`, {
    method: 'POST',
    body: JSON.stringify(newOrder),
  });
}

export function updateOrder(id, updateObj) {
  return fetchJSON(`${API_URL}/api/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateObj),
  });
}

// ============ ADMIN FUNCTIONS ============

export async function getAllOrders() {
  return fetchJSON(`${API_URL}/api/orders`);
}

export async function updateMenuItem(id, updateObj) {
  const isFormData = updateObj instanceof FormData;
  return fetchJSON(`${API_URL}/api/menu/${id}`, {
    method: 'PATCH',
    body: isFormData ? updateObj : JSON.stringify(updateObj),
  });
}

export async function createMenuItem(newItem) {
  const isFormData = newItem instanceof FormData;
  return fetchJSON(`${API_URL}/api/menu`, {
    method: 'POST',
    body: isFormData ? newItem : JSON.stringify(newItem),
  });
}

export async function deleteMenuItem(id) {
  return fetchJSON(`${API_URL}/api/menu/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteOrder(id) {
  return fetchJSON(`${API_URL}/api/orders/${id}`, {
    method: 'DELETE',
  });
}
