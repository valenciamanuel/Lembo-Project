document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form'); 
    // Contenedor para mensajes de validación
    const messageContainer = document.getElementById('mensajeValidacion'); 
    
    const imageInput = document.getElementById('image');
    
    const tipoInsumo = document.querySelector('.insumo__input--type');
    const nombreInsumo = document.querySelector('.insumo__input--nombre');
    const unidadMedida = document.querySelector('.insumo__input--unidad');
    const cantidad = document.querySelector('.insumo__input--cantidad');
    const valorUnitario = document.querySelector('.insumo__input--unitario');
    const valorTotal = document.querySelector('.insumo__input--total');
    const descripcion = document.querySelector('.insumo__input--descripcion');
    const estado = document.querySelector('.insumo__input--estado');

    const inputs = [imageInput, tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion];
    const selects = [estado];

    // Función para mostrar mensajes de éxito o error
    const showMessage = (message, type) => {
        if (!messageContainer) return;
        
        // Limpiar estilos si es un error, o agregar clase si es éxito/error
        if (type === 'error') {
            messageContainer.classList.add('form__message', 'error');
            messageContainer.classList.remove('success');
        } else {
            messageContainer.classList.add('form__message', 'success');
            messageContainer.classList.remove('error');
        }
        
        messageContainer.textContent = message;
        
        // Opcional: Ocultar después de un tiempo si no es un error de validación
        if (type === 'success') {
             setTimeout(() => messageContainer.textContent = '', 4000);
        }
    };
    
    // Limpieza de errores al interactuar con los campos
    [...inputs, ...selects].forEach(input => {
        input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT' && input.type !== 'file') input.placeholder = '';
            messageContainer.textContent = ''; // Limpiar mensaje de validación al empezar a escribir
        });
    });
    
    // --- FUNCIÓN DE VALIDACIÓN NUMÉRICA ---
    // Valida que el valor sea un número y que sea positivo (>= 0)
    const validarNumeroPositivo = (inputElement, mensaje, allowZero = true) => {
        const value = Number(inputElement.value);
        
        // Validar que sea un número
        if (isNaN(value)) {
            inputElement.classList.add('form__input--error');
            showMessage(mensaje, 'error');
            return false;
        }
        
        // Validar si debe ser positivo (permitiendo cero)
        if (allowZero && value < 0) {
            inputElement.classList.add('form__input--error');
            showMessage(mensaje, 'error');
            return false;
        } else if (!allowZero && value <= 0) { // Si no permitimos cero (ej. para IDs)
            inputElement.classList.add('form__input--error');
            showMessage(mensaje, 'error');
            return false;
        }
        
        return true;
    };
    // -------------------------------------------

    // --- Envío del formulario ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpiar errores anteriores
        [...inputs, ...selects].forEach(input => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT' && input.type !== 'file') input.placeholder = '';
        });
        messageContainer.textContent = '';

        let valido = true;

        const validarCampo = (input, mensaje) => {
            if (input.type === 'file' || input.name === 'image') return;
            
            if (!input.value.trim()) {
                valido = false;
                input.classList.add('form__input--error');
                if (input.tagName !== 'SELECT') {
                    input.placeholder = mensaje;
                    input.value = '';
                } else {
                    showMessage(mensaje, 'error');
                }
            }
        };

        // 1. Validaciones de campos vacíos
        validarCampo(tipoInsumo, 'Tipo obligatorio');
        validarCampo(nombreInsumo, 'Nombre obligatorio');
        validarCampo(unidadMedida, 'Unidad obligatoria');
        validarCampo(cantidad, 'Cantidad obligatoria');
        validarCampo(valorUnitario, 'Valor unitario obligatorio');
        validarCampo(valorTotal, 'Valor total obligatorio');
        validarCampo(descripcion, 'Descripción obligatoria');
        validarCampo(estado, 'Seleccione estado');

        if (!valido) return;
        
        // 2. Validaciones numéricas (Cantidad, Valor Unitario y Valor Total)
        if (!validarNumeroPositivo(cantidad, 'La cantidad debe ser un número positivo (puede ser cero).', true)) return;
        if (!validarNumeroPositivo(valorUnitario, 'El valor unitario debe ser un número positivo (puede ser cero).', true)) return;
        if (!validarNumeroPositivo(valorTotal, 'El valor total debe ser un número positivo (puede ser cero).', true)) return;


        const formData = new FormData(form);

        try {
            const response = await fetch('http://localhost:3000/insumo', {
                method: 'POST',
                body: formData 
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
                console.error('Error al registrar el insumo:', errorData);
                showMessage(errorData.error || 'Problema de conexión o datos inválidos.', 'error');
                return;
            }

            const result = await response.json();
            console.log('Insumo registrado', result);

            // Enviar mensaje a la ventana que abrió este formulario
            if (window.opener && window.opener.postMessage) {
                window.opener.postMessage({
                    type: 'nuevoInsumoCreado',
                    insumo: { idInsumo: result.idInsumo, nombreInsumo: result.nombreInsumo }
                }, '*');
            }

            showMessage(' Insumo creado exitosamente.', 'success');
            
            // Limpiar formulario y errores tras el éxito
            form.reset();
            imageInput.value = '';
            estado.selectedIndex = 0;

        } catch (error) {
            console.error(' Error', error);
            // Mensaje más descriptivo si es un error de red
            showMessage('Error al crear el insumo. El servidor no está respondiendo o la ruta es incorrecta.', 'error');
        }
    });
});
