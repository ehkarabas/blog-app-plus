"use strict";

const token = require("../controllers/token");
const idValidation = require("../middlewares/idValidation");
const router = require("express").Router();
const { isAdmin } = require("../middlewares/permissions");
/* ------------------------------------------------------- */
// routes/token:

// URL: /tokens

// router.route('/(:id)?') // id optional

router.use(isAdmin);

router
  .route("/:tokenId")
  .all(idValidation)
  // ? get single
  .get(token.read)
  // ? update
  .put(token.update)
  .patch(token.update)
  // ? delete
  .delete(token.destroy);

router
  .route("/")
  // ? get all
  .get(token.list)
  // ? create
  .post(token.create);
/* ------------------------------------------------------- */
module.exports = router;
