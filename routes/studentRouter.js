const router = require('express').Router();
const Controller = require('../controllers/StudentController')

router.get('/', Controller.viewStudentPage)
router.get('/courses', Controller.viewCourses)
router.get('/take', Controller.takeCourse)
router.get('/cancel', Controller.cancelCourse)
router.get('/detail', Controller.detail)
router.get('/profile', Controller.profile)

router.get('/edit', Controller.editForm)
router.post('/edit', Controller.editProfile)

module.exports = router;  