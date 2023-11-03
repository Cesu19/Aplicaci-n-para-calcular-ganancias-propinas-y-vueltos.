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
        precio.classList.add('col-md-4','fw-bold');
        precio.textContent = `$${plato.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md3');
        categoria.textContent= categorias[plato.categoria];

        row.appendChild(categoria);
        row.appendChild(precio);
        row.appendChild(nombre);
        contenido.appendChild(row);
    })
}
