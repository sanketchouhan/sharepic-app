import React from 'react'
import './UploadImage.css'
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { firestore, storage } from '../../components/firebase';
import firebase from "firebase/app";
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import imageCompression from 'browser-image-compression';


class UploadImage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            imageDestination: "",
            file: null,
            caption: '',
            progress: 0,
            uploading: false
        }
        this.imageElement = React.createRef();
        this.fileRef = React.createRef()

        if (this.props.uploadProfile)
            this.name = '' + this.props.currentUser.uid
        else {
            this.name = '' + this.props.currentUser.uid + '-' + Date.now();
            this.thumbnailName = '' + this.props.currentUser.uid + '-' + Date.now() + "-thumbnail"
        }

    }

    handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.setState({ file: reader.result });

                const cropper = new Cropper(this.imageElement.current, {
                    zoomable: false,
                    scalable: false,
                    aspectRatio: 1,
                    crop: () => {
                        const canvas = cropper.getCroppedCanvas();
                        this.setState({ imageDestination: canvas.toDataURL('image/jpg') });
                    }
                })
            });

            const fileOptions = {
                maxSizeMB: .5,
                maxWidthOrHeight: 640,
                useWebWorker: true
            }
            imageCompression(e.target.files[0], fileOptions).then((output) => {
                reader.readAsDataURL(output);
            })
        }
    }

    handleUpload = (imgFile, thumbnailFile = null) => {

        // storage refs
        let storageRef = null;
        let storageRefThumbnail = null;
        if (this.props.uploadProfile)
            storageRef = storage.ref(`users/${this.name}`);
        else {
            storageRef = storage.ref(`posts/${this.name}/${this.name}`);
            storageRefThumbnail = storage.ref(`posts/${this.name}/${this.thumbnailName}`);
        }

        // upload tasks
        let uploadTask = null;
        let thumbnailUploadtask = null;
        if (!thumbnailFile && this.props.uploadProfile) {
            uploadTask = storageRef.put(imgFile);
        } else {
            uploadTask = storageRef.put(imgFile);
            thumbnailUploadtask = storageRefThumbnail.put(thumbnailFile);
        }

        uploadTask.on('state_changed', (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.setState({ progress: progress });
        }, function (error) {
            // Handle unsuccessful uploads
            console.log("error in upload")
        }, () => {

            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                if (this.props.uploadProfile) {
                    firestore.collection('users').doc(this.props.currentUser.uid).update({
                        picUrl: downloadURL
                    }).then(res => {
                        this.setState({ uploading: false })
                        this.props.setViewUploader(false)
                    }).catch(err => {
                        this.setState({ uploading: false })
                    })
                } else {
                    thumbnailUploadtask.snapshot.ref.getDownloadURL().then(thumbnailUrl => {

                        firestore.collection('posts').add({
                            userUid: this.props.currentUser.uid,
                            postUrl: downloadURL,
                            postThumbnailUrl: thumbnailUrl,
                            caption: this.state.caption,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        }).then(res => {
                            this.setState({ uploading: false })
                            this.props.setViewUploader(false)
                        }).catch(err => {
                            this.setState({ uploading: false })
                        })
                    })
                }
            });
        })
    }

    compressImagesBerforeUpload = () => {
        this.setState({ uploading: true })
        let options = null;
        let optionThumbnail = null;

        if (this.props.uploadProfile) {
            options = {
                maxSizeMB: .1,
                maxWidthOrHeight: 100,
                useWebWorker: true
            }
        }
        else {
            optionThumbnail = {
                maxSizeMB: .05,
                maxWidthOrHeight: 20,
                useWebWorker: true
            }
            options = {
                maxSizeMB: .4,
                maxWidthOrHeight: 640,
                useWebWorker: true
            }
        }
        imageCompression.getFilefromDataUrl(this.state.imageDestination, "file.jpg").then(file => {
            imageCompression(file, options).then((output) => {
                if (optionThumbnail) {
                    imageCompression(file, optionThumbnail).then(outputThumbnail => {
                        this.handleUpload(output, outputThumbnail);
                    })
                } else {
                    this.handleUpload(output);
                }
            })
        })
    }

    triggerClick = () => {
        this.fileRef.current.click()
    }

    render() {
        return (
            <div className="upload__image" >
                <div className="upload__img">
                    {this.state.file ?
                        <div className="cropper">
                            <img ref={this.imageElement} src={this.state.file} alt="upload" />
                        </div>
                        :
                        <><input type="file" hidden name="image" id="image" ref={this.fileRef} onChange={this.handleFileInput} />
                            <h3 onClick={this.triggerClick}>Choose file</h3></>
                    }

                </div>

                <LinearProgress variant="determinate" value={this.state.progress} />
                <div className="caption__input">
                    <input type="text" name="caption" id="caption" value={this.state.caption} onChange={e => this.setState({ caption: e.target.value })} placeholder="caption" autoComplete="off" />
                    <button className="upload__button" disabled={!this.state.file} onClick={this.compressImagesBerforeUpload}>
                        {this.state.uploading ?
                            <CircularProgress size={20} color="inherit" />
                            :
                            <PublishRoundedIcon color="action" />
                        }
                    </button>
                </div>
                <button className="cancel__button" onClick={() => this.props.setViewUploader(false)}>Cancel</button>
            </div>
        )
    }
}

export default UploadImage
