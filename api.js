// api.js - keeps all REST API communication in one place.
const API_BASE_URL = 'https://fakestoreapi.com';

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);

  // fetch() only rejects for network errors, so check HTTP status ourselves.
  if (!response.ok) {
    throw new Error(`Could not load products (HTTP ${response.status}).`);
  }

  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/products/categories`);

  if (!response.ok) {
    throw new Error(`Could not load categories (HTTP ${response.status}).`);
  }

  return response.json();
}
