document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    const cultivoType = document.querySelector('.cultivo__input--type');
    const cultivoName = document.querySelector('.cultivo__input--name');
    const cultivoID = document.querySelector('.cultivo__input--ID');
    const size = document.querySelector('.cultivo__input--size');
    const location = document.querySelector('.cultivo__input--location');
    const description = document.querySelector('.cultivo__input--description');
    const state = document.querySelector('.cultivo__input--state');

    const inputs = [
        cultivoType, cultivoName, cultivoID, size, 
        location, description, state
    ];

    // Escucha para inputs: quitar error al escribir
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT') input.placeholder = '';
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpiar errores anteriores
        [...inputs].forEach(input => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT') input.placeholder = '';
        });

        let valido = true;

        // Función para validar campos
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

        // Validar cada campo
        validarCampo(cultivoType, 'Tipo de cultivo obligatorio');
        validarCampo(cultivoName, 'Nombre del cultivo obligatorio');
        validarCampo(cultivoID, 'ID del cultivo obligatorio');
        validarCampo(size, 'Tamaño obligatorio');
        validarCampo(location, 'Ubicación obligatoria');
        validarCampo(description, 'Descripción obligatoria');
        validarCampo(state, 'Seleccionar estado');

        if (!valido) return;

        // Datos del formulario
        const formData = {
            cultivoType: cultivoType.value,
            cultivoName: cultivoName.value,
            cultivoID: cultivoID.value,
            size: size.value,
            location: location.value,
            description: description.value,
            state: state.value
        };

        try {
            const response = await fetch('http://localhost:3000/cultivo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)  // Aquí se están enviando los datos como JSON
            });

            if (!response.ok) {
                throw new Error('Error en la conexión con el servidor');
            }

            const result = await response.json();
            console.log('Cultivo registrado', result);

            form.reset(); // Limpiar formulario después de enviar los datos
        } catch (error) {
            console.error('Error', error);
        }
    });
});
