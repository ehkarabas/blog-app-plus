"use strict";

// Middleware: permissions

const getUser = (req) => (req.userAPI ? req.userAPI : req.userBrowser);
const CustomError = require("../errors/customError");
const User = require("../models/user");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

module.exports = {
  isLogin: (req, res, next) => {
    // Set Passive:
    if (process.env?.NO_PERMISSION === "true") return next();

    const user = getUser(req);

    if (user?.isActive) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login.");
    }
  },

  isAdmin: (req, res, next) => {
    // Set Passive:
    if (process.env?.NO_PERMISSION === "true") return next();

    const user = getUser(req);

    if (process.env?.ONLY_LOGIN === "true") {
      if (user?.isActive) {
        next();
      } else {
        res.errorStatusCode = 403;
        throw new Error("NoPermission: You must login.");
      }
    } else {
      // only Admin:
      if (user?.isActive && user?.isAdmin) {
        next();
      } else {
        res.errorStatusCode = 403;
        throw new Error("NoPermission: You must login and to be Admin.");
      }
    }
  },

  isStaff: (req, res, next) => {
    // Set Passive:
    if (process.env?.NO_PERMISSION === "true") return next();

    const user = getUser(req);

    if (process.env?.ONLY_LOGIN === "true") {
      if (user?.isActive) {
        next();
      } else {
        res.errorStatusCode = 403;
        throw new Error("NoPermission: You must login.");
      }
    } else {
      // only Admin or Staff:
      if (user?.isActive && (user.isAdmin || user.isStaff)) {
        next();
      } else {
        res.errorStatusCode = 403;
        throw new Error("NoPermission: You must login and to be Staff.");
      }
    }
  },

  isAdminOrOwn: async (req, res, next) => {
    // Set Passive:
    if (process.env?.NO_PERMISSION === "true") return next();

    const user = getUser(req);

    if (process.env?.ONLY_LOGIN === "true") {
      if (user?.isActive) {
        next();
      } else {
        res.errorStatusCode = 403;
        throw new Error("NoPermission: You must login.");
      }
    } else {
      const params = req.params;
      console.log("🔭 ~ isAdminOrOwn: ~ params ➡ ➡ ", params);

      // Helper function to check ownership or admin status
      const checkOwnership = (resourceUserId) => {
        if (
          user &&
          user.isActive &&
          (user.isAdmin || String(user._id) === String(resourceUserId))
        ) {
          return true;
        }
        return false;
      };

      if (params.hasOwnProperty("userId")) {
        if (checkOwnership(params.userId)) {
          return next();
        } else {
          throw new CustomError(
            "You must be authenticated and have admin permissions or must be that user",
            403
          );
        }
      } else if (params.hasOwnProperty("blogId")) {
        const blog = await Blog.findById(params.blogId);
        if (blog) {
          if (checkOwnership(blog.userId)) {
            return next();
          } else {
            throw new CustomError(
              "You must be authenticated and have admin permissions or must be author of that blog",
              403
            );
          }
        } else {
          throw new CustomError("Blog not found", 404);
        }
      } else if (params.hasOwnProperty("commentId")) {
        const comment = await Comment.findById(params.commentId);
        if (comment) {
          if (checkOwnership(comment.userId)) {
            // Assuming comment has a userId field
            return next();
          } else {
            throw new CustomError(
              "You must be authenticated and have admin permissions or must be the author of that comment",
              403
            );
          }
        } else {
          throw new CustomError("Comment not found", 404);
        }
      } else {
        throw new CustomError("Query parameter is not valid", 400);
      }
    }
  },
  getUser,
};
