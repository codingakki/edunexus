// Global API Base URL
const API_BASE = "https://edunexus-1-ewni.onrender.com";

/**
 * Attaches click event listeners to all "Add to Cart" buttons.
 * When clicked, it sends the product and user ID to the backend API.
 */
function attachAddToCartHandlers() {
  // Use a common selector that can find buttons on both pages
  document.querySelectorAll(".add-to-cart, .btn-add-to-cart").forEach(btn => {
    btn.addEventListener("click", async () => {
      const productId = btn.dataset.productId;
      const userId = "demo-user-123"; // TODO: Replace with actual logged-in user ID

      if (!productId) {
        console.error("No product ID found on button");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/cart/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId }),
        });
        const data = await res.json();

        // Show a simple confirmation
        alert(res.ok ? "✅ " + data.message : "⚠️ " + (data.message || "Failed to add to cart"));

      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("❌ Could not add product to cart.");
      }
    });
  });
}

/**
 * Loads ALL products for the main Marketplace page (marketplace.html)
 */
async function loadProducts() {
  const container = document.getElementById("productList");
  if (!container) return; // Exit if the element isn't on this page

  try {
    const res = await fetch(`${API_BASE}/api/products`);
    const products = await res.json();

    if (!products || !products.length) {
      container.innerHTML = "<p>No products available.</p>";
      return;
    }

    container.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.img || 'default.jpg'}" alt="${p.title}" class="product-img">
        <h3>${p.title || "Untitled Product"}</h3>
        <p><strong>Subject:</strong> ${p.subject || "N/A"}</p>
        <p><strong>Location:</strong> ${p.location || "N/A"}</p>
        <p><strong>Price:</strong> ₹${p.price || 0}</p>
        <button class="add-to-cart" data-product-id="${p._id}">Add to Cart</button>
      </div>
    `).join('');

    // After rendering products, attach the click handlers
    attachAddToCartHandlers();

  } catch (err) {
    console.error("Error loading products:", err);
    container.innerHTML = "<p>⚠️ Failed to load products. Please try again later.</p>";
  }
}

/**
 * Loads the first 3 products for the Home page preview (index.html)
 */
async function loadPreviewProducts() {
  const container = document.getElementById("productPreview");
  if (!container) return; // Exit if the element isn't on this page

  try {
    const res = await fetch(`${API_BASE}/api/products`);
    const products = await res.json();

    if (!products || !products.length) {
      container.innerHTML = "<p class='empty-state'>No featured products available yet.</p>";
      return;
    }

    // Show only the first 3 products
    container.innerHTML = products.slice(0, 3).map(p => `
      <div class="product-card">
        <img src="${p.img || 'default.jpg'}" alt="${p.title}" class="product-img">
        <h3>${p.title}</h3>
        <p class="subject-tag">Subject: ${p.subject || "N/A"}</p>
        <div class="price-location">
          <span class="price">₹ ${p.price}</span>
          <span class="location">${p.location || "N/A"}</span>
        </div>
        <button class="btn-add-to-cart" data-product-id="${p._id}">Add to Cart</button>
      </div>
    `).join('');
    
    // After rendering products, attach the click handlers
    attachAddToCartHandlers();

  } catch (error) {
    container.innerHTML = "<p class='empty-state'>Failed to load products. Server might be offline.</p>";
    console.error(error);
  }
}

/**
 * Main script execution.
 * Runs when the page is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Set copyright year
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Check which page we are on and load appropriate content
  if (document.getElementById("productList")) {
    loadProducts(); // We are on marketplace.html
  } 
  
  if (document.getElementById("productPreview")) {
    loadPreviewProducts(); // We are on index.html
  }
});