const Group = require('../../models/Group');
const Meet = require('../../models/Meet');
const User = require('../../models/User');
const moment = require('moment')
const Sequelize = require('sequelize');


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

exports.confirmAssistance = async (req, res) => {
    const meet = await Meet.findOne({
        where: {
            slug: req.params.meetSlug
        }
    });
    const { action } = req.body;
    if(action === 'confirm'){
        const interested = [];
        if(meet.interested != ''){
            meet.interested.forEach( int => interested.push(int));
        }
        interested.push(req.user.id);
        meet.interested = interested;
    } else {
        const userId = req.user.id.toString();
        const index = meet.interested.indexOf(userId);
        meet.interested = meet.interested.splice(index - 1, 1);
    }
    console.log(meet);
    await meet.save();
    res.redirect('back');
}