const Category = require('../models/Category');
const Meet = require('../models/Meet');
const Group = require('../models/Group');
const moment = require('moment');
const Sequelize = require('sequelize');
const User = require('../models/User');
const Op = Sequelize.Op;

exports.home = async (req, res) => {
    const queries = [];
    queries.push(
        await Category.findAll({})
    );
    queries.push(
        await Meet.findAll({
            attributes: ['slug', 'title', 'date', 'time'],
            where: {
                date: {
                    [Op.gte]: moment(new Date()).format("YYYY-MM-DD")
                }
            },
            order: [
                ['date', 'ASC'],
                ['time', 'ASC']
            ],
            limit: 3,
            include: [
                {
                    model: Group,
                    attributes: ['image']
                },
                {
                    model: User,
                    attributes: ['name', 'image']
                }
            ]
        })
    );
    const [ categories, meets ] = await Promise.all(queries);
    res.render('home', {
        pageName: 'Inicio',
        categories,
        meets,
        moment
    });
};