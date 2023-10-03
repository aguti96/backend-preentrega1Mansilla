const { Cart } = require('./models');

class CartManager {
    

    async createCart() {
        try {
            const nuevoCarrito = new Cart({
                products: []
            });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            throw new Error('Error al crear el carrito.');
        }
    }

    async getCartById(cartId) {
        try {
            const carrito = await Cart.findById(cartId).populate('products.product');
            if (carrito) {
                return carrito;
            } else {
                throw new Error('Carrito no encontrado.');
            }
        } catch (error) {
            throw new Error('Error al obtener el carrito.');
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const carrito = await Cart.findById(cartId);
            if (carrito) {
                const existingProduct = carrito.products.find(product => product.product.toString() === productId);
                if (existingProduct) {
                    existingProduct.quantity += quantity;
                } else {
                    carrito.products.push({ product: productId, quantity });
                }
                await carrito.save();
                return carrito;
            } else {
                throw new Error('Carrito no encontrado.');
            }
        } catch (error) {
            throw new Error('Error al agregar producto al carrito.');
        }
    }

    async getCarts() {
        try {
            const carritos = await Cart.find().populate('products.product');
            return carritos;
        } catch (error) {
            throw new Error('Error al obtener los carritos.');
        }
    }
}

module.exports = CartManager;
