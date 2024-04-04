/**
 *
 * AllUsers.js: Component to layout the all users page of admin tab
 *
 * Lawrence Valerio
 *
 * Date: 03/15/2021
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
 * Component to layout all users in one page for admins
 * @returns All users page of admin tab
 */
export function AllUsers(props) {
  const [token] = useCookies(["user-token"]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [filterValue, setFilterValue] = useState("");

  const search = (data) => {
    return data.filter(
      (data) =>
        data.username.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
        data.first_name.toLowerCase().indexOf(filterValue.toLowerCase()) !==
          -1 ||
        data.last_name.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
    );
  };

  //Implementing pagination.
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(search(allUsers).length / usersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayUsers = search(allUsers)
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .map((users) => {
      return (
        <tbody key={users.id}>
          <tr>
            <td>
              <Link to={"/UserHub/Admin/View_User/" + users.id}>
                {users.username}
              </Link>
            </td>
            <td>{users.first_name}</td>
            <td>{users.last_name}</td>
          </tr>
        </tbody>
      );
    });

  /**
   * Returns to userhub page if user is not admin.
   */
  if (token["is-admin"] === "false") {
    window.location.href = "/UserHub/";
  }

  /**
   * Fetches all the users.
   */
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/users/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setAllUsers(data);
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
          {loading === true ? (
            <>
              <div className="SpinnerContainer">
                <div className="spinner-border" />
              </div>
            </>
          ) : (
            <div className="AllUsersTableContainer">
              <div className="AllUsersInner AdminPages">
                <div className="TitleSearchContainer">
                  <h1>All Users</h1>
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
                <table className="AllUsersTable">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                    </tr>
                  </thead>
                  {displayUsers}
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
            </div>
          )}
        </div>
      </div>
    </UserContainer>
  );
}
