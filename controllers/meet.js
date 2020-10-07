const Group = require('../models/Group');

exports.newMeetForm = async (req, res) => {
    const groups = await Group.findAll({
        where: {
            userId: req.user.id
        }
    })
    res.render('newMeet', {
        pageName: 'Nuevo evento',
        groups
    })
}