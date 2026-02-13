// --- SCRIPT.JS CORREGIDO Y BLINDADO ---

// 1. Cargar lista al iniciar
document.addEventListener('DOMContentLoaded', () => {
    console.log("Web cargada correctamente");
    cargarLista();
});

// --- GESTIÓN DE DATOS ---
function obtenerDatos() {
    try {
        const datos = localStorage.getItem('miListaSorteo');
        return datos ? JSON.parse(datos) : [];
    } catch (e) {
        console.error("Error leyendo datos, reseteando...", e);
        return [];
    }
}

function guardarDatos(array) {
    localStorage.setItem('miListaSorteo', JSON.stringify(array));
}

// --- FUNCIÓN PRINCIPAL: CARGAR Y PINTAR ---
function cargarLista() {
    const lista = obtenerDatos();
    const ul = document.getElementById('listaItems');
    const contador = document.getElementById('contador');

    // Protección: Si no encuentra los elementos HTML, no hace nada (evita errores)
    if (!ul || !contador) return;

    // Actualizar contador y limpiar lista visual
    ul.innerHTML = '';
    contador.innerText = lista.length;

    // Generar elementos visuales
    lista.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item} 
            <span style="cursor:pointer; color:red; font-weight:bold;" onclick="eliminarUno(${index})" title="Borrar este elemento">✖</span>
        `;
        ul.appendChild(li);
    });

    // Sincronizar checkboxes de Raids (marcar los que están en lista)
    const checkboxes = document.querySelectorAll('.tipos-grid input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = lista.includes(cb.value);
    });
}

// --- AÑADIR ELEMENTOS ---
function agregar() {
    const input = document.getElementById('nuevoItem');
    if (!input) return;

    const texto = input.value;

    if (!texto.trim()) {
        alert("⚠️ ¡Escribe algo primero!");
        return;
    }

    const lista = obtenerDatos();
    // Separar por comas
    const nuevosElementos = texto.split(',').map(p => p.trim()).filter(p => p !== "");

    if (nuevosElementos.length > 0) {
        lista.push(...nuevosElementos);
        guardarDatos(lista);
        cargarLista();
        input.value = '';
    }
}

// --- GESTIÓN DE RAIDS (CHECKBOXES) ---
function toggleTipo(checkbox) {
    const valor = checkbox.value;
    const lista = obtenerDatos();

    if (checkbox.checked) {
        if (!lista.includes(valor)) lista.push(valor);
    } else {
        const index = lista.indexOf(valor);
        if (index > -1) lista.splice(index, 1);
    }

    guardarDatos(lista);
    cargarLista();
}

function desmarcarTodosTipos() {
    // Busca todos los checkboxes marcados y los desmarca uno a uno
    const checkboxes = document.querySelectorAll('.tipos-grid input[type="checkbox"]');
    let lista = obtenerDatos();

    checkboxes.forEach(cb => {
        if (cb.checked) {
            cb.checked = false;
            // Quitar de la lista de datos también
            lista = lista.filter(item => item !== cb.value);
        }
    });

    guardarDatos(lista);
    cargarLista();
}

// --- SORTEO (RULETA) ---
let intervaloRuleta = null;

function sortear() {
    const lista = obtenerDatos();
    const resultadoBox = document.getElementById('resultado');
    if (!resultadoBox) return;

    if (lista.length === 0) {
        resultadoBox.innerText = "⚠️ Mochila vacía";
        resultadoBox.style.color = "#fff"; // Mensaje visible
        return;
    }

    if (intervaloRuleta) return; // Evitar doble click

    // Preparar animación
    resultadoBox.classList.remove('ganador-anim');
    resultadoBox.style.color = "#ffffff"; // Texto blanco para fondo negro
    resultadoBox.style.textShadow = "none";
    resultadoBox.style.transform = "scale(1)";


    // Animación de giro
    intervaloRuleta = setInterval(() => {
        const randomTemp = Math.floor(Math.random() * lista.length);
        resultadoBox.innerText = lista[randomTemp];
    }, 80);

    // Parar y elegir ganador
    setTimeout(() => {
        clearInterval(intervaloRuleta);
        intervaloRuleta = null;

        const ganadorIndice = Math.floor(Math.random() * lista.length);
        const ganadorNombre = lista[ganadorIndice];

        resultadoBox.innerText = "⭐ " + ganadorNombre + " ⭐";
        resultadoBox.classList.add('ganador-anim'); // Activa el brillo amarillo
    }, 3000);
}

// --- BORRAR TODO (LA FUNCIÓN QUE FALLABA) ---
function borrarTodo() {
    // 1. Preguntar
    if (confirm("¿Estás seguro de que quieres BORRAR TODO?")) {

        // 2. Borrar memoria
        localStorage.removeItem('miListaSorteo');

        // 3. Actualizar la lista visual (esto desmarcará los checkboxes también)
        cargarLista();

        // 4. Resetear el texto del resultado
        const resultadoBox = document.getElementById('resultado');
        if (resultadoBox) {
            resultadoBox.innerText = "¿Quién será el elegido?";
            resultadoBox.classList.remove('ganador-anim');
            resultadoBox.style.color = "#fff";
        }
    }
}

// --- BORRAR UNO SOLO ---
function eliminarUno(index) {
    const lista = obtenerDatos();
    lista.splice(index, 1);
    guardarDatos(lista);
    cargarLista();
}

// ==========================================
// === SISTEMA CRUD DE RUTAS (NUEVO) ===
// ==========================================

// 1. Cargar las rutas al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    inicializarRutas(); // Carga el desplegable
    cargarLista();      // Carga la mochila
});

// Obtener la lista de nombres de rutas guardadas
function obtenerNombresRutas() {
    const rutas = localStorage.getItem('misRutasGuardadas');
    // Si no existe ninguna, creamos una por defecto
    return rutas ? JSON.parse(rutas) : ['Ruta 1 (Inicio)'];
}

// Pintar el <select> con las opciones
function inicializarRutas() {
    const selector = document.getElementById('rutaSelect');
    const rutas = obtenerNombresRutas();

    // Guardar la selección actual si existe para no perderla al repintar
    const seleccionPrevia = selector.value;

    selector.innerHTML = ''; // Limpiar select

    rutas.forEach(nombreRuta => {
        const opcion = document.createElement('option');
        opcion.value = nombreRuta;
        opcion.textContent = nombreRuta; // El nombre visible es el valor
        selector.appendChild(opcion);
    });

    // Intentar mantener la selección anterior o ir a la primera
    if (rutas.includes(seleccionPrevia)) {
        selector.value = seleccionPrevia;
    }
}

// --- CREAR (Create) ---
function crearNuevaRuta() {
    const nombre = prompt("✍️ Escribe el nombre de la nueva Ruta:");

    if (!nombre || nombre.trim() === "") return; // Si cancela o deja vacío

    const rutas = obtenerNombresRutas();

    // Evitar duplicados
    if (rutas.includes(nombre)) {
        alert("⚠️ Ya existe una ruta con ese nombre.");
        return;
    }

    rutas.push(nombre); // Añadir a la lista
    localStorage.setItem('misRutasGuardadas', JSON.stringify(rutas)); // Guardar lista maestra

    inicializarRutas(); // Refrescar visualmente

    // Seleccionar automáticamente la nueva ruta creada
    document.getElementById('rutaSelect').value = nombre;
}

// --- BORRAR (Delete) ---
function borrarRutaActual() {
    const selector = document.getElementById('rutaSelect');
    const rutaABorrar = selector.value;
    const rutas = obtenerNombresRutas();

    if (rutas.length <= 1) {
        alert("⚠️ Debes tener al menos una ruta.");
        return;
    }

    if (confirm(`¿Seguro que quieres eliminar la "${rutaABorrar}" y todos sus Pokémon guardados?`)) {
        // 1. Eliminar de la lista maestra
        const nuevasRutas = rutas.filter(r => r !== rutaABorrar);
        localStorage.setItem('misRutasGuardadas', JSON.stringify(nuevasRutas));

        // 2. Eliminar los datos de Pokémon de esa ruta específica
        localStorage.removeItem('miListaSorteo_' + rutaABorrar);

        // 3. Refrescar
        inicializarRutas();
        alert("🗑️ Ruta eliminada.");
    }
}

// --- GUARDAR EN LA RUTA SELECCIONADA ---
function guardarEnRuta() {
    const selector = document.getElementById('rutaSelect');
    const rutaNombre = selector.value;
    const listaActual = obtenerDatos(); // Función que ya tienes arriba

    if (listaActual.length === 0) return alert("⚠️ La mochila está vacía, no hay nada que guardar.");

    // Guardamos usando el nombre de la ruta como parte de la clave
    localStorage.setItem('miListaSorteo_' + rutaNombre, JSON.stringify(listaActual));

    // Pequeño efecto visual para confirmar
    const btn = document.querySelector('.btn-save');
    const textoOriginal = btn.innerText;
    btn.innerText = "✅ ¡Guardado!";
    setTimeout(() => btn.innerText = textoOriginal, 1500);
}

// --- CARGAR DE LA RUTA SELECCIONADA ---
function cargarDeRuta() {
    const selector = document.getElementById('rutaSelect');
    const rutaNombre = selector.value;

    const datosGuardados = localStorage.getItem('miListaSorteo_' + rutaNombre);

    if (!datosGuardados) {
        alert(`❌ La ruta "${rutaNombre}" está vacía.`);
        return;
    }

    if (confirm(`¿Cargar los datos de "${rutaNombre}"? (Se borrará lo que tienes en pantalla ahora)`)) {
        const listaRecuperada = JSON.parse(datosGuardados);
        guardarDatos(listaRecuperada); // Guarda en la lista activa
        cargarLista(); // Pinta en pantalla
    }
}

// --- TECLA ENTER ---
function handleEnter(e) {
    if (e.key === 'Enter') agregar();
}