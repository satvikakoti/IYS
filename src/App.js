import "./App.css";
import React from "react";
import { Homepage } from "./containers/homepage/homepage.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { TrainingPortalNew } from "./containers/trainingPortalNew/trainingPortal";
import { AboutPage } from "./containers/aboutpage/aboutpage";
import { UserHub } from "./containers/UserHub/UserHub";
import { Pricing } from "./containers/pricingpage/Pricing";
import { ResetPassword } from "./containers/User/PasswordReset";
import { EmailVerify } from "./containers/User/EmailVerify";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/Home" component={Homepage} />
        <Route path="/TrainingPortal" component={TrainingPortalNew} />
        <Route path="/AboutUs" component={AboutPage} />
        <Route path="/Pricing" component={Pricing} />
        <Route path="/UserHub" component={UserHub} />
        <Route
          exact
          path="/Reset-password/:verificationToken"
          component={ResetPassword}
        />
        <Route
          exact
          path="/Email-verification/:emailToken"
          component={EmailVerify}
        />
      </Switch>
    </Router>
  );
}

export default App;
