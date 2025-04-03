document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.sensor__form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const tipoSensor = document.querySelector('.sensor__input--type');
        const unidadMedida = document.querySelector('.sensor__input--name');
        const tiempoEscaneo = document.querySelector('.sensor__input--medida');
        const descripcion = document.querySelector('.sensor__input--escaneo');
        const estado = document.querySelector('.sensor__input--descripcion');
        const nombreSensor = document.querySelector('.sensor__input--estado');

        const formData = {
            tipoSensor: tipoSensor ? tipoSensor.value : '',
            nombreSensor: nombreSensor ? nombreSensor.value : '',
            unidadMedida: unidadMedida ? unidadMedida.value : '',
            tiempoEscaneo: tiempoEscaneo ? tiempoEscaneo.value : '',
            descripcion: descripcion ? descripcion.value : '', 
            estado: estado ? estado.value : ''  
        };

        try {
            const response = await fetch('http://localhost:3000/sensores', {
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
            console.log('sensor registrado', result);

            form.reset(); // Limpiar formulario después de enviar los datos
        } catch (error) {
            console.error('Error', error);
        }
    });
});
