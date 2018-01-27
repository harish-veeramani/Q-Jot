module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg", "You must log in to view your messages.");
        res.redirect("/users/login");
    }
}