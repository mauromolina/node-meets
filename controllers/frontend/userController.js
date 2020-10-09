const User = require("../../models/User")
const Group = require("../../models/Group")

exports.getUserDetails = async (req, res, next) => {
    const queries = [];
    queries.push(
        await User.findOne({
            where: {
                id: req.params.id
            }
        })
    );
    queries.push(
        await Group.findAll({
            where: {
                userId: req.params.id
            }
        })
    )
    const [ user, groups ] = await Promise.all(queries);
    if(!user){
        res.redirect('/');
        return next();
    }
    res.render('userDetail', {
        pageName: `Perfil de usuario: ${user.name}`,
        user,
        groups
    })
}