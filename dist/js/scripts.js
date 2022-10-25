let clientes=[];
let productos=[];
let usuarioLogueado;

fetch("./data.json").then((res)=>res.json())
.then((data)=>{
    data.forEach((producto)=>{
        productos.push(producto)
    })
    cargarPagina()
})

fetch("./users.json").then((res)=>res.json())
.then((user)=>{
    user.forEach((cliente)=>{
        clientes.push(cliente)
    })
    let userSession = sessionStorage.getItem("user");
    if(userSession==null){
        logueo()
    } else{
        usuarioLogueado=buscarUsuario(userSession)
    }
})

function calcularCostoTotal (precio,cantidad){
    return precio * cantidad * 1.22;
}

function cliente(id, nombre, apellido, password){
    this.id=id;
    this.nombre=nombre;
    this.apellido=apellido;
    this.password=password;
}
function producto(id,descripcion, precio){
    this.id=id;
    this.descripcion=descripcion;
    this.precio=precio;
}
function compra(cliente,producto,cantidad){
    this.cliente=cliente;
    this.producto=producto;
    this.cantidad=cantidad;
}
function buscarProducto(id){
    for (let index = 0; index < productos.length; index++) {
        if(productos[index].id==id){
            return productos[index];
        }
    }
}


function agregarCarrito (option, cantidad) {
    if(usuarioLogueado!=null){
        let productoBuscado=buscarProducto(option); 
        if (Number(cantidad)>0 ){
            let nuevaCompra = new compra(usuarioLogueado,productoBuscado,cantidad);
            let carro=JSON.parse(localStorage.getItem("Carro"))
            if(carro==null){
                let v=[]
                v.push(nuevaCompra);
                localStorage.setItem("Carro",JSON.stringify(v))
            } else{
                carro.push(nuevaCompra);
                const carroStr=JSON.stringify(carro);
                localStorage.setItem("Carro", carroStr)
            }
            Swal.fire({
                title: 'Excelente!',
                text: `Usted agregó al carrito ${cantidad} ${productoBuscado.descripcion}`,
                imageUrl: `./img/${productoBuscado.descripcion}.jpg`,
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: `${producto.descripcion}`,
            })
    
        } else{
            Swal.fire(`Debe comprar al menos un producto`)
            alert("Debe comprar al menos un producto")
        }
    }else{
        Swal.fire(`Debe estar logueado para poder agregar items al carro`)
    }

}

function cargarPagina(){
    for (producto of productos) {
        let divProducto=document.createElement("div")
        divProducto.innerHTML+=`
        <div class="col mb-5">
        <div class="card h-100">
            <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>
            <img class="card-img-top" src="./img/${producto.descripcion}.jpg" alt="${producto.descripcion}"/>
            <div class="card-body p-4">
                <div class="text-center">
                    <h5 class="fw-bolder">${producto.descripcion}</h5>
                    $${producto.precio}
                </div>
            </div>
            <div class="btn-toolbar justify-content-center p-4 " role="toolbar" aria-label="Toolbar with button groups">
                <div class="btn-group mr-2" role="group" aria-label="First group">
                    <input type="number" class="btn btn-secondary" id="cant${producto.id}">
                </div>
            </div>
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center"><a class="btn btn-outline-dark mt-auto" id="${producto.id}" href="#" OnClick="javascript:return comprar(this)">Comprar</a></div>
            </div>
        </div>
    </div>
    `
    let sectionProductos=document.querySelector("#ProductosBd")
    sectionProductos.appendChild(divProducto)
    }
}
function comprar(button){
    let producto=button.id
    let botonCantidad=`#cant${button.id}`
    let valor=Number(document.querySelector(botonCantidad).value);
    agregarCarrito (producto,valor);
}
function login(nombre,pass){
    for (let index = 0; index < clientes.length; index++) {
        if(clientes[index].nombre==nombre && clientes[index].password==pass){
            return clientes[index];
        }
    }
}
function buscarUsuario(id){
    for (let index = 0; index < clientes.length; index++) {
        if(clientes[index].id==id ){
            return clientes[index];
        }
    }
}

function logueo(){
    (async () => {
        const { value: formValues } = await Swal.fire({
          title: 'Login',
          html:
            '<input id="swal-input1" class="swal2-input" placeholder="Ingrese su usuario">' +
            '<input type="password" id="swal-input2" class="swal2-input" placeholder="Ingrese su contraseña">',
          focusConfirm: false,
          preConfirm: () => {
            return [
              document.getElementById('swal-input1').value,
              document.getElementById('swal-input2').value
            ]
          }
        })
        usuarioLogueado=login(formValues[0],formValues[1])
        if(usuarioLogueado!=null){
            Swal.fire(`Bienvenido/a ${usuarioLogueado.nombre}  ${usuarioLogueado.apellido}`)
            mostrarUsuario(usuarioLogueado)
            sessionStorage.clear()
            sessionStorage.setItem("user", usuarioLogueado.id)
        } else{
            Swal.fire(`Nombre de usuario y contraseña no válidos`)
        }
        })()
}

const logout = document.querySelector("#logout");
logout.onclick= function () {
    sessionStorage.clear()
}

function mostrarUsuario(usuario){
    let divUsuario=document.createElement("a")
    divUsuario.innerHTML+=`Usuario: ${usuario.nombre}  ${usuario.apellido}`
    let user=document.querySelector("#usuario")
    user.appendChild(divUsuario)
}


