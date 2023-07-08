const sessionRepo = require("../repositories/session");
const streamKeyRepo = require("../repositories/streamKey");

module.exports = {
  async timeStreaming({streamKey, sessionId}) {
    try {
      let session;
      if(sessionId){
        session = await sessionRepo.findOne(
            {
              id: sessionId,
            },
            undefined
          );
      } else {
        let stream = await streamKeyRepo.findOne(
          {
            stream_key: streamKey,
          },
          undefined
        );

        if (!stream) {
          stream = await streamKeyRepo.findOne(
            {
              stream_key: 'webrtc-video-conference-'+streamKey,
            },
            undefined
          );
          if(!stream){
            return {
              status: 404,
              msg: "stream key not found",
            };
          }
        }

        session = await sessionRepo.findOne(
          {
            id: stream.session_id,
          },
          undefined
        );
      }
    
      if (!session) {
        return {
          status: 404,
          msg: "room id sessioon not found",
        };
      }
      let now = new Date();
      let sessionStart = new Date(session.start_date + " 00:00:00");
      let sessionEnd = new Date(session.end_date + " " + session.end_time);
      console.log(now.toDateString(), sessionStart.toDateString(), sessionEnd.toDateString(), now.toTimeString(), sessionStart.toTimeString(), sessionEnd.toTimeString());
      if (now < sessionStart || now > sessionEnd) {
        return {
          status: 403,
          msg: "session time is not match",
        };
      }
      
      return {
        status: 200,
        msg: "success",
        session,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        msg: error,
      };
    }
  },
};
