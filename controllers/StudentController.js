const {User, Course, UserCourse} = require('../models');

class Controller {
    static viewStudentPage(req, res) {
        let id = +req.query.id;

        User.findByPk(id, {
            include: Course
        })
            .then(student => res.render('studentPage/student-page', { student, id }))
            .catch(err => res.redirect('/login'))

        
    }

    static viewCourses(req, res) {
        let id = +req.query.id;
        let errors = '';

        if (req.query.err) {
            errors = req.query.err;
        }

        Course.findAll()
            .then(courses => res.render('studentPage/courses-page', { courses, id, errors }))
            .catch(err => res.send(err))

    }

    static takeCourse(req, res) {
        let user_id = +req.query.id;
        let course_id = +req.query.course_id;
        let totalCredit = 0;

        Course.findOne({where: {id: course_id}, include: User})
        .then(course => {
            let maxStudent = +course.max_students;
            let numStudents = +course.Users.length;

            if (numStudents < maxStudent) {
                return User.findByPk(user_id, {
                    include: Course
                })
            } else {
                res.redirect(`/students/courses?id=${user_id}&err=The class is full`)
            }
        })
        .then(user => {
            // console.log(user);
            if (user.Courses.length === 0) {
                totalCredit = 0;
            } else {
                user.Courses.forEach(course => {
                    totalCredit += +course.credits;
                })
            }

            if (totalCredit < 24) {
                return Course.findByPk(course_id)
            } else {
                res.redirect(`/students/courses?id=${user_id}&err=You have taken to much credits5`)
            }
        })
        .then(course => {
            // console.log(course);
            totalCredit += course.credits;
            if (totalCredit < 24 || course === null) {
                // console.log('hey');
                return UserCourse.findOne({
                    where: {
                        user_id,
                        course_id: course.id
                    }
                })
            } else {
                
                res.redirect(`/students/courses?id=${user_id}&err=You have taken to much credits`)
            }
        })
        .then(userCourse => {
            // console.log(userCourse);
            if (userCourse === null ) {
                return UserCourse.create({ user_id, course_id})
            } else {
                res.redirect(`/students/courses?id=${user_id}&err=You have taken courses this course`)
            }
        })
        .then(() => {
                res.redirect(`/students/courses?id=${user_id}`)
            
        })
        .catch(err => res.send(err))
    }

    static cancelCourse(req, res) {
        let user_id = +req.query.id;
        let course_id = +req.query.course_id;

        UserCourse.destroy({
            where: {
                user_id,
                course_id
            }
        })
            .then(() => res.redirect(`/students?id=${user_id}`))
            .catch(err => res.send(err))
    }

    static detail (req, res) {
        let user_id = req.query.id;
        let course_id = req.query.course_id;

        Course.findOne({where: {id: course_id}, include: User})
            .then(course => {
                console.log(course.Users);
                res.render('studentPage/detail-page', {course, id: user_id})
            })
    }

    static profile(req, res) {
        let id = req.query.id;

        User.findByPk(id)
            .then(student => {
                // let editStudent = {
                //     fullname: student.fullname(),
                //     email: student.email,
                //     gender: student.gender,
                //     birth_place
                // }
                res.render('studentPage/profile-page', {student, id})}
            )
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
            gender: req.body.gender
        }

        User.update(editStudent, {where: {id}})
            .then(() => res.redirect(`/students/profile?id=${id}`))
            .catch(err => res.send(err))

    }
}

module.exports = Controller;