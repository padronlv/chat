import React from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function NavLogin(props) {
    return (
        <nav className="nav">
            <ul>
                <li><img className="smallLogo" src="/images/logo.png" /></li>
            </ul>
            <ul>
                <li>
                    <img id="smallProfilePic"
                        src= {props.userInfo.profile_pic}
                        alt={ `${props.name}` }
                    />
                </li>

                <li><a href="/logout">
                    <img className="icon"
                        src="/images/logout.png"
                        alt='logout'
                    />
                </a></li>

            </ul>
        </nav>
    );
}

export default connect(state => {
    return {
        userInfo: state.userInfo
    };
})(NavLogin);
