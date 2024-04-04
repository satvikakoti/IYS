/**
 *
 * UserHubNavBar.js: Component to layout the userhub navigation bar.
 *
 * Symon Kurt San Jose, Lawrence Valerio
 *
 * Date: 02/09/2021
 * Update Date: 04/13/2021
 */

import React from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";

const UserHubNavList = styled.ul`
  list-style-type: none;
  color: #fff;
  margin-bottom: 0;
  list-style-position: inside;
  padding: 20px 0px 0px 0px;

  @media screen and (max-width: 812px) {
    display: none;
  }
`;

const ListItem = styled.li`
  color: white;
  padding: 10px;
  margin: 0;
  text-decoration: none;
  transition: 0.2s;
  text-align: center;
  display: flex;
  flex-direction: column;

  &:hover {
    text-decoration: none;
    color: #509dcd;
    background-color: white;
    cursor: pointer;
  }
`;

const AwesomeIcon = styled.i`
  display: inline;
  font-size: 40px;
  margin: auto;
`;

/**
 * Component to layout the userhub navigation bar
 * @param {*} props
 * @returns UserHub Navigation bar
 */
export function UserHubNavBar(props) {
  const [token] = useCookies(["is-admin"]);

  return (
    <nav style={{ backgroundColor: "#509dcd" }}>
      <UserHubNavList>
        <ListItem
          {...props}
          onClick={() => {
            window.location.href = "/UserHub/Profile";
          }}
        >
          <AwesomeIcon className="fas fa-user" />
          User Profile
        </ListItem>
        <ListItem
          {...props}
          onClick={() => {
            window.location.href = "/UserHub/Upload";
          }}
        >
          <AwesomeIcon className="fas fa-video" />
          Upload a Video
        </ListItem>
        <ListItem
          {...props}
          onClick={() => {
            window.location.href = "/UserHub/MyVideos";
          }}
        >
          <AwesomeIcon className="fas fa-tv" />
          My Videos
        </ListItem>
        <ListItem
          {...props}
          onClick={() => {
            window.location.href = "/UserHub/Statistics";
          }}
        >
          <AwesomeIcon className="fas fa-chart-area" />
          Statistics
        </ListItem>
        <ListItem
          {...props}
          onClick={() => {
            window.location.href = "/UserHub/Messages";
          }}
        >
          <AwesomeIcon className="fas fa-envelope" />
          Messages
        </ListItem>
        {token["is-admin"] === "true" ? (
          <ListItem
            {...props}
            onClick={() => {
              window.location.href = "/UserHub/Admin";
            }}
          >
            <AwesomeIcon className="fas fa-user-cog" />
            Administration
          </ListItem>
        ) : (
          ""
        )}
      </UserHubNavList>
    </nav>
  );
}
