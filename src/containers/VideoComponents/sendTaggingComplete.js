/**
 * sendTaggedVideo.js: Component that is responsible for email submission
 *
 * Michelle Peters
 *
 *
 * Date Created: 11/29/2020
 * Last Updated: 11/20/2020
 */

import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "../User/css/WatchVideo.css";

export default function SendTaggingComplete(props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [tagger2Complete] = useState(true);
  const [token] = useCookies(["user-token"]);
  const requestData = { tagger2Complete };
  const [message, setMessages] = useState([]);
  const TagCountError = useRef(true);

  if (props.tagData.length == props.markerData.length) {
    TagCountError.current = false;
  } else {
    TagCountError.current = true;
  }

  function CloseModal() {
    setModalIsOpen(false);
  }

  /**
   * sends an email to the video owner to
   * notify the video has been tagged
   * @param {*} e
   */
  const sendLink = (e) => {
    e.preventDefault();
    getInitialTaggerEmail();
  };

  /**
   * Get the initial tagger's email address associated
   * with the videos first tagger's user id
   *
   * Michelle Peters
   */
  const getInitialTaggerEmail = () => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/users/${props.tagger1}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setEmail(data.username);
      })
      .catch((error) => alert(error));
  };

  /**
   * Send a confirmation email to the first tagger
   * that video tagging has been completed, then
   * update the video model to record that the video
   * has been tagged
   *
   * Michelle Peters
   */

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/messages/video_message/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
      body: JSON.stringify({ videoId: props.videoId }),
    })
      .then((data) => data.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => console.error(error));

    if (email != "") {
      // send email
      fetch(
        `${process.env.REACT_APP_API_URL}/IYS/messages/${message[0].id}/reply_confirmation/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token["user-token"]}`,
          },
          body: JSON.stringify({ email: email }),
        }
      ).catch((error) => console.error(error));

      fetch(
        `${process.env.REACT_APP_API_URL}/IYS/Home/sendConfirmationEmail/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        }
      )
        .then(() => {
          alert("Confirmation has been sent to the video owner");
        })
        .catch((error) => console.error(error));

      // update video model to show second tagger has
      // completed tagging
      fetch(`${process.env.REACT_APP_API_URL}/IYS/videos/${props.videoId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
        body: JSON.stringify(requestData),
      })
        .then(
          () =>
            (window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/UserHub`)
        )
        .catch((error) => console.error(error));
    }
  }, [email]);

  /**
   * Return the send email form
   */
  return (
    <div>
      <button class="secondary-button" onClick={() => setModalIsOpen(true)}>
        Finished Tagging
      </button>
      <Modal
        open={modalIsOpen}
        onClose={CloseModal}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
      >
        <div className="finished-tagging">
          <h3>Are you sure you're finished tagging the video?</h3>
          <h3>
            By clicking "Yes", the original tagger will be notified that the
            video tagging has been completed.
          </h3>
          {TagCountError.current == true ? (
            <p className="TagCountError">
              * You must tag all untagged markers to continue.
            </p>
          ) : null}
          <button disabled={TagCountError.current} onClick={sendLink}>
            Yes, send link
          </button>
          <button onClick={() => setModalIsOpen(false)}>
            No, continue tagging
          </button>
        </div>
      </Modal>
    </div>
  );
}
