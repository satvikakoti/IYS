import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const ArrowContainer = styled.div`
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background-color: #2f2f2f;
  display: inline-block;
  border: 2px solid transparent;
  transition: all 250ms ease-in-out;
  cursor: pointer;
  margin: 0px 0px 0px 10px;
`;

const ArrowIcon = styled.div`
  color: #fff;
  font-size: 18px;
  margin: none;
`;

export function ExclamationCircle() {
  return (
    <ArrowContainer>
      <ArrowIcon>
        <FontAwesomeIcon icon={faExclamationCircle} />
      </ArrowIcon>
    </ArrowContainer>
  );
}