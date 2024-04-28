const socket = io(); 

socket.on("productos", (data) => {
    renderProductos(data);
})

//Función para renderizar nuestros productos: 

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    productos.docs.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("mb-3");

        card.innerHTML = ` 
                        <h5 class="card-title">Producto: ${item.title}</h5>
                        <p class="card-text">Descripción: ${item.description}</p>
                        <p class="card-text">Categoria: ${item.category}</p>
                        <p class="card-text">Stock: ${item.stock}</p>
                        <p class="card-text">Precio: ${item.price}</p>
                        <button class="btn btn-danger"> Eliminar </button>
                        `;
        contenedorProductos.appendChild(card);
        //Agregamos el evento al boton de eliminar: 
        card.querySelector("button").addEventListener("click", ()=> {
            eliminarProducto(item._id);
        })
    })
}


const eliminarProducto = (id) =>  {
    socket.emit("eliminarProducto", id);
}

//Agregamos productos del formulario: 

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
})


const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    };

    socket.emit("agregarProducto", producto);
}
