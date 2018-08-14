import React, {Component} from 'react';
import axios from './axios';
import Private from './private';
import { connect } from 'react-redux';

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
                {chatWindows.map(window => (
                    <div key={window.id} className="window">
                        <div className="bigName">
                            { window.name }
                        </div>
                        <img className="OppPicture" src={window.profile_pic || '/images/default.png'} />
                        <Private otherUser={ window }/>
                    </div>
                ))}
            </div>
        );

        return (
            <div id="ChatsOrNot">
                {!chatWindows.length && <div>No Chats yet. Time to start a Chat!</div>}
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
