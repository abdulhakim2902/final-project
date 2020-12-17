const express = require('express')
const routes = require('./routes')
const session = require('express-session')
const formatBirth = require('./helpers/formatBirth')
const app = express();
const port = process.env.PORT || 3000;

app.use(session({
    secret: 'hacktiv8',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))
app.locals.formatBirth = formatBirth;
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))

app.use(routes);

app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
})