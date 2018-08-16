

export function pushUserInformationToRedux(user) {
    // console.log('pushUserInformationToRedux - action' , user);
    return {
        type: 'PUSH_USER_INFORMATION_TO_REDUX',
        user
    };
}
export function pushOnlineUsersToRedux(onlineUsers) {
    return {
        type: 'PUSH_ONLINE_USERS_TO_REDUX',
        onlineUsers

    };
}

export function pushOfflineUsersToRedux(offlineUsers) {
    return {
        type: 'PUSH_OFFLINE_USERS_TO_REDUX',
        offlineUsers

    };
}


export function pushOpenChatWindowsToRedux(chatWindows) {
    return {
        type: 'PUSH_OPEN_CHAT_WINDOWS_TO_REDUX',
        chatWindows
    };
}

export function openChatWindow (chatWindow) {
    // console.log('openChatWindow' , chatWindow);
    return {
        type:'OPEN_CHAT_WINDOW',
        chatWindow
    };
}

export function closeChatWindow (chatWindow) {
    // console.log('closeChatWindow' , chatWindow);
    return {
        type:'CLOSE_CHAT_WINDOW',
        chatWindow
    };
}

export function userJoined (user) {
    // console.log('userjoined' , user);
    return {
        type:'USER_JOINED',
        user
    };
}

export function userLeft (user) {
    // console.log('userLeft' , user);
    return {
        type:'USER_LEFT',
        user
    };
}
export function pushChatMessagesToRedux(chatMessages) {
    return {
        type: 'PUSH_CHAT_MESSAGES_TO_REDUX',
        chatMessages
    };
}
export function newMessageAction (chatMessage) {
    // console.log('newMessage' , chatMessage);
    return {
        type:'NEW_MESSAGE',
        chatMessage
    };
}


export function pushPrivateMessagesToRedux(privateMessages) {
    return {
        type: 'PUSH_PRIVATE_MESSAGES_TO_REDUX',
        privateMessages
    };
}
export function newPrivateMessageAction (privateMessage) {
    // console.log('newMessage' , privateMessage);
    return {
        type:'NEW_PRIVATE_MESSAGE',
        privateMessage
    };
}
