/* 
The title component of each page in the userhub tab

Author: Symon Kurt San Jose
Date: 02/11/2021
Update Date: 
*/

import styled from "styled-components";

export const UserHubPageTitle = styled.h2`
  color: black;
  margin: 0;
  border-top: 1px solid #eaeaea;
  box-shadow: 0px 10px 8px rgba(50, 50, 50, 0.1);
  z-index: 0;
  width: 100%;
  line-height: 80px;
  padding-left: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 812px) {
    line-height: 80px;
  }
`;
