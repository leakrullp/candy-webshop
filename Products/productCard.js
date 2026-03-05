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
    <button class="cart-btn">Add to Cart</button>
  `;

  return card;
}
