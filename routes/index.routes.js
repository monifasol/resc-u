const router = require("express").Router();
const { isNotLoggedIn } = require("../middleware/userHelper");

/* homepage */
router.route("/").get(isNotLoggedIn, (req, res) => res.render("homepage"));

module.exports = router;
