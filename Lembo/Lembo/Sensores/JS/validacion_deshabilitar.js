document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("sensorForm");
    const mensaje = document.getElementById("mensaje");

    // Estilos del mensaje (directamente en JS)
    mensaje.style.marginTop = "10px";
    mensaje.style.fontSize = "1rem";
    mensaje.style.fontWeight = "bold";
    mensaje.style.textAlign = "center";

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de inmediato

        let inputs = document.querySelectorAll(".text");
        let valid = true;

        inputs.forEach(input => {
            if (input.value.trim() === "") {
                valid = false;
            }
        });

        if (!valid) {
            mensaje.textContent = " Por favor, completa todos los campos.";
            mensaje.style.color = "red";
        } else {
            mensaje.textContent = " Sensor deshabilitado correctamente.";
            mensaje.style.color = "green";

            setTimeout(() => {
                form.submit(); // Enviar el formulario después de 2 segundos
            }, 2000);
        }
    });
});
