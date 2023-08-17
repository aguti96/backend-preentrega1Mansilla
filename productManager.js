const fs = require('fs');

class GestorProductos {
    constructor(filePath) {
        this.path = filePath;
        this.productos = this.getProductsFromFile();
        this._siguienteId = 1;
    }

    obtenerSiguienteId() {
        return this._siguienteId++;
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

        producto.id = this.obtenerSiguienteId();
        this.productos.push(producto);
        this.saveProductsToFile();
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

    actualizarProducto(id, nuevosDatos) {
        const index = this.productos.findIndex(producto => producto.id === id);
        if (index !== -1) {
            this.productos[index] = { ...this.productos[index], ...nuevosDatos };
            this.saveProductsToFile();
            return this.productos[index];
        }
        return null;
    }

    eliminarProducto(id) {
        this.productos = this.productos.filter(producto => producto.id !== id);
        this.saveProductsToFile();
    }

    getProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    saveProductsToFile() {
        fs.writeFileSync(this.path, JSON.stringify(this.productos, null, 2));
    }
}

module.exports = GestorProductos;
