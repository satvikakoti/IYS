/**
 *
 * AllMessages.js: Component to layout the all messages page of admin tab
 *
 * Lawrence Valerio, Symon Kurt San Jose
 *
 * Date: 03/22/2021
 * Update Date: 04/13/2021
 */

import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import "./Admin.css";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import { UserHubPageTitle } from "../generalComponents/UserHubPageTitle";
import { BackToHome } from "../generalComponents/BackToHome";

const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * Component to layout all messages in one page for admins
 * @returns All messages page of admin tab
 */
export function AllMessages() {
  const [token] = useCookies(["user-token"]);
  const [loading, setLoading] = useState(true);
  const [userMessages, setUserMessages] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [filterValue, setFilterValue] = useState("");

  const search = (data) => {
    return data.filter(
      (data) =>
        data.title.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
        data.receiver_email.toLowerCase().indexOf(filterValue.toLowerCase()) !==
          -1
    );
  };

  /**
   * Returns to userhub page if user is not admin.
   */
  if (token["is-admin"] === "false") {
    window.location.href = "/UserHub/";
  }

  //Implementing pagination.
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(search(userMessages).length / usersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayMessages = search(userMessages)
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .map((messages) => {
      return (
        <tbody key={messages.id}>
          <tr>
            <td>
              <Link to={"/UserHub/View_Message/" + messages.id}>
                {messages.title}
              </Link>
            </td>
            <td>{messages.author}</td>
          </tr>
        </tbody>
      );
    });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setUserMessages(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>Administration</UserHubPageTitle>
      <div className="AdminHubContainer">
        <BackToHome />
        <div className="AdminHubForm">
          {loading ? (
            <>
              <div className="SpinnerContainer">
                <div className="spinner-border" />
              </div>
            </>
          ) : (
            <div className="AllMessagesTableContainer AdminPages">
              <div className="TitleSearchContainer">
                <h1>All Messages</h1>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">
                      <i class="fa fa-search"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  />
                </div>
              </div>
              <table className="AllMessagesTable">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                  </tr>
                </thead>
                {displayMessages}
              </table>
              <div className="PaginationContainer">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName={"paginationBttns"}
                  previousLinkClassName={"previousBttn"}
                  nextLinkClassName={"nextBttn"}
                  disabledClassName={"paginationDisabled"}
                  activeClassName={"paginationActive"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </UserContainer>
  );
}
