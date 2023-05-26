const regStream = require('../../../services/regStream')

const callbackFailed2 = (err) => {
    console.log(err);
    res.status(500).json({
      errors: err,
    });
  }

module.exports = {
    registerStream(req, res){
        regStream.registerStream(req.user, req.body.session).then(result => {
            res.status(result.status).json(result)
        }).catch(callbackFailed2)
    },
    removeStream(req, res){
        regStream.deleteStream(req.user, req.body.session).then(result => {
            console.log("menghapus stream key");
            res.status(result.status).json(result)
        }).catch(callbackFailed2)
    }
}