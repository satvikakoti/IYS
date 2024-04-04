/* 
Creating the file download components of the accordion

Author: Lawrence Valerio
Date: 01/22/2021
Update Date: 
*/

import React from "react";
import styled from "styled-components";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FileContainer = styled.div`
  display: flex;
  align-items: baseline;
  margin: 0px auto;
  justify-content: ${(props) => (props.noLine ? "center" : "")};
  text-decoration: ${(props) =>
    props.noLine ? "none" : "underline"} !important;
  margin: ${(props) => (props.noLine ? "0" : "10px 0px 0px 20px")} !important;
`;

const FileIcon = styled.div`
  font-size: 30px;
  cursor: pointer;
  display: inline;
  text-decoration: inherit;

  @media screen and (max-width: 456px) {
    font-size: 18px;
  }
`;

const LinkStyling = styled.a`
  color: #2f2f2f;
  display: inline;
  text-decoration: inherit;
`;

export const FileDownload = ({ link, description, ...props }) => {
  return (
    <FileContainer {...props}>
      <FileIcon>
        <FontAwesomeIcon
          icon={faFileDownload}
          onClick={() => {
            window.location.href = link;
          }}
        />
      </FileIcon>
      <LinkStyling href={link} target="_blank">
        {description}
      </LinkStyling>
    </FileContainer>
  );
};
