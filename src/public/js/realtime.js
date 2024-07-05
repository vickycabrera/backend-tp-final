const socket = io(); 
const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;

socket.on("productos", (data) => {
    renderProductos(data);
})

socket.on("error", (error) => {
    console.log("error", error)
    Swal.fire({
        title: "Hubo un error", 
        icon: "error",
        text: error.cause, 
        allowOutsideClick: false,
    })
})

socket.on("productoAgregado", (producto) => {
    Swal.fire({
        title: "Producto creado", 
        icon: "success",
        allowOutsideClick: true,
    }).then(()=>{
    const formulario = document.getElementById("formularioAgregarProductos");
    // Resetear el formulario
    formulario.reset();
    })
})

//Función para renderizar nuestros productos: 
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    contenedorProductos.classList.add("row","justify-content-center");

    let maxHeight = 400;

    productos.docs.forEach(item => {
        const cardContainer = document.createElement("div");
        // Controla el tamaño de las columnas en diferentes tamaños de pantalla
        cardContainer.classList.add("col-sm-6", "col-md-4", "col-lg-3");

        const card = document.createElement("div");
        card.classList.add("card", "m-3", "p-2");

        card.innerHTML = ` 
                        <h5 class="card-title">Producto: ${item.title}</h5>
                        <p class="card-text">Descripción: ${item.description}</p>
                        <p class="card-text">Categoria: ${item.category}</p>
                        <p class="card-text">Stock: ${item.stock}</p>
                        <p class="card-text">Precio: ${item.price}</p>
                        <button class="btn btn-danger"> Eliminar </button>
                        `;
        cardContainer.appendChild(card);
        contenedorProductos.appendChild(cardContainer);
        //Agregamos el evento al boton de eliminar: 
        card.querySelector("button").addEventListener("click", ()=> {
            if (role === "premium" && item.owner === email) {
                eliminarProducto(item._id);
            } else if (role === "admin") {
                eliminarProducto(item._id);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No tenes permiso para borrar ese producto",
                })
            }
        })
        
        // Establecer la misma altura para todas las cards
        contenedorProductos.querySelectorAll('.card').forEach(card => {
            card.style.height = `${maxHeight}px`;
        });
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
    const role = document.getElementById("role").textContent;
    const email = document.getElementById("email").textContent;

    const owner = role === "premium" ? email : "admin";

    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner
    };

    socket.emit("agregarProducto", producto);
}
