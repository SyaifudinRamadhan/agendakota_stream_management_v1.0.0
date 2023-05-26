const express = require("express");
const path = require("path");
const cors = require("cors");
const controllers = require("../app/controllers");

const apiRouter = express.Router();


// ================================= AREA TESTING VARIABEL ================
const {User} = require('../app/models')
apiRouter.get('/tesst', function(req, res){
  let users = User.findAll()
  users.then((result) => {
    console.log(result);
    res.send(result)
  }).catch((err) => {
    console.log(err);
    res.send(err)
  });
})
// ========================================================================

/**
 * TODO: Implement your own API
 *       implementations
 */
// ================== Yang digunakan ======================================

apiRouter.use(cors());

apiRouter.get("/streams/:streamkey/index.m3u8", controllers.midd.auth.isLogin, controllers.midd.streamProtect.userIsAllowed);

apiRouter.use(express.static(path.join(__dirname, "../bin/public")));

apiRouter.post("/api/v1/login", controllers.api.v1.auth.loginUser);
apiRouter.post('/api/v1/login-google', controllers.api.v1.auth.loginUserWithGoogle);
apiRouter.get("/api/v1/get-stream-key-session/:sessionId", controllers.midd.auth.isLogin, controllers.api.v1.auth.getStreamKey);
apiRouter.get("/api/v1/get-stream-key-purchase/:purchaseId", controllers.midd.auth.isLogin, controllers.api.v1.auth.getStreamKey);
// Route callback stream confirm dari nginx
apiRouter.get("/api/v1/auth", controllers.midd.timeStreamProtect.timeStream, controllers.api.v1.auth.authStream);
// Route registrasi dan hapus stream
apiRouter.post("/api/v1/reg-stream", controllers.midd.auth.isLogin, controllers.api.v1.regStream.registerStream)
apiRouter.post("/api/v1/del-stream", controllers.midd.auth.isLogin, controllers.api.v1.regStream.removeStream)

// =========================================================================

// apiRouter.get("/api/v1/posts", controllers.api.v1.postController.list);
// apiRouter.post("/api/v1/posts", controllers.api.v1.postController.create);
// apiRouter.put("/api/v1/posts/:id", controllers.api.v1.postController.update);
// apiRouter.get("/api/v1/posts/:id", controllers.api.v1.postController.show);

// apiRouter.delete(
//   "/api/v1/posts/:id",
//   controllers.api.v1.postController.destroy
// );

/**
 * TODO: Delete this, this is just a demonstration of
 *       error handler
 */
apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;
