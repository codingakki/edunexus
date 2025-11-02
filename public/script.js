document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const listings = document.getElementById("listings");
  const cartBtn = document.createElement("button");
  cartBtn.classList.add("btn", "checkout-btn");
  cartBtn.textContent = "🛒 View Cart";
  document.querySelector("#marketplace").appendChild(cartBtn);

  // ======================
  // FETCH PRODUCTS
  // ======================
  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      renderProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      listings.innerHTML = `<p style="color:red;">⚠️ Failed to load products</p>`;
    }
  }

  // ======================
  // RENDER PRODUCTS
  // ======================
  function renderProducts(data) {
    listings.innerHTML = data
      .map(
        (item) => `
      <div class="card product-card">
        <img src="${item.img}" alt="${item.title}" />
        <h3>${item.title}</h3>
        <p>${item.subject} • ${item.location}</p>
        <h4>₹${item.price}</h4>
        <button class="btn addCartBtn" 
          data-id="${item._id}" 
          data-name="${item.title}" 
          data-price="${item.price}" 
          data-image="${item.img}">
          Add to Cart
        </button>
      </div>
    `
      )
      .join("");

    document.querySelectorAll(".addCartBtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = {
          id: btn.dataset.id,
          name: btn.dataset.name,
          price: btn.dataset.price,
          image: btn.dataset.image,
        };
        addToCart(product);
      });
    });
  }

  // ======================
  // CART FUNCTIONALITY
  // ======================
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item.id === product.id);
    if (!exists) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.name} added to cart!`);
    } else {
      alert("Item already in cart!");
    }
  }

  // ======================
  // VIEW CART + CHECKOUT
  // ======================
  cartBtn.addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return alert("Your cart is empty!");

    // Show cart summary
    let msg = "🛍️ Your Cart:\n\n";
    let total = 0;
    cart.forEach((item) => {
      msg += `${item.name} - ₹${item.price}\n`;
      total += Number(item.price);
    });
    msg += `\nTotal: ₹${total}\n\nProceed to checkout?`;

    if (confirm(msg)) {
      // Check login
      const user = localStorage.getItem("user");
      if (!user) {
        alert("Please log in to continue checkout.");
        window.location.href = "login.html";
      } else {
        alert("Redirecting to payment gateway...");
        window.location.href = "payment.html";
      }
    }
  });

  // ======================
  // TUTORING BUTTONS
  // ======================
  document.querySelectorAll(".tutor-card .btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const role = btn.textContent.includes("Teach") ? "teach" : "learn";
      window.location.href = `/tutors.html?mode=${role}`;
    });
  });

  // ======================
  // LOGIN LINK DISPLAY
  // ======================
 const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  const loginLink = document.getElementById("loginLink");
  loginLink.innerText = `Hi, ${user.name}`;
  loginLink.href = "#"; // disable link when logged in
}
document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("productList");
  if (!productList) return; // Exit if not on Marketplace page

  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    if (!Array.isArray(products) || products.length === 0) {
      productList.innerHTML = "<p>No products available right now.</p>";
      return;
    }

    productList.innerHTML = products
      .map(
        (p) => `
        <div class="product-card">
          <h3>${p.name}</h3>
          <p>${p.description || "No description available"}</p>
          <button>Add to Cart</button>
        </div>
      `
      )
      .join("");
  } catch (err) {
    console.error("Error loading products:", err);
    productList.innerHTML = "<p>⚠️ Failed to load products.</p>";
  }
});

});
