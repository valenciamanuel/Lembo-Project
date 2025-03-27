document.addEventListener("DOMContentLoaded", function () {
    const inputID = document.getElementById("idInsumo");
    const mensaje = document.getElementById("mensaje");
    const enviarBtn = document.getElementById("enviarBtn");

    // Estilos del mensaje (directamente en JS)
    mensaje.style.marginTop = "10px";
    mensaje.style.fontSize = "1rem";
    mensaje.style.fontWeight = "bold";
    mensaje.style.textAlign = "center";

    enviarBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Evita que el botón funcione sin validación

        if (inputID.value.trim() === "") {
            mensaje.textContent = "Debes ingresar un ID de Insumo.";
            mensaje.style.color = "red";
        } else {
            mensaje.textContent = "Enviado correctamente.";
            mensaje.style.color = "green";

            setTimeout(() => {
                window.location.href = "actualizar_insumo.html"; // Redirige después de 2 segundos
            }, 2000);
        }
    });
});
