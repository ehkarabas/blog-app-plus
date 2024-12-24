"use strict";

const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;
const {
  dateFieldTimeOffset,
  timeStampsOffset,
} = require("../helpers/modelDateTimeOffset");
/* ------------------------------------------------------- */

const LikeSchema = Schema(
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
    // mongoose'da null tum data type'lar icin gecerli kabul edilir ve hata firlatmaz. mongosh ile islem yaparken ise type kontrolu olmayacagi icin dilenen field'a dilenen type'taki deger zaten atanabilmektedir. dolayisiyla mongoose'da bir field daima ya belirtilen type'ta bir deger alir ya da null alir, bunun disindeki type'larda hata firlatilacaktir.
    destroyTime: {
      type: Date,
      default: null,
      set: dateFieldTimeOffset,
    },
  },
  {
    collection: "like",
    timestamps: { currentTime: timeStampsOffset },
  }
);

module.exports = models?.Like || model("Like", LikeSchema);
