document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.formulario');
    const messageContainer = document.getElementById('message-container');

    const fechaUsoInput = document.querySelector('.formulario__entrada--fecha');
    const cantidadInput = document.querySelector('.formulario__entrada--cantidad');
    const valorUnitarioInput = document.querySelector('.formulario__entrada--valorUnitario');
    const valorTotalInput = document.querySelector('.formulario__entrada--valorTotal');
    const responsableInput = document.querySelector('.formulario__entrada--responsable');
    const observacionesInput = document.querySelector('.formulario__entrada--observaciones');
    const insumoSelect = document.querySelector('.formulario__selector--insumo');

    // --- Funciones de Utilidad de Fechas ---

    // Obtiene la fecha de hoy en formato YYYY-MM-DD (para el atributo MAX)
    const getTodayString = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    // Obtiene el primer día del mes actual en formato YYYY-MM-DD (para el atributo MIN)
    const getFirstDayOfMonthString = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}-01`; // Día fijado al 01
    };

    // Aplicar restricciones MIN y MAX al campo de fecha
    if (fechaUsoInput) {
        // Establece el máximo a la fecha de hoy (evita fechas futuras)
        fechaUsoInput.setAttribute('max', getTodayString());
        
        // Establece el mínimo al primer día del mes actual (BLOQUEA meses anteriores)
        fechaUsoInput.setAttribute('min', getFirstDayOfMonthString());
    }
    
    // Función para mostrar errores
    const showError = (message) => {
        if (!messageContainer) return;
        messageContainer.innerHTML = '';
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'error');
        msgDiv.style.color = 'red';
        msgDiv.textContent = message;
        messageContainer.appendChild(msgDiv);
        setTimeout(() => msgDiv.remove(), 5000); 
    };

    // Función para calcular Valor Total y actualizar el input
    const calcularValorTotal = () => {
        const cantidad = parseFloat(cantidadInput.value) || 0;
        const valorUnitario = parseFloat(valorUnitarioInput.value) || 0;
        const total = cantidad * valorUnitario;
        valorTotalInput.value = total.toFixed(2); 
    };

    // Event Listeners para el cálculo automático
    if (cantidadInput && valorUnitarioInput && valorTotalInput) {
        cantidadInput.addEventListener('input', calcularValorTotal);
        valorUnitarioInput.addEventListener('input', calcularValorTotal);
    }
    
    // --- Manejador del Formulario ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (messageContainer) messageContainer.innerHTML = ''; 

        calcularValorTotal();

        // --- Validaciones de Cliente ---
        const fecha_uso = fechaUsoInput ? fechaUsoInput.value.trim() : '';
        const cantidadStr = cantidadInput ? cantidadInput.value.trim() : '';
        const valorUnitarioStr = valorUnitarioInput ? valorUnitarioInput.value.trim() : '';
        const responsable = responsableInput ? responsableInput.value.trim() : '';
        const insumo = insumoSelect ? insumoSelect.value : '';
        
        const cantidad = parseFloat(cantidadStr);
        const valorUnitario = parseFloat(valorUnitarioStr);
        const valorTotal = parseFloat(valorTotalInput.value.trim());

        // Campos obligatorios
        if (!fecha_uso || !cantidadStr || !valorUnitarioStr || !responsable || !insumo) {
            showError('Por favor, complete todos los campos obligatorios.');
            return;
        }

        // Validación numérica
        if (isNaN(cantidad) || cantidad <= 0) {
            showError('La Cantidad debe ser un número positivo.');
            return;
        }
        if (isNaN(valorUnitario) || valorUnitario < 0) {
            showError('El Valor Unitario debe ser un número no negativo.');
            return;
        }
        
        // Validación de Valor Total
        if (isNaN(valorTotal) || (cantidad > 0 && valorUnitario > 0 && valorTotal <= 0)) {
             showError('Error en el cálculo del Valor Total. Verifique Cantidad y Valor Unitario.');
             return;
        }

        // --- VALIDACIÓN DE FECHA (Doble chequeo) ---
        const fechaSeleccionada = new Date(fecha_uso);
        const hoy = new Date();
        
        // Punto de corte: primer día del mes actual
        const primerDiaMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1); 
        primerDiaMesActual.setHours(0, 0, 0, 0); 
        
        // Normalización de hoy para el chequeo de "no futuro"
        const hoyNormalizado = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        
        if (fechaSeleccionada < primerDiaMesActual) {
            showError("La Fecha de Uso no puede ser anterior al mes actual.");
            return;
        }
        
        if (fechaSeleccionada > hoyNormalizado) {
            showError("La Fecha de Uso no puede ser una fecha futura.");
            return;
        }


        // --- Construcción del Payload ---
        const formData = {
            fecha_uso: fecha_uso,
            cantidad: cantidad,
            responsable: responsable,
            valor_unitario: valorUnitario,
            valor_total: valorTotal,
            observaciones: observacionesInput ? observacionesInput.value.trim() : '', 
            insumo: insumo 
        };

        try {
            const response = await fetch('http://localhost:3000/uso_insumo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido en el servidor.' }));
                throw new Error(errorData.error || 'Error al guardar el uso de insumo.');
            }

            console.log('Uso de Insumo registrado');
            alert('¡Uso de insumo registrado exitosamente!');
            window.location.href = 'listar_uso_insumo.html'; 

        } catch (error) {
            console.error('Error', error);
            showError(error.message || 'Error en la conexión con el servidor.');
        }
    });
});