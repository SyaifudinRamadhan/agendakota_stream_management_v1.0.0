const timeStrSvc = require('../../services/timeStream')

module.exports = {
    timeStream(req, res, next){
        console.log('masuk midd time stream');
        let sessionId = req.query.session;
        timeStrSvc.timeStreaming({sessionId: sessionId}).then(result => {
            if(result.status === 200){
                next()
            }else{
                res.status(500).send(result.msg);
                return;
            }
        })
    },

    async timeStream_v2(roomId){
        let res = await timeStrSvc.timeStreaming({streamKey: roomId})
        return res
    }
}