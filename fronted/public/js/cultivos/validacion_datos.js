document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cultivoForm");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        let inputs = document.querySelectorAll(".cultivo__input");
        let valid = true;

        // Reiniciar los mensajes y estilos
        mensaje.textContent = "";
        mensaje.classList.remove("mensaje--error", "mensaje--exito");

        inputs.forEach(input => {
            if (input.value.trim() === "") {
                input.classList.add("error");
                valid = false;
            } else {
                input.classList.remove("error");
            }
        });

        if (!valid) {
            mensaje.textContent = "Por favor, completa todos los campos.";
            mensaje.style.color = "red";
            
        } else {
            mensaje.textContent = " Datos enviados correctamente.";
            mensaje.style.color = "green";
            

            setTimeout(() => {
                form.submit(); // Enviar el formulario después de 2 segundos
            }, 2000);
        }
    });
});
