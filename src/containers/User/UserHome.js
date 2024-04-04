/**
 *
 * UserHome.js: Component to layout the home page of the userhub tabs
 *
 * Symon Kurt San Jose, Lawrence Valerio
 *
 * Date: 03/25/2021
 * Update Date: 04/13/2021
 */

import { UserHubPageTitle } from "../generalComponents/UserHubPageTitle";
import React from "react";
import styled from "styled-components";
import "./css/UserHub.css";

const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AwesomeIcon = styled.i`
  display: inline;
  font-size: 40px;
`;

const IconDiv = styled.div`
  flex: 1 1 1%;
  display: inline-block;
  text-align: center;

  &:hover {
    cursor: pointer;
  }
`;

const LiItem = styled.li`
  color: black;
  padding: 10px;
  text-decoration: none;
  transition: 0.2s;
  display: flex;
  width: auto;
  justify-content: flex-start;

  @media screen and (max-width: 812px) {
    padding: 10px 0px;
    flex-direction: column;
  }
`;

/**
 * Component to layout the userhome page of the userhub
 * @param {*} props
 * @returns Userhome page
 */
export function UserHome(props) {
  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>UserHub</UserHubPageTitle>
      <div className="UserHomeContainer">
        <div className="UserHomeContainerWhite">
          <h3>Welcome to the UserHub!</h3>
          <p>
            Navigating the UserHub can be confusing, that is why this page is
            dedicated to helping you work through several sections of the Hub.
          </p>
          <p>
            If you're a new User please go to the<span> </span>
            <a href="/TrainingPortal">Training Portal.</a>
          </p>
          <ul>
            <LiItem>
              <IconDiv
                {...props}
                onClick={() => {
                  window.location.href = "/UserHub/Profile";
                }}
                className="icons"
              >
                <AwesomeIcon className="fas fa-user" />
                <p>UserProfile</p>
              </IconDiv>
              <div>
                The place where you can see and edit your personal information
                such as first and last name.
              </div>
            </LiItem>
            <LiItem>
              <IconDiv
                {...props}
                onClick={() => {
                  window.location.href = "/UserHub/Upload";
                }}
                className="icons"
              >
                <AwesomeIcon className="fas fa-video" />
                <p>Upload a Video</p>
              </IconDiv>
              <div>Uploading a video will be done in this location.</div>
            </LiItem>
            <LiItem>
              <IconDiv
                {...props}
                onClick={() => {
                  window.location.href = "/UserHub/MyVideos";
                }}
                className="icons"
              >
                <AwesomeIcon className="fas fa-tv" />
                <p>My Videos</p>
              </IconDiv>
              <div>
                After uploading, you can find your videos to be tagged on this
                page. This page also contains pending videos that are needed to
                be tagged by you or another user, and videos that are already
                tagged but can be reviewed for further inspection.
              </div>
            </LiItem>
            <LiItem>
              <IconDiv
                {...props}
                onClick={() => {
                  window.location.href = "/UserHub/Statistics";
                }}
                className="icons"
              >
                <AwesomeIcon className="fas fa-chart-area" />
                <p>Statistics</p>
              </IconDiv>
              <div>
                After the second user has successfully tagged your video or vice
                versa, you can find your scores in this location
              </div>
            </LiItem>
            <LiItem>
              <IconDiv
                {...props}
                onClick={() => {
                  window.location.href = "/UserHub/Messages";
                }}
                className="icons"
              >
                <AwesomeIcon className="fas fa-envelope" />
                <p>Messages</p>
              </IconDiv>
              <div>
                Any invites to a message conversation or any video message
                received from a user will be shown here.
              </div>
            </LiItem>
          </ul>
        </div>
      </div>
    </UserContainer>
  );
}
