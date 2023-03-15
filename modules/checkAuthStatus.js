module.exports = function (req, res, next) {
    req.isAuthenticated = function () {
        return req.session? req.session.user? true : false : false;
    }
    next();
}