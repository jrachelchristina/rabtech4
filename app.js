// app.js - UI, filtering, sorting, and browser-side cart state.
import { fetchProducts, fetchCategories } from './api.js';

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const categoryTabs = document.getElementById('category-tabs');
const statusMessage = document.getElementById('status-message');
const errorBanner = document.getElementById('error-banner');
const errorText = document.getElementById('error-text');
const retryButton = document.getElementById('retry-button');
const cartCount = document.getElementById('cart-count');

let products = [];
let activeCategory = 'all';

// Restore the cart from localStorage when the page opens.
let cart = JSON.parse(localStorage.getItem('shoplite-cart') || '[]');

function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function saveCart() {
  localStorage.setItem('shoplite-cart', JSON.stringify(cart));
  updateCartCount();
}

function showLoading() {
  statusMessage.textContent = 'Loading products...';
  productGrid.innerHTML = Array.from({ length: 8 }, () =>
    '<div class="skeleton-card"><div class="skeleton-image"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>'
  ).join('');
}

function showError(message) {
  errorText.textContent = message;
  errorBanner.hidden = false;
  statusMessage.textContent = '';
  productGrid.innerHTML = '';
}

async function loadProducts() {
  errorBanner.hidden = true;
  showLoading();

  try {
    // Fetch product and category data concurrently.
    const [productData, categoryData] = await Promise.all([
      fetchProducts(),
      fetchCategories()
    ]);

    products = productData;
    renderCategoryTabs(categoryData);
    renderProducts();
    statusMessage.textContent = `${products.length} products available`;
  } catch (error) {
    showError(error.message || 'Unable to connect. Check your internet and try again.');
  }
}

function renderCategoryTabs(categories) {
  categoryTabs.innerHTML = '';

  const allButton = createCategoryButton('all', 'All products');
  categoryTabs.appendChild(allButton);

  categories.forEach(category => {
    categoryTabs.appendChild(createCategoryButton(category, category));
  });
}

function createCategoryButton(category, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `category-tab ${activeCategory === category ? 'active' : ''}`;
  button.dataset.category = category;
  button.textContent = label;
  return button;
}

function getVisibleProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  let visibleProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  const sortMode = sortSelect.value;

  if (sortMode === 'low-high') {
    visibleProducts.sort((a, b) => a.price - b.price);
  } else if (sortMode === 'high-low') {
    visibleProducts.sort((a, b) => b.price - a.price);
  } else if (sortMode === 'name') {
    visibleProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortMode === 'rating') {
    visibleProducts.sort((a, b) => b.rating.rate - a.rating.rate);
  }

  return visibleProducts;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.innerHTML = '';

  if (visibleProducts.length === 0) {
    statusMessage.textContent = 'No products match your search.';
    return;
  }

  statusMessage.textContent = `${visibleProducts.length} product(s) found`;

  visibleProducts.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';

    const image = document.createElement('img');
    image.className = 'product-image';
    image.src = product.image;
    image.alt = product.title;
    image.loading = 'lazy';

    const details = document.createElement('div');
    details.className = 'product-details';

    const category = document.createElement('p');
    category.className = 'product-category';
    category.textContent = product.category;

    const title = document.createElement('h2');
    title.textContent = product.title;

    const rating = document.createElement('p');
    rating.className = 'rating';
    rating.textContent = `★ ${product.rating.rate} · ${product.rating.count} reviews`;

    const bottom = document.createElement('div');
    bottom.className = 'product-bottom';

    const price = document.createElement('strong');
    price.className = 'price';
    price.textContent = `$${product.price.toFixed(2)}`;

    const addButton = document.createElement('button');
    addButton.className = 'add-button';
    addButton.type = 'button';
    addButton.textContent = 'Add to cart';
    addButton.addEventListener('click', () => addToCart(product.id));

    bottom.append(price, addButton);
    details.append(category, title, rating, bottom);
    card.append(image, details);
    productGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
}

searchInput.addEventListener('input', renderProducts);
sortSelect.addEventListener('change', renderProducts);

categoryTabs.addEventListener('click', event => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;

  activeCategory = button.dataset.category;
  categoryTabs.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === activeCategory);
  });
  renderProducts();
});

retryButton.addEventListener('click', loadProducts);

updateCartCount();
loadProducts();
