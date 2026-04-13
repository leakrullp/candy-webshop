import { candyProducts } from "./products.js";
import { createProductCard } from "./productCard.js";

function getSelectedValues(filterDivId) {
  const checkboxes = document.querySelectorAll(
    `${filterDivId} input[type="checkbox"]:checked`,
  );
  return Array.from(checkboxes).map((cb) => cb.value);
}

function renderProductGrid(containerId, products, filter = () => true) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const selectedProducts = products.filter(filter);

  selectedProducts.forEach((product) => {
    const card = createProductCard(product);
    container.appendChild(card);
  });

  container.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      localStorage.setItem("selectedProductId", id);
      window.location.href = "productDetails.html";
    });
  });
}

export function applyFiltersAndRender() {
  const selectedCategories = getSelectedValues("#categoryFilters");
  const selectedCountries = getSelectedValues("#countryFilters");

  const filterFn = (p) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category);
    const countryMatch =
      selectedCountries.length === 0 || selectedCountries.includes(p.country);
    return categoryMatch && countryMatch;
  };

  renderProductGrid("products-container", candyProducts, filterFn);
  console.log(
    `Your selection is now:\n${selectedCategories}\n${selectedCountries}`,
  );
}

export function setupFilterListeners() {
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  allCheckboxes.forEach((cb) => {
    cb.addEventListener("change", applyFiltersAndRender);
  });
}
