function welcomeMSG() {
    const displayName = localStorage.getItem("fname")
    const displayElement = document.getElementById("welcome-header")
    displayElement.innerText = displayName ? `Welcome to a world of candy, ${displayName}!!` : "Welcome to a world of candy";
}
welcomeMSG();

function cartMSG(){
    const displayName = localStorage.getItem("fname")
    const displayElement = document.getElementById("cart-header")
    displayElement.innerText = displayName ? `You have a great taste in candy, ${displayName}` : "You will regret an empty basket on friday!";
}