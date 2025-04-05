document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const idInsumo = document.querySelector('.insumo__input--ID');
        const tipoInsumo = document.querySelector('.insumo__input--type');
        const nombreInsumo = document.querySelector('.insumo__input--nombre');
        const unidadMedida = document.querySelector('.insumo__input--medida');
        const cantidad = document.querySelector('.insumo__input--cantidad');
        const valorUnitario = document.querySelector('.insumo__input--unitario');
        const descripcion = document.querySelector('.insumo__input--descripcion');
        const estado = document.querySelector('.insumo__input--estado');

        const formData = {
            idInsumo: idInsumo ? idInsumo.value : '',
            tipoInsumo: tipoInsumo ? tipoInsumo.value : '',
            nombreInsumo: nombreInsumo ? nombreInsumo.value : '',
            unidadMedida: unidadMedida ? unidadMedida.value : '',
            cantidad: cantidad ? cantidad.value : '',
            valorUnitario: valorUnitario ? valorUnitario.value : '', 
            descripcion: descripcion ? descripcion.value : '',  
            estado: estado ? estado.value : ''  
        };
        
        

        try {
            const response = await fetch('http://localhost:3000/insumos', {
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
