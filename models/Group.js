const Sequelize = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid/v4');
const Category = require('./Category');
const User = require('./User');

const Group = db.define('groups', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(100),
        validate: {
            notEmpty: {
                msg: 'El nombre de grupo es obligatorio'
            }
        }
    },
    description: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'La descripción del grupo es obligatoria'
            }
        }
    },
    creationDate: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
    },
    url: Sequelize.STRING,
    image: Sequelize.STRING
});

Group.belongsTo(Category);
Group.belongsTo(User);

module.exports = Group;
