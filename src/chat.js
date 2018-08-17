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
        document.querySelector('.textAreaChat').value = '';
    }

    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }
    render() {
        const { chatMessages, userInfo } = this.props;
        // console.log("this.props", this.props);
        // console.log("friends", friends)
        if (!chatMessages) {
            return null;
        }

        const chatDiv = (

            <div className="chatMessages" ref={elem => (this.elem = elem)}>
                {chatMessages.map(message => (
                    <div key={message.created_at} className={
                        userInfo.id == message.user_id
                            ? "messageMe"
                            : "messageOther"
                    }>
                        <img className="pictureForChat" src={message.profilePic || '/images/default.png'} />
                        <div className="messageText">
                            <div className='messageName'>{message.name}</div>
                            <div className='messageText'>{message.message}</div>
                        </div>
                    </div>
                ))}
            </div>
        );

        return (
            <div id="MessagesOrNot">
                {chatDiv}

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
