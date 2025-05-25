package com.crud.crud;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private Map<Long, Producto> productos = new HashMap<>();
    private AtomicLong idGen = new AtomicLong();

    public ProductoController() {
        Producto demo = new Producto(1L, "Producto demo", "Ejemplo inicial", 5, 99.99);
        productos.put(1L, demo);
    }

    @GetMapping
    public Collection<Producto> listarProductos() {
        return productos.values();
    }

    @GetMapping("/{id}")
    public Producto obtenerProducto(@PathVariable Long id) {
        return productos.get(id);
    }

    @PostMapping
    public String crearProducto(@RequestBody Producto producto) {
        if (producto.getPrecio() <= 0 || producto.getCantidad() < 0) {
            return "Error: Precio debe ser mayor a 0 y la cantidad no puede ser negativa.";
        }
        long id = idGen.incrementAndGet();
        producto.setId(id);
        producto.setEstado(producto.getCantidad() > 0 ? "Disponible" : "Agotado");
        productos.put(id, producto);
        return "Producto creado con ID: " + id;
    }

    @PutMapping("/{id}")
    public String actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        if (!productos.containsKey(id)) return "Producto no encontrado.";
        if (producto.getPrecio() <= 0 || producto.getCantidad() < 0)
            return "Error: Precio debe ser mayor a 0 y la cantidad no puede ser negativa.";
        producto.setId(id);
        producto.setEstado(producto.getCantidad() > 0 ? "Disponible" : "Agotado");
        productos.put(id, producto);
        return "Producto actualizado correctamente.";
    }

    @DeleteMapping("/{id}")
    public String eliminarProducto(@PathVariable Long id) {
        if (!productos.containsKey(id)) return "Producto no encontrado.";
        productos.remove(id);
        return "Producto eliminado.";
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> estadisticas() {
        int total = productos.size();
        double promedio = productos.values().stream().mapToDouble(Producto::getPrecio).average().orElse(0);
        long disponibles = productos.values().stream().filter(p -> "Disponible".equals(p.getEstado())).count();
        long agotados = total - disponibles;

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("Total", total);
        resultado.put("PromedioPrecios", promedio);
        resultado.put("Disponibles", disponibles);
        resultado.put("Agotados", agotados);
        return resultado;
    }
}
