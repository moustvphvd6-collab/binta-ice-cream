import { CATEGORY_LABEL } from "./products-seed.js";
import {
  subscribeProducts, saveProduct, updateProductFields, removeProduct,
  loginAdmin, logoutAdmin, watchAuth, isApiReady, uploadProductImage
} from "./products-service.js";

const $ = (sel) => document.querySelector(sel);
const fmt = (n) => Number(n).toLocaleString("fr-FR") + " FCFA";
const slugify = (str) => str.toLowerCase().trim()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function generateRandomColor() {
  const colors = ["#8A5A38", "#F3E4D0", "#5C3A24", "#E9557B", "#4A2E1C", "#F3E4D0", "#2C1810", "#E7C88B", "#FBEFDD", "#E13A4B"];
  return colors[Math.floor(Math.random() * colors.length)];
}

let currentProducts = [];
let unsubscribeProducts = null;

/* ============ Avertissement si l'API n'est pas joignable ============ */
if (!isApiReady()) {
  $("#apiNotice").textContent =
    "⚠️ L'adresse du serveur API n'est pas configurée (js/api-config.js). La connexion et l'enregistrement ne fonctionneront pas tant que ce n'est pas fait.";
}

/* ============ Connexion / déconnexion ============ */
$("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value;
  $("#loginError").textContent = "";
  try {
    await loginAdmin(email, password);
  } catch (err) {
    $("#loginError").textContent = err?.message || "Connexion impossible : vérifiez l'email et le mot de passe.";
  }
});

$("#logoutBtn").addEventListener("click", () => logoutAdmin());

watchAuth((user) => {
  const loginScreen = $("#loginScreen");
  const adminPanel = $("#adminPanel");
  if (user) {
    loginScreen.style.display = "none";
    adminPanel.hidden = false;
    if (!unsubscribeProducts) {
      unsubscribeProducts = subscribeProducts((products) => {
        currentProducts = products;
        renderTable();
      });
    }
  } else {
    loginScreen.style.display = "flex";
    adminPanel.hidden = true;
    if (unsubscribeProducts) { unsubscribeProducts(); unsubscribeProducts = null; }
  }
});

/* ============ Table produits ============ */
function renderTable() {
  const tbody = $("#productsTableBody");
  $("#productCount").textContent = `${currentProducts.length} parfum(s) au catalogue`;

  tbody.innerHTML = currentProducts.map((p) => `
    <tr>
      <td class="admin-table__name">
        ${p.imageUrl
          ? `<img class="admin-swatch admin-swatch--photo" src="${p.imageUrl}" alt="${p.name}">`
          : `<span class="admin-swatch" style="background:linear-gradient(135deg, ${p.swatch[0]}, ${p.swatch[1]})"></span>`}
        ${p.name}
      </td>
      <td>${CATEGORY_LABEL[p.category] || p.category}</td>
      <td>${p.pack} pièces</td>
      <td>${fmt(p.unitPrice)}</td>
      <td>${fmt(p.boxPrice)}</td>
      <td>
        <div class="admin-table__actions">
          <button class="admin-action" data-action="edit" data-id="${p.id}">Modifier</button>
          <button class="admin-action admin-action--danger" data-action="delete" data-id="${p.id}">Supprimer</button>
        </div>
      </td>
    </tr>
  `).join("");
}

$("#productsTableBody").addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const product = currentProducts.find((p) => p.id === btn.dataset.id);
  if (!product) return;

  if (btn.dataset.action === "edit") {
    openProductModal(product);
  } else if (btn.dataset.action === "delete") {
    if (confirm(`Supprimer "${product.name}" du catalogue ?`)) {
      try { await removeProduct(product.id); }
      catch (err) { alert(err.message); }
    }
  }
});

/* ============ Modal ajout / édition ============ */
const overlay = $("#overlay");
const productModal = $("#productModal");
const productForm = $("#productForm");

function openProductModal(product) {
  productForm.reset();
  $("#productFormError").textContent = "";
  const preview = $("#productImagePreview");
  productForm.image.value = "";
  if (product) {
    $("#productModalTitle").textContent = "Modifier le parfum";
    productForm.originalId.value = product.id;
    productForm.name.value = product.name;
    productForm.desc.value = product.desc;
    productForm.category.value = product.category;
    productForm.pack.value = product.pack;
    productForm.unitPrice.value = product.unitPrice;
    productForm.boxPrice.value = product.boxPrice;
    productForm.swatch1.value = product.swatch[0];
    productForm.swatch2.value = product.swatch[1];
    productForm.currentImageUrl.value = product.imageUrl || "";
    productForm.imageUrl.value = product.imageUrl || "";
    productForm.image.value = "";
    showImagePreview(product.imageUrl || "");
  } else {
    $("#productModalTitle").textContent = "Ajouter un parfum";
    productForm.originalId.value = "";
    productForm.currentImageUrl.value = "";
    productForm.imageUrl.value = "";
    productForm.image.value = "";
    productForm.swatch1.value = generateRandomColor();
    productForm.swatch2.value = generateRandomColor();
    preview.innerHTML = "";
    preview.classList.remove("is-visible");
  }
  productModal.classList.add("modal--open");
  overlay.classList.add("overlay--visible");
}

function closeProductModal() {
  productModal.classList.remove("modal--open");
  overlay.classList.remove("overlay--visible");
}

$("#newProductBtn").addEventListener("click", () => openProductModal(null));
$("#closeProductModal").addEventListener("click", closeProductModal);
overlay.addEventListener("click", closeProductModal);

/* ============ Aperçu de la photo (fichier ou URL) ============ */
function showImagePreview(src) {
  const preview = $("#productImagePreview");
  if (!src) {
    preview.innerHTML = "";
    preview.classList.remove("is-visible");
    return;
  }
  preview.innerHTML = `<img src="${src}" alt="Aperçu du produit">`;
  preview.classList.add("is-visible");
}

productForm.image.addEventListener("change", () => {
  const file = productForm.image.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    $("#productFormError").textContent = "Merci de choisir un fichier image (JPG, PNG, WebP...).";
    productForm.image.value = "";
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    $("#productFormError").textContent = "L'image est trop lourde (5 Mo maximum).";
    productForm.image.value = "";
    return;
  }
  $("#productFormError").textContent = "";
  // Une image choisie via fichier prend le dessus sur l'URL collée
  productForm.imageUrl.value = "";
  const reader = new FileReader();
  reader.onload = () => showImagePreview(reader.result);
  reader.readAsDataURL(file);
});

productForm.imageUrl.addEventListener("input", () => {
  const url = productForm.imageUrl.value.trim();
  if (url) {
    productForm.image.value = "";
    showImagePreview(url);
  } else if (productForm.currentImageUrl.value) {
    showImagePreview(productForm.currentImageUrl.value);
  } else {
    showImagePreview("");
  }
});

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const originalId = form.originalId.value;
  const name = form.name.value.trim();


  if (!name) {
    $("#productFormError").textContent = "Le nom du parfum est obligatoire.";
    form.name.focus();
    return;
  }
  const desc = form.desc.value.trim();
  if (!desc) {
    $("#productFormError").textContent = "La description est obligatoire.";
    form.desc.focus();
    return;
  }
  const pack = parseInt(form.pack.value, 10);
  if (!form.pack.value || isNaN(pack) || pack <= 0) {
    $("#productFormError").textContent = "Merci d'indiquer le nombre de pièces par carton.";
    form.pack.focus();
    form.pack.scrollIntoView({ block: "center" });
    return;
  }
  const unitPrice = parseInt(form.unitPrice.value, 10);
  if (!form.unitPrice.value || isNaN(unitPrice) || unitPrice < 0) {
    $("#productFormError").textContent = "Merci d'indiquer le prix à l'unité.";
    form.unitPrice.focus();
    form.unitPrice.scrollIntoView({ block: "center" });
    return;
  }
  const boxPrice = parseInt(form.boxPrice.value, 10);
  if (!form.boxPrice.value || isNaN(boxPrice) || boxPrice < 0) {
    $("#productFormError").textContent = "Merci d'indiquer le prix du carton.";
    form.boxPrice.focus();
    form.boxPrice.scrollIntoView({ block: "center" });
    return;
  }

  const id = originalId || slugify(name) || `parfum-${Date.now()}`;

  const existingProduct = currentProducts.find((p) => p.id === originalId) || null;
  const currentImageUrl = form.currentImageUrl.value || existingProduct?.imageUrl || "";

  // Récupérer ou générer les couleurs
  let swatch1 = form.swatch1.value;
  let swatch2 = form.swatch2.value;
  if (!swatch1) swatch1 = existingProduct?.swatch[0] || generateRandomColor();
  if (!swatch2) swatch2 = existingProduct?.swatch[1] || generateRandomColor();


  let imageUrl = currentImageUrl;
  let imageError = null;

  // Vérifier d'abord si une URL a été collée directement
  const directUrl = form.imageUrl?.value?.trim();
  if (directUrl) {
    imageUrl = directUrl;
  }

  // Sinon, essayer l'upload du fichier
  const imageFile = form.image.files?.[0] || null;
  if (imageFile && !directUrl) {
    try {
      imageUrl = await uploadProductImage(imageFile, id);
    } catch (err) {
      console.error("Erreur upload image", err);
      imageError = err?.message || "⚠️ L'upload de l'image a échoué. Le produit sera enregistré sans image.";
    }
  }

  const product = {
    id,
    name,
    desc,
    category: form.category.value,
    pack,
    unitPrice,
    boxPrice,
    swatch: [swatch1, swatch2],
    imageUrl
  };


  $("#productFormError").textContent = "";
  const submitBtn = productForm.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Enregistrement...";
  }
  try {
    if (originalId) {
      await updateProductFields(originalId, product);
    } else {
      await saveProduct(product);
    }
    if (imageError) {
      $("#productFormError").textContent = imageError;
      setTimeout(() => closeProductModal(), 2000);
    } else {
      closeProductModal();
    }
  } catch (err) {
    console.error("Erreur d'enregistrement produit", err);
    $("#productFormError").textContent = err?.message || "Impossible d’enregistrer le produit.";
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enregistrer";
    }
  }
});
