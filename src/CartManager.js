const fs = require('fs');

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.carts = this.getCartsFromFile();
        this._nextCartId = 1;
    }

    getNextCartId() {
        return this._nextCartId++;
    }

    createCart() {
        const cart = {
            id: this.getNextCartId(),
            products: []
        };

        this.carts.push(cart);
        this.saveCartsToFile();
        return cart;
    }

    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    addProductToCart(cartId, productId, quantity = 1) {
        const cart = this.getCartById(cartId);
        if (cart) {
            const existingProduct = cart.products.find(product => product.id === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ id: productId, quantity });
            }
            this.saveCartsToFile();
            return cart;
        }
        return null;
    }

    getCarts() {
        return this.carts;
    }

    getCartsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    saveCartsToFile() {
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
    }
}

module.exports = CartManager;
