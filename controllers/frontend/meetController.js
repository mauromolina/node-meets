const Group = require('../../models/Group');
const Meet = require('../../models/Meet');
const User = require('../../models/User');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const moment = require('moment')
const Sequelize = require('sequelize');
const { where } = require('sequelize');


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

    const comments = await Comment.findAll({
        where: {
            meetId: meet.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'name', 'image']
            }
        ]
    });
    res.render('meet', {
        pageName: meet.title,
        meet,
        comments,
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

exports.getMeetAssistants = async (req, res) => {
    const meet = await Meet.findOne({
        where: {
            slug: req.params.meetSlug
        },
        attributes: [
            'interested'
        ]
    });
    const { interested } = meet;
    const assistants = await User.findAll({
        attributes: ['name', 'image'],
        where: {
            id: interested
        }
    });
    res.render('assistants', {
        pageName: 'Listado de Asistentes',
        assistants
    });
}

exports.getCategoryGroups = async (req, res, next) => {
    const category = await Category.findOne({
        where: {
            slug: req.params.category
        },
        attributes: ['id', 'name']
    })
    const meets = await Meet.findAll({
        order: [
            ['date', 'ASC'],
            ['time', 'ASC']
        ],
        include: [
            {
                model: Group,
                where: { categoryId: category.id}
            },
            {
                model: User
            }
        ]
    });

    res.render('category', {
        pageName: `Categoría: ${category.name}`,
        meets,
        moment,
        name: category.name
    });
}