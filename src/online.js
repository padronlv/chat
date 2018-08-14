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
        const { onlineUsers } = this.props;
        if (!onlineUsers) {
            return null;
        }
        console.log("this.props", this.props);
        console.log("friends", onlineUsers)
        const onlineUsersDiv = (
            <div className="onlineUsers">
                {onlineUsers.map(onlineUser => (
                    <div key={onlineUser.id} className="friend">
                        <img className="OppPicture" src={onlineUser.profile_pic || '/images/default.png'} />
                        <div>{onlineUser.name}</div>
                        <div id="openChatWindow">
                            <button onClick={() => this.props.dispatch(openChatWindow(onlineUser))} className="openButton">Open Chat</button>
                        </div>

                    </div>
                ))}
            </div>
        );

        return (
            <div id="onlineOrNot">
                {!onlineUsers.length && <div>Nobody is Online</div>}
                {!!onlineUsers.length && onlineUsersDiv}
            </div>
        );
    }
}
export default connect(state => {
    return {

        onlineUsers: state.onlineUsers,
    };
})(Online);
