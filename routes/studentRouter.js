const router = require('express').Router();
const Controller = require('../controllers/StudentController')

router.get('/', Controller.viewStudentPage)
router.get('/courses', Controller.viewCourses)
router.get('/take', Controller.takeCourse)
router.get('/cancel', Controller.cancelCourse)
router.get('/detail', Controller.detail)

module.exports = router;