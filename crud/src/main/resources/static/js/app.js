const API_URL = "/productos";

function cargarProductos() {
    fetch(API_URL)
        .then(res => res.json())
        .then(productos => {
            const tabla = document.getElementById("tabla-productos");
            tabla.innerHTML = "";
            productos.forEach(p => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${p.id}</td>
                    <td>${p.nombre}</td>
                    <td>${p.descripcion}</td>
                    <td>${p.cantidad}</td>
                    <td>$${p.precio}</td>
                    <td style="color:${p.estado === 'Disponible' ? 'green' : 'red'}">${p.estado}</td>
                    <td>
                        <button onclick="editarProducto(${p.id})">Editar</button>
                        <button onclick="eliminarProducto(${p.id})">Eliminar</button>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        });

    cargarEstadisticas();
}

function cargarEstadisticas() {
    fetch(API_URL + "/estadisticas")
        .then(res => res.json())
        .then(stats => {
            document.getElementById("estadisticas").innerHTML = `
                <p><strong>Total de productos:</strong> ${stats.Total}</p>
                <p><strong>Promedio de precios:</strong> $${stats.PromedioPrecios.toFixed(2)}</p>
                <p><strong>Disponibles:</strong> ${stats.Disponibles}</p>
                <p><strong>Agotados:</strong> ${stats.Agotados}</p>
            `;
        });
}

document.getElementById("formulario-producto").addEventListener("submit", function(e) {
    e.preventDefault();
    const id = document.getElementById("producto-id").value;
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const precio = parseFloat(document.getElementById("precio").value);
    const errorMsg = document.getElementById("error-msg");

    if (precio <= 0 || cantidad < 0) {
        errorMsg.textContent = "Error: El precio debe ser mayor a 0 y la cantidad no puede ser negativa.";
        return;
    }

    const producto = { nombre, descripcion, cantidad, precio };

    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? "PUT" : "POST";

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        cargarProductos();
        document.getElementById("formulario-producto").reset();
        document.getElementById("producto-id").value = "";
        errorMsg.textContent = "";
    });
});

function editarProducto(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(producto => {
            document.getElementById("producto-id").value = producto.id;
            document.getElementById("nombre").value = producto.nombre;
            document.getElementById("descripcion").value = producto.descripcion;
            document.getElementById("cantidad").value = producto.cantidad;
            document.getElementById("precio").value = producto.precio;
            window.scrollTo(0, 0);
        });
}

function eliminarProducto(id) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(res => res.text())
            .then(msg => {
                alert(msg);
                cargarProductos();
            });
    }
}

// Cargar productos iniciales
cargarProductos();
