import React from "react"
import styled from "styled-components";
import { StepCard } from "./stepCard";

import image1 from "./../images/section5_1.png"

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

export function Section5 () {
    return (
        <ContentDiv>
            <StepCard image={image1} text="After clicking the 'Upload a Video' button, this is where you can upload your video to begin tagging it. You must include a title before uploading the video and the video must be an '.mp4' file"/>
            <Line />
            <p style={{ color: "black" }}>After uploading the video, it will be available for tagging right away in the "My Videos" tab. In the untagged section, clicking on the title of a video of your choice allows you to tag the video.</p>
            <Line />
            <h5 style={{ color: "black", fontWeight: "bold" }}>View your videos</h5>
            <StepCard image={image1} text="To view all the videos that you have uploaded so far in the website, you can view them all in the hub for quick access. To view them all in one page, You must click on the 'Videos' button inside the module."/>
        </ContentDiv>
    )
}