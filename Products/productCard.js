export function createProductCard(p) {
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.image}" width="200" alt="${p.name}" />
    <p>Price: ${p.price} kr.</p>
    <p>Country: ${p.country}</p>
    <p>Brand: ${p.brand}</p>
    <button class="view-btn" data-id="${p.id}">View Details</button>
    <button class="cart-btn" data-id="${p.id}">Add to Cart</button>
  `;

  // Add click handler for View Details button
  const viewBtn = card.querySelector(".view-btn");
  viewBtn.addEventListener("click", () => {
    localStorage.setItem("selectedProductId", p.id);
    window.location.href = "Products/productDetails.html";
  });

  // Add click handler for Add to Cart button
  const cartBtn = card.querySelector(".cart-btn");
  cartBtn.addEventListener("click", async () => {
    const { addToCart } = await import("./cartUtils.js");
    addToCart(p.id);
  });

  return card;
}
