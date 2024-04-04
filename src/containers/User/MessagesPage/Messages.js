/**
 *
 * Messages.js: Component to layout the messages/inbox page
 *
 * Lawrence Valerio
 *
 * Date: 02/09/2021
 * Update Date: 04/13/2021
 */

import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import "./Messages.css";
import { Button } from "../../Navbar/components/button";
import styled from "styled-components";
import { UserHubPageTitle } from "../../generalComponents/UserHubPageTitle";
import { BackToHome } from "../../generalComponents/BackToHome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//styling components
const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StylingButton = styled(Button)`
  margin-top: 50px;
`;

const StylingDeleteIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

/**
 * Component to layout the messages/inbox page
 * @param {*} props
 * @returns Messages/Inbox page
 */
export function Messages(props) {
  const [token] = useCookies(["user-token"]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId] = useCookies(["user-id"]);
  const [currentUser] = userId["user-id"];

  const deleteMessage = (messageID) => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/messages/${messageID}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then(() => window.location.reload())
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (!token["user-token"]) window.location.href = "/";

    //Getting the list of messages
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/IYS/messages/user_messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>Messages</UserHubPageTitle>
      <div className="StatisticsFormContainer">
        <BackToHome />
        <div className="MessagesForm">
          {loading ? (
            <div className="SpinnerContainer" style={{ maxHeight: "300px" }}>
              <div className="spinner-border" />
            </div>
          ) : (
            <div className="messagesContainer">
              <table className="MessagesTable">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date Created</th>
                  </tr>
                </thead>
                {messages.map((message) => {
                  return (
                    <tbody key={message.id}>
                      <tr>
                        <td>
                          {message.user_id == currentUser ? (
                            <Link to={"View_Message/" + message.id}>
                              You have sent a video to be tagged to{" "}
                              {message.receiver_email}.
                            </Link>
                          ) : (
                            <Link
                              to={{
                                pathname: "View_Message/" + message.id,
                                state: { id: "34" },
                              }}
                            >
                              {message.title}
                            </Link>
                          )}
                        </td>
                        <td className="DateCreatedColumn">
                          {message.date_created}
                          <span>
                            <StylingDeleteIcon
                              icon={faTrashAlt}
                              onClick={(e) =>
                                window.confirm(
                                  "Are you sure you wish to delete this message? The message will be deleted for all users."
                                ) && deleteMessage(message.id)
                              }
                            />
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
              <div className="ButtonContainer">
                <Link className="NewMessageBtn" to={"New_Message"}>
                  <StylingButton OtherPages>New Message</StylingButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </UserContainer>
  );
}
