const isLogin = (req, res, next) => {
    if (req.session.userId) {
        next()
    } else {
        res.redirect(`/login?msg=${JSON.stringify([{ login: 'You need to login first!' }])}`)
    }
}

module.exports = isLogin;