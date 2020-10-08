const Sequelize = require('sequelize');
const db = require('../config/db');

const Category = db.define('categories', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    slug: Sequelize.TEXT
}, {
    timestamps : false
});

module.exports = Category;

