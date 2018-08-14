import React, {Component} from 'react';
import axios from './axios';
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

        // console.log("Running handleSubmit", this.state);
        newPrivateMessage(this.state.newPrivateMessage);
    }

    componentDidMount() {

    }

    render() {
        const { privateMessages } = this.props;
        console.log("this.state", privateMessages);
        {/*console.log("comments", comments);*/}
        if (!privateMessages) {
            return (<div>Loading...</div>);
        }
        const privateMessagesDiv = (
            <div className="privateMessages">
                {privateMessages.map(privateMessage => (
                    <div className="commentBox">
                        <div className='infoAboutComment'>{privateMessage.sender_id}</div>
                        <div className='commentUploaded'>{privateMessage.message}</div>
                    </div>
                ))}
            </div>
        );

        return (
            <div id="commentsOrNot">
                {!privateMessages.length && <div>No messages yet. Time to start a conversation!</div>}
                {!!privateMessages.length && privateMessagesDiv}

                <form onSubmit={ this.handleSubmitTextarea } className="">
                    <textarea className="textAreaComment" name="comment" onChange={ this.handleChangeTextarea }></textarea>
                    <button className='submitButton' type="submit">Send Message</button>
                </form>
            </div>
        );
    }
}

export default connect(state => {
    return {
        privateMessages: state.privateMessages && state.privateMessages
        // .filter(pm => pm.receiver_id == this.props.otherUser.id || pm.sender_id == this.props.otherUser.id)
    };
})(Private);
