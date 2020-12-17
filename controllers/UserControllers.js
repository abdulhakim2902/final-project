const { User } = require('../models')
const { compare } = require('../helpers/bcrypt')

class Controller {
    static homepage(req, res) {
        let errors = {};

        if (req.query.msg) {
            errors = JSON.parse(req.query.msg)[0]
        }

        res.render('authPage/index', { errors })
    }

    static login (req, res) {
        let { username, password } = req.body;

        User.findOne({ where: { username } })
            .then(user => {
                if (user) {
                    const isValidPassword = compare(password, user.password);

                    if (isValidPassword) {
                        req.session.userId = user.id;
                        res.redirect(`/students?id=${user.id}`)
                    } else {
                        res.redirect(`/login?msg=${JSON.stringify([{ password: 'password incorect!' }])}`)
                    }
                } else {
                    res.redirect(`/login?msg=${JSON.stringify([{ username: "username doesn't exist!", password: 'password incorect!' }])}`)
                }
            })
            .catch(err => res.send(err))
    }

    static register(req, res) {
        res.render('authPage/register')
    }

    static addUser(req, res) {
        let newUser = {
            username: req.body.username,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            birth_place: req.body.birth_place,
            birth_date: req.body.birth_date,
            gender: req.body.gender
        }

        if (!newUser.gender) newUser.gender = '';

        User.create(newUser)
            .then(() => res.redirect('/login'))
            .catch(err => res.send(err))
    }
}

module.exports = Controller;