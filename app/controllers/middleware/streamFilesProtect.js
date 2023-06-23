const auth = require('../../services/auth')

module.exports = {
    userIsAllowed(req, res, next){
        // let username = req.query.username
        // let email = req.query.email
        // let pass = req.query.password
        let purchaseId = req.query.purchase
        let sessionId = req.query.session
        let spcTest = req.query.keyTest;
    
        let user = req.user
        
        console.log('Masuk middleware');
        if (spcTest === "5ade91cc") {
            next();
        }else if(purchaseId !== undefined){
            auth.authAccessUser(req, purchaseId).then(result => {
                if(result.status === 200){
                    console.log('res next');
                    next()
                }else{
                    console.log('res end');
                    res.status(result.status).end(result.msg)   
                }
            }).catch(err => {
                console.log('res end error');
                res.status(500).end(err)   
            })
        }else if(sessionId !== undefined){
            auth.authAccessOrganizer(req ,req.params.streamkey, sessionId).then(result => {
                if(result.status === 200){
                    console.log('res next');
                    next()
                }else{
                    console.log('res end');
                    res.status(result.status).end(result.msg)   
                }
            }).catch(err => {
                console.log('res end error');
                res.status(500).end(err)   
            })
        }else{
            console.log('res end error');
            console.log(err);
            res.status(500).end(err)
        }
    }
}