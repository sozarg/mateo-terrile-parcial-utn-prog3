/*=========================================
    Datos base (13 frutas)
===========================================*/
const frutas = [
    { id: 1,  nombre: "anana",            precio: 3000, rutaImagen: "img/anana.jpg" },
    { id: 2,  nombre: "arandano",         precio: 5000, rutaImagen: "img/arandano.jpg" },
    { id: 3,  nombre: "banana",           precio: 1000, rutaImagen: "img/banana.jpg" },
    { id: 4,  nombre: "frambuesa",        precio: 4000, rutaImagen: "img/frambuesa.png" },
    { id: 5,  nombre: "frutilla",         precio: 3000, rutaImagen: "img/frutilla.jpg" },
    { id: 6,  nombre: "kiwi",             precio: 2000, rutaImagen: "img/kiwi.jpg" },
    { id: 7,  nombre: "mandarina",        precio: 800,  rutaImagen: "img/mandarina.jpg" },
    { id: 8,  nombre: "manzana",          precio: 1500, rutaImagen: "img/manzana.jpg" },
    { id: 9,  nombre: "naranja",          precio: 9000, rutaImagen: "img/naranja.jpg" },
    { id: 10, nombre: "pera",             precio: 2500, rutaImagen: "img/pera.jpg" },
    { id: 11, nombre: "pomelo-amarillo",  precio: 2000, rutaImagen: "img/pomelo-amarillo.jpg" },
    { id: 12, nombre: "pomelo-rojo",      precio: 2000, rutaImagen: "img/pomelo-rojo.jpg" },
    { id: 13, nombre: "sandia",           precio: 3500, rutaImagen: "img/sandia.jpg" }
];

/*=========================================
    Estado y Selectores del DOM
===========================================*/
// Variables de estado
let carrito = [];        // array para almacenar productos agregados al carrito
let htmlCarrito = "";    // variable para construir el HTML del carrito
let frutasMostradas = frutas.slice(); // copia del array original para poder ordenar

// Seleccionamos los elementos del DOM
const barraBusqueda      = document.getElementById("barra-busqueda");
const contenedorProductos= document.getElementById("contenedor-productos");
const contenedorCarrito  = document.getElementById("contenedor-carrito");
const estadoCarrito      = document.getElementById("estado-carrito");
const botonOrdenNombre   = document.getElementById("ordenar-nombre");
const botonOrdenPrecio   = document.getElementById("ordenar-precio");

/*=========================================
    Render de productos en el DOM
===========================================*/
/*
  funcion que recibe un array de frutas y genera el HTML. 
  se usa forEach para recorrer el array y template literals para construir el HTML de cada card.
*/
function mostrarLista(array) {
  let html = "";
  
  // Recorremos el array con forEach
  array.forEach(fruta => {
    html += `
      <div class="card-producto">
        <img src="${fruta.rutaImagen}" alt="${fruta.nombre}">
        <h3>${fruta.nombre}</h3>
        <p class="precio">$${fruta.precio}</p>
        <button class="boton-agregar" onclick="agregarACarrito(${fruta.id})">Agregar al carrito</button>
      </div>
    `;
  });
  
  // Insertamos el HTML en el contenedor
  contenedorProductos.innerHTML = html;
}

/*=========================================
    Filtro de productos por input
===========================================*/
// Funcion que se ejecuta cada vez que escribimos en el input
function filtrarProducto(){
  const valor = barraBusqueda.value.toLowerCase(); // obtenemos el valor del input en minusculas
  const filtrados = frutasMostradas.filter(f => f.nombre.toLowerCase().includes(valor)); // filtramos las frutas
  mostrarLista(filtrados); // mostramos solo las filtradas
}

// Escuchamos el evento input en la barra de busqueda
barraBusqueda.addEventListener("input", filtrarProducto);

/*=========================================
    Ordenamiento de productos
===========================================*/
/*
  para los botonnes se usa sort() con una función comparadora básica.
  
  se crea una copia del array original con slice para ordenarla sin modificar el array original

  si el usuario ya filtró productos y después ordena, se mantiene el filtro pero con el nuevo orden
*/
// Ordenar por nombre alfabeticamente
function ordenarPorNombre(){
  // Ordenamos el array con sort
  frutasMostradas.sort(function(a, b) {
    if (a.nombre < b.nombre) {
      return -1;
    }
    if (a.nombre > b.nombre) {
      return 1;
    }
    return 0;
  });
  
  // Si hay algo en el input de busqueda, aplicamos el filtro
  if (barraBusqueda.value) {
    filtrarProducto();
  } else {
    mostrarLista(frutasMostradas);
  }
}

// Ordenar por precio de menor a mayor
function ordenarPorPrecio(){
  frutasMostradas.sort(function(a, b) {
    return a.precio - b.precio; // ordenamiento numerico
  });
  
  // Si hay algo en el input de busqueda, aplicamos el filtro
  if (barraBusqueda.value) {
    filtrarProducto();
  } else {
    mostrarLista(frutasMostradas);
  }
}

// Escuchamos los eventos click en los botones de ordenamiento
botonOrdenNombre.addEventListener("click", ordenarPorNombre);
botonOrdenPrecio.addEventListener("click", ordenarPorPrecio);

/*=========================================
    Funciones del Carrito
===========================================*/
// Agregar producto al carrito
function agregarACarrito(idFruta){
  const encontrada = frutas.find(f => f.id === idFruta); // buscamos la fruta por id
  if (!encontrada) return; // si no existe, salimos

  carrito.push(encontrada); // agregamos la fruta al carrito
  console.log("Producto agregado al carrito:", encontrada);
  console.log("Carrito actualizado:", carrito);
  mostrarCarrito(); // actualizamos la vista del carrito
  actualizarCarritoLS(); // guardamos en localStorage
}

// Mostrar el carrito en pantalla
function mostrarCarrito(){
  // Si el carrito esta vacio
  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `
      <p>Tu carrito está vacío.</p>
      <div class="carrito-footer">
        <button id="vaciar-carrito" onclick="vaciarCarrito()">Vaciar Carrito</button>
        <p id="total">Total: $0</p>
      </div>
    `;
    estadoCarrito.textContent = "Carrito: 0 productos";
    return;
  }

  // Construimos el HTML del carrito
  htmlCarrito = "<ul class='lista-carrito'>";
  carrito.forEach((fruta, index) => {
    htmlCarrito += `
      <li class="bloque-item">
        <p class="nombre-item">${fruta.nombre} - $${fruta.precio}</p>
        <button class="boton-eliminar" onclick="eliminarDelCarrito(${index})">Eliminar</button>
      </li>
    `;
  });
  htmlCarrito += "</ul>";

  // Calculamos el total con reduce
  const total = carrito.reduce((acc, f) => acc + f.precio, 0);

  // Agregamos el footer con boton vaciar y total
  htmlCarrito += `
    <div class="carrito-footer">
      <button id="vaciar-carrito" onclick="vaciarCarrito()">Vaciar Carrito</button>
      <p id="total">Total: $${total}</p>
    </div>
  `;

  contenedorCarrito.innerHTML = htmlCarrito;

  // Actualizamos el contador de productos en el header
  estadoCarrito.textContent = `Carrito: ${carrito.length} ${carrito.length === 1 ? "producto" : "productos"}`;
}

// Eliminar un producto del carrito por su indice
function eliminarDelCarrito(indice){
  carrito.splice(indice, 1); // eliminamos el elemento en la posicion indicada
  mostrarCarrito(); // actualizamos la vista
  actualizarCarritoLS(); // guardamos en localStorage
}

// Vaciar todo el carrito
function vaciarCarrito(){
  carrito = []; // vaciamos el array
  mostrarCarrito(); // actualizamos la vista
  localStorage.removeItem("carrito"); // eliminamos del localStorage
}

/*=========================================
    Persistencia con localStorage
===========================================*/
/*
  para que cuando el usuario agregue frutas al carrito y cierre la página, al volver sus productos sigan ahí.

  se usa JSON.stringify() para convertir el array del carrito en texto para guardarlo
  y JSON.parse() para convertir el texto guardado de vuelta en array

  se llama a actualizarCarritoLS() cada vez que agregamos o eliminamos algo
  y a cargarCarrito() cuando se inicia la página en la función init()
*/
// Cargar el carrito desde localStorage al iniciar la pagina
function cargarCarrito(){
  const texto = localStorage.getItem("carrito"); // obtenemos el texto del localStorage
  if (texto) {
    carrito = JSON.parse(texto); // convertimos el JSON a array
  } else {
    carrito = []; // si no hay nada, iniciamos con array vacio
  }
}

// Guardar el carrito en localStorage
function actualizarCarritoLS(){
  localStorage.setItem("carrito", JSON.stringify(carrito)); // convertimos el array a JSON y lo guardamos
}
// imprimir datos del alumno
function imprimirDatosAlumno(){
  const alumno = { dni: "45200599", nombre: "Mateo", apellido: "Terrile" };
  document.getElementById("alumno").textContent = `${alumno.nombre} ${alumno.apellido}`;
  console.log(`Alumno: ${alumno.nombre} ${alumno.apellido} - DNI: ${alumno.dni}`);
}

// Funcion principal que se ejecuta al cargar la pagina
function init(){
  imprimirDatosAlumno(); // mostramos los datos del alumno
  cargarCarrito(); // cargamos el carrito desde localStorage
  mostrarLista(frutasMostradas); // mostramos los productos
  mostrarCarrito(); // mostramos el carrito
}

// Ejecutamos la funcion init
init();
