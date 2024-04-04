/*
 * WatchVideo.js: Component that is responsible for the watch video pages.
 *
 * Mchelle Peters, Luis Ferrer, Lawrence Valerio, Symon Kurt San Jose
 *
 * Updated: Prachotan Reddy Bathi
 * Date Created: 11/02/2020
 * Last Updated: 8/04/2021
 */

import React, { useEffect, useState, useRef } from "react";
import VideoPlayer from "react-video-markers";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import QueryTags from "../Tags/UserTags";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import SendVideo from "../VideoComponents/SendVideo";
import SendTaggingComplete from "../VideoComponents/sendTaggingComplete";
import "./css/WatchVideo.css";
import { UserHubPageTitle } from "../generalComponents/UserHubPageTitle";
import { TagSuccessBanner } from "../generalComponents/TagSuccessBanner";
import { BackToHome } from "../generalComponents/BackToHome";
import "./css/button.css";
import { TagGuide } from "../generalComponents/taggingguide";


const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export function WatchVideo({ id }) {
  const [token] = useCookies(["user-token"]);
  const [user] = useCookies(["user-id"]);
  const [uid] = useState("" + user["user-id"]);
  const [url, setUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeStart] = useState(0);
  const [markerData, setMarkerData] = useState([]);
  const [markerData2, setMarkerData2] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);
  const [showTagInfo, setShowTagInfo] = useState(false);
  const [tagger1, setTagger1] = useState();
  const [tagger2, setTagger2] = useState();
  const [tagger1Tags, setTagger1Tags] = useState([]);
  const [loadMarkers, setLoadMarkers] = useState(true);
  const [modalState, setModalState] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [messageID, setMessageID] = useState();
  const [tagData, setTagData] = useState([]);
  const [currentTagComment, setCurrentTagComment] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [user1Tags, setUser1Tags] = useState([]);
  const selectedTag = useRef("");
  let timeRef = useRef(0);
  let errorFlag = false;
  const [loading, setLoading] = useState(true);
  const [controls, setControls] = useState([
    "play",
    "time",
    "progress",
    "volume",
    "full-screen",
  ]);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(true);
  const [initPass, setInitPass] = useState(true);
  const [failMessage, setFailMessage] = useState("");

  const SetTagBanner = (tagSuccess, failInputMessage) => {
    setFailMessage(failInputMessage);
    setVisible(false);

    setTimeout(() => {
      setInitPass(tagSuccess);
      setVisible(true);
    }, 100);
  };

  /**
   * Constantly update and store current time
   *
   * Michelle Peters
   */
  const handleProgress = (e) => {
    timeRef.current = e.target.currentTime;
    setCurrentTime(e.target.currentTime);
  };

  useEffect(() => {
    state.timestamp = timeRef.current.toFixed(2);
    if (
      selectedMarker.length != 0 &&
      selectedMarker.tone != null &&
      selectedMarker.color != "black"
    ) {
      setShowTagInfo(true);
      setModalIsOpen(true);
    }
  }, [currentTime]);

  const GetTagInfo = () => {
    fetch(
      `${process.env.REACT_APP_API_URL}/IYS/Home/api/vid_tags/${id}/uid/${user["user-id"]}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
      }
    )
      .then((data) => data.json())
      .then((data) => {
        setTagData(data);
      });
  };

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
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal",
          }}
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
  // useEffect(() => {
  //   if (
  //     selectedMarker.length != 0 &&
  //     selectedMarker.tone != null &&
  //     selectedMarker.color != "black"
  //   ) {
  //     setShowTagInfo(true);
  //     setModalIsOpen(true);
  //   }
  // }, [selectedMarker]);

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
  }, [tagger2]);

  /**
   * Makes the loading screen disappear after 1.5s
   *
   */
  useEffect(() => {
    setInterval(() => {
      setLoading(false);
    }, 1500);
  }, []);

  /**
   * If the logged in user is the second tagger,
   * overwrite the tags from the first tagger
   * whenever tags are reloaded
   *
   * Michelle Peters
   */
  useEffect(() => {
    if (uid == tagger2 && loadMarkers) {
      ReplaceTags();
      setLoadMarkers(false);
    }
    GetTagInfo();
  }, [markerData]);

  /**
   * Query and list all tags belonging to the
   * first tagger
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
        // display all tag information if the logged
        // in user is the first tagger
        if (uid == tagger1) {
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
          setMarkerData(reformattedData);
          setDisableButton(false);
          // only show tag position if the logged
          // in user is the second tagger
        } else if (uid == tagger2) {
          const reformattedData = data.map((data) => {
            return {
              id: data.id,
              userID: data.userID,
              videoID: data.videoID,
              thought_choice: data.thought_choice,
              tone: data.tone,
              context: data.context,
              comment: data.comment,
              score: data.score,
              time: data.timestamp,
              color: "black",
            };
          });
          setMarkerData(reformattedData);
          setUser1Tags(reformattedData);
          setDisableButton(false);
        }
      })
      .catch((error) => console.error(error));

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
        setTagger1Tags(data);
      })
      .catch((error) => console.error(error));
  }

  /**
   * Get and set tags from tagger2, and in turn
   * call function to replace tags
   *
   * Michelle Peters
   */
  function ReplaceTags(score) {
    fetch(
      `${process.env.REACT_APP_API_URL}/IYS/Home/api/vid_tags/${id}/uid/${tagger2}/`,
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
        const tagger2MarkerData = data.map((data) => {
          return {
            id: data.id,
            userID: data.userID,
            videoID: data.videoID,
            thought_choice: data.thought_choice,
            tone: data.tone,
            context: data.context,
            comment: data.comment,
            score: score,
            time: data.timestamp,
          };
        });
        setMarkerData2(tagger2MarkerData);
      })
      .catch((error) => console.error(error));
  }

  /**
   * Replace tags from tagger1 with new tags from
   * tagger2 when timestamps match
   *
   * Michelle Peters
   */
  useEffect(() => {
    var checkMatches = function (element, index, array) {
      for (let i = 0; i < markerData2.length; i++) {
        if (element.time == markerData2[i].time) {
          return {
            thought_choice: markerData2[i].thought_choice,
            context: markerData2[i].context,
            tone: markerData2[i].tone,
            comment: markerData2[i].comment,
            time: markerData2[i].time,
            color: "#fc8b18",
          };
        }
      }
      return element;
    };

    const tagger2MarkerData = markerData.map(checkMatches);
    setMarkerData(tagger2MarkerData);
  }, [markerData2]);

  // Dropdown constants provide user with predetermined
  // info with the exception of the comment box
  //
  // Luis Ferrer
  const thoughtItems = [
    { label: "Thought", value: "TH" },
    { label: "Feeling", value: "FE" },
  ];

  const toneItems = [
    { label: "Positive", value: "POS" },
    { label: "Neutral", value: "NEU" },
    { label: "Negative", value: "NEG" },
  ];

  const contextItems = [
    { label: "Self", value: "SLF" },
    { label: "Dialogue Partner", value: "DPT" },
    { label: "Other Person or Persons", value: "OPP" },
    { label: "Current Context", value: "CTX" },
    { label: "Other Event or Circumstance", value: "OEC" },
  ];

  // Constant that is responsible for tag state control
  //
  // Luis Ferrer
  const [state, setState] = React.useState({
    // Dropdowns will default to index 0
    userID: null,
    videoID: null,
    thought_choice: thoughtItems[0].value,
    context: contextItems[0].value,
    tone: toneItems[0].value,
    comment: "",
    timestamp: 0,
  });

  /**
   * Handle the changes made in the create tag form
   * @param {*} e identify and set all state properties
   *
   * Luis Ferrer
   */
  function handlechange(e) {
    setState({
      ...state,
      userID: uid,
      videoID: id,
      timestamp: timeRef.current.toFixed(2),
      [e.target.name]: e.target.value,
    });
  }

  /**
   * Function that will check if the comment box is empty
   * and check user ID errors
   *
   * Luis Ferrer
   */
  let validate = () => {
    let inputs = { ...state };

    // Handle empty comment box
    if (inputs.comment === "" || inputs.comment === null) {
      errorFlag = true;
    } else if (isNaN(inputs.userID)) {
      errorFlag = true;
    } else {
      errorFlag = false;
    }
  };

  /**
   * Validate and POST tag form
   * @param {*} e
   *
   * Luis Ferrer
   */
  const tagSubmit = (e) => {
    e.preventDefault();

    setDisableButton(true);

    if (uid == tagger2) {
      let match = false;
      for (let i = 0; i < markerData.length; i++) {
        if (
          markerData[i].time == state.timestamp &&
          markerData[i].color == "black"
        ) {
          match = true;
          validate();

          let score = 0;

          if (markerData[i].context == state.context) {
            score = 1;

            if (markerData[i].thought_choice == state.thought_choice) {
              if (markerData[i].tone == state.tone) {
                score = 2;
              }
            }
          }

          if (!errorFlag) {
            fetch(`${process.env.REACT_APP_API_URL}/IYS/tags/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                score: score,
                userID: state.userID,
                videoID: state.videoID,
                thought_choice: state.thought_choice,
                tone: state.tone,
                context: state.context,
                comment: state.comment,
                timestamp: state.timestamp,
              }),
            })
              .then((data) => {
                SetTagBanner(true, "");
                setDisableButton(false);
                if (uid == tagger1) {
                  GetTags();
                } else if (uid == tagger2) {
                  ReplaceTags(score);
                }
                state.comment = "";
              })
              .catch((error) => {
                SetTagBanner(false, "Failed to create tag.");
                console.error(error);
              });
          } else {
            SetTagBanner(false, "Failed to create tag.");
          }
        }
      }
      if (!match) {
        SetTagBanner(false, "No tags found in timeline or tag already exists(please click on the black marker instead of pausing to tag).");
        // alert("No tags found in timeline or tag already exists.");
        setDisableButton(false);
      }
    } else {
      validate();
      let exists = false;
      for (let i = 0; i < markerData.length; i++) {
        if (
          markerData[i].time == state.timestamp &&
          markerData[i].color == "#fc8b18"
        ) {
          SetTagBanner(false, "Tag already exists at this timestamp.");
          // alert("Tag already exists at this timestamp.");
          setDisableButton(false);
          exists = true;
        }
      }

      if (exists == false) {
        if (!errorFlag) {
          fetch(`${process.env.REACT_APP_API_URL}/IYS/tags/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(state),
          })
            .then((data) => {
              SetTagBanner(true, "");
              state.comment = "";
              if (uid == tagger1) {
                GetTags();
              } else if (uid == tagger2) {
                ReplaceTags();
              }
            })
            .catch((error) => console.error(error));
        } else {
          SetTagBanner(false, "Failed to create tag.");
        }
      }
    }
  };

  const EditTagClick = (
    modalState,
    comment,
    id,
    tone,
    context,
    thought_choice
  ) => {
    setState({
      ...state,
      tone: tone,
      context: context,
      thought_choice: thought_choice,
    });

    setCurrentTagComment(comment);
    selectedTag.current = tagData.findIndex((obj) => obj.id == id);
    setTagModalOpen(modalState);
  };

  const UpdateTag = (tagId) => {
    if (uid == tagger1) {
      fetch(`${process.env.REACT_APP_API_URL}/IYS/tags/${tagId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: currentTagComment,
          thought_choice: state.thought_choice,
          tone: state.tone,
          context: state.context,
        }),
      })
        .then(() => {
          SetTagBanner(true, "");
          GetTagInfo();
        })
        .catch((error) => console.error(error));

      markerData[selectedTag.current].comment = currentTagComment;
      markerData[selectedTag.current].thought_choice = state.thought_choice;
      markerData[selectedTag.current].tone = state.tone;
      markerData[selectedTag.current].context = state.context;
    } else {
      let currentTag = markerData.findIndex(
        (obj) => obj.time == tagData[selectedTag.current].timestamp
      );

      let score = 0;

      if (user1Tags[currentTag].context == state.context) {
        score = 1;

        if (user1Tags[currentTag].thought_choice == state.thought_choice) {
          if (user1Tags[currentTag].tone == state.tone) {
            score = 2;
          }
        }
      }

      fetch(`${process.env.REACT_APP_API_URL}/IYS/tags/${tagId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: currentTagComment,
          thought_choice: state.thought_choice,
          tone: state.tone,
          context: state.context,
          score: score,
        }),
      })
        .then(() => {
          SetTagBanner(true, "");
          GetTagInfo();
        })
        .catch((error) => console.error(error));

      for (let i = 0; i < markerData.length; i++) {
        if (markerData[i].time == markerData2[selectedTag.current].time) {
          markerData[i].comment = currentTagComment;
          markerData[i].thought_choice = state.thought_choice;
          markerData[i].tone = state.tone;
          markerData[i].context = state.context;
        }
      }
    }
  };

  const DeleteTag = (tagId) => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/tags/${tagId}/`, {
      method: "Delete",
      headers: { "Content-Type": "application/json" },
    }).catch((error) => console.error(error));
    setTagModalOpen(false);

    if (uid == tagger1) {
      if (selectedTag.current > -1) {
        markerData.splice(selectedTag.current, 1);
        tagData.splice(selectedTag.current, 1);
      }
    } else {
      for (let i = 0; i < markerData.length; i++) {
        if (markerData[i].time == tagData[selectedTag.current].timestamp) {
          markerData[i].color = "black";
        }
      }

      let deletedTagIndex = markerData.findIndex(
        (obj) => obj.time == tagData[selectedTag.current].timestamp
      );

      let tagger1Tag = tagger1Tags.findIndex(
        (obj) => obj.timestamp == tagData[selectedTag.current].timestamp
      );

      markerData[deletedTagIndex].thought_choice =
        tagger1Tags[tagger1Tag].thought_choice;

      markerData[deletedTagIndex].context = tagger1Tags[tagger1Tag].context;

      markerData[deletedTagIndex].tone = tagger1Tags[tagger1Tag].tone;

      if (selectedTag.current > -1) {
        tagData.splice(selectedTag.current, 1);
      }
    }
  };

  const ChangeContext = (context) => {
    switch (context) {
      case "SLF":
        return "Self";
      case "DPT":
        return "Dialogue Partner";
      case "OPP":
        return "Other Person or Persons";
      case "CTX":
        return "Current Context";
      case "OEC":
        return "Other Event or Circumstance";
    }
  };

  const ChangeThoughtChoice = (thought) => {
    switch (thought) {
      case "TH":
        return "Thought";
      case "FE":
        return "Feeling";
    }
  };

  const ChangeTone = (tone) => {
    switch (tone) {
      case "POS":
        return "Positive";
      case "NEG":
        return "Negative";
      case "NEU":
        return "Neutral";
    }
  };

  const ChangeTimeStamp = (seconds) => {
    let newTime = new Date(seconds * 1000).toISOString().substr(11, 8);

    return newTime;
  };

  /**
   * Return the video and tag form
   * depending on conditionals
   */
  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>Watch</UserHubPageTitle>
            <TagGuide visible={true} setVisible={setVisible1} />
      <div className="watch-video-container WatchVideo">
        <BackToHome />
        
        <div className="watch-video-container">
          <div
            className="SpinnerContainer watch-video-form video-container"
            style={{
              display: `${loading ? "block" : "none"}`,
              paddingTop: "200px",
              maxHeight: "400px",
            }}
          >
            <div className="spinner-border" />
          </div>
          {showTagInfo ? <TagPopUp /> : null}
          <div
            className="watch-video-form video-container video-button"
            style={{ display: `${loading ? "none" : "block"}` }}
          >
            <div className="player">
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
            <div className="tag_form">
              <form id="tag_submit form" onSubmit={tagSubmit}>
                <div className="tag-detail-selection">
                  <select
                    name="thought_choice"
                    onChange={handlechange}
                    value={state.thought_choice}
                  >
                    {thoughtItems.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <select
                    name="tone"
                    onChange={handlechange}
                    value={state.tone}
                  >
                    {toneItems.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <select
                    name="context"
                    onChange={handlechange}
                    value={state.context}
                  >
                    {contextItems.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>               
                <label id="commenlbl">Comment
                <i style={{cursor:"pointer", marginLeft:"0.8rem"}}
                    class="fas fa-info-circle" 
                    onClick={(e) => window.alert("An example for a Comment that further explains the situation or context of the thought or feeling is:\n '𝑰 𝒘𝒂𝒔 𝒇𝒆𝒆𝒍𝒊𝒏𝒈 𝒔𝒂𝒅 𝒃𝒆𝒄𝒂𝒖𝒔𝒆 𝑰 𝒅𝒊𝒅 𝒏𝒐𝒕 𝒓𝒆𝒂𝒄𝒉 𝒎𝒚 𝒅𝒊𝒆𝒕 𝒈𝒐𝒂𝒍𝒔.'")}></i>
                </label>
                <textarea
                  name="comment"
                  required
                  onChange={handlechange}
                  value={state.comment}
                ></textarea>
                <input
                  type="hidden"
                  defaultValue={state.userID}
                  onChange={handlechange}
                />
                <input
                  type="hidden"
                  value={state.timestamp}
                  onChange={handlechange}
                />
                {modalState ? (
                  <>
                    <button
                      class="primary-button"
                      for="tag_submit_form"
                      type="submit"
                      disabled={disableButton}
                    >
                      Confirm Tag
                    </button>
                    <button onClick={() => setModalState(false)}>Close</button>
                    <p>Are you sure?</p>
                  </>
                ) : (
                  <button
                    class="primary-button"
                    onClick={() => setModalState(true)}
                  >
                    Tag
                  </button>
                )}
              </form>
            </div>
            {uid == tagger1 ? (
              <SendVideo videoId={id} />
            ) : (
              <SendTaggingComplete
                videoId={id}
                tagger1={tagger1}
                messageID={messageID}
                markerData={markerData}
                tagData={tagData}
              />
            )}
          </div>
          {visible ? (
            <TagSuccessBanner
              initPass={initPass}
              visible={visible}
              setVisible={setVisible}
              failMessage={failMessage}
            />
          ) : (
            ""
          )}
          <div
            className="watch-video-form tag-container"
            style={{ display: `${loading ? "none" : "block"}` }}
          >
            {tagData.length > 0 ? (
              <div>
                <h2>Tags</h2>
                <div className="TagInfoContainer">
                  <table className="TagsTable">
                    <thead>
                      <tr>
                        <th>Tag ID</th>
                        <th>Context</th>
                        <th>Thought/Choice</th>
                        <th>Tone</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    {tagData.map((tag) => {
                      return (
                        <>
                          <tbody key={tag.id}>
                            <tr>
                              <td>{tag.id}</td>
                              <td>{ChangeContext(tag.context)}</td>
                              <td>{ChangeThoughtChoice(tag.thought_choice)}</td>
                              <td>{ChangeTone(tag.tone)}</td>
                              <td className="TimestampColumn">
                                {ChangeTimeStamp(tag.timestamp)}
                                <div
                                  className="EditIcon"
                                  onClick={() =>
                                    EditTagClick(
                                      true,
                                      tag.comment,
                                      tag.id,
                                      tag.tone,
                                      tag.context,
                                      tag.thought_choice
                                    )
                                  }
                                >
                                  <i class="fas fa-edit"></i>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                          <div>
                            {tagModalOpen ? (
                              <Modal
                                open={tagModalOpen}
                                onClose={() => setTagModalOpen(false)}
                                center
                                classNames={{
                                  overlay: "customOverlay",
                                  modal: "customModal",
                                }}
                              >
                                <div className="EditTagsForm">
                                  <div className="TagsTableContainer">
                                    <table className="TagsViewTable">
                                      <thead>
                                        <tr>
                                          <th>Tag Id</th>
                                          <th>Context</th>
                                          <th>Thought/Choice</th>
                                          <th>Tone</th>
                                          <th>Comment</th>
                                          <th>Timestamp</th>
                                        </tr>
                                      </thead>
                                      <tbody key={tag.id}>
                                        <tr>
                                          <td>
                                            {tagData[selectedTag.current].id}
                                          </td>
                                          <td>
                                            {ChangeContext(
                                              tagData[selectedTag.current]
                                                .context
                                            )}
                                          </td>
                                          <td>
                                            {ChangeThoughtChoice(
                                              tagData[selectedTag.current]
                                                .thought_choice
                                            )}
                                          </td>
                                          <td>
                                            {ChangeTone(
                                              tagData[selectedTag.current].tone
                                            )}
                                          </td>
                                          <td>
                                            {
                                              tagData[selectedTag.current]
                                                .comment
                                            }
                                          </td>
                                          <td>
                                            {ChangeTimeStamp(
                                              tagData[selectedTag.current]
                                                .timestamp
                                            )}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="SelectContainer">
                                    <div className="DropDownFieldContainer">
                                      <select
                                        name="context"
                                        onChange={handlechange}
                                        value={state.context}
                                      >
                                        {contextItems.map(
                                          ({ label, value }) => (
                                            <option key={value} value={value}>
                                              {label}
                                            </option>
                                          )
                                        )}
                                      </select>
                                      <select
                                        name="thought_choice"
                                        value={state.thought_choice}
                                        onChange={handlechange}
                                      >
                                        {thoughtItems.map(
                                          ({ label, value }) => (
                                            <option key={value} value={value}>
                                              {label}
                                            </option>
                                          )
                                        )}
                                      </select>
                                      <select
                                        name="tone"
                                        onChange={handlechange}
                                        value={state.tone}
                                      >
                                        {toneItems.map(({ label, value }) => (
                                          <option key={value} value={value}>
                                            {label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="CommentContainer">
                                      <label
                                        className="CommentLabel"
                                        htmlFor="comment"
                                      >
                                        Comment:
                                      </label>
                                      <textarea
                                        className="CommentTextArea"
                                        name="comment"
                                        id="comment"
                                        rows="4"
                                        value={currentTagComment}
                                        onChange={(e) =>
                                          setCurrentTagComment(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="EditTagButtonContainer">
                                      <button
                                        className="TagEditButton"
                                        onClick={() =>
                                          DeleteTag(
                                            tagData[selectedTag.current].id
                                          )
                                        }
                                      >
                                        Delete tag
                                      </button>
                                      <button
                                        className="TagEditButton"
                                        onClick={() =>
                                          UpdateTag(
                                            tagData[selectedTag.current].id
                                          )
                                        }
                                      >
                                        Update tag
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="CloseWindowContainer">
                                  <button
                                    className="TagEditButton"
                                    onClick={() => {
                                      setTagModalOpen(false);
                                    }}
                                  >
                                    close window
                                  </button>
                                </div>
                              </Modal>
                            ) : (
                              <></>
                            )}
                          </div>
                        </>
                      );
                    })}
                  </table>
                </div>
              </div>
            ) : (
              <div className="NoTagsContainer">
                <p className="NoTagsMessage">There are currently no tags</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserContainer>
  );
}

export default WatchVideo;
