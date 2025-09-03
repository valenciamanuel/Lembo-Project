document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    // --- Referencias a los campos ---
    const tipoSensor = document.querySelector('.sensor__input--type');
    const nombreSensor = document.querySelector('.sensor__input--name');
    const unidadMedida = document.querySelector('.sensor__input--medida');
    const tiempoEscaneo = document.querySelector('.sensor__input--escaneo');
    const descripcion = document.querySelector('.sensor__input--descripcion');
    const estado = document.querySelector('.sensor__input--estado');

    const inputs = [tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion];
    const selects = [estado];

    // --- Quitar clase de error al escribir o cambiar ---
    [...inputs, ...selects].forEach(input => {
        input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT') input.placeholder = '';
        });
    });

    // --- Envío del formulario ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpiar errores
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

        validarCampo(tipoSensor, 'Tipo de sensor obligatorio');
        validarCampo(nombreSensor, 'Nombre del sensor obligatorio');
        validarCampo(unidadMedida, 'Unidad de medida obligatoria');
        validarCampo(tiempoEscaneo, 'Tiempo de escaneo obligatorio');
        validarCampo(descripcion, 'Descripción obligatoria');
        validarCampo(estado, 'Seleccionar estado');

        if (!valido) return;

        // --- Datos como JSON ---
        const formData = {
            tipoSensor: tipoSensor.value,
            nombreSensor: nombreSensor.value,
            unidadMedida: unidadMedida.value,
            tiempoEscaneo: tiempoEscaneo.value,
            descripcion: descripcion.value,
            estado: estado.value
        };

        try {
            const response = await fetch('http://localhost:3000/api/sensores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Error en la conexión con el servidor');

            const result = await response.json();
            console.log('Sensor registrado', result);

            // --- Mensaje a la ventana que abrió este formulario ---
            if (window.opener && window.opener.postMessage) {
                window.opener.postMessage({
                    type: 'nuevoSensorCreado',
                    sensor: { idSensor: result.id, nombreSensor: result.nombreSensor }
                }, '*');
            }

            form.reset();
            alert('Sensor creado exitosamente.');
        } catch (error) {
            console.error('Error', error);
            alert('Error al crear el sensor. Revisa la consola para más detalles.');
        }
    });
});
