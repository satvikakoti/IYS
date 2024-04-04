import React from "react";
import styled from "styled-components"

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #F6F6F6;
  width: 90%;
  padding: 3rem;
  border-radius: 1rem;
  margin: 10px 0px;

  @media only screen and (max-width: 812px) {
    width: 100%;
    padding: 1rem;
    border-radius: 0.5rem
  }
`;

const CardImage = styled.img` 
  height: 400px;
  width: 90%;
  
  @media only screen and (max-width: 812px) {
    height: auto;
    width: 100%;
  }
`;

const CardText = styled.p`
  color: #686868;
`;

export function StepCard (props) {
    return (
        <Card>
            <CardImage src={props.image}></CardImage>
            <CardText>{props.text}</CardText>
        </Card>
    )
}