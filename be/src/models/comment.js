"use strict";

const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;
const {
  dateFieldTimeOffset,
  timeStampsOffset,
} = require("../helpers/modelDateTimeOffset");
/* ------------------------------------------------------- */

const CommentSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    editedAt: {
      type: Date,
      default: null,
      set: dateFieldTimeOffset,
    },
    destroyTime: {
      type: Date,
      default: null,
      set: dateFieldTimeOffset,
    },
  },
  {
    collection: "comment",
    timestamps: { currentTime: timeStampsOffset },
  }
);

module.exports = models?.Comment || model("Comment", CommentSchema);
