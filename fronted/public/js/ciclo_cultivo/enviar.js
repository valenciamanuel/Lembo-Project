document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const messageContainer = document.getElementById('message-container');

    const cicloID = document.querySelector('.form__input--ID');
    const cicloName = document.querySelector('.form__input--name');
    const siembraDate = document.querySelector('.form__input--siembra');
    const cosechaDate = document.querySelector('.form__input--cosecha');
    const news = document.querySelector('.form__input--news');
    const description = document.querySelector('.form__input--description');
    const state = document.querySelector('.form__input--state');
    const imageInput = document.getElementById('image');

    const inputs = [
        cicloID, cicloName, siembraDate, cosechaDate,
        news, description, state
    ];

    // Función robusta para obtener la fecha de hoy (YYYY-MM-DD)
    const getTodayString = () => {
        const d = new Date();
        // Creamos un nuevo objeto Date fijado a las 00:00:00 local del cliente.
        const todayLocal = new Date(d.getFullYear(), d.getMonth(), d.getDate()); 
        
        const year = todayLocal.getFullYear();
        const month = String(todayLocal.getMonth() + 1).padStart(2, '0');
        const day = String(todayLocal.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayString = getTodayString();
    
    // Configuración de los campos de fecha
    if (siembraDate) siembraDate.setAttribute('min', todayString);
    if (siembraDate) siembraDate.removeAttribute('readonly'); 
    if (cosechaDate) cosechaDate.setAttribute('min', todayString);
    
    // showMessage se usa ahora SOLO para errores dentro del contenedor
    const showMessage = (message, type) => {
        if (!messageContainer) return;
        // Solo mostramos mensajes si es error o si el mensaje no está vacío
        if (type !== 'error' && type !== 'success') return; 

        // Limpia cualquier mensaje previo
        messageContainer.innerHTML = ''; 
        
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', type);
        msgDiv.textContent = message;
        
        messageContainer.appendChild(msgDiv);
        
        setTimeout(() => msgDiv.classList.add('show'), 10);
        
        // Solo temporizamos si es un error
        if (type === 'error') {
             setTimeout(() => { 
                msgDiv.classList.remove('show'); 
                setTimeout(() => msgDiv.remove(), 500); 
            }, 4000);
        }
    };

    // Validar por comparación de STRING (más seguro)
    const isValidFutureDateOrToday = (dateString) => {
        return dateString >= todayString;
    };
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT') input.placeholder = '';
        });
    });

    imageInput.addEventListener('change', () => {
        imageInput.classList.remove('form__input--error');
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpiar errores visuales
        [...inputs].forEach(input => {
            input.classList.remove('form__input--error');
            if (input.tagName !== 'SELECT') input.placeholder = '';
        });
        imageInput.classList.remove('form__input--error');

        let valido = true;
        
        const validarCampo = (input, mensaje) => {
            if (!input.value.trim()) {
                valido = false;
                input.classList.add('form__input--error');
                if (input.tagName !== 'SELECT' && input.type !== 'file') {
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
        
        if (!imageInput.files[0]) {
            valido = false;
            imageInput.classList.add('form__input--error');
            showMessage('Por favor, selecciona una imagen.', 'error'); 
        }

        if (!valido) return;

        // Validación: ID Positivo
        const numericCicloID = Number(cicloID.value.trim());
        if (isNaN(numericCicloID) || numericCicloID <= 0) {
            valido = false;
            cicloID.classList.add('form__input--error');
            showMessage('El ID del ciclo debe ser un número positivo (mayor a cero).', 'error');
        }

        if (!valido) return;

        const siembraStr = siembraDate.value;
        const cosechaStr = cosechaDate.value;

        // Validación de fechas
        if (!isValidFutureDateOrToday(siembraStr)) {
            valido = false;
            siembraDate.classList.add('form__input--error');
            showMessage('La fecha de siembra no puede ser anterior al día de hoy.', 'error');
        }
        
        if (!isValidFutureDateOrToday(cosechaStr)) {
            valido = false;
            cosechaDate.classList.add('form__input--error');
            showMessage('La fecha de cosecha no puede ser anterior al día de hoy.', 'error');
        }
        
        if (!valido) return; // Paramos antes de la comparación si falló la fecha inicial

        // Convertir a Date para la comparación lógica Siembra < Cosecha
        const siembraDateObj = new Date(siembraStr);
        const cosechaDateObj = new Date(cosechaStr);
        siembraDateObj.setHours(0, 0, 0, 0); 
        cosechaDateObj.setHours(0, 0, 0, 0); 

        // Validación 3: Cosecha debe ser posterior a la siembra (estrictamente)
        if (cosechaDateObj <= siembraDateObj) {
            valido = false;
            cosechaDate.classList.add('form__input--error');
            showMessage('La fecha de cosecha debe ser posterior a la fecha de siembra.', 'error');
        }
        
        if (!valido) return;
        
        const formData = new FormData();
        formData.append('cicloID', cicloID.value);
        formData.append('cicloName', cicloName.value);
        formData.append('siembraDate', siembraStr); 
        formData.append('cosechaDate', cosechaStr); 
        formData.append('news', news.value);
        formData.append('description', description.value);
        formData.append('state', state.value);
        formData.append('image', imageInput.files[0]);

        console.log(' Datos que se van a enviar (usando FormData):', Object.fromEntries(formData.entries()));

        try {
            const response = await fetch('http://localhost:3000/ciclocultivo', {
                method: 'POST',
                body: formData 
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error al registrar el ciclo:', errorData);
                showMessage(errorData.error || 'Error en la conexión con el servidor o datos inválidos.', 'error');
                return;
            }

            const result = await response.json();
            console.log(' Ciclo Cultivo registrado', result);

        
            alert('Ciclo creado');
            
        
            window.location.href = '../ciclos/listar_ciclos.html'; 
            
        } catch (error) {
            console.error(' Error', error);
            showMessage("Hubo un error de red o de conexión. Revisa la consola para más detalles.", "error");
        }
    });
});