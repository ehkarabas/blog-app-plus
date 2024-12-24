"use strict";

const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;
const {
  timeStampsOffset,
  dateFieldTimeOffset,
} = require("../helpers/modelDateTimeOffset");
const Like = require("./like");
const Category = require("./like");
const Comment = require("./like");
const User = require("./user");
/* ------------------------------------------------------- */

const BlogSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      validate: [
        (title) => {
          return title.length <= 100 && title.length >= 4;
        },
        "Title length must be equal or more than 4 or equal or less than 100.",
      ],
    },
    content: {
      type: String,
      required: true,
      trim: true,
      validate: [
        (content) => {
          return content.length <= 2000 && content.length >= 4;
        },
        "Content length must be equal or more than 4 or equal or less than 2000.",
      ],
    },
    image: {
      type: String,
      trim: true,
      default:
        "https://media.licdn.com/dms/image/D4E12AQFMiQNhbuldYQ/article-cover_image-shrink_600_2000/0/1694906949741?e=2147483647&v=beta&t=P-OJ3JelvBjCiq-g6DJ8Tw6qJad6vD5fjLIqk8Lk6VY",
    },
    // Calisma hiyerarsisi -> default > set > validate > transform
    // Default, set, validate -> user to model, transform -> model to user
    status: {
      type: String,
      enum: ["d", "p", "D", "P", "Draft", "Published", "draft", "published"],
      default: "Draft",
      set: (val) => {
        // console.log("set val =>", val);
        return ["p", "published"].includes(val.toLowerCase())
          ? "Published"
          : ["d", "draft"].includes(val.toLowerCase())
          ? "Draft"
          : null;
      },
      transform: (val) => {
        // console.log("tranform val =>", val);
        return val === "Published" ? "p" : "d";
      },
      // get: (val) => val === 'Published' ? 'p' : 'd', // * transform ile ayni isi gorur, model'den user'a veri aktarilirken dogrudan field degeri alindiginda calisir. schema options toJSON getters: true ayarı yapılmadığı sürece, getters yalnızca belirli bir belgeden değer alındığında çalışır, ancak sorgu setlerinde çalışmaz. Yani schema options toJSON getters: true yoksa, bir veri kümesini sorguladığınızda veya sonuçları aldığınızda, bu getter işlevleri çalışmaz. transform ile farki budur.
    },
    // likes: {type: Array, default: []}
    visitors: { type: Array, default: () => [] },
    publish_date: {
      type: Date,
      default: null,
      set: dateFieldTimeOffset,
    },
    updated_publish_date: {
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
    collection: "blog",
    timestamps: { currentTime: timeStampsOffset },
    toObject: { virtuals: true, versionKey: false },
  }
);

/* ------------------------------------------------------- */
// ? Virtual field for counting views
// BlogSchema.virtual("post_views").get(function () {
//   return this.visitors.length;
// });

// ! Virtual field'lar async callback desteklemez.
// // Virtual field for counting comments
// BlogSchema.virtual("comment_count").get(async function () {
//   // This assumes there's a Comment model linked by blogId
//   // const Comment = model("Comment");
//   return await Comment.countDocuments({ blogId: this._id });
// });

// // Virtual field for retrieving category name
// BlogSchema.virtual("category_name").get(async function () {
//   // const Category = model("Category");
//   const category = await Category.findById(this.categoryId);
//   return category ? category.name : "";
// });

// // Virtual field for retrieving likes count data
// BlogSchema.virtual("likes").get(async function () {
//   // const Like = model("Like");

//   // const like = await Like.find({blogId: this.id});
//   // return like ? like.length : 0;

//   return await Like.countDocuments({ blogId: this._id });
// });

// // Virtual field for retrieving likes data of this blog model instance
// BlogSchema.virtual("likes_n").get(async function () {
//   // const Like = model("Like");
//   const like = await Like.find({ blogId: this.id }).populate([
//     { path: "userId", select: "name" },
//     { path: "blogId", select: "title" },
//   ]);
//   console.log("🔭 ~ like ➡ ➡ ", like);
//   let likeData = [];
//   if (like) {
//     for (let likeObj of like) {
//       likeData.push({
//         id: likeObj._id,
//         user_id: likeObj.userId._id,
//         post_id: likeObj.blogId._id,
//       });
//     }
//   }
//   return likeData;
// });
/* ------------------------------------------------------- */

// - Model'e method ekleme -> controller'da create, findOneAndUpdate, delete gibi bir method elde edilmis olunur ve custom bir amacla kullanilabilir
// BlogSchema.methods.getBlogWithDetails = async function () {
//   try {
//     const userPromise = this.userId?.username
//       ? Promise.resolve(this.userId)
//       : User.findById(this.userId);

//     const categoryPromise = this.categoryId?.name
//       ? Promise.resolve(this.categoryId)
//       : Category.findById(this.categoryId);

//     const [likesCount, commentCount, likeDetails, user, category] =
//       await Promise.all([
//         Like.countDocuments({ blogId: this._id }),
//         Comment.countDocuments({ blogId: this._id }),
//         Like.find({ blogId: this._id }).populate([
//           { path: "userId", select: "name" },
//           { path: "blogId", select: "title" },
//         ]),
//         userPromise,
//         categoryPromise,
//       ]);

//     const likeData = likeDetails.map((like) => ({
//       id: like._id,
//       user_id: like.userId._id,
//       post_id: like.blogId._id,
//     }));

//     return {
//       ...this.toObject({ virtuals: true }),
//       author: user.username,
//       likes: likesCount,
//       comment_count: commentCount,
//       category_name: category.name,
//       likes_n: likeData,
//     };
//   } catch (error) {
//     console.error("Error in getBlogWithDetails:", error);
//     throw error;
//   }
// };
/* ------------------------------------------------------- */

module.exports = models?.Blog || model("Blog", BlogSchema);

// * update icin productId mevcut olmayabileceginden bu req.params ile sale id cekilip sale document'i uzerinden productId'ye erisim saglamayi gerektirecektir. bu nedenle pre save-findOneAndUpdate middleware'i bu ornek icin calismaz, controller'da islem gerceklestirilmelidir.
// BlogSchema.pre(
//   ["save", "updateOne", "findOneAndUpdate"],
//   async function (next) {
//     // get data from "this" or "this._update"
//     const data = this?._update || this;
//     console.log("🔭 ~ data ➡ ➡ ", data);
//     // update override icin:
//     // this._update.fieldName = data.fieldName;

//     const product = await Product.findById(data.productId);
//     // if (!this?._update) {
//     if (this instanceof mongoose.Query && data?.quantity) {
//       // purchase document guncellenirse, miktar farkini hesapla ve guncelle
//       const oldDoc = await Blog.findById(data._id);
//       const quantityChange = data.quantity - oldDoc.quantity;
//       product.quantity += quantityChange;
//     } else {
//       // yeni bir satın alma islemi yapildiginda urun miktarini artir
//       product.quantity += data.quantity;
//     }
//     await product.save();
//     next();
//   }
// );

// * updateOne gibi metotlarda this._update üzerinden güncelleme yapılan belgeye erişim mümkünken, deleteOne işlemlerinde benzer bir erişim yoktur.
// BlogSchema.pre("deleteOne", async function (next) {
//   console.log("🔭 ~ purchase pre deleteOne this ➡ ➡ ", this);
//   // const product = await Product.findById(this.productId);
//   // // purchase document silinirken, stok miktari silinen miktardan az ise hata firlat
//   // if (product.quantity < this.quantity) {
//   //   throw new Error(
//   //     "The stock quantity is so low that it becomes negative. The transaction has been cancelled."
//   //   );
//   // } else {
//   //   // Yeterli stok varsa, satin alinan miktari stoktan dus
//   //   product.quantity -= this.quantity;
//   //   await product.save();
//   // }
//   next();
// });
