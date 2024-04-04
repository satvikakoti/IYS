/**
 * PendingVideo.js: Functional component that loads the video and provides the tagging form functionality
 *
 * Michelle Peters, Luis Ferrer, Symon Kurt San Jose
 *
 * Date Created: 11/02/2020
 * Last Updated: 04/13/2021
 */

import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import VideoPlayer from "react-video-markers";
import { useCookies } from "react-cookie";
import "../User/css/TagForm.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styled from "styled-components";
import { UserHubPageTitle } from "../generalComponents/UserHubPageTitle";
import { BackToHome } from "../generalComponents/BackToHome";

const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * Component to layout the pending video page
 * @param {*} id Used to get the video url and tags
 * @returns Pending Video page
 */
export function PendingVideo({ id }) {
  const [user] = useCookies(["user-id"]);
  const [uid, setUId] = useState("" + user["user-id"]);
  const [token] = useCookies(["user-token"]);
  const [url, setUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeStart] = useState(0);
  const [markerData, setMarkerData] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showTagInfo, setShowTagInfo] = useState();
  const [tagger1, setTagger1] = useState();
  let timeRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [controls, setControls] = useState([
    "play",
    "time",
    "progress",
    "volume",
    "full-screen",
  ]);

  function CloseModal() {
    setModalIsOpen(false);
    setSelectedMarker([]);
    setShowTagInfo(false);
  }

  /**
   * Plays video, hides the tag popup window if not closed,
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
   * Pause video control
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
   * Popup window which displays tag info
   * for selected tag
   *
   * Michelle Peters
   */
  function TagPopUp() {
    let tone = "";
    let thought_choice = "";
    let context = "";

    // Reformat the tone value for user readability
    if (selectedMarker.tone === "POS") {
      tone = "Positive";
    } else if (selectedMarker.tone === "NEG") {
      tone = "Negative";
    } else if (selectedMarker.tone === "NEU") {
      tone = "Neutral";
    }

    // Reformat the thought vs feeling choice
    // value for user readability
    if (selectedMarker.thought_choice === "TH") {
      thought_choice = "Thought";
    } else if (selectedMarker.thought_choice === "FE") {
      thought_choice = "Feeling";
    }

    // Reformat the context value for user readability
    if (selectedMarker.context === "SLF") {
      context = "Self";
    } else if (selectedMarker.context === "DPT") {
      context = "Dialogue Partner";
    } else if (selectedMarker.context === "OPP") {
      context = "Other Person or Persons";
    } else if (selectedMarker.context === "CTX") {
      context = "Current Context";
    } else if (selectedMarker.context === "OEC") {
      context = "Other Event or Circumstance";
    }

    // Display the popup window with selected tag info
    return (
      <div>
        <Modal
          open={modalIsOpen}
          onClose={CloseModal}
          style={{ content: { paddingLeft: "50px", minHeight: "200px" } }}
          id="tag-modal"
          overlayClassName="modal-form-overlay"
          className="modal"
        >
          <div>
            <h3>
              {tone} {thought_choice} - {context}
            </h3>
            <h4>{selectedMarker.comment}</h4>
          </div>
          <button
            onClick={() => {
              setSelectedMarker([]);
              setShowTagInfo(false);
            }}
          >
            OK
          </button>
        </Modal>
      </div>
    );
  }

  /**
   * Displays tag info in popup window whenever
   * a marker is selected
   *
   * Michelle Peters
   */
  useEffect(() => {
    if (selectedMarker.length != 0 && selectedMarker.tone != null) {
      setShowTagInfo(true);
      setModalIsOpen(true);
    }
  }, [selectedMarker]);

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
        })
        .catch((error) => alert(error));
    }
  }, [uid]);

  /**
   * Call the GetTags function once the first
   * tagger has been retrieved
   *
   * Michelle Peters
   */
  useLayoutEffect(() => {
    GetTags();
  }, [tagger1]);

  /**
   * Makes the loading screen disappear after 1.5s
   *
   */
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  /**
   * Query and list all tags that share the same user and
   * video ID
   *
   * Luis Ferrer
   */
  function GetTags() {
    fetch(
      `${process.env.REACT_APP_API_URL}/IYS/Home/api/vid_tags/${id}/uid/${tagger1}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
      }
    )
      .then((data) => data.json())
      .then((data) => {
        // reformat data
        const reformattedData = data.map((data) => {
          return {
            id: data.id,
            userID: data.userID,
            videoID: data.videoID,
            thought_choice: data.thought_choice,
            tone: data.tone,
            context: data.context,
            comment: data.comment,
            time: data.timestamp,
            color: "#fc8b18",
          };
        });
        // set reformatted data to markers
        setMarkerData(reformattedData);
      })
      .catch((error) => console.error(error));
  }

  /**
   * Return the video and tag form
   * depending on conditionals
   */
  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>Pending</UserHubPageTitle>
      <div
        className="watch-video-container PendingVideo"
        style={{ height: "100%" }}
      >
        <BackToHome />
        <div
          className="SpinnerContainer watch-video-form video-container"
          style={{
            display: `${loading ? "block" : "none"}`,
            paddingTop: "200px",
            maxHeight: "400px",
            minWidth: "50%",
          }}
        >
          <div className="spinner-border" />
        </div>
        <div
          className="watch-video-form video-container"
          style={{ flex: "0", display: `${loading ? "none" : "block"}` }}
        >
          <div className="player">
            {showTagInfo ? <TagPopUp /> : null}
            {url ? (
              <VideoPlayer
                url={url}
                controls={controls}
                isPlaying={isPlaying}
                volume={volume}
                loop={true}
                markers={markerData}
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
        </div>
      </div>
    </UserContainer>
  );
}

export default PendingVideo;
