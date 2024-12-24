"use strict";

const User = require("../models/user");

module.exports = async (req, res) => {
  try {
    if (req.session?.userId) {
      const { userId, password } = req.session;
      const user = await User.findById(userId);

      // ? if password changed, log user out
      if (user && user.password === password) {
        // set req.userBrowser to user
        req.userBrowser = {
          _id: user._id,
          id: user.id,
          isActive: user.isActive,
          isAdmin: user.isAdmin,
          isStaff: user.isStaff,
        };
        req.userEmail = user.email; // for logging
        return true;
      } else {
        // clear session data and set req.userBrowser to undefined
        // with cookie-session
        // req.session = null;
        // with express-session
        req.session.destroy();
        req.userBrowser = undefined;
        req.userEmail = undefined; // for logging
        return false;
      }
    }
    return false;
  } catch (error) {
    return error;
  }
};
