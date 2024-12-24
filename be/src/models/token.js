"use strict";

const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;
const emailFieldValidator = require("../helpers/emailFieldValidator");
const {
  dateFieldTimeOffset,
  timeStampsOffset,
} = require("../helpers/modelDateTimeOffset");
/* ------------------------------------------------------- */

const TokenSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
  },
  {
    collection: "token",
    timestamps: { currentTime: timeStampsOffset },
  }
);

/* ------------------------------------------------------- */
// TTL İndeksi Kullanarak Süresi Dolmuş Belgeleri Otomatik Silme
// MongoDB'de bir TTL indeksi oluşturduğunuzda, bu indeks belirtilen alandaki tarih veya zaman damgası dolduktan sonra belgeleri otomatik olarak siler. Bu işlem, arka planda otomatik olarak çalışır ve herhangi bir manuel müdahale gerektirmez. TTL temizligi mongodb tarafindan UTC'ye gore yapilir, timestamps.currentTime'a girilen bir function ile tr saati ile eslesmesi icin timestamp'ler 3 saat ileri alinmissa, utc0 olarak algilayacagi icin silme islemi tr saatine gore 3 yerine 6 saat geriye dusecektir.
TokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 5 * 24 * 60 * 60 } // 432000 sn 5 gun
);
/* ------------------------------------------------------- */

module.exports = models?.Token || model("Token", TokenSchema);
