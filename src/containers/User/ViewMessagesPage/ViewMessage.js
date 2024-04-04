/**
 *
 * ViewMessage.js: Component to layout the viewing message page
 *
 * Lawrence Valerio
 *
 * Date: 02/08/2021
 * Update Date: 04/13/2021
 */

import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import "./ViewMessage.css";
import { Button } from "../../Navbar/components/button";
import styled from "styled-components";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserHubPageTitle } from "../../generalComponents/UserHubPageTitle";
import { BackToHome } from "../../generalComponents/BackToHome";

//styling components
const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonStyling = styled(Button)`
  margin-top: 20px;
  margin-bottom: 30px;
`;

const ButtonEmpty = styled(Button)`
  margin-top: 20px;
  pointer-events: none;
  color: rgb(199, 199, 199);
  margin-bottom: 30px;
`;

const DeleteIconContainer = styled.div`
  font-size: 25px;
  cursor: pointer;
`;

/**
 * Component to layout the view message page
 * @param {*} messageId Used to get the specific message of the user
 * @returns View specific Message page
 */
export function ViewMessage({ messageId }) {
  const [token] = useCookies(["user-token"]);
  const [replys, setReplys] = useState([]);
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [emptyContent, setEmptyContent] = useState(true);
  const [userId] = useCookies(["user-id"]);
  const [currentUser] = userId["user-id"];
  const [authorization, setAuthorization] = useState(false);
  const messageExists = useRef(false);
  const [inviteUser, setInviteUser] = useState("");
  const [inviteMessage, setInviteMessage] = useState([]);

  //Checks to see if the reply content is empty
  const emptyContentCheck = (value) => {
    if (value.length > 0) {
      setEmptyContent(false);
    } else {
      setEmptyContent(true);
    }
  };

  //Sets the reply message to the value of the text area
  const changeHandler = (e) => {
    setReplyMessage(e.target.value);
    emptyContentCheck(e.target.value);
  };

  //handles the form submit
  const submitHandler = (e) => {
    e.preventDefault();
    newReply();
  };

  //Sends a POST request to create a new reply
  const newReply = () => {
    fetch(
      `${process.env.REACT_APP_API_URL}/IYS/messages/${messageId}/send_reply/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
        body: JSON.stringify({ content: replyMessage }),
      }
    )
      .then(() => window.location.reload())
      .catch((error) => console.error(error));
  };

  //Sends a DELETE request to delete reply
  const deleteReply = (replyID) => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/replys/${replyID}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then(() => window.location.reload())
      .catch((error) => console.error(error));
  };

  //Sets the message id to the video when clicking the link
  const setMessageID = () => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/videos/${message.videoID}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
      body: JSON.stringify({ message: messageId }),
    }).catch((error) => console.error(error));
  };

  //Fetching data from api
  useEffect(() => {
    if (!token["user-token"]) window.location.href = "/";

    fetch(`${process.env.REACT_APP_API_URL}/IYS/messages/invite_check/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
      body: JSON.stringify({ message: messageId }),
    })
      .then((data) => data.json())
      .then((data) => {
        MessageAuthorization(data.message);
      })
      .catch((error) => console.error(error));

    fetch(`${process.env.REACT_APP_API_URL}/IYS/messages/${messageId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setMessage(data);
        if (data.detail === "Not found.") {
          messageExists.current = false;
        } else {
          messageExists.current = true;
        }
        MessageAuthorization();
      })
      .catch((error) => console.error(error));

    fetch(
      `${process.env.REACT_APP_API_URL}/IYS/messages/${messageId}/message_replys/`,
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
        setReplys(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const InviteUser = () => {
//  console.log(inviteUser)
    if (inviteUser.length != 0) {
      fetch(`${process.env.REACT_APP_API_URL}/IYS/messages/send_invite/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
        body: JSON.stringify({ message_id: messageId, email: inviteUser }),
      })
        .then((data) => data.json())
        .then((data) => {
          setInviteMessage(data);
          console.log(data);
          alert("Invite has been sent to " + inviteUser);
        })
        .catch((error) => console.error(error));
    }
  };

  const MessageAuthorization = (data) => {
    if (messageExists.current == false) {
      setAuthorization(false);
    } else if (data !== "Not Invited" || token["is-admin"] === "true") {
      setAuthorization(true);
    } else {
      setAuthorization(false);
    }
  };

  const deleteMessage = (messageID) => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/messages/${messageID}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then(() => (window.location.href = "/UserHub/Admin/"))
      .catch((error) => console.error(error));
  };

  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>Message</UserHubPageTitle>
      <div className="ReplyContentSection">
        <BackToHome />
        <div className="MessagesReplyForm">
          {!authorization ? (
            <div className="NoInviteMessageContainer">
              {loading ? (
                <div className="SpinnerContainer">
                  <div className="spinner-border" />
                </div>
              ) : (
                <div className="NoInviteInner">
                  <h3>
                    Error: Message has either been deleted or you do not have
                    the permissions to view this message.
                  </h3>
                  <ButtonStyling
                    OtherPages
                    onClick={() => {
                      window.location.href = "/UserHub/Messages";
                    }}
                  >
                    Go Back
                  </ButtonStyling>
                </div>
              )}
            </div>
          ) : (
            <div className="InvitedContentSection">
              {loading ? (
                <div className="SpinnerContainer">
                  <div className="spinner-border" />
                </div>
              ) : (
                <div className="MessageReplysContainer">
                  <div className="InviteUser">
                    <div className="InviteUserContainer">
                      <div class="input-group mb-3">
                        <input
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
                      {inviteMessage.message == "Account does not exist" ? (
                        <div>
                          <p className="InviteUserErrorMessage">
                            * {inviteMessage.message}
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <table className="ReplyTable">
                    <thead>
                      <tr>
                        <th>{message.title}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div>{message.date_created}</div>
                          <div>
                            {message.description}{" "}
                            <a
                              href="#/"
                              className="link"
                              onClick={() => {
                                window.open(`${message.url}`, "_blank");
                                setMessageID();
                              }}
                            >
                              {message.url}
                            </a>
                          </div>
                          <hr />
                          <div>{message.author}</div>
                        </td>
                      </tr>
                    </tbody>
                    {replys.map((reply) => {
                      return (
                        <tbody key={reply.id}>
                          <tr>
                            <td>
                              <div>{reply.date_created}</div>
                              <div>{reply.content}</div>
                              <hr />
                              <div className="AuthorReplyContainer">
                                <div>{reply.username}</div>
                                {reply.user_id == userId["user-id"] ||
                                token["is-admin"] == "true" ? (
                                  <DeleteIconContainer>
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      onClick={(e) =>
                                        window.confirm(
                                          "Are you sure you wish to delete this reply?"
                                        ) && deleteReply(reply.id)
                                      }
                                    />
                                  </DeleteIconContainer>
                                ) : (
                                  ""
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                  <div className="TextAreaContainer">
                    <textarea
                      className="ReplyTextBox"
                      rows="5"
                      form="ReplyForm"
                      name="Reply"
                      onChange={changeHandler}
                    />
                  </div>
                  <form
                    className="ReplyForm"
                    name="ReplyForm"
                    onSubmit={submitHandler}
                  >
                    {emptyContent ? (
                      <ButtonEmpty>New Reply</ButtonEmpty>
                    ) : (
                      <ButtonStyling OtherPages type="submit">
                        New Reply
                      </ButtonStyling>
                    )}
                  </form>
                  {token["is-admin"] == "true" ? (
                    <>
                      <div className="ViewMessageAdmin">
                        <h1 className="TitleAdmin">Admin</h1>
                        <ButtonStyling
                          onClick={(e) =>
                            window.confirm(
                              "Are you sure you wish to delete this message? The message will be deleted for both users."
                            ) && deleteMessage(messageId)
                          }
                        >
                          Delete Message
                        </ButtonStyling>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </UserContainer>
  );
}
