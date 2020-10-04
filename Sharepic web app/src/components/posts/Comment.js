import React, { useEffect, useContext } from 'react'
import './Comment.css'
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@material-ui/core/CircularProgress';
import { firestore } from '../../components/firebase';
import firebase from "firebase/app";
import { UserContext } from '../../components/UserContext';
import ListComment from './ListComment';

function Comment({ post }) {
    // console.log("comment")

    const { currentUser } = useContext(UserContext);

    const [viewComments, setViewComments] = React.useState(false);
    const [comment, setComment] = React.useState('');
    const [comments, setComments] = React.useState([]);
    const [postingComment, setPostingComment] = React.useState(false);


    useEffect(() => {
        setComment('');
        // console.log("comment useeffect")
        firestore.collection('posts').doc(post.id).collection('comments').orderBy('createdAt', 'desc').onSnapshot(data => {
            var _comments = [];
            data.forEach(doc => {
                _comments.push({
                    id: doc.id,
                    data: doc.data()
                })
            });
            setComments(_comments)
            // console.log(_comments);
        });
    }, [post])

    const handleSubmit = e => {
        e.preventDefault();
        if (comment.length > 0) {
            setPostingComment(true);
            firestore.collection('posts').doc(post.id).collection('comments').add({
                userUid: currentUser.uid,
                comment: comment,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(res => {
                setPostingComment(false);
                setComment('')
            }).catch(err => {
                setPostingComment(false);
                setComment('')
                console.error("Error adding document: ", err);
            });
        }
    }


    return (
        <>
            <div className="comments">
                {viewComments &&
                    <ul className="all__comments">
                        <li>
                            <span className="comments__head">Comments</span>
                            <span onClick={() => setViewComments(!viewComments)} className="comment__close">
                                <CloseIcon />
                            </span>
                        </li>

                        {comments.map(cm => <ListComment key={cm.id} comment={cm} />)}
                    </ul>
                }
                {viewComments ? '' : <p className="view__comments" onClick={() => setViewComments(!viewComments)}>View all comments</p>}
            </div>
            <div className="user__comment">
                <form>
                    <input type="text" name="comment" id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Type comment here..." autoComplete="off" />
                    <button type="submit" onClick={handleSubmit}>
                        {postingComment ?
                            <CircularProgress size={24} color="inherit" />
                            :
                            <SendIcon fontSize="small" color="action" />
                        }

                    </button>
                </form>
            </div>
        </>
    )
}

export default Comment
