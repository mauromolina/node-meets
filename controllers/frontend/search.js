const Meet = require('../../models/Meet');
const Group = require('../../models/Group');
const User = require('../../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

exports.searchResults = async (req, res) => {
    let { category, title, city, country } = req.query;
    let query, titQuery, cityQuery, countryQuery;
    if(category === ''){
        console.log('vacio');
        query = '';
    } else {
        console.log('no vac'+category);
        query = `where: {
            categoryId: {[Op.eq]: ${category}}
        } `;
    }
    if(title === ''){
        title = '';
    } else {

    }
    if(city === ''){
        city = '';
    }
    if(country === ''){
        country = ''
    }
    const meets = await Meet.findAll({
        where: {
            [Op.or]: [
                {
                    title: {
                        [Op.like] : '%'+title+'%'
                    }
                },
                {
                    city: {
                        [Op.like] : '%'+city+'%'
                    }
                },
                {
                    country: {
                        [Op.like] : '%'+country+'%'
                    }
                }
            ]
        },
        include: [
            {
                model: Group,
                query
            },
            {
                model: User,
                attributes: ['id', 'name', 'image']
            }
        ] 
    });
    res.render('search', {
        pageName: 'Resultados de la búsqueda: ',
        meets,
        moment
    });

}