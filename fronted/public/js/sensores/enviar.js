document.addEventListener('DOMContentLoaded', () => {
    // ✅ CORRECCIÓN: Usar el ID del formulario si lo tienes, o querySelector como estaba.
    // Asumo que el formulario ya tiene el ID 'crear-sensor-form' o que usas la clase '.form'
    const form = document.querySelector('.form'); 

    // --- Referencias a los campos ---
    const imageInput = document.getElementById('image'); // Referencia al input de tipo file
    const tipoSensor = document.querySelector('.sensor__input--type');
    const nombreSensor = document.querySelector('.sensor__input--name');
    const unidadMedida = document.querySelector('.sensor__input--medida');
    const tiempoEscaneo = document.querySelector('.sensor__input--escaneo');
    const descripcion = document.querySelector('.sensor__input--descripcion');
    const estado = document.querySelector('.sensor__input--estado');

    const inputs = [tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion];
    const selects = [estado];

    // --- Quitar clase de error al escribir o cambiar ---
    // Incluimos la imagen en la limpieza
    [...inputs, ...selects, imageInput].forEach(input => {
        input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => {
            input.classList.remove('form__input--error');
            // La condición para placeholder evita error en el input de tipo file
            if (input.tagName !== 'SELECT' && input.type !== 'file') input.placeholder = ''; 
        });
    });

    // --- Envío del formulario ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpiar errores
        [...inputs, ...selects, imageInput].forEach(input => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT' && input.type !== 'file') input.placeholder = '';
        });

        let valido = true;

        const validarCampo = (input, mensaje) => {
            // Validación normal para campos de texto y select
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
        
        // Puedes hacer la imagen opcional. Si no lo es, deja esta validación:
        if (!imageInput.files[0]) {
             valido = false;
             imageInput.classList.add('form__input--error');
             alert('Por favor, selecciona una imagen del sensor.');
        }

        if (!valido) return;

        // ✅ CORRECCIÓN CLAVE: Usar FormData para enviar archivos y datos de formulario
        const formData = new FormData(form);

        try {
            const response = await fetch('http://localhost:3000/sensores', {
                method: 'POST',
                // ✅ IMPORTANTE: Se elimina 'Content-Type': 'application/json' 
                // El navegador lo establece automáticamente para FormData (multipart/form-data)
                body: formData 
            });

            if (!response.ok) {
                // Leer el error del servidor para debug más fácil
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
                throw new Error('Error al enviar datos: ' + (errorData.error || 'Problema de conexión'));
            }

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
            alert('✅ Sensor creado exitosamente.');
        } catch (error) {
            console.error('❌ Error', error);
            alert('Error al crear el sensor. Revisa la consola para más detalles.');
        }
    });
});