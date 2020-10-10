const Meet = require('../../models/Meet');
const Comment = require('../../models/Comment');

exports.commentMeet = async(req, res, next) => {
    const { comment } = req.body;

    await Comment.create({
        content: comment,
        userId: req.user.id,
        meetId: req.params.id
    });

    res.redirect('back');
    next();
}

exports.deleteComment = async (req, res, next) => {
    const { commentId } = req.body;
    const comment = await Comment.findOne({
        where: {
            id: commentId
        }
    });
    if(!comment){
        res.status(404).send('Acción inválida');
        return next();
    }
    const meet = await Meet.findOne({
        where: {
            id: comment.meetId
        }
    });
    if(comment.userId === req.user.id || meet.userId === req.user.id){
        await Comment.destroy({
            where: {
                id: comment.id
            }
        });
        res.status(200).send('El comentario se eliminó correctamente');
        return next();
    } else {
        res.status(403).send('Acción inválida');
        return next();
    }
    res.send('El comentario se eliminó correctamente');
}