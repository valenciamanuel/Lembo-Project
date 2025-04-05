document.addEventListener("DOMContentLoaded", function(){
    fetch("../components/header.html")
    .then(response => response.text())
    .then(data =>{
        document.querySelector(".header").innerHTML = data;
    })
    .catch(error => console.error("Error cargando header:", error));
});