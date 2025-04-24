document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    const tipoInsumo = document.querySelector('.insumo__input--type');
    const nombreInsumo = document.querySelector('.insumo__input--nombre');
    const unidadMedida = document.querySelector('.cultivo__input--size'); // OJO: Revisa este selector, ¿es correcto?
    const cantidad = document.querySelector('.insumo__input--cantidad');
    const valorUnitario = document.querySelector('.insumo__input--unitario');
    const valorTotal = document.querySelector('.insumo__input--total');
    const descripcion = document.querySelector('.insumo__input--descripcion');
    const estado = document.querySelector('.insumo__input--estado');

    const inputs = [tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion];
    const selects = [estado];

    // Escucha para inputs: quitar rojo al escribir
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('form__input--error');
            input.placeholder = '';
        });
    });

    // Escucha para selects: quitar rojo al cambiar
    selects.forEach(select => {
        select.addEventListener('change', () => {
            select.classList.remove('form__input--error');
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpiar errores anteriores
        [...inputs, ...selects].forEach(input => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT') input.placeholder = '';
        });

        let valido = true;

        const validarCampo = (input, mensaje) => {
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

        const formData = {
            tipoInsumo: tipoInsumo.value,
            nombreInsumo: nombreInsumo.value,
            unidadMedida: unidadMedida.value,
            cantidad: cantidad.value,
            valorUnitario: valorUnitario.value,
            valorTotal: valorTotal.value,
            descripcion: descripcion.value,
            estado: estado.value
        };

        try {
            const response = await fetch('http://localhost:3000/insumo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error en la conexión con el servidor');
            }

            const result = await response.json();
            console.log('Insumo registrado', result);

            // Enviar mensaje a la ventana que abrió este formulario
            if (window.opener && window.opener.postMessage) {
                window.opener.postMessage({
                    type: 'nuevoInsumoCreado',
                    insumo: result // Asegúrate de que 'result' contenga { idInsumo: ..., nombreInsumo: ... }
                }, '*');
            }

            form.reset();
        } catch (error) {
            console.error('Error', error);
        }
    });
});