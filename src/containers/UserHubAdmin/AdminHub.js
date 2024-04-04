/**
 *
 * AdminHub.js: Component to layout the userhub admin page
 *
 * Lawrence Valerio
 *
 * Date: 03/15/2021
 * Update Date: 04/13/2021
 */

import React, { useRef } from "react";
import "./Admin.css";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserHubPageTitle } from "../generalComponents/UserHubPageTitle";
import { BackToHome } from "../generalComponents/BackToHome";

const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * Component to layout the admin page of the userhub
 * @param {*} props
 * @returns Adming page
 */
export function AdminHub(props) {
  const [token] = useCookies(["user-token"]);
  const loading = useRef(true);

  /**
   * Returns to userhub page if user is not admin.
   */
  if (token["is-admin"] === "false") {
    window.location.href = "/UserHub/";
  } else {
    loading.current = false;
  }

  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>Administration</UserHubPageTitle>
      <div className="AdminHubContainer">
        <BackToHome />
        <div className="AdminHubForm">
          {loading.current === true ? (
            <>
              <div className="SpinnerContainer">
                <div className="spinner-border" />
              </div>
            </>
          ) : (
            <>
              <div className="AH_TitleContainer"></div>
              <div className="AH_ListContainer">
                <ul>
                  <li>
                    <Link to={"/UserHub/Admin/AllUsers"}>View all users</Link>
                  </li>
                  <li>
                    <Link to={"/UserHub/Admin/AllVideos"}>View all videos</Link>
                  </li>
                  <li>
                    <Link to={"/UserHub/Admin/AllMessages"}>
                      View all messages
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </UserContainer>
  );
}
