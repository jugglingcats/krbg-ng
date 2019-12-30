import * as React from "react";
import {inject} from "mobx-react";
import {Link} from "react-router-dom";

@inject("controller")
export class ErrorDisplay extends React.Component<any, any> {
    render() {
        return (
            <div>
                <p className="App-intro">Oh dear something went wrong!</p>
                <p>You can try refreshing, otherwise please try again later.</p>
                <p>If you unsubscribed, links you were sent in email will no longer work. You should <Link to="/">subscribe again</Link>.</p>
                <pre>
                    {this.props.controller.errorText}
                </pre>
            </div>
        )
    }
}