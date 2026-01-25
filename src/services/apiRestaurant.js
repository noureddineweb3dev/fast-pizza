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
      // If we are in an admin route or have admin data, go to admin login
      if (window.location.pathname.startsWith('/admin') || localStorage.getItem('adminData')) {
        localStorage.removeItem('adminData');
        window.location.href = '/admin/login';
      } else {
        // Otherwise go to regular user login
        window.location.href = '/login';
      }
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
    body: JSON.stringify({ identifier: email, password }), // Backend expects identifier
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function loginAdmin(username, password) {
  const res = await fetch(`${API_URL}/api/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Admin login failed');
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

export async function createAdminUser(fullName, username, password, role) {
  const res = await fetch(`${API_URL}/api/auth/create-admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ fullName, username, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create user');
  return data;
}

export async function getMenu() {
  const menu = await fetchJSON(`${API_URL}/api/menu`);
  // Map database snake_case fields to frontend camelCase
  return menu.map(item => ({
    ...item,
    unitPrice: item.unit_price, // Database has unit_price, not price
    image: item.image_url,      // Database has image_url
    soldOut: item.sold_out,     // Database has sold_out
    available: !item.sold_out,  // Frontend uses available
    // Ensure ingredients is an array if it comes as a JSON string
    ingredients: typeof item.ingredients === 'string' ? JSON.parse(item.ingredients) : item.ingredients
  }));
}

export function getOrder(id) {
  return fetchJSON(`${API_URL}/api/orders/${id}`);
}

export function getMyOrders() {
  return fetchJSON(`${API_URL}/api/orders/own`);
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
  let body;
  const isFormData = updateObj instanceof FormData;

  if (isFormData) {
    if (updateObj.has('available')) {
      // Convert 'available' to 'soldOut'
      // FormData values are strings, so "true" becomes soldOut=false
      const isAvailable = updateObj.get('available') === 'true' || updateObj.get('available') === true;
      updateObj.set('soldOut', !isAvailable);
      updateObj.delete('available');
    }
    body = updateObj;
  } else {
    // JSON
    const payload = { ...updateObj };
    if (payload.available !== undefined) {
      payload.soldOut = !payload.available;
      delete payload.available;
    }
    body = JSON.stringify(payload);
  }

  return fetchJSON(`${API_URL}/api/menu/${id}`, {
    method: 'PATCH',
    body,
  });
}

export async function createMenuItem(newItem) {
  let body;
  const isFormData = newItem instanceof FormData;

  if (isFormData) {
    if (newItem.has('available')) {
      const isAvailable = newItem.get('available') === 'true' || newItem.get('available') === true;
      newItem.set('soldOut', !isAvailable);
      newItem.delete('available');
    }
    body = newItem;
  } else {
    const payload = { ...newItem };
    if (payload.available !== undefined) {
      payload.soldOut = !payload.available;
      delete payload.available;
    }
    body = JSON.stringify(payload);
  }

  return fetchJSON(`${API_URL}/api/menu`, {
    method: 'POST',
    body,
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
