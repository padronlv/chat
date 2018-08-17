const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });
const compression = require('compression');
const db = require('./db/db');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const bc = require('./bc/bcrypt');
const csurf = require('csurf');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');
const config = require('./config');


app.use(cookieParser());

const cookieSessionMiddleware = cookieSession({
    secret: `Im always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(compression());

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get('/logout', (req, res) => {
    req.session.userId = null;
    res.redirect("/welcome");
});


app.get('/user', function(req, res) {
    db.getYourUserInfo(req.session.userId).then(
        data => {
            // console.log("data get your user info ", data);
            res.json({
                ...data,
                profile_pic: data.profile_pic || '/images/default.png'

            });
        }).catch(error => {
        console.log(error);
    });
});

app.post('/registration', (req, res) => {
    if (
        req.body.name == ""
        || req.body.email == ""
        || req.body.password == ""
    ) {
        // console.log("empty");
        return res.json({
            error: "Please, fill in all the fields"
        });
    } else {
        // console.log("inside POST /registration", req.body);
        bc.hashPassword(req.body.password)
            .then(hashedPassword => {
                console.log("hashedPassword: ", hashedPassword);
                db.insertUser(req.body.name, req.body.email, hashedPassword)
                    .then(newUser => {
                        req.session.userId = newUser.id;
                        // console.log(req.session.userId);
                        // console.log(newUser);
                        // res.redirect('/profile');
                        return res.json(newUser);
                    }).catch((error) => {
                        console.log(error);
                        return res.json({
                            error : "Your Email is already taken, please try again"
                        });
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.post('/login', (req, res) => {
    db.getYourUserByEmail(req.body.email)
        .then(user => {
            if(user == undefined) {
                // console.log("posting is working");
                res.json({
                    error: "The Email doesn't match any user"
                });
            } else {
                bc.checkPassword(req.body.password, user.hashed_password)
                    .then(doThePasswordsMatch => {
                        // console.log("doThePasswordsMatch: ", doThePasswordsMatch);
                        if (doThePasswordsMatch) {
                            req.session.userId = user.id;
                            res.json(user);
                        } else {
                            // console.log("false password page");
                            res.json({
                                error: "The password is wrong, please try again"
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }

        })
        .catch(err => {
            console.log(err);
        });
});



app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});



app.get('*', requireUser, function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

function requireUser(req, res, next) {
    if (!req.session.userId) {
        res.redirect("/welcome");
        // res.status(403).json({ success: false });
    } else {
        next();
    }
}
server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.");
});

let onlineUsers = {};


io.on('connection', function(socket) {
    // console.log(`socket with the id ${socket.id} is now connected`);
    // console.log(`socket with the id ${socket.request.session.userId} is now connected`);
    onlineUsers[socket.id]= socket.request.session.userId;
    // console.log(onlineUsers);

    db.getUsersByIds(Object.values(onlineUsers))
        .then(onlineUsers => {

            // console.log('users in dbquery online for socket', onlineUsers);
            socket.emit("onlineUsers", onlineUsers);
        }).catch(err => {
            console.log(err);
        });
    db.getUsersByNoIds(Object.values(onlineUsers))
        .then(offlineUsers => {
            // console.log('users in dbquery offline for socket', offlineUsers);
            socket.emit("offlineUsers", offlineUsers);
        }).catch(err => {
            console.log(err);
        });

    db.getChatsToOpen(socket.request.session.userId).then(chatWindows => {
        socket.emit("chatWindows", chatWindows);
    });
    db.getChatMessages().then(chatMessages => {
        socket.emit("chatMessages", chatMessages.slice(-10));
    });
    db.getPrivateMessages(socket.request.session.userId).then(privateMessages => {
        socket.emit('privateMessages', privateMessages);
    });


    if (
        Object.values(onlineUsers).filter(id => id == socket.request.session.userId).length == 1
    ) {
        db.getYourUserInfo(socket.request.session.userId).then(
            data => {
                socket.broadcast.emit("userJoined", data);
                // console.log("data get your user info ", data);

            }).catch(error => {
            console.log(error);
        });

    }
    socket.on('disconnect', function() {

        if (
            Object.values(onlineUsers).filter(id => id == socket.request.session.userId).length == 1
        ) {
            db.getYourUserInfo(socket.request.session.userId).then(
                userLeft => {
                    socket.broadcast.emit("userLeft", userLeft);
                    // console.log("data get your user info ", data);
                    db.updateRead(socket.request.session.userId).then(
                        readMessages => {
                            console.log("read messages", readMessages);
                        }).catch(error => {
                        console.log(error);
                    })

                }).catch(error => {
                console.log(error);

                });

        }
        delete onlineUsers[socket.id];
        // io.emit('userLeft', userId);
        console.log(`socket with the id ${socket.id} is now disconnected`);

    });

    socket.on('newMessage', function (newMessage) {
        db.addChatMessage(socket.request.session.userId, newMessage).then(
            dataChatMessage => {
                db.getYourUserInfo(dataChatMessage.user_id).then(
                    userInfo => {
                        let completeNewMessage = {
                            ...dataChatMessage,
                            name: userInfo.name
                        }
                        io.sockets.emit('newMessageBack', completeNewMessage);
                    }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {
            console.log(error);
        });
    });
    socket.on('newPrivateMessage', function (newPrivateMessage) {
        console.log('newPrivateMessage Socket on', newPrivateMessage)
        db.addPrivateMessage(socket.request.session.userId, newPrivateMessage.receiverId, newPrivateMessage.content).then(
            dataPrivateMessage => {
                db.getYourUserInfo(socket.request.session.userId).then(
                    dataChatWindow => {
                        let completePrivateMessage = {
                            privateMessage: dataPrivateMessage,
                            chatWindow: dataChatWindow

                        }
                        socket.emit("newPrivateMessageBack", completePrivateMessage);
                        if (
                            Object.values(onlineUsers).filter(id => id == dataPrivateMessage.receiver_id).length > 0
                        ) {
                            for (const socketId in onlineUsers) {
                                if (onlineUsers[socketId] == dataPrivateMessage.receiver_id) {
                                    io.sockets.sockets[socketId].emit("newPrivateMessageBack", completePrivateMessage);
                                }
                            }
                        }
                    }).catch(error => {
                    console.log(error);
                });

            }).catch(error => {
            console.log(error);
        });


    });


});
