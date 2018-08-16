export default function(state = {}, action) {

    if (action.type == 'PUSH_USER_INFORMATION_TO_REDUX') {
        console.log('pushUserInformationToRedux - reducer' , action.user);
        state = {
            ...state,
            userInfo: action.user
        };
    }

    if (action.type == 'PUSH_ONLINE_USERS_TO_REDUX') {
        console.log("pushOnlineUsersToRedux", action.onlineUsers);
        state = {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }

    if (action.type == 'PUSH_OFFLINE_USERS_TO_REDUX') {
        console.log("pushOfflineUsersToRedux", action.offlineUsers);
        state = {
            ...state,
            offlineUsers: action.offlineUsers
        };
    }

    if (action.type == 'USER_JOINED') {
        state = {
            ...state,
            onlineUsers: [...state.onlineUsers, action.user],
            offlineUsers: state.offlineUsers.filter(user => user.id != action.user.id)
        };
    }

    if (action.type == 'USER_LEFT') {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(user => user.id != action.user.id),
            offlineUsers: [...state.offlineUsers, action.user]
        };
    }

    if (action.type == 'PUSH_OPEN_CHAT_WINDOWS_TO_REDUX') {
        console.log("pushOpenChatWindowsToRedux", action.chatMessages);
        state = {
            ...state,
            chatWindows: action.chatWindows
        };
    }

    if (action.type == 'OPEN_CHAT_WINDOW') {
        state.chatWindows.find(
            chatWindow => chatWindow.id == action.chatWindow.id
        ) || state.userInfo.id == action.chatWindow.id
            ? state = {...state}
            : state = {
                ...state,
                chatWindows: [...state.chatWindows, action.chatWindow]
            };
    }

    if (action.type == 'CLOSE_CHAT_WINDOW') {
        state = {
            ...state,
            chatWindows: state.chatWindows.filter(
                chatWindow => chatWindow.id != action.chatWindow.id
            )
        };
    }



    if (action.type == 'PUSH_CHAT_MESSAGES_TO_REDUX') {
        console.log("pushChatMessagesToRedux", action.chatMessages);
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }


    if (action.type == 'NEW_MESSAGE') {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.chatMessage]
        };
    }


    if (action.type == 'PUSH_PRIVATE_MESSAGES_TO_REDUX') {
        console.log("pushPrivateMessagesToRedux", action.chatMessages);
        state = {
            ...state,
            privateMessages: action.privateMessages
        };
    }

    if (action.type == 'NEW_PRIVATE_MESSAGE') {
        state = {
            ...state,
            privateMessages: [...state.privateMessages, action.privateMessage]
        };
    }
    
    return state;
}
