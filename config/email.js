require('dotenv').config({
    path: 'variables.env'
});

module.exports = {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASS,
    host: process.env.EMAILHOST,
    port: process.env.EMAILPORT    
}