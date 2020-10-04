import React from 'react'
import './ViewPic.css'
import Post from '../posts/Post'
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import CloseIcon from '@material-ui/icons/Close';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';

function ViewPic({ clickedLeft, clickedRight, close, picData }) {
    return (
        <div className="view__pic">
            <div className="viewpic__close" onClick={() => close(null)}>
                <CloseIcon fontSize='large' />
            </div>
            <div className="left__chivron" onClick={clickedLeft}>
                <ChevronLeftRoundedIcon fontSize='large' />
            </div>
            <Post post={picData} />
            <div className="right__chivron" onClick={clickedRight}>
                <ChevronRightRoundedIcon fontSize='large' />
            </div>
        </div>
    )
}

export default ViewPic
