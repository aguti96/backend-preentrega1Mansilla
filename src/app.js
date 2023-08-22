const express = require('express');
const { ProductManager } = require('./src/ProductManager'); 

const app = express();
const PORT = process.env.PORT || 3000;

const gestorProductos = new ProductManager('./data/productos.json'); 

app.get('/products', async (req, res) => {
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

app.get('/products/:pid', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
