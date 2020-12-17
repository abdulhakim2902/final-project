const router = require('express').Router();
const isLogin = require('../middleware/auth')
const Controller = require('../controllers/UserControllers')
const studentRouter = require('./studentRouter');

router.get('/', Controller.homepage)
router.get('/login', Controller.homepage)
router.post('/login', Controller.login)

router.get('/register', Controller.register)
router.post('/register', Controller.addUser)

router.use(isLogin)
router.use('/students', studentRouter)

module.exports = router;