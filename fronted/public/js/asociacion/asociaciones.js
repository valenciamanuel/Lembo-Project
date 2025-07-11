

// Variables globales
const API_URL = "http://localhost:3000/api"
let asociacionesData = []
let cultivosData = []
let ciclosData = []
let sensoresData = []
let insumosData = []
const asociacionSeleccionada = null
let sensoresSeleccionados = []
let insumosSeleccionados = [] // Cambiado de insumoSeleccionado a array

// Elementos DOM
const asociacionesTableBody = document.getElementById("asociacionesTableBody")
const totalAsociacionesElement = document.getElementById("totalAsociaciones")
const inversionTotalElement = document.getElementById("inversionTotal")
const metaTotalElement = document.getElementById("metaTotal")
const searchInput = document.getElementById("searchInput")

// Modales
const modalDetalles = document.getElementById("modalDetalles")
const modalAsociacion = document.getElementById("modalAsociacion")
const modalInsumo = document.getElementById("modalInsumo")

// Botones
const btnCrearAsociacion = document.getElementById("btnCrearAsociacion")
const btnNuevoInsumo = document.getElementById("btnNuevoInsumo")
const btnCancelarAsociacion = document.getElementById("btnCancelarAsociacion")
const btnCancelarInsumo = document.getElementById("btnCancelarInsumo")

// Formularios
const formAsociacion = document.getElementById("formAsociacion")
const formInsumo = document.getElementById("formInsumo")

// Selectores y contenedores
const cultivoSelect = document.getElementById("cultivo")
const cicloSelect = document.getElementById("ciclo_cultivo")
const sensoresContainer = document.getElementById("sensoresContainer")
const insumosContainer = document.getElementById("insumosContainer")
const insumosDetallesContainer = document.getElementById("insumosDetallesContainer")
const insumosDetallesContent = document.getElementById("insumosDetallesContent")

// Campos de asociación
const asociacionId = document.getElementById("asociacionId")
const responsable = document.getElementById("responsable")
const nombre_asociacion = document.getElementById("nombre_asociacion")
const inversion = document.getElementById("inversion")
const meta = document.getElementById("meta")
const iniico_produccion = document.getElementById("iniico_produccion")
const fin_produccion = document.getElementById("fin_produccion")
const responsableSelect = document.getElementById("responsable")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  cargarDatos()
  inicializarEventListeners()
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
      cargarResponsables(), // Added to load responsables data
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
    const response = await fetch(`${API_URL}/ciclocultivo`)
    if (!response.ok) throw new Error("Error al cargar ciclos de cultivo")

    ciclosData = await response.json()
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

async function cargarResponsables() {
  try {
    const response = await fetch(`${API_URL}/responsables`)
    if (!response.ok) throw new Error("Error al cargar responsables")

    const responsablesData = await response.json()
    actualizarSelectResponsables(responsablesData)
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion("Error al cargar responsables", "error")
  }
}

function actualizarSelectResponsables(responsables) {
  responsableSelect.innerHTML = '<option value="">Seleccionar responsable</option>'
  responsables.forEach((responsable) => {
    const option = document.createElement("option")
    option.value = responsable.name
    option.textContent = responsable.name
    responsableSelect.appendChild(option)
  })
}

async function cargarInsumos() {
  try {
    const response = await fetch(`${API_URL}/insumo`)
    if (!response.ok) throw new Error("Error al cargar insumos")

    insumosData = await response.json()
    actualizarInsumosCheckbox()
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion("Error al cargar insumos", "error")
  }
}

// Nueva función para actualizar checkboxes de insumos
function actualizarInsumosCheckbox() {
  insumosContainer.innerHTML = ""

  const insumosActivos = insumosData.filter((i) => i.estado === "activo")

  insumosActivos.forEach((insumo) => {
    const insumoDiv = document.createElement("div")
    insumoDiv.className = "insumo-checkbox"

    const isChecked = insumosSeleccionados.some((i) => i.idInsumo === insumo.idInsumo)

    insumoDiv.innerHTML = `
            <input type="checkbox" id="insumo-${insumo.idInsumo}" value="${insumo.idInsumo}" 
                ${isChecked ? "checked" : ""} ${insumosSeleccionados.length >= 3 && !isChecked ? "disabled" : ""}>
            <label class="insumo-checkbox__label" for="insumo-${insumo.idInsumo}">
                ${insumo.nombreInsumo} (${insumo.tipoInsumo})
            </label>
        `

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
            cantidadUtilizar: 1, // Cantidad por defecto
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

// Nueva función para actualizar detalles de insumos seleccionados
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

// Nueva función para remover insumo
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

// Nueva función para calcular inversión total
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
    row.innerHTML = `
            <td>${asociacion.id}</td>
            <td>${asociacion.responsable}</td>
            <td>${asociacion.nombre_asociacion}</td>
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
    asociacionesTableBody.appendChild(row)
  })

  // Agregar event listeners a los botones
  document.querySelectorAll(".btn-ver").forEach((btn) => {
    btn.addEventListener("click", () => verDetallesAsociacion(btn.dataset.id))
  })

  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => editarAsociacion(btn.dataset.id))
  })

  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", () => confirmarEliminarAsociacion(btn.dataset.id))
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

  const ciclosActivos = ciclosData.filter((c) => c.state === "activo")

  ciclosActivos.forEach((ciclo) => {
    const option = document.createElement("option")
    option.value = ciclo.cicloName
    option.textContent = ciclo.cicloName
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

function actualizarEstadisticas() {
  // Total de asociaciones
  totalAsociacionesElement.textContent = asociacionesData.length

  // Inversión total
  const inversionTotal = asociacionesData.reduce((total, asociacion) => {
    return total + Number.parseFloat(asociacion.inversion)
  }, 0)
  inversionTotalElement.textContent = `$${inversionTotal.toFixed(2)}`

  // Meta total
  const metaTotal = asociacionesData.reduce((total, asociacion) => {
    return total + Number.parseFloat(asociacion.meta)
  }, 0)
  metaTotalElement.textContent = `$${metaTotal.toFixed(2)}`
}

// Funciones de gráficos
function inicializarGraficos() {
  renderizarGraficoInversionMeta()
}

function renderizarGraficoInversionMeta() {
  const ctx = document.getElementById("inversionMetaChart").getContext("2d")

  const asociacionesRecientes = [...asociacionesData]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)
    .reverse()

  const labels = asociacionesRecientes.map((a) => a.nombre_asociacion)
  const inversionData = asociacionesRecientes.map((a) => Number.parseFloat(a.inversion))
  const metaData = asociacionesRecientes.map((a) => Number.parseFloat(a.meta))

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
  modal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function cerrarModal(modal) {
  modal.classList.remove("active")
  document.body.style.overflow = ""
}

function abrirModalCrearAsociacion() {
  limpiarFormularioAsociacion()
  document.getElementById("modalAsociacionTitle").textContent = "Nueva Asociación"
  cargarResponsables()
  abrirModal(modalAsociacion)
}

function verDetallesAsociacion(id) {
  const asociacion = asociacionesData.find((a) => a.id == id)
  if (!asociacion) return

  const cultivoInfo = cultivosData.find((c) => c.cultivoName === asociacion.cultivo) || {}
  const cicloInfo = ciclosData.find((c) => c.cicloName === asociacion.ciclo_cultivo) || {}

  // Convertir string de sensores a array
  const sensoresArray = asociacion.sensores ? asociacion.sensores.split(",").map((s) => s.trim()) : []

  // Obtener información de los sensores
  const sensoresInfo = sensoresArray.map((sensorNombre) => {
    const sensor = sensoresData.find((s) => s.nombreSensor === sensorNombre) || {}
    return {
      nombre: sensorNombre,
      tipo: sensor.tipoSensor || "No disponible",
      unidad: sensor.unidadMedida || "No disponible",
    }
  })

  // Convertir string de insumos a array (puede ser múltiples insumos separados por coma)
  const insumosArray = asociacion.insumos ? asociacion.insumos.split(",").map((s) => s.trim()) : []

  // Obtener información de los insumos
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
    const insumosNombres = asociacion.insumos.split(",").map((s) => s.trim())
    insumosSeleccionados = []

    insumosNombres.forEach((nombreInsumo) => {
      const insumo = insumosData.find((i) => i.nombreInsumo === nombreInsumo)
      if (insumo) {
        insumosSeleccionados.push({
          ...insumo,
          cantidadUtilizar: 1, // Valor por defecto, se puede ajustar
        })
      }
    })
  } else {
    insumosSeleccionados = []
  }

  actualizarInsumosCheckbox()
  actualizarDetallesInsumos()

  cargarResponsables()
  setTimeout(() => {
    responsableSelect.value = asociacion.responsable
  }, 100)

  document.getElementById("modalAsociacionTitle").textContent = "Editar Asociación"
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

// Función para guardar asociación actualizada
async function guardarAsociacion(event) {
  event.preventDefault()

  // Validar que se haya seleccionado al menos un sensor
  if (sensoresSeleccionados.length === 0) {
    mostrarNotificacion("Debe seleccionar al menos un sensor", "error")
    return
  }

  // Validar que se haya seleccionado al menos un insumo
  if (insumosSeleccionados.length === 0) {
    mostrarNotificacion("Debe seleccionar al menos un insumo", "error")
    return
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
    responsable: responsable.value,
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
      // Actualizar
      url += `/${asociacionId.value}`
      method = "PUT"
    } else {
      // Crear
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
  // Crear elemento de notificación
  const notificacion = document.createElement("div")
  notificacion.className = `notificacion notificacion--${tipo}`
  notificacion.innerHTML = `
        <div class="notificacion__content">
            <i class="notificacion__icon fa-solid ${tipo === "success" ? "fa-check-circle" : tipo === "warning" ? "fa-exclamation-triangle" : "fa-times-circle"}"></i>
            <span class="notificacion__message">${mensaje}</span>
        </div>
    `

  // Agregar al DOM
  document.body.appendChild(notificacion)

  // Mostrar notificación
  setTimeout(() => {
    notificacion.classList.add("notificacion--visible")
  }, 10)

  // Ocultar y eliminar después de 3 segundos
  setTimeout(() => {
    notificacion.classList.remove("notificacion--visible")
    setTimeout(() => {
      document.body.removeChild(notificacion)
    }, 300)
  }, 3000)
}

// Funciones de confirmación de eliminación
function confirmarEliminarAsociacion(id) {
  const asociacion = asociacionesData.find((a) => a.id == id)
  if (!asociacion) return

  const confirmacion = confirm(`¿Está seguro de que desea eliminar la asociación "${asociacion.nombre_asociacion}"?`)
  if (confirmacion) {
    eliminarAsociacion(id)
  }
}

async function eliminarAsociacion(id) {
  try {
    const response = await fetch(`${API_URL}/asociaciones/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error al eliminar la asociación")
    }

    await cargarDatos()
    mostrarNotificacion("Asociación eliminada exitosamente", "success")
  } catch (error) {
    console.error("Error:", error)
    mostrarNotificacion(error.message || "Error al eliminar la asociación", "error")
  }
}

// Inicializar event listeners
function inicializarEventListeners() {
  // Botones principales
  btnCrearAsociacion.addEventListener("click", abrirModalCrearAsociacion)

  // Cerrar modales
  document.getElementById("closeModalDetalles").addEventListener("click", () => cerrarModal(modalDetalles))
  document.getElementById("closeModalAsociacion").addEventListener("click", () => cerrarModal(modalAsociacion))
  document.getElementById("closeModalInsumo").addEventListener("click", () => cerrarModal(modalInsumo))

  // Botones de cancelar
  btnCancelarAsociacion.addEventListener("click", () => cerrarModal(modalAsociacion))
  btnCancelarInsumo.addEventListener("click", () => cerrarModal(modalInsumo))

  // Botones para abrir modales secundarios
  btnNuevoInsumo.addEventListener("click", () => {
    formInsumo.reset()
    abrirModal(modalInsumo)
  })

  // Formularios
  formAsociacion.addEventListener("submit", guardarAsociacion)

  // Búsqueda
  searchInput.addEventListener("input", function () {
    renderizarTablaAsociaciones(this.value)
  })
}

// Estilos adicionales para los nuevos elementos
const estilosAdicionales = document.createElement("style")
estilosAdicionales.textContent = `
    .form__insumos {
        display: grid;
        gap: 10px;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
    }
    
    .insumo-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-radius: 6px;
        transition: background-color 0.2s;
    }
    
    .insumo-checkbox:hover {
        background-color: #f9fafb;
    }
    
    .insumo-checkbox__label {
        cursor: pointer;
        font-size: 0.875rem;
        color: #374151;
    }
    
    .insumos-detalles {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
    }
    
    .insumos-detalles__header {
        background-color: #f9fafb;
        padding: 12px 16px;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .insumos-detalles__title {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: #374151;
    }
    
    .insumos-detalles__content {
        padding: 16px;
    }
    
    .insumo-detalle {
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        margin-bottom: 16px;
        overflow: hidden;
    }
    
    .insumo-detalle:last-child {
        margin-bottom: 0;
    }
    
    .insumo-detalle__header {
        background-color: #f3f4f6;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .insumo-detalle__title {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
    }
    
    .insumo-detalle__content {
        padding: 12px;
    }
    
    .notificacion {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
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
        color: #059669;
    }
    
    .notificacion--warning .notificacion__icon {
        color: #d97706;
    }
    
    .notificacion--error .notificacion__icon {
        color: #dc2626;
    }
    
    .notificacion__message {
        font-size: 0.875rem;
        font-weight: 500;
    }
`
document.head.appendChild(estilosAdicionales)
