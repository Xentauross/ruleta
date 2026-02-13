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

// --- NUEVA LÓGICA DE SORTEO CON ANIMACIÓN ---
let intervaloRuleta = null; // Variable para controlar la animación

function sortear() {
    const lista = obtenerDatos();
    const resultadoBox = document.getElementById('resultado');

    // 1. Validar si hay datos
    if (lista.length === 0) {
        resultadoBox.innerText = "⚠️ Lista vacía";
        return;
    }

    // 2. Si ya está rodando, no hacemos nada (evita doble click)
    if (intervaloRuleta) return;

    // 3. Quitar la clase de animación anterior (si la hubiera)
    resultadoBox.classList.remove('ganador-anim');
    resultadoBox.style.color = "#222"; // Resetear color

    // 4. Sonido o efecto visual inicial
    resultadoBox.innerText = "🎲 ...";

    // 5. INICIAR LA RULETA (Cambia el nombre cada 80ms)
    intervaloRuleta = setInterval(() => {
        const randomTemp = Math.floor(Math.random() * lista.length);
        resultadoBox.innerText = lista[randomTemp];
    }, 80);

    // 6. DETENER LA RULETA DESPUÉS DE 3 SEGUNDOS
    setTimeout(() => {
        clearInterval(intervaloRuleta); // Parar el movimiento
        intervaloRuleta = null; // Liberar la variable

        // Elegir el ganador FINAL real
        const ganadorIndice = Math.floor(Math.random() * lista.length);
        const ganadorNombre = lista[ganadorIndice];

        // Mostrar ganador y aplicar animación
        resultadoBox.innerText = "⭐ " + ganadorNombre + " ⭐";
        resultadoBox.classList.add('ganador-anim');

    }, 3000); // 3000ms = 3 segundos de emoción
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