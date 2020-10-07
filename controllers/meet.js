const Group = require('../models/Group');
const Meet = require('../models/Meet');

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

exports.newMeet = async (req, res) => {
    const meet = req.body;
    meet.userId = req.user.id;
    meet.location = [req.body.lat, req.body.lng];
    if(req.body.quota === ''){
        meet.quota = 0;
    }
    try {
        await Meet.create(meet);
        req.flash('exito', 'El evento se creó correctamente');
        return res.redirect('/admin');
    } catch (error) {
        console.log('como va');
        console.log(error);
        console.log('hao');
        const sequelizeErrors = error.errors.map( error => error.message);
        req.flash('error', sequelizeErrors);
        res.redirect('/newMeet');
    }
    console.log(meet);
}