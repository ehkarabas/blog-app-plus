"use strict";

const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;
const emailFieldValidator = require("../helpers/emailFieldValidator");
const {
  dateFieldTimeOffset,
  timeStampsOffset,
} = require("../helpers/modelDateTimeOffset");
const passwordEncrypt = require("../helpers/passwordEncrypt");
/* ------------------------------------------------------- */

/* -------------------------------------------------------
{
  "username": "admin",
  "password": "aA*123456",
  "email": "admin@site.com",
  "firstName": "admin",
  "lastName": "admin",
  "isActive": true,
  "isStaff": true,
  "isAdmin": true
}
{
  "username": "staff",
  "password": "aA*123456",
  "email": "staff@site.com",
  "firstName": "staff",
  "lastName": "staff",
  "isActive": true,
  "isStaff": true,
  "isAdmin": false
}
{
  "username": "test",
  "password": "aA*123456",
  "email": "test@site.com",
  "firstName": "test",
  "lastName": "test",
  "isActive": true,
  "isStaff": false,
  "isAdmin": false
}
/* ------------------------------------------------------- */

const UserSchema = Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      // ! setter validate'ten once calistigi icin setter'da validasyon yapilip gecerse dilenen manipulasyon yapilip gecmezse belirli bir deger dondurulur ve validate ile yalnizca bu degerin dondurulup dondurulmedigi kontrol edilir. Boylece hem setter ve validate kullanilmis olur
      set: function (password) {
        const passwordRegex =
          /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,16}/;
        if (!passwordRegex.test(password)) {
          return "wrong";
        } else {
          return passwordEncrypt(password);
        }
      },
      validate: [
        (password) => password !== "wrong",
        "Password must contain at least 1 uppercase & lowercase letter, 1 digit, 1 special character and must be between 8 and 16 characters in total.",
      ],
    },
    // password encyrpt field setter & validate ile yapilmasi best practice ancak pre save'de de yapilabilir.
    email: {
      type: String,
      trim: true,
      required: [true, "Email field must be required"],
      unique: [true, "There is this email. Email field must be unique"],
      validate: [emailFieldValidator],
    },
    // email validate field validate ile yapilmasi best practice ancak pre save'de de yapilabilir.
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      trim: true,
      default:
        "https://cdn-icons-png.freepik.com/256/1077/1077114.png?semt=ais_hybrid",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    destroyTime: {
      type: Date,
      default: null,
      set: dateFieldTimeOffset,
    },
  },
  {
    collection: "user",
    timestamps: { currentTime: timeStampsOffset },
  }
);

/* ------------------------------------------------------- */

// ! pre save update ile calismaz cunku update method'larinda this query object'i gosterir. query object'te veri _update key'inde saklandigi icin kestirme yol ile islem yaptirilabilir, diger bir alternatif ise controller'da once query ile document'i dondurup sonra body'den gelen key'leri modelde kontrol edip en son olarak da key'ler uygunsa bu key-value'lari document'a islemek(document.save() ile) gerekir. Boylece this baglamini _update keyi iceriyor mu diye model seviyesindeki her method/callback'te kontrol etme gereksinimi ortadan kalkar.
// UserSchema.pre("save", function (next) {
// UserSchema.pre(["save", "updateOne", "findOneAndUpdate"], function (next) {
//   console.log("pre save worked");

//   // get data from "this" or "this._update"
//   const data = this?._update || this;
//   console.log("🔭 ~ data ➡ ➡ ", data);
//   // 🔭 ~ data ➡ ➡  {
//   //   username: 'test',
//   //   password: 'Qwer1234!',
//   //   email: 'test@site.com',
//   //   firstName: 'test',
//   //   lastName: 'test',
//   //   isActive: true,
//   //   isStaff: false,
//   //   isAdmin: false,
//   //   _id: new ObjectId("661d8156c138ff4f4f638c2e"),
//   //   createdAt: 2024-04-15T22:34:46.272Z,
//   //   updatedAt: 2024-04-15T22:34:46.272Z
//   // }

//   const isEmailValidated = data.email
//     ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)
//     : true;

//   if (isEmailValidated) {
//     console.log("Email OK");

//     if (data?.password) {
//       const isPasswordValidated =
//         /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,16}/.test(data.password);

//       if (isPasswordValidated) {
//         console.log("Password OK");
//         data.password = passwordEncrypt(data.password);
//         // document field'ini guncelle
//         if (this._update) {
//           // update:
//           // this._update = data;
//           this._update.password = data.password;
//         } else {
//           // save:
//           this.password = data.password = passwordEncrypt(data.password);
//         }
//         //? ShortHand:
//         // // save:
//         // this.password = data.password = passwordEncrypt(data.password)
//         // // update:
//         // this._update = data
//         next();
//       } else {
//         next(new Error("Password is not valid"));
//       }
//     }
//   } else {
//     next(new Error("Email is not valid"));
//   }
// });

module.exports = models?.User || model("User", UserSchema);
