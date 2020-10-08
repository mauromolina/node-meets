const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');

const User = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Es obligatorio que indiques tu nombre'
            }
        }
    },
    image: Sequelize.STRING(60),
    description: {
        type: Sequelize.TEXT
    },
    email: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un email válido'
            },
            notEmpty: {
                msg: 'El email es obligatorio'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        } 
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña es obligatoria'
            }
        }
    },
    active: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expires: Sequelize.STRING

}, {
    hooks: {
        beforeCreate(user) {
            user.password = user.prototype.hashPassword(user.password)
        }
    }
});

User.prototype.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

User.prototype.hashPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = User;