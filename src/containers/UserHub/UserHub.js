/**
 * UserHub.js: Function component that is used to show and route
 * the userhub pages (admin and normal user)
 *
 * Lawrence Valerio, Symon Kurt San Jose
 *
 *
 * Date Created: 01/28/2021
 * Last Updated: 04/13/2021
 */

import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import "react-alice-carousel/lib/alice-carousel.css";
import { Navbar } from "../Navbar/navbar";
import { Footer } from "../Footer/footer";
import "../../CSS/userHub.css";
import { UserHubNavBar } from "../UserHubNavigationBar/UserHubNavBar";

import { Switch, Route, useParams, Redirect } from "react-router-dom";
import { UserHome } from "../User/UserHome";
import { UserProfile } from "../User/UserProfile";
import { UploadVideo } from "../User/Upload";
import { Watch_Other } from "../User/Watch_Other";
import { MyVideos } from "../User/MyVideos";
import { WatchVideo } from "../User/WatchVideo";
import { PendingVideo } from "../User/PendingVideo";
import { Messages } from "../User/MessagesPage/Messages";
import { New_Message } from "../User/MessagesPage/components/New_Message";
import { ViewMessage } from "../User/ViewMessagesPage/ViewMessage";
import { StatisticsPage } from "../User/StatisticsPage";
import { ViewStatisticsPage } from "../User/ViewStatisticsPage";
import { AllUsers } from "../UserHubAdmin/AllUsers";
import { AdminHub } from "../UserHubAdmin/AdminHub";
import { View_User } from "../UserHubAdmin/View_User";
import { AllMessages } from "../UserHubAdmin/AllMessages";
import { View_Video } from "../UserHubAdmin/View_Video";
import { AllVideos } from "../UserHubAdmin/AllVideos";

const ContentSection = styled.section`
  display: flex;
  width: 100%;
  min-height: 800px;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

/**
 * The function that renders the userhub page
 */
export function UserHub(props) {
  const [token] = useCookies(["user-token"]);

  // only allows user access if logged in
  useEffect(() => {
    if (!token["user-token"] || token["user-token"] === "undefined")
      window.location.href = "/";
  }, [token]);

  return (
    <PageContainer>
      <Navbar otherpages="true" className="other-page" />
      <ContentSection>
        <UserHubNavBar />
        <Switch>
          <Route
            exact
            path="/UserHub"
            render={(props) => <UserHome {...props} />}
          />
          <Route exact path="/UserHub/Admin/:page" component={ViewAdmin} />
          <Route exact path="/UserHub/Admin/:page/:id" component={AdminView} />
          <Route exact path="/UserHub/:page" component={ViewPage} />
          <Route exact path="/UserHub/:page/:vid" component={ViewVideo} />
        </Switch>
      </ContentSection>
      <Footer />
    </PageContainer>
  );
}

/**
 * Routing function for normal userhub pages
 * @returns The normal user userhub pages
 */
function ViewPage() {
  let { page } = useParams();

  switch (page) {
    case "Profile":
      return <UserProfile />;
    case "Upload":
      return <UploadVideo />;
    case "MyVideos":
      return <MyVideos />;
    case "Messages":
      return <Messages />;
    case "New_Message":
      return <New_Message />;
    case "Statistics":
      return <StatisticsPage />;
    case "Admin":
      return <AdminHub />;

    default:
      return <Redirect to="/" />;
  }
}

/**
 * Routing function for normal userhub video pages
 * @returns The normal user userhub watch video pages
 */
function ViewVideo() {
  let { page, vid } = useParams();

  switch (page) {
    case "Watch":
      return <WatchVideo id={vid} />;
    case "Pending":
      return <PendingVideo id={parseInt(vid, 10)} />;
    case "View_Message":
      return <ViewMessage messageId={parseInt(vid, 10)} />;
    case "New_Message":
      return <New_Message id={parseInt(vid, 10)} />;
    case "Statistics":
      return <ViewStatisticsPage id={vid} />;
    case "Watch_Other":
      return <Watch_Other id={vid} />;
    default:
      return <Redirect to="/" />;
  }
}

/**
 * Routing function for admin userhub pages
 * @returns The admin userhub pages
 */
function ViewAdmin() {
  let { page } = useParams();

  switch (page) {
    case "AllUsers":
      return <AllUsers />;
    case "AllMessages":
      return <AllMessages />;
    case "AllVideos":
      return <AllVideos />;
    default:
      return <Redirect to="/" />;
  }
}

/**
 * Routing function for viewing user and video page by admin
 * @returns The admin view page
 */
function AdminView() {
  let { page, id } = useParams();

  switch (page) {
    case "View_User":
      return <View_User id={id} />;
    case "View_Video":
      return <View_Video id={id} />;
    default:
      return <Redirect to="/" />;
  }
}
