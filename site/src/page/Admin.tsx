import * as React from "react";
import {VerifiedComponentProps} from "../component/KeyVerification";
import {ScaleLoader} from "react-spinners";
import {observer} from "mobx-react";
import {ProfileLink} from "../App";

type AdminState = { emailText: string, allUsers: boolean };

@observer
export class Admin extends React.Component<VerifiedComponentProps, AdminState> {
    state: AdminState = {
        emailText: "",
        allUsers: false
    };

    sendRollUsers() {
        return this.props.controller.rollUsers();
    }

    sendBeginWeekEmail() {
        return this.props.controller.sendBeginWeekEmail();
    }

    sendReminderEmail() {
        return this.props.controller.sendReminderEmail();
    }

    sendFinalEmail() {
        return this.props.controller.sendFinalEmail();
    }

    handleEmailTextChange(e: any) {
        this.setState({
            emailText: e.target.value
        })
    }

    updateAllUsersFlag() {
        this.setState({
            allUsers: !this.state.allUsers
        })
    }

    sendCustomEmail() {
        return this.props.controller.sendCustomEmail(this.state.emailText, this.state.allUsers);
    }

    render() {
        const sendBeginWeekEmail = this.sendBeginWeekEmail.bind(this);
        const sendReminderEmail = this.sendReminderEmail.bind(this);
        const sendFinalEmail = this.sendFinalEmail.bind(this);

        return (<div>
            <p className="App-intro">Welcome to admin</p>

            <form className="pure-form pure-form-stacked">
                <fieldset>
                    <legend>Send a message to all subscribers (not formatted)</legend>
                    <textarea className="App-email-message" value={this.state.emailText} onChange={(e) => this.handleEmailTextChange(e)}
                              rows={10}>
                    </textarea>
                    {
                        this.props.controller.busy || <div className="pure-control-group">
                            <button type="button" onClick={() => this.sendCustomEmail()} className="pure-button pure-button-primary">Send
                            </button>
                            <input type="checkbox" name="allUsers" onClick={() => this.updateAllUsersFlag()} checked={this.state.allUsers}/> Include opted out users
                        </div>
                    }
                </fieldset>

                <fieldset>
                    <legend>Manually send weekly emails</legend>
                    {
                        this.props.controller.busy ?
                        <ScaleLoader color={'blue'} height={12} loading={true}/>
                        :
                        <div className="pure-control-group App-evenbuttons">
                            <button type="button" onClick={() => this.sendRollUsers()} className="pure-button pure-button-primary">Roll
                                Users
                            </button>
                            <button type="button" onClick={sendBeginWeekEmail} className="pure-button pure-button-primary">Begin Week
                            </button>
                            <button type="button" onClick={sendReminderEmail} className="pure-button pure-button-primary">Reminder</button>
                            <button type="button" onClick={sendFinalEmail} className="pure-button pure-button-primary">Final</button>
                        </div>
                    }
                </fieldset>
            </form>
            <p><ProfileLink verificationKey={this.props.controller.verified.profile!.verificationKey}>Back to safety...</ProfileLink></p>
        </div>)
    }
}