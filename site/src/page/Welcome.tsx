import * as React from "react";
import {VerifiedComponentProps} from "../component/KeyVerification";
import {ProfileLink} from "../App";

export class Welcome extends React.Component<VerifiedComponentProps> {
    render() {
        return (<div>
            <p className="App-intro">
                You've been subscribed to Kensal Rise Backgammon!
            </p>
            <p>
                We've sent you a welcome email to the email address you provided. Use the link in the email to
                manage your settings or unsubscribe.
            </p>
            <p>
                Or go straight to your <ProfileLink verificationKey={this.props.match.params.key}>Profile</ProfileLink>
            </p>
        </div>)
    }
}