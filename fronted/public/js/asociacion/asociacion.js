
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".formulario");

    function mostrarError(campo, mensaje) {
        let contenedorError = campo.parentElement.querySelector(".formulario__error");

        if (!contenedorError) {
            contenedorError = document.createElement("div");
            contenedorError.classList.add("formulario__error");
            campo.parentElement.appendChild(contenedorError);
        }

        contenedorError.textContent = mensaje;
        campo.classList.add("formulario__entrada--error");
    }

    function limpiarErrores() {
        document.querySelectorAll(".formulario__error").forEach(e => e.remove());
        document.querySelectorAll(".formulario__entrada, .formulario__selector").forEach(e => e.classList.remove("formulario__entrada--error"));
    }

    function mostrarMensajeExito(mensaje) {
        let contenedor = document.getElementById("mensaje-exito");
        if (!contenedor) {
            contenedor = document.createElement("div");
            contenedor.id = "mensaje-exito";
            contenedor.classList.add("formulario__exito");
            form.insertBefore(contenedor, form.firstChild);
        }
        contenedor.textContent = mensaje;
        window.scrollTo({ top: 0, behavior: "smooth" }); // Mover hacia arriba para que lo vea
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        limpiarErrores();

        let valido = true;

        const camposTexto = form.querySelectorAll('input[type="text"], input[type="number"], input[type="date"]');
        const selects = form.querySelectorAll("select");

        camposTexto.forEach(campo => {
            if (campo.value.trim() === "") {
                mostrarError(campo, "Este campo es obligatorio.");
                valido = false;
            }
        });

        selects.forEach(select => {
            if (select.value === "") {
                mostrarError(select, "Debe seleccionar una opción.");
                valido = false;
            }
        });

        const fechas = form.querySelectorAll('input[type="date"]');
        const inicio = fechas[0];
        const fin = fechas[1];

        if (inicio.value && fin.value && new Date(fin.value) < new Date(inicio.value)) {
            mostrarError(fin, "La fecha final no puede ser anterior a la inicial.");
            valido = false;
        }

        if (valido) {
            mostrarMensajeExito("✅ Asociación creada con éxito.");
            setTimeout(() => {
                window.location.href = "/fronted/public/views/vizualisar/html/practica.html";
            }, 1000);
        }
    });
});
