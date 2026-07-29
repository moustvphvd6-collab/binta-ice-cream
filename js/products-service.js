import { API_BASE_URL } from "./api-config.js";

const TOKEN_KEY = "binta_admin_token";
const EMAIL_KEY = "binta_admin_email";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders(extra = {}) {
  const token = getToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

async function handleResponse(res) {
  let data = null;
  try { data = await res.json(); } catch (_) { /* réponse vide, ex: 204 */ }
  if (!res.ok) {
    throw new Error(data?.message || `Erreur serveur (${res.status})`);
  }
  return data;
}

function friendlyNetworkError(err) {
  if (err instanceof TypeError) {
    // "Failed to fetch" = le serveur API n'est pas joignable
    return new Error(
      "Impossible de contacter le serveur. Vérifiez qu'il est bien lancé (npm run dev dans le dossier server/) " +
      "et que l'adresse dans js/api-config.js est correcte."
    );
  }
  return err;
}

/* ============ Produits ============ */

/**
 * Abonne un callback à la liste des produits.
 * L'API REST n'étant pas "temps réel", on récupère les produits
 * immédiatement puis on rafraîchit automatiquement toutes les 20s
 * (utile si un autre appareil modifie le catalogue en même temps).
 * Retourne une fonction "unsubscribe" pour arrêter le rafraîchissement.
 */
export function subscribeProducts(callback) {
  let cancelled = false;

  async function fetchProducts() {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const products = await handleResponse(res);
      if (!cancelled) callback(products);
    } catch (err) {
      console.warn("Impossible de charger les produits depuis l'API.", friendlyNetworkError(err));
    }
  }

  fetchProducts();
  const interval = setInterval(fetchProducts, 20000);

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}

export async function saveProduct(product) {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(product)
    });
    return await handleResponse(res);
  } catch (err) {
    throw friendlyNetworkError(err);
  }
}

export async function updateProductFields(id, data) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (err) {
    throw friendlyNetworkError(err);
  }
}

export async function removeProduct(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: authHeaders()
    });
    return await handleResponse(res);
  } catch (err) {
    throw friendlyNetworkError(err);
  }
}

export async function uploadProductImage(file) {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: authHeaders(), // pas de Content-Type ici : le navigateur gère le multipart/boundary
      body: formData
    });
    const data = await handleResponse(res);
    return data.url;
  } catch (err) {
    throw friendlyNetworkError(err);
  }
}

export function isApiReady() {
  return Boolean(API_BASE_URL);
}

/* ============ Authentification admin ============ */

let authListeners = [];

function notifyAuthListeners(user) {
  authListeners.forEach((cb) => cb(user));
}

export async function loginAdmin(email, password) {
  let data;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    data = await handleResponse(res);
  } catch (err) {
    throw friendlyNetworkError(err);
  }
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(EMAIL_KEY, data.email);
  notifyAuthListeners({ email: data.email });
}

export function logoutAdmin() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
  notifyAuthListeners(null);
  return Promise.resolve();
}

/**
 * Appelle callback(user) immédiatement avec l'état actuel (déduit du
 * token stocké), puis à nouveau à chaque connexion/déconnexion.
 * Vérifie aussi en tâche de fond que le token est toujours valide côté
 * serveur (utile s'il a expiré) et déconnecte silencieusement sinon.
 * Retourne une fonction pour se désabonner.
 */
export function watchAuth(callback) {
  authListeners.push(callback);

  const token = getToken();
  if (!token) {
    callback(null);
  } else {
    callback({ email: localStorage.getItem(EMAIL_KEY) || "admin" });
    fetch(`${API_BASE_URL}/auth/me`, { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("token invalide");
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EMAIL_KEY);
        notifyAuthListeners(null);
      });
  }

  return () => {
    authListeners = authListeners.filter((cb) => cb !== callback);
  };
}
