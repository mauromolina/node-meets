const Group = require('../models/Group');

exports.getAdminPanel = async (req, res) => {
    const groups = await Group.findAll({
        where: {
            userId: req.user.id
        }
    })
    res.render('adminPanel', {
        pageName: 'Panel de administración',
        groups
    })
}