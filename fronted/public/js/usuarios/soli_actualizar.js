document.addEventListener("DOMContentLoaded", function () {
    const inputID = document.getElementById("userID");
    const mensajeValidacion = document.getElementById("mensajeValidacion");
    const botonEnviar = document.getElementById("enviarBtn");

    botonEnviar.addEventListener("click", function (event) {
        event.preventDefault(); // Evita que el enlace se abra si hay error

        mensajeValidacion.textContent = ""; // Limpia mensaje anterior
        mensajeValidacion.style.color = ""; // Restablece color

        if (inputID.value.trim() === "") {
            mensajeValidacion.textContent = "Por favor, ingrese el ID";
            mensajeValidacion.style.color = "red";
        } else {
            mensajeValidacion.textContent = "Redirigiendo...";
            mensajeValidacion.style.color = "green";

            setTimeout(() => {
                window.location.href = "/Actualizacion de perfil usuario/index.htm";
            }, 1500);
        }
    });
});
