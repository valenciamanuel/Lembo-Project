document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const message = document.getElementById("message");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío automático

        if (!email.value.trim() || !password.value.trim()) {
            showMessage("Todos los campos son obligatorios.", "error");
            return;
        }

        if (!validateEmail(email.value)) {
            showMessage("Ingrese un correo válido.", "error");
            return;
        }

        if (password.value.length < 6) {
            showMessage("La contraseña debe tener al menos 6 caracteres.", "error");
            return;
        }

        showMessage("Inicio de sesión exitoso.", "success");

        setTimeout(() => {
            window.location.href = "/dashboard.html"; // Redirigir después del éxito
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
