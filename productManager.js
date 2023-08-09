class Producto {
    constructor(nombre, descripcion, precio, imagen, codigo, stock) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.codigo = codigo;
        this.stock = stock;
        this.id = Producto.obtenerSiguienteId();
    }

    static obtenerSiguienteId() {
        if (!this._siguienteId) {
            this._siguienteId = 1;
        } else {
            this._siguienteId++;
        }
        return this._siguienteId;
    }
}

// ESTO SERÍA UNA CLASE PARA GESTIONAR LOS PRODUCTOS
class GestorProductos {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto) {
        if (this.productos.some(p => p.codigo === producto.codigo)) {
            console.log("Ya existe un producto con el mismo código.");
            return;
        }

        const camposObligatorios = ['nombre', 'descripcion', 'precio', 'imagen', 'codigo', 'stock'];
        if (camposObligatorios.some(campo => !producto[campo])) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

        this.productos.push(producto);
    }

    obtenerProductos() {
        return this.productos;
    }

    obtenerProductoPorId(id) {
        const productoEncontrado = this.productos.find(producto => producto.id === id);
        if (productoEncontrado) {
            return productoEncontrado;
        } else {
            console.log("No se encontró el producto.");
        }
    }
}

// Esto sería un ejemplo de como utilizarlo
const gestorProductos = new GestorProductos();

const producto1 = new Producto("Producto 1", "Descripción 1", 10.99, "imagen1.jpg", "CODIGO1", 100);
const producto2 = new Producto("Producto 2", "Descripción 2", 19.99, "imagen2.jpg", "CODIGO2", 50);

gestorProductos.agregarProducto(producto1);
gestorProductos.agregarProducto(producto2);

console.log(gestorProductos.obtenerProductos());

const productoEncontrado = gestorProductos.obtenerProductoPorId(1); // Cambia el ID según el producto que quieras buscar
if (productoEncontrado) {
    console.log(productoEncontrado);
}
