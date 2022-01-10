const router = require("express").Router();
const User = require("../models/User.model");
const Adopter = require("../models/Adopter.model");
const Shelter = require("../models/Shelter.model");
const Animal = require("../models/Animal.model");

const userHelper = require("../middleware/userHelper");
const fileUploader = require("../config/cloudinary.config");

const { isLoggedIn } = require("../middleware/userHelper");

/* users profile page */
router.get("/:usertype/:username", isLoggedIn, async (req, res) => {
  try {
    // get user info from cookie
    const loggedInUser = req.session.loggedInUser;

    // find user in the DB
    const user = await User.findOne({ username: req.params.username }).populate(
      "favorites"
    );

    let canEdit = false;
    if (
      loggedInUser.email === user.email ||
      loggedInUser.usertype === undefined
    )
      canEdit = true;

    // render profile page for that user
    switch (req.params.usertype.toLowerCase()) {
      case "adopter":
        res.render("users/adopters/profile", {
          user,
          canEdit,
          currentUser: loggedInUser,
        });
        break;
      case "shelter":
        let animalslist = await Animal.find({ shelter: user.id });
        res.render("users/shelters/profile", {
          user,
          canEdit,
          animalslist,
          currentUser: loggedInUser,
        });
        break;
      default:
        res.send("oops");
        break;
    }
  } catch (e) {
    console.log("There's been an error!! ===> ", e);
    res.render("homepage", {
      messages: { info: "We are sorry, there has been an error." },
    });
  }
});

/* profile edit */
router
  .route("/:usertype/:username/profile-edit")
  .get((req, res) => {
    // get user info from cookie
    const currentUser = req.session.loggedInUser;

    switch (req.params.usertype.toLowerCase()) {
      case "adopter":
        res.render("users/adopters/edit-profile", {
          user: currentUser,
          currentUser,
        });
        break;
      case "shelter":
        res.render("users/shelters/edit-profile", {
          user: currentUser,
          currentUser,
        });
        break;
      default:
        res.send("oops");
        break;
    }
  })
  .post(fileUploader.single("imageUrl"), isLoggedIn, async (req, res) => {
    const currentUser = req.session.loggedInUser;
    let updatedUser = null;

    // if user entered an img, we set that as an avatar
    let imageUrl = req.file ? req.file.path : null;
    // if not, we checked if he had already one
    if (imageUrl === null && currentUser.imageUrl) {
      imageUrl = currentUser.imageUrl;
    }

    try {
      switch (currentUser.usertype.toLowerCase()) {
        case "adopter":
          // deconstruct body and take info from the form
          const { fullname, children, animalPreference, housingSize } =
            req.body;
          updatedUser = await Adopter.findByIdAndUpdate(
            currentUser._id,
            { fullname, children, animalPreference, housingSize, imageUrl },
            { new: true }
          );
          break;
        case "shelter":
          // deconstruct body and take info from the form
          const { name, address, contact_phone, contact_email } = req.body;
          updatedUser = await Shelter.findByIdAndUpdate(
            currentUser._id,
            { name, address, contact_phone, contact_email },
            { new: true }
          );
          break;
      }
      // update the cookie
      req.session.loggedInUser = updatedUser;
    } catch (e) {
      console.log("There's been an error!! ===> ", e);

      let view = "";
      switch (currentUser.usertype.toLowerCase()) {
        case "adopter":
          view = "users/adopters/edit-profile";
          break;
        case "shelter":
          view = "users/shelters/edit-profile";
          break;
        default:
          view = "users/admin/control-panel";
      }

      res.render(view, {
        currentUser,
        user: currentUser,
        messages: { error: "We are sorry, there has been an error." },
      });
    } finally {
      req.flash("info", "Changes successfully saved!");
      res.redirect(`/users/${updatedUser.usertype}/${updatedUser.username}`);
    }
  });

/* delete user */
router
  .route("/:usertype/:username/delete-user")
  .get((req, res) => {
    res.render("users/delete-user", { user: req.session.loggedInUser });
  })
  .post(async (req, res) => {
    try {
      await User.findOneAndDelete({ username: req.params.username });
    } catch (e) {
      console.log("There's been an error!! ===> ", e);
    } finally {
      req.session.destroy((err) => {
        if (err) res.redirect("/");
        else res.redirect("/");
      });
    }
  });

// GET /users ==> list of users
router.route("/").get(async (req, res) => {
  let listUsers = [];

  try {
    currentUser = req.session.loggedInUser;
    listUsers = await User.find();
  } catch (e) {
    console.log("There's been an error!! ===> ", e);
    res.render("homepage", {
      messages: { info: "We are sorry, there has been an error." },
    });
  } finally {
    res.render("users/list", { users: listUsers, currentUser });
  }
});

module.exports = router;
