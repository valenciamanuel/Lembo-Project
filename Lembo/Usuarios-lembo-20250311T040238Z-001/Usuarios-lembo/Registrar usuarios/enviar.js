document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form--registro');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userType = document.querySelector('.form__select--user');
        const userTypeId = document.querySelector('.form__select--id');
        const userID = document.querySelector('.form__input--id');
        const userName = document.querySelector('.form__input--name');
        const userEmail = document.querySelector('.form__input--email');
        const userPhone = document.querySelector('.form__input--phone');

        const formData = {
            user: userType ? userType.value : '',
            typeID: userTypeId ? userTypeId.value : '',
            ID: userID ? userID.value : '',
            name: userName ? userName.value : '',
            email: userEmail ? userEmail.value : '',
            phone: userPhone ? userPhone.value : '',
            confirmarCorreo: document.querySelector('.form__input--email').value // Agregar este campo
        };
        

        try {
            const response = await fetch('http://localhost:3000/register', {
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
            console.log('Usuario registrado', result);

            form.reset(); // Limpiar formulario después de enviar los datos
        } catch (error) {
            console.error('Error', error);
        }
    });
});
