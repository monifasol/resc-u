const router = require("express").Router();
const Adopter = require("../models/Adopter.model");
const Animal = require("../models/Animal.model.js");

// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.config");

router.get("/:id/:fav/:currentPage", async (req, res) => {
  const currentUser = req.session.loggedInUser;
  const fav = req.params.fav;
  const currentPage = req.params.currentPage;

  try {

    const animal = await Animal.findById(req.params.id).populate("shelter");
    let favorites = currentUser.favorites;

    if (fav === "addFav") {
      favorites.push(animal.id)
      msg = "Animal added as a favorite!!"
    } else if (fav === "removeFav") {
      let indexAnimal = favorites.indexOf(animal)
      favorites.splice(indexAnimal)
      msg = "Animal removed from favorites"
    }

    await Adopter.findByIdAndUpdate(
      currentUser._id,
      { favorites: favorites },
      { new: true }
    );

    req.flash("info", msg);
    if (currentPage === "animal-page") res.redirect(`/animals/${animal.id}`)
    else res.redirect("/animals") 
    
  } catch (e) {
    console.log(`Error while adding or removing a favorite animal: ${e}`);
  }
});


router
  .route("/new")
  .get((req, res) => {
    const currentUser = req.session.loggedInUser;
    res.render("animals/new-animal", { currentUser });
  })
  .post(fileUploader.array("animal-image[]", 3), (req, res) => {
    const shelterId = req.session.loggedInUser._id;

    const {
      name, description, type, sex, size, age, status, color, breed, dateofentry, kidfriendly,
    } = req.body;

    Animal.create({
      name, description, type, sex, size, age, status,
      color, breed, dateofentry,kidfriendly, 
      imageUrl: req.files,
      shelter: shelterId
    })
      .then((newAnimal) => {
        res.redirect(`/animals/${newAnimal.id}`);
      })
      .catch((error) =>
        console.log(`Error while creating a new animal: ${error}`)
      );
  });

router
  .route("/edit/:id")
  .get((req, res) => {
    const currentUser = req.session.loggedInUser;

    let id = req.params.id;
    Animal.findById(id, function (err, foundbyid) {
      if (err) {
        return console.log(err);
      }
      res.render("animals/animal-edit", { animal: foundbyid, currentUser });
    });
  })
  .post( fileUploader.array("animal-image[]", 3), async(req, res) => {
    const {
      name, description, type, sex, size, age, status, color, breed, dateofentry, kidfriendly
    } = req.body;

    let animalId = req.params.id;
    
    try {

      const animal = await Animal.findById(animalId)

      // The previous saved images are in animal.imageUrl as Cloudinary objects
      let savedImages = animal.imageUrl    
      
      // The new ones come in req.files
      req.files.forEach((pic) => {
        savedImages.push(pic)
      })

      const updatedAnimal = await Animal.findByIdAndUpdate(
        animalId,
        { name, description, type, sex, size, age, status, color, 
          breed, dateofentry, kidfriendly, imageUrl: savedImages },
        { new: true })

        res.redirect(`/animals/${animalId}`)
      
    } catch (e) {
      console.log(`Error while updating an animal: ${e}`)
    }
  });

router.get("/delete/:id", async (req, res) => {
  let id = req.params.id;
  let shelterId = req.session.loggedInUser._id;

  try {
    await Animal.findByIdAndDelete(id);

    req.flash("info", "Animal deleted!");
    res.redirect(`/shelters/animals/${shelterId}`);
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", (req, res) => {
  const currentUser = req.session.loggedInUser;
  let isAdopter = (currentUser.usertype.toUpperCase() === "ADOPTER") ? true : false
  let isMyShelter = false;

  Animal.findById(req.params.id)
    .populate("shelter")
    .then((animal) => {

      if (currentUser.usertype.toUpperCase() === "SHELTER" && animal.shelter.id === currentUser._id) 
          isMyShelter = true

      res.render("animals/animal-page", { animal, currentUser, isMyShelter, isAdopter });
    })
    .catch((e) => {
      console.log(`Error while showing an animal profile: ${e}`);
    });
});

router.get("/", async (req, res) => {
  const currentUser = req.session.loggedInUser;
  let isAdopter = (currentUser.usertype.toUpperCase() === "ADOPTER") ? true : false

  let { limit = 6, page = 0, type } = req.query;
  const queryString = [`limit=${limit}`];

  // type checkboxes
  const typeCheckBoxes = [
    {
      name: "dog",
      checked: false,
    },
    {
      name: "cat",
      checked: false,
    },
    {
      name: "turtle",
      checked: false,
    },
    {
      name: "fish",
      checked: false,
    },
    {
      name: "exotic",
      checked: false,
    },
    {
      name: "other",
      checked: false,
    },
  ];

  // create filter object and update checkboxes
  const filter = {};
  if (type) {
    filter.type = type;
    typeCheckBoxes.forEach((type) => {
      if (req.query.type.includes(type.name)) {
        type.checked = true;
        queryString.push(`type=${type.name}`);
      }
    });
  }

  // pagination
  const pagination = {
    limit,
    currentPage: Number(page),
  };
  // add previous and next page objects
  pagination.prevPage = { number: pagination.currentPage - 1, class: "active" };
  pagination.nextPage = { number: pagination.currentPage + 1, class: "active" };

  if (pagination.prevPage.number < 0) {
    pagination.prevPage.number = 0;
    pagination.prevPage.class = "inactive";
  }

  try {
    // all animals from DB
    const animalsList = await Animal.find(filter)
      .skip(limit * page)
      .limit(Number(limit));

    // calculate total number of pages
    const animalCount = await Animal.count(filter);
    pagination.pages = Math.ceil(animalCount / limit);
    if (
      pagination.nextPage.number >= pagination.pages ||
      animalsList.length < limit
    ) {
      pagination.nextPage.number = pagination.currentPage;
      pagination.nextPage.class = "inactive";
    }
    pagination.pageLinks = new Array(pagination.pages)
      .fill("")
      .map((_, i) => i);
    // add query strings for next and prev page
    pagination.nextPage.query =
      "?" + queryString.join("&") + `&page=${pagination.nextPage.number}`;
    pagination.prevPage.query =
      "?" + queryString.join("&") + `&page=${pagination.prevPage.number}`;

    // pass current type query to hbs
    let typeQuery = null;
    typeof type === "string" ? (typeQuery = [type]) : (typeQuery = type);
    pagination.currentPage++

    console.log("IS ADOPTER ===> ", isAdopter)

    res.render("animals/animals-list", {
      animals: animalsList,
      pagination,
      typeQuery,
      types: typeCheckBoxes,
      currentUser,
      isAdopter
    });
  } catch (err) {
    console.log(`Error while getting the animals from the DB: ${err}`);
  }
});

module.exports = router;
