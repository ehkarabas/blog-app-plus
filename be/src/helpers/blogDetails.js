"use strict";

const User = require("../models/user");
const Category = require("../models/category");
const Like = require("../models/like");
const Comment = require("../models/comment");

module.exports = async (blogData) => {
  let result;
  if (Array.isArray(blogData)) {
    if (blogData.length == 0) {
      result = [];
    } else {
      const resultPromises = blogData.map(async (blog) => {
        const [likesCount, commentCount] = await Promise.all([
          Like.countDocuments({ blogId: blog._id, destroyTime: null }),
          Comment.countDocuments({ blogId: blog._id, destroyTime: null }),
        ]);

        const likeDetails = await Like.find({
          blogId: blog._id,
          destroyTime: null,
        }).populate([
          { path: "userId", select: "name" },
          { path: "blogId", select: "title" },
        ]);

        const likeData = likeDetails.map((like) => ({
          id: like._id,
          user_id: like.userId._id,
          post_id: like.blogId._id,
        }));

        return {
          // ...blogData._doc, // _doc, dokümanın ham verilerini içerir ve genellikle Mongoose dokümanındaki tüm alanları dönüştürmeden(field transformlari dahil etmeden) almanızı sağlar. Ancak, populate işlemi gibi işlemlerden sonra _doc'u kullanmak yerine, doğrudan blogData'yı kullanmak(.toObject,.lean) daha temiz bir çözüm olabilir.
          // Mongoose dokümanları, JavaScript nesneleri gibi doğrudan JSON'a dönüştürülemez. Bunun yerine(.toJSON), toObject veya lean() yöntemleri kullanılabilir.
          ...blog.toJSON(),
          post_views: blog.visitors.length,
          author: blog.userId.username,
          likes: likesCount,
          comment_count: commentCount,
          category_name: blog.categoryId.name,
          likes_n: likeData,
        };
      });

      result = await Promise.all(resultPromises);
    }
  } else {
    if (blogData === null) {
      result = null;
    } else {
      const [likesCount, commentCount] = await Promise.all([
        Like.countDocuments({ blogId: blogData._id, destroyTime: null }),
        Comment.countDocuments({ blogId: blogData._id, destroyTime: null }),
      ]);

      const likeDetails = await Like.find({
        blogId: blogData._id,
        destroyTime: null,
      }).populate([
        { path: "userId", select: "name" },
        { path: "blogId", select: "title" },
      ]);

      const likeData = likeDetails.map((like) => ({
        id: like._id,
        user_id: like.userId._id,
        post_id: like.blogId._id,
      }));

      result = {
        // ...blogData._doc, // _doc, dokümanın ham verilerini içerir ve genellikle Mongoose dokümanındaki tüm alanları dönüştürmeden almanızı sağlar. Ancak, populate işlemi gibi işlemlerden sonra _doc'u kullanmak yerine, doğrudan blogData'yı kullanmak(.toObject,.toJSON) daha temiz bir çözüm olabilir.
        // Mongoose dokümanları, JavaScript nesneleri gibi doğrudan JSON'a dönüştürülemez. Bunun yerine(.toJSON), toObject veya lean() yöntemleri kullanılabilir.
        ...blogData.toJSON(),
        post_views: blogData.visitors.length,
        author: blogData.userId.username,
        likes: likesCount,
        comment_count: commentCount,
        comments: await Comment.find({
          blogId: blogData._id,
          destroyTime: null,
        }).populate([
          { path: "userId", select: "username email" },
          { path: "blogId", select: "title" },
        ]),
        category_name: blogData.categoryId.name,
        likes_n: likeData,
      };
    }
  }

  return result;
};
