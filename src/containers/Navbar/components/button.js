/*
Creating the button component.

Author: Lawrence Valerio
Date: 01/21/2021
Update Date: 01/25/2021
*/

import React from "react";
import styled from "styled-components";

const ButtonStyle = styled.button`
  background-color: #f3890d;
  height: ${({ small }) => (small ? "35px" : "45px")};
  width: ${({ small }) => (small ? "78px" : "130px")};
  color: #fff;
  border-radius: ${({ small }) => (small ? "60px" : "50px")};
  outline: none;
  border: 2px transparent;
  font-size: ${({ small }) => (small ? "15px" : "15px")};
  cursor: pointer;
  font-weight: bold;
  transition: all 200ms ease-in-out;
  padding: 0px;
  margin: 0px;
  &:hover {
    border: ${({ small }) =>
      small ? "1px solid #f3890d" : "2px solid #f3890d"};
    background-color: transparent;
    color: ${({ OtherPages }) => (OtherPages ? "#F3890D" : "#fff")};
  }
`;

export function Button(props) {
  return <ButtonStyle {...props}>{props.children}</ButtonStyle>;
}
