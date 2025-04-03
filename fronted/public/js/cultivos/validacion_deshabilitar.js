document.addEventListener("DOMContentLoaded", function () {
    const mensaje = document.getElementById("mensaje-validacion");

    document.getElementById("btnDeshabilitar").addEventListener("click", function () {
        if (validarFormulario()) {
            if (confirm("¿Está seguro de deshabilitar este cultivo? Esta acción no se puede deshacer.")) {
                alert("Cultivo deshabilitado con éxito.");
                // Aquí puedes agregar la lógica para deshabilitar el cultivo en la base de datos
            }
        }
    });

    function validarFormulario() {
        const tipoCultivo = document.getElementById("tipoCultivo").value.trim();
        const nombreCultivo = document.getElementById("nombreCultivo").value.trim();
        const idCultivo = document.getElementById("idCultivo").value.trim();
        const tamano = document.getElementById("tamano").value.trim();
        const ubicacion = document.getElementById("ubicacion").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const estado = document.getElementById("estado").value.trim().toLowerCase();

        if (!tipoCultivo || !nombreCultivo || !idCultivo || !tamano || !ubicacion || !descripcion || !estado) {
            mensaje.innerHTML = `<span style="color: red;">Todos los campos son obligatorios.</span>`;
            return false;
        }

        if (isNaN(parseFloat(tamano)) || parseFloat(tamano) <= 0) {
            mensaje.innerHTML = `<span style="color: red;">El tamaño debe ser un número válido mayor a 0.</span>`;
            return false;
        }

        if (estado !== "activo" && estado !== "inactivo") {
            mensaje.innerHTML = `<span style="color: red;">Seleccione un estado válido.</span>`;
            return false;
        }

        mensaje.innerHTML = `<span style="color: green;">Cultivo listo para deshabilitar.</span>`;
        return true;
    }
});
