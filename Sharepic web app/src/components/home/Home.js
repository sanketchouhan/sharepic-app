import React, { useContext } from 'react'
import './Home.css';
import { useHistory } from "react-router-dom";
import { UserContext } from '../UserContext'

function Home({ setLoginModalOpen, setRegisterModalOpen }) {

    const history = useHistory();
    const { currentUser } = useContext(UserContext);

    if (currentUser) {
        history.push('/posts');
    }

    return (
        <div className="continue__tologin">
            <img src="images/logo.png" alt="logo" />
            <h1>Welcome to SharePic</h1>
            <h3>Login to continue</h3>
            <h5 onClick={() => { setLoginModalOpen(true); setRegisterModalOpen(false) }}>Login</h5>
            <h5 onClick={() => { setRegisterModalOpen(true); setLoginModalOpen(false) }}>Don't have an account? Create here</h5>
        </div>
    )
}

export default Home
