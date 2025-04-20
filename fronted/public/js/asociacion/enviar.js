document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.formulario');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const responsable = document.querySelector('.formulario__entrada--responsable');
        const nombre_asociacion = document.querySelector('.formulario__entrada--nombre');
        const inversion = document.querySelector('.formulario__entrada--inversion');
        const meta = document.querySelector('.formulario__entrada--meta');
        const iniico_produccion = document.querySelector('.formulario__entrada--inicio');
        const fin_produccion = document.querySelector('.formulario__entrada--fin');
        const cultivo = document.querySelector('.formulario__selector--cultivo');
        const sensores = document.querySelector('.formulario__selector--sensor')
        const insumos = document.querySelector('.formulario__selector--insumo')
        const ciclo_cultivo = document.querySelector('.formulario__selector--ciclo-cultivo')

        const formData = {
            responsable: responsable ? responsable.value : '',
            nombre_asociacion: nombre_asociacion ? nombre_asociacion.value : '',
            inversion: inversion ? inversion.value : '',
            meta: meta ? meta.value : '',
            iniico_produccion: iniico_produccion ? iniico_produccion.value : '',
            fin_produccion: fin_produccion ? fin_produccion.value : '', 
            cultivo: cultivo ? cultivo.value : ''  ,
            sensores: sensores ? sensores.value : '' , 
            insumos: insumos ? insumos.value : '',
            ciclo_cultivo: ciclo_cultivo ? ciclo_cultivo.value : ''  
        };
        
        

        try {
            const response = await fetch('http://localhost:3000/asociaciones', {
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
