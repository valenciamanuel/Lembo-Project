document.addEventListener("DOMContentLoaded", function(){
    fetch("/fronted/public/views/components/grid.html")
    .then(response => response.text())
    .then(data =>{
        document.querySelector(".grid").innerHTML = data;
    })
    .catch(error => console.error("Error cargando cards:", error));
});