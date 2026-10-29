// Clase que representa a un Estudiante
class Estudiante {
  constructor(nombre, curso, nota) {
    this.id = Date.now();
    this.nombre = nombre;
    this.curso = curso;
    this.nota = Number(nota);
  }

  obtenerEstado() {
    return this.nota >= 11 ? "Aprobado" : "Desaprobado";
  }

  obtenerFormatoLista() {
    return `${this.nombre} - ${this.curso}: ${this.nota.toFixed(2)}`;
  }
}

// Selección de elementos del DOM
const formEstudiante = document.querySelector("#formEstudiante");
const inputNombre = document.querySelector("#nombre");
const inputCurso = document.querySelector("#curso");
const inputNota = document.querySelector("#nota");
const btnGuardar = document.querySelector("#btnGuardar");
const errorNota = document.querySelector("#errorNota");
const listaEstudiantes = document.querySelector("#listaEstudiantes");
const promedioGeneralSpan = document.querySelector("#promedioGeneral");
const toastContainer = document.querySelector("#toastContainer");

// Arreglo para almacenar los objetos y variable para deshacer
let listaRegistro = [];
let ultimoEliminado = null;
let timerEliminacion = null;

// Sistema de Notificaciones Toast con soporte para Deshacer
function mostrarNotificacion(mensaje, conOpcionDeshacer = false) {
  toastContainer.innerHTML = "";
  
  const toast = document.createElement("div");
  toast.className = "toast";
  
  const texto = document.createElement("span");
  texto.textContent = mensaje;
  toast.appendChild(texto);

  if (conOpcionDeshacer) {
    const btnDeshacer = document.createElement("button");
    btnDeshacer.className = "btn-undo";
    btnDeshacer.textContent = "Deshacer";
    
    btnDeshacer.addEventListener("click", () => {
      if (ultimoEliminado) {
        listaRegistro.push(ultimoEliminado.estudiante);
        renderizarLista();
        actualizarPromedio();
        clearTimeout(timerEliminacion);
        ultimoEliminado = null;
        mostrarNotificacion("Eliminación cancelada.");
      }
    });
    toast.appendChild(btnDeshacer);
  }

  toastContainer.appendChild(toast);

  timerEliminacion = setTimeout(() => {
    toast.remove();
    ultimoEliminado = null;
  }, 5000);
}

// Actualizar el promedio general
function actualizarPromedio() {
  if (listaRegistro.length === 0) {
    promedioGeneralSpan.textContent = "0.00";
    return;
  }
  const sumaTotal = listaRegistro.reduce((acc, est) => acc + est.nota, 0);
  const promedio = sumaTotal / listaRegistro.length;
  promedioGeneralSpan.textContent = promedio.toFixed(2);
}

// Validar formulario en tiempo real (Prevención de errores)
function validarFormulario() {
  const nombreValido = inputNombre.value.trim() !== "";
  const cursoValido = inputCurso.value.trim() !== "";
  const valorNota = Number(inputNota.value);
  const notaValida = inputNota.value !== "" && valorNota >= 0 && valorNota <= 20;

  if (inputNota.value !== "" && (valorNota < 0 || valorNota > 20)) {
    errorNota.style.display = "block";
  } else {
    errorNota.style.display = "none";
  }

  // Deshabilitar botón si los datos son inválidos
  btnGuardar.disabled = !(nombreValido && cursoValido && notaValida);
}

inputNombre.addEventListener("input", validarFormulario);
inputCurso.addEventListener("input", validarFormulario);
inputNota.addEventListener("input", validarFormulario);

// Renderizar la lista completa
function renderizarLista() {
  listaEstudiantes.innerHTML = "";

  listaRegistro.forEach((estudiante) => {
    const li = document.createElement("li");
    li.dataset.id = estudiante.id;
    const estado = estudiante.obtenerEstado().toLowerCase();
    li.classList.add(estado);

    const infoContainer = document.createElement("div");
    
    const infoText = document.createElement("span");
    infoText.textContent = estudiante.obtenerFormatoLista();
    
    const badge = document.createElement("span");
    badge.className = `badge badge-${estado}`;
    badge.textContent = estudiante.obtenerEstado();

    infoContainer.appendChild(infoText);
    infoContainer.appendChild(document.createTextNode(" "));
    infoContainer.appendChild(badge);

    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "Eliminar";
    btnBorrar.className = "btn btn-borrar";
    btnBorrar.setAttribute("aria-label", `Eliminar a ${estudiante.nombre}`);

    btnBorrar.addEventListener("click", () => {
      const index = listaRegistro.findIndex((e) => e.id === estudiante.id);
      if (index !== -1) {
        ultimoEliminado = { estudiante: listaRegistro[index], index };
        listaRegistro.splice(index, 1);
        renderizarLista();
        actualizarPromedio();
        mostrarNotificacion(`Estudiante "${estudiante.nombre}" eliminado.`, true);
      }
    });

    li.appendChild(infoContainer);
    li.appendChild(btnBorrar);
    listaEstudiantes.appendChild(li);
  });
}

// Evento Submit para registrar
formEstudiante.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const valorNota = Number(inputNota.value);
  if (valorNota < 0 || valorNota > 20) return;

  const nuevoEstudiante = new Estudiante(inputNombre.value.trim(), inputCurso.value.trim(), valorNota);
  listaRegistro.push(nuevoEstudiante);

  renderizarLista();
  actualizarPromedio();
  
  mostrarNotificacion(`Estudiante "${nuevoEstudiante.nombre}" registrado con éxito.`);

  formEstudiante.reset();
  validarFormulario();
});