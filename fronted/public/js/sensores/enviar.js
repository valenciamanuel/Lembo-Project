document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    const tipoSensor = document.querySelector('.sensor__input--type');
    const nombreSensor = document.querySelector('.sensor__input--name');
    const unidadMedida = document.querySelector('.sensor__input--medida');
    const tiempoEscaneo = document.querySelector('.sensor__input--escaneo');
    const descripcion = document.querySelector('.sensor__input--descripcion');
    const estado = document.querySelector('.sensor__input--estado');

    const inputs = [
        tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo,
        descripcion, estado
    ];

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT') input.placeholder = '';
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        [...inputs].forEach(input => {
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

        const formData = {
            tipoSensor: tipoSensor.value,
            nombreSensor: nombreSensor.value,
            unidadMedida: unidadMedida.value,
            tiempoEscaneo: tiempoEscaneo.value,
            descripcion: descripcion.value,
            estado: estado.value
        };

        try {
            const response = await fetch('http://localhost:3000/sensores', {
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
            console.log('Sensor registrado', result);

            // Enviar mensaje a la ventana que abrió este formulario (si existe)
            if (window.opener && window.opener.postMessage) {
                window.opener.postMessage({
                    type: 'nuevoSensorCreado',
                    sensor: result // Asegúrate de que 'result' contenga { idSensor: ..., nombreSensor: ... }
                }, '*');
            }

            form.reset(); // Limpiar formulario después de enviar los datos
        } catch (error) {
            console.error('Error', error);
        }
    });
});