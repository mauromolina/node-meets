const express = require('express');
require('dotenv').config({ path: 'variables.env'});
const router = require('./routes');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const passport = require('./config/passport');
const db = require('./config/db');
require('./models/User');
require('./models/Group');
require('./models/Category');
require('./models/Meet');

db.sync().then( () => {
    console.log('DB conectada');
}).catch( (error) => {
    console.log(error)
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(expressValidator());

app.use(expressLayouts)
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './views'));

app.use(express.static('public'));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = {...req.user} || null;
    res.locals.msg = req.flash();
    const date = new Date();
    res.locals.year = date.getFullYear();
    next();
});

app.use('/', router());


app.listen(process.env.PORT, () => {
    console.log('El servidor funciona, todo OK');
})