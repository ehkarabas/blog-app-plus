"use strict";

const blog = require("../controllers/blog");
const idValidation = require("../middlewares/idValidation");
const router = require("express").Router();
const {
  isLogin,
  isAdmin,
  isStaff,
  isAdminOrOwn,
} = require("../middlewares/permissions");
/* ------------------------------------------------------- */
// routes/blog:

// URL: /blogs

// router.route('/(:id)?') // id optional

router
  .route("/:blogId")
  .all(idValidation)
  // ? get single
  .get(isLogin, blog.read)
  // ? update
  .put(isAdminOrOwn, blog.update)
  .patch(isAdminOrOwn, blog.update)
  // ? delete
  .delete(isAdminOrOwn, blog.destroy);

router
  .route("/")
  // ? get all
  .get(blog.list) // AllowAny
  // ? create
  .post(isLogin, blog.create);
/* ------------------------------------------------------- */
module.exports = router;
