document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    // Elementos del formulario
    const userType = document.querySelector('.form__select--user');
    const userTypeId = document.querySelector('.form__select--id');
    const userID = document.querySelector('.form__input--id');
    const userName = document.querySelector('.form__input--name');
    const userEmail = document.querySelector('.form__input--email');
    const userPhone = document.querySelector('.form__input--phone');
    const userPassword = document.querySelector('.form__input--password');

    const inputs = [
        userType, userTypeId, userID, userName, userEmail, userPhone, userPassword
    ];

    // Eliminar errores al escribir
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT') input.placeholder = ''; // Quitar texto de error al escribir
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpiar errores anteriores
        [...inputs].forEach(input => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT') input.placeholder = ''; // Limpiar errores anteriores
        });

        let valido = true;

        // Función para validar campos
        const validarCampo = (input, mensaje) => {
            if (!input.value.trim()) {
                valido = false;
                input.classList.add('form__input--error');
                if (input.tagName !== 'SELECT') {
                    input.placeholder = mensaje;
                    input.value = ''; // Limpiar el valor del input cuando está vacío
                }
            }
        };

        // Validar cada campo
        validarCampo(userType, 'Selecciona el tipo de usuario');
        validarCampo(userTypeId, 'Selecciona el tipo de ID');
        validarCampo(userID, 'Ingresa un número de identificación');
        validarCampo(userName, 'Ingresa el nombre');
        validarCampo(userEmail, 'Ingresa un correo electrónico');
        validarCampo(userPhone, 'Ingresa un número de teléfono');
        validarCampo(userPassword, 'Ingresa una contraseña');

        if (!valido) return;

        // Crear objeto con los datos del formulario
        const formData = {
            usertype: userType.value,
            IDtype: userTypeId.value,
            IDnum: userID.value,
            name: userName.value,
            email: userEmail.value,
            phone: userPhone.value,
            password: userPassword.value
        };

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)  // Enviar los datos como JSON
            });

            if (!response.ok) {
                throw new Error('Error en la conexión con el servidor');
            }

            const result = await response.json();
            console.log('Usuario registrado', result);

            form.reset(); // Limpiar formulario después de enviar los datos
        } catch (error) {
            console.error('Error', error);
        }
    });
});
