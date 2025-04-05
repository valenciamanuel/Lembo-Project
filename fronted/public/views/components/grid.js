document.addEventListener("DOMContentLoaded", function(){
    fetch("/Lembo/fecth/grid.html")
    .then(response => response.text())
    .then(data =>{
        document.querySelector(".grid").innerHTML = data;
    })
    .catch(error => console.error("Error cargando footer:", error));
});