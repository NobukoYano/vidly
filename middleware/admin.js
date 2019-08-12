module.exports = function auth(req, res, next) {
    if (!req.user.isAdmin) {
        // 401 Unauthorized
        // 403 Forbidden
        res.status(403).send('Access denied.');
    }
    next();
}
