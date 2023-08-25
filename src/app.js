const express = require('express');
const bodyParser = require('body-parser');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

const gestorProductos = new ProductManager('./data/productos.json');
const gestorCarritos = new CartManager('./data/carrito.json');

app.get('/api/products/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const productos = await gestorProductos.obtenerProductos();

        if (!isNaN(limit)) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

app.get('/api/products/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const producto = await gestorProductos.obtenerProductoPorId(pid);

        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});

app.get('/api/carts/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const carrito = await gestorCarritos.obtenerCarritoPorId(cid);

        if (carrito) {
            const productosCarrito = await Promise.all(carrito.products.map(async (item) => {
                const producto = await gestorProductos.obtenerProductoPorId(item.product);
                return { product: producto, quantity: item.quantity };
            }));

            res.json(productosCarrito);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos del carrito.' });
    }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;

        const carrito = await gestorCarritos.obtenerCarritoPorId(cid);
        const producto = await gestorProductos.obtenerProductoPorId(pid);

        if (!carrito) {
            res.status(404).json({ error: 'Carrito no encontrado.' });
            return;
        }

        if (!producto) {
            res.status(404).json({ error: 'Producto no encontrado.' });
            return;
        }

        const itemExistente = carrito.products.find((item) => item.product === pid);
        if (itemExistente) {
            itemExistente.quantity += quantity;
        } else {
            carrito.products.push({ product: pid, quantity: quantity });
        }

        await gestorCarritos.actualizarCarrito(cid, carrito);

        res.json({ message: 'Producto agregado al carrito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
