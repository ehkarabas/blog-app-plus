"use strict";

const router = require("express").Router();
const { projectName } = require("../helpers/projectNameGenerator");
/* ------------------------------------------------------- */
// routes/:

// URL: /api

// auth:
router.use("/auth", require("./auth"));
// user:
router.use("/users", require("./user"));
// token:
router.use("/tokens", require("./token"));

// like:
router.use("/likes", require("./like"));
// category:
router.use("/categories", require("./category"));
// comment:
router.use("/comments", require("./comment"));
// blog:
router.use("/blogs", require("./blog"));

// document:
router.use("/documents", require("./document"));

// Check functionality of combinedAuthentication middleware on root
router.all("/", (req, res) => {
  // * dynamic host for different deploys
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const basePath = `${proto}://${host}`;
  res.json({
    error: false,
    message: `WELCOME TO ${projectName} PROJECT`,
    // ? Cookie Authentication
    cookies: req.session?.userId ? "recieved" : undefined,
    authCookieData: req?.userBrowser ? req.userBrowser : undefined,
    // ? Token Authentication
    authAPIData: req?.userAPI ? req.userAPI : undefined,
    isLogin: req?.isUserAuthenticated ? req.isUserAuthenticated : false,
    api: {
      documents: {
        swagger: `${basePath}/api/documents/swagger`,
        redoc: `${basePath}/api/documents/redoc`,
        json: `${basePath}/api/documents/json`,
      },
    },
  });
});

/* ------------------------------------------------------- */
module.exports = router;
