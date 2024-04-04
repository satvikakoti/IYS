/**
 *
 * MyVideos.js: Component to layout the my videos page
 *
 * Michelle Peters, Symon Kurt San Jose, Lawrence Valerio
 *
 * Date: 11/02/2020
 * Update Date: 04/13/2021
 */

import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./css/MyVideos.css";
import { UserHubPageTitle } from "../generalComponents/UserHubPageTitle";
import { BackToHome } from "../generalComponents/BackToHome";
import axios from "axios";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StylingDeleteIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

/**
 * Component to layout the my videos page
 * @returns My Videos page
 */
export function MyVideos() {
  const [token] = useCookies(["user-token"]);
  const [untaggedVideos, setUntaggedVideos] = useState([]);
  const [pendingTarget, setPendingTarget] = useState([]);
  const [pendingPerceiver, setPendingPerceiver] = useState([]);
  const [completedVideosTarget, setCompletedVideosTarget] = useState([]);
  const [completedVideosPerceiver, setCompletedVideosPerceiver] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Get and store all videos associated with the logged in user
   * according to the category they belong too
   *
   * Michelle Peters
   */
  useEffect(() => {
    const GetVideos = async () => {
      try {
        const userToken = token["user-token"];

        // Get all videos concurrently
        const untagged_videos = axios.get(
          `${process.env.REACT_APP_API_URL}/IYS/videos/untagged_videos`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${userToken}`,
            },
          }
        );
        const pending_videos_target = axios.get(
          `${process.env.REACT_APP_API_URL}/IYS/videos/pending_videos_target`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${userToken}`,
            },
          }
        );
        const pending_videos_perceiver = axios.get(
          `${process.env.REACT_APP_API_URL}/IYS/videos/pending_videos_perceiver`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${userToken}`,
            },
          }
        );
        const completed_videos_target = axios.get(
          `${process.env.REACT_APP_API_URL}/IYS/videos/completed_videos_target`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${userToken}`,
            },
          }
        );
        const completed_videos_perceiver = axios.get(
          `${process.env.REACT_APP_API_URL}/IYS/videos/completed_videos_perceiver`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${userToken}`,
            },
          }
        );

        // resolve all promises and send all video data back as an array
        return Promise.all([
          untagged_videos,
          pending_videos_target,
          pending_videos_perceiver,
          completed_videos_target,
          completed_videos_perceiver,
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    // call async function and initialize video data
    GetVideos()
      .then((videos) => {
        setUntaggedVideos(videos[0].data);
        setPendingTarget(videos[1].data);
        setPendingPerceiver(videos[2].data);
        setCompletedVideosTarget(videos[3].data);
        setCompletedVideosPerceiver(videos[4].data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [token]);

  function infoAlertShow(msg) {
    window.alert(msg)
  }
  /**
   * Delete the selected video from the
   * AWS S3 bucket
   *
   * Michelle Peters
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
   * Delete the selected video from the
   * database and API
   *
   * Michelle Peters
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
   * Return the videos listed by category
   */
  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle MyVideos>My Videos</UserHubPageTitle>
      <div id="video-list" className="my-videos-container">
        <BackToHome />
        {loading ? (
          <div className="my-videos-form">
            <div className="SpinnerContainer" style={{ maxHeight: "500px" }}>
              <div className="spinner-border" />
            </div>
          </div>
        ) : (
          <div>
            <div className="my-videos-form">
              <h3>Untagged</h3>
              <div className="type-section">
                <div>
                  <h4>Ready to be tagged, click on the video title</h4>
                  <ul>
                    {untaggedVideos.map((video) => (
                      <li key={video.id}>
                        <Link to={"/UserHub/Watch/" + video.id}>
                          {video.title}
                        </Link>
                        <span className="VideoDeleteIcon">
                          <StylingDeleteIcon
                            icon={faTrashAlt}
                            onClick={(e) => deleteFromS3(video.url, video.id)}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="my-videos-form">
              <h3>Tagging in Process</h3>
              <div className="type-section">
                <div>
                  <h4>Tagged and sent by you, awaiting tags by second user</h4>
                  <ul>
                    {pendingTarget.map((video) => (
                      <li key={video.id}>
                        <Link to={"/UserHub/Pending/" + video.id}>
                          {video.title}
                        </Link>
                        <span className="VideoDeleteIcon">
                          <StylingDeleteIcon
                            icon={faTrashAlt}
                            onClick={(e) => deleteFromS3(video.url, video.id)}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Received from another user, awaiting tags by you
                    <i style={{marginLeft:'0.8rem', cursor:"pointer"}}
                    class="fas fa-info-circle" 
                    onClick={(e) => infoAlertShow("Tagged videos received from your partner and awaiting tagging by you appear here.")}></i>
                    </h4>  
                  <ul>
                    {pendingPerceiver.map((video) => (
                      <li key={video.id}>
                        <Link to={"/Userhub/Watch/" + video.id}>
                          {video.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="my-videos-form">
              <h3>Tagged</h3>
              <div className="type-section">
                <div>
                  <h4>Tests administered by you
                  <i style={{marginLeft:'0.8rem',  cursor:"pointer"}}
                    class="fas fa-info-circle" 
                    onClick={(e) => infoAlertShow("Videos uploaded by you and after successful tagging by you and your partner appear here.")}></i>
                  </h4>
                  <ul>
                    {completedVideosTarget.map((video) => (
                      <li key={video.id}>
                        <Link
                          className="VideoTitleLink"
                          to={"/UserHub/Statistics/" + video.id}
                        >
                          {video.title}
                        </Link>
                        <span className="VideoDeleteIcon">
                          <StylingDeleteIcon
                            icon={faTrashAlt}
                            onClick={(e) => deleteFromS3(video.url, video.id)}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>Tests taken by you
                  <i style={{marginLeft:'0.8rem', cursor:"pointer"}}
                    class="fas fa-info-circle"
                    onClick={(e) => infoAlertShow("Videos uploaded by your partners and after successful tagging by you and your partners appear here.")}></i>
                  </h4>
                  <ul>
                    {completedVideosPerceiver.map((video) => (
                      <li key={video.id}>
                        <Link to={"/UserHub/Statistics/" + video.id}>
                          {video.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserContainer>
  );
}
