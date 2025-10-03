// Variables globales
const API_URL = "http://localhost:3000/api"
let asociacionesData = []
let cultivosData = []
let ciclosData = []
let sensoresData = []
let insumosData = []
let responsablesData = []
let asociacionSeleccionada = null
let sensoresSeleccionados = []
let insumosSeleccionados = []

// Elementos DOM principales
const asociacionesTableBody = document.getElementById("asociacionesTableBody")
const totalAsociacionesElement = document.getElementById("totalAsociaciones")
const inversionTotalElement = document.getElementById("inversionTotal")
const metaTotalElement = document.getElementById("metaTotal")
const searchInput = document.getElementById("searchInput")

// Modales
const modalDetalles = document.getElementById("modalDetalles")
const modalAsociacion = document.getElementById("modalAsociacion")
const modalResponsable = document.getElementById("modalResponsable")
const modalSensor = document.getElementById("modalSensor")
const modalCultivo = document.getElementById("modalCultivo")
const modalCiclo = document.getElementById("modalCiclo")
const modalInsumo = document.getElementById("modalInsumo")
const modalConfirmacion = document.getElementById("modalConfirmacion")

// Botones principales
const btnCrearAsociacion = document.getElementById("btnCrearAsociacion")
const btnExportarExcel = document.getElementById("btnExportarExcel")
const btnExportarPDF = document.getElementById("btnExportarPDF")

// Botones de modales secundarios
const btnNuevoResponsable = document.getElementById("btnNuevoResponsable")
const btnNuevoSensor = document.getElementById("btnNuevoSensor")
const btnNuevoCultivo = document.getElementById("btnNuevoCultivo")
const btnNuevoCiclo = document.getElementById("btnNuevoCiclo")
const btnNuevoInsumo = document.getElementById("btnNuevoInsumo")

// Formularios
const formAsociacion = document.getElementById("formAsociacion")
const formResponsable = document.getElementById("formResponsable")
const formSensor = document.getElementById("formSensor")
const formCultivo = document.getElementById("formCultivo")
const formCiclo = document.getElementById("formCiclo")
const formInsumo = document.getElementById("formInsumo")

// Selectores y contenedores
const responsableSelect = document.getElementById("responsable")
const cultivoSelect = document.getElementById("cultivo")
const cicloSelect = document.getElementById("ciclo_cultivo")
const sensoresContainer = document.getElementById("sensoresContainer")
const insumosContainer = document.getElementById("insumosContainer")
const insumosDetallesContainer = document.getElementById("insumosDetallesContainer")
const insumosDetallesContent = document.getElementById("insumosDetallesContent")

// Campos de asociación
const asociacionId = document.getElementById("asociacionId")
const nombre_asociacion = document.getElementById("nombre_asociacion")
const inversion = document.getElementById("inversion")
const meta = document.getElementById("meta")
const iniico_produccion = document.getElementById("iniico_produccion")
const fin_produccion = document.getElementById("fin_produccion")



// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  cargarDatos()
  inicializarEventListeners()
  configurarCalculoInsumo()
})

// Funciones de carga de datos
async function cargarDatos() {
  try {
    await Promise.all([
      cargarAsociaciones(),
      cargarCultivos(),
      cargarCiclos(),
      cargarSensores(),
      cargarInsumos(),
      cargarResponsables(),
    ])

    actualizarEstadisticas()
    inicializarGraficos()
  } catch (error) {
    console.error("Error al cargar datos:", error)
    mostrarNotificacion("Error al cargar datos", "error")
  }
}

async function cargarAsociaciones() {
  try {
    const response = await fetch(`${API_URL}/asociaciones`)
    if (!response.ok) throw new Error("Error al cargar asociaciones")

    asociacionesData = await response.json()
    renderizarTablaAsociaciones()
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion("Error al cargar asociaciones", "error")
  }
}

async function cargarCultivos() {
  try {
    const response = await fetch(`${API_URL}/cultivo`)
    if (!response.ok) throw new Error("Error al cargar cultivos")

    cultivosData = await response.json()
    actualizarSelectCultivos()
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion("Error al cargar cultivos", "error")
  }
}

async function cargarCiclos() {
  try {
    const response = await fetch(`${API_URL}/ciclocultivo`, { cache: 'no-store' })
    console.debug('cargarCiclos: status', response.status)

    if (response.status === 204 || response.status === 304) {
      console.debug('cargarCiclos: respuesta sin contenido, se asigna array vacío')
      ciclosData = []
    } else if (response.ok) {
      const text = await response.clone().text()
      console.debug('cargarCiclos: body length', text.length, 'preview:', text.slice(0, 200))
      ciclosData = await response.json()
    } else {
      throw new Error("Error al cargar ciclos de cultivo")
    }

    actualizarSelectCiclos()
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion("Error al cargar ciclos de cultivo", "error")
  }
}

async function cargarSensores() {
  try {
    const response = await fetch(`${API_URL}/sensores`)
    if (!response.ok) throw new Error("Error al cargar sensores")

    sensoresData = await response.json()
    actualizarSensoresCheckbox()
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion("Error al cargar sensores", "error")
  }
}

async function cargarInsumos() {
  try {
    const response = await fetch(`${API_URL}/insumo`, { cache: 'no-store' })
    console.debug('cargarInsumos: status', response.status)

    if (response.status === 204 || response.status === 304) {
      console.debug('cargarInsumos: respuesta sin contenido, se asigna array vacío')
      insumosData = []
    } else if (response.ok) {
      const text = await response.clone().text()
      console.debug('cargarInsumos: body length', text.length, 'preview:', text.slice(0, 200))
      insumosData = await response.json()
    } else {
      throw new Error("Error al cargar insumos")
    }

    actualizarInsumosCheckbox()
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion("Error al cargar insumos", "error")
  }
}

async function cargarResponsables() {
  try {
    const response = await fetch(`${API_URL}/responsables`)
    if (!response.ok) throw new Error("Error al cargar responsables")

    responsablesData = await response.json()
    actualizarSelectResponsables()
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion("Error al cargar responsables", "error")
  }
}

// Funciones de actualización de selectores
function actualizarSelectResponsables() {
  responsableSelect.innerHTML = '<option value="">Seleccionar responsable</option>'
  responsablesData.forEach((responsable) => {
    const option = document.createElement("option")
    option.value = responsable.name
    option.textContent = responsable.name
    responsableSelect.appendChild(option)
  })
}

function actualizarSelectCultivos() {
  cultivoSelect.innerHTML = '<option value="">Seleccionar cultivo</option>'

  const cultivosActivos = cultivosData.filter((c) => c.state === "Activo")

  cultivosActivos.forEach((cultivo) => {
    const option = document.createElement("option")
    option.value = cultivo.cultivoName
    option.textContent = cultivo.cultivoName
    cultivoSelect.appendChild(option)
  })
}

function actualizarSelectCiclos() {
  cicloSelect.innerHTML = '<option value="">Seleccionar ciclo</option>'

  // Mostrar todos los ciclos, pero indicar su estado entre paréntesis
  const ciclos = Array.isArray(ciclosData) ? ciclosData : []
  console.debug('cargarCiclos: encontrados', ciclos.length, 'registros')

  ciclos.forEach((ciclo) => {
    const option = document.createElement("option")
    const stateLabel = (ciclo.state || '').toString().trim()
    option.value = ciclo.cicloName
    option.textContent = ciclo.cicloName + (stateLabel ? ` (${stateLabel})` : '')
    cicloSelect.appendChild(option)
  })
}

function actualizarSensoresCheckbox() {
  sensoresContainer.innerHTML = ""

  const sensoresActivos = sensoresData.filter((s) => s.estado === "Activo")

  sensoresActivos.forEach((sensor) => {
    const sensorDiv = document.createElement("div")
    sensorDiv.className = "sensor-checkbox"

    const isChecked = sensoresSeleccionados.includes(sensor.nombreSensor)

    sensorDiv.innerHTML = `
            <input type="checkbox" id="sensor-${sensor.idSensor}" value="${sensor.nombreSensor}" 
                ${isChecked ? "checked" : ""} ${sensoresSeleccionados.length >= 3 && !isChecked ? "disabled" : ""}>
            <label class="sensor-checkbox__label" for="sensor-${sensor.idSensor}">${sensor.nombreSensor}</label>
        `

    sensoresContainer.appendChild(sensorDiv)
  })

  // Agregar event listeners a los checkboxes
  document.querySelectorAll('#sensoresContainer input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        if (sensoresSeleccionados.length < 3) {
          sensoresSeleccionados.push(this.value)
        } else {
          this.checked = false
          mostrarNotificacion("Solo puede seleccionar hasta 3 sensores", "warning")
        }
      } else {
        sensoresSeleccionados = sensoresSeleccionados.filter((s) => s !== this.value)
      }

      // Actualizar estado de los checkboxes
      const checkboxes = document.querySelectorAll('#sensoresContainer input[type="checkbox"]')
      checkboxes.forEach((cb) => {
        if (!cb.checked) {
          cb.disabled = sensoresSeleccionados.length >= 3
        }
      })
    })
  })
}

function actualizarInsumosCheckbox() {
  insumosContainer.innerHTML = ""

  // Mostrar todos los insumos y marcar su estado en la etiqueta
  const insumos = Array.isArray(insumosData) ? insumosData : []
  console.debug('cargarInsumos: encontrados', insumos.length, 'registros')

  insumos.forEach((insumo) => {
    const insumoDiv = document.createElement("div")
    insumoDiv.className = "insumo-checkbox"

    const isChecked = insumosSeleccionados.some((i) => i.idInsumo === insumo.idInsumo)
    const isInactive = (insumo.estado || '').toString().toLowerCase() !== 'activo'
    const disabledDueToLimit = insumosSeleccionados.length >= 3 && !isChecked

    const input = document.createElement('input')
    input.type = 'checkbox'
    input.id = `insumo-${insumo.idInsumo}`
    input.value = insumo.idInsumo
    if (isChecked) input.checked = true
    if (isInactive || disabledDueToLimit) input.disabled = true

    const label = document.createElement('label')
    label.className = 'insumo-checkbox__label'
    label.htmlFor = input.id
    const estadoLabel = insumo.estado ? ` (${insumo.estado})` : ''
    label.textContent = insumo.nombreInsumo + ` (${insumo.tipoInsumo}) - ` + insumo.cantidad + ' ' + insumo.unidadMedida + estadoLabel

    insumoDiv.appendChild(input)
    insumoDiv.appendChild(label)
    insumosContainer.appendChild(insumoDiv)
  })

  // Agregar event listeners a los checkboxes
  document.querySelectorAll('#insumosContainer input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const insumoId = Number.parseInt(this.value)
      const insumo = insumosData.find((i) => i.idInsumo === insumoId)

      if (this.checked) {
        if (insumosSeleccionados.length < 3) {
          insumosSeleccionados.push({
            ...insumo,
            cantidadUtilizar: 1,
          })
          actualizarDetallesInsumos()
        } else {
          this.checked = false
          mostrarNotificacion("Solo puede seleccionar hasta 3 insumos", "warning")
        }
      } else {
        insumosSeleccionados = insumosSeleccionados.filter((i) => i.idInsumo !== insumoId)
        actualizarDetallesInsumos()
      }

      // Actualizar estado de los checkboxes
      const checkboxes = document.querySelectorAll('#insumosContainer input[type="checkbox"]')
      checkboxes.forEach((cb) => {
        if (!cb.checked) {
          cb.disabled = insumosSeleccionados.length >= 3
        }
      })
    })
  })
}

function actualizarDetallesInsumos() {
  if (insumosSeleccionados.length === 0) {
    insumosDetallesContainer.style.display = "none"
    return
  }

  insumosDetallesContainer.style.display = "block"
  insumosDetallesContent.innerHTML = ""

  insumosSeleccionados.forEach((insumo, index) => {
    const insumoDetalleDiv = document.createElement("div")
    insumoDetalleDiv.className = "insumo-detalle"
    insumoDetalleDiv.innerHTML = `
            <div class="insumo-detalle__header">
                <h5 class="insumo-detalle__title">${insumo.nombreInsumo}</h5>
                <button type="button" class="button button--icon button--danger" onclick="removerInsumo(${insumo.idInsumo})">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="insumo-detalle__content">
                <div class="form__row">
                    <div class="form__group">
                        <label class="form__label">Tipo</label>
                        <input type="text" class="form__input" value="${insumo.tipoInsumo}" readonly>
                    </div>
                    <div class="form__group">
                        <label class="form__label">Disponible</label>
                        <input type="text" class="form__input" value="${insumo.cantidad} ${insumo.unidadMedida}" readonly>
                    </div>
                </div>
                <div class="form__row">
                    <div class="form__group">
                        <label class="form__label">Cantidad a Utilizar</label>
                        <input type="number" class="form__input cantidad-insumo" 
                               data-insumo-id="${insumo.idInsumo}"
                               value="${insumo.cantidadUtilizar}" 
                               min="1" max="${insumo.cantidad}" step="1" required>
                    </div>
                    <div class="form__group">
                        <label class="form__label">Valor Unitario</label>
                        <input type="text" class="form__input" value="$${Number.parseFloat(insumo.valorUnitario).toFixed(2)}" readonly>
                    </div>
                </div>
                <div class="form__row">
                    <div class="form__group">
                        <label class="form__label">Valor Total</label>
                        <input type="text" class="form__input valor-total-insumo" 
                               id="valorTotal-${insumo.idInsumo}"
                               value="$${(Number.parseFloat(insumo.valorUnitario) * insumo.cantidadUtilizar).toFixed(2)}" readonly>
                    </div>
                </div>
            </div>
        `

    insumosDetallesContent.appendChild(insumoDetalleDiv)
  })

  // Agregar event listeners para cantidad
  document.querySelectorAll(".cantidad-insumo").forEach((input) => {
    input.addEventListener("input", function () {
      const insumoId = Number.parseInt(this.dataset.insumoId)
      const cantidad = Number.parseFloat(this.value) || 0

      // Actualizar cantidad en el array
      const insumoIndex = insumosSeleccionados.findIndex((i) => i.idInsumo === insumoId)
      if (insumoIndex !== -1) {
        insumosSeleccionados[insumoIndex].cantidadUtilizar = cantidad

        // Actualizar valor total
        const valorUnitario = Number.parseFloat(insumosSeleccionados[insumoIndex].valorUnitario)
        const valorTotal = cantidad * valorUnitario
        document.getElementById(`valorTotal-${insumoId}`).value = `$${valorTotal.toFixed(2)}`

        // Recalcular inversión total
        calcularInversionTotal()
      }
    })
  })

  calcularInversionTotal()
}

function removerInsumo(insumoId) {
  insumosSeleccionados = insumosSeleccionados.filter((i) => i.idInsumo !== insumoId)

  // Desmarcar checkbox
  const checkbox = document.getElementById(`insumo-${insumoId}`)
  if (checkbox) {
    checkbox.checked = false
    checkbox.disabled = false
  }

  // Actualizar checkboxes
  const checkboxes = document.querySelectorAll('#insumosContainer input[type="checkbox"]')
  checkboxes.forEach((cb) => {
    if (!cb.checked) {
      cb.disabled = insumosSeleccionados.length >= 3
    }
  })

  actualizarDetallesInsumos()
}

function calcularInversionTotal() {
  const inversionTotal = insumosSeleccionados.reduce((total, insumo) => {
    return total + Number.parseFloat(insumo.valorUnitario) * insumo.cantidadUtilizar
  }, 0)

  inversion.value = inversionTotal.toFixed(2)
  meta.value = (inversionTotal * 1.3).toFixed(2)
}

// Funciones de renderizado
function renderizarTablaAsociaciones(filtro = "") {
  asociacionesTableBody.innerHTML = ""

  const asociacionesFiltradas = filtro
    ? asociacionesData.filter(
        (a) =>
          a.nombre_asociacion.toLowerCase().includes(filtro.toLowerCase()) ||
          a.responsable.toLowerCase().includes(filtro.toLowerCase()),
      )
    : asociacionesData

  if (asociacionesFiltradas.length === 0) {
    asociacionesTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">No se encontraron asociaciones</td>
            </tr>
        `
    return
  }

  asociacionesFiltradas.forEach((asociacion) => {
  const row = document.createElement("tr")

  // Detectar estado (soporte para 'state' o 'estado')
  const estadoValor = String(asociacion.state || asociacion.estado || '').trim()
  const isInactive = estadoValor && estadoValor.toLowerCase() !== 'activo'

  // Construir nombre con badge si está inactiva
  const nombreWithBadge = isInactive
    ? `${asociacion.nombre_asociacion} <span class="badge badge--inactive">Inactivo</span>`
    : (asociacion.nombre_asociacion || '')

  row.innerHTML = `
      <td>${asociacion.id}</td>
      <td>${asociacion.responsable}</td>
      <td>${nombreWithBadge}</td>
      <td>$${Number.parseFloat(asociacion.inversion).toFixed(2)}</td>
      <td>$${Number.parseFloat(asociacion.meta).toFixed(2)}</td>
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
    `

  if (isInactive) row.classList.add('row--inactive')
    asociacionesTableBody.appendChild(row)
  })

  // Agregar event listeners a los botones
  document.querySelectorAll(".btn-ver").forEach((btn) => {
    btn.addEventListener("click", () => verDetallesAsociacion(btn.dataset.id))
  })

  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => editarAsociacion(btn.dataset.id))
  })

  // Borrar directo: confirmar con el usuario y enviar DELETE (no dependemos de un modal que pueda faltar)
  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", () => eliminarAsociacionDirect(btn.dataset.id))
  })
}

function actualizarEstadisticas() {
  totalAsociacionesElement.textContent = asociacionesData.length

  const inversionTotal = asociacionesData.reduce((total, asociacion) => {
    return total + Number.parseFloat(asociacion.inversion)
  }, 0)
  inversionTotalElement.textContent = `$${inversionTotal.toFixed(2)}`

  const metaTotal = asociacionesData.reduce((total, asociacion) => {
    return total + Number.parseFloat(asociacion.meta)
  }, 0)
  metaTotalElement.textContent = `$${metaTotal.toFixed(2)}`
}

// Funciones de gráficos
function inicializarGraficos() {
  renderizarGraficoInversionMeta()
  renderizarGraficoCultivoDistribucion()
  renderizarGraficoSensoresUso()
}

// Grafico: distribución de cultivos
function renderizarGraficoCultivoDistribucion() {
  if (typeof Chart === 'undefined') return
  const canvas = document.getElementById('cultivoDistribucionChart')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  // Contar cultivos en asociaciones
  const counter = {}
  asociacionesData.forEach(a => {
    const name = a.cultivo || 'Sin cultivo'
    counter[name] = (counter[name] || 0) + 1
  })

  const labels = Object.keys(counter)
  const data = labels.map(l => counter[l])

  if (window.cultivoDistribucionChart && typeof window.cultivoDistribucionChart.destroy === 'function') {
    try { window.cultivoDistribucionChart.destroy() } catch (e) {}
    window.cultivoDistribucionChart = null
  }

  // Si no hay datos, limpiar canvas
  if (!labels.length) { try { ctx.clearRect(0,0,canvas.width,canvas.height) } catch(e){}; return }

  window.cultivoDistribucionChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{ data: data, backgroundColor: labels.map((_, i) => `hsl(${(i*60)%360} 70% 50%)`) }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  })
}

// Grafico: uso de sensores (cuentas de apariciones en asociaciones)
function renderizarGraficoSensoresUso() {
  if (typeof Chart === 'undefined') return
  const canvas = document.getElementById('sensoresUsoChart')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  // construir contador de sensores desde asociacionesData (sensores están separados por comas)
  const counter = {}
  asociacionesData.forEach(a => {
    if (!a.sensores) return
    a.sensores.split(',').map(s => s.trim()).forEach(name => {
      if (!name) return
      counter[name] = (counter[name] || 0) + 1
    })
  })

  const labels = Object.keys(counter)
  const data = labels.map(l => counter[l])

  if (window.sensoresUsoChart && typeof window.sensoresUsoChart.destroy === 'function') {
    try { window.sensoresUsoChart.destroy() } catch (e) {}
    window.sensoresUsoChart = null
  }

  if (!labels.length) { try { ctx.clearRect(0,0,canvas.width,canvas.height) } catch(e){}; return }

  window.sensoresUsoChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{ label: 'Apariciones en asociaciones', data: data, backgroundColor: 'rgba(54,162,235,0.7)' }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
  })
}

function renderizarGraficoInversionMeta() {
  // Asegurarse de que Chart.js y el canvas están disponibles
  if (typeof Chart === 'undefined') {
    console.debug('renderizarGraficoInversionMeta: Chart.js no está cargado, se omite el gráfico')
    return
  }

  const canvas = document.getElementById("inversionMetaChart")
  if (!canvas) {
    console.debug('renderizarGraficoInversionMeta: canvas #inversionMetaChart no encontrado')
    return
  }

  const ctx = canvas.getContext("2d")

  // Tomar hasta 5 asociaciones más recientes (por id)
  const asociacionesRecientes = [...asociacionesData]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)
    .reverse()

  const labels = asociacionesRecientes.map((a) => a.nombre_asociacion || 'Sin nombre')
  // Normalizar valores numéricos: convertir a número y usar 0 si no es válido
  const inversionData = asociacionesRecientes.map((a) => {
    const v = Number.parseFloat(a.inversion)
    return Number.isFinite(v) ? v : 0
  })
  const metaData = asociacionesRecientes.map((a) => {
    const v = Number.parseFloat(a.meta)
    return Number.isFinite(v) ? v : 0
  })

  // Si no hay datos, limpiar el canvas y mostrar mensaje en consola
  if (!labels.length || (inversionData.every((v) => v === 0) && metaData.every((v) => v === 0))) {
    console.debug('renderizarGraficoInversionMeta: no hay datos válidos para mostrar el gráfico')
    // destruir gráfico anterior si existía
    if (window.inversionMetaChart && typeof window.inversionMetaChart.destroy === 'function') {
      try { window.inversionMetaChart.destroy() } catch (e) { /* ignore */ }
      window.inversionMetaChart = null
    }
    // Opcional: limpiar el canvas
    try { ctx.clearRect(0, 0, canvas.width, canvas.height) } catch (e) { /* ignore */ }
    return
  }

  // Destruir gráfico previo si existe para evitar sobreposiciones
  if (window.inversionMetaChart && typeof window.inversionMetaChart.destroy === 'function') {
    try { window.inversionMetaChart.destroy() } catch (e) { /* ignore */ }
    window.inversionMetaChart = null
  }

  window.inversionMetaChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Inversión",
          data: inversionData,
          backgroundColor: "rgba(57, 169, 0, 0.7)",
          borderColor: "rgba(57, 169, 0, 1)",
          borderWidth: 1,
        },
        {
          label: "Meta",
          data: metaData,
          backgroundColor: "rgba(0, 120, 50, 0.7)",
          borderColor: "rgba(0, 120, 50, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Valor ($)",
          },
        },
      },
    },
  })
}

// Funciones de modales
function abrirModal(modal) {
  // modal can be an element or an id string
  let element = modal
  if (typeof modal === 'string') {
    element = document.getElementById(modal)
  }
  if (!element) {
    console.warn('abrirModal: modal no encontrado', modal)
    return
  }
  element.classList.add("active")
  document.body.style.overflow = "hidden"
}

function cerrarModal(modal) {
  // modal can be an element or an id string
  let element = modal
  if (typeof modal === 'string') {
    element = document.getElementById(modal)
  }
  if (!element) return
  element.classList.remove("active")
  document.body.style.overflow = ""
}

function abrirModalCrearAsociacion() {
  limpiarFormularioAsociacion()
  document.getElementById("modalAsociacionTitle").textContent = "Nueva Asociación"
  abrirModal(modalAsociacion)
}

function limpiarFormularioAsociacion() {
  formAsociacion.reset()
  asociacionId.value = ""
  sensoresSeleccionados = []
  insumosSeleccionados = []
  insumosDetallesContainer.style.display = "none"
  actualizarSensoresCheckbox()
  actualizarInsumosCheckbox()
}

// Funciones para crear elementos desde modales
async function crearResponsable(event) {
  event.preventDefault()

  const data = {
    usertype: document.getElementById("responsableUsertype").value,
    IDtype: document.getElementById("responsableIDtype").value,
    IDnum: document.getElementById("responsableIDnum").value,
    name: document.getElementById("responsableName").value,
    email: document.getElementById("responsableEmail").value,
    phone: document.getElementById("responsablePhone").value,
    password: document.getElementById("responsablePassword").value,
  }

  try {
    const response = await fetch(`http://localhost:3000/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    console.log(response);
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error al crear responsable")
    }

    await cargarResponsables()
    cerrarModal(modalResponsable)
    mostrarNotificacion("Responsable creado exitosamente", "success")

    // Seleccionar el nuevo responsable
    responsableSelect.value = data.name
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion(error.message, "error")
  }
}

async function crearSensor(event) {
  event.preventDefault()

  const data = {
    tipoSensor: document.getElementById("sensorTipo").value,
    nombreSensor: document.getElementById("sensorNombre").value,
    unidadMedida: document.getElementById("sensorUnidad").value,
    tiempoEscaneo: Number.parseInt(document.getElementById("sensorTiempo").value),
    descripcion: document.getElementById("sensorDescripcion").value,
    estado: document.getElementById("sensorEstado").value,
  }

  try {
    const response = await fetch(`${API_URL}/sensores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error al crear sensor")
    }

    await cargarSensores()
    cerrarModal(modalSensor)
    mostrarNotificacion("Sensor creado exitosamente", "success")
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion(error.message, "error")
  }
}

async function crearCultivo(event) {
  event.preventDefault()

  const data = {
    cultivoType: document.getElementById("cultivoType").value,
    cultivoName: document.getElementById("cultivoName").value,
    cultivoID: document.getElementById("cultivoID").value,
    size: document.getElementById("cultivoSize").value,
    location: document.getElementById("cultivoLocation").value,
    description: document.getElementById("cultivoDescription").value,
    state: document.getElementById("cultivoState").value,
  }

  try {
    const response = await fetch(`${API_URL}/cultivo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error al crear cultivo")
    }

    await cargarCultivos()
    cerrarModal(modalCultivo)
    mostrarNotificacion("Cultivo creado exitosamente", "success")

    // Seleccionar el nuevo cultivo
    cultivoSelect.value = data.cultivoName
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion(error.message, "error")
  }
}

async function crearCiclo(event) {
  event.preventDefault()

  const data = {
    cicloID: document.getElementById("cicloID").value,
    cicloName: document.getElementById("cicloName").value,
    siembraDate: document.getElementById("siembraDate").value,
    cosechaDate: document.getElementById("cosechaDate").value,
    news: document.getElementById("cicloNews").value,
    description: document.getElementById("cicloDescription").value,
    state: document.getElementById("cicloState").value,
  }

  try {
    const response = await fetch(`${API_URL}/ciclocultivo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error al crear ciclo de cultivo")
    }

    await cargarCiclos()
    cerrarModal(modalCiclo)
    mostrarNotificacion("Ciclo de cultivo creado exitosamente", "success")

    // Seleccionar el nuevo ciclo
    cicloSelect.value = data.cicloName
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion(error.message, "error")
  }
}

async function crearInsumo(event) {
  event.preventDefault()

  const cantidad = Number.parseFloat(document.getElementById("cantidad").value)
  const valorUnitario = Number.parseFloat(document.getElementById("valorUnitario").value)

  const data = {
    tipoInsumo: document.getElementById("tipoInsumo").value,
    nombreInsumo: document.getElementById("nombreInsumo").value,
    unidadMedida: document.getElementById("unidadMedida").value,
    cantidad: cantidad,
    valorUnitario: valorUnitario,
    valorTotal: cantidad * valorUnitario,
    descripcion: document.getElementById("descripcionInsumo").value,
    estado: document.getElementById("estadoInsumo").value,
  }

  try {
    const response = await fetch(`${API_URL}/insumo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error al crear insumo")
    }

    await cargarInsumos()
    cerrarModal(modalInsumo)
    mostrarNotificacion("Insumo creado exitosamente", "success")
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion(error.message, "error")
  }
}

// Configurar cálculo automático en modal de insumo
function configurarCalculoInsumo() {
  const cantidadInput = document.getElementById("cantidad")
  const valorUnitarioInput = document.getElementById("valorUnitario")
  const valorTotalCalculado = document.getElementById("valorTotalCalculado")
  const valorTotalHidden = document.getElementById("valorTotal")

  // Si alguno de los elementos no existe (p. ej. modal no cargado), salir sin errores
  if (!cantidadInput || !valorUnitarioInput || !valorTotalCalculado || !valorTotalHidden) {
    console.debug('configurarCalculoInsumo: elementos de insumo no encontrados, se omite configuración')
    return
  }

  function calcularValorTotal() {
    const cantidad = Number.parseFloat(cantidadInput.value) || 0
    const valorUnitario = Number.parseFloat(valorUnitarioInput.value) || 0
    const total = cantidad * valorUnitario

    valorTotalCalculado.textContent = `$${total.toFixed(2)}`
    valorTotalHidden.value = total.toFixed(2)
  }

  cantidadInput.addEventListener("input", calcularValorTotal)
  valorUnitarioInput.addEventListener("input", calcularValorTotal)
}

// Función principal para guardar asociación
async function guardarAsociacion(event) {
  event.preventDefault()

  // Validaciones
  if (sensoresSeleccionados.length === 0) {
    mostrarNotificacion("Debe seleccionar al menos un sensor", "error")
    return
  }

  if (insumosSeleccionados.length === 0) {
    mostrarNotificacion("Debe seleccionar al menos un insumo", "error")
    return
  }

  // Validar que los elementos seleccionados estén activos (responsable, cultivo, ciclo, sensores, insumos)
  // Responsable (si existe en los datos)
  const responsableValue = responsableSelect ? responsableSelect.value : ''
  if (responsableValue) {
    const responsableObj = responsablesData.find((r) => (r.name === responsableValue || r.nombre === responsableValue || r.fullname === responsableValue))
    if (responsableObj) {
      const rState = String(responsableObj.state || responsableObj.estado || '').toLowerCase()
      if (rState && rState !== 'activo') {
        mostrarNotificacion('El responsable seleccionado está inactivo. No se puede guardar la asociación.', 'error')
        return
      }
    }
  }

  // Cultivo
  if (cultivoSelect && cultivoSelect.value) {
    const cultivoObj = cultivosData.find((c) => c.cultivoName === cultivoSelect.value)
    if (cultivoObj) {
      const cState = String(cultivoObj.state || cultivoObj.estado || '').toLowerCase()
      if (cState && cState !== 'activo') {
        mostrarNotificacion('El cultivo seleccionado está inactivo. No se puede guardar la asociación.', 'error')
        return
      }
    }
  }

  // Ciclo de cultivo
  if (cicloSelect && cicloSelect.value) {
    const cicloObj = ciclosData.find((c) => c.cicloName === cicloSelect.value)
    if (cicloObj) {
      const cicloState = String(cicloObj.state || cicloObj.estado || '').toLowerCase()
      if (cicloState && cicloState !== 'activo') {
        mostrarNotificacion('El ciclo de cultivo seleccionado está inactivo. No se puede guardar la asociación.', 'error')
        return
      }
    }
  }

  // Sensores: verificar que ninguno de los sensores seleccionados esté inactivo
  if (Array.isArray(sensoresSeleccionados) && sensoresSeleccionados.length) {
    const sensoresInactivos = sensoresSeleccionados.filter((nombre) => {
      const s = sensoresData.find((sd) => sd.nombreSensor === nombre || sd.nombre === nombre)
      const sState = s ? String(s.estado || s.state || '').toLowerCase() : ''
      return s && sState && sState !== 'activo'
    })
    if (sensoresInactivos.length) {
      mostrarNotificacion(`Los siguientes sensores están inactivos: ${sensoresInactivos.join(', ')}. No se puede guardar la asociación.`, 'error')
      return
    }
  }

  // Insumos: verificar que ninguno de los insumos seleccionados esté inactivo
  if (Array.isArray(insumosSeleccionados) && insumosSeleccionados.length) {
    const insumosInactivos = insumosSeleccionados.filter((i) => {
      const st = String(i.estado || i.state || '').toLowerCase()
      return st && st !== 'activo'
    }).map((i) => i.nombreInsumo || i.nombre || i.nombreInsumo)

    if (insumosInactivos.length) {
      mostrarNotificacion(`Los siguientes insumos están inactivos: ${insumosInactivos.join(', ')}. No se puede guardar la asociación.`, 'error')
      return
    }
  }

  // Validar cantidades de insumos
  for (const insumo of insumosSeleccionados) {
    if (!insumo.cantidadUtilizar || insumo.cantidadUtilizar <= 0) {
      mostrarNotificacion(`Debe ingresar una cantidad válida para ${insumo.nombreInsumo}`, "error")
      return
    }

    if (insumo.cantidadUtilizar > insumo.cantidad) {
      mostrarNotificacion(`La cantidad de ${insumo.nombreInsumo} no puede ser mayor a la disponible`, "error")
      return
    }
  }

  // Preparar datos
  const data = {
    responsable: responsableSelect.value,
    nombre_asociacion: nombre_asociacion.value,
    inversion: inversion.value,
    meta: meta.value,
    iniico_produccion: iniico_produccion.value,
    fin_produccion: fin_produccion.value,
    cultivo: cultivoSelect.value,
    sensores: sensoresSeleccionados.join(", "),
    insumos: insumosSeleccionados.map((i) => i.nombreInsumo).join(", "),
    ciclo_cultivo: cicloSelect.value,
    insumos_detalle: insumosSeleccionados.map((i) => ({
      id: i.idInsumo,
      nombre: i.nombreInsumo,
      cantidad: i.cantidadUtilizar,
    })),
  }

  try {
    let response
    let method
    let url = `${API_URL}/asociaciones`

    if (asociacionId.value) {
      url += `/${asociacionId.value}`
      method = "PUT"
    } else {
      method = "POST"
    }

    response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      if (errorData.errores) {
        throw new Error(errorData.errores.join(", "))
      } else if (errorData.error) {
        throw new Error(errorData.error)
      } else {
        throw new Error("Error al guardar la asociación")
      }
    }

    await cargarDatos()
    cerrarModal(modalAsociacion)
    mostrarNotificacion("Asociación guardada exitosamente", "success")
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion(error.message || "Error al guardar la asociación", "error")
  }
}

// Funciones de utilidad
function verDetallesAsociacion(id) {
  const asociacion = asociacionesData.find((a) => a.id == id)
  if (!asociacion) return

  const cultivoInfo = cultivosData.find((c) => c.cultivoName === asociacion.cultivo) || {}
  const cicloInfo = ciclosData.find((c) => c.cicloName === asociacion.ciclo_cultivo) || {}

  const sensoresArray = asociacion.sensores ? asociacion.sensores.split(",").map((s) => s.trim()) : []
  const sensoresInfo = sensoresArray.map((sensorNombre) => {
    const sensor = sensoresData.find((s) => s.nombreSensor === sensorNombre) || {}
    return {
      nombre: sensorNombre,
      tipo: sensor.tipoSensor || "No disponible",
      unidad: sensor.unidadMedida || "No disponible",
    }
  })

  const insumosArray = asociacion.insumos ? asociacion.insumos.split(",").map((s) => s.trim()) : []
  const insumosInfo = insumosArray.map((insumoNombre) => {
    const insumo = insumosData.find((i) => i.nombreInsumo === insumoNombre) || {}
    return {
      nombre: insumoNombre,
      tipo: insumo.tipoInsumo || "No disponible",
      unidad: insumo.unidadMedida || "No disponible",
      valorUnitario: insumo.valorUnitario || 0,
    }
  })

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
                            <span class="detalles__value">$${Number.parseFloat(asociacion.inversion).toFixed(2)}</span>
                        </div>
                        <div class="detalles__item">
                            <span class="detalles__label">Meta</span>
                            <span class="detalles__value">$${Number.parseFloat(asociacion.meta).toFixed(2)}</span>
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
                            <span class="detalles__value">${cultivoInfo.cultivoType || "No disponible"}</span>
                        </div>
                    </div>
                    <div class="detalles__row">
                        <div class="detalles__item">
                            <span class="detalles__label">Tamaño</span>
                            <span class="detalles__value">${cultivoInfo.size || "No disponible"}</span>
                        </div>
                        <div class="detalles__item">
                            <span class="detalles__label">Ubicación</span>
                            <span class="detalles__value">${cultivoInfo.location || "No disponible"}</span>
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
                        ${sensoresInfo
                          .map(
                            (sensor) => `
                            <li class="detalles__list-item">
                                <i class="fa-solid fa-microchip"></i>
                                <span>${sensor.nombre} (${sensor.tipo}, ${sensor.unidad})</span>
                            </li>
                        `,
                          )
                          .join("")}
                    </ul>
                </div>
            </div>
            
            <div class="detalles__section">
                <div class="detalles__header">
                    <h3 class="detalles__title">Insumos</h3>
                </div>
                <div class="detalles__content">
                    <ul class="detalles__list">
                        ${insumosInfo
                          .map(
                            (insumo) => `
                            <li class="detalles__list-item">
                                <i class="fa-solid fa-box"></i>
                                <span>${insumo.nombre} (${insumo.tipo}, ${insumo.unidad}) - $${Number.parseFloat(insumo.valorUnitario).toFixed(2)}</span>
                            </li>
                        `,
                          )
                          .join("")}
                    </ul>
                </div>
            </div>
        </div>
    `

  document.getElementById("detallesAsociacionContent").innerHTML = detallesHTML
  abrirModal(modalDetalles)
}

function editarAsociacion(id) {
  const asociacion = asociacionesData.find((a) => a.id == id)
  if (!asociacion) return

  // Llenar el formulario con los datos de la asociación
  asociacionId.value = asociacion.id
  responsableSelect.value = asociacion.responsable
  nombre_asociacion.value = asociacion.nombre_asociacion
  inversion.value = asociacion.inversion
  meta.value = asociacion.meta
  iniico_produccion.value = formatearFechaInput(asociacion.iniico_produccion)
  fin_produccion.value = formatearFechaInput(asociacion.fin_produccion)
  cultivoSelect.value = asociacion.cultivo
  cicloSelect.value = asociacion.ciclo_cultivo

  // Seleccionar los sensores
  sensoresSeleccionados = asociacion.sensores ? asociacion.sensores.split(",").map((s) => s.trim()) : []
  actualizarSensoresCheckbox()

  // Seleccionar los insumos
  if (asociacion.insumos) {
    const insumosArray = asociacion.insumos.split(",").map((s) => s.trim())
    insumosSeleccionados = insumosData
      .filter((i) => insumosArray.includes(i.nombreInsumo))
      .map((i) => ({ ...i, cantidadUtilizar: i.cantidadUtilizar || 1 }))
  } else {
    insumosSeleccionados = []
  }

  actualizarInsumosCheckbox()
  actualizarDetallesInsumos()

  document.getElementById("modalAsociacionTitle").textContent = "Editar Asociación"
  abrirModal(modalAsociacion)
}

function confirmarEliminarAsociacion(id) {
  asociacionSeleccionada = id
  abrirModal(modalConfirmacion)
}

async function eliminarAsociacion() {
  if (!asociacionSeleccionada) return

  try {
    const response = await fetch(`${API_URL}/asociaciones/${asociacionSeleccionada}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Error al eliminar la asociación")

    await cargarDatos()
    cerrarModal(modalConfirmacion)
    mostrarNotificacion("Asociación eliminada exitosamente", "success")
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion("Error al eliminar la asociación", "error")
  }
}

// Eliminación directa desde la lista: confirma y ejecuta DELETE
async function eliminarAsociacionDirect(id) {
  if (!id) return
  const ok = confirm('¿Confirma que desea eliminar la asociación con ID ' + id + '? Esta operación no se puede deshacer.')
  if (!ok) return

  try {
    const response = await fetch(`${API_URL}/asociaciones/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      throw new Error(errText || 'Error al eliminar la asociación')
    }

    await cargarDatos()
    mostrarNotificacion('Asociación eliminada exitosamente', 'success')
  } catch (err) {
    console.error('eliminarAsociacionDirect error:', err)
    mostrarNotificacion(err.message || 'Error al eliminar la asociación', 'error')
  }
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return "No disponible"

  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString()
}

function formatearFechaInput(fechaStr) {
  if (!fechaStr) return ""

  const fecha = new Date(fechaStr)
  return fecha.toISOString().split("T")[0]
}

function mostrarNotificacion(mensaje, tipo) {
  const notificacion = document.createElement("div")
  notificacion.className = `notificacion notificacion--${tipo}`
  notificacion.innerHTML = `
        <div class="notificacion__content">
            <i class="notificacion__icon fa-solid ${tipo === "success" ? "fa-check-circle" : tipo === "warning" ? "fa-exclamation-triangle" : "fa-times-circle"}"></i>
            <span class="notificacion__message">${mensaje}</span>
        </div>
    `

  document.body.appendChild(notificacion)

  setTimeout(() => {
    notificacion.classList.add("notificacion--visible")
  }, 10)

  setTimeout(() => {
    notificacion.classList.remove("notificacion--visible")
    setTimeout(() => {
      document.body.removeChild(notificacion)
    }, 300)
  }, 3000)
}

// Funciones de exportación
function exportarExcel() {
  const data = asociacionesData.map((a) => ({
    ID: a.id,
    Responsable: a.responsable,
    "Nombre Asociación": a.nombre_asociacion,
    Inversión: Number.parseFloat(a.inversion),
    Meta: Number.parseFloat(a.meta),
    "Inicio Producción": formatearFecha(a.iniico_produccion),
    "Fin Producción": formatearFecha(a.fin_produccion),
    Cultivo: a.cultivo,
    Sensores: a.sensores,
    Insumos: a.insumos,
    "Ciclo Cultivo": a.ciclo_cultivo,
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Asociaciones")

  const columnas = [
    { wch: 5 },
    { wch: 15 },
    { wch: 20 },
    { wch: 10 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
  ]
  worksheet["!cols"] = columnas

  XLSX.writeFile(workbook, "Asociaciones.xlsx")
}

function exportarPDF() {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text("Reporte de Asociaciones", 14, 22)

  doc.setFontSize(11)
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30)

  const tableColumn = ["ID", "Responsable", "Asociación", "Inversión", "Meta", "Cultivo"]
  const tableRows = []

  asociacionesData.forEach((a) => {
    const rowData = [
      a.id,
      a.responsable,
      a.nombre_asociacion,
      `$${Number.parseFloat(a.inversion).toFixed(2)}`,
      `$${Number.parseFloat(a.meta).toFixed(2)}`,
      a.cultivo,
    ]
    tableRows.push(rowData)
  })

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [57, 169, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  })

  const finalY = doc.lastAutoTable.finalY + 10

  doc.setFontSize(14)
  doc.text("Estadísticas", 14, finalY)

  doc.setFontSize(11)
  doc.text(`Total de Asociaciones: ${asociacionesData.length}`, 14, finalY + 8)

  const inversionTotal = asociacionesData.reduce((total, a) => total + Number.parseFloat(a.inversion), 0)
  doc.text(`Inversión Total: $${inversionTotal.toFixed(2)}`, 14, finalY + 16)

  const metaTotal = asociacionesData.reduce((total, a) => total + Number.parseFloat(a.meta), 0)
  doc.text(`Meta Total: $${metaTotal.toFixed(2)}`, 14, finalY + 24)

  doc.save("Asociaciones.pdf")
}

// Inicializar event listeners
function inicializarEventListeners() {
  // Botones principales
  btnCrearAsociacion.addEventListener("click", abrirModalCrearAsociacion)
  btnExportarExcel.addEventListener("click", exportarExcel)
  btnExportarPDF.addEventListener("click", exportarPDF)

  // Botones para abrir modales secundarios (comprobar existencia antes de usar)
  if (btnNuevoResponsable) {
    btnNuevoResponsable.addEventListener("click", () => {
      if (formResponsable) formResponsable.reset()
      abrirModal(modalResponsable)
    })
  }

  if (btnNuevoSensor) {
    btnNuevoSensor.addEventListener("click", () => {
      // Redirigir a la página de crear sensor en lugar de abrir un modal
      if (formSensor) formSensor.reset()
      window.location.href = '/fronted/public/views/sensores/crear_sensor.html'
    })
  }

  if (btnNuevoCultivo) {
    btnNuevoCultivo.addEventListener("click", () => {
      // Redirigir a la página de crear cultivo
      if (formCultivo) formCultivo.reset()
      window.location.href = '/fronted/public/views/cultivo/crear_cultivo.html'
    })
  }

  if (btnNuevoCiclo) {
    btnNuevoCiclo.addEventListener("click", () => {
      // Redirigir a la página de crear ciclo de cultivo
      if (formCiclo) formCiclo.reset()
      window.location.href = '/fronted/public/views/ciclo_cultivo/crear_ciclo_cultivo.html'
    })
  }

  if (btnNuevoInsumo) {
    btnNuevoInsumo.addEventListener("click", () => {
      // Redirigir a la página de crear insumo (archivo con nombre actual en el repo: crear_inusomo.html)
      if (formInsumo) formInsumo.reset()
      const v = document.getElementById("valorTotalCalculado")
      if (v) v.textContent = "$0.00"
      window.location.href = '/fronted/public/views/insumos/crear_inusomo.html'
    })
  }

  // Cerrar modales (agregar listeners sólo si los elementos existen)
  const btnCloseDetalles = document.getElementById("closeModalDetalles")
  if (btnCloseDetalles) btnCloseDetalles.addEventListener("click", () => cerrarModal('modalDetalles'))

  const btnCloseAsociacion = document.getElementById("closeModalAsociacion")
  if (btnCloseAsociacion) btnCloseAsociacion.addEventListener("click", () => cerrarModal(modalAsociacion || 'modalAsociacion'))

  const btnCloseResponsable = document.getElementById("closeModalResponsable")
  if (btnCloseResponsable) btnCloseResponsable.addEventListener("click", () => cerrarModal(modalResponsable || 'modalResponsable'))

  const btnCloseSensor = document.getElementById("closeModalSensor")
  if (btnCloseSensor) btnCloseSensor.addEventListener("click", () => cerrarModal(modalSensor || 'modalSensor'))

  const btnCloseCultivo = document.getElementById("closeModalCultivo")
  if (btnCloseCultivo) btnCloseCultivo.addEventListener("click", () => cerrarModal(modalCultivo || 'modalCultivo'))

  const btnCloseCiclo = document.getElementById("closeModalCiclo")
  if (btnCloseCiclo) btnCloseCiclo.addEventListener("click", () => cerrarModal(modalCiclo || 'modalCiclo'))

  const btnCloseInsumo = document.getElementById("closeModalInsumo")
  if (btnCloseInsumo) btnCloseInsumo.addEventListener("click", () => cerrarModal(modalInsumo || 'modalInsumo'))

  const btnCloseConfirmacion = document.getElementById("closeModalConfirmacion")
  if (btnCloseConfirmacion) btnCloseConfirmacion.addEventListener("click", () => cerrarModal(modalConfirmacion || 'modalConfirmacion'))

  // Botones de cancelar (hacemos limpieza adicional en el caso del modal de asociación)
  const btnCancelarAsoc = document.getElementById("btnCancelarAsociacion")
  if (btnCancelarAsoc) btnCancelarAsoc.addEventListener("click", () => {
    cerrarModal(modalAsociacion || 'modalAsociacion')
    if (typeof limpiarFormularioAsociacion === 'function') limpiarFormularioAsociacion()
  })

  const btnCancelarResponsable = document.getElementById("btnCancelarResponsable")
  if (btnCancelarResponsable) btnCancelarResponsable.addEventListener("click", () => cerrarModal(modalResponsable || 'modalResponsable'))

  const btnCancelarSensor = document.getElementById("btnCancelarSensor")
  if (btnCancelarSensor) btnCancelarSensor.addEventListener("click", () => cerrarModal(modalSensor || 'modalSensor'))

  const btnCancelarCultivo = document.getElementById("btnCancelarCultivo")
  if (btnCancelarCultivo) btnCancelarCultivo.addEventListener("click", () => cerrarModal(modalCultivo || 'modalCultivo'))

  const btnCancelarCiclo = document.getElementById("btnCancelarCiclo")
  if (btnCancelarCiclo) btnCancelarCiclo.addEventListener("click", () => cerrarModal(modalCiclo || 'modalCiclo'))

  const btnCancelarInsumo = document.getElementById("btnCancelarInsumo")
  if (btnCancelarInsumo) btnCancelarInsumo.addEventListener("click", () => cerrarModal(modalInsumo || 'modalInsumo'))

  const btnCancelarEliminar = document.getElementById("btnCancelarEliminar")
  if (btnCancelarEliminar) btnCancelarEliminar.addEventListener("click", () => cerrarModal(modalConfirmacion || 'modalConfirmacion'))
  /* Lines 1308-1332 omitted */

  // Botones de confirmación (agregar solo si existe el elemento)
  const btnConfirmarEliminarElem = document.getElementById("btnConfirmarEliminar")
  if (btnConfirmarEliminarElem) btnConfirmarEliminarElem.addEventListener("click", eliminarAsociacion)

  // Formularios (registrar handlers solo si existen)
  if (formAsociacion) formAsociacion.addEventListener("submit", guardarAsociacion)
  if (formResponsable) formResponsable.addEventListener("submit", crearResponsable)
  if (formSensor) formSensor.addEventListener("submit", crearSensor)
  if (formCultivo) formCultivo.addEventListener("submit", crearCultivo)
  if (formCiclo) formCiclo.addEventListener("submit", crearCiclo)
  if (formInsumo) formInsumo.addEventListener("submit", crearInsumo)

  // Búsqueda
  searchInput.addEventListener("input", function () {
    renderizarTablaAsociaciones(this.value)
  })

  // Cerrar modales al hacer clic fuera
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      cerrarModal(event.target)
    }
  })
}
