const Category = require('../models/Category');

exports.newGroupForm = async (req, res) => {
    const categories = await Category.findAll();
    res.render('newGroup', {
        pageName: 'Nuevo grupo',
        categories
    });
}