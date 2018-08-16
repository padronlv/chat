import React from 'react';
import { connect } from 'react-redux';
import axios from './axios';
import { BrowserRouter } from 'react-router-dom';
import Chat from './chat';
import Online from './online';
import Opp from './opp';
import NavLogin from './navLogin';
import Footer from './footer';
import { pushUserInformationToRedux } from './actions';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
    }
    showUploader() {
        // console.log("showUploader")
        this.setState({
            uploaderIsVisible: true
        });
    }
    setImage(url) {
        this.setState({
            image: url,
            uploaderIsVisible: false
        });
    }

    componentDidMount() {
        axios.get('/user').then(
            ({data}) => {
                console.log(data);
                this.props.dispatch(pushUserInformationToRedux(data));
            }
        );
    }
    render () {
        if(!this.props.userInfo) {
            return (
                <div>Loading...</div>
            );
        }



        return (
            <div id="app">
                <BrowserRouter>
                    <div>
                        <NavLogin />
                        <div className="app">
                            <Chat />
                            <Online />
                            <Opp />
                        </div>
                        <Footer />


                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect(state => {
    return {
        userInfo: state.userInfo,
        onlineUsers: state.onlineUser,
        chatMessages: state.chatMessages
    };
})(App);
