document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const cicloID = document.querySelector('.form__input--ID');
        const cicloName = document.querySelector('.form__input--name');
        const siembraDate = document.querySelector('.form__input--siembra');
        const cosechaDate = document.querySelector('.form__input--cosecha');
        const news = document.querySelector('.form__input--news');
        const description = document.querySelector('.form__input--description');
        const state = document.querySelector('.form__input--state');

        const formData = {
            cicloID: cicloID ? cicloID.value : '',
            cicloName: cicloName ? cicloName.value : '',
            siembraDate: siembraDate ? siembraDate.value : '',
            cosechaDate: cosechaDate ? cosechaDate.value : '',
            news: news ? news.value : '',
            description: description ? description.value : '', 
            state: state ? state.value : ''  
        };
        
        

        try {
            const response = await fetch('http://localhost:3000/CicloCultivo', {
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
            console.log('Ciclo Cultivo registrado', result);

            form.reset(); // Limpiar formulario después de enviar los datos
        } catch (error) {
            console.error('Error', error);
        }
    });
});
