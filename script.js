// Al cargar la página, recuperamos lo guardado
document.addEventListener('DOMContentLoaded', cargarLista);

function obtenerDatos() {
    // Busca en la memoria del navegador, si no hay nada, devuelve array vacío
    return JSON.parse(localStorage.getItem('miListaSorteo')) || [];
}

function guardarDatos(array) {
    // Guarda el array en la memoria del navegador
    localStorage.setItem('miListaSorteo', JSON.stringify(array));
}

function cargarLista() {
    const lista = obtenerDatos();
    const ul = document.getElementById('listaItems');
    const contador = document.getElementById('contador');

    ul.innerHTML = ''; // Limpiar visualmente
    contador.innerText = lista.length;

    lista.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item} 
            <span style="color:red; cursor:pointer;" onclick="eliminarUno(${index})">✖</span>
        `;
        ul.appendChild(li);
    });
}

function agregar() {
    const input = document.getElementById('nuevoItem');
    const texto = input.value.trim();

    if (!texto) return alert("¡Escribe algo primero!");

    const lista = obtenerDatos();
    lista.push(texto);

    guardarDatos(lista); // Guardar en LocalStorage
    cargarLista();       // Actualizar pantalla
    input.value = '';    // Limpiar input
}

function sortear() {
    const lista = obtenerDatos();
    const resultadoBox = document.getElementById('resultado');

    if (lista.length === 0) {
        resultadoBox.innerText = "⚠️ Lista vacía";
        return;
    }

    // Efecto visual de "pensando"
    resultadoBox.innerText = "🎲 Girando...";

    setTimeout(() => {
        const random = Math.floor(Math.random() * lista.length);
        resultadoBox.innerText = "✨ " + lista[random] + " ✨";
    }, 500);
}

function eliminarUno(index) {
    const lista = obtenerDatos();
    lista.splice(index, 1); // Quitar elemento
    guardarDatos(lista);
    cargarLista();
}

function borrarTodo() {
    if (confirm("¿Seguro que quieres borrar toda la lista?")) {
        localStorage.removeItem('miListaSorteo');
        cargarLista();
        document.getElementById('resultado').innerText = "¿Quién será el elegido?";
    }
}

// Permitir guardar con tecla Enter
function handleEnter(e) {
    if (e.key === 'Enter') agregar();
}