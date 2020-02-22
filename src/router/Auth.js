const router = require('express').Router();

// Controller
const Auth = require('../controllers/Auth');

// Auth
router.post('', async (req, res) => res.json(await Auth.auth(req)));

module.exports = app => app.use('/auth', router);