let userSession = sessionStorage.getItem("user");
document.body.onload=function(){
    mostrarCarro()
}


function mostrarCarro(){
    let carro=document.createElement("table")
    carro.setAttribute("class", "table")
    carro.setAttribute("id", "tablaCarro")
    const items=JSON.parse(localStorage.getItem("Carro"))
    carro.innerHTML+=`<tr><th>ID</th><th>DESCRIPCION</th><th>PRECIO</th><th>CANTIDAD</th><th>SUBTOTAL</th></tr>`
    let totalCompra=0
    if(items!=null){
        for (item of items) {
            if(item.cliente.id==userSession){
                let subtotal=item.producto.precio*item.cantidad
                carro.innerHTML+=`<tr><td> ${item.producto.id}</td><td> ${item.producto.descripcion}</td><td>${item.producto.precio}</td><td>${item.cantidad}</td><td>${subtotal}</td></tr>` 
                totalCompra=totalCompra+subtotal
            }
        }
        if(totalCompra!=0){
            carro.innerHTML+=`<tr><td colspan='4'> TOTAL:</td> <td>${totalCompra}</td></tr>` 
        } else{
            carro.innerHTML+=`<tr><td colspan='5'> NO AGREGÓ NINGÚN PRODUCTO A SU CARRO</td></tr>`
        }
        
    } else{
        carro.innerHTML+=`<tr><td colspan='5'> NO AGREGÓ NINGÚN PRODUCTO A SU CARRO</td></tr>`
    }

    document.body.appendChild(carro)
    let btnComprar=document.createElement("button")
    btnComprar.innerHTML="Comprar"
    btnComprar.setAttribute("Class","btn btn-success")
    btnComprar.setAttribute("Id","btnComprar")
    document.body.appendChild(btnComprar)
    btnComprar.onclick= function () {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Has realizado la compra con éxito!',
            showConfirmButton: false,
            timer: 1500
        })
        localStorage.removeItem("Carro")
    }
}

let volver=document.querySelector("#btnVolver")

volver.onclick= function () {
    window.location.href = "index.html";
}
