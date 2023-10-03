const { Product } = require('./models');

class ProductManager {
    

    async agregarProducto(producto) {
        try {
            const nuevoProducto = new Product(producto);
            await nuevoProducto.save();
            return nuevoProducto;
        } catch (error) {
            throw new Error('Error al agregar el producto.');
        }
    }

    async obtenerProductos({ categoria, disponibilidad, limit = 10, page = 1, sort }) {
        try {
            let query = {};
            if (categoria) {
                query.categoria = categoria;
            }
            if (disponibilidad) {
                query.disponibilidad = disponibilidad;
            }

            const productos = await Product.find(query)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort(sort);

            return productos;
        } catch (error) {
            throw new Error('Error al obtener los productos.');
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const producto = await Product.findById(id);
            if (producto) {
                return producto;
            } else {
                throw new Error('Producto no encontrado.');
            }
        } catch (error) {
            throw new Error('Error al obtener el producto.');
        }
    }

    async actualizarProducto(id, nuevosDatos) {
        try {
            const productoActualizado = await Product.findByIdAndUpdate(id, nuevosDatos, { new: true });
            if (productoActualizado) {
                return productoActualizado;
            } else {
                throw new Error('Producto no encontrado.');
            }
        } catch (error) {
            throw new Error('Error al actualizar el producto.');
        }
    }

    async eliminarProducto(id) {
        try {
            const productoEliminado = await Product.findByIdAndDelete(id);
            if (productoEliminado) {
                return productoEliminado;
            } else {
                throw new Error('Producto no encontrado.');
            }
        } catch (error) {
            throw new Error('Error al eliminar el producto.');
        }
    }
}

module.exports = ProductManager;
