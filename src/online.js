import React from 'react';
import { connect } from 'react-redux';
import { openChatWindow } from'./actions';

class Online extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {
        // !this.friendsWannabes && this.props.dispatch(receiveFriendsWannabes());
    }
    render() {
        const { onlineUsers, offlineUsers } = this.props;
        if (!onlineUsers || !offlineUsers) {
            return null;
        }
        // console.log("this.props", this.props);
        // console.log("friends", onlineUsers);
        const onlineUsersDiv = (
            <div className="onlineUsers">
                {onlineUsers.map(onlineUser => (
                    <div key={onlineUser.id} onClick={() => this.props.dispatch(openChatWindow(onlineUser))} className="user">
                        <img className="pictureForOnline" src={onlineUser.profile_pic || '/images/default.png'} />
                        <div className='userName'>{onlineUser.name}</div>

                    </div>
                ))}
            </div>
        );
        const offlineUsersDiv = (
            <div className="onlineUsers">
                {offlineUsers.map(offlineUser => (
                    <div key={offlineUser.id} onClick={() => this.props.dispatch(openChatWindow(offlineUser))} className="user">
                        <img className="pictureForOnline" src={offlineUser.profile_pic || '/images/default.png'} />
                        <div className='userName'>{offlineUser.name}</div>
                    </div>
                ))}
            </div>
        );

        return (
            <div className="onlineOrNot">
                <div className="textOnline">Online</div>
                {!onlineUsers.length && <div>Nobody is Online</div>}
                {!!onlineUsers.length && onlineUsersDiv}
                <div className='textOnline'>Offline</div>
                {!offlineUsers.length && <div>Nobody is Offline</div>}
                {!!offlineUsers.length && offlineUsersDiv}
            </div>
        );
    }
}
export default connect(state => {
    return {

        onlineUsers: state.onlineUsers,
        offlineUsers: state.offlineUsers
    };
})(Online);
