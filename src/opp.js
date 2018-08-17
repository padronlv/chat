import React, {Component} from 'react';
// import axios from './axios';
import Private from './private';
import { connect } from 'react-redux';
import { closeChatWindow } from'./actions';

class Opp extends Component {
    constructor(props) {
        super(props);

        this.state = {};

    }
    render() {
        const { chatWindows } = this.props;
        {/*console.log("this.state", this.state);*/}
        {/*console.log("comments", comments);*/}
        if (!chatWindows) {
            return null;
        }
        const chatWindowsDiv = (
            <div className="chatWindows">
                {chatWindows.map(chatWindow => (
                    <div key={chatWindow.id} className="chatWindow">
                        <img className="pictureForChat" src={chatWindow.profile_pic || '/images/default.png'} />
                        <div className="userName">
                            { chatWindow.name }
                        </div>
                        <div onClick={() => this.props.dispatch(closeChatWindow(chatWindow))} className="closer">X</div>

                        <Private otherUser={ chatWindow }/>
                    </div>
                ))}
            </div>
        );

        return (
            <div id="chatsOrNot">
                {!chatWindows.length && <div className="titleChats">No open chats</div>}
                {!!chatWindows.length && chatWindowsDiv}
            </div>
        );
    }
}


export default connect(state => {
    return {
        chatWindows: state.chatWindows,
    };
})(Opp);
