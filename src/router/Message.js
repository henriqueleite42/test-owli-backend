const router = require('express').Router();

// Controllers
const Message = require('../controllers/Message');

// Middlewares
const authMiddleware = require('../middleware/auth');
router.use(authMiddleware);

// Search
router.get('/search',  async (req, res) => res.json(await Message.search(req)));

// Create
router.post('/create', async (req, res) => res.json(await Message.create(req)));

// Update
router.put('/update', async (req, res) => {

});

module.exports = app => app.use('/message', router);