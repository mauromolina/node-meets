const Group = require('../models/Group');
const Meet = require('../models/Meet');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getAdminPanel = async (req, res) => {
    const date = moment(new Date()).format("YYYY-MM-DD");
    const queries = [];
    queries.push(
        await Group.findAll({
            where: {
                userId: req.user.id
            }
        })
    );
    queries.push(
        await Meet.findAll({
            where: {
                userId: req.user.id,
                date: {
                    [Op.gte]: moment(new Date()).format("YYYY-MM-DD")
                }
            }
        })
    );
    queries.push(
        await Meet.findAll({
            where: {
                userId: req.user.id,
                date: {
                    [Op.lt]: moment(new Date()).format("YYYY-MM-DD")
                }
            }
        })
    )
    const [ groups, nextMeets, previousMeets ] = await Promise.all(queries);
    res.render('adminPanel', {
        pageName: 'Panel de administración',
        groups,
        nextMeets,
        previousMeets,
        moment
    });
}