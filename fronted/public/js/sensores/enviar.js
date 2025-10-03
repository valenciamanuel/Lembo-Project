document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form'); 
    const messageContainer = document.getElementById('message-container');

    const showMessage = (message, type) => {
        if (!messageContainer) return;
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', type);
        msgDiv.textContent = message;
        messageContainer.innerHTML = '';
        messageContainer.appendChild(msgDiv);
        setTimeout(() => msgDiv.classList.add('show'), 10);
        setTimeout(() => { 
            msgDiv.classList.remove('show'); 
            setTimeout(() => msgDiv.remove(), 500); 
        }, 2000);
    };

    const validarNumeroPositivo = (inputElement, mensaje, allowZero = true) => {
        const value = Number(inputElement.value);
        if (isNaN(value)) {
            inputElement.classList.add('form__input--error');
            showMessage(mensaje + ' debe ser un valor numérico.', 'error');
            return false;
        }
        if (allowZero && value < 0) {
            inputElement.classList.add('form__input--error');
            showMessage(mensaje + ' (No puede ser negativo).', 'error');
            return false;
        } else if (!allowZero && value <= 0) { 
            inputElement.classList.add('form__input--error');
            showMessage(mensaje + ' (Debe ser un valor positivo > 0).', 'error');
            return false;
        }
        return true;
    };

    const imageInput = document.getElementById('image'); 
    const tipoSensor = document.querySelector('.sensor__input--type');
    const nombreSensor = document.querySelector('.sensor__input--name');
    const unidadMedida = document.querySelector('.sensor__input--medida');
    const tiempoEscaneo = document.querySelector('.sensor__input--escaneo');
    const descripcion = document.querySelector('.sensor__input--descripcion');
    const estado = document.querySelector('.sensor__input--estado');

    const inputs = [tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion];
    const selects = [estado];

    [...inputs, ...selects, imageInput].forEach(input => {
        input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT' && input.type !== 'file') input.placeholder = ''; 
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        [...inputs, ...selects, imageInput].forEach(input => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT' && input.type !== 'file') input.placeholder = '';
        });
        messageContainer.innerHTML = '';

        let valido = true;

        const validarCampo = (input, mensaje) => {
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

        validarCampo(tipoSensor, 'Tipo de sensor obligatorio');
        validarCampo(nombreSensor, 'Nombre del sensor obligatorio');
        validarCampo(unidadMedida, 'Unidad de medida obligatoria');
        validarCampo(tiempoEscaneo, 'Tiempo de escaneo obligatorio');
        validarCampo(descripcion, 'Descripción obligatoria');
        validarCampo(estado, 'Seleccionar estado');

        if (!imageInput.files[0]) {
            valido = false;
            imageInput.classList.add('form__input--error');
            showMessage('Por favor, selecciona una imagen del sensor.', 'error');
        }

        if (!valido) return;
        if (!validarNumeroPositivo(tiempoEscaneo, 'Tiempo de escaneo', true)) return; 

        const formData = new FormData(form);

        try {
            const response = await fetch('http://localhost:3000/sensores', {
                method: 'POST',
                body: formData 
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
                console.error('Error al enviar datos:', errorData);
                showMessage('Error al enviar datos: ' + (errorData.error || 'Problema de conexión o servidor no responde.'), 'error');
                return;
            }

            const result = await response.json();
            console.log('Sensor registrado', result);

            if (window.opener && window.opener.postMessage) {
                window.opener.postMessage({
                    type: 'nuevoSensorCreado',
                    sensor: { idSensor: result.id, nombreSensor: result.nombreSensor }
                }, '*');
            }

            form.reset();
            // ✅ Mostrar alert y redirigir después de cerrarla
            alert('Sensor creado exitosamente.');
            window.location.href = "../homes/home-sensores.html";

        } catch (error) {
            console.error('Error de red al crear el sensor:', error);
            showMessage('Error al crear el sensor. Revisa la consola para más detalles. Asegúrate de que el servidor esté corriendo.', 'error');
        }
    });
});
