import React, { Suspense, lazy, useContext } from 'react'
import './App.css';

// components
// import Posts from './components/posts/Posts';
import Home from './components/home/Home'
// import Profile from './components/profile/Profile'
import Login from './components/login-register/Login';
import Register from './components/login-register/Register';

// icons
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';

import { UserContext } from './components/UserContext';
import { auth } from './components/firebase';
import { useHistory } from "react-router-dom";

import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

// lasy loads
const Posts = React.lazy(() => import('./components/posts/Posts'));
const Profile = React.lazy(() => import('./components/profile/Profile'));


// protected routes
function PrivateRoute({ children, ...rest }) {

  const { currentUser } = useContext(UserContext);
  // const { isLoggedIn } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        currentUser ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

function App() {

  const history = useHistory();

  const { currentUser } = useContext(UserContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const [registerModalOpen, setRegisterModalOpen] = React.useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    setAnchorEl(null);
    auth.signOut();
  }
  const navigateToProfile = () => {
    setAnchorEl(null);
    history.push('/profile');
  }

  const divStyle = {
    width: '100%',
    height: '100vh',
    position: 'fixed',
    top: '0',
    background: '#ececec',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }


  return (
    <div className="app">
      <header>
        <div className="header__contents">
          <img src="images/logo.png" alt="logo" />
          <div className="buttons">
            {currentUser ?
              <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <Avatar alt={currentUser.displayName} src={currentUser.picUrl} /><span className="header__username">{currentUser.displayName}</span>
              </Button>
              :
              <div className="login__register">
                <div className="login" onClick={() => { setLoginModalOpen(true); setRegisterModalOpen(false) }}>
                  Login <AccountBoxIcon color="action" />
                </div>
                <Login open={loginModalOpen} handleClose={() => setLoginModalOpen(false)} />
                <div className="register" onClick={() => { setRegisterModalOpen(true); setLoginModalOpen(false) }}>
                  Register <ExitToAppRoundedIcon color="action" />
                </div>
                <Register open={registerModalOpen} handleClose={() => setRegisterModalOpen(false)} />
              </div>
            }
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </header>
      <Suspense fallback={<div style={divStyle} >
        <img width="300px" style={{ objectFit: "contain" }} src="./images/logo.png" alt="logo" />
            Loading...</div>}>
        <Switch>
          <Route exact path="/">
            <Home setLoginModalOpen={setLoginModalOpen} setRegisterModalOpen={setRegisterModalOpen} />
          </Route>
          <PrivateRoute exact path="/posts">
            <Posts />
          </PrivateRoute>
          <PrivateRoute exact path="/profile">
            <Profile />
          </PrivateRoute>
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
