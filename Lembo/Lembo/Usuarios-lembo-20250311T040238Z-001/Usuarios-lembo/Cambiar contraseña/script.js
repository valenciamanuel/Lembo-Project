document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const message = document.createElement("p");
    message.id = "validation-message";
    form.appendChild(message);

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío automático
        message.textContent = "";
        message.style.color = "red";

        if (password.value === "" || confirmPassword.value === "") {
            message.textContent = "Por favor, completa todos los campos.";
            return;
        }

        if (password.value.length < 6) {
            message.textContent = "La contraseña debe tener al menos 6 caracteres.";
            return;
        }

        if (password.value !== confirmPassword.value) {
            message.textContent = "Las contraseñas no coinciden.";
            return;
        }

        message.textContent = "Contraseña actualizada correctamente.";
        message.style.color = "green";

        // Simular envío del formulario después de validación exitosa
        setTimeout(() => form.submit(), 2000);
    });
});
