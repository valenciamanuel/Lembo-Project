document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const cultivoType = document.querySelector('.cultivo__input--type');
        const cultivoName = document.querySelector('.cultivo__input--name');
        const cultivoID = document.querySelector('.cultivo__input--ID');
        const size = document.querySelector('.cultivo__input--size');
        const location = document.querySelector('.cultivo__input--location');
        const description = document.querySelector('.cultivo__input--description');
        const state = document.querySelector('.cultivo__input--state');

        const formData = {
            cultivoType: cultivoType ? cultivoType.value : '',
            cultivoName: cultivoName ? cultivoName.value : '',
            cultivoID: cultivoID ? cultivoID.value : '',
            size: size ? size.value : '',
            location: location ? location.value : '',
            description: description ? description.value : '', 
            state: state ? state.value : ''  
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
            console.log('Ciclo registrado', result);

            form.reset(); // Limpiar formulario después de enviar los datos
        } catch (error) {
            console.error('Error', error);
        }
    });
});
