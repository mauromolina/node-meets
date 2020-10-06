exports.getAdminPanel = (req, res) => {
    res.render('adminPanel', {
        pageName: 'Panel de administración'
    })
}