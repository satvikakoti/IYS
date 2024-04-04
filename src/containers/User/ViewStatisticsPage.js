/**
 *
 * ViewStatisticsPage.js: Component to layout the view statistics with video page
 *
 * Michelle Peters, Lawrence Valerio, Symon Kurt San Jose
 * Updated: Prachotan Bathi
 * Date: 03/9/2021
 * Update Date: 08/04/2021
 */

import React, { useEffect, useState, useRef } from "react";
import VideoPlayer from "react-video-markers";
import { useCookies } from "react-cookie";
import "./css/ViewStatisticsPage.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { CSVLink } from "react-csv";
import "./css/WatchVideo.css";
import styled from "styled-components";
import { UserHubPageTitle } from "../generalComponents/UserHubPageTitle";
import { BackToHome } from "../generalComponents/BackToHome";
import axios from "axios";

const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * Component to layout the view statistics page (individual statistics with video)
 * @param {*} props
 * @returns View Statistics page
 */
export function ViewStatisticsPage(props) {
  const [token] = useCookies(["user-token"]);
  const [url, setUrl] = useState(null);
  const [stats_url] = useState(window.location.href);
  const [inviteUser, setInviteUser] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeStart] = useState(0);
  const [uid] = useCookies(["user-id"]);
  const [markerData, setMarkerData] = useState([]);
  const [markerData2, setMarkerData2] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);
  const [showTagInfo, setShowTagInfo] = useState();
  const [tagger1, setTagger1] = useState();
  const [tagger2, setTagger2] = useState();
  const [instructor, setInstructor] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState([]);
  const [overallScore, setOverallScore] = useState(0);
  const [openSecondModal, setOpenSecondModal] = useState(false);
  const [videoCompletedData, setVideoCompletedData] = useState([]);
  let timeRef = useRef(0);
  const [controls, setControls] = useState([
    "play",
    "time",
    "progress",
    "volume",
    "full-screen",
  ]);

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

  function CloseModal() {
    setModalIsOpen(false);
    setOpenSecondModal(false);
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
    // use the selected markers index to find data
    // relating to marker data for both users
    let index = selectedMarker.markerIndex;

    // Reformat the tone value for user readability
    if (markerData[index].tone === "POS") {
      tone = "Positive";
    } else if (markerData[index].tone === "NEG") {
      tone = "Negative";
    } else if (markerData[index].tone === "NEU") {
      tone = "Neutral";
    }

    if (markerData2[index].tone === "POS") {
      tone2 = "Positive";
    } else if (markerData2[index].tone === "NEG") {
      tone2 = "Negative";
    } else if (markerData2[index].tone === "NEU") {
      tone2 = "Neutral";
    }

    // Reformat the thought vs feeling choice
    // value for user readability
    if (markerData[index].thought_choice === "TH") {
      thought_choice = "Thought";
    } else if (markerData[index].thought_choice === "FE") {
      thought_choice = "Feeling";
    }

    if (markerData2[index].thought_choice === "TH") {
      thought_choice2 = "Thought";
    } else if (markerData2[index].thought_choice === "FE") {
      thought_choice2 = "Feeling";
    }

    // Reformat the context value for user readability
    if (markerData[index].context === "SLF") {
      context = "Self";
    } else if (markerData[index].context === "DPT") {
      context = "Dialogue Partner";
    } else if (markerData[index].context === "OPP") {
      context = "Other Person or Persons";
    } else if (markerData[index].context === "CTX") {
      context = "Current Context";
    } else if (markerData[index].context === "OEC") {
      context = "Other Event or Circumstance";
    }

    if (markerData2[index].context === "SLF") {
      context2 = "Self";
    } else if (markerData2[index].context === "DPT") {
      context2 = "Dialogue Partner";
    } else if (markerData2[index].context === "OPP") {
      context2 = "Other Person or Persons";
    } else if (markerData2[index].context === "CTX") {
      context2 = "Current Context";
    } else if (markerData2[index].context === "OEC") {
      context2 = "Other Event or Circumstance";
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
            <h2 style={{color:"#f3890d"}}>Perceptual Target</h2>
            <h5>
              {tone} {thought_choice} - {context}
            </h5>
            <h5>{markerData[index].comment}</h5>
            <h2 style={{color:"#0077b6"}}>Perceiver</h2>
            <h5>
              {tone2} {thought_choice2} - {context2}
            </h5>
            <h5>{markerData2[index].comment}</h5>
            <h2>Score</h2>
            <h5>{markerData2[index].score}/2</h5>
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
   * Displays tag info in popup window whenever
   * a marker is selected
   *
   * Michelle Peters
   */
  useEffect(() => {
    if (selectedMarker.length != 0) {
      setShowTagInfo(true);
      setModalIsOpen(true);
    }
  }, [selectedMarker]);

  /**
   * Get data corresponding to selected video
   * video ID
   *
   * Michelle Peters
   */
  useEffect(() => {
    if (uid != "") {
//    console.log(uid)
      fetch(
        `${process.env.REACT_APP_API_URL}/IYS/videos/${props.id}/video_completed/`,
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
          console.log(data)
          setVideoCompletedData(data);
          if (data.message != "You do not have permission") {
            setUrl(data[0].url);
            setTagger1(data[0].tagger1);
            setTagger2(data[0].tagger2);
            setInstructor(data[0].instructor);
            console.log(data[0].instructor);
            setVideoData(data);
          }
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
    if (tagger2 != null) {
      if (markerData.length == 0 && markerData2.length == 0) {
        GetTags(tagger1);
        GetTags(tagger2);
      }
    }
  }, [tagger2]);

  /**
   * Query and list all tags that share the same user and
   * video ID
   *
   * Luis Ferrer
   */
  function GetTags(tagger) {
    fetch(
      `${process.env.REACT_APP_API_URL}/IYS/Home/api/vid_tags/${props.id}/uid/${tagger}/`,
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
        const reformattedData = data.map((data, index) => {
          return {
            // use index of marker ordered by timestamp
            markerIndex: index,
            id: data.id,
            userID: data.userID,
            videoID: data.videoID,
            thought_choice: data.thought_choice,
            tone: data.tone,
            context: data.context,
            comment: data.comment,
            time: data.timestamp,
            score: data.score,
            color: "#fc8b18",
          };
        });
        // store marker data for each tagger
        if (tagger == tagger1) {
          setMarkerData(reformattedData);
        } else if (tagger == tagger2) {
          setMarkerData2(reformattedData);
          let score = 0;
          for (let i = 0; i < data.length; i++) {
            score = data[i].score + score;
          }
          setOverallScore(score);
        }
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }

  const DownloadVideo = () => {
    const bucketKey = videoData[0].url.slice(-32);

    fetch(`${process.env.REACT_APP_API_URL}/IYS/videos/download_video/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
      body: JSON.stringify({ Key: bucketKey }),
    })
      .then((data) => data.json())
      .then((data) => {
        DownloadVideoURL(data);
      })
      .catch((error) => console.error(error));
  };

  const DownloadVideoURL = (URL) => {
    window.open(URL, "_blank");
  };

  const PerceptualAccuracyScore = () => {
    let score = (overallScore / (markerData2.length * 2)) * 100;

    return score.toFixed(1);
  };

  let markerDataRemapped = [];
  if (markerData.length > 0) {
    try {
      markerDataRemapped = markerData.map((tags) => {
        return {
          Marker: tags.markerIndex,
          Tone: ChangeTone(tags.tone),
          Thought_Choice: ChangeThoughtChoice(tags.thought_choice),
          Context: ChangeContext(tags.context),
          Comment: tags.comment,
          Timestamp: ChangeTimeStamp(tags.time),
        };
      });
    } catch (error) {}
  }
  const ScoreArray = [
    {
      Overall_Score:
        "Overall Score: " + overallScore + "/" + markerData2.length * 2,
      Perceptual_Accuracy_Score: PerceptualAccuracyScore() + "%",
    },
  ];

  let markerData2Remapped = [], csv_array = [];
  if (markerData2.length > 0) {
    try {
      markerData2Remapped = markerData2.map((tags, index) => {
        return {
          Perceptual_Marker: markerDataRemapped[index].Marker,
          Perceptual_Tone: markerDataRemapped[index].Tone,
          Perceptual_Thought_Choice: markerDataRemapped[index].Thought_Choice,
          Perceptual_Context: markerDataRemapped[index].Context,
          Perceptual_Comment: markerDataRemapped[index].Comment,
          Perceptual_Timestamp: markerDataRemapped[index].Timestamp,
          Perceiver_Marker: tags.markerIndex,
          Perceiver_Tone: ChangeTone(tags.tone),
          Perceiver_Thought_Choice: ChangeThoughtChoice(tags.thought_choice),
          Perceiver_Context: ChangeContext(tags.context),
          Perceiver_Comment: tags.comment,
          Perceiver_Timestamp: ChangeTimeStamp(tags.time),
          Perceiver_Score: tags.score,
          empty: " ",
        };
      });
    } catch (error) {}
     try {
      csv_array = markerData2.map((tags, index) => {
        return {
          "Perceptual Marker": markerDataRemapped[index].Marker,
          "Perceptual Tone": markerDataRemapped[index].Tone,
          "Perceptual Thought/Choice": markerDataRemapped[index].Thought_Choice,
          "Perceptual Context": markerDataRemapped[index].Context,
          "Perceptual Comment": markerDataRemapped[index].Comment,
          "Perceptual Timestamp": markerDataRemapped[index].Timestamp,
          "Perceiver Marker": tags.markerIndex,
          "Perceiver Tone": ChangeTone(tags.tone),
          "Perceiver Thought/Choice": ChangeThoughtChoice(tags.thought_choice),
          "Perceiver Context": ChangeContext(tags.context),
          "Perceiver Comment": tags.comment,
          "Perceiver Timestamp": ChangeTimeStamp(tags.time),
          "Perceiver Score": tags.score,
          " ": " ",
          "Overall Score and Perceptual Accuracy Score":ScoreArray,

        };
      });
    } catch (error) {}
  }

  const headers = [
    { label: "Perceptual Marker", key: "Perceptual_Marker" },
    { label: "Perceptual Tone", key: "Perceptual_Tone" },
    { label: "Perceptual Thought/Choice", key: "Perceptual_Thought_Choice" },
    { label: "Perceptual Context", key: "Perceptual_Context" },
    { label: "Perceptual Comment", key: "Perceptual_Comment" },
    { label: "Perceptual Timestamp", key: "Perceptual_Timestamp" },
    { label: " ", key: "empty" },
    { label: "Perceiver Marker", key: "Perceiver_Marker" },
    { label: "Perceiver Tone", key: "Perceiver_Tone" },
    { label: "Perceiver Thought/Choice", key: "Perceiver_Thought_Choice" },
    { label: "Perceiver Context", key: "Perceiver_Context" },
    { label: "Perceiver Comment", key: "Perceiver_Comment" },
    { label: "Perceiver Timestamp", key: "Perceiver_Timestamp" },
    { label: "Perceiver Score", key: "Perceiver_Score" },
    { label: "Overall Score", key: "Overall_Score" },
    {
      label: "Perceptual Accuracy Score",
      key: "Perceptual_Accuracy_Score",
    },
  ];

  const allTags = [...markerData2Remapped, ...ScoreArray];
  const csvReport = {
    filename: "Tags_Data.csv",
    headers: headers,
    data: allTags,
  };
//  console.log(csv_array)
  var my_csv = JSON.stringify({csv_file: csv_array})
//  console.log(typeof(my_csv))
//  console.log(my_csv)
  const InviteUser = (e) => {
  console.log(inviteUser)
  console.log(stats_url)
    if (inviteUser.length != 0) {
      fetch(`${process.env.REACT_APP_API_URL}/IYS/Home/sendEmailThirdUser/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
        body: JSON.stringify({email: inviteUser, url:stats_url, csv_file: csv_array }),
      })
        .then((data) => data.json())
        .then((data) => {
          console.log(data)
          })
        .then(alert("A link to this stats page has been sent"))
        .catch((error) => console.error(error));

//      fetch(`${process.env.REACT_APP_API_URL}/IYS/videos/${props.id}/third_user/`, {
//        method: "POST",
//        headers: {
//          "Content-Type": "application/json",
//          Authorization: `Token ${token["user-token"]}`,
//        },
//        body: JSON.stringify({email: inviteUser}),
//      })
//        .then((data) => data.json())
//        .then((data) => {
//          console.log(data)
//          setVideoCompletedData(data);
//          setInstructor(data.instructor);
//          console.log(data.instructor)
////          setVideoData(data);
//        })
//        .catch((error) => console.error(error));

    }else {
      alert(
        "Sorry, your request could not be completed. Please make sure the email you have entered belongs to an In Your Shoes users account."
      );
    }
  };

  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>Review Video</UserHubPageTitle>
      <div className="watch-video-container ReviewVideo">
        <BackToHome />
        <div className="watch-video-form video-container">
          {videoCompletedData.message == "You do not have permission" ? (
            <>
              <h1>You do not have permission to view this video.</h1>
            </>
          ) : (
            <>
              {loading ? (
                <div className="SpinnerContainer">
                  <div className="spinner-border" />
                </div>
              ) : (
                <div className="SecondViewStatisticsContainer">
                  <h1 className="StatisticsTitle">{videoData[0].title}</h1>
                  {url ? (
                    <div className="player">
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
                    </div>
                  ) : null}
                  <h2 className="StatisticsTagsTitle">Tags</h2>
                  <table className="StatisticsVideosTable">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    {markerData2.map((marker) => {
                      return (
                        <tbody key={marker.id}>
                          <tr>
                            <td>{ChangeTimeStamp(marker.time)}</td>
                            <td className="ScoreColumn">
                              {marker.score}
                              <p
                                className="ViewMore"
                                onClick={() => handleMarkerClick(marker)}
                              >
                                view more
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                    <tbody>
                      <tr>
                        <td>Overall Score</td>
                        <td>
                          {overallScore}/{markerData2.length * 2}
                        </td>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr>
                        <td>Perceptual Accuracy Score</td>
                        <td>{PerceptualAccuracyScore()}%</td>
                      </tr>
                    </tbody>
                  </table>
                  {showTagInfo ? <TagPopUp /> : ""}
                  <p>Learn how to <a href="https://iys-storage.s3.us-east-2.amazonaws.com/Hand_Calculate_Your_Perceptual_Accuracy_Score.pdf#page=8" target="_blank">Calculate Your Overall Perceptual Accuracy Score</a> </p>
                  <button>
                    <CSVLink {...csvReport}>Export tags to csv</CSVLink>
                  </button>
                  <button onClick={() => DownloadVideo()}>
                    <a>Download Video</a>
                  </button>
                  <p><b>Share statistics page</b> </p>
                   <div class="input-group mb-3">

                        <input
                          name="third_email"
                          type="text"
                          class="form-control"
                          placeholder="Recipient's username"
                          aria-label="Recipient's username"
                          aria-describedby="basic-addon2"
                          value={inviteUser}
                          onChange={(e) => setInviteUser(e.target.value)}
                        />
                        <div class="input-group-append">
                          <button
                            class="btn btn-outline-secondary"
                            type="button"
                            onClick={InviteUser}
                          >
                            Invite User
                           </button>
                        </div>
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
