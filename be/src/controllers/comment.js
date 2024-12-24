"use strict";

// Comment Controller:
const Comment = require("../models/comment");
const Blog = require("../models/blog");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Comments"]
      #swagger.summary = "List Comments <Permissions: Public>"
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

    const data = await res.getModelList(Comment, filter);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Comment, filter),
      result: data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Comments"]
      #swagger.summary = "Create Comment <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          userId: "65343222b67e9681f937f700",
          blogId: "65343222b67e9681f937f201",
          content: "Comment1",
        }
      }
    */
    // soft delete icin destroyTime create ve update'te daima body'den silnir
    delete req.body?.destroyTime;

    const data = await Comment.create(req.body);
    res.status(201).send({
      error: false,
      result: data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Comments"]
      #swagger.summary = "Get Single Comment <Permissions: Public>"
    */
    // soft delete filter
    const filter = { destroyTime: null };

    const data = await Comment.findOne({
      _id: req.params.commentId,
      ...filter,
    });

    console.log("🔭 ~ read: ~ data ➡ ➡ ", data);
    res.status(200).send({
      error: false,
      result: data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Comments"]
      #swagger.summary = "Update Comment <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          userId: "65343222b67e9681f937f700",
          blogId: "65343222b67e9681f937f201",
          content: "CommentUP",
        }
      }
    */
    // soft delete icin destroyTime create ve update'te daima body'den silnir
    delete req.body?.destroyTime;

    // content degisiyorsa editedAt'e tarih at
    if (req.body?.content) {
      req.body.editedAt = new Date();
    }

    const data = await Comment.findOneAndUpdate(
      { _id: req.params.commentId },
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
      #swagger.tags = ["Comments"]
      #swagger.summary = "Delete Comment <Permissions: Admin>"
    */
    // Soft delete:
    const comment = await Comment.findById(req.params.commentId);
    if (comment) {
      const localeDate = new Date();

      comment.destroyTime = localeDate;

      const deletedComment = await comment.save();

      res.status(204).send({
        error: false,
        deletedComment,
      });
    } else {
      res.status(404).send({
        error: true,
        message: "Comment not found",
      });
    }

    // const data = await Comment.deleteOne({ _id: req.params.commentId });
    // res.status(data.deletedCount ? 204 : 404).send({
    //   error: !data.deletedCount,
    //   result: data,
    // });
  },
};
