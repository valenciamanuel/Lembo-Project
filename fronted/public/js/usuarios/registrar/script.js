document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form");
    const mensajeValidacion = document.getElementById("mensajeValidacion");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío del formulario
        
        mensajeValidacion.textContent = ""; // Limpia mensaje anterior
        mensajeValidacion.style.color = ""; // Restablece color

        let camposVacios = false;
        const inputs = form.querySelectorAll("input, select");

        inputs.forEach(input => {
            if (input.value.trim() === "") {
                camposVacios = true;
            }
        });

        if (camposVacios) {
            mensajeValidacion.textContent = "Por favor, complete todos los campos.";
            mensajeValidacion.style.color = "red";
        } else {
            mensajeValidacion.textContent = "Registro exitoso.";
            mensajeValidacion.style.color = "green";

            setTimeout(() => {
                form.submit(); // Envía el formulario después de 1.5 segundos
            }, 1500);
        }
    });
});
