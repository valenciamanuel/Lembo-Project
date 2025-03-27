document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form");
    const btnHabilitar = document.getElementById("btnHabilitar");
    const btnActualizar = document.getElementById("btnActualizar");
    const mensaje = document.getElementById("mensaje-validacion");

    function validarFormulario(event, redireccion) {
        event.preventDefault(); // Evita que el botón recargue la página

        const inputs = document.querySelectorAll(".form__input");
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

    btnHabilitar.addEventListener("click", (event) => validarFormulario(event, "ID_ciclo_cultivo_habilitar.html"));
    btnActualizar.addEventListener("click", (event) => validarFormulario(event, "ID_ciclo_cultivo_actualizar.html"));
});
