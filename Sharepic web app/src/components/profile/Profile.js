import React, { useContext, useEffect } from "react";
import "./Profile.css";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import ViewPic from "./ViewPic";
import { Link } from "react-router-dom";
import UploadImage from "./UploadImage";
import { UserContext } from "../../components/UserContext";
import { firestore } from "../../components/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  pic: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    marginLeft: theme.spacing(2),
  },
}));

function Profile() {
  const classes = useStyles();
  const { currentUser } = useContext(UserContext);

  const [viewPic, setViewPic] = React.useState(null);
  const [viewUploader, setViewUploader] = React.useState(false);
  const [photos, setPhotos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [uploadProfile, setUploadProfile] = React.useState(false);

  const clickedLeft = () => {
    // console.log("clicked left");
    photos.forEach((value, index) => {
      if (value.id === viewPic.id) {
        if (index === 0) {
          var i = photos.length - 1;
          setViewPic(photos[i]);
        } else {
          setViewPic(photos[index - 1]);
        }
      }
    });
  };
  const clickedRight = () => {
    // console.log("clicked right");
    photos.forEach((value, index) => {
      if (value.id === viewPic.id) {
        if (index === photos.length - 1) {
          setViewPic(photos[0]);
        } else {
          setViewPic(photos[index + 1]);
        }
      }
    });
  };

  const handleProfilePicUpload = () => {
    setUploadProfile(true);
    setViewUploader(true);
  };
  const handlePostUpload = () => {
    setUploadProfile(false);
    setViewUploader(true);
  };

  useEffect(() => {
    // console.log("run")
    firestore
      .collection("posts")
      .where("userUid", "==", currentUser.uid)
      .get()
      .then((querySnapshot) => {
        setLoading(false);
        var _photos = [];
        querySnapshot.forEach((doc) => {
          _photos.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setPhotos(_photos);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [viewUploader]);

  return (
    <div className="profile__container">
      <div className="profile__close">
        <Link to="/posts">
          <CloseIcon fontSize="large" style={{ color: "#000000" }} />
        </Link>
      </div>
      <Avatar
        className={classes.pic}
        onClick={handleProfilePicUpload}
        alt="user"
        src={currentUser.picUrl}
      />
      <p className="username">{currentUser.username}</p>
      <p className="email">{currentUser.email}</p>
      <div className="gallery">
        <h5>
          Gallery{" "}
          <span onClick={handlePostUpload}>
            Upload <PublishRoundedIcon />
          </span>
        </h5>
        {photos.length > 0 && (
          <div className="photos">
            {photos.map((i) => (
              <div key={i.id} className="photo" onClick={() => setViewPic(i)}>
                <img src={i.data.postUrl} alt={i.id} />
              </div>
            ))}
          </div>
        )}
        {loading && (
          <div className="loading_photos">
            <CircularProgress size={50} color="inherit" />
          </div>
        )}
        {photos.length === 0 && !loading && (
          <h3 className="no__photos">No Photos</h3>
        )}
      </div>
      {viewPic && (
        <ViewPic
          close={setViewPic}
          picData={viewPic}
          clickedLeft={clickedLeft}
          clickedRight={clickedRight}
        />
      )}
      {viewUploader && (
        <UploadImage
          uploadProfile={uploadProfile}
          setViewUploader={setViewUploader}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default Profile;
