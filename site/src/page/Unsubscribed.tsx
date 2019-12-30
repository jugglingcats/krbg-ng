import * as React from "react";
import {Link} from "react-router-dom";

export class Unsubscribed extends React.Component {
    render() {
        return (<div>
            <p className="App-intro">You've been unsubscribed</p>
            <p>You'll no longer receive emails from us.</p>
            <p>If you want to subscribe again at any point just <Link to="/">use the form on our homepage</Link>.</p>
            <p>Note that if you bookmarked your profile page or added it to your homescreen, these links will no longer work.</p>
        </div>)
    }
}