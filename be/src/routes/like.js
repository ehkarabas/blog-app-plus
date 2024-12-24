"use strict";

const like = require("../controllers/like");
const idValidation = require("../middlewares/idValidation");
const router = require("express").Router();
const { isLogin, isAdmin, isStaff } = require("../middlewares/permissions");
/* ------------------------------------------------------- */
// routes/like:

// URL: /likes

// router.route('/(:id)?') // id optional

// ? handle via frontend
router
  .route("/create/:blogId")
  .all(idValidation)
  // ? toggle
  .post(isLogin, like.toggle);
// ? ---

// ? handle via api
router
  .route("/:likeId")
  .all(idValidation)
  // ? get single
  .get(like.read) // AllowAny
  // ? update
  .put(isAdmin, like.update)
  .patch(isAdmin, like.update)
  // ? delete
  .delete(isStaff, like.destroy);

router
  .route("/")
  // ? get all
  .get(like.list) // AllowAny // ? handle via frontend and api
  // ? create
  .post(isStaff, like.create);

/* ------------------------------------------------------- */
module.exports = router;
