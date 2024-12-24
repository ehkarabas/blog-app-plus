"use strict";

const category = require("../controllers/category");
const idValidation = require("../middlewares/idValidation");
const router = require("express").Router();
const { isAdmin, isStaff } = require("../middlewares/permissions");
/* ------------------------------------------------------- */
// routes/category:

// URL: /categories

// router.route('/(:id)?') // id optional

router
  .route("/:categoryId")
  .all(idValidation)
  // ? get single
  .get(category.read) // AllowAny
  // ? update
  .put(isAdmin, category.update)
  .patch(isAdmin, category.update)
  // ? delete
  .delete(isAdmin, category.destroy);

router
  .route("/")
  // ? get all
  .get(category.list) // AllowAny
  // ? create
  .post(isAdmin, category.create);
/* ------------------------------------------------------- */
module.exports = router;
