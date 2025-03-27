document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formulario");
    const mensaje = document.getElementById("mensaje");

    formulario.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío inmediato del formulario

        const idCiclo = document.getElementById("idCiclo").value.trim();
        const nombreCiclo = document.getElementById("nombreCiclo").value.trim();
        const fechaSiembra = document.getElementById("fechaSiembra").value.trim();
        const fechaCosecha = document.getElementById("fechaCosecha").value.trim();
        const novedades = document.getElementById("novedades").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const estado = document.getElementById("estado").value.trim();

        if (!idCiclo || !nombreCiclo || !fechaSiembra || !fechaCosecha || !novedades || !descripcion || !estado) {
            mensaje.innerHTML = `<p style="color: red;">Todos los campos son obligatorios.</p>`;
            return;
        }

        if (estado.toLowerCase() !== "activo" && estado.toLowerCase() !== "inactivo") {
            mensaje.innerHTML = `<p style="color: red;">El estado debe ser 'activo' o 'inactivo'.</p>`;
            return;
        }

        // Si todo está correcto, mostrar mensaje y enviar después de 3 segundos
        mensaje.innerHTML = `<p style="color: green;">Actualizacion correcta.</p>`;

        setTimeout(() => {
            formulario.submit();
        }, 2000); // 3 segundos antes de enviar el formulario
    });
});
