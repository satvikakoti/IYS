/*
 * Register.js: Component that is responsible for user creation and validation
 *
 * Michelle Peters, Lawrence Valerio, Symon Kurt San Jose
 * Updated: Prachotan Reddy Bathi
 *
 * Date Created: 10/27/2020
 * Last Updated: 8/04/2021
 */

import React from "react";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";
import styled from "styled-components";
import { Button } from "./button";
import { CaptchaTest } from "./Captcha";
import "./Register.css";

const emailRegex = RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

//Positioning the first and last name inputs.
const FullNameContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  @media screen and (max-width: 456px) {
    width: 90%;
  }
`;

//Aligning inputs to the center.
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;

  min-width: 300px;
  width: 100%;
  max-width: 448px;
  flex-wrap: wrap;
`;

//Styling the title
const Title = styled.h1`
  color: #2f2f2f;
  margin: 0px;
`;

//Styling first and last name inputs
const NameInput = styled.input`
  width: 100% !important;
  height: 30px;
  margin-bottom: 10px;

  @media screen and (max-width: 456px) {
    width: 100% !important;
  }
`;

//Styling all other inputs
const Input = styled.input`
  width: 100%;
  height: 30px;
`;

const ButtonStyling = styled(Button)`
  width: 100%;
`;

const ErrorMessage = styled.div`
  color: red;
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
`;

const passwordRegex = RegExp(
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
);

class Register extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies),
  };

  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      organization: "",
      username: "",
      password: "",
      password_confirm: "",
      formErrors: {
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        password_confirm: "",
      },
      isValid: true,
      submitted: false,
      duplicateEmail: false,
      captchaMatch: false,
      matchMessage: "",
      loading: false,
      signUpSuccess: false,
    };
  }

  /**
   * setCaptchaMatch and setMatchMessage are functions to be passed
   * to CaptchaTest
   *
   * Symon Kurt San Jose
   */
  setCaptchaMatch = (captchaMatchF) => {
    this.setState({ captchaMatch: captchaMatchF });
  };
  setMatchMessage = (matchMessageF) => {
    this.setState({ matchMessage: matchMessageF });
  };

  /**
   * Sets the state of sign up cookie data exists
   *
   * Symon Kurt San Jose
   */
  componentDidMount() {
    const { cookies } = this.props;
    let storedState = cookies.get("StateEverything");

    if (storedState) {
      this.setState({
        first_name: storedState.first_name,
        last_name: storedState.last_name,
        organization: storedState.organization,
        username: storedState.username,
      });
    }
  }

  /**
   * Sets the state of sign up cookie data exists
   *
   * Symon Kurt San Jose
   */
  componentWillUnmount() {
    let { cookies } = this.props;

    cookies.set(
      "StateEverything",
      {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
//        organization: this.state.organization,
        username: this.state.username,
      },
      { maxAge: 180 }
    );
  }

  /**
   * Checks for any errors in the users
   * inputs
   *
   * Michelle Peter
   */
  validate = () => {
    let inputs = { ...this.state };
    this.setState((state) => {
      state.isValid = true;
    });

    // Sets state as invalid if any form errors occur
    Object.values(this.state.formErrors).forEach((val) => {
      if (val.length > 0) {
        this.setState((state) => {
          state.isValid = false;
        });
      }
    });

    // Sets state as invalid if any inputs are empty
    if (
      inputs.first_name === "" ||
      inputs.last_name === "" ||
//      inputs.organization === "" ||
      inputs.username === "" ||
      inputs.password === "" ||
      inputs.password_confirm === ""
    ) {
      this.setState((state) => {
        state.isValid = false;
      });
    }
  };

  /**
   * Set values on change and set form errors
   *
   * Michelle Peters
   */
  change = (e) => {
    // Sets form input states when values are changed
    this.setState({
      [e.target.name]: e.target.value,
    });

    let formErrors = { ...this.state.formErrors };

    // Checks for and sets form errors
    switch (e.target.name) {
      case "username":
        formErrors.username = emailRegex.test(e.target.value)
          ? ""
          : "Please enter a valid email address";
        break;
      case "password":
        formErrors.password = passwordRegex.test(e.target.value)
          ? ""
          : "Please use at least 8 characters (minimum one number, special character[!@#$%^&*], and capital letter)";
        break;
      case "password_confirm":
        formErrors.password_confirm =
          this.state.password === e.target.value ? "" : "Passwords must match";
        break;
      default:
        break;
    }

    // Sets form errors
    this.setState({ formErrors, [e.target.name]: e.target.value });
  };

  /**
   * Attempt to add new account to database if inputs are valid
   *
   * Michelle Peters
   */
  onSubmit = (e) => {
    e.preventDefault();
    this.validate();
    this.setState({ submitted: true, loading: true });
    // attempt to post to server using user inputted credentials
    if (this.state.isValid && this.state.captchaMatch) {
    console.log(JSON.stringify(this.state))
      fetch(`${process.env.REACT_APP_API_URL}/IYS/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state),
      })
//        .then((data)=>data.json())
        .then((data) => {
           console.log('Hey'+this.state.organization+','+data.ok);
          if (!data.ok) {
//            console.log(data.status);
            this.setState({ duplicateEmail: true });
          } else {
            data.json();
            this.setState({ duplicateEmail: false, signUpSuccess: true });
          }
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.error(error);
        });
    } else {
      if (!this.state.captchaMatch) {
        this.setMatchMessage("Please verify your captcha.");
      }
      this.setState({ duplicateEmail: true, loading: false });
    }
  };

  /**
   * Return sign up inputs
   */
  render() {
    return (
      <FormContainer noValidate>
        <Title>Sign Up</Title>
        {this.state.loading ? (
          <div
            className="SpinnerLoadingContainer"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div className="spinner-border" />
            <p>Signing up please wait...</p>
          </div>
        ) : (
          <>
            {this.state.signUpSuccess ? (
              <p>
                Your account has been successfully created. Please look at your
                email inbox to verify your account.
              </p>
            ) : (
              <>
                <p className="Subtext">Please fill in <span style={{color:"red"}}>all</span> the fields below</p>
                <FullNameContainer>
                  <NameContainer>
                    {this.state.submitted && this.state.first_name === "" ? (
                      <ErrorMessage>Please enter your first name</ErrorMessage>
                    ) : (
                      ""
                    )}
                    <NameInput
                      name="first_name"
                      placeholder="First Name*"
                      value={this.state.first_name}
                      noValidate
                      onChange={this.change}
                    />
                  </NameContainer>
                  <NameContainer>
                    {this.state.submitted && this.state.last_name === "" ? (
                      <ErrorMessage>Please enter your last name</ErrorMessage>
                    ) : (
                      ""
                    )}
                    <NameInput
                      name="last_name"
                      placeholder="Last Name*"
                      value={this.state.last_name}
                      noValidate
                      onChange={this.change}
                    />
                  </NameContainer>
                </FullNameContainer>
                {/*this.state.submitted && this.state.organization === "" ? (
                  <ErrorMessage>Please enter your organization</ErrorMessage>
                ) : (
                  ""
                )}*/}
                <div className="InputFields">
                  <Input
                    name="organization"
                    placeholder="Organization*"
                    value={this.state.organization}
                    onChange={this.change}

                  />
                  {this.state.submitted && this.state.username === "" ? (
                    <ErrorMessage>Please enter your email</ErrorMessage>
                  ) : (
                    ""
                  )}
                </div>
                <div className="InputFields">
                  <Input
                    name="username"
                    type="email"
                    placeholder="Email*"
                    value={this.state.username}
                    noValidate
                    onChange={this.change}
                  />
                  {this.state.formErrors.username.length > 0 && (
                    <p className="SignUpErrorMessage">
                      {this.state.formErrors.username}
                    </p>
                  )}
                  {this.state.submitted && this.state.password === "" ? (
                    <ErrorMessage>Please enter your password</ErrorMessage>
                  ) : (
                    ""
                  )}
                </div>
                <div className="InputFields">
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    noValidate
                    onChange={this.change}
                  />
                  {this.state.formErrors.password.length > 0 && (
                    <p className="SignUpErrorMessage">
                      {this.state.formErrors.password}
                    </p>
                  )}
                  {this.state.submitted &&
                  this.state.password_confirm === "" ? (
                    <ErrorMessage>Please confirm your password</ErrorMessage>
                  ) : (
                    ""
                  )}
                </div>
                <div className="InputFields">
                  <Input
                    name="password_confirm"
                    type="password"
                    placeholder="Re-enter Password"
                    value={this.state.password_confirm}
                    noValidate
                    onChange={this.change}
                  />
                  {this.state.formErrors.password_confirm.length > 0 && (
                    <p className="SignUpErrorMessage">
                      {this.state.formErrors.password_confirm}
                    </p>
                  )}
                  {this.state.submitted && !this.state.isValid ? (
                    <ErrorMessage>
                      Please enter valid data for all fields
                    </ErrorMessage>
                  ) : (
                    ""
                  )}
                </div>
                {!this.state.captchaMatch ? (
                  <CaptchaTest
                    setCaptchaMatch={this.setCaptchaMatch.bind(this)}
                    captchaMatch={this.state.captchaMatch}
                    setMatchMessage={this.setMatchMessage.bind(this)}
                    matchMessage={this.state.matchMessage}
                  />
                ) : (
                  <p style={{ color: "green" }}>Captcha verified</p>
                )}
                <ButtonStyling
                  className="form-button"
                  onClick={(e) => this.onSubmit(e)}
                  OtherPages
                >
                  Sign Up
                </ButtonStyling>
                {this.state.submitted && this.state.duplicateEmail ? (
                  <div className="errorMessage">
                    This email has already been taken
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
          </>
        )}
      </FormContainer>
    );
  }
}

export default withCookies(Register);
