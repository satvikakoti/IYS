/* 
Creating the contents of the accordion

Author: Lawrence Valerio
Date: 01/22/2021
Update Date: 
*/

import React, { useState } from "react";
import styled from "styled-components";
import { HashLink } from "react-router-hash-link";
import { FileDownload } from "../../generalComponents/fileDownload";

import Img1 from "../../images/logIn.png";
import Img2 from "../../images/LoginModal.png";
import Img3 from "../../images/SignupModal.png";
import Img4 from "../../images/UserHubTab.png";
import Img5 from "../../images/UserHub.png";
import Img6 from "../../images/UserProfile.png";
import Img7 from "../../images/UploadAVideo.png";
import Img8 from "../../images/MyVideos.png";
import ReactPlayer from "react-player";
import "./Player.css";

const ContentContainer = styled.div`
  padding-left: 40px;
  max-width: 100%;
  padding-bottom: 30px;
  font-size: 16px;

  @media screen and (max-width: 812px) {
    font-size: 15px;
    padding-left: 20px;
  }

  @media screen and (max-width: 456px) {
    font-size: 12px;
  }
`;

const ContentDescription = styled.div`
  ${({ title }) => {
    if (title) {
      return `
        cursor: pointer;
        font-weight: bold;
        padding: 5px 5px;
        margin: 20px 0px 0px 0px;
        border-bottom: 1px solid #ccc !important;

        & > i {
          margin-right:10px;
        }
      `;
    } else {
      return `
        font-weight: normal;
        background-color: transparent;
        padding: 0px;
        margin: 20px 0px 20px 20px;
      `;
    }
  }}

  @media screen and (max-width: 812px) {
    font-size: 14px;

    ${({ title }) => {
      if (title) {
        return `padding: 5px 10px;`;
      } else {
        return `padding: 0px;`;
      }
    }}
  }

  @media screen and (max-width: 456px) {
    font-size: 12px;
  }
`;

const ContentParagraph = styled.p`
  font-weight: normal;
  font-size: inherit;
  white-space: pre-line;
  background-color: transparent;
  margin: 10px 0px 0px 20px;

  @media screen and (max-width: 812px) {
    font-size: 14px;
  }

  @media screen and (max-width: 456px) {
    font-size: 12px;
  }
`;

const WideImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  padding: 10px 30% 10px 20px;
  background-color: #eaeaea;
  border-left: 5px solid #007bff;

  @media screen and (max-width: 812px) {
    width: 90%;
    height: 90%;
    padding: 5px 10px;
  }
`;

const Anchur = styled.a`
  width: 70%;
  font-size: 20px;
  font-family: "Roboto", sans-serif;
  display: inline;

  @media screen and (max-width: 812px) {
    font-size: 15px;
  }
`;

export function Content1(props) {
  // instruction steps array
  const [instructionSteps, setInstructionSteps] = useState([
    {
      title: `Step 1: Read the Opening Statement (15 to 20 minutes)`,
      description: `To introduce you to empathy and the
      different dimensions of empathy.`,
      download: [
        {
          instruction: `• Open or download the pdf worksheet`,
          instructionName: ``,
          link:
            "https://iys-storage.s3.us-east-2.amazonaws.com/What_is_cognitive_empathy.pdf",
          linkDescription: "What is Cognitive Empathy.pdf",
        },
      ],
      stepShown: false,
    },
    {
      title: `Step 2: Read the Introduction (3 to 5 minutes)`,
      description: `To introduce you to a different way of
      looking another person’s viewpoint to enhance your perceptual
      understanding.`,
      download: [
        {
          instruction: `• Open or download the pdf worksheet`,
          instructionName: ``,
          link:
            "https://iys-storage.s3.us-east-2.amazonaws.com/Introduction.pdf",
          linkDescription: "Introduction.pdf",
        },
      ],
      stepShown: false,
    },
    {
      title: `Step 3: Realize there are different viewpoints (5 minutes)`,
      description: `To help you realize that you and your
      dialogue partner may have different ways of looking at the situation.`,
      download: [
        {
          instruction: `• Open or download the pdf worksheet`,
          instructionName: ``,
          link:
            "https://iys-storage.s3.us-east-2.amazonaws.com/Understanding_peoples_viewpoints.pdf",
          linkDescription: "Understanding People's Viewpoints.pdf",
        },
      ],
      stepShown: false,
    },
    {
      title: `Step 4: Learn Perspective-Taking (2 to 3 minutes)`,
      description: `To understand the perspective-taking technique
      that you will use in this application.`,
      download: [
        {
          instruction: `• Open or download the pdf worksheet`,
          instructionName: ``,
          link:
            "https://iys-storage.s3.us-east-2.amazonaws.com/What_is_Perspective-Taking.pdf",
          linkDescription: "What is Perspective-Taking.pdf",
        },
      ],
      stepShown: false,
    },
    {
      title: `Step 5: Practice perspective-taking (5 minutes)`,
      description: `To practice perspective-taking by looking at
      a behavior or attitude that you have trouble understanding.`,
      download: [
        {
          instruction: `• Open or download the pdf worksheet`,
          instructionName: ``,
          link:
            "https://iys-storage.s3.us-east-2.amazonaws.com/Practice_perspective_taking.pdf",
          linkDescription: "Practice perspective-taking.pdf",
        },
      ],
      stepShown: false,
    },
    {
      title: `Step 6: Practice perspective-taking over the next two weeks (5 to 10
        minutes)`,
      description: `To provide instructions on how to practice
      perspective-taking over two weeks.`,
      download: [
        {
          instruction: `• Open or download instructions for the Practice Exercise`,
          instructionName: ``,
          link:
            "https://iys-storage.s3.us-east-2.amazonaws.com/2Week_Practice_Instructions.pdf",
          linkDescription: "Two Weeks Practice Instructions.pdf",
        },
        {
          instruction: `• Open or download the practice sheet`,
          instructionName: ``,
          link:
            "https://iys-storage.s3.us-east-2.amazonaws.com/2Week_Practice_Sheet.pdf",
          linkDescription: "Practice Sheet.pdf",
        },
      ],
      stepShown: false,
    },
    {
      title: `Step 7: Video-record a 10-minute dialogue and perspective-taking task (5
        to 10 minutes)`,
      description: `To provide instructions on how to engage and
      capture a 10 minute dialogue with your dialogue partner.`,
      download: [
        {
          instruction: `Open or download the pdf worksheet called `,
          instructionName: `Video-record a 10-minute dialogue and perspective-taking task`,
          link:
            "https://iys-storage.s3.us-east-2.amazonaws.com/Video-record_a_10-minute_dialogue_and_perspective-taking.pdf",
          linkDescription:
            "Video-record a 10-minute dialogue and perspective-taking.pdf",
        },
        {
          instruction: `Open or download the pdf worksheet called `,
          instructionName: `User Instructions for Video-Recorded Dialogue with a Dialogue
          partner`,
          link:
            "https://iys-storage.s3.us-east-2.amazonaws.com/User_Instructions_for_Video-Recoded_Dialogue_with_Dialogue_Partner.pdf",
          linkDescription:
            "User Instructions for Video-Recoded Dialogue with Dialogue Partner.pdf",
        },
        {
          instruction: `Open or download the pdf worksheet called `,
          instructionName: `Video-Analysis Task of your Video-Recorded Dialogue`,
          link:
            "https://iys-storage.s3.us-east-2.amazonaws.com/Video_Analysis_Task_of_Your_Video-Recorded_Dialogue.pdf",
          linkDescription:
            "Video-Analysis Task of your Video-Recorded Dialogue.pdf",
        },
      ],
      stepShown: false,
    },
    {
      title: `Step 8: Hand calculate your perceptual accuracy score (10 to 15 minutes)`,
      description: `To provide instructions on how to hand
      calculate your perceptual accuracy score.`,
      download: [
        {
          instruction: `Open or download the pdf worksheet called `,
          instructionName: `Hand Calculate Your Perceptual Accuracy Score`,
          link:
            "https://iys-storage.s3.us-east-2.amazonaws.com/Hand_Calculate_Your_Perceptual_Accuracy_Score.pdf",
          linkDescription: "Hand Calculate Your Perceptual Accuracy Score.pdf",
        },
      ],
      stepShown: false,
    },
  ]);

  // if title is clicked change stepShown to true -> acts like toggle
  const ToggleInstruction = (titleName) => {
    const newInstructions = instructionSteps.map((step) => {
      return {
        title: step.title,
        description: step.description,
        download: step.download,
        stepShown: step.title === titleName ? !step.stepShown : step.stepShown,
      };
    });

    setInstructionSteps(newInstructions);
  };

  // maps the instruction steps
  const instructions = instructionSteps.map((step, index) => {
    return (
      <div key={index}>
        <ContentDescription
          title="true"
          onClick={() => ToggleInstruction(step.title)}
        >
          {step.stepShown ? (
            <i className="fas fa-sort-up"></i>
          ) : (
            <i className="fas fa-sort-down"></i>
          )}
          {step.title}
        </ContentDescription>
        {step.stepShown && (
          <div>
            <ContentDescription>
              <strong>Purpose</strong> - {step.description}
            </ContentDescription>
            {step.download.map((FileDl, index) => {
              return (
                <div key={index}>
                  <ContentParagraph>
                    {FileDl.instruction}
                    <strong>{FileDl.instructionName}</strong>:
                  </ContentParagraph>
                  <FileDownload
                    link={FileDl.link}
                    description={FileDl.linkDescription}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  });

  return (
    <ContentContainer>
      <ContentDescription>
        Based on our{" "}
        <HashLink smooth to="/AboutUS#research">
          research
        </HashLink>
        , we recommend that you take the following eight steps or choose to watch the video to build
        perspective-taking skills:
      </ContentDescription>
      <div className="player-wrapper">
      <ReactPlayer className="react-player"  
      width="75%"
      height="100%" url="https://iys-storage.s3.us-east-2.amazonaws.com/IYS+explanation.mp4" controls="true"/>
      </div>
      {instructions}
    </ContentContainer>
  );
}

export function Content2(props) {
  return (
    <ContentContainer>
      <ContentDescription>
        As a guest, operating the site will offer little access to the
        application's services. In order to access In Your Shoes' basic
        functions, you first must sign up and log in a new account on the
        website.
      </ContentDescription>
      <ContentDescription>
        To access the application's full functionality, you must log in to your
        account by clicking the "Log In" button near the top of the screen:
      </ContentDescription>
      <WideImage src={Img1} alt="loginNav" />
      <ContentDescription>
        In the small window that pops up after pressing the "Log In" tab, you
        can either log in using an existing account, or sign up by pressing the
        "Sign Up" button:
      </ContentDescription>
      <WideImage src={Img2} alt="loginModal" />
      <ContentDescription>
        When the small window changes to the sign up window, you can now enter
        the following information to make an account.
      </ContentDescription>
      <ol>
        <li>First Name - Your first name.</li>
        <li>Last Name - Your last name.</li>
        <li>Organization - The organization you belong to.</li>
        <li>Email - Your preferred email.</li>
        <li>Password - Your account password. </li>
      </ol>
      <h4>
        NOTE: Please use at least 8 characters (minimum one number, special
        character[!@#$%^&*], and capital letter) for your password.
      </h4>
      <WideImage src={Img3} alt="signUpModal" />
    </ContentContainer>
  );
}

export function Content3(props) {
  return (
    <ContentContainer>
      <ContentDescription>
        After sign in, to view what the application is capable of and its
        features, click on the "User Hub" tab that will appear near at the top
        of the screen:
      </ContentDescription>
      <WideImage src={Img4} alt="userHubNav" />
      <ContentDescription>
        After clicking the tab, You will find yourself in the User Hub page
        where you can access the website's main features.
      </ContentDescription>
      <WideImage src={Img5} alt="userHubPage" />
      <ContentDescription>
        In this page, you will find yourself looking at 4 different modules that
        you will be using for most of your time here. These 4 modules are:
      </ContentDescription>
      <ol>
        <li>User Profile</li>
        <li>Upload a Video</li>
        <li>Your Videos</li>
        <li>Statistics (Unimplemented)</li>
      </ol>
    </ContentContainer>
  );
}

export function Content4(props) {
  return (
    <ContentContainer>
      <ContentDescription>
        In the User Profile page, this is where you can edit your personal
        information.
      </ContentDescription>
      <WideImage src={Img6} alt="ProfilePage" />
      <h4>
        NOTE: Please use at least 8 characters (minimum one number, special
        character[!@#$%^&*], and capital letter) for your password.
      </h4>
    </ContentContainer>
  );
}

export function Content5(props) {
  return (
    <ContentContainer>
      <ContentDescription>
        After clicking the "Upload a Video" button, this is where you can upload
        your video to begin tagging it. You must include a title before
        uploading the video and the video must be an ".mp4" file.
      </ContentDescription>
      <WideImage src={Img7} alt="uploadVideoPage" />
      <ContentDescription>
        After uploading the video, it will be available for tagging right away
        in the "My Videos" tab. In the untagged section, clicking on the title
        of a video of your choice allows you to tag the video.
      </ContentDescription>
      <h4>View your videos</h4>
      <ContentDescription>
        To view all the videos that you have uploaded so far in the website, you
        can view them all in the hub for quick access. To view them all in one
        page, You must click on the "Videos" button inside the module.
      </ContentDescription>
      <WideImage src={Img8} alt="allVideosPage" />
    </ContentContainer>
  );
}

export function Content6(props) {
  return (
    <ContentContainer>
      <ContentDescription>
        <Anchur
          href="#/"
          className="link"
          onClick={() => {
            window.open(
              "https://www.digitaltrends.com/computing/how-to-convert-mov-to-mp4/",
              "_blank"
            );
          }}
        >
          Click the link to convert the videos.
        </Anchur>
      </ContentDescription>
    </ContentContainer>
  );
}
