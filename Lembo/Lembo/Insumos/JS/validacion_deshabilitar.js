document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formInsumo");
    const estadoInput = document.getElementById("estado");
    const mensaje = document.getElementById("mensaje-validacion");
    
    document.getElementById("btnHabilitar").addEventListener("click", function () {
        if (confirm("¿Estás seguro de que quieres habilitar este insumo?")) {
            estadoInput.value = "activo";
            mensaje.innerHTML = `<span style="color: green;">Insumo habilitado correctamente.</span>`;
        }
    });

    document.getElementById("btnActualizar").addEventListener("click", function () {
        if (validarFormulario()) {
            alert("Insumo actualizado con éxito.");
        }
    });

    function validarFormulario() {
        const tipoInsumo = document.getElementById("tipoInsumo").value.trim();
        const idInsumo = document.getElementById("idInsumo").value.trim();
        const nombreInsumo = document.getElementById("nombreInsumo").value.trim();
        const unidadMedida = document.getElementById("unidadMedida").value.trim();
        const tiempoEscaneo = document.getElementById("tiempoEscaneo").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const estado = estadoInput.value.trim().toLowerCase();

        if (!tipoInsumo || !idInsumo || !nombreInsumo || !unidadMedida || !tiempoEscaneo || !descripcion || !estado) {
            mensaje.innerHTML = `<span style="color: red;">Todos los campos son obligatorios.</span>`;
            return false;
        }

        if (estado !== "activo" && estado !== "inactivo") {
            mensaje.innerHTML = `<span style="color: red;">El estado debe ser "activo" o "inactivo".</span>`;
            return false;
        }

        mensaje.innerHTML = `<span style="color: green;">Datos actualizados correctamente.</span>`;
        return true;
    }
});
