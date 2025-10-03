document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email"); 
    const passwordInput = document.getElementById("password"); 
    const message = document.getElementById("message");

    form.addEventListener("submit", async function (event) { 
        event.preventDefault(); 

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showMessage("Todos los campos son obligatorios.", "error");
            return;
        }
        if (!validateEmail(email)) {
            showMessage("Ingrese un correo válido.", "error");
            return;
        }
        if (password.length < 6) {
            showMessage("La contraseña debe tener al menos 6 caracteres.", "error");
            return;
        }
        
        showMessage("Iniciando sesión...", "info");

        try {
            const response = await fetch('/api/register/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // 🔑 CLAVE: Usamos sessionStorage. El token se borra al cerrar la pestaña.
                sessionStorage.setItem('userToken', data.token); 
                showMessage("Inicio de sesión exitoso. Redirigiendo...", "success");

                setTimeout(() => {
                    window.location.href = "/dashboard.html"; 
                }, 500);
            } else {
                const errorMessage = data.message || "Credenciales inválidas o error desconocido.";
                showMessage(errorMessage, "error");
            }
        } catch (error) {
            console.error('Error de red durante el inicio de sesión:', error);
            showMessage("Error al conectar con el servidor. Verifique que el backend esté en funcionamiento.", "error");
        }
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
