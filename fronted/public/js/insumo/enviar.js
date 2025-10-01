document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form'); 
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

    [...inputs, ...selects].forEach(input => {
        input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT' && input.type !== 'file') input.placeholder = '';
        });
    });

    // --- Envío del formulario ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpiar errores anteriores
        [...inputs, ...selects].forEach(input => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT' && input.type !== 'file') input.placeholder = '';
        });

        let valido = true;

        const validarCampo = (input, mensaje) => {
            if (input.type === 'file') {
                return;
            }
            
            if (!input.value.trim()) {
                valido = false;
                input.classList.add('form__input--error');
                if (input.tagName !== 'SELECT') {
                    input.placeholder = mensaje;
                    input.value = '';
                }
            }
        };

        validarCampo(tipoInsumo, 'Tipo obligatorio');
        validarCampo(nombreInsumo, 'Nombre obligatorio');
        validarCampo(unidadMedida, 'Unidad obligatoria');
        validarCampo(cantidad, 'Cantidad obligatoria');
        validarCampo(valorUnitario, 'Valor unitario obligatorio');
        validarCampo(valorTotal, 'Valor total obligatorio');
        validarCampo(descripcion, 'Descripción obligatoria');
        validarCampo(estado, 'Seleccione estado');

        if (!valido) return;

        const formData = new FormData(form);

        try {
            const response = await fetch('http://localhost:3000/insumo', {
                method: 'POST',
                body: formData // Enviamos el objeto FormData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
                throw new Error('Error al enviar datos: ' + (errorData.error || 'Problema de conexión'));
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

            form.reset();
            alert(' Insumo creado exitosamente.');
        } catch (error) {
            console.error(' Error', error);
            alert('Error al crear el insumo. Revisa la consola para más detalles.');
        }
    });
});