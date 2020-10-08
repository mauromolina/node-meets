const Sequelize = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid/v4');
const slug = require('slug');
const shortid = require('shortid');
const User = require('../models/User');
const Group = require('../models/Group');

const Meet = db.define('meets', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El título del evento es obligatorio'
            }
        }
    },
    slug :{
        type: Sequelize.STRING
    },
    guest: Sequelize.STRING,
    quota: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La descripción del evento es obligatoria'
            }
        }
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La fecha del evento es obligatoria'
            }
        }
    },
    time: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El horario del evento es obligatorio'
            }
        }
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La dirección del evento es obligatoria'
            }
        }
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La ciudad del evento es obligatoria'
            }
        }
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La localidad/estado del evento es obligatoria'
            }
        }
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El país del evento es obligatorio'
            }
        }
    },
    location: {
        type: Sequelize.STRING,
        get() {
            return this.getDataValue('location').split(',');
        },
        set(arr) {
            this.setDataValue('location', arr.join(','));
        }
    },
    interested: {
        type: Sequelize.STRING,
        get() {
            return this.getDataValue('interested').split(',');
        },
        set(arr) {
            this.setDataValue('interested', arr.join(','));
        },
        defaultValue: ''
    }

}, {
    hooks: {
        async beforeCreate(meet){
            const url = slug(meet.title).toLowerCase();
            meet.slug = `${url}-${shortid.generate()}`;
        } 
    }
});


Meet.belongsTo(User);
Meet.belongsTo(Group);
module.exports = Meet;