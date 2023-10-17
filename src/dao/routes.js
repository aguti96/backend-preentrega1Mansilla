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

// Rutas para autenticación y usuarios
router.get('/login', controllers.showLoginForm);
router.post('/login', controllers.loginUser);
router.get('/register', controllers.showRegisterForm);
router.post('/register', controllers.registerUser);
router.get('/logout', controllers.logoutUser);

// Ruta para productos en tiempo real
router.get('/realtimeproducts', controllers.getRealTimeProducts);

module.exports = router;
