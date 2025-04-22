document.addEventListener('DOMContentLoaded', () => {
    const sensorSeleccionado = document.getElementById('sensorSeleccionado');
    const tiempoMuestreoInput = document.getElementById('tiempoMuestreo');
    const iniciarLecturaBtn = document.getElementById('iniciarLectura');
    const detenerLecturaBtn = document.getElementById('detenerLectura');
    const datosSensorList = document.getElementById('datosSensor');
    const mensajeMuestreoDiv = document.getElementById('mensajeMuestreo'); // Obtener el nuevo div
    let lecturaActiva = false;
    let tiempoMuestreoMinutos = 1; // Valor por defecto en minutos
    let mensajeDetenidoMostrado = false;
    let intervaloLectura; // Variable para almacenar el ID del intervalo

    function cargarSensores() {
        const sensoresSimulados = ['Sensor Temperatura 1', 'Sensor Humedad 2', 'Sensor Presión 3'];
        sensorSeleccionado.innerHTML = '';

        sensoresSimulados.forEach(sensor => {
            const option = document.createElement('option');
            option.value = sensor;
            option.textContent = sensor;
            sensorSeleccionado.appendChild(option);
        });
    }

    function leerDatosSensor(sensor) {
        return new Promise((resolve, reject) => {
            // Simulación de lectura del sensor
            const valorSimulado = Math.random() * 100;
            const timestamp = new Date().toLocaleTimeString();
            resolve({ sensor, valor: valorSimulado.toFixed(2), timestamp });
        });
    }

    function mostrarDato(dato) {
        console.log("Dato a mostrar:", dato); // <---- ¡AQUÍ ESTÁ EL PRIMER console.log!
        const listItem = document.createElement('li');
        listItem.textContent = `${dato.sensor}: ${dato.valor} (${dato.timestamp})`;
        datosSensorList.insertBefore(listItem, datosSensorList.firstChild);
        if (datosSensorList.children.length > 10) {
            datosSensorList.removeChild(datosSensorList.lastChild);
        }
    }

    function enviarDatosMQTT(dato) {
        console.log('Enviando por MQTT:', dato);
    }

    function almacenarDatosBD(dato) {
        console.log('Almacenando en BD:', dato);
    }

    function mostrarMensaje(mensaje, tipo = 'info') {
        mensajeMuestreoDiv.textContent = mensaje;
        mensajeMuestreoDiv.className = 'mensaje-muestreo'; // Resetear clases
        mensajeMuestreoDiv.classList.add(`mensaje-muestreo--${tipo}`);

        // Opcional: Si quieres que el mensaje desaparezca después de un tiempo
        setTimeout(() => {
            mensajeMuestreoDiv.textContent = '';
            mensajeMuestreoDiv.className = 'mensaje-muestreo'; // Resetear clases
        }, 3000);
    }

    async function iniciarLectura() {
        if (!lecturaActiva) {
            if (sensorSeleccionado.value) {
                lecturaActiva = true;
                iniciarLecturaBtn.disabled = true;
                detenerLecturaBtn.disabled = false;

                // Limpiar los datos anteriores al iniciar una nueva lectura
                datosSensorList.innerHTML = '';

                // Iniciar la lectura periódica
                const tiempoEnMilisegundos = tiempoMuestreoMinutos * 60 * 1000;
                intervaloLectura = setInterval(async () => {
                    try {
                        const dato = await leerDatosSensor(sensorSeleccionado.value);
                        mostrarDato(dato);
                        almacenarDatosBD(dato);
                        enviarDatosMQTT(dato);
                    } catch (error) {
                        mostrarMensaje(`Error al leer datos de ${sensorSeleccionado.value}.`, 'error');
                        detenerLectura(); // Detener la lectura en caso de error
                    }
                }, tiempoEnMilisegundos);

                mostrarMensaje('Lectura iniciada.', 'success'); // <---- MENSAJE DE INICIO (VERDE)

            } else {
                mostrarMensaje('Por favor, selecciona un sensor antes de iniciar la lectura.', 'error');
            }
        } else {
            mostrarMensaje('Ya se está realizando una lectura.', 'info');
        }
    }

    function detenerLectura() {
        if (lecturaActiva) {
            lecturaActiva = false;
            iniciarLecturaBtn.disabled = false;
            detenerLecturaBtn.disabled = true;

            // Limpiar el intervalo de lectura si existe
            if (intervaloLectura) {
                clearInterval(intervaloLectura);
                intervaloLectura = null;
            }

            mostrarMensaje('Lectura detenida.', 'error'); // <---- MENSAJE DE DETENCIÓN (ROJO)
            mensajeDetenidoMostrado = true;
            console.log('Lectura detenida.');
        }
    }

    sensorSeleccionado.addEventListener('change', (event) => {
        console.log('Sensor seleccionado:', event.target.value);
        mensajeDetenidoMostrado = false; // Resetear al cambiar de sensor
        if (lecturaActiva) {
            detenerLectura();
            // La lectura se iniciará automáticamente al hacer clic en "Iniciar Lectura"
        }
    });

    tiempoMuestreoInput.addEventListener('change', (event) => {
        tiempoMuestreoMinutos = parseInt(event.target.value);
        console.log('Tiempo de muestreo:', tiempoMuestreoMinutos, 'minutos');
        if (lecturaActiva) {
            detenerLectura();
            iniciarLectura();
        }
    });

    iniciarLecturaBtn.addEventListener('click', iniciarLectura);
    detenerLecturaBtn.addEventListener('click', detenerLectura);

    cargarSensores();
});