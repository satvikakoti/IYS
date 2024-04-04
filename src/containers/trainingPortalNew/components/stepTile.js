import React from "react"
import styled from "styled-components";

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0px;
`;

const TileHeader = styled.div`
  display: flex;
  align-items: center;
  flex-flow: row wrap;

  @media only screen and (max-width: 812px) {
    flex-direction: column;
    align-items: start;
  }
`;

const TileNumber = styled.div`
  background-color: #F3890D;
  font-weight: bold;
  color: white;
  padding: 7px 10px;
  text-transform: uppercase;
  border-radius: 10px;
`;

const Heading = styled.h4`
  margin: 0px 10px;
  font-weight: bold;

  @media only screen and (max-width: 812px) {
    margin: 5px 0px;  
    font-size: 1.3rem;
  }
`;

const TimeText = styled.h6`
  color: grey;
  font-size: 1rem;
  margin: auto 0px;
`;

const Content = styled.p`
  color: black;
  font-size: 1rem;
  padding: 0px;
  margin-bottom: 0;
`;

const PDFText = styled.p`
  color: grey;
  font-size: 0.8rem;
  margin-bottom: 5px;
`;

const PDFArea = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const PDFBox = styled.div`
  background-color: white;
  border: 0.5px solid #DEDEDE;
  border-radius: 4px;
  min-width: 15%;
  max-width: fit-content;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
  margin: 5px 5px 0px 0px;

  @media only screen and (max-width: 812px) {
    height: fit-content;
    padding: 5px 5px;
  }
`;

const PDFIcon = styled.div`
  background-color: #DEDEDE;
  padding: 7px;
  border-radius: 5px;
  font-size: 0.6rem;
  margin: 0px 2px 0px 0px;
  color: grey;
`;

const PDFLink = styled.a`
  color: grey;

  &:hover {
      color: black;
      text-decoration: none;
  }
`;

export function StepTile (props) {
    return (
        <Tile>
            <TileHeader>
                <TileNumber>Step {props.number}</TileNumber>
                <Heading>{props.title}</Heading>
                <TimeText>{props.time}</TimeText>
            </TileHeader>
            <Content>{props.content}</Content>
            <PDFText>Open/download the pdf worksheet here</PDFText>
            <PDFArea>
            {
                props.pdfName.map((pdf, index) => {
                    return (
                        <PDFBox>
                            <PDFIcon>PDF</PDFIcon>
                            <PDFLink style={{ margin: "auto 4px" }} href={props.pdfLink[index]}>{pdf}</PDFLink>
                            <PDFLink style={{ margin: "auto 4px" }} href={props.pdfLink[index]} download><i class="fas fa-download"></i></PDFLink>
                        </PDFBox>
                    ) 
                })
            }
            </PDFArea>
        </Tile>
    )
}