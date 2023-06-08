// fs.chown() method
// Import the filesystem module
let chmodr = require("chmodr");
const jwt = require("jsonwebtoken");
const auth = require("../../../services/auth");

const streamControl = (req, res, result, sessionId, filepath) => {
  if (result.status == 200) {
    // res.status(result.status).json(result.data)
    req.user = result.data;
    auth
      .authAccessOrganizer(req, req.query.name, sessionId)
      .then((result) => {
        if (result.status === 200) {
          console.log(result);
          chmodr(filepath, 0o755, (err) => {
            if (err) {
              console.log("Failed to execute chmod", err);
              res.status(500).send();
              return;
            }
            console.log("Success chmod " + filepath);
            res.status(200).send();
            return;
          });
        } else {
          console.log("res end");
          res.status(result.status).send(result.msg);
        }
      })
      .catch((err) => {
        console.log("res end error");
        res.status(500).send(err);
      });
  } else {
    res.status(result.status).send({ errors: result.msg });
  }
};

const callbackFailed = (err, res) => {
  console.log(err);
  res.status(500).send({
    errors: err,
  });
};

const callbackFailed2 = (err, res) => {
  console.log(err);
  res.status(500).json({
    errors: err,
  });
};

const basicAuth = (token) => {
  try {
    let payload = jwt.verify(token, process.env.JWT_SIGNATURE_KEY);
    console.log(payload, token);
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  loginUser(req, res) {
    let username = req.body.username;
    let pass = req.body.password;
    let email = req.body.email;
    console.log(username, pass, email);
    if ((username || email) && pass) {
      auth
        .userLogin(username, email, pass)
        .then((result) => {
          if (result.status == 200) {
            res.status(result.status).json(result.data);
          } else {
            res.status(result.status).json({ errors: result.msg });
          }
        })
        .catch((err) => {
          return callbackFailed2(err, res);
        });
    } else {
      res.status(404).json({
        errors: "Username or email or password can't blank",
      });
    }
  },
  loginUserWithGoogle(req, res) {
    if (req.body.credential) {
      console.log(req.body.credential);
      auth
        .loginUserWithGoogle(req.body.credential)
        .then((result) => {
          if (result.status == 200) {
            res.status(result.status).json(result.data);
          } else {
            res.status(result.status).json({ errors: result.msg });
          }
        })
        .catch((err) => {
          return callbackFailed2(err, res);
        });
    } else {
      res.status(404).json({
        errors: "Credential token is blank or not found",
      });
    }
  },
  loginUserWithToken(req, res) {
    if (req.body.credential) {
      console.log(req.body.credential);
      auth
        .loginUserWithGoogle(req.body.credential, true)
        .then((result) => {
          if (result.status == 200) {
            res.status(result.status).json(result.data);
          } else {
            res.status(result.status).json({ errors: result.msg });
          }
        })
        .catch((err) => {
          return callbackFailed2(err, res);
        });
    } else {
      res.status(404).json({
        errors: "Credential token is blank or not found",
      });
    }
  },
  authStream(req, res) {
    console.log(
      req.name,
      req.body.name,
      req.body,
      req.params,
      req.params.username,
      req.query
    );
    let username = req.query.username;
    let email = req.query.email;
    let pass = req.query.password;
    let sessionId = req.query.session;
    let filepath = "/node_server/stream-management/bin/public/streams";

    const callbackStream = (result) => {
      streamControl(req, res, result, sessionId, filepath);
    };

    let tokenDC = basicAuth(pass);
    console.log(
      "==================== Masuk middleware dengan token =================="
    );
    if (tokenDC == null) {
      console.log(pass);
      console.log(
        "================= Masuk dengan password ======================"
      );
      auth
        .userLogin(username, email, pass)
        .then((result) => {
          if (result.status == 200) {
            console.log(result.data);
            let token = result.data.token.split(" ")[1];
            let user = basicAuth(token);
            return callbackStream(user == null ? {status: 400, msg: "Token user login / login data is not valid"} : {status: 200, data: user.user})
            // if(user != null){
              
            // }else{
            //   res.status(400).json({ errors: "Token user login / login data is not valid" });
            // }
          } else {
            res.status(result.status).json({ errors: result.msg });
          }
        })
        .catch((err) => {
          return callbackFailed(err, res);
        });
    } else {
      if (email != tokenDC.email) {
        console.log(
          "======================= error tokenDC not match ============================"
        );
        return callbackFailed("User email and token no match", res);
      } else {
        auth
          .getUserByEmail(tokenDC.email)
          .then(callbackStream)
          .catch((err) => {
            return callbackFailed(err, res);
          });
        // let data = {
        //   status: 200,
        //   data: tokenDC
        // }
        // console.log('==================== Masuk auth dengan token ==================');
        // return streamControl(res, data, sessionId, filepath);
      }
    }
  },
  getStreamKey(req, res) {
    auth
      .getStreamKey(req, req.params.sessionId, req.params.purchaseId)
      .then((result) => {
        if (result.status == 200) {
          res.status(result.status).json(result.data);
        } else {
          res.status(result.status).json({ errors: result.msg });
        }
      })
      .catch((err) => {
        return callbackFailed2(err, res);
      });
  },
};
