document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("recoveryForm");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío automático

        if (!email.value.trim()) {
            showMessage("Por favor, complete todos los campos.", "error");
            return;
        }

        if (!validateEmail(email.value)) {
            showMessage("Ingrese un correo válido.", "error");
            return;
        }

        showMessage("Correo enviado correctamente.", "success");

        setTimeout(() => {
            window.location.href = "/Codigo de recuperacion contraseña/index.html"; // Redirigir tras éxito
        }, 1000);
    });

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "message " + type;
        message.style.display = "block";
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
