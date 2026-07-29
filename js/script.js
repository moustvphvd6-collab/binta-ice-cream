import { ICONS, CATEGORY_LABEL } from "./products-seed.js";
import { subscribeProducts } from "./products-service.js";

/* ============ Config ============ */
const WHATSAPP_NUMBER = "221711324718"; // 77 132 47 18 au format international

/* ============ Catalogue produits (rempli en temps réel depuis l'API) ============ */
let PRODUCTS = [];

/* ============ Utilitaires ============ */
const fmt = (n) => n.toLocaleString("fr-FR") + " FCFA";
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ============ Etat panier (localStorage) ============ */
let cart = loadCart();

function loadCart() {
  try {
    const raw = localStorage.getItem("binta_cart");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}
function saveCart() {
  try { localStorage.setItem("binta_cart", JSON.stringify(cart)); } catch (e) {}
}

/* ============ Apparition au scroll ============ */
const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 })
  : null;

function observeReveals(root = document) {
  if (!revealObserver) {
    root.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }
  root.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => revealObserver.observe(el));
}

/* ============ Rendu catalogue ============ */
const grid = $("#productGrid");
let activeFilter = "tous";

function renderGrid() {
  grid.innerHTML = "";
  const items = PRODUCTS.filter((p) => activeFilter === "tous" || p.category === activeFilter);
  items.forEach((p, index) => {
    const qty = cart[p.id]?.qty || 0;
    const card = document.createElement("div");
    card.className = "card reveal";
    card.style.setProperty("--i", index % 8);
    const visualStyle = p.imageUrl
      ? `background-image: url('${p.imageUrl}'); background-size: cover; background-position: center; background-repeat: no-repeat;`
      : `background:linear-gradient(135deg, ${p.swatch[0]}, ${p.swatch[1]})`;
    card.innerHTML = `
      <div class="card__visual" style="${visualStyle}">
        <span class="card__pack-badge">${CATEGORY_LABEL[p.category]}</span>
        <div class="card__icon">${ICONS[p.category]}</div>
      </div>
      <div class="card__body">
        <h3 class="card__name">${p.name}</h3>
        <p class="card__desc">${p.desc}</p>
        <div class="card__price-row">
          <span class="card__price">${fmt(p.boxPrice)}</span>
          <span class="card__unit">${p.pack} pièces · ${p.unitPrice} F/unité</span>
        </div>
        <div class="card__qty">
          <button class="qty-btn" data-action="dec" data-id="${p.id}" aria-label="Diminuer">−</button>
          <span class="qty-val" data-qtyval="${p.id}">${qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${p.id}" aria-label="Augmenter">+</button>
        </div>
        <button class="btn btn--primary btn--full card__add" data-action="add" data-id="${p.id}">Ajouter au panier</button>
      </div>
    `;
    grid.appendChild(card);
  });
  observeReveals(grid);
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.dataset.id;
  const product = PRODUCTS.find((p) => p.id === id);
  const valEl = grid.querySelector(`[data-qtyval="${id}"]`);
  let current = parseInt(valEl.textContent, 10) || 0;

  if (btn.dataset.action === "inc") {
    current += 1;
    valEl.textContent = current;
  } else if (btn.dataset.action === "dec") {
    current = Math.max(0, current - 1);
    valEl.textContent = current;
  } else if (btn.dataset.action === "add") {
    if (current <= 0) return;
    addToCart(product, current);
  }
});

/* ============ Filtres ============ */
$$(".filter").forEach((f) => {
  f.addEventListener("click", () => {
    $$(".filter").forEach((el) => el.classList.remove("filter--active"));
    f.classList.add("filter--active");
    activeFilter = f.dataset.filter;
    renderGrid();
  });
});

/* ============ Panier : logique ============ */
function addToCart(product, qty) {
  if (!cart[product.id]) {
    cart[product.id] = { ...product, qty: 0 };
  }
  cart[product.id].qty += qty;
  saveCart();
  renderCart();
  openCart();
  bumpCartIcon();
}

function bumpCartIcon() {
  const icon = $("#openCart");
  if (!icon) return;
  icon.classList.remove("bump");
  void icon.offsetWidth; // force le redémarrage de l'animation
  icon.classList.add("bump");
}

function updateQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function removeItem(id) {
  delete cart[id];
  saveCart();
  renderCart();
}

function cartCount() {
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}
function cartTotal() {
  return Object.values(cart).reduce((sum, item) => sum + item.qty * item.boxPrice, 0);
}

function renderCart() {
  const list = $("#cartList");
  const empty = $("#cartEmpty");
  const foot = $("#cartFoot");
  const items = Object.values(cart);

  $("#cartCount").textContent = cartCount();

  if (items.length === 0) {
    list.innerHTML = "";
    empty.style.display = "block";
    foot.classList.remove("cart__foot--visible");
    return;
  }

  empty.style.display = "none";
  foot.classList.add("cart__foot--visible");

  list.innerHTML = items.map((item) => `
    <li class="cart__item">
      <div class="cart__item-icon" style="background:linear-gradient(135deg, ${item.swatch[0]}, ${item.swatch[1]}); border-radius:10px;"></div>
      <div class="cart__item-info">
        <p class="cart__item-name">${item.name}</p>
        <p class="cart__item-meta">${item.qty} carton(s) × ${fmt(item.boxPrice)}</p>
      </div>
      <div class="cart__item-actions">
        <button class="qty-btn" data-cart-action="dec" data-cart-id="${item.id}" aria-label="Diminuer">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" data-cart-action="inc" data-cart-id="${item.id}" aria-label="Augmenter">+</button>
        <button class="cart__item-remove" data-cart-action="remove" data-cart-id="${item.id}">Retirer</button>
      </div>
    </li>
  `).join("");

  $("#cartTotal").textContent = fmt(cartTotal());
}

$("#cartList").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-cart-action]");
  if (!btn) return;
  const id = btn.dataset.cartId;
  if (btn.dataset.cartAction === "inc") updateQty(id, 1);
  if (btn.dataset.cartAction === "dec") updateQty(id, -1);
  if (btn.dataset.cartAction === "remove") removeItem(id);
  renderGrid();
});

/* ============ Ouverture / fermeture panier & modal ============ */
const cartPanel = $("#cart");
const overlay = $("#overlay");
const checkoutModal = $("#checkoutModal");

function openCart() {
  cartPanel.classList.add("cart--open");
  overlay.classList.add("overlay--visible");
}
function closeCart() {
  cartPanel.classList.remove("cart--open");
  overlay.classList.remove("overlay--visible");
}
function openModal() {
  if (cartCount() === 0) return;
  closeCart();
  checkoutModal.classList.add("modal--open");
  overlay.classList.add("overlay--visible");
}
function closeModal() {
  checkoutModal.classList.remove("modal--open");
  overlay.classList.remove("overlay--visible");
}

$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#goCheckout").addEventListener("click", openModal);
$("#closeModal").addEventListener("click", closeModal);
overlay.addEventListener("click", () => { closeCart(); closeModal(); });

/* ============ Menu mobile ============ */
const burger = $("#burger");
const nav = $("#nav");
const navClose = $("#navClose");

function openNav() {
  nav.classList.add("nav--open");
}
function closeNav() {
  nav.classList.remove("nav--open");
}

burger.addEventListener("click", () => {
  nav.classList.contains("nav--open") ? closeNav() : openNav();
});
navClose?.addEventListener("click", closeNav);
$$(".nav a").forEach((a) => a.addEventListener("click", closeNav));

/* ============ Commande WhatsApp ============ */
$("#checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const nom = form.nom.value.trim();
  const telephone = form.telephone.value.trim();
  const ville = form.ville.value.trim();
  const adresse = form.adresse.value.trim();
  const note = form.note.value.trim();

  const items = Object.values(cart);
  if (items.length === 0) return;

  let message = `Bonjour Binta Ice Cream 👋\n\nJe souhaite commander :\n`;
  items.forEach((item) => {
    message += `• ${item.name} — ${item.qty} carton(s) (${item.pack} pcs) — ${fmt(item.qty * item.boxPrice)}\n`;
  });
  message += `\nTotal : ${fmt(cartTotal())}\n\n`;
  message += `Mes coordonnées :\n`;
  message += `Nom : ${nom}\n`;
  message += `Téléphone : ${telephone}\n`;
  message += `Ville / Quartier : ${ville}\n`;
  message += `Adresse : ${adresse}\n`;
  if (note) message += `Note : ${note}\n`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  cart = {};
  saveCart();
  renderCart();
  renderGrid();
  closeModal();
  form.reset();
});

/* ============ Formulaire de contact -> e-mail (FormSubmit) ============ */
const contactForm = $("#contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const statusEl = $("#contactStatus");
    const btn = $("#contactSubmit");
    const originalLabel = btn.textContent;

    statusEl.textContent = "";
    statusEl.classList.remove("contact-card__status--success");
    btn.disabled = true;
    btn.textContent = "Envoi...";

    try {
      const ajaxUrl = form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      const res = await fetch(ajaxUrl, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      });
      if (!res.ok) throw new Error("Envoi impossible");
      statusEl.textContent = "Merci ! Votre message a bien été envoyé. 🍦";
      statusEl.classList.add("contact-card__status--success");
      form.reset();
    } catch (err) {
      statusEl.textContent = "Une erreur est survenue. Réessayez ou appelez-nous directement.";
    } finally {
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  });
}

/* ============ Init ============ */
observeReveals();
renderCart();
subscribeProducts((products) => {
  PRODUCTS = products;
  renderGrid();
  syncCartWithCatalog();
});

/* Si un produit du panier a été supprimé ou modifié côté admin, on garde le panier cohérent */
function syncCartWithCatalog() {
  let changed = false;
  Object.keys(cart).forEach((id) => {
    const current = PRODUCTS.find((p) => p.id === id);
    if (!current) {
      delete cart[id];
      changed = true;
    } else {
      cart[id] = { ...current, qty: cart[id].qty };
    }
  });
  if (changed) saveCart();
  renderCart();
}