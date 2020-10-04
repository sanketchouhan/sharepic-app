import React, { useEffect } from 'react'
import './Posts.css'
import Post from './Post'
import { firestore } from '../../components/firebase';
import CircularProgress from '@material-ui/core/CircularProgress';




function Posts() {

    const [loading, setLoading] = React.useState(true);
    const [posts, setPosts] = React.useState([]);

    useEffect(() => {
        // console.log("posts useeffect");
        return firestore.collection('posts').orderBy('createdAt', 'desc').onSnapshot(data => {
            var _posts = [];
            data.forEach(doc => {
                _posts.push({
                    id: doc.id,
                    data: doc.data()
                })
            });
            setPosts(_posts);
            // console.log(_posts);
            setLoading(false)
        })
    }, []);

    return (
        <div className="posts__container">
            {loading && <div className="loading_posts"><CircularProgress size={50} color="inherit" /></div>}

            {posts.length > 0 && posts.map(post => <Post key={post.id} post={post} />)}
        </div>
    )
}

export default React.memo(Posts) 
