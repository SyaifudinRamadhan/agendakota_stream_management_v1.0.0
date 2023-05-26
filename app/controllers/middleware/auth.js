const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const authSvc = require('../../services/auth')

dotenv.config();

const verifyToken = (token) => {
  let headerToken = token;
  headerToken = headerToken.split(" ");

  if (headerToken[0] !== "Bearer") {
    return null;
  }

  if (headerToken[1] == undefined) {
    return null;
  }

  return headerToken[1];
};

const basicAuth = async (token) => {
  let resToken = verifyToken(token);

  if (!resToken) {
    return null;
  }
  let payload = jwt.verify(resToken, process.env.JWT_SIGNATURE_KEY);
  console.log(payload, resToken);
  return payload.user;
};

module.exports = {
  isLogin(req, res, next) {
    let token = req.headers["x-access-token"];
    if (token === undefined) {
      res.status(400).json({
        msg: "Token is incorrect",
      });
      return;
    }

    console.log("Masuk midleware isLogin");
    basicAuth(token)
      .then((user) => {
        console.log(user);
        // let user = await users.find({ id: userID })
        if (!user) {
          res.status(404).json({ msg: "User not found" });
          return;
        }
        // if (user.deleted) return { error: 401, msg: "Akses dilarang, user tidak terdaftar" }
        if (user.is_active != 1) {
          res.status(403).json({ msg: "User is inactive" });
          return;
        }
        req.user = user;
        next();
      })
      .catch((error) => {
        console.log(error);
        res
          .status(400)
          .json({ msg: error ? error : "Bad request server function" });
        return;
      });
  },

  async isLogin_v2(token) {
    if (token === undefined) {
      return {
        status: 400,
        msg: "Token is incorrect",
      };
    }

    console.log("Masuk midleware isLogin");
    try {
      let user =  await basicAuth(token)
      if (!user) {
        return { status: 404, msg: "User not found" };
      }
      // if (user.deleted) return { error: 401, msg: "Akses dilarang, user tidak terdaftar" }
      if (user.is_active != 1) {
        return { status: 403, msg: "User is inactive" };
      }
      return {status: 200, user, msg: "success"}

    } catch (error) {
      console.log(error);
      return { status: 400, msg: error ? error : "Bad request server function" };
    }
  },

  async isOrganizer_webrtc(user, roomId){
    let result = await authSvc.authAccessOrganizer_webrtc(user, roomId)
    return result;
  }
};
