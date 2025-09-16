document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    const cicloID = document.querySelector('.form__input--ID');
    const cicloName = document.querySelector('.form__input--name');
    const siembraDate = document.querySelector('.form__input--siembra');
    const cosechaDate = document.querySelector('.form__input--cosecha');
    const news = document.querySelector('.form__input--news');
    const description = document.querySelector('.form__input--description');
    const state = document.querySelector('.form__input--state');
    const image = document.querySelector('.form__input--imagen');

    const inputs = [
        cicloID, cicloName, siembraDate, cosechaDate,
        news, description, state
    ];

    // Escucha para inputs: quitar rojo al escribir
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT') input.placeholder = '';
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpiar errores anteriores
        inputs.forEach(input => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT') input.placeholder = '';
        });

        let valido = true;

        // Validar campos
        const validarCampo = (input, mensaje) => {
            if (!input.value.trim()) {
                valido = false;
                input.classList.add('form__input--error');
                if (input.tagName !== 'SELECT') {
                    input.placeholder = mensaje;
                    input.value = '';
                }
            }
        };

        validarCampo(cicloID, 'ID del ciclo obligatorio');
        validarCampo(cicloName, 'Nombre del ciclo obligatorio');
        validarCampo(siembraDate, 'Fecha de siembra obligatoria');
        validarCampo(cosechaDate, 'Fecha de cosecha obligatoria');
        validarCampo(news, 'Noticia obligatoria');
        validarCampo(description, 'Descripción obligatoria');
        validarCampo(state, 'Seleccionar estado');

        if (!valido) return;

        // Datos del formulario (imagen se queda en null por ahora)
        const file = image.files[0];
        const formData = {
            cicloID: cicloID.value,
            cicloName: cicloName.value,
            siembraDate: siembraDate.value,
            cosechaDate: cosechaDate.value,
            news: news.value,
            description: description.value,
            state: state.value,
            image: file ? file.name : null  // 👈 nombre de la imagen o null
        };

        try {
            // ✅ CORRECCIÓN: Se agrega '/ciclo-cultivo' a la URL
            const response = await fetch('http://localhost:3000/ciclocultivo/ciclo-cultivo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Error en la conexión con el servidor');

            const result = await response.json();
            console.log('✅ Ciclo Cultivo registrado', result);

            alert("✅ Ciclo creado correctamente");
            form.reset();
        } catch (error) {
            console.error('❌ Error', error);
            alert("❌ Hubo un error al crear el ciclo");
        }
    });
});