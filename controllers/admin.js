const Group = require('../models/Group');
const Meet = require('../models/Meet');
const moment = require('moment');

exports.getAdminPanel = async (req, res) => {
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
                userId: req.user.id
            }
        })
    )
    const [ groups, meets ] = await Promise.all(queries);
    res.render('adminPanel', {
        pageName: 'Panel de administración',
        groups,
        meets,
        moment
    });
}