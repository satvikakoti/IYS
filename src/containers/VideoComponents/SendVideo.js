/**
 * sendTaggedVideo.js: Component that is responsible for email submission
 *
 * Michelle Peters
 *
 *
 * Date Created: 11/19/2020
 * Last Updated: 11/24/2020
 */

import React, { useEffect, useState, useRef } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useCookies } from "react-cookie";
import "../User/css/WatchVideo.css";

// A constant that provides email validation through regular expression
const emailRegex = RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

export default function SendTaggedVideo({ videoId }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [invite_email, setInviteEmail] = useState("");
  const [url] = useState(window.location.href);
  const [tagger2, setTagger2] = useState();
  const [tagger1Complete] = useState(true);
  const [token] = useCookies(["user-token"]);
  const requestData = { tagger2, tagger1Complete };
  const [validEmail, setValidEmail] = useState(true);
  const [validInviteEmail, setValidInviteEmail] = useState(true);

  function CloseModal() {
    setModalIsOpen(false);
  }

  /**
   * sends a message to the address entered
   */
  var my_email = ""
  const sendLink = (my_email) => {
    console.log(url);
    if (validEmail == true) {
      fetch(`${process.env.REACT_APP_API_URL}/IYS/Home/sendEmail/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: my_email, url: url }),
      }).catch((error) => console.error(error));

      fetch(`${process.env.REACT_APP_API_URL}/IYS/messages/send_video/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
        body: JSON.stringify({ email: my_email, url: url, videoID: videoId }),
      })
        .then(alert("A link to this video has been sent"))
        .catch((error) => console.error(error));
    } else {
      alert(
        "Sorry, your request could not be completed. Please make sure the email you have entered belongs to an In Your Shoes users account."
      );
    }
  };

  /**
   * gets the user id associated with the
   * email address entered in form
   *
   * Michelle Peters
   */
  const getSecondaryTaggerId = (e) => {
    e.preventDefault();
    console.log(email);
    if (email !== "") {
      fetch(
        `${process.env.REACT_APP_API_URL}/IYS/Home/api/user_email/${email}/`,
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
          if (data.message == "User with given email does not exist") {
            setValidEmail(false);
          } else {
            sendLink(email);
            setTagger2(data.id);
          }
        })
        .catch((error) => console.error(error));
    }
  };
  const inviteUser = (e) => {
    e.preventDefault();
    console.log(invite_email);
    if (invite_email !== "") {
      fetch(
        `${process.env.REACT_APP_API_URL}/IYS/Home/api/user_email/${invite_email}/`,
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
          if (data.message == "User with given email does not exist") {
            setValidInviteEmail(false);
          } else {
            sendLink(invite_email);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  /**
   * update the video model to set the second
   * tagger associated with the video,
   * then return to userhub
   *
   * Michelle Peters
   */
  useEffect(() => {
    if (tagger2 === parseInt(tagger2, 10)) {
      // set second tagger
      fetch(`${process.env.REACT_APP_API_URL}/IYS/videos/${videoId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
        body: JSON.stringify(requestData),
      })
        .then(() => {
          window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/userhub`;
        })
        .catch((error) => console.error(error));
    }
  }, [tagger2]);

  /**
   * Handle and set email change
   * @param {*} e
   */
  const change = (e) => {
    setEmail(e.target.value);
    setValidEmail(emailRegex.test(e.target.value) ? true : false);
  };

  const invite_change = (e) =>{
      setInviteEmail(e.target.value);
    setValidInviteEmail(emailRegex.test(e.target.value) ? true : false);
  };

  const handleClick = (e) => {
      getSecondaryTaggerId(e);
      inviteUser(e);
//      console.log(email);
//      console.log(invite_email);
   };

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
            If so, please enter the email address of the user you would like to
            tag the video next.
          </h3>
          <h3>
            By clicking "Yes, send link", a message will be sent to them with a
            link to this video.
          </h3>
        </div>
        <form className="finished-tagging">
          <input name="email" type="email" value={email} onChange={change}/>
          <br />
          {!validEmail ? (
            <div className="errorMessage">Please enter a valid email</div>
          ) : (
            ""
          )}
          <input name="invite_email" type="email" value={invite_email} onChange={invite_change}/>
          <br />
          {!validInviteEmail ? (
            <div className="errorMessage">Please enter a valid email</div>
          ) : (
            ""
          )}

          <button onClick={handleClick}>Yes, send link</button>
          <button onClick={() => setModalIsOpen(false)}>
            No, continue tagging
          </button>
        </form>
      </Modal>
    </div>
  );
}
