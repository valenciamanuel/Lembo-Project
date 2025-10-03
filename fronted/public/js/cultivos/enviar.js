document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const messageContainer = document.getElementById('message-container');

    // Función modificada para manejar SÓLO ERRORES en el contenedor, 
    // ya que el éxito se manejará con alert()
    const showError = (message) => {
        if (!messageContainer) return;
        
        messageContainer.innerHTML = ''; 
        
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'error');
        msgDiv.textContent = message;
        
        messageContainer.appendChild(msgDiv);
        
        setTimeout(() => msgDiv.classList.add('show'), 10);
        
        setTimeout(() => { 
            msgDiv.classList.remove('show'); 
            setTimeout(() => msgDiv.remove(), 500); 
        }, 4000);
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

    // --- Limpieza de errores al escribir/cambiar ---
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
            showError(mensaje); // Usamos showError
            return false;
        }
        return true;
    };

    const validarCampo = (input, mensaje) => {
        if (!input.value.trim()) {
            // No se establece 'valido = false' aquí, se hace en el submit
            input.classList.add('form__input--error');
            if (input.tagName !== 'SELECT') {
                input.placeholder = mensaje;
                input.value = '';
            } else {
                showError(mensaje);
            }
            return false;
        }
        return true;
    };

    // --- Manejador del Formulario ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpiar estilos de error previos
        [...inputs, ...selects].forEach(input => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT') input.placeholder = '';
        });

        let valido = true;
        
        // 1. Validaciones de campos obligatorios
        if (!validarCampo(cultivoType, 'Tipo de cultivo obligatorio')) valido = false;
        if (!validarCampo(cultivoName, 'Nombre del cultivo obligatorio')) valido = false;
        if (!validarCampo(cultivoID, 'ID del cultivo obligatorio')) valido = false;
        if (!validarCampo(size, 'Tamaño obligatorio')) valido = false;
        if (!validarCampo(location, 'Ubicación obligatoria')) valido = false;
        if (!validarCampo(description, 'Descripción obligatoria')) valido = false;
        if (!validarCampo(state, 'Seleccionar estado')) valido = false;
        
        if (!imageInput.files[0]) {
            valido = false;
            imageInput.classList.add('form__input--error');
            showError('Por favor, selecciona una imagen.');
        }

        if (!valido) return;
        
        // 2. Validaciones de formato numérico
        if (!validarNumeroPositivo(cultivoID, 'El ID del cultivo debe ser un número entero positivo.')) return;
        if (!validarNumeroPositivo(size, 'El tamaño del cultivo debe ser un número positivo.')) return;

        // Construir FormData
        const formData = new FormData();
        formData.append('cultivoType', cultivoType.value);
        formData.append('cultivoName', cultivoName.value);
        formData.append('cultivoID', cultivoID.value);
        formData.append('size', size.value);
        formData.append('location', location.value);
        formData.append('description', description.value);
        formData.append('state', state.value);
        formData.append('image', imageInput.files[0]);

        try {
            const response = await fetch('http://localhost:3000/cultivo', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
                console.error('Error al registrar el cultivo:', errorData);
                showError(errorData.error || 'Error en la conexión con el servidor o datos inválidos.');
                return;
            }

            const result = await response.json();
            console.log('Cultivo registrado', result);
            
            
            alert('Cultivo creado exitosamente.');

        
            window.location.href = '../cultivos/listar_cultivo.html'; 

        } catch (error) {
            console.error('Error', error);
            showError('Error al crear el cultivo. Revisa la consola para más detalles.');
        }
    });
});