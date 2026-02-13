document.addEventListener('DOMContentLoaded', cargarLista);

function obtenerDatos() {
    return JSON.parse(localStorage.getItem('miListaSorteo')) || [];
}

function guardarDatos(array) {
    localStorage.setItem('miListaSorteo', JSON.stringify(array));
}

function cargarLista() {
    const lista = obtenerDatos();
    const ul = document.getElementById('listaItems');
    const contador = document.getElementById('contador');

    ul.innerHTML = '';
    contador.innerText = lista.length;

    lista.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item} 
            <span style="cursor:pointer;" onclick="eliminarUno(${index})">✖</span>
        `;
        ul.appendChild(li);
    });

    // --- NUEVO: Sincronizar checkboxes ---
    // Recorre todos los checkboxes y mira si su valor está en la lista
    const checkboxes = document.querySelectorAll('.tipos-grid input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = lista.includes(cb.value);
    });
}

// --- NUEVA FUNCIÓN PARA LOS CHECKBOXES ---
function toggleTipo(checkbox) {
    const valor = checkbox.value;
    const lista = obtenerDatos();

    if (checkbox.checked) {
        // Si se marca y no está en la lista, añadir
        if (!lista.includes(valor)) {
            lista.push(valor);
        }
    } else {
        // Si se desmarca, borrar de la lista
        const index = lista.indexOf(valor);
        if (index > -1) {
            lista.splice(index, 1);
        }
    }

    guardarDatos(lista);
    cargarLista();
}
// -----------------------------------------

function agregar() {
    const input = document.getElementById('nuevoItem');
    const texto = input.value;

    if (!texto.trim()) return alert("¡Escribe algo primero!");

    const lista = obtenerDatos();
    const nuevosElementos = texto.split(',').map(palabra => palabra.trim()).filter(palabra => palabra !== "");

    if (nuevosElementos.length > 0) {
        lista.push(...nuevosElementos);
        guardarDatos(lista);
        cargarLista();
        input.value = '';
    }
}

// --- SORTEO (Igual que antes) ---
let intervaloRuleta = null;

function sortear() {
    const lista = obtenerDatos();
    const resultadoBox = document.getElementById('resultado');

    if (lista.length === 0) {
        resultadoBox.innerText = "⚠️ Lista vacía";
        return;
    }

    if (intervaloRuleta) return;

    resultadoBox.classList.remove('ganador-anim');
    resultadoBox.style.color = "#000000";
    resultadoBox.style.opacity = "1";
    resultadoBox.style.transform = "scale(1)";

    resultadoBox.innerText = "🎲 ...";

    intervaloRuleta = setInterval(() => {
        const randomTemp = Math.floor(Math.random() * lista.length);
        resultadoBox.innerText = lista[randomTemp];
    }, 80);

    setTimeout(() => {
        clearInterval(intervaloRuleta);
        intervaloRuleta = null;

        const ganadorIndice = Math.floor(Math.random() * lista.length);
        const ganadorNombre = lista[ganadorIndice];

        resultadoBox.innerText = "⭐ " + ganadorNombre + " ⭐";
        resultadoBox.classList.add('ganador-anim');

    }, 3000);
}

function eliminarUno(index) {
    const lista = obtenerDatos();
    lista.splice(index, 1);
    guardarDatos(lista);
    cargarLista();
}

function borrarTodo() {
    if (confirm("¿Seguro que quieres borrar toda la lista?")) {
        localStorage.removeItem('miListaSorteo');
        cargarLista();
        document.getElementById('resultado').innerText = "¿Quién será el elegido?";
        document.getElementById('resultado').classList.remove('ganador-anim');
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') agregar();
}