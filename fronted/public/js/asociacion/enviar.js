// /fronted/public/js/asociacion/enviar.js
document.addEventListener('DOMContentLoaded', () => {
    const formAsociacion = document.querySelector('.formulario');
    const nombreAsociacionInput = document.querySelector('.formulario__entrada--nombre');
    const inversionInput = document.querySelector('.formulario__entrada--inversion');
    const metaInput = document.querySelector('.formulario__entrada--meta');
    const inicioProduccionInput = document.querySelector('.formulario__entrada--inicio');
    const finProduccionInput = document.querySelector('.formulario__entrada--fin');
    const responsableInput = document.querySelector('.formulario__entrada--responsable');
    const cultivoSelect = document.querySelector('.formulario__selector--cultivo');
    const sensoresSelect = document.querySelector('.formulario__selector--sensor');
    const insumosSelect = document.querySelector('.formulario__selector--insumo');
    const cicloCultivoSelect = document.querySelector('.formulario__selector--ciclo-cultivo');

    const cargarOpciones = async (selectElement, apiUrl, valueField, textField, defaultOptionText) => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            selectElement.innerHTML = `<option value="">${defaultOptionText}</option>`;
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item[valueField];
                option.textContent = item[textField];
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error(`Error al cargar las opciones de ${apiUrl}:`, error);
        }
    };

    cargarOpciones(cultivoSelect, 'http://localhost:3000/cultivo', 'id', 'cultivoName', 'Seleccione un cultivo');
    cargarOpciones(sensoresSelect, 'http://localhost:3000/sensores', 'idSensor', 'nombreSensor', 'Agregar Sensores');
    cargarOpciones(insumosSelect, 'http://localhost:3000/insumo', 'idInsumo', 'nombreInsumo', 'Agregar Insumos');
    cargarOpciones(cicloCultivoSelect, 'http://localhost:3000/ciclocultivo', 'id', 'cicloName', 'Agregar Ciclo Cultivo');


    window.addEventListener('message', (event) => {
        if (event.data) {
            switch (event.data.type) {
                case 'nuevoSensorCreado':
                    const nuevoSensor = event.data.sensor;
                    if (sensoresSelect) {
                        const nuevaOpcion = document.createElement('option');
                        nuevaOpcion.value = nuevoSensor.idSensor;
                        nuevaOpcion.textContent = nuevoSensor.nombreSensor;
                        sensoresSelect.appendChild(nuevaOpcion);
                        nuevaOpcion.selected = true;
                    }
                    break;
                case 'nuevoCultivoCreado':
                    const nuevoCultivo = event.data.cultivo;
                    if (cultivoSelect) {
                        const nuevaOpcion = document.createElement('option');
                        nuevaOpcion.value = nuevoCultivo.idCultivo; // Asegúrate de que tu backend devuelva 'idCultivo'
                        nuevaOpcion.textContent = nuevoCultivo.nombreCultivo; // Asegúrate de que tu backend devuelva 'nombreCultivo'
                        cultivoSelect.appendChild(nuevaOpcion);
                        nuevaOpcion.selected = true;
                    }
                    break;
                case 'nuevoInsumoCreado':
                    const nuevoInsumo = event.data.insumo;
                    if (insumosSelect) {
                        const nuevaOpcion = document.createElement('option');
                        nuevaOpcion.value = nuevoInsumo.idInsumo; // Asegúrate de que tu backend devuelva 'idInsumo'
                        nuevaOpcion.textContent = nuevoInsumo.nombreInsumo; // Asegúrate de que tu backend devuelva 'nombreInsumo'
                        insumosSelect.appendChild(nuevaOpcion);
                        nuevaOpcion.selected = true;
                    }
                    break;
                case 'nuevoCicloCultivoCreado':
                    const nuevoCicloCultivo = event.data.cicloCultivo;
                    if (cicloCultivoSelect) {
                        const nuevaOpcion = document.createElement('option');
                        nuevaOpcion.value = nuevoCicloCultivo.id; // Asegúrate de que tu backend devuelva 'id'
                        nuevaOpcion.textContent = nuevoCicloCultivo.cicloName; // Asegúrate de que tu backend devuelva 'cicloName'
                        cicloCultivoSelect.appendChild(nuevaOpcion);
                        nuevaOpcion.selected = true;
                    }
                    break;
            }
        }
    });

    const inputs = [
        { element: responsableInput, nombre: 'responsable' },
        { element: nombreAsociacionInput, nombre: 'nombre_asociacion' },
        { element: inversionInput, nombre: 'inversion' },
        { element: metaInput, nombre: 'meta' },
        { element: inicioProduccionInput, nombre: 'iniico_produccion' },
        { element: finProduccionInput, nombre: 'fin_produccion' }
    ];
    const selects = [
        { element: cultivoSelect, nombre: 'cultivo' },
        { element: sensoresSelect, nombre: 'sensores' },
        { element: insumosSelect, nombre: 'insumos' },
        { element: cicloCultivoSelect, nombre: 'ciclo_cultivo' }
    ];
    const elementosError = {};
    inputs.forEach(input => elementosError[input.nombre] = crearElementoError(input.element));
    selects.forEach(select => elementosError[select.nombre] = crearElementoError(select.element));

    inputs.forEach(input => {
        input.element.addEventListener('input', () => {
            input.element.classList.remove('formulario__entrada--error');
            elementosError[input.nombre].textContent = '';
        });
    });

    selects.forEach(select => {
        select.element.addEventListener('change', () => {
            select.element.classList.remove('formulario__entrada--error');
            elementosError[select.nombre].textContent = '';
        });
    });

    const contenedorAsociacionCreada = document.createElement('div');
    contenedorAsociacionCreada.classList.add('asociacion-creada');
    formAsociacion.parentNode.insertBefore(contenedorAsociacionCreada, formAsociacion.nextSibling);

    formAsociacion.addEventListener('submit', async (event) => {
        event.preventDefault();

        let valido = true;
        const errores = {};

        const validarCampo = (inputElement, mensaje, nombreCampo) => {
            if (!inputElement.value.trim()) {
                valido = false;
                inputElement.classList.add('formulario__entrada--error');
                elementosError[nombreCampo].textContent = mensaje;
                errores[nombreCampo] = errores[nombreCampo] || [];
                errores[nombreCampo].push(mensaje);
            } else {
                elementosError[nombreCampo].textContent = '';
                inputElement.classList.remove('formulario__entrada--error');
            }
        };

        validarCampo(responsableInput, 'Responsable obligatorio', 'responsable');
        validarCampo(nombreAsociacionInput, 'Nombre de producción obligatorio', 'nombre_asociacion');
        validarCampo(inversionInput, 'Inversión obligatoria', 'inversion');
        validarCampo(metaInput, 'Meta obligatoria', 'meta');
        validarCampo(inicioProduccionInput, 'Inicio de producción obligatorio', 'iniico_produccion');
        validarCampo(finProduccionInput, 'Fin de producción obligatorio', 'fin_produccion');
        validarCampo(cultivoSelect, 'Seleccionar cultivo', 'cultivo');
        validarCampo(sensoresSelect, 'Seleccionar sensores', 'sensores');
        validarCampo(insumosSelect, 'Seleccionar insumos', 'insumos');
        validarCampo(cicloCultivoSelect, 'Seleccionar ciclo de cultivo', 'ciclo_cultivo');

        const nombreProduccionValor = nombreAsociacionInput.value.trim();
        if (nombreProduccionValor) {
            if (nombreProduccionValor.length < 3) {
                valido = false;
                nombreAsociacionInput.classList.add('formulario__entrada--error');
                elementosError['nombre_asociacion'].textContent = 'El nombre de producción debe tener al menos 3 caracteres.';
                errores['nombre_asociacion'] = errores['nombre_asociacion'] || [];
                errores['nombre_asociacion'].push('El nombre de producción debe tener al menos 3 caracteres.');
            } else if (nombreProduccionValor.length > 100) {
                valido = false;
                nombreAsociacionInput.classList.add('formulario__entrada--error');
                elementosError['nombre_asociacion'].textContent = 'El nombre de producción no debe tener más de 100 caracteres.';
                errores['nombre_asociacion'] = errores['nombre_asociacion'] || [];
                errores['nombre_asociacion'].push('El nombre de producción no debe tener más de 100 caracteres.');
            } else if (/^[0-9\s\W]+$/.test(nombreProduccionValor) || !/[a-zA-Zá-úÁ-Ú]/.test(nombreProduccionValor)) {
                valido = false;
                nombreAsociacionInput.classList.add('formulario__entrada--error');
                elementosError['nombre_asociacion'].textContent = 'El nombre de producción debe contener al menos una letra y no puede consistir solo de números o caracteres especiales.';
                errores['nombre_asociacion'] = errores['nombre_asociacion'] || [];
                errores['nombre_asociacion'].push('El nombre de producción debe contener al menos una letra y no puede consistir solo de números o caracteres especiales.');
            }
        } else if (!errores['nombre_asociacion']?.includes('Nombre de producción obligatorio')) {
            valido = false;
            nombreAsociacionInput.classList.add('formulario__entrada--error');
            elementosError['nombre_asociacion'].textContent = 'Nombre de producción obligatorio.';
            errores['nombre_asociacion'] = errores['nombre_asociacion'] || [];
            errores['nombre_asociacion'].push('Nombre de producción obligatorio.');
        }

        if (!valido) {
            console.log('Errores de validación:', errores);
            return;
        }

        const formData = {
            responsable: responsableInput.value,
            nombre_asociacion: nombreAsociacionInput.value,
            inversion: inversionInput.value,
            meta: metaInput.value,
            iniico_produccion: inicioProduccionInput.value,
            fin_produccion: finProduccionInput.value,
            cultivo: cultivoSelect.value,
            sensores: sensoresSelect.value,
            insumos: insumosSelect.value,
            ciclo_cultivo: cicloCultivoSelect.value
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
                const errorData = await response.json();
                console.error('Error al crear la asociación:', errorData);
                return;
            }

            const result = await response.json();
            console.log('Asociación registrada', result);

            contenedorAsociacionCreada.innerHTML = `
                <div class="asociacion-creada__info">
                    <h3>Asociación Creada: ${formData.nombre_asociacion}</h3>
                    <p><strong>Responsable:</strong> ${formData.responsable}</p>
                    <p><strong>Inversión:</strong> ${formData.inversion}</p>
                    <p><strong>Meta:</strong> ${formData.meta}</p>
                    <p><strong>Inicio Producción:</strong> ${formData.iniico_produccion}</p>
                    <p><strong>Fin Producción:</strong> ${formData.fin_produccion}</p>
                    <p><strong>Cultivo:</strong> ${cultivoSelect.options[cultivoSelect.selectedIndex].textContent}</p>
                    <p><strong>Sensores:</strong> ${sensoresSelect.options[sensoresSelect.selectedIndex].textContent}</p>
                    <p><strong>Insumos:</strong> ${insumosSelect.options[insumosSelect.selectedIndex].textContent}</p>
                    <p><strong>Ciclo Cultivo:</strong> ${cicloCultivoSelect.options[cicloCultivoSelect.selectedIndex].textContent}</p>
                </div>
            `;

            formAsociacion.reset();
        } catch (error) {
            console.error('Error en la conexión con el servidor al crear la asociación:', error);
        }
    });
});

function crearElementoError(elemento) {
    const elementoError = document.createElement('p');
    elementoError.classList.add('formulario__error');
    elemento.parentNode.insertBefore(elementoError, elemento.nextSibling);
    return elementoError;
}