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
        setTimeout(() => { msgDiv.classList.remove('show'); setTimeout(() => msgDiv.remove(), 500); }, 4000);
    };

    const cultivoType = document.querySelector('.cultivo__input--type');
    const cultivoName = document.querySelector('.cultivo__input--name');
    const cultivoID = document.querySelector('.cultivo__input--ID');
    const size = document.querySelector('.cultivo__input--size');
    const location = document.querySelector('.cultivo__input--location');
    const description = document.querySelector('.cultivo__input--description');
    const state = document.querySelector('.cultivo__input--state');
    const imageInput = document.getElementById('image');

    const inputs = [cultivoType, cultivoName, cultivoID, size, location, description];
    const selects = [state];

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('form__input--error');
            input.placeholder = '';
        });
    });

    selects.forEach(select => {
        select.addEventListener('change', () => {
            select.classList.remove('form__input--error');
        });
    });

    imageInput.addEventListener('change', () => {
        imageInput.classList.remove('form__input--error');
    });

    const validarNumeroPositivo = (inputElement, mensaje) => {
        const value = Number(inputElement.value);
        if (isNaN(value) || value <= 0) {
            inputElement.classList.add('form__input--error');
            showMessage(mensaje, 'error');
            return false;
        }
        return true;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

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
                } else {
                    showMessage(mensaje, 'error');
                }
            }
        };

        validarCampo(cultivoType, 'Tipo de cultivo obligatorio');
        validarCampo(cultivoName, 'Nombre del cultivo obligatorio');
        validarCampo(cultivoID, 'ID del cultivo obligatorio');
        validarCampo(size, 'Tamaño obligatorio');
        validarCampo(location, 'Ubicación obligatoria');
        validarCampo(description, 'Descripción obligatoria');
        validarCampo(state, 'Seleccionar estado');
        
        if (!imageInput.files[0]) {
            valido = false;
            imageInput.classList.add('form__input--error');
            showMessage('Por favor, selecciona una imagen.', 'error');
        }

        if (!valido) return;
        
        // Validación de IDs y números positivos para cultivoID y size
        if (!validarNumeroPositivo(cultivoID, 'El ID del cultivo debe ser un número entero positivo.')) return;
        if (!validarNumeroPositivo(size, 'El tamaño del cultivo debe ser un número positivo.')) return;

        const formData = new FormData();
        formData.append('cultivoType', cultivoType.value);
        formData.append('cultivoName', cultivoName.value);
        formData.append('cultivoID', cultivoID.value);
        formData.append('size', size.value);
        formData.append('location', location.value);
        formData.append('description', description.value);
        formData.append('state', state.value);
        formData.append('image', imageInput.files[0]);

        
        const dataForLog = {};
        for (let [key, value] of formData.entries()) {
            dataForLog[key] = value;
        }
        console.log('Datos que se van a enviar:', dataForLog);

        try {
            const response = await fetch('http://localhost:3000/cultivo', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
                console.error('Error al registrar el cultivo:', errorData);
                showMessage(errorData.error || 'Error en la conexión con el servidor o datos inválidos.', 'error');
                return;
            }

            const result = await response.json();
            console.log('Cultivo registrado', result);
            showMessage('Cultivo creado exitosamente.', 'success');

            form.reset();
            imageInput.value = '';
            state.selectedIndex = 0;
            inputs.forEach(input => input.classList.remove('form__input--error'));

        } catch (error) {
            console.error('Error', error);
            showMessage('Error al crear el cultivo. Revisa la consola para más detalles.', 'error');
        }
    });
});
