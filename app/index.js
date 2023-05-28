/**
 * @file Bootstrap express.js server
 * @author SyaifudinRamadhan
 */

const express = require("express");
const morgan = require("morgan");
const router = require("../config/routes");
const http = require("http");
const BrowserToRtmpServer = require("@api.video/browser-to-rtmp-server");
const { ExpressPeerServer } = require("peer");
const midd = require("./controllers/middleware");

const app = express();
const server = http.createServer(app);

// const {Server} = require('socket.io');

// const io = new Server(server, {cors: {origin: "*"}});

const peer = ExpressPeerServer(server, {
  debug: true,
});

/** Install request logger */
app.use(morgan("dev"));

/** Install JSON request parser */
app.use(express.json());

app.use("/peerjs", peer);

/** Install Router */
app.use(router);

const browserToRtmpServer = new BrowserToRtmpServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  socketio: {
    cors: {
      origin: "*",
      credentials: true,
    },
  },
});

const socket = browserToRtmpServer.getSocket();

peer.on('connection', client => {
  let objAuth = JSON.parse(client.token)
  midd.auth.isLogin_v2(objAuth.token).then(result => {
    if(result.status !== 200){
      client.socket.close()
    }else{
      midd.timeStreamProtect.timeStream_v2(objAuth.room).then(res => {
        console.log(res);
        if(res.status !== 200){
          client.socket.close()
        }else{
          if(client.id.match(/universal-media-share/gi)){
            midd.auth.isOrganizer_webrtc(result.user, objAuth.room).then(res2 => {
              if(res2.status !== 200){
                client.socket.close()
              }
            })
          }
        }
      })
    }
  })
})

socket.use((sc, next) => {
    if (sc.handshake.query && sc.handshake.query.token){
      midd.auth.isLogin_v2(sc.handshake.query.token).then(result => {
        if(result.status !== 200){
          next(new Error('Authentication error'));
        }else{
          next()
        }
      })
      return
    }
    else {
      next(new Error('Authentication error'));
    }
}).on("connection", (c) => {
  console.log(`New connection socket only: ${c.id}`);
  //   console.log(c);

  c.on("join-room", (roomId, id, myname, userData) => {
    console.log(roomId, id, myname);
    
    console.log(userData.organizations)
    console.log(userData)
    c.join(roomId);
    socket.to(roomId).emit("user-connected", id, myname);

    c.on("messagesend", (message) => {
      console.log(message);
      socket.to(roomId).emit("createMessage", message);
    });

    c.on("tellName", (myname) => {
      console.log(myname);
      socket.to(roomId).emit("AddName", myname);
    });

    c.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", id);
    });

    c.on('share-disconnect', (id) => {
      socket.to(roomId).emit("user-disconnected", id);
    })

    c.on('share-universal-media', (username) => {
      midd.auth.isOrganizer_webrtc(userData, roomId).then(res => {
        console.log(res)
        console.log('--------------------- share universal media -----------------')
        if(res.status === 200){
          socket.to(roomId).emit('call-share-universal-media', username);
        }
      }) 
    })

    c.on('receive-share-universal-media', id => {
      console.log('receive-share-universal-media', id);
      socket.to(roomId).emit('request-share-universal-media', id)
    })

    c.on('video-close', (id, username) => {
      console.log('video close '+id);
      socket.to(roomId).emit('msg-video-close', id, username)
    })

    c.on('video-on', (id, username) => {
      socket.to(roomId).emit('msg-video-on', id, username)
    })

    c.on('audio-close', (id, username) => {
      socket.to(roomId).emit('msg-audio-close', id, username)
    })

    c.on('audio-on', (id, username) => {
      socket.to(roomId).emit('msg-audio-on', id, username)
    })

    c.on('command-pinning', (idTarget, idHost) => {
      midd.auth.isOrganizer_webrtc(userData, roomId).then(res => {
        console.log(res)
        console.log(userData.organizations)
        console.log('--------------------- command pinning -----------------')
        if(res.status === 200){
          socket.to(roomId).emit('pinning-request', idTarget, idHost)
        }
      }) 
    })

    c.on('user-count', (val => {
      socket.to(roomId).emit('set-user-count', val)
    }))

    c.on('command-rename-class-slide', (old, nName) => {
      socket.to(roomId).emit('rename-class-slide', old, nName)
    })

    c.on('command-auto-pinning', data => {
      socket.to(roomId).emit('auto-pinning', data)
    })

    c.on('command-rm-pinning', (idTarget, idHost) => {
      socket.to(roomId).emit('rm-pinning', idTarget, idHost)
    })

    c.on('command-raise-hand', username => {
      socket.to(roomId).emit('raise-hand', username)
    })

    c.on('command-lower-hand', username => {
      socket.to(roomId).emit('lower-hand', username)
    })
  });
});

browserToRtmpServer.on("connection", (c) => {
  console.log(`New connection uuid: ${c.uuid}`);
});

browserToRtmpServer.on("ffmpegOutput", (uuid, message) => {
  console.log(`Ffmpeg output for connection ${uuid}: ${message}`);
});

browserToRtmpServer.on("error", (uuid, error) => {
  console.log(`Error for connection ${uuid}: ${error}`);
  console.log(error);
});

// io.on("connection", (c) => {
//     console.log(`New connection dari socket uuid: ${c.uuid}`);
// })

// io.on("connection", (socket) => {
//     console.log(`New connection dari socket uuid: ${socket.uuid}`);
//     socket.on("join-room", (roomId, id, myname) => {
//         console.log(roomId);
//         socket.join(roomId);
//         socket.to(roomId).broadcast.emit("user-connected", id, myname);

//         socket.on("messagesend", (message) => {
//             console.log(message);
//             io.to(roomId).emit("createMessage", message);
//         });

//         socket.on("tellName", (myname) => {
//             console.log(myname);
//             socket.to(roomId).broadcast.emit("AddName", myname);
//         });

//         socket.on("disconnect", () => {
//             socket.to(roomId).broadcast.emit("user-disconnected", id);
//         });
//     });
// });

module.exports = server;
