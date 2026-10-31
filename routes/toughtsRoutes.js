const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtController')

//helper (middleware de Auth)
const checkAuth = require('../middlewares/auth').checkAuth;

router.get('/dashboard', checkAuth, ToughtController.dashboard);
router.get('/add', checkAuth, ToughtController.createTought);
router.post('/add', checkAuth, ToughtController.createToughtPost);
router.post('/remove', checkAuth, ToughtController.removeTought);
router.get('/edit/:id', checkAuth, ToughtController.updateTought);
router.post('/edit', checkAuth, ToughtController.updateToughtPost);
router.get('/', ToughtController.showToughts);

module.exports = router;