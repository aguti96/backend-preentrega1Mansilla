const { Product, Cart, Message } = require('../models');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos.' });
    }
  },

  getProductById: async (req, res) => {
    const productId = req.params.pid;
    try {
      const product = await Product.findById(productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto.' });
    }
  },

  getFilteredProducts: async (req, res) => {
    const { category, available, page = 1, limit = 10, sort } = req.query;
    const query = {};
    if (category) {
      query.category = category;
    }
    if (available) {
      query.available = available === 'true';
    }

    try {
      let products = Product.find(query)
        .skip((page - 1) * limit)
        .limit(limit);

      if (sort) {
        const sortOrder = sort === 'asc' ? 1 : -1;
        products = products.sort({ price: sortOrder });
      }

      const totalProducts = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const nextPage = hasNextPage ? parseInt(page) + 1 : null;
      const prevPage = hasPrevPage ? parseInt(page) - 1 : null;

      res.json({
        status: 'success',
        payload: await products.exec(),
        totalPages,
        prevPage,
        nextPage,
        page: parseInt(page),
        hasPrevPage,
        hasNextPage,
        prevLink: prevPage ? `/api/products?page=${prevPage}&limit=${limit}` : null,
        nextLink: nextPage ? `/api/products?page=${nextPage}&limit=${limit}` : null,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos.' });
    }
  },
};

const cartController = {
  getCartById: async (req, res) => {
    const cartId = req.params.cid;
    try {
      const cart = await Cart.findById(cartId).populate('products.product');
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ error: 'Carrito no encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el carrito.' });
    }
  },

  addToCart: async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
      }

      let cart = await Cart.findById(cartId);
      if (!cart) {
        cart = new Cart();
      }

      const existingProduct = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
    }
  },

  
};

const messageController = {
  getAllMessages: async (req, res) => {
    try {
      const messages = await Message.find();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los mensajes.' });
    }
  },

  createMessage: async (req, res) => {
    const { user, message } = req.body;
    try {
      const newMessage = new Message({ user, message });
      await newMessage.save();
      res.json(newMessage);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el mensaje.' });
    }
  },
};

module.exports = { productController, cartController, messageController };
