document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form__container');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userName = document.querySelector('.form__input--name');
        const userEmail = document.querySelector('.form__input--email');
        const userAddress = document.querySelector('.form__input--address');
        const userPhone = document.querySelector('.form__input--phone');

        const formData = {
            name: userName ? userName.value : '',
            email: userEmail ? userEmail.value : '',
            address: userAddress ? userAddress.value : null,
            phone: userPhone ? userPhone.value : ''
        };

        try {
            const response = await fetch('http://localhost:3000/user', {
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
