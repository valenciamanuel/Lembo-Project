document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

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

        validarCampo(cultivoType, 'Tipo de cultivo obligatorio');
        validarCampo(cultivoName, 'Nombre del cultivo obligatorio');
        validarCampo(cultivoID, 'ID del cultivo obligatorio');
        validarCampo(size, 'Tamaño obligatorio');
        validarCampo(location, 'Ubicación obligatoria');
        validarCampo(description, 'Descripción obligatoria');
        validarCampo(state, 'Selecciona un estado');

        if (!imageInput.files[0]) {
            valido = false;
            imageInput.classList.add('form__input--error');
            alert('Por favor, selecciona una imagen.');
        }

        if (!valido) return;

        // Preparar datos como JSON
        const formData = {
            cultivoType: cultivoType.value,
            cultivoName: cultivoName.value,
            cultivoID: cultivoID.value,
            size: size.value,
            location: location.value,
            description: description.value,
            state: state.value,
            image: imageInput.files[0].name // o puedes enviar un base64 si quieres
        };

        try {
            const response = await fetch('http://localhost:3000/cultivo', {
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
            console.log('Cultivo registrado', result);

            if (window.opener && window.opener.postMessage) {
                window.opener.postMessage({
                    type: 'nuevoCultivoCreado',
                    cultivo: {
                        idCultivo: result.id,
                        nombreCultivo: result.cultivoName
                    }
                }, '*');
            }

            form.reset();
            alert('Cultivo creado exitosamente.');
        } catch (error) {
            console.error('Error', error);
            alert('Error al crear el cultivo. Revisa la consola para más detalles.');
        }
    });
});
