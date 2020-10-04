import React from 'react'
import './Login.css'
import Modal from 'react-modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { auth } from '../../components/firebase';
import { useHistory } from "react-router-dom";


Modal.setAppElement('#root');

function Login({ open, handleClose }) {

    const history = useHistory();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);


    const handleSubmit = e => {
        e.preventDefault();
        setError(null);
        setLoading(true)
        auth.signInWithEmailAndPassword(username, password).then(res => {
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
                    minHeight: '18rem',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    display: 'grid',
                    placeItems: 'center'
                }
            }}
        >
            <form className="login__form">
                <div className="close" onClick={handleClose}><CloseRoundedIcon /></div>
                <AccountCircleRoundedIcon fontSize="large" />
                <p className="modal__head">Sign In</p>
                {error && <p className="error">{error}</p>}
                <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Email" autoComplete="off" />
                <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit" onClick={handleSubmit}>
                    {loading ?
                        <CircularProgress size={20} color="inherit" />
                        :
                        'Login'
                    }
                </button>
            </form>
        </Modal>
    )
}

export default Login
