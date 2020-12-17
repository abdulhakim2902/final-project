const isLogin = (req, res, next) => {
    if (req.session.userId) {
        next()
    } else {
        res.redirect(`/login?msg=${JSON.stringify([{ login: 'You need to login first!' }])}`)
    }
}

const sessionChecker = (req, res, next) => {
    if (req.session.userId) {
        let id = req.session.userId
        res.redirect(`/students?id=${id}`)
    } else {
        next()
    }
}

module.exports = {sessionChecker, isLogin};