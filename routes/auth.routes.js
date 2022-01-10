const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const Adopter = require("../models/Adopter.model");
const Shelter = require("../models/Shelter.model");

const { isLoggedIn, isNotLoggedIn } = require("../middleware/userHelper");

const redirectToProfile = (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  switch (loggedInUser.usertype) {
    case "Adopter":
    case "Shelter":
      res.redirect(`/users/${loggedInUser.usertype}/${loggedInUser.username}`);
      break;
    case undefined:
      res.send("Admin home page");
      break;
    default:
      res.redirect("/");
      break;
  }
};

/* login */
router
  .route("/login")
  .get(isNotLoggedIn, (req, res) => {
    redirectToProfile(req, res);
  })
  .post(isNotLoggedIn, async (req, res) => {
    try {
      const { email, password } = req.body;
      // if one of the fields is missing
      if (!email || !password) {
        req.flash("error", "Invalid credentials");
        res.redirect("/");
      }

      const loggedInUser = await User.findOne({ email });

      if (!loggedInUser) {
        req.flash("error", "User doesn't exist!");
        res.redirect("/");

      } else {

        const isPwdCorrect = await bcrypt.compare(
          password,
          loggedInUser.password
        );
  
        if (isPwdCorrect) {
          req.session.loggedInUser = loggedInUser;
          req.flash("info", "You are logged in!");
          redirectToProfile(req, res);
        } else {
          req.flash("error", "Password is incorrect!");
          res.redirect("/");
        }
      }

    } catch (e) {
      console.log("There's been an error!! ===> ", e);
      res.render("homepage", {
        messages: { error: "We are sorry, there has been an error." },
      });
    }
  });

/* signup */
router
  .route("/signup")
  .get((req, res) => res.render("auth/signup-form"))
  .post(async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
      // user didn't fill all the fields
      if (!username || !email || !password || !role) {
        res.render("auth/signup-form", {
          username,
          email,
          role,
          messages: { error: "All fields are required!" },
        });
      }

      const user = await User.findOne({ email });

      // correct signup
      if (!user) {
        // encryption
        const salt = bcrypt.genSaltSync(4);
        const hashedPwd = bcrypt.hashSync(password, salt);
        let loggedInUser = null;

        if (role === "adopter") {
          loggedInUser = await Adopter.create({
            username,
            email,
            role,
            password: hashedPwd,
          });
        } else if (role === "shelter") {
          loggedInUser = await Shelter.create({
            username,
            email,
            role,
            password: hashedPwd,
          });
        }

        // redirect to home/login
        req.session.loggedInUser = loggedInUser;
        req.flash("info", "Thank you for signing up!");
        res.redirect("/");
      } else {
        // user already exists
        req.flash("error", "This user already exists");
        res.render("auth/signup-form", {
          username,
          email,
          role,
          messages: { error: "This user already exists!" },
        });
      }
    } catch (e) {
      console.log("There's been an error!! ===> ", e);
      res.render("auth/signup", {
        messages: { error: "We are sorry, there has been an error." },
      });
    }
  });

/* logout */
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) res.redirect("/");
    else res.redirect("/");
  });
});

module.exports = router;
