import React, {Component} from 'react';
// import axios from './axios';
import { connect } from 'react-redux';
import { newPrivateMessage } from'./socket';


class Private extends Component {
    constructor() {
        super();
        this.state = {
        };

        this.handleChangeTextarea = this.handleChangeTextarea.bind(this);
        this.handleSubmitTextarea = this.handleSubmitTextarea.bind(this);
    }
    handleChangeTextarea(e) {
        this.setState({
            newPrivateMessage: {
                content: e.target.value,
                receiverId: this.props.otherUser.id
            }

        }, () => {
            console.log(this.state);
        });
    }

    handleSubmitTextarea(e) {
        e.preventDefault();

        console.log("Running handleSubmit", this.state.newPrivateMessage);
        newPrivateMessage(this.state.newPrivateMessage);
    }

    componentDidMount() {

    }

    render() {
        const { privateMessages, userInfo } = this.props;
        let filteredPM = privateMessages.filter(pm => pm.receiver_id == this.props.otherUser.id || pm.sender_id == this.props.otherUser.id);
        console.log("this.props", privateMessages);
        {/*console.log("comments", comments);*/}
        if (!privateMessages) {
            return (<div>Loading...</div>);
        }
        const privateMessagesDiv = (
            <div className="privateMessages">
                {filteredPM.map(privateMessage => (
                    <div key={privateMessage.created_at}  className={
                        userInfo.id == privateMessage.sender_id
                            ? "privateMessageMe"
                            : "privateMessageOther"
                    }>
                        <div className='privateMessage'>{privateMessage.message}</div>
                    </div>
                ))}
            </div>
        );

        return (
            <div className="privateMessagesOrNot">
                {!privateMessages.length && <div>No messages yet. Time to start a conversation!</div>}
                {!!privateMessages.length && privateMessagesDiv}

                <form onSubmit={ this.handleSubmitTextarea } className="">
                    <textarea className="textAreaPrivate" name="comment" onChange={ this.handleChangeTextarea }></textarea>
                    <button className='submitButtonPrivate' type="submit">Send</button>
                </form>
            </div>
        );
    }
}

export default connect(state => {
    return {
        userInfo: state.userInfo,
        privateMessages: state.privateMessages
    };
})(Private);
