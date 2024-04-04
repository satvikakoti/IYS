import React, { useState } from "react";
import styled from "styled-components";

const PopUpContainer = styled.dfn`
    display: block;
    position: absolute;
    min-width: 290px;
    max-width: 340px;
    height: 100%
    min-height: 50%;
    max-height: 300px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.85);
    word-wrap: break-word;
    font-style: normal;
    top: auto;
    left: 0px;
    overflow: hidden;
    background: white;
    border-radius: 5px;
    padding: 10px;
    z-index: 1337;
    font-size: 13px;
    color: black;

    @media screen and (max-width: 812px) {
        left: 0;
        right: 0;
        margin: auto;
        max-width: 290px;
      }
`;

const PopUp = styled.dfn`
  display: inline-block;
  position: relative;

  @media screen and (max-width: 812px) {
    position: static;
  }
`;

export const PopUpDefinition = ({ word, definition }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PopUp>
      <dfn
        title={definition}
        style={{
          display: "inline",
          color: "#007bff",
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {word}
      </dfn>
      {isOpen ? (
        <PopUpContainer>
          <i
            className="fas fa-times"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            style={{
              display: "block",
              float: "right",
              fontSize: "18px",
              cursor: "pointer",
              margin: "0",
            }}
          />
          {definition}
        </PopUpContainer>
      ) : (
        ""
      )}
    </PopUp>
  );
};
