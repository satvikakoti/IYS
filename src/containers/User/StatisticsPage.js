/**
 *
 * StatisticsPage.js: Component to layout the review page
 *
 * Lawrence Valerio, Symon Kurt San Jose
 *
 * Date: 03/05/2021
 * Update Date: 04/13/2021
 */

import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserHubPageTitle } from "../generalComponents/UserHubPageTitle";
import { BackToHome } from "../generalComponents/BackToHome";
import "./css/StatisticsPage.css";

const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * Component to layout the statistics page (this is not the review video page)
 * @param {*} props
 * @returns The review/statistics page
 */
export function StatisticsPage(props) {
  const [token] = useCookies(["user-token"]);
  const [loading, setLoading] = useState(false);
  const [userVideos, setUserVideos] = useState([]);

  useEffect(() => {
    //Getting the list of messages
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_API_URL}/IYS/videos/user_videos_completed/`,
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
        setUserVideos(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>Statistics Page</UserHubPageTitle>
      <div className="StatisticsFormContainer">
        <BackToHome />
        <div className="StatisticsVideosForm">
          {loading ? (
            <div className="SpinnerContainer" style={{ maxHeight: "300px" }}>
              <div className="spinner-border" />
            </div>
          ) : (
            <table className="StatisticsVideosTable">
              <thead>
                <tr>
                  <th>Title</th>
                </tr>
              </thead>
              {userVideos.map((video) => {
                return (
                  <tbody key={video.id}>
                    <tr>
                      <td>
                        <Link to={"Statistics/" + video.id}>{video.title}</Link>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          )}
        </div>
      </div>
    </UserContainer>
  );
}
