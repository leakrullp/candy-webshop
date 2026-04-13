function welcomeMSG() {
    const displayName = localStorage.getItem("fname");
    const displayElement = document.getElementById("welcome-header");
    if (displayElement) {
        displayElement.innerText = displayName ? `Welcome to a world of candy, ${displayName}!!` : "Welcome to a world of candy";
    }
}
welcomeMSG();

function cartMSG(){
    const displayName = localStorage.getItem("fname");
    const displayElement = document.getElementById("cart-header");
    if (displayElement) {
        displayElement.innerText = displayName ? `Your weekend will thank you for your purchase, ${displayName}` : "Your weekend will thank you for your purchase";
    }
}
cartMSG();