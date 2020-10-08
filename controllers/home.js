const Category = require('../models/Category');

exports.home = async (req, res) => {
    const queries = [];
    queries.push(
        await Category.findAll({})
    );
    const [ categories ] = await Promise.all(queries);
    res.render('home', {
        pageName: 'Inicio',
        categories
    });
};