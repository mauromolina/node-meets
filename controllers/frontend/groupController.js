const User = require('../../models/User')
const Group = require('../../models/Group');
const Meet = require('../../models/Meet');
const moment = require('moment');

exports.getGroupDetails = async (req, res, next) => {
    const queries = [];

    queries.push(
        await Group.findOne({
            where: {
                id: req.params.id
            }
        })
    );
    queries.push(
        await Meet.findAll({
            where: {
                groupId: req.params.id
            },
            order : [
                ['date', 'ASC'],
                ['time', 'ASC']
            ]
        })
    );
    
    const [ group, meets ] = await Promise.all(queries);
    
    if(!group){
        res.redirect('/');
        return next();
    }


    res.render('groupDetail', {
        pageName: `Detalles del grupo: ${group.name}`,
        group,
        meets,
        moment
    });
}