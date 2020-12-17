const router = require('express').Router();
const Controller = require('../controllers/UserControllers')
const studentRouter = require('./studentRouter');
const {sessionChecker, isLogin} = require('../middleware/auth')

router.use('/students', isLogin, studentRouter)

router.use(sessionChecker)
router.get('/', Controller.homepage)
router.get('/login', Controller.homepage)
router.post('/login', Controller.login)

router.get('/register', Controller.register)
router.post('/register', Controller.addUser)

module.exports = router;