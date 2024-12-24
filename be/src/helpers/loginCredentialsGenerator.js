const Token = require("../models/token");
const jwt = require("jsonwebtoken");
const passwordEncrypt = require("./passwordEncrypt");

module.exports = async (user, req) => {
  /* TOKEN */
  // Use UUID:
  // const { randomUUID } = require('crypto')
  // let tokenData = await Token.findOne({ userId: user._id })
  // if (!tokenData) tokenData = await Token.create({
  //     userId: user._id,
  //     token: randomUUID()
  // })
  let tokenData = await Token.findOne({ userId: user._id });

  if (!tokenData) {
    const tokenKey = passwordEncrypt(user._id + Date.now());
    tokenData = await Token.create({
      userId: user._id,
      token: tokenKey,
    });
  }
  /* TOKEN */

  /* JWT */

  // daha kritik/hassas veri, daha kisa omurlu
  const accessInfo = {
    key: process.env.ACCESS_KEY,
    time: process.env?.ACCESS_EXP || "30m",
    data: {
      _id: user._id,
      id: user._id,
      email: user.email,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      isStaff: user.isStaff,
    },
  };

  // daha az kritik/hassas veri, daha uzun omurlu
  const refreshInfo = {
    key: process.env.REFRESH_KEY,
    time: process.env?.REFRESH_EXP || "3d",
    data: {
      id: user._id,
      password: user.password, // encyrpted
    },
  };

  // JWT token'lari olustur(jwt.sign)
  // jwt.sign(payload, secretOrPrivateKey, [options, callback])
  const accessToken = jwt.sign(accessInfo.data, accessInfo.key, {
    expiresIn: accessInfo.time,
  });

  const refreshToken = jwt.sign(refreshInfo.data, refreshInfo.key, {
    expiresIn: refreshInfo.time,
  });
  /* JWT */

  /* COOKIE */
  if (req.session) {
    req.session.userId = user._id;
    req.session.password = user.password;
    req.session.token = tokenData.token;
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken; // COOKIE ILE REFRESH TOKEN'I GONDERMEK MANTIKLI OLSA DA MOBILE APPLICATION'LAR COOKIE DESTEKLEMEDIGI ICIN ONLAR OZELINDE HEADER KULLANARAK JWT AUTH'A DEVAM ETMEK BEST-PRACTICE'TIR.
    // with express-session
    await req.session.save();
  }
  /* COOKIE */

  return { tokenData, accessToken, refreshToken };
};
