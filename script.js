// Al cargar la página, recuperamos lo guardado
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
}

function agregar() {
    const input = document.getElementById('nuevoItem');
    const texto = input.value;

    if (!texto.trim()) return alert("¡Escribe algo primero!");

    const lista = obtenerDatos();

    // Separa por comas, limpia espacios y filtra vacíos
    const nuevosElementos = texto.split(',').map(palabra => palabra.trim()).filter(palabra => palabra !== "");

    if (nuevosElementos.length > 0) {
        lista.push(...nuevosElementos);
        guardarDatos(lista);
        cargarLista();
        input.value = '';
    }
}

// --- SUSTITUYE ESTA FUNCIÓN EN TU SCRIPT.JS ---
let intervaloRuleta = null;

function sortear() {
    const lista = obtenerDatos();
    const resultadoBox = document.getElementById('resultado');

    if (lista.length === 0) {
        resultadoBox.innerText = "⚠️ Lista vacía";
        return;
    }

    if (intervaloRuleta) return; // Evita doble click

    // --- LIMPIEZA TOTAL ANTES DE EMPEZAR ---
    resultadoBox.classList.remove('ganador-anim'); // Quita la animación final
    resultadoBox.style.color = "#000000";          // Fuerza color negro
    resultadoBox.style.opacity = "1";              // Fuerza visibilidad
    resultadoBox.style.transform = "scale(1)";     // Fuerza tamaño normal
    // ---------------------------------------

    resultadoBox.innerText = "🎲 ...";

    // Gira la ruleta (puedes subir el 80 a 150 si va demasiado rápido)
    intervaloRuleta = setInterval(() => {
        const randomTemp = Math.floor(Math.random() * lista.length);
        resultadoBox.innerText = lista[randomTemp];
    }, 80);

    // Se detiene a los 3 segundos
    setTimeout(() => {
        clearInterval(intervaloRuleta);
        intervaloRuleta = null;

        const ganadorIndice = Math.floor(Math.random() * lista.length);
        const ganadorNombre = lista[ganadorIndice];

        resultadoBox.innerText = "⭐ " + ganadorNombre + " ⭐";

        // Aplica la animación y el color rojo SOLO al final
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