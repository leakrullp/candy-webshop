import { createProductCard } from "./productCard.js";

export function ProductBanner(bannerId, title, products, filter = () => true) {
  const banner = document.getElementById(bannerId);
  if (!banner) return;

  banner.classList.add("product-banner");

  const selectedProducts = products.filter(filter);
  const VISIBLE = 4;

  // Duplicate data for infinite looping
  const loopProducts = [
    ...selectedProducts.slice(-VISIBLE),
    ...selectedProducts,
    ...selectedProducts.slice(0, VISIBLE),
  ];

  banner.innerHTML = `
    <h2 class="product-banner-title">${title}</h2>

    <button class="banner-arrow left">❮</button>
    <button class="banner-arrow right">❯</button>

    <div class="product-banner-track-wrapper">
      <div class="product-banner-track"></div>
    </div>
  `;

  const track = banner.querySelector(".product-banner-track");

  // Render all cards
  loopProducts.forEach((p) => {
    const card = createProductCard(p);
    card.style.minWidth = "260px";
    card.style.maxWidth = "260px";
    track.appendChild(card);
  });

  // Slider logic
  let index = selectedProducts.length; // middle block
  const cardWidth = 260 + 32; // card width + gap (2rem=32px)

  function updatePosition(animate = true) {
    if (!animate) track.style.transition = "none";
    else track.style.transition = "transform 0.4s ease";

    track.style.transform = `translateX(${-index * cardWidth}px)`;
  }

  updatePosition(false);

  // Buttons
  banner.querySelector(".banner-arrow.left").addEventListener("click", () => {
    index--;
    updatePosition();
    if (index === VISIBLE - 1) {
      setTimeout(() => {
        index = selectedProducts.length + (VISIBLE - 1);
        updatePosition(false);
      }, 400);
    }
  });

  banner.querySelector(".banner-arrow.right").addEventListener("click", () => {
    index++;
    updatePosition();
    if (index === selectedProducts.length + VISIBLE) {
      setTimeout(() => {
        index = selectedProducts.length;
        updatePosition(false);
      }, 400);
    }
  });
}
