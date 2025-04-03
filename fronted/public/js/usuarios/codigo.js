document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("codeForm");
    const inputs = document.querySelectorAll(".code");
    const message = document.getElementById("message");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío automático

        const code = Array.from(inputs).map(input => input.value).join("");
        
        if (code.length < 6 || code.includes(" ")) {
            showMessage("Debes completar los 6 dígitos.", "error");
            return;
        }

        showMessage("Código verificado con éxito.", "success");

        setTimeout(() => {
            window.location.href = "/Cambiar contraseña/index.html";
        }, 1000);
    });

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "message " + type;
    }

    // Mover el foco automáticamente entre inputs
    inputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            if (e.target.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && index > 0 && !input.value) {
                inputs[index - 1].focus();
            }
        });
    });
});
