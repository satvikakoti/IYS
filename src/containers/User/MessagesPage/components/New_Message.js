import React, { useState, useRef } from "react";
import "../Messages.css";
import { Button } from "../../../Navbar/components/button";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const StylingButton = styled(Button)`
  margin-top: 0px;
`;

export function New_Message(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recepient, setRecepient] = useState("");
  const [allRecepients, setAllRecepients] = useState([]);
  const [token] = useCookies(["user-token"]);
  const [emptyContent, setEmptyContent] = useState(false);
  const empty = useRef(false);

  const emptyContentCheck = (values) => {
    if (values.length == 0) {
      empty.current = true;
      setEmptyContent(true);
    } else {
      empty.current = false;
      setEmptyContent(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    emptyContentCheck(allRecepients);
    if (empty.current == false)
      fetch(`${process.env.REACT_APP_API_URL}/IYS/messages/new_message/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
        body: JSON.stringify({
          receiver: allRecepients.join(","),
          description: description,
          title: title,
        }),
      })
        .then(() => (window.location.href = "/UserHub/Messages"))
        .catch((error) => console.error(error));
  };

  const AddRecepient = (e) => {
    e.preventDefault();
    let current = [...allRecepients, recepient];
    emptyContentCheck(current);
    setAllRecepients([...allRecepients, recepient]);
  };

  const RemoveRecepient = (index, e) => {
    e.preventDefault();
    const RemoveItem = allRecepients.filter((_, i) => i !== index);
    emptyContentCheck(RemoveItem);
    setAllRecepients(RemoveItem);
  };

  return (
    <div className="New_MessageContainer">
      <div className="FormContainer">
        <form
          id="NewMessageForm"
          className="NewMessageForm"
          onSubmit={submitHandler}
        >
          <div className="RecepientInputContainer">
            <label htmlFor="recepient">Recipient</label>
            <div className="input-group mb-3">
              <input
                id="recepient"
                type="text"
                className="form-control"
                placeholder="example@gmail.com"
                aria-label="Search"
                aria-describedby="basic-addon1"
                value={recepient}
                onChange={(e) => setRecepient(e.target.value)}
              ></input>
              <div className="input-group-prepend">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={AddRecepient}
                >
                  Add
                </button>
              </div>
            </div>
            {empty.current == true ? (
              <div>
                <p className="RecipientErrorMessage">
                  * Please add a recipient.
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlInput1">Title</label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlTextarea1">Description</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="ButtonContainer">
            <Link className="NewMessageBtn" to={"New_Message"}>
              <StylingButton OtherPages onClick={submitHandler}>
                New Message
              </StylingButton>
            </Link>
          </div>
        </form>
        <div className="RecipientContainer">
          <div className="RecepientTitle">
            <h4>Recipients</h4>
          </div>
          <div className="RecepientList">
            {allRecepients.map((recepient, index) => {
              return (
                <ul key={index} className="RecepientUl">
                  <li className="RecepientLi">
                    {recepient}{" "}
                    <span>
                      <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={(e) => RemoveRecepient(index, e)}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </span>
                  </li>
                </ul>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
