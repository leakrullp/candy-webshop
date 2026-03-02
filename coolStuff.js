function welcomeMSG() {
    const displayName = localStorage.getItem("fname")
    const displayElement = document.getElementById("welcome-header")
    displayElement.innerText = displayName ? `Welcome to Europe's central Candy MEGA MEGA Store, ${displayName}!!` : "Welcome to Europe's central Candy MEGA MEGA Store!!";
}
welcomeMSG();

function cartMSG(){
    const displayName = localStorage.getItem("fname")
    const displayElement = document.getElementById("cart-header")
    displayElement.innerText = displayName ? `You have a great taste in candy, ${displayName}` : "You will regret an empty basket on friday!";
}