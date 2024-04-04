/**
 * Captcha.js: The captcha component used for the register modal window.
 * 
 * Kim Le, Symon Kurt San Jose
 * 
 * Date Created: 04/01/2021
 * Last Updated: 04/12/2021
 */
import React from 'react';
import "./captcha.css";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
export class CaptchaTest extends React.Component {

    constructor(props) {
        super(props);
    }

    doSubmit = (e) => {
        e.preventDefault();

        let user_captcha = document.getElementById('user_captcha_input').value;
        if (validateCaptcha(user_captcha)===true) {
            this.props.setCaptchaMatch(true);
            document.getElementById('user_captcha_input').value = "";
        }
        else {
            this.props.setCaptchaMatch(false);
            this.props.setMatchMessage("Failed to verify. Please verify captcha again.");
           document.getElementById('user_captcha_input').value = "";
        }
    };

    componentDidMount() {
        loadCaptchaEnginge(6);
    }
 
    render(){
        return (
            <div className="catpchaContainer">
                <div className="col mt-3">
                    <LoadCanvasTemplate />
                    <input placeholder="Enter Captcha Value"
                        id="user_captcha_input"
                        name="user_captcha_input"
                        type="text"
                        onChange={() => this.props.setMatchMessage("")}/>
                    <p style={{color: "red", margin: "10px 0px"}}>{this.props.matchMessage}</p>
                    <button className="btn btn-primary" onClick={this.doSubmit}>Submit</button>
                </div>
            </div>
        );
    }
}
