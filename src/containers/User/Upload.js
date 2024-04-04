/**
 * Upload.js: Functional component that is responsible for video uploadability
 *
 * Michelle Peters, Lawrence Valerio, Symon Kurt San Jose
 *
 * Date Created: 10/27/2020
 * Last Updated: 04/13/2021
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { UserHubPageTitle } from "../generalComponents/UserHubPageTitle";
import { BackToHome } from "../generalComponents/BackToHome";
import "./css/UserUpload.css";
import { WarningMessage } from "../generalComponents/WarningMessage";

const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * Component to layout the upload video page
 * @returns The upload video page
 */
export function UploadVideo() {
  const [token] = useCookies(["user-token"]);
  const [user] = useCookies(["user-id"]);
  const [userId, setUserId] = useState("" + user["user-id"]);
  const [success, setSuccess] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState();
  const [uploadInput, setUploadInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(true);
  const [uploadClick, setUploadClick] = useState(false);
  const [progress, setProgress] = useState(0);
  const [username, setUsername] = useState("");
  const [visible, setVisible] = useState(false);

  const requestData = { userId, title, url, tagger1: userId, author: username };

  /**
   * Retrieve presigned url to use for upload request
   *
   * Michelle Peters
   */
  const getPresignedURL = () => {
    setUploadClick(true);
    if (title) {
      setUploadClick(false);
      setLoading(true);
      setVisible(true);

      fetch(`${process.env.REACT_APP_API_URL}/IYS/Home/downloadURL/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
      })
        .then((data) => data.json())
        .then((data) => {
          const request = JSON.stringify(data);
          // pass the presigned url to the upload function
          upload(request);
        })
        .catch((error) => console.error(error));
    }
  };

  /**
   * Upload the video to s3 using the retrieved
   * presigned url
   * @param {*} request
   *
   * Michelle Peters
   */
  const upload = (request) => {
    // get the file selected by the user
    let file = uploadInput.files[0];
    if (file !== undefined) {
      setFileSelected(true);

      // remove quotes from url for posting
      request = request.slice(1, -1);
      // post the video file to s3 using the presigned url
      axios
        .put(request, file, config, {
          headers: { "Content-Type": "video/mp4" },
        })
        .then((result) => {
          setSuccess(true);
          // cut presigned url to get link to video saved on s3
          // and set as new url
          setUrl(request.substr(0, 69));
        })
        .catch((error) => {
          alert("Something went wrong - Please try again");
        });
    } else {
      setFileSelected(false);
      setLoading(false);
    }
  };

  /**
   * Gets the video upload progess for
   * the progress bar display
   *
   * Michelle Peters
   */
  const config = {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": "attachment",
    },
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setProgress(percentCompleted);
    },
  };

  /**
   * Post video data to the api when the user uploads
   * a video to s3 and set the url corresponding to
   * the video link
   *
   * Michelle Peters
   */
  useEffect(() => {
    // stop from posting immediately before url set
    if (url !== "") {
      fetch(`${process.env.REACT_APP_API_URL}/IYS/videos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
        body: JSON.stringify(requestData),
      }).catch((error) => console.error(error));

      setFileSelected(true);
      setLoading(false);
    }

    fetch(`${process.env.REACT_APP_API_URL}/IYS/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setUsername(data.username);
      })
      .catch((error) => console.error(error));

    setFileSelected(true);
    setLoading(false);
  }, [url]);

  /**
   * The video upload progress bar
   *
   * Michelle Peters
   */
  const ProgressBar = (props) => {
    const { bgcolor, completed } = props;

    const containerStyles = {
      height: 20,
      width: "80%",
      backgroundColor: "#e0e0de",
      borderRadius: 50,
      margin: 50,
      justifyContent: "center",
      textAlign: "center",
    };

    const fillerStyles = {
      height: "100%",
      width: `${completed}%`,
      backgroundColor: bgcolor,
      borderRadius: "inherit",
      textAlign: "right",
    };

    const labelStyles = {
      padding: 5,
      color: "white",
      fontWeight: "bold",
    };
    return (
      <center>
        <div style={containerStyles}>
          <div style={fillerStyles}>
            <span style={labelStyles}>{`${completed}%`}</span>
          </div>
        </div>
      </center>
    );
  };

  /**
   * The message that will render upon a successful
   * video upload
   *
   * Michelle Peters
   */
  const SuccessMessage = () => (
    <div className="video-upload">
      <div className="success-message">
        <h1>Upload Complete!</h1>
        <a href={`${process.env.REACT_APP_FRONTEND_URL}/UserHub/MyVideos`}>
          Click here to view your videos{" "}
        </a>
        <p>or</p>
        <a href={`${process.env.REACT_APP_FRONTEND_URL}/UserHub/Upload`}>
          Click here to upload another
        </a>
      </div>
    </div>
  );

  const testData = [{ bgcolor: "#fc8b18", completed: progress }];

  /**
   * Return the video upload interface
   */
  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>Upload a Video</UserHubPageTitle>
      <div className="video-upload">
        <BackToHome />
        <div className="video-upload-form">
          <center>
            {success ? <SuccessMessage /> : null}
            {!success && !loading ? (
              <div>
                <h1>Please select your video</h1>
                <input
                  id="title-input"
                  name="title"
                  placeholder="Please enter a Title (mandatory)"
                  value={title}
                  noValidate
                  onChange={(e) => setTitle(e.target.value)}
                />
                {!title && uploadClick ? (
                  <div className="errorMessage">
                    <span class="alert-message">Please enter a title</span>
                  </div>
                ) : null}
                <br />
                <input
                  id="file-input"
                  ref={(ref) => {
                    setUploadInput(ref);
                  }}
                  type="file"
                  accept="video/mp4"
                />
                {!fileSelected ? (
                  <div className="errorMessage">
                    <span class="alert-message">Please select a file</span>
                  </div>
                ) : null}
                <br />
                <button class="secondary-button" onClick={getPresignedURL}>
                  UPLOAD
                </button>
              </div>
            ) : null}
          </center>

          <div className="App">
            {loading ? (
              <div>
                {visible ? (
                  <WarningMessage visible={visible} setVisible={setVisible} />
                ) : (
                  ""
                )}
                {testData.map((item, idx) => (
                  <ProgressBar
                    key={idx}
                    bgcolor={item.bgcolor}
                    completed={item.completed}
                  />
                ))}
                <center>
                  <h4>Uploading video... please wait</h4>
                </center>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </UserContainer>
  );
}
