let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1:'Comida',
    2:'Bebidas',
    3:'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Revisar si hay campos vacios
    const camposVacios = [mesa, hora].some( campo => campo==='');
    
    if(camposVacios){
        //Verifica sí existe una alerta previa
        const existeAlerta = document.querySelector('.invalid-feedback');
        
        if(!existeAlerta){
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center')
            alerta.textContent = 'Todos los campos son obligatorios'
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {
                alerta.remove();
            }, 3000);
           } 
           return;
    }
    //Asiga los datos del formulario al cliente
    cliente = {...cliente, mesa, hora}
    
    // Ocultar Modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    mostrarSecciones();

    //Obtener datos de la API Json-Server
    obtenerPlatos();
}

//Mostrar las secciones
function mostrarSecciones () {
    const seccionesOcultas =document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatos() {
    const url = `http://localhost:4000/platillos`
        fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatos(resultado))
        .catch(error => console.log(error));
}

function mostrarPlatos(platos){
    const contenido = document.querySelector('#platos .contenido');

    platos.forEach( plato => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV')
        nombre.classList.add('col-md-4');
        nombre.textContent = plato.nombre;

        const precio = document.createElement('DIV')
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `$${plato.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent= categorias[plato.categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id= `producto-${plato.id}`;
        inputCantidad.classList.add('form-control');

        // Function para detectar el plato y la cantidad

        inputCantidad.onchange = function(){
            const cantidad = parseInt( inputCantidad.value );
            agregarPlato({...plato, cantidad});
            
        }
        

        const agregar = document.createElement('DIV')
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);
        
        
        row.appendChild(agregar);
        row.appendChild(categoria);
        row.appendChild(precio);
        row.appendChild(nombre);
        contenido.appendChild(row);
    })
}

function agregarPlato(producto){

    // Extraer el pedido actual
    let{ pedido } = cliente;

    //Revisa que la cantidad sea mayor a 0
    if(producto.cantidad > 0 ) {
        //Verifica si un elemento ya existe en ese arreglo
        if ( pedido.some(articulo => articulo.id === producto.id)){
            // El artículo ya existe, entonces actualiza la cantidad.
            const pedidoActualizado = pedido.map( articulo => {
                if( articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }

                return articulo;
            });
            // Se asigna el nuevo arreglo a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        } else {
            // Agrega el artículo al arreglo, sí no existe.
            cliente.pedido = [...pedido, producto];
        }
        
    } else {
        // Eliminar elementos con cantidad 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id);
        cliente.pedido= [...resultado];
    }

    // Limpiar el HTML previo
    limpiarHTML();
    // Mostrar el resumen
    actualizarResumen();
}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'shadow', 'mt-3');

    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');
    
    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');
    
    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    // Título de la sección
    const heading = document.createElement('H3');
    heading.textContent = 'Platos Consumidos';
    heading.classList.add('my-4', 'text-center');

    // Iterar sobre el array de pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach( articulo => {
        const { nombre,cantidad, precio, id } = articulo;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nombreEL = document.createElement('H4');
        nombreEL.classList.add('my-4');
        nombreEL.textContent = nombre;

        // Cantidad del artículo
        const cantidadEL = document.createElement('P');
        cantidadEL.classList.add('fw-bold');
        cantidadEL.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        // Precio del articulo
        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';
        
        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        // Agregar valores a sus contenedores
        cantidadEL.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);

        // Agregar elementos al LI
        lista.appendChild(nombreEL);
        lista.appendChild(cantidadEL);
        lista.appendChild(precioEl);

        //Agregar lista al grupo principal
        grupo.appendChild(lista);
    })

    //Agregar a los elementos padre
    hora.appendChild(horaSpan);
    mesa.appendChild(mesaSpan);

    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');

    while( contenido.firstChild ) {
        contenido.removeChild(contenido.firstChild);
    }
}