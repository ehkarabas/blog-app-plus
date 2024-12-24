"use strict";

const comment = require("../controllers/comment");
const idValidation = require("../middlewares/idValidation");
const router = require("express").Router();
const {
  isLogin,
  isAdmin,
  isStaff,
  isAdminOrOwn,
} = require("../middlewares/permissions");
/* ------------------------------------------------------- */
// routes/comment:

// URL: /comments

// router.route('/(:id)?') // id optional

// ? handle via frontend
router
  .route("/create/:blogId")
  .all(idValidation)
  // ? create
  .post(isLogin, comment.create);
// ? ---

// ? handle via api
router
  .route("/:commentId")
  .all(idValidation)
  // ? get single
  .get(isLogin, comment.read)
  // ? update
  .put(isAdminOrOwn, comment.update)
  .patch(isAdminOrOwn, comment.update)
  // ? delete
  .delete(isAdminOrOwn, comment.destroy);

router
  .route("/")
  // ? get all
  .get(isLogin, comment.list) // ? handle via frontend & api
  // ? create
  .post(isStaff, comment.create);
/* ------------------------------------------------------- */
module.exports = router;
