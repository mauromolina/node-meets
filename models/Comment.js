const Sequelize = require('sequelize');
const db = require('../config/db');
const User = require('./User');
const Meet = require('./Meet');

const Comment = db.define('comments', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: Sequelize.TEXT,
    creationDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});

Comment.belongsTo(User);
Comment.belongsTo(Meet);

module.exports = Comment;