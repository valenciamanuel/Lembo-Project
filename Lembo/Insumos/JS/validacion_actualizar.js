document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formInsumo");
    const btnActualizar = document.getElementById("btnActualizar");
    const mensaje = document.getElementById("mensaje-validacion");

    function validarFormulario(event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        const tipoSensor = document.getElementById("tipoSensor").value.trim();
        const idSensor = document.getElementById("idSensor").value.trim();
        const nombreSensor = document.getElementById("nombreSensor").value.trim();
        const unidadMedida = document.getElementById("unidadMedida").value.trim();
        const tiempoEscaneo = document.getElementById("tiempoEscaneo").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const estado = document.getElementById("estado").value.trim().toLowerCase();

        if (!tipoSensor || !idSensor || !nombreSensor || !unidadMedida || !tiempoEscaneo || !descripcion || !estado) {
            mensaje.innerHTML = `<span style="color: red;">Todos los campos son obligatorios.</span>`;
            return;
        }

        if (estado !== "activo" && estado !== "inactivo") {
            mensaje.innerHTML = `<span style="color: red;">El estado debe ser "activo" o "inactivo".</span>`;
            return;
        }

        mensaje.innerHTML = `<span style="color: green;">Datos actualizados correctamente.</span>`;

        setTimeout(() => {
            // Aquí puedes agregar la lógica para enviar los datos a la base de datos
            alert("Insumo actualizado con éxito.");
        }, 2000);
    }

    btnActualizar.addEventListener("click", validarFormulario);
});
