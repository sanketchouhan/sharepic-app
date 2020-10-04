import React, { useEffect } from "react";
import "./Posts.css";
import Comment from "./Comment";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { firestore } from "../../components/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}));

function Post({ post }) {
  const [postUser, setPostUser] = React.useState(null);
  const [imgOnLoadComplete, setImgOnLoadComplete] = React.useState(false);
  const classes = useStyles();

  useEffect(() => {
    firestore
      .collection("users")
      .doc(post.data.userUid)
      .get()
      .then((doc) => {
        setPostUser({
          username: doc.data().username,
          postUserPicUrl: doc.data().picUrl,
        });
      });
  }, [post.id]);

  return (
    <div className="posts">
      <div className="post__head">
        <Avatar
          className={classes.small}
          alt={postUser?.username}
          src={postUser?.postUserPicUrl}
        />
        <span className="post__username">{postUser?.username}</span>
      </div>
      <div className="postImg__container">
        <img
          src={post.data.postUrl}
          onLoad={setImgOnLoadComplete}
          alt="post-img"
          className="post__img"
        />
        <img
          src={post.data.postThumbnailUrl}
          alt="post-thumbnail"
          {...(imgOnLoadComplete && { style: { opacity: "0" } })}
          className="post__thumbnail"
        />
      </div>
      <p className="post__caption">
        <span className="post__user">{postUser?.username}</span>
        <span>{post.data.caption}</span>
      </p>
      <Comment post={post} />
    </div>
  );
}

export default Post;
