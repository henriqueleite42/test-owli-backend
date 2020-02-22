const router = require('express').Router();

// Controller
const User = require('../controllers/User');

// Middlewares
const authMiddleware = require('../middleware/auth');

// Search
router.get('/search', authMiddleware, async (req, res) => res.json(await User.search(req)));

// Create
router.post('/create', async (req, res) => res.json(await User.create(req)));

// Update
router.put('/update', async (req, res) => res.json(await User.update(req)));

// Delete
router.delete('/delete', authMiddleware, async (req, res) => res.json(await User.delete(req)));

// Check Token
router.get('/checkToken', authMiddleware, async (req, res) => res.json({ status: 200 }));

module.exports = app => app.use('/user', router);