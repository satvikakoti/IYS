/**
 *
 * AllVideos.js: Component to layout the all videos page of admin tab
 *
 * Lawrence Valerio
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
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StylingDeleteIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

/**
 * Component to layout all videos in one page for admins
 * @returns All videos page of admin tab
 */
export function AllVideos() {
  const [token] = useCookies(["user-token"]);
  const [loading, setLoading] = useState(true);
  const [allVideos, setAllVideos] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [filterValue, setFilterValue] = useState("");

  const search = (data) => {
    return data.filter(
      (data) =>
        data.title.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
        data.author.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
    );
  };

  //Implementing pagination.
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(search(allVideos).length / usersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayVideos = search(allVideos)
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .map((videos) => {
      return (
        <tbody key={videos.id}>
          <tr>
            <td>
              <Link to={"/UserHub/Admin/View_Video/" + videos.id}>
                {videos.title}
              </Link>
            </td>
            <td className="DateCreatedColumn">
              {videos.author}
              <span>
                <StylingDeleteIcon
                  icon={faTrashAlt}
                  onClick={(e) => deleteFromS3(videos.url, videos.id)}
                />
              </span>
            </td>
          </tr>
        </tbody>
      );
    });

  function deleteFromS3(url, id) {
    if (
      window.confirm(
        "Are you sure you wish to delete this Video? The video will be deleted for all users."
      )
    ) {
      // get the key for the bucket object from
      // the end of the stored url of selected file
      const bucketKey = url.slice(-32);

      // delete video from the s3 bucket by passing the key
      // for the bucket object to the server to run deletion
      fetch(`${process.env.REACT_APP_API_URL}/IYS/Home/downloadURL/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
        // pass the bucket key corresponding with file to be deleted
        body: JSON.stringify({ keyString: bucketKey }),
      })
        .then(deleteFromAPI(id))
        .catch((error) => console.error(error));
    }
  }

  function deleteFromAPI(id) {
    // delete video from the api
    fetch(`${process.env.REACT_APP_API_URL}/IYS/videos/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then(() => window.location.reload())
      .catch((error) => console.error(error));
  }

  /**
   * Returns to userhub page if user is not admin.
   */
  if (token["is-admin"] === "false") {
    window.location.href = "/UserHub/";
  }

  /**
   * Fetches video information.
   */
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/videos/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setAllVideos(data);
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
            <div className="AllVideosTableContainer AdminPages">
              <div className="TitleSearchContainer">
                <h1>All Videos</h1>
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
              <table className="AllVideosTable">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                  </tr>
                </thead>
                {displayVideos}
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
