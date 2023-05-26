const streamKeyRepo = require("../repositories/streamKey");
const sessionRepo = require("../repositories/session");

const models = require('../models')

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function authCheck(user, sessionId) {
  try {
    let session = await sessionRepo.findById(sessionId, [{
        model: models.Event,
        as: 'event'
      }]);

    if (session === null) {
      return {
        status: 404,
        msg: "Session not found",
      };
    }

    console.log(user);

    let organizations = user.organizations;
    let matchOrganizerId = false;
    for (let i = 0; i < organizations.length; i++) {
      if (session.event.organizer_id == organizations[i].id) {
        matchOrganizerId = true;
        i = organizations.length;
      }
    }
    if (!matchOrganizerId) {
      organizations = user.teamOrganizations;
      for (let i = 0; i < organizations.length; i++) {
        if (session.event.organizer_id == organizations[i].organization_id) {
          matchOrganizerId = true;
          i = organizations.length;
        }
      }
      if (!matchOrganizerId) {
        return {
          status: 400,
          msg: "Session ID is not for your organization",
        };
      }
    }

    return {
      status: 200,
    };
  } catch (error) {
    console.log("error cek login", error);
    return {
      status: 500,
      msg: error.message,
    };
  }
}

module.exports = {
  async registerStream(user ,sessionId) {
    try {
      let authState = await authCheck(user, sessionId);
      if (authState.status !== 200) {
        return authState;
      }

      let date = new Date();
      let streamKey = makeid(7) + "_" + date.getTime();

      let streamKeys = await streamKeyRepo.findBySession(sessionId, undefined)

      if(streamKeys.length > 0){
        console.log(streamKeys.length, '=============== Stream key pernah terdaftar ==============');
        return {
          status: 403,
          msg: 'Stream key has been registered',
        };
      }else{
        let result = await streamKeyRepo.create({
          session_id: sessionId,
          stream_key: streamKey,
        });
  
        return {
          status: 201,
          data: result,
        };
      }
    } catch (error) {
      console.log("error try reg stream");
      return {
        status: 500,
        msg: error.message,
      };
    }
  },
  async deleteStream(user, sessionId) {
    try {
      let authState = await authCheck(user, sessionId);
      if (authState.status !== 200) {
        return authState;
      }

      let result = await streamKeyRepo.deleteBySession(sessionId);
      return {
        status: 201,
        data: result,
      };
    } catch (error) {
      console.log("Error try delete stream");
      return {
        status: 500,
        msg: error.message,
      };
    }
  },
};
