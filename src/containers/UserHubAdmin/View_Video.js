/**
 *
 * View_User.js: Component to layout view individual video page of admin tab
 *
 * Lawrence Valerio
 *
 * Date: 03/23/2021
 * Update Date: 04/13/2021
 */

import React, { useEffect, useState, useRef } from "react";
import VideoPlayer from "react-video-markers";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "./Admin.css";
import "../User/css/WatchVideo.css";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserHubPageTitle } from "../generalComponents/UserHubPageTitle";
import { BackToHome } from "../generalComponents/BackToHome";

const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DeleteIconContainer = styled.div`
  font-size: 25px;
  cursor: pointer;
`;

/**
 * Component to layout the view individual video page of the admin tab
 * @param {*} id Used to video url and tags
 * @returns View Individual Video page
 */
export function View_Video({ id }) {
  const [token] = useCookies(["user-token"]);
  const [user] = useCookies(["user-id"]);
  const [uid, setUId] = useState("" + user["user-id"]);
  const [url, setUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeStart] = useState(0);
  const [markerData, setMarkerData] = useState([]);
  const [markerDataUser1, setMarkerDataUser1] = useState([]);
  const [markerDataUser2, setMarkerDataUser2] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);
  const [showTagInfo, setShowTagInfo] = useState();
  const [tagger1, setTagger1] = useState();
  const [tagger2, setTagger2] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [messageID, setMessageID] = useState();
  const allTags = markerDataUser1.concat(markerDataUser2);
  let timeRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [videoDetails, setVideoDetails] = useState([]);
  const [controls, setControls] = useState([
    "play",
    "time",
    "progress",
    "volume",
    "full-screen",
  ]);

  /**
   * Returns to userhub page if user is not admin.
   */
  if (token["is-admin"] == "false") {
    window.location.href = "/UserHub/";
  }

  /**
   * Function that closes the tag modal.
   */
  function CloseModal() {
    setModalIsOpen(false);
    setSelectedMarker([]);
    setShowTagInfo(false);
  }

  /**
   * plays video, hides the tag popup window if not closed,
   * and unsets the selected tag marker
   *
   * Michelle Peters
   */
  const handlePlay = () => {
    setIsPlaying(true);
    setShowTagInfo(false);
    setSelectedMarker([]);
  };

  /**
   *  Pause video control
   *
   * Michelle Peters
   */
  const handlePause = () => {
    setIsPlaying(false);
  };

  /**
   * Sets player volume
   *
   * Michelle Peters
   */
  const handleVolume = (value) => {
    setVolume(value);
  };

  /**
   * Constantly update and store current time
   *
   * Michelle Peters
   */
  const handleProgress = (e) => {
    timeRef.current = e.target.currentTime;
  };

  /**
   * Pauses video and stores selected
   * marker info
   *
   * Michelle Peters
   */
  const handleMarkerClick = (marker) => {
    setIsPlaying(false);
    setSelectedMarker(marker);
  };

  /**
   * Get data corresponding to selected video
   *
   * Michelle Peters
   */
  useEffect(() => {
    if (uid != "") {
      fetch(`${process.env.REACT_APP_API_URL}/IYS/videos/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
      })
        .then((data) => data.json())
        .then((data) => {
          setUrl(data.url);
          setTagger1(data.tagger1);
          setTagger2(data.tagger2);
          setMessageID(data.message);
          setVideoDetails(data);
          setLoading(false);
        })
        .catch((error) => alert(error));
    }
  }, [uid]);

  /**
   * Call the GetTags function once the
   * tagger data has been retrieved
   *
   * Michelle Peters
   */
  useEffect(() => {
    GetTags();
  }, []);

  /**
   * Query and list all tags belonging to the
   * first tagger
   *
   * Luis Ferrer
   */
  function GetTags() {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/tags/first_tagger/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
      body: JSON.stringify({ videoId: id }),
    })
      .then((data) => data.json())
      .then((data) => {
        const reformattedData = data.map((data, index) => {
          return {
            markerIndex: index,
            id: data.id,
            userID: data.userID,
            videoID: id,
            thought_choice: data.thought_choice,
            tone: data.tone,
            context: data.context,
            comment: data.comment,
            time: data.timestamp,
            color: "#fc8b18",
          };
        });
        setMarkerDataUser1(reformattedData);
      })
      .catch((error) => console.error(error));

    fetch(`${process.env.REACT_APP_API_URL}/IYS/tags/second_tagger/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
      body: JSON.stringify({ videoId: id }),
    })
      .then((data) => data.json())
      .then((data) => {
        const reformattedData = data.map((data, index) => {
          return {
            markerIndex: index,
            id: data.id,
            userID: data.userID,
            videoID: id,
            thought_choice: data.thought_choice,
            tone: data.tone,
            context: data.context,
            comment: data.comment,
            time: data.timestamp,
            color: "#fc8b18",
          };
        });
        setMarkerDataUser2(reformattedData);
      })
      .catch((error) => console.error(error));
  }

  /**
   * Function that delets the video from the S3 bucket.
   *
   * @param {string} url of the selected video
   * @param {int} id of the selected video.
   */
  function deleteFromS3(url, id) {
    if (
      window.confirm(
        "Are you sure you would like to delete the selected video?"
      )
    ) {
      // get the key for the bucket object from
      // the end of the stored url of selected file
      const bucketKey = url.slice(-32);

      // delete video from the s3 bucket by passing the key
      // for the bucket object to the server to run deletion
      fetch(`${process.env.REACT_APP_API_URL}/IYS/Home/downloadURL/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
        // pass the bucket key corresponding with file to be deleted
        body: JSON.stringify({ keyString: bucketKey }),
      })
        .then(deleteFromAPI(id))
        .catch((error) => console.error(error));
    }
  }

  /**
   * Delete video from the API
   *
   * @param {int} id of the selected video.
   */
  function deleteFromAPI(id) {
    // delete video from the api
    fetch(`${process.env.REACT_APP_API_URL}/IYS/videos/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then(() => window.location.reload())
      .catch((error) => console.error(error));
  }

  /**
   * Delete the selected tag
   *
   * @param {int} id of the selected tag.
   */
  const DeleteTag = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/tags/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then(() => window.location.reload())
      .catch((error) => console.error(error));
  };

  /**
   * Opens the modal if user selected a tag.
   */
  useEffect(() => {
    if (selectedMarker.length != 0) {
      setShowTagInfo(true);
      setModalIsOpen(true);
    }
  }, [selectedMarker]);

  /**
   * Popup window which displays tag info
   * for selected tag
   *
   * Michelle Peters
   */
  function TagPopUp() {
    let tone = "";
    let thought_choice = "";
    let context = "";
    let tone2 = "";
    let thought_choice2 = "";
    let context2 = "";
    let comment = "";
    let comment2 = "";
    // use the selected markers index to find data
    // relating to marker data for both users
    let index = selectedMarker.markerIndex;

    // Reformat the tone value for user readability
    try {
      if (markerDataUser1[index].tone === "POS") {
        tone = "Positive";
      } else if (markerDataUser1[index].tone === "NEG") {
        tone = "Negative";
      } else if (markerDataUser1[index].tone === "NEU") {
        tone = "Neutral";
      }
    } catch {
      tone = "";
    }

    try {
      if (markerDataUser2[index].tone === "POS") {
        tone2 = "Positive";
      } else if (markerDataUser2[index].tone === "NEG") {
        tone2 = "Negative";
      } else if (markerDataUser2[index].tone === "NEU") {
        tone2 = "Neutral";
      }
    } catch {
      tone2 = "";
    }

    // Reformat the thought vs feeling choice
    // value for user readability
    try {
      if (markerDataUser1[index].thought_choice === "TH") {
        thought_choice = "Thought";
      } else if (markerDataUser1[index].thought_choice === "FE") {
        thought_choice = "Feeling";
      }
    } catch {
      thought_choice = "";
    }

    try {
      if (markerDataUser2[index].thought_choice === "TH") {
        thought_choice2 = "Thought";
      } else if (markerDataUser2[index].thought_choice === "FE") {
        thought_choice2 = "Feeling";
      }
    } catch {
      thought_choice2 = "";
    }

    // Reformat the context value for user readability
    try {
      if (markerDataUser1[index].context === "SLF") {
        context = "Self";
      } else if (markerDataUser1[index].context === "DPT") {
        context = "Dialogue Partner";
      } else if (markerDataUser1[index].context === "OPP") {
        context = "Other Person or Persons";
      } else if (markerDataUser1[index].context === "CTX") {
        context = "Current Context";
      } else if (markerDataUser1[index].context === "OEC") {
        context = "Other Event or Circumstance";
      }
    } catch {
      context = "";
    }

    try {
      if (markerDataUser2[index].context === "SLF") {
        context2 = "Self";
      } else if (markerDataUser2[index].context === "DPT") {
        context2 = "Dialogue Partner";
      } else if (markerDataUser2[index].context === "OPP") {
        context2 = "Other Person or Persons";
      } else if (markerDataUser2[index].context === "CTX") {
        context2 = "Current Context";
      } else if (markerDataUser2[index].context === "OEC") {
        context2 = "Other Event or Circumstance";
      }
    } catch {
      context2 = "";
    }

    try {
      comment = markerDataUser1[index].comment;
    } catch {
      comment = "";
    }

    try {
      comment2 = markerDataUser2[index].comment;
    } catch {
      comment2 = "";
    }

    // Display the popup window with selected tag info
    return (
      <div>
        <Modal
          open={modalIsOpen}
          onClose={CloseModal}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "tagModal",
          }}
        >
          <div>
            <h2>Perceptual Target</h2>
            <h5>
              {tone} {thought_choice} - {context}
            </h5>
            <h5>{comment}</h5>
            <h2>Perceiver</h2>
            <h5>
              {tone2} {thought_choice2} - {context2}
            </h5>
            <h5>{comment2}</h5>
          </div>
          <button
            onClick={() => {
              CloseModal();
            }}
          >
            OK
          </button>
        </Modal>
      </div>
    );
  }

  /**
   * Formats the timestamp value
   *
   * @param {double} seconds of the video timestamp.
   */
  const ChangeTimeStamp = (seconds) => {
    let newTime = new Date(seconds * 1000).toISOString().substr(11, 8);

    return newTime;
  };

  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>Administration</UserHubPageTitle>
      <div className="watch-video-container PendingVideo">
        <BackToHome />
        <div className="watch-video-form ">
          {videoDetails.detail == "Not found." ? (
            <div className="VideoErrorMessage">
              <h1 className="ErrorMessage">
                Error: Video is either deleted or you do not have permission.
              </h1>
            </div>
          ) : (
            <>
              {loading == true ? (
                <>
                  <div className="SpinnerContainer">
                    <div className="spinner-border" />
                  </div>
                </>
              ) : (
                <div className="VideoContainer">
                  {showTagInfo ? <TagPopUp /> : ""}
                  <div
                    className="player"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    {url ? (
                      <VideoPlayer
                        url={url}
                        controls={controls}
                        isPlaying={isPlaying}
                        volume={volume}
                        loop={true}
                        markers={markerDataUser1}
                        height={"360px"}
                        width={"640px"}
                        timeStart={timeStart}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onVolume={handleVolume}
                        onProgress={handleProgress}
                        onMarkerClick={handleMarkerClick}
                      />
                    ) : null}
                  </div>
                  <button
                    onClick={() =>
                      deleteFromS3(videoDetails.url, videoDetails.id)
                    }
                  >
                    Delete Video
                  </button>
                  <div className="VideoTagsContainer">
                    <h3>Perceptual target tags</h3>
                    <table className="VideoTagsTable">
                      <thead>
                        <tr>
                          <th>Comment</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      {markerDataUser1.map((tags) => {
                        return (
                          <tbody key={tags.id}>
                            <tr>
                              <td>{tags.comment}</td>
                              <td className="TimeStampColumn">
                                {ChangeTimeStamp(tags.time)}{" "}
                                <FontAwesomeIcon
                                  className="DeleteIcon"
                                  icon={faTrashAlt}
                                  onClick={(e) =>
                                    window.confirm(
                                      "Are you sure you wish to delete this tag?"
                                    ) && DeleteTag(tags.id)
                                  }
                                />
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}
                    </table>
                  </div>
                  <div className="VideoTagsContainer">
                    <h3>Perceiver tags</h3>
                    <table className="VideoTagsTable">
                      <thead>
                        <tr>
                          <th>Comment</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      {markerDataUser2.map((tags) => {
                        return (
                          <tbody key={tags.id}>
                            <tr>
                              <td>{tags.comment}</td>
                              <td className="TimeStampColumn">
                                {ChangeTimeStamp(tags.time)}{" "}
                                <FontAwesomeIcon
                                  className="DeleteIcon"
                                  icon={faTrashAlt}
                                  onClick={(e) =>
                                    window.confirm(
                                      "Are you sure you wish to delete this tag?"
                                    ) && DeleteTag(tags.id)
                                  }
                                />
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </UserContainer>
  );
}
