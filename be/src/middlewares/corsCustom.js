"use strict";

const cors = require("cors");

const sanitizeUrl = (url) => {
  if (url.endsWith("/")) {
    return url.slice(0, -1);
  }
  return url;
};

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [sanitizeUrl(process.env.FE_URL), sanitizeUrl(process.env.BE_URL)]
    : ["http://localhost:3000"];

module.exports = cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});
