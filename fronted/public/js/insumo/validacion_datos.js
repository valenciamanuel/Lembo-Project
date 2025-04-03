document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formInsumo");
    const cantidadInput = document.getElementById("cantidad");
    const valorUnitarioInput = document.getElementById("valorUnitario");
    const valorTotalInput = document.getElementById("valorTotal");
    const mensaje = document.getElementById("mensaje-validacion");

    function calcularValorTotal() {
        const cantidad = parseFloat(cantidadInput.value) || 0;
        const valorUnitario = parseFloat(valorUnitarioInput.value) || 0;
        valorTotalInput.value = cantidad * valorUnitario;
    }

    function validarFormulario(event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        const tipoInsumo = document.getElementById("tipoInsumo").value.trim();
        const idInsumo = document.getElementById("idInsumo").value.trim();
        const nombreInsumo = document.getElementById("nombreInsumo").value.trim();
        const unidadMedida = document.getElementById("unidadMedida").value.trim();
        const cantidad = document.getElementById("cantidad").value.trim();
        const valorUnitario = document.getElementById("valorUnitario").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const estado = document.getElementById("estado").value.trim().toLowerCase();

        if (!tipoInsumo || !idInsumo || !nombreInsumo || !unidadMedida || !cantidad || !valorUnitario || !descripcion || !estado) {
            mensaje.innerHTML = `<span style="color: red;">Todos los campos son obligatorios.</span>`;
            return;
        }

        if (estado !== "activo" && estado !== "inactivo") {
            mensaje.innerHTML = `<span style="color: red;">El estado debe ser "activo" o "inactivo".</span>`;
            return;
        }

        mensaje.innerHTML = `<span style="color: green;">Datos actualizados correctamente.</span>`;
        alert("Insumo actualizado con éxito.");
    }

    cantidadInput.addEventListener("input", calcularValorTotal);
    valorUnitarioInput.addEventListener("input", calcularValorTotal);
    document.getElementById("btnActualizar").addEventListener("click", validarFormulario);
});
