const Group = require('../../models/Group');
const Meet = require('../../models/Meet');
const User = require('../../models/User');
const moment = require('moment')


exports.showMeet = async (req, res) => {
    const meet = await Meet.findOne({
        where: {
            slug: req.params.slug
        },
        include: [
            {
                model: Group
            },
            {
                model: User,
                attributes: ['id', 'name', 'image']
            }
        ]
    });
    if(!meet){
        res.redirect('/')
    }
    res.render('meet', {
        pageName: meet.title,
        meet,
        moment
    })
}