function verificarAutenticacao(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/');
}

module.exports = verificarAutenticacao;
