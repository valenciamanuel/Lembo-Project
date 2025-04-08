document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Extraer valores de los inputs
        const idInsumo = document.querySelector('.insumo__input--ID').value;
        const tipoInsumo = document.querySelector('.insumo__input--type').value;
        const nombreInsumo = document.querySelector('.insumo__input--nombre').value;
        const unidadMedida = document.querySelector('.cultivo__input--size').value;
        const cantidad = document.querySelector('.insumo__input--cantidad').value;
        const valorUnitario = document.querySelector('.insumo__input--unitario').value;
        const descripcion = document.querySelector('.insumo__input--descripcion').value;
        const estado = document.querySelector('.insumo__input--estado').value;

        // Armamos el objeto con los datos (la imagen se omite en este ejemplo)
        const formData = {
            idInsumo,
            tipoInsumo,
            nombreInsumo,
            unidadMedida,
            cantidad,
            valorUnitario,
            descripcion,
            estado
        };

        try {
            const response = await fetch('http://localhost:3000/insumo', {
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
            console.log('Insumo registrado', result);
            form.reset(); // Limpiar formulario
        } catch (error) {
            console.error('Error', error);
        }
    });
});
