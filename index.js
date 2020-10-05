const express = require('express');
require('dotenv').config({ path: 'variables.env'});
const router = require('./routes');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/db');

db.sync().then( () => {
    console.log('DB conectada');
}).catch( (error) => {
    console.log(error)
});

const app = express();

app.use(expressLayouts)
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './views'));

app.use(express.static('public'));

app.use((req, res, next) => {
    const date = new Date();
    res.locals.year = date.getFullYear();
    next();
});

app.use('/', router());


app.listen(process.env.PORT, () => {
    console.log('El servidor funciona, todo OK');
})