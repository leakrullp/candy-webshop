import { numberOfProductsInCart } from "./Products/cartUtils.js";

var navbar = document.getElementById("navbar");

const user = localStorage.getItem("fname");
let userId = user ? user.slice(0, 2).toUpperCase() : "Login";
let logClass = user ? "profText" : "";

navbar.innerHTML = `
  <a href="./index.html">Home</a>
  <a href="./Products/products.html">Products</a>
  <a class="${logClass}" href="./login.html">${userId}</a>
  <a href="./basket.html"> Cart <span id="cart-count" class="cart-count">0</span> </a>
`;

document.getElementById("cart-count").textContent = numberOfProductsInCart();
