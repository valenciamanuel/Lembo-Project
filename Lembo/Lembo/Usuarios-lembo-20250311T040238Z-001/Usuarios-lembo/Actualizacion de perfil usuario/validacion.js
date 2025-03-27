document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("perfilForm");
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-general");
    form.appendChild(errorMessage);

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita envío automático del formulario
        let isValid = true;
        errorMessage.textContent = ""; // Limpia mensaje previo

        // Obtener valores
        const tipoUsuario = document.getElementById("tipo-usuario").value.trim();
        const tipoDocumento = document.getElementById("tipo-documento").value.trim();
        const numeroDocumento = document.getElementById("numero-documento").value.trim();
        const identificacion = document.getElementById("identificacion").value.trim();
        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const activo = document.getElementById("activo").checked;
        const inactivo = document.getElementById("inactivo").checked;

        // Validaciones generales
        if (!tipoUsuario || !tipoDocumento || !numeroDocumento || !identificacion || !nombre || !correo || !telefono) {
            isValid = false;
            errorMessage.textContent = "⚠️ Por favor, complete todos los campos.";
        } else if (activo && inactivo) {
            isValid = false;
            errorMessage.textContent = "⚠️ Seleccione solo un estado (Activo o Inactivo).";
        } else if (!activo && !inactivo) {
            isValid = false;
            errorMessage.textContent = "⚠️ Seleccione un estado.";
        }

        // Si todo está correcto, enviar
        if (isValid) {
            errorMessage.textContent = "✅ Datos enviados correctamente.";
            setTimeout(() => {
                window.location.href = "/Datos%20actualizados%20mensaje/index.html";
            }, 2000);
        }
    });
});
