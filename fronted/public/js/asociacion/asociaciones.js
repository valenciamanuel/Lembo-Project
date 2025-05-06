// Variables globales
const API_URL = 'http://localhost:3000/api';
let asociacionesData = [];
let cultivosData = [];
let ciclosData = [];
let sensoresData = [];
let insumosData = [];
let asociacionSeleccionada = null;
let sensoresSeleccionados = [];
let insumoSeleccionado = null;

// Elementos DOM
const asociacionesTableBody = document.getElementById('asociacionesTableBody');
const totalAsociacionesElement = document.getElementById('totalAsociaciones');
const inversionTotalElement = document.getElementById('inversionTotal');
const metaTotalElement = document.getElementById('metaTotal');
const searchInput = document.getElementById('searchInput');

// Modales
const modalDetalles = document.getElementById('modalDetalles');
const modalAsociacion = document.getElementById('modalAsociacion');
const modalCultivo = document.getElementById('modalCultivo');
const modalCiclo = document.getElementById('modalCiclo');
const modalInsumo = document.getElementById('modalInsumo');
const modalConfirmacion = document.getElementById('modalConfirmacion');

// Botones
const btnCrearAsociacion = document.getElementById('btnCrearAsociacion');
const btnExportarExcel = document.getElementById('btnExportarExcel');
const btnExportarPDF = document.getElementById('btnExportarPDF');
const btnNuevoCultivo = document.getElementById('btnNuevoCultivo');
const btnNuevoCiclo = document.getElementById('btnNuevoCiclo');
const btnNuevoInsumo = document.getElementById('btnNuevoInsumo');
const btnCancelarAsociacion = document.getElementById('btnCancelarAsociacion');
const btnCancelarCultivo = document.getElementById('btnCancelarCultivo');
const btnCancelarCiclo = document.getElementById('btnCancelarCiclo');
const btnCancelarInsumo = document.getElementById('btnCancelarInsumo');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

// Formularios
const formAsociacion = document.getElementById('formAsociacion');
const formCultivo = document.getElementById('formCultivo');
const formCiclo = document.getElementById('formCiclo');
const formInsumo = document.getElementById('formInsumo');

// Selectores
const cultivoSelect = document.getElementById('cultivo');
const cicloSelect = document.getElementById('ciclo_cultivo');
const insumosSelect = document.getElementById('insumos');
const sensoresContainer = document.getElementById('sensoresContainer');

// Campos de insumo
const insumoDetallesContainer = document.getElementById('insumoDetallesContainer');
const insumoNombre = document.getElementById('insumoNombre');
const insumoTipo = document.getElementById('insumoTipo');
const insumoDisponible = document.getElementById('insumoDisponible');
const insumoCantidad = document.getElementById('insumoCantidad');
const insumoValorUnitario = document.getElementById('insumoValorUnitario');
const insumoValorTotal = document.getElementById('insumoValorTotal');

// Campos de asociación
const asociacionId = document.getElementById('asociacionId');
const responsable = document.getElementById('responsable');
const nombre_asociacion = document.getElementById('nombre_asociacion');
const inversion = document.getElementById('inversion');
const meta = document.getElementById('meta');
const iniico_produccion = document.getElementById('iniico_produccion');
const fin_produccion = document.getElementById('fin_produccion');
const responsableSelect = document.getElementById('responsable');
// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    inicializarEventListeners();
});

// Funciones de carga de datos
async function cargarDatos() {
    try {
        await Promise.all([
            cargarAsociaciones(),
            cargarCultivos(),
            cargarCiclos(),
            cargarSensores(),
            cargarInsumos()
        ]);
        
        actualizarEstadisticas();
        inicializarGraficos();
    } catch (error) {
        console.error('Error al cargar datos:', error);
        mostrarNotificacion('Error al cargar datos', 'error');
    }
}

async function cargarAsociaciones() {
    try {
        const response = await fetch(`${API_URL}/asociaciones`);
        if (!response.ok) throw new Error('Error al cargar asociaciones');
        
        asociacionesData = await response.json();
        renderizarTablaAsociaciones();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar asociaciones', 'error');
    }
}

async function cargarCultivos() {
    try {
        const response = await fetch(`${API_URL}/cultivo`);
        if (!response.ok) throw new Error('Error al cargar cultivos');
        
        cultivosData = await response.json();
        actualizarSelectCultivos();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar cultivos', 'error');
    }
}

async function cargarCiclos() {
    try {
        const response = await fetch(`${API_URL}/ciclocultivo`);
        if (!response.ok) throw new Error('Error al cargar ciclos de cultivo');
        
        ciclosData = await response.json();
        actualizarSelectCiclos();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar ciclos de cultivo', 'error');
    }
}

async function cargarSensores() {
    try {
        const response = await fetch(`${API_URL}/sensores`);
        if (!response.ok) throw new Error('Error al cargar sensores');
        
        sensoresData = await response.json();
        actualizarSensoresCheckbox();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar sensores', 'error');
    }
}
// Nuevo elemento DOM


// Nueva función para cargar los responsables
async function cargarResponsables() {
    try {
        const response = await fetch(`${API_URL}/responsables`); 
        if (!response.ok) throw new Error('Error al cargar responsables');

        const responsablesData = await response.json();
        actualizarSelectResponsables(responsablesData);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar responsables', 'error');
    }
}

// Nueva función para llenar el selector de responsables
function actualizarSelectResponsables(responsables) {
    responsableSelect.innerHTML = '<option value="">Seleccionar responsable</option>';
    responsables.forEach(responsable => {
        const option = document.createElement('option');
        option.value = responsable.name; // O responsable.id, dependiendo de lo que necesites enviar al guardar
        option.textContent = responsable.name;
        responsableSelect.appendChild(option);
    });
}

async function cargarInsumos() {
    try {
        const response = await fetch(`${API_URL}/insumo`);
        if (!response.ok) throw new Error('Error al cargar insumos');
        
        insumosData = await response.json();
        actualizarSelectInsumos();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar insumos', 'error');
    }
}

// Funciones de renderizado
function renderizarTablaAsociaciones(filtro = '') {
    asociacionesTableBody.innerHTML = '';
    
    const asociacionesFiltradas = filtro 
        ? asociacionesData.filter(a => 
            a.nombre_asociacion.toLowerCase().includes(filtro.toLowerCase()) || 
            a.responsable.toLowerCase().includes(filtro.toLowerCase()))
        : asociacionesData;
    
    if (asociacionesFiltradas.length === 0) {
        asociacionesTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">No se encontraron asociaciones</td>
            </tr>
        `;
        return;
    }
    
    asociacionesFiltradas.forEach(asociacion => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${asociacion.id}</td>
            <td>${asociacion.responsable}</td>
            <td>${asociacion.nombre_asociacion}</td>
            <td>$${parseFloat(asociacion.inversion).toFixed(2)}</td>
            <td>$${parseFloat(asociacion.meta).toFixed(2)}</td>
            <td>${asociacion.cultivo}</td>
            <td>
                <button class="button button--icon btn-ver" data-id="${asociacion.id}" title="Ver detalles">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="button button--icon btn-editar" data-id="${asociacion.id}" title="Editar">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button class="button button--icon btn-eliminar" data-id="${asociacion.id}" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        asociacionesTableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.btn-ver').forEach(btn => {
        btn.addEventListener('click', () => verDetallesAsociacion(btn.dataset.id));
    });
    
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => editarAsociacion(btn.dataset.id));
    });
    
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => confirmarEliminarAsociacion(btn.dataset.id));
    });
}

function actualizarSelectCultivos() {
    cultivoSelect.innerHTML = '<option value="">Seleccionar cultivo</option>';
    
    const cultivosActivos = cultivosData.filter(c => c.state === 'Activo');
    
    cultivosActivos.forEach(cultivo => {
        const option = document.createElement('option');
        option.value = cultivo.cultivoName;
        option.textContent = cultivo.cultivoName;
        cultivoSelect.appendChild(option);
    });
}

function actualizarSelectCiclos() {
    cicloSelect.innerHTML = '<option value="">Seleccionar ciclo</option>';
    
    const ciclosActivos = ciclosData.filter(c => c.state === 'activo');
    
    ciclosActivos.forEach(ciclo => {
        const option = document.createElement('option');
        option.value = ciclo.cicloName;
        option.textContent = ciclo.cicloName;
        cicloSelect.appendChild(option);
    });
}

function actualizarSensoresCheckbox() {
    sensoresContainer.innerHTML = '';
    
    const sensoresActivos = sensoresData.filter(s => s.estado === 'Activo');
    
    sensoresActivos.forEach(sensor => {
        const sensorDiv = document.createElement('div');
        sensorDiv.className = 'sensor-checkbox';
        
        const isChecked = sensoresSeleccionados.includes(sensor.nombreSensor);
        
        sensorDiv.innerHTML = `
            <input type="checkbox" id="sensor-${sensor.idSensor}" value="${sensor.nombreSensor}" 
                ${isChecked ? 'checked' : ''} ${sensoresSeleccionados.length >= 3 && !isChecked ? 'disabled' : ''}>
            <label class="sensor-checkbox__label" for="sensor-${sensor.idSensor}">${sensor.nombreSensor}</label>
        `;
        
        sensoresContainer.appendChild(sensorDiv);
    });
    
    // Agregar event listeners a los checkboxes
    document.querySelectorAll('#sensoresContainer input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                if (sensoresSeleccionados.length < 3) {
                    sensoresSeleccionados.push(this.value);
                } else {
                    this.checked = false;
                    mostrarNotificacion('Solo puede seleccionar hasta 3 sensores', 'warning');
                }
            } else {
                sensoresSeleccionados = sensoresSeleccionados.filter(s => s !== this.value);
            }
            
            // Actualizar estado de los checkboxes
            const checkboxes = document.querySelectorAll('#sensoresContainer input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (!cb.checked) {
                    cb.disabled = sensoresSeleccionados.length >= 3;
                }
            });
        });
    });
}

function actualizarSelectInsumos() {
    insumosSelect.innerHTML = '<option value="">Seleccionar insumo</option>';
    
    const insumosActivos = insumosData.filter(i => i.estado === 'activo');
    
    insumosActivos.forEach(insumo => {
        const option = document.createElement('option');
        option.value = insumo.idInsumo;
        option.textContent = insumo.nombreInsumo;
        insumosSelect.appendChild(option);
    });
}

function actualizarEstadisticas() {
    // Total de asociaciones
    totalAsociacionesElement.textContent = asociacionesData.length;
    
    // Inversión total
    const inversionTotal = asociacionesData.reduce((total, asociacion) => {
        return total + parseFloat(asociacion.inversion);
    }, 0);
    inversionTotalElement.textContent = `$${inversionTotal.toFixed(2)}`;
    
    // Meta total
    const metaTotal = asociacionesData.reduce((total, asociacion) => {
        return total + parseFloat(asociacion.meta);
    }, 0);
    metaTotalElement.textContent = `$${metaTotal.toFixed(2)}`;
}

// Funciones de gráficos
function inicializarGraficos() {
    renderizarGraficoInversionMeta();
}

function renderizarGraficoInversionMeta() {
    const ctx = document.getElementById('inversionMetaChart').getContext('2d');
    
    // Limitar a las 5 asociaciones más recientes para mejor visualización
    const asociacionesRecientes = [...asociacionesData].sort((a, b) => b.id - a.id).slice(0, 5).reverse();
    
    const labels = asociacionesRecientes.map(a => a.nombre_asociacion);
    const inversionData = asociacionesRecientes.map(a => parseFloat(a.inversion));
    const metaData = asociacionesRecientes.map(a => parseFloat(a.meta));
    
   
    
    window.inversionMetaChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Inversión',
                    data: inversionData,
                    backgroundColor: 'rgba(57, 169, 0, 0.7)',
                    borderColor: 'rgba(57, 169, 0, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Meta',
                    data: metaData,
                    backgroundColor: 'rgba(0, 120, 50, 0.7)',
                    borderColor: 'rgba(0, 120, 50, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Valor ($)'
                    }
                }
            }
        }
    });
}

function renderizarGraficoCultivos() {
    const ctx = document.getElementById('cultivosChart').getContext('2d');
    
    // Contar la frecuencia de cada cultivo
    const cultivosFrecuencia = {};
    asociacionesData.forEach(asociacion => {
        if (cultivosFrecuencia[asociacion.cultivo]) {
            cultivosFrecuencia[asociacion.cultivo]++;
        } else {
            cultivosFrecuencia[asociacion.cultivo] = 1;
        }
    });
    
    const labels = Object.keys(cultivosFrecuencia);
    const data = Object.values(cultivosFrecuencia);
    
    // Generar colores para cada cultivo
    const colores = [
        'rgba(57, 169, 0, 0.7)',
        'rgba(0, 120, 50, 0.7)',
        'rgba(80, 229, 249, 0.7)',
        'rgba(254, 217, 93, 0.7)',
        'rgba(253, 195, 0, 0.7)'
    ];
    
    const backgroundColor = labels.map((_, index) => colores[index % colores.length]);
    
    
    window.cultivosChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColor,
                borderColor: backgroundColor.map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Funciones de modales
function abrirModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function abrirModalCrearAsociacion() {
    limpiarFormularioAsociacion();
    document.getElementById('modalAsociacionTitle').textContent = 'Nueva Asociación';
    cargarResponsables();
    abrirModal(modalAsociacion);
}

function validarNombreAsociacion(nombre) {
    if (nombre.length < 3 || nombre.length > 100) {
        return false; // No es válido
    }
    return true; // Es válido
}

nombre_asociacion.addEventListener('input', function() {
    if (!validarNombreAsociacion(this.value)) {
        this.setCustomValidity('El nombre debe tener entre 3 y 100 caracteres.');
    } else {
        this.setCustomValidity(''); // Campo válido
    }
    this.reportValidity(); // Fuerza la validación (muestra el mensaje si es necesario)
});
function verDetallesAsociacion(id) {
    const asociacion = asociacionesData.find(a => a.id == id);
    if (!asociacion) return;
    
    const cultivoInfo = cultivosData.find(c => c.cultivoName === asociacion.cultivo) || {};
    const cicloInfo = ciclosData.find(c => c.cicloName === asociacion.ciclo_cultivo) || {};
    
    // Convertir string de sensores a array
    const sensoresArray = asociacion.sensores.split(',').map(s => s.trim());
    
    // Obtener información de los sensores
    const sensoresInfo = sensoresArray.map(sensorNombre => {
        const sensor = sensoresData.find(s => s.nombreSensor === sensorNombre) || {};
        return {
            nombre: sensorNombre,
            tipo: sensor.tipoSensor || 'No disponible',
            unidad: sensor.unidadMedida || 'No disponible'
        };
    });
    
    // Obtener información del insumo
    const insumoInfo = insumosData.find(i => i.nombreInsumo === asociacion.insumos) || {};
    
    const detallesHTML = `
        <div class="detalles">
            <div class="detalles__section">
                <div class="detalles__header">
                    <h3 class="detalles__title">Información General</h3>
                </div>
                <div class="detalles__content">
                    <div class="detalles__row">
                        <div class="detalles__item">
                            <span class="detalles__label">ID</span>
                            <span class="detalles__value">${asociacion.id}</span>
                        </div>
                        <div class="detalles__item">
                            <span class="detalles__label">Responsable</span>
                            <span class="detalles__value">${asociacion.responsable}</span>
                        </div>
                    </div>
                    <div class="detalles__row">
                        <div class="detalles__item">
                            <span class="detalles__label">Nombre de la Asociación</span>
                            <span class="detalles__value">${asociacion.nombre_asociacion}</span>
                        </div>
                        <div class="detalles__item">
                            <span class="detalles__label">Ciclo de Cultivo</span>
                            <span class="detalles__value">${asociacion.ciclo_cultivo}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detalles__section">
                <div class="detalles__header">
                    <h3 class="detalles__title">Información Financiera</h3>
                </div>
                <div class="detalles__content">
                    <div class="detalles__row">
                        <div class="detalles__item">
                            <span class="detalles__label">Inversión</span>
                            <span class="detalles__value">$${parseFloat(asociacion.inversion).toFixed(2)}</span>
                        </div>
                        <div class="detalles__item">
                            <span class="detalles__label">Meta</span>
                            <span class="detalles__value">$${parseFloat(asociacion.meta).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detalles__section">
                <div class="detalles__header">
                    <h3 class="detalles__title">Fechas de Producción</h3>
                </div>
                <div class="detalles__content">
                    <div class="detalles__row">
                        <div class="detalles__item">
                            <span class="detalles__label">Inicio de Producción</span>
                            <span class="detalles__value">${formatearFecha(asociacion.iniico_produccion)}</span>
                        </div>
                        <div class="detalles__item">
                            <span class="detalles__label">Fin de Producción</span>
                            <span class="detalles__value">${formatearFecha(asociacion.fin_produccion)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detalles__section">
                <div class="detalles__header">
                    <h3 class="detalles__title">Cultivo</h3>
                </div>
                <div class="detalles__content">
                    <div class="detalles__row">
                        <div class="detalles__item">
                            <span class="detalles__label">Nombre</span>
                            <span class="detalles__value">${asociacion.cultivo}</span>
                        </div>
                        <div class="detalles__item">
                            <span class="detalles__label">Tipo</span>
                            <span class="detalles__value">${cultivoInfo.cultivoType || 'No disponible'}</span>
                        </div>
                    </div>
                    <div class="detalles__row">
                        <div class="detalles__item">
                            <span class="detalles__label">Tamaño</span>
                            <span class="detalles__value">${cultivoInfo.size || 'No disponible'}</span>
                        </div>
                        <div class="detalles__item">
                            <span class="detalles__label">Ubicación</span>
                            <span class="detalles__value">${cultivoInfo.location || 'No disponible'}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detalles__section">
                <div class="detalles__header">
                    <h3 class="detalles__title">Sensores</h3>
                </div>
                <div class="detalles__content">
                    <ul class="detalles__list">
                        ${sensoresInfo.map(sensor => `
                            <li class="detalles__list-item">
                                <i class="fa-solid fa-microchip"></i>
                                <span>${sensor.nombre} (${sensor.tipo}, ${sensor.unidad})</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="detalles__section">
                <div class="detalles__header">
                    <h3 class="detalles__title">Insumo</h3>
                </div>
                <div class="detalles__content">
                    <div class="detalles__row">
                        <div class="detalles__item">
                            <span class="detalles__label">Nombre</span>
                            <span class="detalles__value">${asociacion.insumos}</span>
                        </div>
                        <div class="detalles__item">
                            <span class="detalles__label">Tipo</span>
                            <span class="detalles__value">${insumoInfo.tipoInsumo || 'No disponible'}</span>
                        </div>
                    </div>
                    <div class="detalles__row">
                        <div class="detalles__item">
                            <span class="detalles__label">Unidad de Medida</span>
                            <span class="detalles__value">${insumoInfo.unidadMedida || 'No disponible'}</span>
                        </div>
                        <div class="detalles__item">
                            <span class="detalles__label">Valor Unitario</span>
                            <span class="detalles__value">$${insumoInfo.valorUnitario ? parseFloat(insumoInfo.valorUnitario).toFixed(2) : '0.00'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('detallesAsociacionContent').innerHTML = detallesHTML;
    abrirModal(modalDetalles);
}
function editarAsociacion(id) {
    const asociacion = asociacionesData.find(a => a.id == id);
    if (!asociacion) return;
    
    // Llenar el formulario con los datos de la asociación
    asociacionId.value = asociacion.id;
    // responsable.value = asociacion.responsable;  // ESTO SE ELIMINA
    nombre_asociacion.value = asociacion.nombre_asociacion;
    inversion.value = asociacion.inversion;
    meta.value = asociacion.meta;
    iniico_produccion.value = formatearFechaInput(asociacion.iniico_produccion);
    fin_produccion.value = formatearFechaInput(asociacion.fin_produccion);
    cultivoSelect.value = asociacion.cultivo;
    cicloSelect.value = asociacion.ciclo_cultivo;

    // Seleccionar los sensores
    sensoresSeleccionados = asociacion.sensores.split(',').map(s => s.trim());
    actualizarSensoresCheckbox();

    // Seleccionar el insumo
    const insumo = insumosData.find(i => i.nombreInsumo === asociacion.insumos);
    if (insumo) {
        insumosSelect.value = insumo.idInsumo;
        seleccionarInsumo(insumo.idInsumo);
    }

    cargarResponsables(); // Carga los responsables antes de abrir el modal
    setTimeout(() => {  // Espera a que se carguen los responsables
        responsableSelect.value = asociacion.responsable; // Selecciona el responsable
    }, 100);

    document.getElementById('modalAsociacionTitle').textContent = 'Editar Asociación';
    abrirModal(modalAsociacion);
}

function confirmarEliminarAsociacion(id) {
    asociacionSeleccionada = id;
    abrirModal(modalConfirmacion);
}

function limpiarFormularioAsociacion() {
    formAsociacion.reset();
    asociacionId.value = '';
    sensoresSeleccionados = [];
    insumoSeleccionado = null;
    insumoDetallesContainer.style.display = 'none';
    actualizarSensoresCheckbox();
}

// Funciones de acción

async function guardarAsociacion(event) {
    event.preventDefault();
    
    // Validar que se haya seleccionado al menos un sensor
    if (sensoresSeleccionados.length === 0) {
        mostrarNotificacion('Debe seleccionar al menos un sensor', 'error');
        return;
    }
    
    // Validar que se haya seleccionado un insumo
    if (!insumoSeleccionado) {
        mostrarNotificacion('Debe seleccionar un insumo', 'error');
        return;
    }
    
    // Validar que la cantidad de insumo no sea mayor a la disponible
    const cantidadInsumo = parseFloat(insumoCantidad.value);
    if (!cantidadInsumo || isNaN(cantidadInsumo)) {
        mostrarNotificacion('Debe ingresar una cantidad válida de insumo', 'error');
        return;
    }
    
    const disponibleInsumo = parseFloat(insumoDisponible.value.replace(/[^0-9.-]+/g, ''));
    
    if (cantidadInsumo > disponibleInsumo) {
        mostrarNotificacion('La cantidad a utilizar no puede ser mayor a la disponible', 'error');
        return;
    }
    
    // Preparar datos
    const data = {
        responsable: responsable.value,
        nombre_asociacion: nombre_asociacion.value,
        inversion: inversion.value,
        meta: meta.value,
        iniico_produccion: iniico_produccion.value,
        fin_produccion: fin_produccion.value,
        cultivo: cultivoSelect.value,
        sensores: sensoresSeleccionados.join(', '),
        insumos: insumoSeleccionado.nombreInsumo,
        ciclo_cultivo: cicloSelect.value,
        cantidad_insumo: cantidadInsumo // Añadir cantidad_insumo al objeto de datos
    };
    
    try {
        let response;
        let method;
        let url = `${API_URL}/asociaciones`;
        
        if (asociacionId.value) {
            // Actualizar
            url += `/${asociacionId.value}`;
            method = 'PUT';
        } else {
            // Crear
            method = 'POST';
        }
        
        response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.errores) {
                throw new Error(errorData.errores.join(', '));
            } else if (errorData.error) {
                throw new Error(errorData.error);
            } else {
                throw new Error('Error al guardar la asociación');
            }
        }
        await cargarDatos();
        
        cerrarModal(modalAsociacion);
        mostrarNotificacion('Asociación guardada exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(error.message || 'Error al guardar la asociación', 'error');
    }
}

async function eliminarAsociacion() {
    if (!asociacionSeleccionada) return;
    
    try {
        const response = await fetch(`${API_URL}/asociaciones/${asociacionSeleccionada}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar la asociación');
        
        // Recargar datos
        await cargarDatos();
        
        cerrarModal(modalConfirmacion);
        mostrarNotificacion('Asociación eliminada exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al eliminar la asociación', 'error');
    }
}

async function guardarCultivo(event) {
    event.preventDefault();
    
    const data = {
        cultivoType: document.getElementById('cultivoType').value,
        cultivoName: document.getElementById('cultivoName').value,
        cultivoID: document.getElementById('cultivoID').value,
        size: document.getElementById('size').value,
        location: document.getElementById('location').value,
        description: document.getElementById('cultivoDescription').value,
        state: document.getElementById('cultivoState').value
    };
    
    try {
        const response = await fetch(`${API_URL}/cultivo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Error al guardar el cultivo');
        
        // Recargar cultivos
        await cargarCultivos();
        
        cerrarModal(modalCultivo);
        mostrarNotificacion('Cultivo guardado exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar el cultivo', 'error');
    }
}

async function guardarCiclo(event) {
    event.preventDefault();
    
    const data = {
        cicloID: document.getElementById('cicloID').value,
        cicloName: document.getElementById('cicloName').value,
        siembraDate: document.getElementById('siembraDate').value,
        cosechaDate: document.getElementById('cosechaDate').value,
        news: document.getElementById('news').value,
        description: document.getElementById('cicloDescription').value,
        state: document.getElementById('cicloState').value
    };
    
    try {
        const response = await fetch(`${API_URL}/ciclocultivo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Error al guardar el ciclo de cultivo');
        
        // Recargar ciclos
        await cargarCiclos();
        
        cerrarModal(modalCiclo);
        mostrarNotificacion('Ciclo de cultivo guardado exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar el ciclo de cultivo', 'error');
    }
}

async function guardarInsumo(event) {
    event.preventDefault();
    
    const valorUnitarioValue = parseFloat(document.getElementById('valorUnitario').value);
    const cantidadValue = parseFloat(document.getElementById('cantidad').value);
    
    const data = {
        tipoInsumo: document.getElementById('tipoInsumo').value,
        nombreInsumo: document.getElementById('nombreInsumo').value,
        unidadMedida: document.getElementById('unidadMedida').value,
        cantidad: cantidadValue,
        valorUnitario: valorUnitarioValue,
        valorTotal: valorUnitarioValue * cantidadValue,
        descripcion: document.getElementById('descripcion').value,
        estado: document.getElementById('estado').value
    };
    
    try {
        const response = await fetch(`${API_URL}/insumo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Error al guardar el insumo');
        
        // Recargar insumos
        await cargarInsumos();
        
        cerrarModal(modalInsumo);
        mostrarNotificacion('Insumo guardado exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar el insumo', 'error');
    }
}

async function actualizarCantidadInsumo(idInsumo, cantidadUsada) {
    const insumo = insumosData.find(i => i.idInsumo == idInsumo);
    if (!insumo) return;
    
    const nuevaCantidad = parseFloat(insumo.cantidad) - cantidadUsada;
    
    const data = {
        tipoInsumo: insumo.tipoInsumo,
        nombreInsumo: insumo.nombreInsumo,
        unidadMedida: insumo.unidadMedida,
        cantidad: nuevaCantidad,
        valorUnitario: insumo.valorUnitario,
        valorTotal: nuevaCantidad * parseFloat(insumo.valorUnitario),
        descripcion: insumo.descripcion,
        estado: insumo.estado
    };
    
    try {
        const response = await fetch(`${API_URL}/insumo/${idInsumo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Error al actualizar la cantidad del insumo');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function registrarUsoInsumo(idInsumo, cantidad) {
    const insumo = insumosData.find(i => i.idInsumo == idInsumo);
    if (!insumo) return;
    
    const data = {
        fecha_uso: new Date().toISOString().split('T')[0],
        cantidad: cantidad,
        responsable: responsable.value,
        valor_unitario: insumo.valorUnitario,
        valor_total: cantidad * parseFloat(insumo.valorUnitario),
        observaciones: `Uso en asociación: ${nombre_asociacion.value}`,
        insumo: insumo.nombreInsumo
    };
    
    try {
        const response = await fetch(`${API_URL}/uso-insumo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Error al registrar el uso del insumo');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function seleccionarInsumo(idInsumo) {
    const insumo = insumosData.find(i => i.idInsumo == idInsumo);
    if (!insumo) {
        insumoDetallesContainer.style.display = 'none';
        insumoSeleccionado = null;
        return;
    }
    
    insumoSeleccionado = insumo;
    
    // Mostrar detalles del insumo
    insumoNombre.value = insumo.nombreInsumo;
    insumoTipo.value = insumo.tipoInsumo;
    insumoDisponible.value = `${insumo.cantidad} ${insumo.unidadMedida}`;
    insumoCantidad.value = '';
    insumoValorUnitario.value = `$${parseFloat(insumo.valorUnitario).toFixed(2)}`;
    insumoValorTotal.value = '$0.00';
    
    // Establecer el valor máximo para la cantidad
    insumoCantidad.max = insumo.cantidad;
    
    insumoDetallesContainer.style.display = 'block';
}

function calcularValorInsumo() {
    if (!insumoSeleccionado) return;
    
    const cantidad = parseFloat(insumoCantidad.value) || 0;
    const valorUnitario = parseFloat(insumoSeleccionado.valorUnitario);
    const valorTotal = cantidad * valorUnitario;
    
    insumoValorTotal.value = `$${valorTotal.toFixed(2)}`;
    
    // Actualizar inversión
    const inversionBase = parseFloat(inversion.value) || 0;
    const nuevaInversion = inversionBase + valorTotal;
    inversion.value = nuevaInversion.toFixed(2);
    
    // Actualizar meta (30% más que la inversión)
    const nuevaMeta = nuevaInversion * 1.3;
    meta.value = nuevaMeta.toFixed(2);
}

// Funciones de exportación
function exportarExcel() {
    // Preparar datos para Excel
    const data = asociacionesData.map(a => ({
        ID: a.id,
        Responsable: a.responsable,
        'Nombre Asociación': a.nombre_asociacion,
        Inversión: parseFloat(a.inversion),
        Meta: parseFloat(a.meta),
        'Inicio Producción': formatearFecha(a.iniico_produccion),
        'Fin Producción': formatearFecha(a.fin_produccion),
        Cultivo: a.cultivo,
        Sensores: a.sensores,
        Insumos: a.insumos,
        'Ciclo Cultivo': a.ciclo_cultivo
    }));
    
    // Crear libro de Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asociaciones');
    
    // Ajustar ancho de columnas
    const columnas = [
        { wch: 5 },  // ID
        { wch: 15 }, // Responsable
        { wch: 20 }, // Nombre Asociación
        { wch: 10 }, // Inversión
        { wch: 10 }, // Meta
        { wch: 15 }, // Inicio Producción
        { wch: 15 }, // Fin Producción
        { wch: 15 }, // Cultivo
        { wch: 20 }, // Sensores
        { wch: 15 }, // Insumos
        { wch: 15 }  // Ciclo Cultivo
    ];
    worksheet['!cols'] = columnas;
    
    // Descargar archivo
    XLSX.writeFile(workbook, 'Asociaciones.xlsx');
}

function exportarPDF() {
    // Importar jsPDF
    const { jsPDF } = window.jspdf;
    
    // Crear documento PDF
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Reporte de Asociaciones', 14, 22);
    
    // Fecha
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Preparar datos para la tabla
    const tableColumn = ['ID', 'Responsable', 'Asociación', 'Inversión', 'Meta', 'Cultivo'];
    const tableRows = [];
    
    asociacionesData.forEach(a => {
        const rowData = [
            a.id,
            a.responsable,
            a.nombre_asociacion,
            `$${parseFloat(a.inversion).toFixed(2)}`,
            `$${parseFloat(a.meta).toFixed(2)}`,
            a.cultivo
        ];
        tableRows.push(rowData);
    });
    
    // Generar tabla
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        headStyles: {
            fillColor: [57, 169, 0],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        }
    });
    
    // Estadísticas
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(14);
    doc.text('Estadísticas', 14, finalY);
    
    doc.setFontSize(11);
    doc.text(`Total de Asociaciones: ${asociacionesData.length}`, 14, finalY + 8);
    
    const inversionTotal = asociacionesData.reduce((total, a) => total + parseFloat(a.inversion), 0);
    doc.text(`Inversión Total: $${inversionTotal.toFixed(2)}`, 14, finalY + 16);
    
    const metaTotal = asociacionesData.reduce((total, a) => total + parseFloat(a.meta), 0);
    doc.text(`Meta Total: $${metaTotal.toFixed(2)}`, 14, finalY + 24);
    
    // Descargar archivo
    doc.save('Asociaciones.pdf');
}

// Funciones de utilidad
function formatearFecha(fechaStr) {
    if (!fechaStr) return 'No disponible';
    
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString();
}

function formatearFechaInput(fechaStr) {
    if (!fechaStr) return '';
    
    const fecha = new Date(fechaStr);
    return fecha.toISOString().split('T')[0];
}

function mostrarNotificacion(mensaje, tipo) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion--${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion__content">
            <i class="notificacion__icon fa-solid ${tipo === 'success' ? 'fa-check-circle' : tipo === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle'}"></i>
            <span class="notificacion__message">${mensaje}</span>
        </div>
    `;
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Mostrar notificación
    setTimeout(() => {
        notificacion.classList.add('notificacion--visible');
    }, 10);
    
    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('notificacion--visible');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Inicializar event listeners
function inicializarEventListeners() {
    // Botones principales
    btnCrearAsociacion.addEventListener('click', abrirModalCrearAsociacion);
    btnExportarExcel.addEventListener('click', exportarExcel);
    btnExportarPDF.addEventListener('click', exportarPDF);
    
    // Cerrar modales
    document.getElementById('closeModalDetalles').addEventListener('click', () => cerrarModal(modalDetalles));
    document.getElementById('closeModalAsociacion').addEventListener('click', () => cerrarModal(modalAsociacion));
    document.getElementById('closeModalCultivo').addEventListener('click', () => cerrarModal(modalCultivo));
    document.getElementById('closeModalCiclo').addEventListener('click', () => cerrarModal(modalCiclo));
    document.getElementById('closeModalInsumo').addEventListener('click', () => cerrarModal(modalInsumo));
    document.getElementById('closeModalConfirmacion').addEventListener('click', () => cerrarModal(modalConfirmacion));
    
    // Botones de cancelar
    btnCancelarAsociacion.addEventListener('click', () => cerrarModal(modalAsociacion));
    btnCancelarCultivo.addEventListener('click', () => cerrarModal(modalCultivo));
    btnCancelarCiclo.addEventListener('click', () => cerrarModal(modalCiclo));
    btnCancelarInsumo.addEventListener('click', () => cerrarModal(modalInsumo));
    btnCancelarEliminar.addEventListener('click', () => cerrarModal(modalConfirmacion));
    
    // Botones de acción
    btnConfirmarEliminar.addEventListener('click', eliminarAsociacion);
    
    // Botones para abrir modales secundarios
    btnNuevoCultivo.addEventListener('click', () => {
        formCultivo.reset();
        abrirModal(modalCultivo);
    });
    
    btnNuevoCiclo.addEventListener('click', () => {
        formCiclo.reset();
        abrirModal(modalCiclo);
    });
    
    btnNuevoInsumo.addEventListener('click', () => {
        formInsumo.reset();
        abrirModal(modalInsumo);
    });
    
    // Formularios
    formAsociacion.addEventListener('submit', guardarAsociacion);
    formCultivo.addEventListener('submit', guardarCultivo);
    formCiclo.addEventListener('submit', guardarCiclo);
    formInsumo.addEventListener('submit', guardarInsumo);
    
    // Selección de insumo
    insumosSelect.addEventListener('change', function() {
        seleccionarInsumo(this.value);
    });
    
    // Cálculo de valor de insumo
    insumoCantidad.addEventListener('input', calcularValorInsumo);
    
    // Búsqueda
    searchInput.addEventListener('input', function() {
        renderizarTablaAsociaciones(this.value);
    });
    
    // Inversión y meta
    inversion.addEventListener('input', function() {
        const inversionValue = parseFloat(this.value) || 0;
        meta.value = (inversionValue * 1.3).toFixed(2);
    });
    nombre_asociacion.addEventListener('input', function() {
        if (!validarNombreAsociacion(this.value)) {
            this.setCustomValidity('El nombre debe tener entre 3 y 100 caracteres.');
        } else {
            this.setCustomValidity('');
        }
        this.reportValidity();
    });
}

// Estilos para notificaciones
const notificacionStyles = document.createElement('style');
notificacionStyles.textContent = `
    .notificacion {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: var(--border-radius);
        background-color: white;
        box-shadow: var(--shadow-md);
        z-index: 2000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
    }
    
    .notificacion--visible {
        transform: translateX(0);
    }
    
    .notificacion__content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notificacion__icon {
        font-size: 1.25rem;
    }
    
    .notificacion--success .notificacion__icon {
        color: var(--green-950);
    }
    
    .notificacion--warning .notificacion__icon {
        color: var(--warning);
    }
    
    .notificacion--error .notificacion__icon {
        color: var(--danger);
    }
    
    .notificacion__message {
        font-size: 0.875rem;
        font-weight: 500;
    }
`;
document.head.appendChild(notificacionStyles);