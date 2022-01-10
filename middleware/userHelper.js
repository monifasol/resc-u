module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.session.loggedInUser) {
      next();
    } else {
      req.flash("error", "Please, log in first!");
      res.redirect("/");
    }
  },

  isNotLoggedIn: function (req, res, next) {
    const user = req.session.loggedInUser;
    if (user) {
      // req.flash('error', 'You are already logged in')
      res.redirect(`/users/${user.usertype}/${user.username}`);
    } else {
      console.log("Attempting to log in...");
      next();
    }
  },

  isShelter: function (req, res, next) {
    if (req.session.loggedInUser.usertype.toUpperCase() === "SHELTER") {
      next();
    } else {
      req.flash("error", "You must be a shelter to access here.");
      res.redirect(req.get('referer'));
    }
  },

  isAdopter: function (req, res, next) {
    if (req.session.loggedInUser.usertype.toUpperCase() === "ADOPTER") {
      next();
    } else {
      req.flash("error", "You must be an adopter to access here.");
      res.redirect(req.get('referer'));
    }
  },

};
