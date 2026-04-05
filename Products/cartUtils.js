export async function addToCart(productId) {
  const customerId = localStorage.getItem("customerId");

  if (!customerId) {
    alert("Please log in before adding products to the cart.");
    window.location.href = "../login.html";
    return;
  }

  const response = await fetch(`/api/baskets/${customerId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity: 1 }),
  });

  if (!response.ok) {
    alert("Failed to add item to cart.");
    return;
  }

  const data = await response.json();
  localStorage.setItem("productsInCart", JSON.stringify(data.basket.items));
  window.location.href = "../basket.html";
}

export function numberOfProductsInCart(){
    let productsInCart = JSON.parse(localStorage.getItem("productsInCart")) || [];
    let number = 0;
    productsInCart.forEach( function(p) {
        number+=p.quantity;
    })
    return number;
}