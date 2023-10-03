const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

// Rutas para productos
router.get('/api/products', controllers.getFilteredProducts);
router.get('/api/products/:pid', controllers.getProductById);

// Rutas para carritos
router.post('/api/carts', controllers.createCart);
router.get('/api/carts/:cid', controllers.getCartById);
router.post('/api/carts/:cid/products/:pid', controllers.addProductToCart);

// Ruta para productos en tiempo real
router.get('/realtimeproducts', controllers.getRealTimeProducts);

module.exports = router;
