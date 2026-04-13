export function addToCart(productId) {
  let productsInCart = JSON.parse(localStorage.getItem("productsInCart")) || [];
  
  // Check if product already exists in cart
  const existingProduct = productsInCart.find(item => item.id === productId);
  
  if (existingProduct) {
    // Increase quantity if it already exists
    existingProduct.quantity += 1;
  } else {
    // Add new product with quantity 1
    productsInCart.push({id: productId, quantity: 1});
  }
  
  localStorage.setItem("productsInCart", JSON.stringify(productsInCart));
  localStorage.setItem("cart", JSON.stringify(productsInCart));
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