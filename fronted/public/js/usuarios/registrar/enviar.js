document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userType = document.querySelector('.form__select--user');
        const userTypeId = document.querySelector('.form__select--id');
        const userID = document.querySelector('.form__input--id');
        const userName = document.querySelector('.form__input--name');
        const userEmail = document.querySelector('.form__input--email');
        const userPhone = document.querySelector('.form__input--phone');
        const userPassword = document.querySelector('.form__input--password');

        const formData = {
            usertype: userType ? userType.value : '',
            IDtype: userTypeId ? userTypeId.value : '',
            IDnum: userID ? userID.value : '',
            name: userName ? userName.value : '',
            email: userEmail ? userEmail.value : '',
            phone: userPhone ? userPhone.value : '', 
            password: userPassword ? userPassword.value : ''  
        };
        
        

        try {
            const response = await fetch('http://localhost:3000/register', {
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
            console.log('Usuario registrado', result);

            form.reset(); 
        } catch (error) {
            console.error('Error', error);
        }
    });
});
