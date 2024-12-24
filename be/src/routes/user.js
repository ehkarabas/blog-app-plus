"use strict";

const user = require("../controllers/user");
const router = require("express").Router();
const {
  isLogin,
  isStaff,
  isAdmin,
  isAdminOrOwn,
} = require("../middlewares/permissions");
const idValidation = require("../middlewares/idValidation");

/* ------------------------------------------------------- */
// routes/user:

// URL: /users

// router.route('/(:id)?') // id optional

router
  .route("/:userId")
  .all(idValidation)
  // ? get single
  // ? user.read icinde isAdmin kontrolu zaten yapiliyor -> Admin | Own
  .get(isLogin, user.read)
  // ? update
  .put(isAdminOrOwn, user.update)
  .patch(isAdminOrOwn, user.update)
  // ? delete
  .delete(isAdminOrOwn, user.destroy);

router
  .route("/")
  // ? get all
  // ? user.list icinde isAdmin kontrolu zaten yapiliyor  -> Admin | Own
  .get(isLogin, user.list)
  // ? create
  .post(user.create); // AllowAny

/* ------------------------------------------------------- */
module.exports = router;
