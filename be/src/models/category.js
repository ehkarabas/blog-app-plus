"use strict";

const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;
const {
  dateFieldTimeOffset,
  timeStampsOffset,
} = require("../helpers/modelDateTimeOffset");
/* ------------------------------------------------------- */

const CategorySchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      set: (name) => name[0].toUpperCase() + name.slice(1).toLowerCase(),
    },
    destroyTime: {
      type: Date,
      default: null,
      set: dateFieldTimeOffset,
    },
  },
  {
    collection: "category",
    timestamps: { currentTime: timeStampsOffset },
  }
);

module.exports = models?.Category || model("Category", CategorySchema);
