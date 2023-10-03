const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ProductManager = require('./productManager');
const CartManager = require('./CartManager');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const { Product, Cart, Message } = require('./models');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

mongoose.connect('mongodb+srv://mansillaagustin6:Supernova2576@cluster0.cxzkttl.mongodb.net/ecommerce?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conexión a MongoDB establecida.');
});

const gestorProductos = new ProductManager('./data/productos.json');
const gestorCarritos = new CartManager('./data/carrito.json');

app.get('/api/products/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || '';
        const query = req.query.query || '';

        let products = await Product.find()
            .limit(limit)
            .skip((page - 1) * limit);

        if (query) {
            products = products.filter(product => product.category === query || product.availability === query);
        }

        if (sort === 'asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            products.sort((a, b) => b.price - a.price);
        }

        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        const response = {
            status: 'success',
            payload: products,
            totalPages: totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage ? `/api/products/?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: hasNextPage ? `/api/products/?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

app.get('/api/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await Product.findById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});

app.get('/api/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products.product');
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito.' });
    }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        let cart = await Cart.findById(cartId);
        if (!cart) {
            cart = new Cart();
        }

        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { productos: products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

io.on('connection', (socket) => {
    console.log('Cliente WebSocket conectado');

    socket.on('disconnect', () => {
        console.log('Cliente WebSocket desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
