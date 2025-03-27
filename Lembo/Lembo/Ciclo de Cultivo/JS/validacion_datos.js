document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form");
    const btnDeshabilitar = document.getElementById("btnDeshabilitar");
    const btnActualizar = document.getElementById("btnActualizar");
    const mensaje = document.createElement("p");
    mensaje.style.textAlign = "center";
    form.appendChild(mensaje); // Agrega el mensaje debajo del formulario

    function validarFormulario(event, redireccion) {
        event.preventDefault(); // Evita la acción predeterminada del enlace

        const inputs = document.querySelectorAll(".form__input-text");
        let formularioValido = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                formularioValido = false;
            }
        });

        if (!formularioValido) {
            mensaje.innerHTML = `<span style="color: red;">Todos los campos son obligatorios.</span>`;
            return;
        }

        mensaje.innerHTML = `<span style="color: green;">Formulario válido. Redirigiendo...</span>`;

        setTimeout(() => {
            window.location.href = redireccion;
        }, 2000);
    }

    btnDeshabilitar.addEventListener("click", (event) => validarFormulario(event, "ID_ciclo_cultivo_deshabilitar.html"));
    btnActualizar.addEventListener("click", (event) => validarFormulario(event, "ID_ciclo_cultivo_actualizar.html"));
});
