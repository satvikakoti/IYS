import React from "react"
import styled from "styled-components";
import { StepCard } from "./stepCard";

import image1 from "./../images/section2_1.png"
import image2 from "./../images/section2_2.png"
import image3 from "./../images/section2_3.png"

const ContentDiv = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const Line = styled.div`
  background-color: #BDBDBD;
  height: 1px;
  width: 90%;
  margin-top: 25px;
  margin-bottom: 25px;

  @media only screen and (max-width: 812px) {
    width: 100%;
  }
`;

export function Section2 () {
    return (
        <ContentDiv>
            <p>
                As a guest, operating the site will offer little access to the application's services. In order to access In Your Shoes' basic functions, 
                you first must sign up and log in a new account on the website.
            </p>
            <Line />
            <StepCard image={image1} text="To access the application's full functionality, you must log in to your account by clicking the 'Log In' button near the top of the screen"/>
            <Line />
            <StepCard image={image2} text="In the small window that pops up after pressing the 'Log In' tab, you can either log in using an existing account, or sign up by pressing the 'Sign Up' button"/>
            <Line />
            <StepCard image={image3} text="When the small window changes to the sign up window, you can now enter information to make an account."/>
        </ContentDiv>
    )
}