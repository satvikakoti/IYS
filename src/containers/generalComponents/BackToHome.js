import React from "react";
import "../css/BackToHome.css";

export const BackToHome = () => {
    return (
        <a className="BackToHome" href="/UserHub/">
          <i className="fas fa-arrow-left" />
          {/* <h2 style={{marginLeft: "10px"}}>Back to Home</h2> */}
        </a>
    );
}