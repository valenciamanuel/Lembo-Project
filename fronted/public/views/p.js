// script.js

const asociaciones = [];
let edicionIndex = null;

function abrirModal(tipo) {
  document.getElementById(`modal-${tipo}`).style.display = 'flex';
}

function cerrarModal(tipo) {
  document.getElementById(`modal-${tipo}`).style.display = 'none';
  if (tipo === 'crear') document.getElementById('resultado-crear').textContent = '';
  if (tipo === 'editar') document.getElementById('resultado-editar').textContent = '';
}

function crearItem(tipo) {
  alert(`Aquí iría la lógica para crear un nuevo ${tipo}`);
}

function crearCheckboxes(data, containerId) {
  const contenedor = document.getElementById(containerId);
  contenedor.innerHTML = '';
  data.forEach((item, index) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = item;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(item));
    contenedor.appendChild(label);
  });
}

function obtenerSeleccionados(containerId) {
  const seleccionados = [];
  const checkboxes = document.getElementById(containerId).querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(chk => { if (chk.checked) seleccionados.push(chk.value); });
  return seleccionados;
}

function crearAsociacion(e) {
  e.preventDefault();
  const sensores = obtenerSeleccionados('checkbox-sensores');
  const insumos = obtenerSeleccionados('checkbox-insumos');
  const ciclos = obtenerSeleccionados('checkbox-ciclos');
  const usuarios = obtenerSeleccionados('checkbox-usuarios');
  const nueva = { sensores, insumos, ciclos, usuarios };
  asociaciones.push(nueva);
  document.getElementById('resultado-crear').textContent = 'Asociación creada con éxito ✅';
  cerrarModal('crear');
  mostrarAsociaciones();
}

function mostrarAsociaciones() {
  const lista = document.getElementById('lista-asociaciones');
  lista.innerHTML = '';
  asociaciones.forEach((aso, i) => {
    const div = document.createElement('div');
    div.className = 'asociacion__item';
    div.innerHTML = `
      <strong>Asociación ${i + 1}</strong><br>
      <button onclick="verAsociacion(${i})" class="acciones__btn">Ver</button>
      <button onclick="editarAsociacion(${i})" class="acciones__btn">Editar</button>
    `;
    lista.appendChild(div);
  });
}

function verAsociacion(index) {
  const aso = asociaciones[index];
  const ver = document.getElementById('ver-detalles');
  ver.innerHTML = `
    <p><strong>Sensores:</strong> ${aso.sensores.join(', ')}</p>
    <p><strong>Insumos:</strong> ${aso.insumos.join(', ')}</p>
    <p><strong>Ciclos:</strong> ${aso.ciclos.join(', ')}</p>
    <p><strong>Usuarios:</strong> ${aso.usuarios.join(', ')}</p>
  `;
  abrirModal('ver');
}

function editarAsociacion(index) {
  edicionIndex = index;
  const aso = asociaciones[index];
  marcarCheckboxes('editar-sensores', aso.sensores);
  marcarCheckboxes('editar-insumos', aso.insumos);
  marcarCheckboxes('editar-ciclos', aso.ciclos);
  marcarCheckboxes('editar-usuarios', aso.usuarios);
  abrirModal('editar');
}

function marcarCheckboxes(containerId, seleccionados) {
  const checkboxes = document.getElementById(containerId).querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(chk => {
    chk.checked = seleccionados.includes(chk.value);
  });
}

function guardarEdicion(e) {
  e.preventDefault();
  if (edicionIndex === null) return;
  asociaciones[edicionIndex] = {
    sensores: obtenerSeleccionados('editar-sensores'),
    insumos: obtenerSeleccionados('editar-insumos'),
    ciclos: obtenerSeleccionados('editar-ciclos'),
    usuarios: obtenerSeleccionados('editar-usuarios')
  };
  document.getElementById('resultado-editar').textContent = 'Asociación editada con éxito ✅';
  cerrarModal('editar');
  mostrarAsociaciones();
}

// Datos demo
const sensores = ['Sensor A', 'Sensor B', 'Sensor C'];
const insumos = ['Insumo X', 'Insumo Y'];
const ciclos = ['Ciclo 1', 'Ciclo 2'];
const usuarios = ['Usuario 1', 'Usuario 2', 'Usuario 3'];

document.addEventListener('DOMContentLoaded', () => {
  crearCheckboxes(sensores, 'checkbox-sensores');
  crearCheckboxes(insumos, 'checkbox-insumos');
  crearCheckboxes(ciclos, 'checkbox-ciclos');
  crearCheckboxes(usuarios, 'checkbox-usuarios');

  crearCheckboxes(sensores, 'editar-sensores');
  crearCheckboxes(insumos, 'editar-insumos');
  crearCheckboxes(ciclos, 'editar-ciclos');
  crearCheckboxes(usuarios, 'editar-usuarios');

  mostrarAsociaciones();
});
