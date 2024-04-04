/*
Creating the up arrow component.

Author: Lawrence Valerio
Date: 01/21/2021
Update Date:
*/

import React from "react";
import styled from "styled-components";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ArrowContainer = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: rgba(113, 113, 113, 0.48);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid transparent;
  transition: all 250ms ease-in-out;
  &:hover {
    border: 2px solid #f3890d;
  }
  cursor: pointer;
`;

const ArrowIcon = styled.div`
  margin-top: 0px;
  color: #fff;
  font-size: 30px;
`;

export function UpArrow() {
  return (
    <ArrowContainer>
      <ArrowIcon>
        <FontAwesomeIcon icon={faAngleUp} />
      </ArrowIcon>
    </ArrowContainer>
  );
}
