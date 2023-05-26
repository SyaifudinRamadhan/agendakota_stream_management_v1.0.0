const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const socialite = require("node-socialite");
const dotenv = require("dotenv");

dotenv.config();

const userRepo = require("../repositories/user");
const purchaseRepo = require("../repositories/purchase");
const streamKeyRepo = require("../repositories/streamKey");
const sessionRepo = require("../repositories/session");
const orgRepo = require("../repositories/organization");
const orgTemRepo = require("../repositories/orgTeam");
const eventRepo = require('../repositories/event')
// const Organization = require("../models/Organization");
const models = require("../models");

const checkPassword = (password, encryptedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassword, (err, isPassCorect) => {
      if (!!err) {
        reject(err);
        return;
      }
      resolve(isPassCorect);
    });
  });
};

const createToken = (user) => {
  return (
    "Bearer " +
    jwt.sign({ user: user }, process.env.JWT_SIGNATURE_KEY, {
      expiresIn: "24h",
    })
  );
};

const userAuth = async (user, purchaseId) => {
  try {
    let userPurchase = await purchaseRepo.findById(purchaseId, [
      {
        model: models.Payment,
        as: "payment",
      },
      {
        model: models.Ticket,
        as: "ticket",
      },
    ]);
    if (userPurchase === null) {
      return {
        status: 404,
        msg: `Ticket purchase not found`,
      };
    } else if (userPurchase.user_id === user.id) {
      return {
        status: 200,
        userPurchase,
      };
    } else {
      return {
        status: 400,
        msg: "This ticket is not yours",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      msg: error,
    };
  }
};

const orgAuth = async (user, sessionId) => {
  try {
    let session = await sessionRepo.findById(sessionId, [
      {
        model: models.Event,
        as: "event",
      },
    ]);

    if (session === null) {
      return {
        status: 404,
        msg: "Session not found",
      };
    }

    let organizations = await orgRepo.findOne(
      {
        id: session.event.organizer_id,
        user_id: user.id,
      },
      undefined
    );

    if (organizations == null) {
      organizations = await orgTemRepo.findOne(
        {
          organization_id: session.event.organizer_id,
          user_id: user.id,
        },
        undefined
      );
      if (organizations == null) {
        return {
          status: 400,
          msg: "Session ID is not for your organization",
        };
      } else {
        return {
          status: 200,
          organizations,
          session,
        };
      }
    }

    return {
      status: 200,
      organizations,
      session,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      msg: error,
    };
  }
};

module.exports = {
  async getUserByEmail(email) {
    try {
      let user = null;
      user = await userRepo.findByEmail(email, [
        {
          model: models.Organization,
          as: "organizations",
        },
        {
          model: models.OrganizationTeam,
          as: "teamOrganizations",
        },
      ]);
      if (user === null) {
        return {
          status: 404,
          msg: `User account not found`,
        };
      }
      return {
        status: 200,
        data: user,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        msg: error,
      };
    }
  },
  async userLogin(username, email, password) {
    try {
      let user = null;
      if (username == undefined) {
        user = await userRepo.findByEmail(email, [
          {
            model: models.Organization,
            as: "organizations",
          },
          {
            model: models.OrganizationTeam,
            as: "teamOrganizations",
          },
        ]);
      } else {
        user = await userRepo.findByUsername(username, [
          {
            model: models.Organization,
            as: "organizations",
          },
          {
            model: models.OrganizationTeam,
            as: "teamOrganizations",
          },
        ]);
      }

      if (user === null) {
        return {
          status: 404,
          msg: `User account not found`,
        };
      }

      // let compare = await bcrypt.compare(password, user.password);
      let compare = await checkPassword(password, user.password);
      if (!compare) {
        return {
          status: 400,
          msg: "Password incorrect",
        };
      }

      let token = createToken(user);

      return {
        status: 200,
        data: {
          token: token,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        msg: error,
      };
    }
  },
  async loginUserWithGoogle(googleToken) {
    // console.log(googleToken, email);
    // let tokenDc = jwtDecode(googleToken)
    // // console.log(tokenDc);
    // let user = await userRepo.findOne({google_id: tokenDc.sub, email: email}, undefined)
    try {
      let tokenDc = jwt.verify(googleToken, process.env.JWT_SIGNATURE_KEY, {
        algorithms: process.env.JWT_ALG,
      });
      console.log(tokenDc, tokenDc.email);
      let user = await userRepo.findOne(
        { google_id: tokenDc.g_id, email: tokenDc.email },
        [
          {
            model: models.Organization,
            as: "organizations",
          },
          {
            model: models.OrganizationTeam,
            as: "teamOrganizations",
          },
        ]
      );

      if (user === null) {
        return {
          status: 404,
          msg: `User account not found`,
        };
      }

      let token = createToken(user);

      return {
        status: 200,
        data: {
          token: token,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        msg: error,
      };
    }
  },
  async authAccessUser(req, purchaseId) {
    try {
      let user = req.user;
      let resAuth = await userAuth(user, purchaseId);
      let userPurchase = resAuth.userPurchase;

      if (resAuth.status == 200) {
        if (userPurchase.payment.pay_state === "Belum Terbayar") {
          return {
            status: 400,
            msg: `You havn't pay this ticket`,
          };
        }
        let streamKey = req.params.streamkey;
        let streamKeyDB = await streamKeyRepo.findOne({
          session_id: userPurchase.ticket.session_id,
          stream_key: streamKey,
        });

        if (streamKeyDB == null) {
          return {
            status: 404,
            msg: `Stream Key not found`,
          };
        }

        return {
          status: 200,
          msg: `Stream Key match`,
        };
      } else {
        return resAuth;
      }
    } catch (error) {
      return {
        status: 500,
        msg: error.message,
      };
    }
  },
  async authAccessOrganizer(req, streamKey, sessionId) {
    try {
      let user = req.user;
      let resOrgAuth = await orgAuth(user, sessionId);
      let session = resOrgAuth.session;

      if (resOrgAuth.status !== 200) {
        return resOrgAuth;
      }

      let streamKeyMatch = streamKeyRepo.findOne(
        {
          session_id: session.id,
          stream_key: streamKey,
        },
        undefined
      );

      if (streamKeyMatch == null) {
        return {
          status: 404,
          msg: `Stream Key not found`,
        };
      }

      return {
        status: 200,
        msg: "Session ID and stream key is match",
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        msg: error.message,
      };
    }
  },
  async authAccessOrganizer_webrtc(user, roomId){
    try {
      let session = await sessionRepo.findOne({
        link: `webrtc-video-conference-${roomId}`
      }, undefined)
      if(!session){
        return {
          status: 404,
          msg: "room id not found"
        }
      }
      let event = await eventRepo.findOne(session.event_id)
      let isFIndOrgId = false
      user.organizations.forEach(org => {
        if(org.id === event.organizer_id){
          isFIndOrgId = true
        }
      });
      if(isFIndOrgId === false){
        user.teamOrganizations.forEach(org => {
          if(org.id === event.organizer_id){
            isFIndOrgId = true
          }
        })
      }

      if(isFIndOrgId === false){
        return {
          status: 403,
          msg: "user is not organizer or team"
        }
      }else{
        return {
          status: 200,
          msg: "success",
          session, event
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        msg: error.message,
      };
    }
  },
  async getStreamKey(req, sessionId, purchaseId) {
    let user = req.user;
    if (sessionId) {
      let resAuthOrg = await orgAuth(user, sessionId);
      if (resAuthOrg.status !== 200) {
        return resAuthOrg;
      }
      let streamKeyDB = await streamKeyRepo.findOne({
        session_id: sessionId,
      });

      if (streamKeyDB == null) {
        return {
          status: 404,
          msg: "Stream key not found",
        };
      }

      return {
        status: 200,
        data: streamKeyDB,
      };
    } else if (purchaseId) {
      let resAuthUser = await userAuth(user, purchaseId);
      if (resAuthUser.status !== 200) {
        return resAuthUser;
      }
      let streamKeyDB = await streamKeyRepo.findOne({
        session_id: resAuthUser.userPurchase.ticket.session_id,
      });

      if (streamKeyDB == null) {
        return {
          status: 404,
          msg: "Stream key not found",
        };
      }

      return {
        status: 200,
        data: streamKeyDB,
      };
    }
  },
};
