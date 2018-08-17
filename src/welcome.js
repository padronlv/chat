import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Registration from './registration';
import Login from './login';
import Footer from './footer';

function Welcome() {
    return (
        <div id="welcome">
            <HashRouter>
                {/*<NavLogout />*/}
                <div className="welcomeNoNav">
                    <h1>Welcome!</h1>
                    <img className="bigLogo" src="./images/logo.png" />
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/login" component={Login} />
                </div>

            </HashRouter>
            <Footer />
        </div>
    );
}

export default Welcome;
