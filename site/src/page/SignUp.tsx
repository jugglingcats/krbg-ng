import * as React from 'react';
import {withRouter} from "react-router-dom";
import {ScaleLoader} from 'react-spinners';
import {RouteComponentProps} from "react-router";
import {ControllerProps} from "../AppController";
import {inject} from "mobx-react";

const Recaptcha = require("react-recaptcha");

export type AppState = {
    username?: string,
    surname?: string,
    email?: string,
    recaptcha?: string,
    requestEmail?: boolean;
    emailExists: boolean,
    emailResendToken?: string
};

class _SignUp extends React.Component<ControllerProps & RouteComponentProps<any>, AppState> {
    state: AppState = {
        username: "",
        email: "",
        surname: "",
        emailExists: false
    };

    signUp() {
        this.setState({
            emailExists: false
        });
        this.props.controller.signup({
            username: this.state.username!,
            surname: this.state.surname,
            email: this.state.email!,
            recaptcha: this.state.recaptcha!
        }).then(r => {
            if (r.exists) {
                this.setState({
                    emailExists: true,
                    emailResendToken: r.token
                })
            } else {
                return this.props.history.push("/welcome/" + r.profile!.verificationKey);
            }
        })
    }

    resendEmail() {
        this.setState({
            requestEmail: true
        });
        this.props.controller.requestEmail({
            email: this.state.email,
            token: this.state.emailResendToken
        }).then(() => {
            return this.props.history.push("/resentEmail");
        })
    }

    updateUsername(e: any) {
        this.setState({
            username: e.target.value as string
        });
    }

    updateSurname(e: any) {
        this.setState({
            surname: e.target.value as string
        });
    }

    updateEmail(e: any) {
        this.setState({
            emailExists: false,
            email: e.target.value as string,
        });
    }

    verifyCallback(e: string) {
        this.setState({recaptcha: e});
    }

    render() {
        const updateUsername = this.updateUsername.bind(this);
        const updateEmail = this.updateEmail.bind(this);
        const resendEmail = this.resendEmail.bind(this);
        const signUp = this.signUp.bind(this);
        const verifyCallback = this.verifyCallback.bind(this);
        const callback = () => {
        };

        return (
            <div>
                <p className="App-intro">
                    Welcome to Kensal Rise Backgammon
                </p>
                <p>
                    The club used to meet weekly but is now meeting about once a month for an informal tournament evening.
                </p>
                <p>
                    To register your interest please enter your name and email below. We'll send you information about any upcoming events.
                </p>
                <form className="pure-form pure-form-stacked">
                    <fieldset>
                        <legend>Sign up to Kensal Rise Backgammon</legend>

                        <label htmlFor="username">First Name</label>
                        <input id="username" type="text" placeholder="Enter your name" required
                               onChange={updateUsername} value={this.state.username}/>

                        <label htmlFor="surname">Surname (optional)</label>
                        <input id="surname" type="text" placeholder="Surname or first initial"
                               onChange={(e) => this.updateSurname(e)} value={this.state.surname}/>

                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="Enter your email"
                               onChange={updateEmail} value={this.state.email}/>

                        {
                            this.state.emailExists && <div className="Error">
                                This email is already registered. Enter a different email or&nbsp;
                                <a href='#' onClick={resendEmail}>request an email</a> you can then use to manage your profile.
                            </div>
                        }

                        {this.state.requestEmail || <div className="Recaptcha">
                            <Recaptcha render="explicit" onloadCallback={callback} verifyCallback={verifyCallback}
                                       sitekey="6LeVoTMUAAAAAEsZ1Pr5kaTV-18vSfm1jsB04nbQ"/>
                        </div>}


                        <button type="button" className="pure-button pure-button-primary" onClick={signUp}
                                disabled={this.state.email === undefined || this.state.recaptcha === undefined}>
                            {
                                this.props.controller.busy &&
                                <ScaleLoader color={'white'} height={12} loading={true}/>
                            }
                            {
                                this.props.controller.busy ||
                                <span>Sign Up!</span>
                            }
                        </button>
                    </fieldset>
                </form>
            </div>
        );
    }
}

export const SignUp=inject("controller")(withRouter(_SignUp));