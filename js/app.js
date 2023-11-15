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

    if(cliente.pedido.length) {
    // Mostrar el resumen
    actualizarResumen();
    }
    else {
        mensajePedidoVacio();
    }
    
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

        // Subtotal del articulo
        const subtotalEL = document.createElement('P');
        subtotalEL.classList.add('fw-bold');
        subtotalEL.textContent = 'Subtotal: ';
        
        const subtotalValor = document.createElement('SPAN');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        // Boton para eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent= 'Eliminar el pedido';

        // Funcion para eliminar el pedido
        btnEliminar.onclick = function() {
            eliminarProducto(id)
        }

        // Agregar valores a sus contenedores
        cantidadEL.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEL.appendChild(subtotalValor);

        // Agregar elementos al LI
        lista.appendChild(nombreEL);
        lista.appendChild(cantidadEL);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEL);
        lista.appendChild(btnEliminar);

        //Agregar lista al grupo principal
        grupo.appendChild(lista);
    })

    //Agregar a los elementos padre
    hora.appendChild(horaSpan);
    mesa.appendChild(mesaSpan);

    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    // Mostrar formulario de propinas
    formularioPropinas();
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');

    while( contenido.firstChild ) {
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal ( precio, cantidad) {
    return `$ ${precio * cantidad}`
}

function eliminarProducto(id){
    const { pedido } = cliente;
    const resultado = pedido.filter( articulo => articulo.id !== id);
        cliente.pedido= [...resultado];

        limpiarHTML();
        
        if(cliente.pedido.length) {
            // Mostrar el resumen
            actualizarResumen();
            }
            else {
                mensajePedidoVacio();
            }

            // El producto se elimino, reseteamos a 0 en el formulario
            const productoEliminado = `#producto-${id}`;

            const inputEliminado = document.querySelector(productoEliminado);
            inputEliminado.value= 0;

            console.log(productoEliminado);

}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido')

    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido'

    contenido.appendChild(texto);
}

function formularioPropinas() {

    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-5','mt-3','shadow')

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    // Radio Button 10%
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name= 'propina';
    radio10.value= "10";
    radio10.classList.add('form-check-input');

    radio10.onclick= calcularPropina;

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent= '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

      // Radio Button 15%
      const radio15 = document.createElement('INPUT');
      radio15.type = 'radio';
      radio15.name= 'propina';
      radio15.value= "15";
      radio15.classList.add('form-check-input');
      radio15.onclick= calcularPropina;
5
      const radio15Label = document.createElement('LABEL');
      radio15Label.textContent= '15%';
      radio15Label.classList.add('form-check-label');
  
      const radio15Div = document.createElement('DIV');
      radio15Div.classList.add('form-check');
  
      radio15Div.appendChild(radio15);
      radio15Div.appendChild(radio15Label);

      // Radio Button 21%
      const radio21 = document.createElement('INPUT');
      radio21.type = 'radio';
      radio21.name= 'propina';
      radio21.value= "21";
      radio21.classList.add('form-check-input');
      radio21.onclick= calcularPropina;
5
      const radio21Label = document.createElement('LABEL');
      radio21Label.textContent= '21%';
      radio21Label.classList.add('form-check-label');
  
      const radio21Div = document.createElement('DIV');
      radio21Div.classList.add('form-check');
  
      radio21Div.appendChild(radio21);
      radio21Div.appendChild(radio21Label);

    // Agregar al DIV principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio15Div);
    divFormulario.appendChild(radio21Div);

    //Agregarlo al formulario
    formulario.appendChild(divFormulario);

    contenido.appendChild(formulario);
}

function calcularPropina() {
    const { pedido } = cliente;
    let subtotal = 0;

    //Cacula el subtotal a pagar
    pedido.forEach( articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    });

    //Selecciona el radio Button con la propina del cliente
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;
    
    // Calcular la propina
    const propina = ((subtotal * parseInt( propinaSeleccionada )) / 100);
    
    const total = subtotal + propina;

    mostrarTotal(subtotal, total, propina);
}

function mostrarTotal( subtotal, total, propina) {

    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar', 'my-5');

    //Subtotal
    const subtotalParrafo = document.createElement('P');
    subtotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-3');
    subtotalParrafo.textContent= ' Subtotal Consumo: ';

    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent= `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    // Propina
    
    const propinaParrafo = document.createElement('P');
    propinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-3');
    propinaParrafo.textContent= ' Propina: ';

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent= `$${propina}`;

    propinaParrafo.appendChild(propinaSpan)

    // Total a pagar
    const totalParrafo = document.createElement('P');
    totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-3');
    totalParrafo.textContent= ' Total: ';

    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent= `$${total}`;

    totalParrafo.appendChild(totalSpan);

    // Eliminar el último resultado
    const totalpagarDiv = document.querySelector('.total-pagar');
    if(totalpagarDiv){
        totalpagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);


    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}