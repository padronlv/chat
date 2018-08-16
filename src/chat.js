import React from 'react';
import { connect } from 'react-redux';
import { newMessageSocket } from'./socket';

class Chat extends React.Component {
    constructor() {
        super();
        this.state = {};

        this.handleChangeTextarea = this.handleChangeTextarea.bind(this);
        this.handleSubmitTextarea = this.handleSubmitTextarea.bind(this);
    }
    handleChangeTextarea(e) {
        this.setState({
            [e.target.name]: e.target.value

        }, () => {
            // console.log(this.state);
        });
    }
    handleSubmitTextarea(e) {
        e.preventDefault();
        // console.log("Running handleSubmit", this.state);
        newMessageSocket(this.state.chatMessage);
    }

    componentDidMount() {
        // !this.friendsWannabes && this.props.dispatch(receiveFriendsWannabes());
    }
    render() {
        const { chatMessages, userInfo } = this.props;
        // console.log("this.props", this.props);
        // console.log("friends", friends)
        if (!chatMessages) {
            return null;
        }

        const chatDiv = (
            <div>

                <div className="chatMessages">
                    {chatMessages.map(message => (
                        <div key={message.created_at} className={
                            userInfo.id == message.user_id
                                ? "messageMe"
                                : "messageOther"
                        }>
                            <img className="pictureForChat" src={message.profilePic || '/images/default.png'} />
                            <div className="messageText">
                                <div className='messageName'>Created at {message.created_at} by {message.name}</div>
                                <div className='messageText'>{message.message}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );

        return (
            <div id="MessagesOrNot">
                <h1>Spiced Chat</h1>
                {!chatMessages.length && <div>Chat is empty, start a new conversation!</div>}
                {!!chatMessages.length && chatDiv}

                <form onSubmit={ this.handleSubmitTextarea } className="">
                    <textarea className="textAreaChat" name="chatMessage" onChange={ this.handleChangeTextarea }></textarea>
                    <button className="submitButton" type="submit">Send</button>
                </form>
            </div>
        );
    }
}
export default connect(state => {
    return {
        userInfo: state.userInfo,
        chatMessages: state.chatMessages
    };
})(Chat);
