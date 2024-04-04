import React from "react"
import styled from "styled-components";
import { StepTile } from "./stepTile";

const ContentDiv = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const StepBox = styled.div`
  margin: 1rem 0rem;
`;

export function Section1 () {
    return (
        <ContentDiv>
          <p>Based on our research, we recommend that you take the following eight steps or choose to watch the video to build perspective-taking skills</p>
          <video src="https://iys-storage.s3.us-east-2.amazonaws.com/IYS+explanation.mp4" preload="auto" controls className="mx-md-0 mx-auto" style={{ width: "68%" }}></video>
          <StepBox>
            <StepTile 
              number="One" 
              title="Read the Opening Statement" 
              time="15 to 20 minutes" 
              content="To introduce you to empathy and the different dimensions of empathy" 
              pdfLink={["https://iys-storage.s3.us-east-2.amazonaws.com/What_is_cognitive_empathy.pdf"]} 
              pdfName={["What is Cognitive Empathy"]}
            />
            <StepTile 
              number="Two" 
              title="Read the Introduction" 
              time="3 to 5 minutes" 
              content="To introduce you to empathy and the different dimensions of empathy" 
              pdfLink={["https://iys-storage.s3.us-east-2.amazonaws.com/Introduction.pdf"]} 
              pdfName={["Introduction"]}
            />
            <StepTile 
              number="Three" 
              title="Realize there are different viewpoints" 
              time="5 minutes" 
              content="To help you realize that you and your dialogue partner may have different ways of looking at the situation" 
              pdfLink={["https://iys-storage.s3.us-east-2.amazonaws.com/Understanding_peoples_viewpoints.pdf"]} 
              pdfName={["Understanding People's Viewpoints"]}
            />
            <StepTile 
              number="Four" 
              title="Learn Perspective Taking" 
              time="2 to 3 minutes" 
              content="To understand the perspective-taking technique that you will use in this application" 
              pdfLink={["https://iys-storage.s3.us-east-2.amazonaws.com/What_is_Perspective-Taking.pdf"]} 
              pdfName={["What is Perspective Taking?"]}
            />
            <StepTile 
              number="Five" 
              title="Practice perspective taking" 
              time="5 minutes" 
              content="To practice perspective-taking by looking at a behavior or attitude that you have trouble understanding" 
              pdfLink={["https://iys-storage.s3.us-east-2.amazonaws.com/Practice_perspective_taking.pdf"]} 
              pdfName={["Practice perspective taking"]}
            />
            <StepTile 
              number="Six" 
              title="Practice perspective-taking over the next two weeks" 
              time="5 to 10 minutes" 
              content="To provide instructions on how to practice perspective-taking over two weeks" 
              pdfLink={["https://iys-storage.s3.us-east-2.amazonaws.com/2Week_Practice_Instructions.pdf", "https://iys-storage.s3.us-east-2.amazonaws.com/2Week_Practice_Sheet.pdf"]} 
              pdfName={["Two Weeks Practice Instructions", "Practice Sheet"]}
            />
            <StepTile 
              number="Seven" 
              title="Video-record a 10-minute dialogue and perspective-taking task" 
              time="5 to 10 minutes" 
              content="To provide instructions on how to engage and capture a 10 minute dialogue with your dialogue partner" 
              pdfLink={["https://iys-storage.s3.us-east-2.amazonaws.com/Video-record_a_10-minute_dialogue_and_perspective-taking.pdf", "https://iys-storage.s3.us-east-2.amazonaws.com/User_Instructions_for_Video-Recoded_Dialogue_with_Dialogue_Partner.pdf", "https://iys-storage.s3.us-east-2.amazonaws.com/Video_Analysis_Task_of_Your_Video-Recorded_Dialogue.pdf"]} 
              pdfName={["Video-record a 10-minute dialogue and perspective-taking", "User Instructions for Video-Recoded Dialogue with Dialogue Partner", "Video-Analysis Task of your Video-Recorded Dialogue"]}
            />
            <StepTile 
              number="Eight" 
              title="Hand calculate your perceptual accuracy score" 
              time="10 to 15 minutes" 
              content="To provide instructions on how to hand calculate your perceptual accuracy score" 
              pdfLink={["https://iys-storage.s3.us-east-2.amazonaws.com/Hand_Calculate_Your_Perceptual_Accuracy_Score.pdf"]} 
              pdfName={["Hand Calculate Your Perceptual Accuracy Score"]}
            />
          </StepBox>
        </ContentDiv>
    )
}