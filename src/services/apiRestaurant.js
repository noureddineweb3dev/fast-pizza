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

// Helper to standardise menu items from DB (snake_case) to Frontend (camelCase)
function transformMenuItem(item) {
  const unitPrice = item.unit_price ?? item.unitPrice;
  const image = item.image_url ?? item.image;
  const soldOut = item.sold_out ?? item.soldOut;
  const ingredients = typeof item.ingredients === 'string' ? JSON.parse(item.ingredients) : item.ingredients;

  return {
    ...item,
    unitPrice,
    image,
    soldOut,
    available: !soldOut,
    ingredients
  };
}

export async function login(identifier, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }), // Backend expects identifier
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

export async function signup(fullName, email, phone, password, address) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, phone, password, address }),
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

export async function getAdmins() {
  const res = await fetch(`${API_URL}/api/auth/admins`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch admins');
  return data.data; // data.data contains the array of users
}

export async function updateAdminUser(id, userData) {
  const res = await fetch(`${API_URL}/api/auth/admins/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update user');
  return data.data.user;
}

export async function deleteAdminUser(id) {
  const res = await fetch(`${API_URL}/api/auth/admins/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Failed to delete user');
  }
}

export async function getMenu() {
  const menu = await fetchJSON(`${API_URL}/api/menu`);
  return menu.map(transformMenuItem);
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

export async function getAdminStats() {
  return fetchJSON(`${API_URL}/api/orders/stats`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

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

  const data = await fetchJSON(`${API_URL}/api/menu/${id}`, {
    method: 'PATCH',
    body,
  });

  return transformMenuItem(data);
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

  const data = await fetchJSON(`${API_URL}/api/menu`, {
    method: 'POST',
    body,
  });

  return transformMenuItem(data);
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

// ============ FAVORITES FUNCTIONS ============

export async function fetchFavorites() {
  const data = await fetchJSON(`${API_URL}/api/favorites`);
  return data.map(transformMenuItem);
}

export async function apiAddFavorite(pizzaId) {
  const data = await fetchJSON(`${API_URL}/api/favorites`, {
    method: 'POST',
    body: JSON.stringify({ pizzaId }),
  });
  return transformMenuItem(data);
}

export async function apiRemoveFavorite(pizzaId) {
  return fetchJSON(`${API_URL}/api/favorites/${pizzaId}`, {
    method: 'DELETE',
  });
}
