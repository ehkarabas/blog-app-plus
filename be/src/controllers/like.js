"use strict";

// Like Controller:
const Like = require("../models/like");
const Blog = require("../models/blog");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Likes"]
      #swagger.summary = "List Likes <Permissions: Public>"
      #swagger.description = `
        You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
        <ul> Examples:
            <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
            <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
            <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
            <li>URL/?<b>limit=10&page=1</b></li>
        </ul>
      `
    */

    // soft delete filter
    const filter = { destroyTime: null };

    const data = await res.getModelList(Like, filter);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Like, filter),
      result: data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Likes"]
      #swagger.summary = "Create Like <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "userId": "65343222b67e9681f937f001",
            "blogId": "65343222b67e9681f937f201"
        }
      }
    */
    // soft delete icin destroyTime create ve update'te daima body'den silnir
    delete req.body?.destroyTime;

    const data = await Like.create(req.body);
    res.status(201).send({
      error: false,
      result: data,
    });
  },
  toggle: async (req, res) => {
    /*
    #swagger.ignore = true
    */
    // soft delete icin destroyTime create ve update'te daima body'den silnir
    delete req.body?.destroyTime;

    const isLikedBefore = await Like.find({
      userId: req.body.userId,
      blogId: req.body.blogId,
    });

    // daha once begenmis ise sil
    if (isLikedBefore.length) {
      const data = await Like.deleteOne({ _id: isLikedBefore[0]._id });

      res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        result: data,
      });
    } else {
      // daha once begenmemis ise like uret
      const data = await Like.create(req.body);
      res.status(201).send({
        error: false,
        result: data,
      });
    }
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Likes"]
      #swagger.summary = "Get Single Like <Permissions: Public>"
    */
    // soft delete filter
    const filter = { destroyTime: null };

    const data = await Like.findOne({ _id: req.params.likeId, ...filter });
    res.status(200).send({
      error: false,
      result: data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Likes"]
      #swagger.summary = "Update Like <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "userId": "65343222b67e9681f937f001",
            "blogId": "65343222b67e9681f937f201"
        }
      }
    */
    // soft delete icin destroyTime create ve update'te daima body'den silnir
    delete req.body?.destroyTime;

    const data = await Like.findOneAndUpdate(
      { _id: req.params.likeId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(202).send({
      error: false,
      body: req.body,
      new: data,
    });
  },
  destroy: async (req, res) => {
    /*
      #swagger.tags = ["Likes"]
      #swagger.summary = "Delete Like <Permissions: Admin>"
    */
    // Soft delete:
    const like = await Like.findById(req.params.likeId);
    if (like) {
      const localeDate = new Date();

      like.destroyTime = localeDate;

      const deletedLike = await like.save();

      res.status(204).send({
        error: false,
        deletedLike,
      });
    } else {
      res.status(404).send({
        error: true,
        message: "Like not found",
      });
    }

    // const data = await Like.deleteOne({ _id: req.params.likeId });
    // res.status(data.deletedCount ? 204 : 404).send({
    //   error: !data.deletedCount,
    //   result: data,
    // });
  },
};
