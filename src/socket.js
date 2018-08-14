import * as io from 'socket.io-client';
import { pushOnlineUsersToRedux, userJoined, userLeft, pushChatMessagesToRedux, newMessageAction, pushOpenChatWindowsToRedux, pushPrivateMessagesToRedux, openChatWindow, newPrivateMessageAction } from './actions';

let socket;

export function init(store) {
    if (!socket) {
        socket = io.connect();

        socket.on('onlineUsers', users => {
            console.log("users on onlineUser listen", users);
            store.dispatch(pushOnlineUsersToRedux(users));
        });

        socket.on('userJoined', user => {
            store.dispatch(userJoined(user));
        });

        socket.on('userLeft', userId => {
            store.dispatch(userLeft(userId));
        });
        socket.on('chatMessages', chatMessages => {
            store.dispatch(pushChatMessagesToRedux(chatMessages));
        });

        socket.on('privateMessages', privateMessages => {
            store.dispatch(pushPrivateMessagesToRedux(privateMessages));
        });

        socket.on('chatWindows', chatWindows => {
            store.dispatch(pushOpenChatWindowsToRedux(chatWindows))
        })

        socket.on('newPrivateMessageBack', newMessageAndChatWindow => {
            store.dispatch(newPrivateMessageAction(newMessageAndChatWindow.privateMessage));
            store.dispatch(openChatWindow(newMessageAndChatWindow.chatWindow))
        });

        socket.on('newMessageBack', newMessage => {
            store.dispatch(newMessageAction(newMessage));
        });
    }
// socket.emit('newMessage', newMessage => {
//     store.dispatch(newMessage(newMessage));
// });
}

export function newMessageSocket(newMessageSocket) {
    socket.emit('newMessage', newMessageSocket);
}

export function newPrivateMessage(newPrivateMessage) {
    socket.emit('newPrivateMessage', newPrivateMessage);
}




// socket.on('welcome', function(data) {
//     console.log(data);
//     socket.emit('thanks', {
//         message: 'Thank you. It is great to be here.'
//     });
// });
