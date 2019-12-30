import * as React from "react";
import {inject, observer} from "mobx-react";
import {ErrorDisplay} from "./page/ErrorDisplay";
import {Route, withRouter} from "react-router";
import {SignUp} from "./page/SignUp";
import {Welcome} from "./page/Welcome";
import {StatusUpdate} from "./page/StatusUpdate";
import {validatedComponent} from "./component/KeyVerification";
import {Turnout} from "./page/Turnout";
import {ResentEmail} from "./page/ResentEmail";

import {ProfilePage} from "./page/Profile";
import {Unsubscribed} from "./page/Unsubscribed";
import {Admin} from "./page/Admin";
import {Link} from "react-router-dom";

export class ProfileLink extends React.Component<{verificationKey: string}, any> {
    render() {
        return <Link to={"/profile/"+this.props.verificationKey}>{this.props.children}</Link>
    }
}

class _App extends React.Component<any, any> {
    render() {
        if (this.props.controller.error) {
            console.log("CONTROLLER IN ERROR - SHOW ERROR DISPLAY");
            return <ErrorDisplay/>
        }
        return (
            <div>
                <Route exact path="/" component={SignUp}/>
                <Route path="/admin/:key" component={validatedComponent(Admin)}/>
                <Route path="/resentEmail" component={ResentEmail}/>

                <Route path="/welcome/:key" component={validatedComponent(Welcome)}/>
                <Route path="/profile/:key" component={validatedComponent(ProfilePage)}/>
                <Route path="/status/:key/:option" component={validatedComponent(StatusUpdate)}/>
                <Route path="/confirmed/:key" component={validatedComponent(Turnout)}/>
                <Route path="/unsubscribed" component={Unsubscribed}/>
            </div>
        );
    }
}
// Note order of annotations is important!
// @inject("controller")
// @withRouter
// @observer
export const App=inject("controller")(withRouter(observer(_App)));