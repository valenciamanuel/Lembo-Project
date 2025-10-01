document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');

  const cicloID = document.querySelector('.form__input--ID');
  const cicloName = document.querySelector('.form__input--name');
  const siembraDate = document.querySelector('.form__input--siembra');
  const cosechaDate = document.querySelector('.form__input--cosecha');
  const news = document.querySelector('.form__input--news');
  const description = document.querySelector('.form__input--description');
  const state = document.querySelector('.form__input--state');
  const imageInput = document.getElementById('image'); 

  // Incluimos imageInput en los inputs para la validación de archivos
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

  // Manejar cambio de imagen
  imageInput.addEventListener('change', () => {
    imageInput.classList.remove('form__input--error');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Limpiar errores anteriores
    [...inputs].forEach(input => {
      input.classList.remove('form__input--error');
      if (input.tagName !== 'SELECT') input.placeholder = '';
    });

    imageInput.classList.remove('form__input--error');
    
    let valido = true;

    // Validar campos
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
    
    // Validar la imagen
    if (!imageInput.files[0]) {
      valido = false;
      imageInput.classList.add('form__input--error');
      // TODO: Cambiar esto por un modal personalizado
      alert('Por favor, selecciona una imagen.'); 
    }

    if (!valido) return;

    // Usamos FormData para enviar archivos
    const formData = new FormData();
    formData.append('cicloID', cicloID.value);
    formData.append('cicloName', cicloName.value);
    formData.append('siembraDate', siembraDate.value);
    formData.append('cosechaDate', cosechaDate.value);
    formData.append('news', news.value);
    formData.append('description', description.value);
    formData.append('state', state.value);
    formData.append('image', imageInput.files[0]);

    console.log(' Datos que se van a enviar (usando FormData):', Object.fromEntries(formData.entries()));

    try {
      // CORRECCIÓN: La ruta ahora es '/ciclocultivo'
      const response = await fetch('http://localhost:3000/ciclocultivo', {
        method: 'POST',
        body: formData 
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al registrar el ciclo:', errorData);
        throw new Error(errorData.error || 'Error en la conexión con el servidor o datos inválidos.');
      }

      const result = await response.json();
      console.log(' Ciclo Cultivo registrado', result);

      
      alert(" Ciclo creado correctamente");
      form.reset();
      imageInput.value = '';
      
    } catch (error) {
      console.error(' Error', error);
      
      alert(" Hubo un error al crear el ciclo. Revisa la consola para más detalles.");
    }
  });
});
