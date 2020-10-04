import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { firestore } from '../../components/firebase';



const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    comment: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    }
}));

function ListComment({ comment }) {

    const classes = useStyles();
    const [commentUser, setCommentUser] = React.useState(null);

    useEffect(() => {
        // console.log("list useeffect")
        firestore.collection('users').doc(comment.data.userUid).get().then(user => {
            setCommentUser({
                user: user.data()
            });
        });
    },[]);


    return (
        <li>
            <Avatar className={classes.comment} alt="user" src={commentUser?.user?.picUrl} />
            <span className="post__comment__user">{commentUser?.user?.displayName}</span>
            <span className="comment">{comment.data.comment}</span>
        </li>
    )
}

export default ListComment
