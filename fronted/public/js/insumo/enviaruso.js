document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.formulario');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fecha_uso = document.querySelector('.formulario__entrada--fecha');
        const cantidad = document.querySelector('.formulario__entrada--cantidad');
        const responsable = document.querySelector('.formulario__entrada--responsable');
        const valor_unitario = document.querySelector('.formulario__entrada--valorUnitario');
        const valor_total = document.querySelector('.formulario__entrada--valorTotal');
        const observaciones = document.querySelector('.formulario__entrada--observaciones');
        const insumo = document.querySelector('.formulario__selector--insumo');

        const formData = {
            fecha_uso: fecha_uso ? fecha_uso.value : '',
            cantidad: cantidad ? cantidad.value : '',
            responsable: responsable ? responsable.value : '',
            valor_unitario: valor_unitario ? valor_unitario.value : '',
            valor_total: valor_total ? valor_total.value : '',
            observaciones: observaciones ? observaciones.value : '', 
            insumo: insumo ? insumo.value : '' 
        };
        
        

        try {
            const response = await fetch('http://localhost:3000/uso_insumo', {
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
            console.log('Asociacion registrada', result);

            form.reset(); // Limpiar formulario después de enviar los datos
        } catch (error) {
            console.error('Error', error);
        }
    });
});
