document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.formulario');

    const responsable = document.querySelector('.formulario__entrada--responsable');
    const nombre_asociacion = document.querySelector('.formulario__entrada--nombre');
    const inversion = document.querySelector('.formulario__entrada--inversion');
    const meta = document.querySelector('.formulario__entrada--meta');
    const iniico_produccion = document.querySelector('.formulario__entrada--inicio');
    const fin_produccion = document.querySelector('.formulario__entrada--fin');
    const cultivo = document.querySelector('.formulario__selector--cultivo');
    const sensores = document.querySelector('.formulario__selector--sensor');
    const insumos = document.querySelector('.formulario__selector--insumo');
    const ciclo_cultivo = document.querySelector('.formulario__selector--ciclo-cultivo');

    const inputs = [
        responsable, nombre_asociacion, inversion, meta, 
        iniico_produccion, fin_produccion
    ];
    const selects = [cultivo, sensores, insumos, ciclo_cultivo];

    // Escucha para inputs: quitar rojo al escribir
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('formulario__entrada--error');
            input.placeholder = '';
        });
    });

    // Escucha para selects: quitar rojo al cambiar
    selects.forEach(select => {
        select.addEventListener('change', () => {
            select.classList.remove('formulario__entrada--error');
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpiar errores anteriores
        [...inputs, ...selects].forEach(input => {
            input.classList.remove('formulario__entrada--error');
            if (input.tagName !== 'SELECT') input.placeholder = '';
        });

        let valido = true;

        // Función para validar campos
        const validarCampo = (input, mensaje) => {
            if (!input.value.trim()) {
                valido = false;
                input.classList.add('formulario__entrada--error');
                if (input.tagName !== 'SELECT') {
                    input.placeholder = mensaje;
                    input.value = '';
                }
            }
        };

        // Validar cada campo
        validarCampo(responsable, 'Responsable obligatorio');
        validarCampo(nombre_asociacion, 'Nombre obligatorio');
        validarCampo(inversion, 'Inversión obligatoria');
        validarCampo(meta, 'Meta obligatoria');
        validarCampo(iniico_produccion, 'Inicio de producción obligatorio');
        validarCampo(fin_produccion, 'Fin de producción obligatorio');
        validarCampo(cultivo, 'Seleccionar cultivo');
        validarCampo(sensores, 'Seleccionar sensores');
        validarCampo(insumos, 'Seleccionar insumos');
        validarCampo(ciclo_cultivo, 'Seleccionar ciclo de cultivo');

        if (!valido) return;

        // Datos del formulario
        const formData = {
            responsable: responsable.value,
            nombre_asociacion: nombre_asociacion.value,
            inversion: inversion.value,
            meta: meta.value,
            iniico_produccion: iniico_produccion.value,
            fin_produccion: fin_produccion.value,
            cultivo: cultivo.value,
            sensores: sensores.value,
            insumos: insumos.value,
            ciclo_cultivo: ciclo_cultivo.value
        };

        try {
            const response = await fetch('http://localhost:3000/asociaciones', {
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
            console.log('Asociación registrada', result);

            form.reset(); // Limpiar formulario después de enviar los datos
        } catch (error) {
            console.error('Error', error);
        }
    });
});
    