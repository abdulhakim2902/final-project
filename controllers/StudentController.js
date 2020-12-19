const {User, Course, UserCourse} = require('../models');
const {Op} = require('sequelize')

class Controller {
    static viewStudentPage(req, res) {
        let id = +req.query.id;
        let totalCredit;

        User.totalCredits(Course, id) 
            .then(total => {
                totalCredit = total;

                return User.findOne({
                    where: { id },
                    include: [{
                        model: Course,
                        through: {
                            where: {
                                is_taken: true
                            }
                        }
                    }],
                })
            })
            .then(student => res.render('studentPage/student-page', {student, id, totalCredit}))
            .catch(err => res.redirect('/login'))
    }

    static viewCourses(req, res) {
        let id = +req.query.id;
        let errors = '';

        if (req.query.err) {
            errors = req.query.err;
        }

        let untakeCourses = []

        Course.findAll({
            include: {
                model: User,
                through: {
                    where: {
                        user_id: id
                    },
                    attributes: ['is_taken']
                }
            }
        })
            .then(courses => {
                courses.forEach(course => {
                    if (course.Users.length == 0) {
                        untakeCourses.push(course)
                    } else if (!course.Users[0].UserCourses.dataValues.is_taken) {
                        untakeCourses.push(course)
                    }
                })
            
                res.render('studentPage/courses-page', { courses: untakeCourses, id, errors })
            })
            .catch(err => res.send(err))

    }

    static takeCourse(req, res) {
        let user_id = +req.query.id;
        let course_id = +req.query.course_id;
        let totalCredit = 0;

        User.totalCredits(Course, user_id)
            .then(total => {
                
                if (total < 24) {
                    totalCredit = total;
                    return Course.findOne({
                        where: {
                            id: course_id
                        }
                    })
                } else {
                    throw new Error('You have taken too much credits')
                }
            })
            .then(course => {
                totalCredit += +course.credits;

                if (totalCredit <= 24) {
                    return UserCourse.findOne({
                        where: {
                            user_id,
                            course_id
                        }
                    })
                } else {
                    throw new Error('You cannot add more credits')
                }
            })
            .then(userCourse => {
                if (userCourse === null) {
                    return UserCourse.create({user_id, course_id, is_taken: true})
                } else {
                    return UserCourse.update({is_taken: true}, {
                        where: {
                            id: userCourse.id
                        }
                    })
                }
            })
            .then(() => res.redirect(`/students/courses?id=${user_id}`))
            .catch(err => res.redirect(`/students/courses?id=${user_id}&err=${err.message}`))
    }

    static cancelCourse(req, res) {
        let user_id = +req.query.id;
        let course_id = +req.query.course_id;

        UserCourse.update({is_taken: false}, {where:{
            user_id,
            course_id
        }})
            .then(() => res.redirect(`/students?id=${user_id}`))
            .catch(err => res.send(err))
    }

    static detail (req, res) {
        let user_id = req.query.id;
        let course_id = req.query.course_id;

        Course.findOne({where: {id: course_id}, include: User})
            .then(course => {
                res.render('studentPage/detail-page', {course, id: user_id})
            })
            .catch(err => res.send(err))
    }

    static profile(req, res) {
        let id = req.query.id;

        User.findByPk(id)
            .then(student => { res.render('studentPage/profile-page', {student, id})})
            .catch(err => res.send(err))
    }

    static editForm(req, res) {
        let id = +req.query.id;

        User.findByPk(id)
            .then(student => res.render('studentPage/editForm-page', {student}))
            .catch(err => res.send(err))
    }

    static editProfile(req, res) {
        let id = +req.query.id;
        let editStudent = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            birth_place: req.body.birth_place,
            birth_date: req.body.birth_date,
            gender: req.body.gender,
            img: req.file.filename
        }

        User.update(editStudent, {where: {id}})
            .then(() => res.redirect(`/students/profile?id=${id}`))
            .catch(err => res.send(err))

    }

    static logout(req, res) {

        if (req.session.userId){
            delete req.session.userId;
            res.redirect('/')
        }

    }
}

module.exports = Controller;