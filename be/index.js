"use strict";

require("dotenv").config();
require("express-async-errors");
const path = require("node:path");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieSession = require("cookie-session");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const { logger } = require("./src/middlewares/fsLogging");
const { connectDB } = require("./src/configs/dbConnection");
const syncModels = require("./src/helpers/sync");
const corsCustomMw = require("./src/middlewares/corsCustom");
// const staticFileSoftDeleteChecker = require("./src/middlewares/staticFileSoftDeleteChecker");

let HOST, PORT;
if (process.env.NODE_ENV !== "production") {
  HOST = process.env?.HOST || "127.0.0.1";
  PORT = process.env?.PORT || 8000;
} else {
  HOST = "cloud.mongodb.com";
  PORT = 443; // https -> render buradan portu degistigimizde bazen sistemde kayitli olan environment variable'in da degismesini bekleyebiliyor, bu durumda render sistemindeki environment variable da guncellenmeli
}
// HTTPS üzerinden dosya transferi mümkündür. İnternet üzerinden iletilen tüm veriler temel olarak bitler (1’ler ve 0’lar) halinde gönderilir. Ancak, bu bitler çeşitli protokoller ve katmanlar aracılığıyla anlamlı veriler haline getirilir. HTTPS de bu katmanlardan biridir ve verilerin güvenli bir şekilde iletilmesini sağlar.
// Dosya transferi aslında metin (text) ile değil, binary (ikili) veri ile ilgilidir. Ancak, bazı durumlarda ikili veriler metin formatında kodlanarak (örneğin, Base64) iletilebilir. Bu, özellikle metin tabanlı protokoller veya veri formatları kullanıldığında yararlı olabilir. Ancak, HTTPS gibi ikili veri transferini doğal olarak destekleyen protokoller, veriyi doğrudan ikili formatta ileterek ek bir kodlama gerektirmez.
// Dosya verileri, HTTPS bağlantısı üzerinden gönderilmeden önce şifrelenir. Bu, verilerin üçüncü şahıslar tarafından okunmasını engeller.
// Dosya verileri, küçük veri paketleri halinde bölünür ve şifrelenmiş şekilde iletilir. Bu paketler, alıcı tarafta tekrar birleştirilir ve orijinal dosya oluşturulur.
// Alıcı taraf, gelen şifreli verileri çözer ve dosyayı orijinal formatında (binary) yeniden oluşturur. Örneğin, bir görsel dosyası alındığında, tarayıcı bu dosyayı doğru şekilde görüntüler.
/* ------------------------------------------------------------------ */

// Vercel proxy'lerini güvenilir olarak ayarla
if (process.env.NODE_ENV === "production") {
  // Render'da genellikle iki proxy katmanı olduğu varsayılır
  app.set("trust proxy", true); // Proxy sayısına göre ayarlayın
}

// ? cors
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(corsCustomMw);

// * deactivate loggers for vercel deploy if activated:
// ? nodejs local logger -> request logs handled via morgan
if (process.env.NODE_ENV !== "production") {
  app.use(logger);
}

// * deactivate loggers for vercel deploy if activated:
// ? morgan local logger
if (process.env.NODE_ENV !== "production") {
  app.use(require("./src/middlewares/morganLogging"));
}

// DATA RECEIVING -> body parsers(eskiden expressjs'te ilave body parser package'i ile bu islem yapiliyordu ama artik body verileri bu sekilde direkt express instance uzerinden cekilebilmektedir)
// https://expressjs.com/en/resources/middleware/body-parser.html
// ( npm install body-parser / var bodyParser = require('body-parser') / app.use(bodyParser.json())) / var jsonParser = bodyParser.json() app.post('/api/users', jsonParser, function (req, res) {…} )

// Accept JSON and convert to object
app.use(express.json());
// Accept text
app.use(express.text());
// Accept form
app.use(express.urlencoded({ extended: true }));

// (browser)http://localhost:8000/public/images/monalisa.jpg -> Cannot GET /public/images/monalisa.jpg
// ? Allow static files
// app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/static/images", generalLimiter, express.static("./public/images"));
// path /static/images/* iken ./public/images/* ile eslestirilir.
// http://localhost:8000/static/images/monalisa.jpg -> gorsel painted
// app.use("/uploads", staticFileSoftDeleteChecker, express.static("./uploads"));

// IIFE
(async () => {
  // Veritabanı bağlantısını test et
  await connectDB();

  // sync models(model degisikliklerinin database'de manuel olarak handle edilmesi)
  process.env.SYNC === "true" && (await syncModels(true));

  // ? Cookies(Session Cookies - Persistent Cookies)
  // Cookie-Session
  // app.use(
  //   cookieSession({
  //     secret: process.env.COOKIE_SESSION_SECRET_KEY, // Sifreleme anahtari
  //     // maxAge: 1000 * 60 * 60 * 24 * 3 // milliseconds // 3 days
  //     // Burasi global cookie ayarlaridir, maxAge burada tanimlanirsa session olarak calismaz ve degiskenlik gostermez. controller'larda ayri ayri yapmak daha fazla esneklik saglar.
  //     // httpOnly: a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (true by default).
  //     httpOnly: true,
  //     // secure: a boolean indicating whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS). If this is set to true and Node.js is not directly over a TLS connection, be sure to read how to setup Express behind proxies or the cookie may not ever set correctly. Postman ve ThunderClient secure true iken cookie ile calismaz.
  //     secure: process.env.NODE_ENV === "production",
  //     // sameSite: a boolean or string indicating whether the cookie is a "same site" cookie (false by default). This can be set to 'strict', 'lax', 'none', or true (which maps to 'strict'). Frontend ve backend farkli host’larda ise sameSite key’i “None” yapilmalidir, boylece cookie’ler icin cross-site usage saglanabilir. Chrome ile calisirken veya production'da secure ve sameSite gereklidir ancak ThunderClient, Postman ile calisirken secure yoruma alinmalidir veya false yapilmalidir. secure express dev server’da http ile de calisabilmektedir.
  //     sameSite: "none",
  //   })
  // );

  // Express-Session(works with passport defaultly)
  app.use(
    expressSession({
      name: "stockapp.session", // custom cookie name(default connect.sid)
      secret: process.env.EXPRESS_SESSION_SECRET_KEY, // Şifreleme anahtarı
      resave: false, // Oturum, sadece oturum verilerinde bir değişiklik yapıldığında kaydedilir. Bu, gereksiz veritabanı yazma işlemlerini azaltır ve performansı iyileştirir.
      saveUninitialized: false, // Yeni bir oturum oluşturulduğunda, oturum verilerinde herhangi bir veri yoksa, oturum kaydedilmez. Bu, yalnızca oturum verileri ilk kez değiştirildiğinde oturumun kaydedilmesine neden olur. Bu, gereksiz oturumları ve veritabanı işlemlerini azaltır.
      store: MongoStore.create({
        mongoUrl: process.env.CONNECT_MONGO_DATABASE_URI_REMOTE,
        // Aşağıdaki ayarlar opsiyoneldir, ihtiyacınıza göre ayarlayabilirsiniz
        collectionName: "sessionsBlogApp",
        ttl: 14 * 24 * 60 * 60, // 14 gün (opsiyonel)
        autoRemove: "native", // Otomatik olarak eski oturumları kaldırır
      }),
      cookie: {
        httpOnly: true, // httpOnly: a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (true by default).
        secure: process.env.NODE_ENV === "production", // secure: a boolean indicating whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS). If this is set to true and Node.js is not directly over a TLS connection, be sure to read how to setup Express behind proxies or the cookie may not ever set correctly. Postman ve ThunderClient secure true iken cookie ile calismaz. secure true iken hem FE hem BE HTTPS olduğunda cookie'ler doğru bir şekilde gönderilecektir.
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // sameSite: a boolean or string indicating whether the cookie is a "same site" cookie (false by default). This can be set to 'strict', 'lax', 'none', or true (which maps to 'strict'). Frontend ve backend farkli host’larda ise sameSite key’i “None” yapilmalidir, boylece cookie’ler icin cross-site usage saglanabilir. Chrome ile calisirken veya production'da secure ve sameSite gereklidir ancak ThunderClient, Postman ile calisirken secure yoruma alinmalidir veya false yapilmalidir. secure express dev server’da http ile de calisabilmektedir. dev server'da sameSite lax ve secure false ile cookie'ler tarayiciya gonderilebilmektedir.
        // maxAge: 14 * 24 * 60 * 60 * 1000 // 14 gün (milisaniye cinsinden) maxAge belirtilmezse cookie session cookie olur yani omru oturumla sinirlanir
      },
    })
  );

  // ? Authentication(Cookies) - deprecated for jwt authentication
  // app.use(require("./src/middlewares/cookieAuthentication"));

  // ? Authentication(JWT Token) - deprecated for combined authentication
  // app.use(require("./src/middlewares/tokenAuthentication"));

  // ? Authentication(Cookie - ClassicToken - JWT Combined)
  app.use(require("./src/middlewares/combinedAuthentication"));

  // Filter, Search, Sort, Pagination middleware
  app.use(require("./src/middlewares/queryHandler"));

  // ? Routes
  app.use("/api", require("./src/routes"));
  // index.js dosyalari path'te belirtilmese de otomatik olarak calisir.

  // not found catcher
  app.all("*", (req, res) => {
    res.status(404).send(`${req.method} ${req.path} not found`);
  });

  // error handler middleware via imported controller
  app.use(require("./src/middlewares/errorHandler"));

  // request listener
  app.listen(
    PORT,
    process.env.NODE_ENV !== "production" ? HOST : undefined,
    () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    }
  );
})();
