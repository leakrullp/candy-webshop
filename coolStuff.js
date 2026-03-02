function welcomeMSG() {
    const displayName = localStorage.getItem("fname")
    const displayElement = document.getElementById("welcome-header")
    displayElement.innerText = displayName ? `Welcome to Europe's central Candy MEGA MEGA Store, ${displayName}!!` : "Welcome to Europe's central Candy MEGA MEGA Store!!";
}
welcomeMSG();