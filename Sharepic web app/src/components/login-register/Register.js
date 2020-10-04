import React, { useEffect } from 'react'
import './Register.css'
import Modal from 'react-modal';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import { auth, firestore } from '../../components/firebase';
import { useHistory } from "react-router-dom";


Modal.setAppElement('#root');

function Register({ open, handleClose }) {

    //   const { setCurrentUser } = useContext(UserContext);
    const history = useHistory();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [displayname, setDisplayname] = React.useState('');
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true)
        setError(null);
        auth.createUserWithEmailAndPassword(username, password).then(creds => {
            return firestore.collection('users').doc(creds.user.uid).set({
                email: username,
                displayName: displayname,
                picUrl: 'images/avatar-default.png'
            });
        }).then(() => {
            // console.log("reset form")
            setLoading(false)
            history.push('/posts');
        }).catch(err => {
            setLoading(false)
            setError(err.message);
        })
    }

    return (
        <Modal
            isOpen={open}
            onRequestClose={handleClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)'
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: '0',
                    bottom: '0',
                    transform: 'translate(-50%,-50%)',
                    borderRadius: '10px',
                    width: '18rem',
                    minHeight: '21rem',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    display: 'grid',
                    placeItems: 'center'
                }
            }}
        >
            <form className="register__form">
                <div className="close" onClick={handleClose}><CloseRoundedIcon /></div>
                <AccountCircleRoundedIcon fontSize="large" />
                <p className="modal__head">Register</p>
                {error && <p className="error">{error}</p>}
                <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Email" autoComplete="off" />
                <input type="text" name="displayname" id="displayname" value={displayname} onChange={(e) => setDisplayname(e.target.value)} placeholder="Display Name" autoComplete="off" />
                <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit" onClick={handleSubmit}>
                    {loading ?
                        <CircularProgress size={20} color="inherit" />
                        :
                        'Register'
                    }
                </button>
            </form>
        </Modal>
    )
}

export default Register
