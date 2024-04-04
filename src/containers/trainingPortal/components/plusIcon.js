/*
Creating the plus icon component.

Author: Lawrence Valerio
Date: 01/22/2021
Update Date:
*/

import React from "react";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ArrowContainer = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(113, 113, 113, 0.48);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid transparent;
  transition: all 250ms ease-in-out;
  cursor: pointer;
`;

const ArrowIcon = styled.div`
  color: #fff;
  font-size: 18px;
`;

export function PlusIcon() {
  return (
    <ArrowContainer>
      <ArrowIcon>
        <FontAwesomeIcon icon={faPlus} />
      </ArrowIcon>
    </ArrowContainer>
  );
}
